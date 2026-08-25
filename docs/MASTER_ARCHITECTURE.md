# Master Product Requirements Document (PRD) & Technical Specifications

**Project**: Prospect PAL — Autonomous GTM Outbound Engine & Agent Platform  
**Version**: 2.0.0 Production  
**Design System**: Pure White Premium / Modern LLM Unified Interface (Inspired by AgentX, Modelence, Lazylines & Dribbble Top SaaS)  
**Standard**: AWS Well-Architected Framework & Enterprise SDLC

---

## 1. Executive Summary & Project Overview

Prospect PAL is an autonomous Revenue Architecture & Prospect Automation Agent platform that transforms plain-English ICP briefs into production-grade, 5-Pillar n8n outbound workflows with verified contact waterfalls (Apollo/Clay), CRM collision protection (HubSpot/Salesforce), 3-sentence AI PAS email scripts, and automated sequencer enrollment (Smartlead/Instantly).

The platform operates as a multi-agent ecosystem:
1. **GTM Architect & n8n Systems Engineer Agent**: Translates ICP criteria into 9-node canonical n8n JSON graphs.
2. **CRM Setup & Deduplication Shield Agent**: Configures OAuth CRM pipelines to eliminate customer collisions.
3. **Enably / Sales Greatness Growth Agent**: Authors high-converting multi-angle PAS cold email scripts and A/B variants.
4. **Execution QA & Run Analyst Agent**: Deep-diagnoses live n8n execution telemetry (`runData`), resolves errors, and verifies system reliability to a 9/10+ standard.

---

## 2. Tech Stack & Infrastructure Matrix

| Category | Primary Technology | Fallback / Supported Alternatives | AWS Well-Architected / SDLC Rationale |
| :--- | :--- | :--- | :--- |
| **Hosting & Deployment** | AWS ECS / Vercel Edge | AWS Amplify, GCP Cloud Run | Zero-downtime rolling deploys, SSL automated termination, edge caching. |
| **Database & ORM** | AWS DynamoDB / Supabase PostgreSQL | AWS Aurora Serverless, PostgreSQL | Low-latency key-value session lookups with document indexing. |
| **Object & Blob Storage**| AWS S3 | Supabase Storage, Cloudflare R2 | Presigned URL asset delivery, immutable workflow artifact archives. |
| **Authentication & IAM**| AWS Cognito / Supabase Auth | Clerk, NextAuth v5 | JWT RS256 token verification, OAuth2 social & SSO, RBAC workspace scopes. |
| **Payments & Billing** | Stripe / HubSpot Payments | Paddle, LemonSqueezy | Webhook-driven entitlements: $19.99 DIY, $99/mo Pro BYOK, $999+ Custom. |
| **Secrets & Keys** | AWS Secrets Manager | Vercel Environment Secrets | Strict BYOK encryption at rest with automated rotation. |
| **AI LLM Engine** | AWS Bedrock (Claude 3.5 Sonnet / Haiku) & OpenAI | Anthropic Direct, DeepSeek, OpenRouter | Deterministic schema outputs via Zod tool definitions & structured JSON. |
| **Agent Harness** | Next.js API Routes + Composio SDK | LangChain Agent Executor, n8n REST | Instance-level MCP control plane and direct workflow execution. |
| **Frontend Framework** | Next.js 16 (App Router), React 19, TypeScript | Tailwind CSS v4, Vanilla CSS Design System | Instant SSR, optimal Core Web Vitals, zero layout shifts. |
| **Chat & Canvas UI** | Custom Glass Canvas + Assistant-UI | React Flow, Canvas2D API | Seek-safe, responsive 60fps canvas node rendering and interactive zoom/pan. |

---

## 3. Site Map & Information Architecture

