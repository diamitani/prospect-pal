/**
 * GET /api/composio/status
 * Returns connection status for all Composio-supported apps for the current user.
 */
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-supabase";
import { getConnectionStatuses, isComposioConfigured, COMPOSIO_APPS } from "@/lib/composio";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isComposioConfigured()) {
    // Return "not configured" status — UI will show setup instructions
    return NextResponse.json({
      configured: false,
      statuses: COMPOSIO_APPS.map((app) => ({
        appId: app.id, connected: false, accountId: null,
      })),
    });
  }

  const statuses = await getConnectionStatuses(session.id);
  return NextResponse.json({ configured: true, statuses });
}
