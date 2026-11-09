/**
 * Brief → plan.json (reversible defaults from prospector-skill).
 */

import type { EnrichmentMode, ProspectingPlan } from "./types";

export const DEFAULT_PLAN: ProspectingPlan = {
  icp: "",
  roles: ["VP Sales", "Head of Revenue", "Director of Sales Development"],
  geography: undefined,
  signals: ["hiring", "funding", "expansion"],
  exclusions: [],
  quantity_companies: 10,
  contacts_per_company: 2,
  freshness_days: 90,
  mode: "signal-driven",
  enrichment_mode: "free",
  output: ["plan.json", "leads.csv", "run_report.md"],
};

export function buildPlanFromBrief(
  brief: string,
  overrides: Partial<ProspectingPlan> = {}
): ProspectingPlan {
  const text = brief.trim();
  const roles: string[] = [];
  const roleHints = [
    /VP\s+[\w\s]+/gi,
    /Head of [\w\s]+/gi,
    /Director of [\w\s]+/gi,
    /Chief [\w\s]+ Officer/gi,
  ];
  for (const re of roleHints) {
    const m = text.match(re);
    if (m) roles.push(...m.map((s) => s.trim()));
  }

  const geoMatch = text.match(
    /\b(US|USA|United States|North America|EMEA|APAC|UK|Canada|Austin|Chicago|SF|NYC)\b/i
  );

  return {
    ...DEFAULT_PLAN,
    offer: overrides.offer,
    icp: overrides.icp || text.slice(0, 500) || "unspecified ICP — needs_review",
    roles: overrides.roles?.length
      ? overrides.roles
      : roles.length
        ? Array.from(new Set(roles)).slice(0, 8)
        : DEFAULT_PLAN.roles,
    geography: overrides.geography ?? geoMatch?.[0],
    signals: overrides.signals ?? DEFAULT_PLAN.signals,
    exclusions: overrides.exclusions ?? [],
    quantity_companies:
      overrides.quantity_companies ?? DEFAULT_PLAN.quantity_companies,
    contacts_per_company:
      overrides.contacts_per_company ?? DEFAULT_PLAN.contacts_per_company,
    freshness_days: overrides.freshness_days ?? DEFAULT_PLAN.freshness_days,
    mode: overrides.mode ?? "signal-driven",
    enrichment_mode: (overrides.enrichment_mode ??
      "free") as EnrichmentMode,
    output: overrides.output ?? DEFAULT_PLAN.output,
  };
}
