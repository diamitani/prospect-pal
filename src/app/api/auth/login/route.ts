/**
 * POST /api/auth/login
 * Supabase Auth login with email/password
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string; redirectTo?: string };
    const email      = body.email?.toLowerCase().trim();
    const password   = body.password;
    const redirectTo = body.redirectTo || "/dashboard";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[login] Auth error:", error.message);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Session cookie is automatically set by Supabase
    return NextResponse.json(
      { ok: true, user: { email: data.user.email }, redirectTo },
      { status: 200 }
    );
  } catch (err) {
    console.error("[login] Unexpected error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
