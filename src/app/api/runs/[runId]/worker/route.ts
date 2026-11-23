import { NextRequest, NextResponse } from "next/server";
import { TABLES } from "@/lib/db/tables";
import { isUuid, isWorkerSecretAuthorized, ownsRow, requireUser } from "@/lib/harness/auth";
import { getDb } from "@/lib/harness/db";
import { processRun } from "@/lib/prospecting/worker";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Executes a queued run. Authorized by EITHER:
 *  - `x-prospect-pal-worker: $WORKER_SECRET` (required in production; an
 *    unset secret denies secret-based calls when NODE_ENV=production), or
 *  - a signed-in user who owns the run.
 */
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ runId: string }> }
) {
  const { runId } = await ctx.params;
  if (!isUuid(runId)) return NextResponse.json({ error: "run_not_found" }, { status: 404 });

  const header = req.headers.get("x-prospect-pal-worker");
  const secretOk = header ? isWorkerSecretAuthorized(header) : false;

  const supabase = await getDb();
  if (!supabase) {
    return NextResponse.json({ error: "supabase_unavailable" }, { status: 503 });
  }

  if (!secretOk) {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { data: run } = await supabase
      .from(TABLES.runs)
      .select("id, created_by, workspace_id")
      .eq("id", runId)
      .maybeSingle();
    if (!run || !ownsRow(auth.owner, run)) {
      return NextResponse.json({ error: "run_not_found" }, { status: 404 });
    }
  }

  const result = await processRun(supabase, runId);
  if (result.status === "not_found") {
    return NextResponse.json({ error: "run_not_found" }, { status: 404 });
  }
  if (result.status === "skipped") {
    return NextResponse.json({ run: result.run, skipped: true });
  }
  if (result.status === "failed") {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({
    run: result.run,
    lead_count: result.lead_count,
    validation_ok: result.validation_ok,
  });
}
