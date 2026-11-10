import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { executeProspectingRun } from "@/lib/prospecting/runner";
import { TABLES } from "@/lib/db/tables";

export const runtime = "nodejs";
export const maxDuration = 60;

function authorized(req: NextRequest): boolean {
  const secret = process.env.WORKER_SECRET;
  if (!secret) return true; // local/dev
  return req.headers.get("x-prospect-pal-worker") === secret;
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ runId: string }> }
) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { runId } = await ctx.params;
  const supabase = createAdminClient() || (await createClient().catch(() => null));
  if (!supabase) {
    return NextResponse.json({ error: "supabase_unavailable" }, { status: 503 });
  }

  const { data: run, error } = await supabase
    .from(TABLES.runs)
    .select("*")
    .eq("id", runId)
    .single();
  if (error || !run) {
    return NextResponse.json({ error: "run_not_found" }, { status: 404 });
  }
  if (run.status === "running" || run.status === "completed") {
    return NextResponse.json({ run, skipped: true });
  }

  await supabase
    .from(TABLES.runs)
    .update({
      status: "running",
      started_at: new Date().toISOString(),
      current_step: "plan",
    })
    .eq("id", runId);

  try {
    const result = await executeProspectingRun(
      {
        brief: run.brief,
        plan: run.plan || undefined,
        enrichment_mode: run.enrichment_mode,
        workspace_id: run.workspace_id || undefined,
      },
      {
        runId,
        onProgress: async (p) => {
          await supabase
            .from(TABLES.runs)
            .update({
              current_step: p.step,
              progress: [...(run.progress || []), p],
            })
            .eq("id", runId);
        },
      }
    );

    // Persist leads — never fabricate; empty ok
    if (result.leads.length > 0) {
      const rows = result.leads.map((l) => ({
        id: l.id,
        run_id: runId,
        workspace_id: run.workspace_id,
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
      }));
      const { error: leadErr } = await supabase.from(TABLES.leads).upsert(rows);
      if (leadErr) console.warn("[worker] lead upsert", leadErr.message);
    }

    const { data: updated } = await supabase
      .from(TABLES.runs)
      .update({
        status: "completed",
        current_step: "artifacts",
        plan: result.plan,
        artifacts: result.artifacts,
        progress: result.progress,
        notes: result.notes,
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId)
      .select("*")
      .single();

    return NextResponse.json({
      run: updated,
      lead_count: result.leads.length,
      validation_ok: result.validation_ok,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await supabase
      .from(TABLES.runs)
      .update({
        status: "failed",
        error: message,
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
