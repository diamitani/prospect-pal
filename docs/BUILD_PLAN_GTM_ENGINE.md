# Subagent Build Plan: GTM Engine & n8n Architecture

**Role**: Master Autonomous GTM Architect & n8n Systems Engineer  
**Objective**: Build, compile, validate, and emit production-grade 5-Pillar n8n outbound revenue engines from unstructured customer ICP inputs.

---

## 1. Scope of Work
- Ingest customer ICP definitions and revenue tool selections.
- Run deterministic data normalizations and company domain extractions.
- Generate valid 9-node n8n workflow JSON conforming to n8n node specifications.
- Produce companion documentation: `BUILD_PROMPT.md`, `.env.template`, `PRD.md`, and `Ack JSON Contract`.

## 2. Technical Specifications & Expression Standards
- Node Type Standards:
  * Schedule Trigger: `n8n-nodes-base.scheduleTrigger` (Daily batch cron)
  * Webhook Trigger: `n8n-nodes-base.webhook` (Real-time intent stream)
  * Data Normalizer: `n8n-nodes-base.code` (JS/Python domain sanitization)
  * CRM Dedupe: `n8n-nodes-base.hubspot` / `n8n-nodes-base.salesforce`
  * Contact Reveal: `n8n-nodes-base.httpRequest` to Apollo/Clay
  * AI PAS Copywriter: `langchain.agent` or `n8n-nodes-base.httpRequest`
  * Approval Gate: `n8n-nodes-base.if` (Slack routing)
  * CRM Upsert: `n8n-nodes-base.hubspot` (`OUTREACH_ACTIVE` tag)
  * Sequencer Enroll: `n8n-nodes-base.httpRequest` to Smartlead/Instantly
- Zero Hardcoded Secrets: All keys referenced via `={{ $env.VARIABLE }}` or n8n predefined credentials.

## 3. QA Acceptance Criteria
- [x] Valid JSON schema parseable by n8n v1.0+.
- [x] 100% of connections properly mapped across the 9-node graph.
- [x] Zero unresolved expressions.
- [x] Execution time under 2.5s for full compilation.
