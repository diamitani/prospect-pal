import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { company, role, tools, campaignIntent } = body;

    // TODO: Save onboarding data to database
    // For now, we'll just log it and return success
    // In production, you would save this to DynamoDB or your database of choice
    console.log("[onboarding] User completed onboarding:", {
      userId: session.id,
      company,
      role,
      tools,
      campaignIntent,
    });

    // TODO: Update user record with onboarding_completed flag
    // await updateUser(session.id, { onboarding_completed: true, company, role, tools, campaignIntent });

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
