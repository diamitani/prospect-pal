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
    const supabase = await createClient();

    // Update user record to mark onboarding complete
    const { data, error } = await supabase
      .from('users')
      .update({
        onboarding_completed: true,
        onboarding_data: {
          ...body,
          completed_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.id)
      .select('id')
      .single();

    if (error) {
      console.error("[onboarding] Update error:", error);

      // If no rows updated, user record doesn't exist - try to create it
      if (error.code === 'PGRST116') {
        console.log("[onboarding] User record not found, attempting insert");

        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: session.id,
            email: session.email,
            full_name: session.name,
            onboarding_completed: true,
            onboarding_data: {
              ...body,
              completed_at: new Date().toISOString(),
            },
          });

        if (insertError) {
          console.error("[onboarding] Insert error:", insertError);
          return NextResponse.json(
            { error: "Failed to create user profile. Please contact support." },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "Failed to save onboarding data" },
          { status: 500 }
        );
      }
    }

    console.log("[onboarding] User completed onboarding:", {
      userId: session.id,
      email: session.email,
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
