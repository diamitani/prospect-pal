import { NextResponse } from "next/server";

/** Legacy path — forward to /auth/callback keeping query string. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  url.pathname = "/auth/callback";
  return NextResponse.redirect(url);
}
