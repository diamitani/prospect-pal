import { NextRequest, NextResponse, after } from "next/server";
import type { CreateRunRequest, EnrichmentMode } from "@/lib/prospecting/types";
import { TABLES } from "@/lib/db/tables";
import { ownerOrFilter, requireUser } from "@/lib/harness/auth";
import { getDb } from "@/lib/harness/db";
import { processRun } from "@/lib/prospecting/worker";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODES: EnrichmentMode[] = ["free", "byok", "dual"];

export async function GET() {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  try {
    const supabase = await getDb();
    if (!supabase) {
      return NextResponse.json({ runs: [], warning: "supabase_unavailable" });
    }
    const { data, error } = await supabase
      .from(TABLES.runs)
      .select("*")
      .or(ownerOrFilter(auth.owner))
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      return NextResponse.json({ runs: [], error: error.message }, { status: 200 });
    }
    return NextResponse.json({ runs: data || [] });
  } catch (err) {
    return NextResponse.json(
      { runs: [], error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  try {
    const body = (await req.json().catch(() => ({}))) as CreateRunRequest;
    if (!body?.brief || typeof body.brief !== "string" || !body.brief.trim()) {
      return NextResponse.json({ error: "brief is required" }, { status: 400 });
    }
    const enrichment_mode: EnrichmentMode = MODES.includes(body.enrichment_mode as EnrichmentMode)
      ? (body.enrichment_mode as EnrichmentMode)
      : "free";

    const supabase = await getDb();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured — set NEXT_PUBLIC_SUPABASE_URL and keys" },
        { status: 503 }
      );
    }

    // Never trust a client-supplied workspace_id: scope to the session owner.
    const row = {
      workspace_id: auth.owner.workspaceId,
      created_by: auth.owner.userId,
      status: "queued",
      brief: body.brief.trim().slice(0, 4000),
      enrichment_mode,
      plan: body.plan || null,
      progress: [],
      notes: [],
    };

    const { data, error } = await supabase.from(TABLES.runs).insert(row).select("*").single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Execute in-process after the response is sent (no fragile HTTP self-call).
    if (data?.id) {
      after(async () => {
        const r = await processRun(supabase, data.id);
        if (r.status === "failed") console.warn("[runs] run failed", data.id, r.error);
      });
    }

    return NextResponse.json({ run: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
