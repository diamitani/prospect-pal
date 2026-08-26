/**
 * GET /api/auth/session
 * Get current user session with workspace info
 */
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-supabase";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: session.id,
        email: session.email,
        name: session.name,
        plan: session.plan,
        workspaceId: session.workspaceId,
        workspaceName: session.workspaceName,
        onboardingCompleted: session.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("[session] Error fetching session:", error);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}
