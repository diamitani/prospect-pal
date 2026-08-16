/**
 * Next.js Middleware — Route Protection
 * /dashboard and /api/* (except /api/auth) require a valid session cookie.
 * Public: /, /home, /login, /signup, /api/auth/*, /api/composio/*, /api/n8n/*
 */
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "prospect-pal-local-dev-secret-2025"
);
const COOKIE_NAME = "ppal_session";

const PROTECTED_PREFIXES = ["/dashboard", "/api/pal", "/api/projects", "/api/workflow"];

const PUBLIC_PREFIXES = [
  "/login", "/signup", "/forgot-password", "/api/auth",
  "/home", "/_next", "/favicon", "/images", "/api/composio", "/api/n8n",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p)) || pathname.includes(".")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch { /* fall through */ }
    }
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
