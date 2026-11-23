import { NextRequest, NextResponse, after } from "next/server";
import { TABLES } from "@/lib/db/tables";
import { isUuid, ownsRow, requireUser } from "@/lib/harness/auth";
import { getDb } from "@/lib/harness/db";
import { processRun, resetRunForRetry } from "@/lib/prospecting/worker";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Retry a failed (or cancelled) run owned by the caller. */
export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ runId: string }> }
) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const { runId } = await ctx.params;
  if (!isUuid(runId)) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const supabase = await getDb();
  if (!supabase) return NextResponse.json({ error: "supabase_unavailable" }, { status: 503 });

  const { data: run } = await supabase
    .from(TABLES.runs)
    .select("id, status, created_by, workspace_id")
    .eq("id", runId)
    .maybeSingle();
  if (!run || !ownsRow(auth.owner, run)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const reset = await resetRunForRetry(supabase, runId);
  if (!reset.ok) {
    return NextResponse.json(
      { error: reset.error, status: run.status },
      { status: reset.status }
    );
  }

  after(async () => {
    const r = await processRun(supabase, runId);
    if (r.status === "failed") console.warn("[retry] run failed again", runId, r.error);
  });

  return NextResponse.json({ run: reset.run, retried: true }, { status: 202 });
}
