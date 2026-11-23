import { NextRequest, NextResponse } from "next/server";
import { TABLES } from "@/lib/db/tables";
import { isUuid, ownsRow, requireUser } from "@/lib/harness/auth";
import { getDb } from "@/lib/harness/db";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ runId: string }> }
) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  const { runId } = await ctx.params;
  if (!isUuid(runId)) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const supabase = await getDb();
  if (!supabase) {
    return NextResponse.json({ error: "supabase_unavailable" }, { status: 503 });
  }
  const { data: run, error } = await supabase
    .from(TABLES.runs)
    .select("*")
    .eq("id", runId)
    .maybeSingle();
  if (error || !run || !ownsRow(auth.owner, run)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const [{ data: leads }, { data: events, error: evErr }] = await Promise.all([
    supabase
      .from(TABLES.leads)
      .select("*")
      .eq("run_id", runId)
      .order("icp_score", { ascending: false }),
    supabase
      .from(TABLES.runEvents)
      .select("*")
      .eq("run_id", runId)
      .order("started_at", { ascending: true })
      .limit(500),
  ]);
  return NextResponse.json({
    run,
    leads: leads || [],
    events: events || [],
    ...(evErr ? { events_warning: evErr.message } : {}),
  });
}
