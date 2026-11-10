import { describe, expect, it } from "vitest";
import { safeNext } from "@/lib/auth/redirect";

describe("safeNext", () => {
  it("allows in-app relative paths", () => {
    expect(safeNext("/dashboard")).toBe("/dashboard");
    expect(safeNext("/reset-password")).toBe("/reset-password");
    expect(safeNext("/wizard/2")).toBe("/wizard/2");
  });

  it("rejects open redirects", () => {
    expect(safeNext("https://evil.example/phish")).toBe("/dashboard");
    expect(safeNext("//evil.example")).toBe("/dashboard");
    expect(safeNext("")).toBe("/dashboard");
    expect(safeNext(null)).toBe("/dashboard");
  });

  it("honors a custom fallback", () => {
    expect(safeNext(null, "/login")).toBe("/login");
  });
});
