/**
 * Server-only run processor shared by POST /api/runs (via `after()`),
 * POST /api/runs/[runId]/worker and POST /api/runs/[runId]/retry.
 *
 * - Claims the run atomically (queued|failed → running) so concurrent kicks
 *   never double-execute.
 * - Accumulates progress (never overwrites) and persists every step to
 *   ppal_run_events.
 * - Loads the owner's suppressions + prior leads for guardrails and the
 *   owner's Composio connections for BYOK/dual enrichment.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { TABLES } from "@/lib/db/tables";
import {
  executeComposioAction,
  getConnectionStatuses,
  isComposioConfigured,
} from "@/lib/composio";
import { executeProspectingRun, type RunnerProgress } from "./runner";
import {
  createComposioProviders,
  ENRICHMENT_APPS,
  type EnrichmentProvider,
} from "./enrichment";
import { buildGuardIndex, type PriorLeadRef } from "./guardrails";
import type { EnrichmentMode, RunEvent, Suppression } from "./types";

export interface ProcessRunResult {
  status: "completed" | "failed" | "skipped" | "not_found";
  run?: Record<string, unknown> | null;
  lead_count?: number;
  validation_ok?: boolean;
  error?: string;
}

async function loadProviders(
  mode: EnrichmentMode,
  userId: string | null
): Promise<{ providers: EnrichmentProvider[]; note?: string }> {
  if (mode === "free") return { providers: [] };
  if (!userId) return { providers: [], note: "no_run_owner_for_byok" };
  if (!isComposioConfigured()) return { providers: [], note: "composio_not_configured" };
  const statuses = await getConnectionStatuses(userId);
  const connected = statuses
    .filter((s) => s.connected && (ENRICHMENT_APPS as string[]).includes(s.appId))
    .map((s) => s.appId);
  return { providers: createComposioProviders(userId, connected, executeComposioAction) };
}

async function loadGuard(
  supabase: SupabaseClient,
  run: { id: string; created_by?: string | null; workspace_id?: string | null }
) {
  const ownerFilter = [
    run.created_by ? `created_by.eq.${run.created_by}` : null,
    run.workspace_id ? `workspace_id.eq.${run.workspace_id}` : null,
  ]
    .filter(Boolean)
    .join(",");
  if (!ownerFilter) return { suppressions: [] as Suppression[], prior: [] as PriorLeadRef[], warnings: ["no_owner_for_guard"] };

  const warnings: string[] = [];
  const supFilter = [
    run.created_by ? `user_id.eq.${run.created_by}` : null,
    run.workspace_id ? `workspace_id.eq.${run.workspace_id}` : null,
  ]
    .filter(Boolean)
    .join(",");
  const { data: sup, error: supErr } = await supabase
    .from(TABLES.suppressions)
    .select("kind, value, reason")
    .or(supFilter)
    .limit(5000);
  if (supErr) warnings.push(`suppressions_unavailable: ${supErr.message}`);

  const { data: prior, error: priorErr } = await supabase
    .from(TABLES.leads)
    .select("id, email, domain, run_id, contact_name")
    .or(ownerFilter)
    .order("created_at", { ascending: false })
    .limit(5000);
  if (priorErr) warnings.push(`prior_leads_unavailable: ${priorErr.message}`);

  return {
    suppressions: (sup || []) as Suppression[],
    prior: (prior || []) as PriorLeadRef[],
    warnings,
  };
}

export async function processRun(
  supabase: SupabaseClient,
  runId: string
): Promise<ProcessRunResult> {
  // Atomic claim: only queued runs transition to running.
  const { data: claimed, error: claimErr } = await supabase
    .from(TABLES.runs)
    .update({
      status: "running",
      started_at: new Date().toISOString(),
      current_step: "plan",
      error: null,
      progress: [],
    })
    .eq("id", runId)
    .eq("status", "queued")
    .select("*")
    .maybeSingle();

  if (claimErr) return { status: "failed", error: claimErr.message };
  if (!claimed) {
    const { data: existing } = await supabase.from(TABLES.runs).select("*").eq("id", runId).maybeSingle();
    if (!existing) return { status: "not_found" };
    return { status: "skipped", run: existing };
  }
  const run = claimed as {
    id: string;
    brief: string;
    plan?: Record<string, unknown> | null;
    enrichment_mode?: EnrichmentMode;
    workspace_id?: string | null;
    created_by?: string | null;
  };

  const persistEvent = async (e: RunEvent) => {
    const { error } = await supabase.from(TABLES.runEvents).insert({
      run_id: runId,
      step: e.step,
      level: e.level,
      message: e.message,
      meta: e.meta,
      started_at: e.started_at,
      finished_at: e.finished_at,
      duration_ms: e.duration_ms,
      error: e.error,
    });
    if (error) console.warn("[worker] run event insert", error.message);
  };

  try {
    const mode = (run.enrichment_mode || "free") as EnrichmentMode;
    const [{ providers, note }, guardData] = await Promise.all([
      loadProviders(mode, run.created_by ?? null),
      loadGuard(supabase, run),
    ]);
    const guard = buildGuardIndex(guardData.suppressions, guardData.prior, runId);

    const result = await executeProspectingRun(
      {
        brief: run.brief,
        plan: (run.plan as never) || undefined,
        enrichment_mode: mode,
        workspace_id: run.workspace_id || undefined,
      },
      {
        runId,
        onEvent: persistEvent,
        onProgress: async (p: RunnerProgress, all: RunnerProgress[]) => {
          await supabase
            .from(TABLES.runs)
            .update({ current_step: p.step, progress: all })
            .eq("id", runId);
        },
        deps: { providers, guard },
      }
    );

    const extraNotes = [...guardData.warnings, ...(note ? [`enrichment: ${note}`] : [])];

    if (result.leads.length > 0) {
      const rows = result.leads.map((l) => ({
        id: l.id,
        run_id: runId,
        workspace_id: run.workspace_id ?? null,
        created_by: run.created_by ?? null,
        company: l.company,
        domain: l.domain,
        name: l.contact_name,
        contact_name: l.contact_name,
        title: l.title,
        email: l.email,
        email_status: l.verification_status,
        icp_score: l.icp_score,
        status: l.status,
        signal: l.signal,
        signal_event_date: l.signal_event_date,
        source_urls: l.source_urls,
        provenance: l.provenance,
        dns_status: l.dns_status,
        verification_status: l.verification_status,
        disposition: l.disposition,
        score_breakdown: l.score_breakdown,
        tier: l.tier,
        blockers: l.blockers,
        profile_url: l.profile_url,
        enrichment: l.enrichment ?? null,
      }));
      const { error: leadErr } = await supabase.from(TABLES.leads).upsert(rows);
      if (leadErr) throw new Error(`lead_persist_failed: ${leadErr.message}`);
    }

    const { data: updated } = await supabase
      .from(TABLES.runs)
      .update({
        status: "completed",
        current_step: "artifacts",
        plan: result.plan,
        artifacts: result.artifacts,
        progress: result.progress,
        notes: [...result.notes, ...extraNotes],
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId)
      .select("*")
      .single();

    return {
      status: "completed",
      run: updated,
      lead_count: result.leads.length,
      validation_ok: result.validation_ok,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await supabase
      .from(TABLES.runs)
      .update({ status: "failed", error: message, completed_at: new Date().toISOString() })
      .eq("id", runId);
    return { status: "failed", error: message };
  }
}

/** Reset a failed/cancelled run to queued so processRun can claim it again. */
export async function resetRunForRetry(
  supabase: SupabaseClient,
  runId: string
): Promise<{ ok: true; run: Record<string, unknown> } | { ok: false; status: number; error: string }> {
  const { data, error } = await supabase
    .from(TABLES.runs)
    .update({
      status: "queued",
      error: null,
      current_step: null,
      progress: [],
      started_at: null,
      completed_at: null,
    })
    .eq("id", runId)
    .in("status", ["failed", "cancelled"])
    .select("*")
    .maybeSingle();
  if (error) return { ok: false, status: 500, error: error.message };
  if (!data) return { ok: false, status: 409, error: "run_not_retryable" };
  // Leave prior events for audit; mark the boundary.
  await supabase.from(TABLES.runEvents).insert({
    run_id: runId,
    step: "plan",
    level: "info",
    message: "Retry requested — run re-queued",
    meta: { retry: true },
    started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
    duration_ms: 0,
    error: null,
  });
  return { ok: true, run: data };
}
