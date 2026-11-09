/**
 * HubSpot write APPROVE — only after explicit approval of a preview payload.
 * Uses Composio when COMPOSIO_API_KEY is set; otherwise returns needs_credentials.
 * Never auto-writes.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-supabase";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import {
  executeComposioAction,
  isComposioConfigured,
} from "@/lib/composio";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession().catch(() => null);
    const body = await req.json();
    const previewId = body.preview_id || body.previewId;
    const approved = body.approved === true;
    if (!previewId) {
      return NextResponse.json({ error: "preview_id required" }, { status: 400 });
    }
    if (!approved) {
      return NextResponse.json(
        { error: "Set approved:true to confirm the exact preview payload" },
        { status: 400 }
      );
    }

    const supabase =
      createAdminClient() || (await createClient().catch(() => null));
    if (!supabase) {
      return NextResponse.json({ error: "supabase_unavailable" }, { status: 503 });
    }

    const { data: preview, error } = await supabase
      .from("crm_write_previews")
      .select("*")
      .eq("id", previewId)
      .single();

    if (error || !preview) {
      return NextResponse.json({ error: "preview_not_found" }, { status: 404 });
    }
    if (preview.status !== "pending") {
      return NextResponse.json(
        { error: `preview_status_${preview.status}` },
        { status: 409 }
      );
    }

    if (!isComposioConfigured()) {
      await supabase
        .from("crm_write_previews")
        .update({
          status: "approved",
          decided_at: new Date().toISOString(),
          result: {
            applied: false,
            reason: "needs_credentials",
            detail:
              "COMPOSIO_API_KEY not set; HubSpot write not executed",
            actor: session?.email || null,
          },
        })
        .eq("id", previewId);

      return NextResponse.json({
        applied: false,
        status: "needs_credentials",
        message:
          "Preview approved and recorded, but HubSpot write requires Composio BYOK (COMPOSIO_API_KEY + connected HubSpot).",
        payload: preview.payload,
      });
    }

    const entityId = session?.id || session?.workspaceId || "default";
    const contacts =
      (preview.payload as { contacts?: Array<{ email?: string; properties?: Record<string, unknown> }> })
        ?.contacts || [];
    const results: Array<Record<string, unknown>> = [];

    for (const c of contacts) {
      if (!c.email) continue;
      const r = await executeComposioAction(
        "HUBSPOT_CREATE_CONTACT",
        (c.properties as Record<string, unknown>) || { email: c.email },
        entityId
      );
      if ("error" in r) {
        results.push({ email: c.email, ok: false, error: r.error });
      } else {
        results.push({ email: c.email, ok: true, result: r.data });
      }
    }

    const applied = results.some((r) => r.ok);
    const applyResult = {
      applied,
      results,
      actor: session?.email || null,
    };

    await supabase
      .from("crm_write_previews")
      .update({
        status: applied ? "applied" : "failed",
        decided_at: new Date().toISOString(),
        result: applyResult,
      })
      .eq("id", previewId);

    return NextResponse.json({
      ...applyResult,
      preview_id: previewId,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
