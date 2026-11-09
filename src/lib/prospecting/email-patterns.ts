/**
 * Business-email pattern guessing (free path).
 * At most 3 labeled UNVERIFIED guesses. Never invent personal webmail.
 */

const PERSONAL_WEBMAIL = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",
  "mail.com",
]);

export function isPersonalWebmail(domain: string): boolean {
  return PERSONAL_WEBMAIL.has(domain.trim().toLowerCase());
}

export interface NameParts {
  first: string;
  last: string;
  ambiguous: boolean;
}

export function parseContactName(fullName: string): NameParts | null {
  const cleaned = fullName
    .replace(/\(.*?\)/g, "")
    .replace(/,.*$/, "")
    .trim()
    .replace(/\s+/g, " ");
  if (!cleaned) return null;
  const parts = cleaned.split(" ").filter(Boolean);
  if (parts.length < 2) {
    return { first: parts[0], last: "", ambiguous: true };
  }
  // Keep compound last names joined
  const first = parts[0].toLowerCase().replace(/[^a-z\-']/gi, "");
  const last = parts
    .slice(1)
    .join("")
    .toLowerCase()
    .replace(/[^a-z\-']/gi, "");
  if (!first || !last) return { first, last, ambiguous: true };
  return { first, last, ambiguous: false };
}

export interface EmailGuess {
  email: string;
  pattern: string;
  provenance: "guessed";
}

/**
 * Generate at most 3 guesses for a resolved contact + employer domain.
 * Returns empty if name ambiguous or personal webmail domain.
 */
export function guessBusinessEmails(
  fullName: string,
  domain: string
): EmailGuess[] {
  const d = domain.trim().toLowerCase();
  if (!d || isPersonalWebmail(d)) return [];
  const parts = parseContactName(fullName);
  if (!parts || parts.ambiguous || !parts.first || !parts.last) return [];

  const { first, last } = parts;
  const patterns: { email: string; pattern: string }[] = [
    { email: `${first}.${last}@${d}`, pattern: "first.last" },
    { email: `${first[0]}${last}@${d}`, pattern: "flast" },
    { email: `${first}@${d}`, pattern: "first" },
  ];
  return patterns.slice(0, 3).map((p) => ({
    ...p,
    provenance: "guessed" as const,
  }));
}