```
[Prospect PAL Platform]
├── (Marketing / Public)
│   ├── /home (White Premium Landing Page, Live Canvas Demo, Video Tour, Pricing)
│   ├── /login (Cognito / Supabase Sign In)
│   └── /signup (Onboarding & Plan Selection)
├── (Dashboard Workspace - Authenticated)
│   ├── /dashboard (Workspace Shell)
│   │   ├── [Home View] (Metrics, Pipeline Health, Recent Builds, Quick Actions)
│   │   ├── [Builder View] (AI Chat Intake + Visual Form + 9-Node n8n Canvas)
│   │   ├── [Wizard View] (Step-by-step Onboarding & CRM Key Injector)
│   │   ├── [Outputs View] (.n8n.json, BUILD_PROMPT, .env, PRD, Direct Deploy)
│   │   ├── [Scripts Studio View] (A/B Testing PAS Email Lab & Themes)
│   │   ├── [Signals Lead Finder View] (n8n Tech Stack Scan & GTM Hiring Leads)
│   │   ├── [Execution Analyst View] (n8n Error Triage & Run Diagnostics)
│   │   ├── [Academy View] (Sales 101, Cold Calling Scripts, UYSG Mastery)
│   │   ├── [Projects View] (Campaign Repository & Multi-Workspace Manager)
│   │   └── [Settings View] (BYOK API Keys, Self-Hosted n8n Bridge, Composio)
└── (API Core Engine)
    ├── /api/compile (5-Pillar n8n JSON Compiler)
    ├── /api/chat (Interactive GTM Architect LLM Stream)
    ├── /api/scripts/generate (Multi-Theme PAS Copywriting Engine)
    ├── /api/signals/search (n8n Stack & Hiring Lead Search)
    ├── /api/n8n/deploy (Direct Self-Hosted Instance Push)
    ├── /api/analyze (n8n Execution Run Diagnostic Analyst)
    └── /api/auth/* (Session Management & Sign Out)
```

---

## 4. System Architecture & 5-Pillar Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             PROSPECT PAL PLATFORM                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                1. User Inputs ICP / Tech Stack Brief
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AUTONOMOUS GTM COMPILATION ENGINE                        │
│  [ Trigger ] ➔ [ CRM Shield ] ➔ [ Reveal ] ➔ [ AI PAS ] ➔ [ Sequencer ]    │
└─────────────────────────────────────────────────────────────────────────────┘
          │                            │                            │
          ▼                            ▼                            ▼
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   .n8n.json      │         │ BUILD_PROMPT.md  │         │ email-scripts.md │
│ Production Graph │         │ Step-by-Step Ops │         │ 3-Sentence PAS   │
└──────────────────┘         └──────────────────┘         └──────────────────┘
          │                            │                            │
          └────────────────────────────┼────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   DEPLOYMENT & EXECUTION HARNESS                            │
│  • Direct Self-Hosted n8n Push (REST / Webhooks)                            │
│  • Composio Tool Integration (HubSpot, Apollo, Smartlead)                   │
│  • Execution Analyst Real-Time Health & Error Triage                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Jobs To Be Done (JTBD)

### A. End-User Product Jobs
1. **Effortless Pipeline Assembly**: "When I need a modern outbound revenue system, I want to describe my target market in plain English, so that I get a production-ready, multi-node automation without hiring a $15,000 agency."
2. **CRM Protection**: "When scaling cold volume, I want automated deduplication against my CRM of record, so my reps never contact active pipeline deals or existing clients."
3. **High-Converting Copy**: "When launching sequences, I want hyper-tailored 3-sentence Problem-Agitate-Solve copy, so my reply rates consistently hit 6–10%."
4. **Self-Hosted Ownership**: "When deploying infrastructure, I want full ownership of the n8n JSON and API keys, so I am never locked into proprietary per-seat platforms."

### B. Development & Engineering Jobs
1. **Deterministic Node Compilation**: Guarantee valid n8n expression syntax (`={{ $json.domain }}`) and node schema conformance.
2. **Comprehensive Error Triage**: Parse n8n execution error objects (`runData[node][0].error`) into instant remediations with 95%+ diagnostic accuracy.
3. **Secure BYOK Architecture**: Zero credential leakage via encrypted DynamoDB / AWS Secrets storage.
4. **9/10+ Reliability Benchmark**: Validate every UI transition, compilation API, and script generator across unit, integration, and end-to-end tests.

---

## 6. GTM Playbook & Product Roadmap

### Phase 1: Launch & Foundation (Current Release)
- Pure White Premium UI (Inspired by top Dribbble LLM platforms).
- Full 5-Pillar 9-Node Generator emitting `.n8n.json`, `BUILD_PROMPT.md`, `.env.template`, `PRD.md`, `email-framework.md`.
- Tiered Pricing Engine: $19.99 DIY Package, $99/mo Pro BYOK, $999-$9,999+ Custom Builds.
- Scripts Studio with multi-angle PAS generation.
- Real-time n8n Tech Signal & GTM Hiring Lead Discovery.

### Phase 2: Autonomous Self-Healing Workflows
- Automated webhook listener for failed n8n executions.
- Auto-remediation agent that hot-patches rate limits and expired API keys.
- Chrome Extension for 1-click ICP scraping directly from LinkedIn Sales Navigator.

### Phase 3: Enterprise Agency Multi-Tenancy
- Client workspace partitioning with sub-account billing.
- White-label export branding for GTM consultancies.
