import { NextRequest, NextResponse } from "next/server";
import { signupUser, setCookieHeaders } from "@/lib/auth";

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

    // signupUser now: registers → admin-confirms → auto-logs in → returns session
    const result = await signupUser(email.toLowerCase().trim(), password, name.trim());

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Set session cookie and return
    const res = NextResponse.json({ user: result.user }, { status: 200 });
    res.headers.set("Set-Cookie", setCookieHeaders(result.token)["Set-Cookie"]);
    return res;
  } catch (err) {
    console.error("[signup] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
