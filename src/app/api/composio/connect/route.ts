/**
 * POST /api/composio/connect
 * Initiates an OAuth connection for a given app.
 * Returns a redirect URL to send the user to for OAuth.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-supabase";
import { initiateConnection, isComposioConfigured } from "@/lib/composio";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isComposioConfigured()) {
    return NextResponse.json({ error: "Composio not configured — add COMPOSIO_API_KEY to env" }, { status: 503 });
  }

  const { appId } = await req.json() as { appId?: string };
  if (!appId) {
    return NextResponse.json({ error: "appId required" }, { status: 400 });
  }

  const appUrl  = process.env.NEXT_PUBLIC_APP_URL || "https://prospect-pal.vercel.app";
  const callbackUrl = `${appUrl}/api/composio/callback?app=${appId}&userId=${session.id}`;

  const result = await initiateConnection(appId, session.id, callbackUrl);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ redirectUrl: result.redirectUrl });
}
