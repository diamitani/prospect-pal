import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { safeNext } from "@/lib/auth/redirect";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * GET /auth/callback
 * Supabase Auth redirect target: OAuth PKCE code, email confirmation, and
 * password-recovery links (code or token_hash).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(url.searchParams.get("next"));
  const providerError =
    url.searchParams.get("error_description") || url.searchParams.get("error");

  try {
    const supabase = await createClient();

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(new URL(next, origin));
      }
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(error.message)}`,
          origin
        )
      );
    }

    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash });
      if (!error) {
        return NextResponse.redirect(new URL(next, origin));
      }
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(error.message)}`,
          origin
        )
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "auth_callback_failed";
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(message)}`, origin)
    );
  }

  return NextResponse.redirect(
    new URL(
      `/login?error=${encodeURIComponent(providerError || "Sign-in link was invalid or expired.")}`,
      origin
    )
  );
}
