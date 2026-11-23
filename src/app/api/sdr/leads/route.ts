import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { TABLES } from "@/lib/db/tables";
import { isUuid, ownerOrFilter, requireUser } from "@/lib/harness/auth";
import { getDb } from "@/lib/harness/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  try {
    const supabase = await getDb();
    if (!supabase) {
      return NextResponse.json({ leads: [], warning: "supabase_unavailable" });
    }
    const runId = req.nextUrl.searchParams.get("run_id");
    let q = supabase
      .from(TABLES.leads)
      .select("*")
      .or(ownerOrFilter(auth.owner))
      .order("created_at", { ascending: false });
    if (runId) {
      if (!isUuid(runId)) return NextResponse.json({ leads: [] });
      q = q.eq("run_id", runId);
    }
    const { data, error } = await q.limit(200);
    if (error) {
      return NextResponse.json({ leads: [], error: error.message });
    }
    return NextResponse.json({ leads: data || [] });
  } catch (error) {
    console.error("[SDR Leads GET error]:", error);
    return NextResponse.json({
      leads: [],
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  try {
    const body = await req.json().catch(() => ({}));
    const { company } = body;
    if (!company || typeof company !== "string") {
      return NextResponse.json(
        { error: "company is required; email/contact may be null if unknown" },
        { status: 400 }
      );
    }

    const newLead = {
      id: `lead_${randomUUID().replace(/-/g, "").slice(0, 16)}`,
      workspace_id: auth.owner.workspaceId,
      created_by: auth.owner.userId,
      name: body.name || body.contact_name || null,
      contact_name: body.contact_name || body.name || null,
      title: body.title || null,
      company,
      domain: body.domain || null,
      email: body.email || null,
      email_status: "not_checked",
      verification_status: "not_checked",
      disposition: "needs_review",
      dns_status: "unknown",
      icp_score: body.icp_score ?? null,
      status: "ready",
      provenance: "manual_entry",
      blockers: body.email ? [] : ["email_unknown"],
      created_at: new Date().toISOString(),
    };

    const supabase = await getDb();
    if (!supabase) {
      return NextResponse.json({ error: "supabase_unavailable" }, { status: 503 });
    }
    const { error } = await supabase.from(TABLES.leads).insert([newLead]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create lead" },
      { status: 500 }
    );
  }
}
