import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { Store } from "./types";

export const KEY_PREFIX = "sg_live_";
export const DEMO_API_KEY = "sg_live_demo_vertical_gtm_outbound_2026";

export function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

/** Makes a new key. Show it to the customer once; only the hash is stored. */
export function generateApiKey() {
  const key = KEY_PREFIX + randomBytes(24).toString("base64url");
  return { key, keyHash: hashKey(key), keyPrefix: key.slice(0, 12) };
}

export function readBearer(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (auth && /^bearer\s+/i.test(auth)) {
    return auth.replace(/^bearer\s+/i, "").trim();
  }
  return req.headers.get("x-api-key")?.trim() || null;
}

export type AuthResult =
  | { ok: true; userId: string; keyId: string }
  | { ok: false };

export async function authenticate(
  req: Request,
  store: Store
): Promise<AuthResult> {
  const key = readBearer(req);
  if (!key || !key.startsWith(KEY_PREFIX)) return { ok: false };
  const record = await store.findApiKeyByHash(hashKey(key));
  if (!record || record.revokedAt) return { ok: false };
  await store.touchApiKey(record.id);
  return { ok: true, userId: record.userId, keyId: record.id };
}

/** Constant-time string compare for shared secrets. */
export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

