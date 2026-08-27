/**
 * POST /api/user/onboarding
 * Save onboarding data and mark onboarding as completed
 */
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-supabase";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { company, role, tools, campaignIntent } = body;

    const supabase = await createClient();

    // Save onboarding data to users table
    const { error } = await supabase
      .from('users')
      .update({
        onboarding_completed: true,
        onboarding_data: {
          company,
          role,
          tools,
          campaignIntent,
          completed_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.id);

    if (error) {
      console.error("[onboarding] Error saving onboarding data:", error);
      return NextResponse.json(
        { error: "Failed to save onboarding data" },
        { status: 500 }
      );
    }

    console.log("[onboarding] User completed onboarding:", {
      userId: session.id,
      company,
      role,
      tools,
      campaignIntent,
    });

    return NextResponse.json({
      success: true,
      message: "Onboarding data saved successfully",
    });
  } catch (error) {
    console.error("[onboarding] Error saving onboarding data:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}
