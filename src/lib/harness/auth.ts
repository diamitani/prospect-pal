/**
 * Harness auth + owner scoping.
 *
 * Every Core SDR / run / lead / CRM route requires a signed-in user and scopes
 * service-role queries to that user (and their workspace when it is a real
 * UUID). Enably's unprefixed `users` / `workspaces` tables are optional: when
 * no workspace row exists we fall back to user-only scoping.
 */
import { NextResponse } from "next/server";
import { getSession, type SessionUser } from "@/lib/auth-supabase";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(v: unknown): v is string {
  return typeof v === "string" && UUID_RE.test(v);
}

export interface Owner {
  userId: string;
  /** Only set when it is a UUID (ppal_* workspace_id columns are UUID). */
  workspaceId: string | null;
  email: string;
}

export function ownerFromSession(session: Pick<SessionUser, "id" | "workspaceId" | "email">): Owner {
  return {
    userId: session.id,
    workspaceId: isUuid(session.workspaceId) ? session.workspaceId : null,
    email: session.email,
  };
}

export type RequireUserResult =
  | { ok: true; session: SessionUser; owner: Owner }
  | { ok: false; response: NextResponse };

export async function requireUser(): Promise<RequireUserResult> {
  const session = await getSession().catch(() => null);
  if (!session?.id) {
    return {
      ok: false,
      response: NextResponse.json({ error: "unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, session, owner: ownerFromSession(session) };
}

/**
 * PostgREST `or` filter for rows owned by the user (or their workspace).
 * Values are validated UUIDs, so interpolation is safe.
 */
export function ownerOrFilter(owner: Owner, userColumn = "created_by"): string {
  if (!isUuid(owner.userId)) throw new Error("invalid_user_id");
  const parts = [`${userColumn}.eq.${owner.userId}`];
  if (owner.workspaceId) parts.push(`workspace_id.eq.${owner.workspaceId}`);
  return parts.join(",");
}

/** Row-level ownership check for rows already fetched with the service role. */
export function ownsRow(
  owner: Owner,
  row: { created_by?: string | null; user_id?: string | null; workspace_id?: string | null } | null | undefined
): boolean {
  if (!row) return false;
  const uid = row.created_by ?? row.user_id ?? null;
  if (uid && uid === owner.userId) return true;
  if (owner.workspaceId && row.workspace_id && row.workspace_id === owner.workspaceId) return true;
  return false;
}

/**
 * Worker secret check. In production WORKER_SECRET is REQUIRED — an unset
 * secret denies (instead of silently allowing) every secret-based call.
 */
export function isWorkerSecretAuthorized(
  headerValue: string | null | undefined,
  env: { WORKER_SECRET?: string; NODE_ENV?: string } = process.env as {
    WORKER_SECRET?: string;
    NODE_ENV?: string;
  }
): boolean {
  const secret = env.WORKER_SECRET;
  if (!secret) return env.NODE_ENV !== "production";
  if (!headerValue) return false;
  if (headerValue.length !== secret.length) return false;
  let diff = 0;
  for (let i = 0; i < secret.length; i++) diff |= secret.charCodeAt(i) ^ headerValue.charCodeAt(i);
  return diff === 0;
}
