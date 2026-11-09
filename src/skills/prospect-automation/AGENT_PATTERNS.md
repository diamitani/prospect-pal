# Agent patterns (from praecipio-gtm-engine, Salesgency-generic)

## Master + sub-agents
- **gtm-master** — classify request; dispatch to prospecting / n8n-engineer / execution-analyst; synthesize.
- **prospect-automation** — ICP accounts, enrich (free or BYOK), score, route tiers A/B/C.
- **n8n-engineer** — import-safe workflow JSON from `src/lib/templates/n8n/`.
- **execution-analyst** — diagnose runs with evidence; never claim healthy without data.

## Status discipline
- **LIVE** — running and verified
- **SPEC** — draft/plan, not built
- **NEEDS CREDENTIALS** — built, blocked on keys the operator provides

## Approval discipline
Anything that touches the real world (CRM writes, email sends, sequence enrollments) gets a written plan / preview and explicit approval first. HubSpot uses `/api/crm/hubspot/preview` → `/approve`.
