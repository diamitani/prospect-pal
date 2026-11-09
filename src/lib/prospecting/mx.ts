/**
 * DNS / MX lookup helpers for free-path email domain validation.
 * Never SMTP-probes. Never infers mailbox existence from MX alone.
 */

import { resolveMx, resolve4, resolve6 } from "node:dns/promises";
import type { DnsStatus } from "./types";

export interface MxLookupResult {
  domain: string;
  status: DnsStatus;
  mx: { exchange: string; priority: number }[];
  hasA: boolean;
  hasAAAA: boolean;
  checked_at: string;
  error?: string;
}

function normalizeDomain(domain: string): string {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.$/, "");
}

/** Null MX per RFC 7505: single MX with exchange "." */
export function isNullMx(
  mx: { exchange: string; priority: number }[]
): boolean {
  return (
    mx.length === 1 &&
    (mx[0].exchange === "." || mx[0].exchange === "") &&
    mx[0].priority === 0
  );
}

export function classifyDns(opts: {
  mx: { exchange: string; priority: number }[];
  hasA: boolean;
  hasAAAA: boolean;
  nxdomain?: boolean;
  timeout?: boolean;
}): DnsStatus {
  if (opts.timeout) return "timeout";
  if (opts.nxdomain) return "nxdomain";
  if (opts.mx.length > 0) {
    if (isNullMx(opts.mx)) return "null_mx";
    return "mx_ok";
  }
  if (opts.hasA || opts.hasAAAA) return "implicit_mx_possible";
  return "no_route";
}

/** Domains that must never be submitted for verification */
export function shouldSkipVerification(status: DnsStatus): boolean {
  return (
    status === "null_mx" ||
    status === "nxdomain" ||
    status === "no_route"
  );
}

export async function lookupMx(domain: string): Promise<MxLookupResult> {
  const normalized = normalizeDomain(domain);
  const checked_at = new Date().toISOString();
  let mx: { exchange: string; priority: number }[] = [];
  let hasA = false;
  let hasAAAA = false;
  let nxdomain = false;
  let timeout = false;
  let error: string | undefined;

  try {
    const records = await resolveMx(normalized);
    mx = records
      .map((r) => ({ exchange: r.exchange, priority: r.priority }))
      .sort((a, b) => a.priority - b.priority);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === "ENOTFOUND" || code === "ENODATA") {
      // ENODATA = no MX; continue to A/AAAA
      if (code === "ENOTFOUND") nxdomain = true;
    } else if (code === "ETIMEOUT" || code === "ESERVFAIL") {
      timeout = true;
      error = String(code);
    } else {
      error = err instanceof Error ? err.message : String(err);
    }
  }

  if (!nxdomain && !timeout) {
    try {
      const a = await resolve4(normalized);
      hasA = a.length > 0;
    } catch {
      /* no A */
    }
    try {
      const aaaa = await resolve6(normalized);
      hasAAAA = aaaa.length > 0;
    } catch {
      /* no AAAA */
    }
    // If MX failed with ENOTFOUND but A exists, not nxdomain for mail purposes
    if (nxdomain && (hasA || hasAAAA)) nxdomain = false;
  }

  const status = classifyDns({ mx, hasA, hasAAAA, nxdomain, timeout });
  return { domain: normalized, status, mx, hasA, hasAAAA, checked_at, error };
}

/** Pure helper for tests — no network */
export function classifyFromRecords(
  mx: { exchange: string; priority: number }[],
  hasA: boolean,
  hasAAAA: boolean
): DnsStatus {
  return classifyDns({ mx, hasA, hasAAAA });
}
