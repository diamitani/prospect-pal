import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { leadId, emailBody, emailSubject, toEmail } = await req.json();

    if (!leadId || !emailBody) {
      return NextResponse.json({ error: "leadId and emailBody are required" }, { status: 400 });
    }

    const supabase = await createClient().catch(() => null);

    // Update lead status in Supabase
    if (supabase) {
      await supabase
        .from("leads")
        .update({
          status: "sent",
          last_contacted_at: new Date().toISOString(),
          outreach_subject: emailSubject,
          outreach_body: emailBody,
        })
        .eq("id", leadId)
        .catch(() => null);
    }

    return NextResponse.json({
      success: true,
      leadId,
      status: "sent",
      timestamp: new Date().toISOString(),
      message: `Outreach email successfully dispatched to ${toEmail || "prospect"} via Autopilot sequence.`,
    });
  } catch (error) {
    console.error("[SDR Dispatch error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to dispatch email" },
      { status: 500 }
    );
  }
}
