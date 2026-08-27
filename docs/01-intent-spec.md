# Intent Spec — Prospect PAL

**Artifact:** 01-intent-spec  
**Version:** v1.0.0  
**Status:** approved  
**Framework:** DDC / ROSTR

---

## Problem

GTM teams spend 60%+ of their time on manual prospecting tasks:
- Researching companies and contacts
- Writing personalized outreach
- Managing sequence enrollment
- Deduplicating against CRM

This creates a bottleneck where skilled salespeople do admin work instead of closing.

## Users

| Persona | Pain | Outcome |
|---------|------|---------|
| **Startups** | Building GTM from scratch | Scalable prospecting engine that grows with pipeline |
| **Solopreneurs** | No time for manual research | Automated outreach without hiring SDRs |
| **Sales Teams** | SDR capacity constraints | AI-powered research + personalized sequences |

## Solution

Prospect PAL generates custom n8n workflows that automate the entire prospect-to-pipeline journey:

1. **Intake**: Scheduled ICP search or CSV webhook
2. **Enrich**: Contact and company data via Apollo/Clay/ZoomInfo
3. **Research**: AI-powered pain point identification
4. **Messaging**: PAS-framework email sequences
5. **Enrollment**: Automatic sequence enrollment with approval gates

## Scope v1

**Now (must ship):**
- Campaign intake wizard (10 hard gates)
- 9-node workflow generation
- Export as n8n JSON
- Integration with: HubSpot, Salesforce, Apollo, Clay, Smartlead, Instantly
- AI research using Claude/OpenAI
- PAS email copy generation
- Human approval gate option

**Next (v1.1):**
- Deploy directly to user's n8n instance
- A/B email variants
- Campaign analytics
- LinkedIn message variants

**Later (v2+):**
- Multi-channel orchestration
- Reply handling
- Meeting booking integration
- Custom node builder

## Non-Goals

- We do not replace CRMs
- We do not send emails directly (we enroll in sequences)
- We do not provide data enrichment (we integrate with providers)
- We do not build a full marketing suite
- We do not support non-n8n workflow engines in v1

## Assumptions

1. User has an n8n instance (cloud or self-hosted)
2. User has accounts with their chosen data/CRM/outreach tools
3. User can configure API credentials
4. User understands basic prospecting concepts (ICP, persona, sequence)

## Acceptance Signals

| Metric | Target |
|--------|--------|
| Time to first workflow | < 15 minutes |
| Workflows that import successfully | 95% |
| Users who complete onboarding | 70% |
| Workflows that process 100+ prospects | 60% |

## Risks

| Risk | Mitigation |
|------|------------|
| API rate limits from data providers | Batching, backoff, quota warnings |
| Stale email copy | Regular template refresh, A/B testing |
| CRM data quality | Dedupe logic, merge handling |
| LLM hallucination in research | Structured prompts, citation requirements |

---

*Intent spec v1.0.0 — supersede with an ADR, do not silently edit.*
