/**
 * Invite / allowlist gate for internal Salesgency GTM app.
 * Configure via env:
 *   ALLOWLIST_EMAILS=pat@salesgency.com,team@salesgency.com
 *   ALLOWLIST_DOMAINS=salesgency.com,diamitani.com
 * If both empty, DENY all new signups (fail closed for internal app).
 * Set ALLOWLIST_OPEN=true only for local demo (not production).
 */

export function parseList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;\s]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowlistOpen(): boolean {
  return process.env.ALLOWLIST_OPEN === "true";
}

export function isEmailAllowlisted(email: string): {
  allowed: boolean;
  reason: string;
} {
  if (isAllowlistOpen()) {
    return { allowed: true, reason: "ALLOWLIST_OPEN" };
  }
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) {
    return { allowed: false, reason: "invalid_email" };
  }
  const domain = normalized.split("@")[1];
  const emails = parseList(process.env.ALLOWLIST_EMAILS);
  const domains = parseList(process.env.ALLOWLIST_DOMAINS);

  if (emails.length === 0 && domains.length === 0) {
    return {
      allowed: false,
      reason:
        "allowlist_empty: set ALLOWLIST_EMAILS or ALLOWLIST_DOMAINS (fail-closed)",
    };
  }
  if (emails.includes(normalized)) {
    return { allowed: true, reason: "email_allowlisted" };
  }
  if (domains.includes(domain)) {
    return { allowed: true, reason: "domain_allowlisted" };
  }
  return { allowed: false, reason: "not_on_allowlist" };
}
