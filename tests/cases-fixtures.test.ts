import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  classifyDisposition,
  computeScore,
} from "@/lib/prospecting/scoring";
import { classifyFromRecords, shouldSkipVerification } from "@/lib/prospecting/mx";
import { validateLead } from "@/lib/prospecting/validator";

/** Map cases.yaml scenarios to deterministic unit expectations (no network). */
describe("cases.yaml fixture expectations", () => {
  const raw = readFileSync(
    resolve(__dirname, "../src/fixtures/cases.yaml"),
    "utf8"
  );
  const ids = [...raw.matchAll(/^\s+-\s+id:\s+(\S+)/gm)].map((m) => m[1]);

  it("loads expected case ids from fixtures", () => {
    expect(ids).toContain("happy-path");
    expect(ids).toContain("null-mx");
    expect(ids).toContain("catch-all");
    expect(ids).toContain("mx-only");
  });

  it("null-mx → excluded; skip verification", () => {
    const status = classifyFromRecords([{ exchange: ".", priority: 0 }], false, false);
    expect(status).toBe("null_mx");
    expect(shouldSkipVerification(status)).toBe(true);
    const score = computeScore({
      icpConfirmed: true,
      targetingRelevant: true,
      evidenceAgeDays: 5,
      freshnessWindowDays: 90,
      roleConfirmed: true,
      sourceQuality: "primary",
      emailEvidence: "guessed",
    });
    expect(
      classifyDisposition({
        score,
        verificationStatus: "not_checked",
        icpConfirmed: true,
        roleConfirmed: true,
        excluded: true,
      })
    ).toBe("excluded");
  });

  it("catch-all never valid / sure", () => {
    const score = computeScore({
      icpConfirmed: true,
      targetingRelevant: true,
      evidenceAgeDays: 5,
      freshnessWindowDays: 90,
      roleConfirmed: true,
      sourceQuality: "primary",
      emailEvidence: "exact_valid",
      isCatchAll: true,
    });
    expect(
      classifyDisposition({
        score,
        verificationStatus: "accept_all",
        isCatchAll: true,
        icpConfirmed: true,
        roleConfirmed: true,
      })
    ).toBe("needs_review");
    const issues = validateLead({
      id: "x",
      company: "Y",
      dns_status: "mx_ok",
      verification_status: "accept_all",
      disposition: "sure",
      email: "a@y.com",
    });
    expect(issues.length).toBeGreaterThan(0);
  });

  it("mx-only guessed → not_checked needs_review", () => {
    const score = computeScore({
      icpConfirmed: false,
      targetingRelevant: false,
      evidenceAgeDays: null,
      freshnessWindowDays: 90,
      roleConfirmed: false,
      sourceQuality: "insufficient",
      emailEvidence: "guessed",
    });
    expect(
      classifyDisposition({
        score,
        verificationStatus: "not_checked",
        icpConfirmed: false,
        roleConfirmed: false,
      })
    ).toBe("needs_review");
  });

  it("hypothesis-only → no targeting relevance", () => {
    const score = computeScore({
      icpConfirmed: false,
      targetingRelevant: false,
      evidenceAgeDays: null,
      freshnessWindowDays: 90,
      roleConfirmed: false,
      sourceQuality: "insufficient",
      emailEvidence: "none",
    });
    expect(score.targeting_relevance).toBe(0);
  });
});
