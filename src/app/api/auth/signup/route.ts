/**
 * POST /api/auth/signup
 * Supabase Auth signup with email/password
 * No email confirmation required
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json() as {
      email: string; password: string; name: string;
    };

    if (!email || !password || !name) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const supabase = await createClient();

    // Sign up user - database trigger will auto-create profile and workspace
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          full_name: name.trim(),
        },
        emailRedirectTo: undefined, // Skip email confirmation
      },
    });

    if (error) {
      console.error("[signup] Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Session cookie is automatically set by Supabase
    return NextResponse.json({ user: { email: data.user?.email } }, { status: 200 });
  } catch (err) {
    console.error("[signup] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
