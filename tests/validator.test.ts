import { describe, expect, it } from "vitest";
import {
  leadsToCsv,
  neutralizeFormulaCell,
  validateLead,
  validateLeads,
} from "@/lib/prospecting/validator";
import type { ProspectLead } from "@/lib/prospecting/types";

const base: ProspectLead = {
  id: "lead_1",
  company: "Acme",
  domain: "acme.com",
  contact_name: null,
  title: null,
  profile_url: null,
  email: null,
  signal: null,
  signal_event_date: null,
  source_urls: [],
  provenance: null,
  dns_status: "mx_ok",
  verification_status: "not_checked",
  disposition: "needs_review",
  score_breakdown: null,
  icp_score: 40,
  tier: "C",
  blockers: ["no_named_contact_from_permitted_sources"],
  status: "ready",
};

describe("validator", () => {
  it("allows null email (unknown)", () => {
    expect(validateLead(base)).toEqual([]);
  });

  it("rejects accept_all as sure", () => {
    const issues = validateLead({
      ...base,
      verification_status: "accept_all",
      disposition: "sure",
      email: "a@acme.com",
    });
    expect(issues.some((i) => i.message.includes("accept_all"))).toBe(true);
  });

  it("rejects null_mx + valid", () => {
    const issues = validateLead({
      ...base,
      dns_status: "null_mx",
      verification_status: "valid",
      email: "a@acme.com",
    });
    expect(issues.length).toBeGreaterThan(0);
  });

  it("neutralizes formula cells and exports csv", () => {
    expect(neutralizeFormulaCell("=1+1")).toBe("'=1+1");
    const csv = leadsToCsv([base]);
    expect(csv.split("\n")[0]).toContain("lead_id");
    expect(csv).toContain("lead_1");
  });

  it("flags duplicate ids", () => {
    const r = validateLeads([base, { ...base }]);
    expect(r.ok).toBe(false);
  });
});
