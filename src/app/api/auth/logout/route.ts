import { NextResponse } from "next/server";
import { clearCookieHeaders } from "@/lib/auth";

export async function POST() {
  return NextResponse.json({ ok: true }, { headers: clearCookieHeaders() });
}
