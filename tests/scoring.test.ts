import { describe, expect, it } from "vitest";
import {
  classifyDisposition,
  computeScore,
  scoreEmailEvidence,
  scoreRecency,
  tierFromScore,
} from "@/lib/prospecting/scoring";

describe("scoring rubric v0.3.0", () => {
  it("scores full signal-driven happy path to Tier A", () => {
    const s = computeScore({
      icpConfirmed: true,
      targetingRelevant: true,
      evidenceAgeDays: 10,
      freshnessWindowDays: 90,
      roleConfirmed: true,
      sourceQuality: "primary",
      emailEvidence: "exact_valid",
    });
    expect(s.total).toBe(100);
    expect(tierFromScore(s.total)).toBe("A");
  });

  it("guessed email alone adds 0 email evidence", () => {
    expect(scoreEmailEvidence("guessed")).toBe(0);
    expect(scoreEmailEvidence("exact_valid", true)).toBe(0); // catch-all
  });

  it("recency windows: 15 / 8 / 0", () => {
    expect(scoreRecency(5, 90)).toBe(15);
    expect(scoreRecency(45, 90)).toBe(8);
    expect(scoreRecency(120, 90)).toBe(0);
    expect(scoreRecency(null, 90)).toBe(0);
  });

  it("catch-all never SURE", () => {
    const s = computeScore({
      icpConfirmed: true,
      targetingRelevant: true,
      evidenceAgeDays: 5,
      freshnessWindowDays: 90,
      roleConfirmed: true,
      sourceQuality: "primary",
      emailEvidence: "exact_valid",
      isCatchAll: true,
    });
    expect(s.email_evidence).toBe(0);
    const d = classifyDisposition({
      score: { ...s, email_evidence: 0, total: s.total },
      verificationStatus: "accept_all",
      isCatchAll: true,
      icpConfirmed: true,
      roleConfirmed: true,
    });
    expect(d).toBe("needs_review");
  });

  it("example from SCORING.md: 90 Tier A needs_review without valid email", () => {
    const s = computeScore({
      icpConfirmed: true,
      targetingRelevant: true,
      evidenceAgeDays: 5,
      freshnessWindowDays: 90,
      roleConfirmed: true,
      sourceQuality: "primary",
      emailEvidence: "guessed",
    });
    expect(s.total).toBe(90);
    expect(tierFromScore(s.total)).toBe("A");
    expect(
      classifyDisposition({
        score: s,
        verificationStatus: "not_checked",
        icpConfirmed: true,
        roleConfirmed: true,
      })
    ).toBe("needs_review");
  });
});
