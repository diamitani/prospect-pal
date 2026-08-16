/**
 * POST /api/auth/login
 * Returns a redirect response WITH the session cookie already set,
 * so the browser stores the cookie before the new page loads.
 */
import { NextRequest, NextResponse } from "next/server";
import { loginUser, setCookieHeaders } from "@/lib/auth";

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

    const result = await loginUser(email, password);

    if ("error" in result) {
      console.error("[login] Auth error:", result.error);
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    // Return the session cookie + a redirect in one response
    // This guarantees the cookie is committed before the next page load
    const res = NextResponse.json(
      { ok: true, user: result.user, redirectTo },
      { status: 200 }
    );
    res.headers.set("Set-Cookie", setCookieHeaders(result.token)["Set-Cookie"]);
    return res;
  } catch (err) {
    console.error("[login] Unexpected error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
