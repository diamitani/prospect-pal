import { NextRequest, NextResponse } from "next/server";
import { signupUser, loginUser, setCookieHeaders } from "@/lib/auth";

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

    const result = await signupUser(email.toLowerCase().trim(), password, name.trim());
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Cognito requires email verification
    if ("needsVerification" in result && result.needsVerification) {
      return NextResponse.json({ success: true, needsVerification: true });
    }

    // Auto-login if no verification needed (e.g., admin-confirmed accounts)
    const loginResult = await loginUser(email.toLowerCase().trim(), password);
    if ("error" in loginResult) {
      return NextResponse.json({ success: true, needsVerification: true });
    }

    const res = NextResponse.json({ user: loginResult.user }, { status: 200 });
    res.headers.set("Set-Cookie", setCookieHeaders(loginResult.token)["Set-Cookie"]);
    return res;
  } catch (err) {
    console.error("[signup] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
