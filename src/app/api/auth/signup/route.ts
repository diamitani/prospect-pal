/**
 * POST /api/auth/signup — allowlist-gated for Prospect Pal by Salesgency (internal).
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { isEmailAllowlisted } from "@/lib/auth/allowlist";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = (await req.json()) as {
      email: string;
      password: string;
      name: string;
    };

    if (!email || !password || !name) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const gate = isEmailAllowlisted(email);
    if (!gate.allowed) {
      return NextResponse.json(
        {
          error:
            "Signup is invite-only for Prospect Pal by Salesgency. Ask an admin to add your email/domain to the allowlist.",
          reason: gate.reason,
        },
        { status: 403 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: undefined,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: { email: data.user?.email } }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
