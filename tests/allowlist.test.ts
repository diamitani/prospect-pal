import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { isEmailAllowlisted, parseList } from "@/lib/auth/allowlist";

describe("allowlist", () => {
  const env = { ...process.env };
  beforeEach(() => {
    delete process.env.ALLOWLIST_OPEN;
    delete process.env.ALLOWLIST_EMAILS;
    delete process.env.ALLOWLIST_DOMAINS;
  });
  afterEach(() => {
    process.env = { ...env };
  });

  it("parses lists", () => {
    expect(parseList("a@b.com, c@d.com")).toEqual(["a@b.com", "c@d.com"]);
  });

  it("fail-closed when empty", () => {
    expect(isEmailAllowlisted("pat@salesgency.com").allowed).toBe(false);
  });

  it("allows domain", () => {
    process.env.ALLOWLIST_DOMAINS = "salesgency.com";
    expect(isEmailAllowlisted("pat@salesgency.com").allowed).toBe(true);
    expect(isEmailAllowlisted("x@other.com").allowed).toBe(false);
  });

  it("ALLOWLIST_OPEN bypasses", () => {
    process.env.ALLOWLIST_OPEN = "true";
    expect(isEmailAllowlisted("anyone@example.com").allowed).toBe(true);
  });
});
