import { NextRequest, NextResponse } from "next/server";
import { TABLES } from "@/lib/db/tables";
import { ownerOrFilter, requireUser } from "@/lib/harness/auth";
import { getDb } from "@/lib/harness/db";

export const runtime = "nodejs";

/**
 * Queue an outreach DRAFT for a lead the caller owns. Never sends email.
 * Suppressed / duplicate leads cannot be queued.
 */
export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if (!auth.ok) return auth.response;
  try {
    const { leadId, emailBody, emailSubject } = await req.json().catch(() => ({}));
    if (!leadId || !emailBody) {
      return NextResponse.json(
        { error: "leadId and emailBody are required" },
        { status: 400 }
      );
    }

    const supabase = await getDb();
    if (!supabase) {
      return NextResponse.json({ error: "supabase_unavailable" }, { status: 503 });
    }

    const { data: lead, error: findErr } = await supabase
      .from(TABLES.leads)
      .select("id, status, disposition, email")
      .eq("id", String(leadId))
      .or(ownerOrFilter(auth.owner))
      .maybeSingle();
    if (findErr || !lead) {
      return NextResponse.json({ error: "lead_not_found" }, { status: 404 });
    }
    if (lead.status === "suppressed" || lead.status === "duplicate_prior_run") {
      return NextResponse.json(
        { error: `lead_${lead.status}`, message: "Guardrail: this lead cannot be queued." },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from(TABLES.leads)
      .update({
        status: "draft_queued",
        disposition: "draft_queued",
        outreach_subject: emailSubject ? String(emailSubject).slice(0, 300) : null,
        outreach_body: String(emailBody).slice(0, 10000),
      })
      .eq("id", lead.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      status: "draft_queued",
      sent: false,
      timestamp: new Date().toISOString(),
      message: `Outreach draft queued for human review${lead.email ? ` (to ${lead.email})` : ""}. Nothing was sent.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to queue draft" },
      { status: 500 }
    );
  }
}
