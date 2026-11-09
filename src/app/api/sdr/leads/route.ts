import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getSession } from "@/lib/auth-supabase";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession().catch(() => null);
    const supabase =
      createAdminClient() || (await createClient().catch(() => null));
    const runId = req.nextUrl.searchParams.get("run_id");

    if (!supabase) {
      return NextResponse.json({
        leads: [],
        warning: "supabase_unavailable",
      });
    }

    let q = supabase.from("leads").select("*").order("created_at", {
      ascending: false,
    });
    if (runId) q = q.eq("run_id", runId);
    if (session?.workspaceId) q = q.eq("workspace_id", session.workspaceId);

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
  try {
    const body = await req.json();
    const { company } = body;
    if (!company) {
      return NextResponse.json(
        { error: "company is required; email/contact may be null if unknown" },
        { status: 400 }
      );
    }

    const newLead = {
      id: `lead-${Date.now()}`,
      name: body.name || body.contact_name || null,
      contact_name: body.contact_name || body.name || null,
      title: body.title || null,
      company,
      domain: body.domain || null,
      email: body.email || null,
      email_status: body.email ? "not_checked" : "not_checked",
      verification_status: "not_checked",
      disposition: "needs_review",
      dns_status: "unknown",
      icp_score: body.icp_score ?? null,
      status: "ready",
      blockers: body.email ? [] : ["email_unknown"],
      created_at: new Date().toISOString(),
    };

    const supabase =
      createAdminClient() || (await createClient().catch(() => null));
    if (supabase) {
      const { error } = await supabase.from("leads").insert([newLead]);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create lead" },
      { status: 500 }
    );
  }
}
