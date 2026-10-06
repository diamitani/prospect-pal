# Product & Functional Specifications Document
**Document Type:** Technical & Functional Specification  
**Project:** Prospect PAL Full-Stack GTM Automation Engine  
**Version:** v2.0.0-PROD  
**Status:** Approved  
**Owner:** Engineering & Systems Architecture  
**Upstream:** [08-prd.md](file:///Users/patmini/prospect-pal/docs/08-prd.md), [MASTER_ARCHITECTURE.md](file:///Users/patmini/prospect-pal/docs/MASTER_ARCHITECTURE.md)  

---

## 1. Functional Requirements (FR)

### Module 1: ROSTR v2 Runtime & Multi-Agent Swarm
- **FR-001 (NPAO Classification):** The engine MUST classify any inbound request into one of four NPAO operations:
  - *Navigate (N):* Workspace and pipeline state inspection.
  - *Prioritize (P):* Hard-gate verification (10 gates required before build eligibility).
  - *Allocate (A):* Node & tool matching (Apollo vs Clay, HubSpot vs Salesforce).
  - *Orchestrate (O):* Graph assembly and compilation.
- **FR-002 (Dynamic Agent & Skill Loading):** Core agents (`GTM Architect`, `CRM Shield`, `Enably Copywriter`, `Execution Analyst`) and skills (`prospect-pal-*`, `uysg-*`) MUST be loaded lazily into the agent context based on intent triggers.
- **FR-003 (Working Versions & Isolation):** The backend MUST support versioned agent harnesses (`src/lib/agents/v1`, `src/lib/agents/v2`, `src/lib/agents/canary`) enabling zero-downtime A/B testing of prompt engineering strategies.
- **FR-004 (Execution Analyst Telemetry):** The system MUST parse raw n8n `runData` telemetry, diagnose rate limits, 401/403 auth errors, and malformed payload nodes, and return an automated remediation plan.

### Module 2: 5-Pillar GTM Compilation Engine
- **FR-010 (5-Pillar Pipeline Generation):** On input of company profile + ICP, the compiler MUST generate:
  1. *Node 01:* Cron Schedule (Daily 9am EST) or Webhook CSV ingest.
  2. *Node 02:* Data Normalizer (lowercase domains, clean whitespace, extract first/last name).
  3. *Node 03:* CRM Dedupe & Shield (HubSpot / Salesforce / Pipedrive / Attio search before reveal).
  4. *Node 04:* Waterfall Contact Reveal & Email Verification (Apollo / Clay / Dropcontact + MX check).
  5. *Node 05:* Deep Account Research & 3-Sentence PAS Copy Generation.
  6. *Node 06:* Human / Auto Approval Gate.
  7. *Node 07:* CRM Contact & Deal Upsert.
  8. *Node 08:* Sequencer Campaign Enrollment (Smartlead / Instantly / Lemlist).
  9. *Node 09:* Slack / Discord Alert on High-Value Lead or Review Required.
- **FR-011 (Zod Schema Validation):** Every compiled JSON payload MUST strictly adhere to the n8n Workflow Schema v1, preventing import errors on self-hosted instances.
- **FR-012 (Script Lab & PAS Copywriting):** The copy engine MUST author 3 distinct angles per persona:
  - *Angle A (Pain Point & Velocity):* Focus on time/revenue lost.
  - *Angle B (Peer Social Proof):* Focus on industry benchmarks and case study metrics.
  - *Angle C (Soft Observation):* Low-friction open question.

### Module 3: Vercel AI Stack & Multi-Provider AI Gateway
- **FR-020 (Resilient Multi-Provider Failover):** The AI Gateway MUST execute calls with hierarchical failover:
  `Primary: Anthropic Direct (Claude 3.5 Sonnet)` $\rightarrow$ `Fallback 1: OpenAI (GPT-4o)` $\rightarrow$ `Fallback 2: Google Gemini (Gemini 2.5/3 Flash)` $\rightarrow$ `Fallback 3: AWS Bedrock (Claude 3.5)`.
- **FR-021 (Streaming UI & Tool Calling):** The chat interface MUST use Vercel AI SDK Core (`streamText`) with structured tool definitions (`searchWeb`, `updateWorkflowConfig`, `compileWorkflow`, `deployToN8N`).
- **FR-022 (BYOK Key Vault):** Users MUST be able to supply custom API keys (OpenAI, Anthropic, Gemini, AWS Bedrock) encrypted via AES-256-GCM in Supabase / AWS Secrets Manager.

### Module 4: Authentication, Tenancy & Payments
- **FR-030 (Multi-Tenant RBAC):** Supabase Auth JWTs MUST enforce Row-Level Security (RLS) on `workspaces`, `campaigns`, `runs`, and `credentials`.
- **FR-031 (Stripe Entitlements):** Stripe webhook events (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`) MUST update workspace plan tiers and feature allowances idempotently.

---

## 2. Non-Functional Requirements (NFR)

| Metric | Specification Target | Scale Target (100k+ MAU) | Verification Method |
| :--- | :--- | :--- | :--- |
| **Availability / Uptime** | 99.9% monthly availability | 99.99% multi-region | Synthetic uptime pingers (BetterUptime / Datadog) |
| **P95 API Latency** | < 250ms for cached routes, < 800ms for edge routes | < 150ms edge | Vercel Analytics & OpenTelemetry |
| **First Contentful Paint (FCP)** | < 1.0s (Desktop), < 1.4s (Mobile) | < 0.8s | Google Lighthouse / Chrome UX Report |
| **Time to Interactive (TTI)** | < 2.0s | < 1.5s | Core Web Vitals instrumentation |
| **Accessibility (a11y)** | WCAG 2.2 AA Compliance | WCAG 2.2 AAA on core paths | Automated Axe-core CI audit |
| **Security & Cryptography** | TLS 1.3, AES-256-GCM for secrets, Zero plain-text tokens | Hardware Security Module (KMS) | Static Code Analysis (Semgrep) & OWASP ZAP |
| **RPO / RTO** | RPO < 1 hour, RTO < 4 hours | RPO < 5 min (PITR), RTO < 15 min | Supabase / RDS automated backup drills |

---

## 3. Data Classification & Security Guardrails

| Classification | Examples | Storage Location | Protection Controls |
| :--- | :--- | :--- | :--- |
| **Public** | Marketing copy, public documentation, landing assets | Edge CDN / Static S3 | Global CDN caching, SRI integrity hashes |
| **Internal** | Anonymized usage telemetry, token count aggregates | Postgres / Analytics Warehouse | Role-based internal access |
| **Confidential** | Prospect emails, company ICP briefs, campaign notes | Postgres with RLS | Row-level tenant isolation, encrypted at rest |
| **Restricted** | Third-party API keys (Apollo, HubSpot, Stripe tokens) | Encrypted Vault / KMS | AES-256 envelope encryption, never logged |
