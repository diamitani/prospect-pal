/**
 * HubSpot write PREVIEW — never writes. Returns exact payload for human approval.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-supabase";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { TABLES } from "@/lib/db/tables";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession().catch(() => null);
    const body = await req.json();
    const leadIds: string[] = body.leadIds || body.lead_ids || [];
    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        { error: "leadIds required" },
        { status: 400 }
      );
    }

    const supabase =
      createAdminClient() || (await createClient().catch(() => null));
    if (!supabase) {
      return NextResponse.json({ error: "supabase_unavailable" }, { status: 503 });
    }

    const { data: leads, error } = await supabase
      .from(TABLES.leads)
      .select("*")
      .in("id", leadIds);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const contacts = (leads || []).map((l) => ({
      email: l.email || null,
      properties: {
        email: l.email || null,
        firstname: (l.contact_name || l.name || "").split(" ")[0] || null,
        lastname:
          (l.contact_name || l.name || "").split(" ").slice(1).join(" ") || null,
        jobtitle: l.title || null,
        company: l.company || null,
        website: l.domain ? `https://${l.domain}` : null,
        hs_lead_status: "NEW",
        prospect_pal_tier: l.tier || null,
        prospect_pal_disposition: l.disposition || null,
        prospect_pal_score: l.icp_score || null,
      },
      blockers: l.blockers || [],
      skip_reason: !l.email
        ? "missing_email"
        : l.disposition === "excluded"
          ? "excluded"
          : l.verification_status === "accept_all"
            ? "accept_all_never_auto"
            : null,
    }));

    const writable = contacts.filter((c) => !c.skip_reason && c.email);
    const skipped = contacts.filter((c) => c.skip_reason || !c.email);

    const payload = {
      provider: "hubspot",
      action: "contacts.upsert",
      mode: "preview_only",
      note: "No HubSpot write will occur until POST /api/crm/hubspot/approve with this preview id.",
      writable_count: writable.length,
      skipped_count: skipped.length,
      contacts: writable,
      skipped,
    };

    const { data: preview, error: pErr } = await supabase
      .from(TABLES.crmWritePreviews)
      .insert({
        workspace_id: session?.workspaceId || null,
        created_by: session?.id || null,
        provider: "hubspot",
        lead_ids: leadIds,
        payload,
        status: "pending",
      })
      .select("*")
      .single();

    if (pErr) {
      // Table may not exist yet — still return preview payload
      return NextResponse.json({
        preview_id: null,
        warning: pErr.message,
        payload,
      });
    }

    return NextResponse.json({ preview_id: preview.id, payload });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
