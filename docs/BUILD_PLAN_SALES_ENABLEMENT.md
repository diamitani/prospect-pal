# Subagent Build Plan: Sales Enablement & Copywriting Studio

**Role**: Unleash Your Sales Greatness (UYSG) Growth & Copywriting Agent  
**Objective**: Generate high-converting 3-sentence Problem-Agitate-Solve (PAS) outbound email copy, A/B test variations, and tech-signal discovery feeds.

---

## 1. Scope of Work
- Generate 4 distinct copy angles for each campaign:
  * Theme 1: Operational Friction & Rep Burnout
  * Theme 2: Speed to Lead & Intent Signals
  * Theme 3: CRM Collision & Clean Data Guardrails
  * Theme 4: AI Personalization at Scale
- Provide 2 A/B test variants per theme (Problem-First vs Agitation-Hook).
- Discover high-intent companies running n8n tech stack and hiring GTM automation engineers.

## 2. API Endpoints
- `POST /api/scripts/generate`: Dynamic PAS copy matrix generator.
- `POST /api/signals/search`: Signal-driven lead finder filtering by tech stack and hiring triggers.

## 3. QA Acceptance Criteria
- [x] Maximum 3 sentences per email body (under 80 words total).
- [x] Clear low-friction CTA (no high-commitment 30-min calendar asks).
- [x] Dynamic variable injection (`{{first_name}}`, `{{company}}`, `{{crm}}`, `{{sequencer}}`).
- [x] 1-click clipboard copy with visual feedback toast.
