import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ runId: string }> }
) {
  const { runId } = await ctx.params;
  const supabase = createAdminClient() || (await createClient().catch(() => null));
  if (!supabase) {
    return NextResponse.json({ error: "supabase_unavailable" }, { status: 503 });
  }
  const { data: run, error } = await supabase
    .from("runs")
    .select("*")
    .eq("id", runId)
    .single();
  if (error || !run) {
    return NextResponse.json({ error: error?.message || "not_found" }, { status: 404 });
  }
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("run_id", runId)
    .order("icp_score", { ascending: false });
  return NextResponse.json({ run, leads: leads || [] });
}
