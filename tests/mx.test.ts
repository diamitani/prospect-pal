import { describe, expect, it } from "vitest";
import {
  classifyFromRecords,
  isNullMx,
  shouldSkipVerification,
} from "@/lib/prospecting/mx";

describe("MX / DNS classification", () => {
  it("detects null MX (RFC 7505)", () => {
    expect(isNullMx([{ exchange: ".", priority: 0 }])).toBe(true);
    expect(classifyFromRecords([{ exchange: ".", priority: 0 }], false, false)).toBe(
      "null_mx"
    );
    expect(shouldSkipVerification("null_mx")).toBe(true);
  });

  it("ordinary MX is mx_ok", () => {
    expect(
      classifyFromRecords([{ exchange: "mail.example.com", priority: 10 }], true, false)
    ).toBe("mx_ok");
    expect(shouldSkipVerification("mx_ok")).toBe(false);
  });

  it("no MX but A → implicit_mx_possible (not auto-reject)", () => {
    expect(classifyFromRecords([], true, false)).toBe("implicit_mx_possible");
    expect(shouldSkipVerification("implicit_mx_possible")).toBe(false);
  });

  it("no MX and no A/AAAA → no_route", () => {
    expect(classifyFromRecords([], false, false)).toBe("no_route");
    expect(shouldSkipVerification("no_route")).toBe(true);
  });
});
