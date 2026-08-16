/**
 * Auth Library — JWT session management
 * Uses httpOnly cookies. Integrates with AWS Cognito when configured,
 * falls back to a local credential check for development.
 */
export const runtime = "nodejs";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  AdminConfirmSignUpCommand,
  AdminUpdateUserAttributesCommand,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "prospect-pal-dev-secret-change-in-production"
);
const COOKIE_NAME = "ppal_session";
const SESSION_DAYS = 7;

export interface SessionUser {
  id:    string;
  email: string;
  name:  string;
  plan:  "free" | "pro" | "agency";
}

// ===========================================================================
// JWT SESSION
// ===========================================================================

export async function createSession(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id:    payload.id as string,
      email: payload.email as string,
      name:  payload.name as string,
      plan:  (payload.plan as "free" | "pro" | "agency") || "free",
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function setCookieHeaders(token: string): Record<string, string> {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const isLocal = process.env.NODE_ENV === "development";
  // Omit Secure flag on localhost (http://) so cookie is actually set
  const secureFlag = isLocal ? "" : "; Secure";
  return {
    "Set-Cookie": `${COOKIE_NAME}=${token}; HttpOnly${secureFlag}; SameSite=Lax; Path=/; Max-Age=${maxAge}`,
  };
}

export function clearCookieHeaders(): Record<string, string> {
  return {
    "Set-Cookie": `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
  };
}

// ===========================================================================
// AWS COGNITO CLIENT
// ===========================================================================

const PLACEHOLDER_PATTERNS = ["your_", "XXXXXXXXX", "example", "changeme", "xxx"];
const isRealValue = (v?: string) =>
  !!v && !PLACEHOLDER_PATTERNS.some((p) => v.toLowerCase().includes(p.toLowerCase()));

const COGNITO_CONFIGURED =
  isRealValue(process.env.COGNITO_USER_POOL_ID) &&
  isRealValue(process.env.COGNITO_CLIENT_ID);

const cognitoClient = COGNITO_CONFIGURED
  ? new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION || "us-east-1",
    })
  : null;

// ===========================================================================
// AUTH OPERATIONS
// ===========================================================================

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: SessionUser; token: string } | { error: string }> {

  // ── Cognito auth ──────────────────────────────────────────────────────────
  if (COGNITO_CONFIGURED && cognitoClient) {
    try {
      const cmd = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId:  process.env.COGNITO_CLIENT_ID!,
        AuthParameters: { USERNAME: email, PASSWORD: password },
      });
      const res = await cognitoClient.send(cmd);
      const accessToken = res.AuthenticationResult?.AccessToken;
      if (!accessToken) return { error: "Authentication failed — please check your credentials" };

      // Get user details
      const userCmd = new GetUserCommand({ AccessToken: accessToken });
      const userRes = await cognitoClient.send(userCmd);
      const sub  = userRes.UserAttributes?.find((a) => a.Name === "sub")?.Value || email;
      const name = userRes.UserAttributes?.find((a) => a.Name === "name")?.Value || email.split("@")[0];

      const user: SessionUser = { id: sub, email, name, plan: "pro" };
      const token = await createSession(user);
      return { user, token };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      // Friendly messages for common Cognito errors
      if (msg.includes("NotAuthorizedException") || msg.includes("Incorrect username or password")) {
        return { error: "Incorrect email or password" };
      }
      if (msg.includes("UserNotConfirmedException")) {
        return { error: "Account not confirmed — please check your email or sign up again" };
      }
      if (msg.includes("UserNotFoundException")) {
        return { error: "No account found with that email" };
      }
      return { error: msg };
    }
  }

  // ── Demo mode (no Cognito configured) ────────────────────────────────────
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  try {
    const idHash = btoa(email).replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
    const user: SessionUser = {
      id:   `demo-${idHash}`,
      email,
      name: email.split("@")[0].replace(/[._-]/g, " ").trim() || "User",
      plan: "pro",
    };
    const token = await createSession(user);
    return { user, token };
  } catch (err) {
    console.error("[auth] Demo mode session error:", err);
    return { error: "Session creation failed" };
  }
}

export async function signupUser(
  email: string,
  password: string,
  name: string
): Promise<{ user: SessionUser; token: string } | { error: string }> {

  if (COGNITO_CONFIGURED && cognitoClient) {
    // Step 1: Register with Cognito
    try {
      await cognitoClient.send(new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID!,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name",  Value: name  },
        ],
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Signup failed";
      if (msg.includes("UsernameExistsException") || msg.includes("already exists")) {
        return { error: "An account with this email already exists — try signing in" };
      }
      if (msg.includes("InvalidPasswordException")) {
        return { error: "Password must be at least 8 characters with uppercase, lowercase, and a number" };
      }
      return { error: msg };
    }

    // Step 2: Auto-confirm the user (skip email verification entirely)
    try {
      await cognitoClient.send(new AdminConfirmSignUpCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username:   email,
      }));

      // Also mark email as verified
      await cognitoClient.send(new AdminUpdateUserAttributesCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username:   email,
        UserAttributes: [{ Name: "email_verified", Value: "true" }],
      }));
    } catch (err) {
      // AdminConfirmSignUp requires IAM credentials — if it fails, fall back
      // to returning an error so the user knows to verify their email
      console.error("[auth] AdminConfirmSignUp failed:", err);
      return { error: "Account created but needs verification — please check your email for a confirmation code" };
    }

    // Step 3: Auto-login immediately after confirmation
    return loginUser(email, password);
  }

  // ── Demo mode ─────────────────────────────────────────────────────────────
  return loginUser(email, password);
}
