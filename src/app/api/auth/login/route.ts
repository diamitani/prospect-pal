import { NextRequest, NextResponse } from "next/server";
import { loginUser, setCookieHeaders } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string };
    const email    = body.email?.toLowerCase().trim();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const result = await loginUser(email, password);

    if ("error" in result) {
      console.error("[login] Auth error:", result.error);
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const res = NextResponse.json({ user: result.user }, { status: 200 });
    res.headers.set("Set-Cookie", setCookieHeaders(result.token)["Set-Cookie"]);
    return res;
  } catch (err) {
    console.error("[login] Unexpected error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
