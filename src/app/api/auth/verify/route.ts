import { NextRequest, NextResponse } from "next/server";
import { loginUser, setCookieHeaders } from "@/lib/auth";
import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

export const runtime = "nodejs";

const cognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || "us-east-1" });

export async function POST(req: NextRequest) {
  try {
    const { email, code, password } = await req.json() as {
      email: string; code: string; password: string;
    };
    if (!email || !code) {
      return NextResponse.json({ error: "Email and code required" }, { status: 400 });
    }

    // Confirm the sign-up with the verification code
    await cognito.send(new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: email.toLowerCase().trim(),
      ConfirmationCode: code.trim(),
    }));

    // Auto-login after verification
    if (password) {
      const loginResult = await loginUser(email.toLowerCase().trim(), password);
      if (!("error" in loginResult)) {
        const res = NextResponse.json({ user: loginResult.user }, { status: 200 });
        res.headers.set("Set-Cookie", setCookieHeaders(loginResult.token)["Set-Cookie"]);
        return res;
      }
    }

    return NextResponse.json({ success: true, verified: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[verify] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
