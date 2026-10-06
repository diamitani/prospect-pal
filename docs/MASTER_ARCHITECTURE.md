# Master Architecture & Technical Specifications — Prospect PAL v2.0

**Project**: Prospect PAL — Autonomous GTM Outbound Engine & Agent Platform  
**Version**: 2.0.0 Production  
**Design System**: Pure White Premium / Modern LLM Unified Interface (Inspired by AgentX, Modelence, Lazylines)  
**Governing Standard**: [Web App Development Process.md](file:///Users/patmini/prospect-pal/Web%20App%20Development%20Process.md)  
**Cloud-Native Architecture**: Vercel AI Suite · Supabase · Stripe · SignalWire (Zero AWS)  

---

## 1. Executive Summary & Project Overview

Prospect PAL is an autonomous Revenue Architecture & Prospect Automation Agent platform that transforms plain-English ICP briefs into production-grade, 5-Pillar n8n outbound workflows with verified contact waterfalls (Apollo/Clay), CRM collision protection (HubSpot/Salesforce), 3-sentence AI PAS email scripts, and automated sequencer enrollment (Smartlead/Instantly).

The platform operates as a multi-agent ecosystem:
1. **GTM Architect & n8n Systems Engineer Agent**: Translates ICP criteria into 9-node canonical n8n JSON graphs.
2. **CRM Setup & Deduplication Shield Agent**: Configures OAuth CRM pipelines to eliminate customer collisions.
3. **Enably / Sales Greatness Growth Agent**: Authors high-converting multi-angle PAS cold email scripts and A/B variants.
4. **Execution QA & Run Analyst Agent**: Deep-diagnoses live n8n execution telemetry (`runData`), resolves errors, and verifies system reliability.

---

## 2. Tech Stack & Infrastructure Matrix (Zero AWS)

| Category | Primary Technology | Fallback / Supported Alternatives | Cloud-Native Rationale |
| :--- | :--- | :--- | :--- |
| **Hosting & Deployment** | Vercel Edge / Serverless | Netlify, Cloudflare Pages | Zero-downtime rolling deploys, automated SSL termination, edge caching. |
| **Database & ORM** | Supabase PostgreSQL 16 + RLS | Neon PostgreSQL | True relational schema with multi-tenant row-level security. |
| **Object & Blob Storage**| Supabase Storage | Cloudflare R2 | Direct SQL-level access policies, fast presigned URL downloads. |
| **Authentication & IAM**| Supabase Auth | Clerk, NextAuth v5 | JWT RS256 token verification, OAuth2 social & SSO, RBAC workspace scopes. |
| **Payments & Billing** | Stripe Billing & Customer Portal | Paddle, LemonSqueezy | Webhook-driven entitlements: $99/mo Pro BYOK, $999+ Enterprise. |
| **Voice & Phone AI** | SignalWire Voice API | Twilio | Conversational AI voice qualification and warm call transfer. |
| **AI LLM Engine** | Vercel AI Gateway (Claude 3.5, GPT-4o, Gemini) | Direct Anthropic / OpenAI | Multi-provider resilient auto-failover, zero 403 authorization locks. |
| **Agent Harness** | Next.js API Routes + Composio SDK + MCP | LangChain Agent Executor | Instance-level MCP control plane and direct workflow execution. |
| **Frontend Framework** | Next.js 16 (App Router), React 19, TypeScript | Tailwind CSS v4, Vanilla CSS Design System | Instant SSR, optimal Core Web Vitals, zero layout shifts. |
| **Chat & Canvas UI** | Assistant-UI + React Flow (`@xyflow/react`) | Custom SVG Canvas | 60fps interactive node rendering and visual graph inspection. |

---

## 3. Site Map & Information Architecture

```
[Prospect PAL Platform]
├── (Marketing / Public)
│   ├── /home (White Premium Landing Page, Live Canvas Demo, Video Tour, Pricing)
│   ├── /login (Supabase Sign In: OAuth & Magic Link)
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
    ├── /api/chat (Interactive GTM Architect LLM Stream via Vercel AI SDK)
    ├── /api/scripts/generate (Multi-Theme PAS Copywriting Engine)
    ├── /api/signals/search (n8n Stack & Hiring Lead Search)
    ├── /api/n8n/deploy (Direct Self-Hosted Instance Push)
    ├── /api/analyze (n8n Execution Run Diagnostic Analyst)
    └── /api/auth/* (Supabase Session Management)
```
