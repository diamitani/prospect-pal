import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

/**
 * Queue an outreach DRAFT for a lead. Never sends email.
 */
export async function POST(req: NextRequest) {
  try {
    const { leadId, emailBody, emailSubject, toEmail } = await req.json();

    if (!leadId || !emailBody) {
      return NextResponse.json(
        { error: "leadId and emailBody are required" },
        { status: 400 }
      );
    }

    const supabase =
      createAdminClient() || (await createClient().catch(() => null));

    if (supabase) {
      const { error } = await supabase
        .from("leads")
        .update({
          status: "draft_queued",
          disposition: "draft_queued",
          outreach_subject: emailSubject || null,
          outreach_body: emailBody,
        })
        .eq("id", leadId);
      if (error) {
        console.warn("[SDR draft queue] update warning:", error.message);
      }
    }

    return NextResponse.json({
      success: true,
      leadId,
      status: "draft_queued",
      sent: false,
      timestamp: new Date().toISOString(),
      message: `Outreach draft queued for review${toEmail ? ` (to ${toEmail})` : ""}. Nothing was sent.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to queue draft",
      },
      { status: 500 }
    );
  }
}
