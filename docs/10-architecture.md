# System Architecture Document — Prospect PAL v2.0
**Document Type:** System Architecture & Topology Spec  
**Project:** Prospect PAL Full-Stack GTM Automation Engine  
**Version:** v2.0.0-PROD  
**Stack:** Vercel AI Suite · Supabase · Stripe · SignalWire · Next.js 16 · React 19  
**Specification:** [Web App Development Process.md](file:///Users/patmini/prospect-pal/Web%20App%20Development%20Process.md)  
**Status:** Approved  

---

## 1. C4 Architecture Models

### 1.1 Level 1: System Context Diagram

```mermaid
C4Context
    title System Context Diagram for Prospect PAL (Vercel + Supabase Cloud-Native)

    Person(user, "Revenue Operator / Founder", "Builds & manages automated outbound campaigns and lead pipelines.")
    System(prospectPal, "Prospect PAL Platform", "Autonomous GTM Automation Engine, Multi-Agent Swarm & Visual Graph Canvas.")

    System_Ext(apollo, "Apollo / Clay", "Contact discovery & waterfall enrichment API.")
    System_Ext(crm, "HubSpot / Salesforce", "Customer Relationship Management & Deduplication Shield.")
    System_Ext(sequencer, "Smartlead / Instantly", "Cold email sequencing & inbox rotation infrastructure.")
    System_Ext(vercelGateway, "Vercel AI Gateway", "Anthropic Claude 3.5, OpenAI GPT-4o, Google Gemini.")
    System_Ext(signalwire, "SignalWire Voice API", "Conversational AI voice qualification & live transfer.")
    System_Ext(n8nInstance, "Self-Hosted n8n Instance", "Production workflow execution engine.")

    Rel(user, prospectPal, "Interacts via Web Chat, Wizard & Interactive Canvas", "HTTPS / WSS")
    Rel(prospectPal, vercelGateway, "Executes streaming prompt chains & tool calling", "REST / JSON")
    Rel(prospectPal, apollo, "Fetches enriched contact records", "HTTPS")
    Rel(prospectPal, crm, "Queries & updates CRM contacts & deals", "OAuth2 / REST")
    Rel(prospectPal, sequencer, "Enrolls verified prospects into campaigns", "API Key")
    Rel(prospectPal, signalwire, "Triggers AI voice calls & qualification", "REST / WSS")
    Rel(prospectPal, n8nInstance, "Deploys & monitors compiled workflow JSON", "REST API")
```

---

### 1.2 Level 2: Container Diagram

```mermaid
graph TD
    subgraph ClientBrowser [Client Browser Experience]
        UI[Next.js 16 App Router / React 19 Client Islands]
        Canvas[Interactive 9-Node Canvas / React Flow]
        ChatWidget[Assistant-UI Streaming Chat]
    end

    subgraph VercelEdge [Vercel Edge & Serverless Tier]
        WAF[Vercel Security & DDoS WAF Shield]
        EdgeCache[Edge Middleware & Static Cache]
        API[Serverless Next.js API Routes]
        AIGateway[Vercel AI Gateway: Smart Routing & Fallback]
        WorkflowRunner[Vercel Workflow / Inngest Engine]
        SandboxContainer[Vercel Sandbox / Isolated Code Runtime]
    end

    subgraph BackendAgentCore [Artispreneur-Style Modular Engine]
        Agents[Agents: GTM Architect, CRM Shield, Copywriter, Analyst]
        SubAgents[Sub-Agents: Normalizer, Waterfall Reveal, Email Verifier]
        Skills[Skills: DDC Plan, PAS Copy, Error Triage]
        Tools[Tools: Apollo, HubSpot, Smartlead, Web Search]
        Memory[Memory: Short-Term Session & Vector Store]
        Compiler[5-Pillar n8n JSON & PAS Script Compilers]
    end

    subgraph Persistence_Commerce [Supabase & Commerce Cloud]
        Postgres[(Supabase PostgreSQL 16 + RLS)]
        AuthService[Supabase Auth: OAuth, Google, GitHub, Magic Links]
        StorageBucket[(Supabase Storage Bucket: Artifacts)]
        StripePortal[Stripe Payments, Billing & Webhooks]
        VoiceGateway[SignalWire Voice & SIP API]
    end

    UI --> WAF
    Canvas --> WAF
    ChatWidget --> WAF
    WAF --> EdgeCache
    EdgeCache --> API
    API --> AIGateway
    API --> WorkflowRunner
    API --> BackendAgentCore
    BackendAgentCore --> SandboxContainer
    BackendAgentCore --> Postgres
    BackendAgentCore --> StorageBucket
    API --> AuthService
    API --> StripePortal
    API --> VoiceGateway
```

---

## 2. Sequence Diagrams

### 2.1 5-Pillar Campaign Compilation & Verification Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Revenue Operator
    participant UI as Chat & Visual Canvas
    participant API as API Route (/api/chat)
    participant ROSTR as ROSTR v2 Orchestrator
    participant Gateway as Vercel AI Gateway
    participant CRM as CRM Dedupe Shield (HubSpot)
    participant Compiler as 5-Pillar Compiler
    participant DB as Supabase Postgres + RLS

    User->>UI: Inputs ICP Brief ("B2B SaaS selling DevOps tools...")
    UI->>API: POST /api/chat { messages, sessionId }
    API->>ROSTR: Parse & Ambiguity Scan (PAL Method)
    ROSTR->>Gateway: streamText with Tool Calling
    Note over Gateway: Tries Anthropic Claude 3.5 -> OpenAI GPT-4o -> Google Gemini
    Gateway-->>ROSTR: Extracted 10 Hard Gates & Tool Calls
    ROSTR->>CRM: Check active accounts/deals
    CRM-->>ROSTR: Dedupe rules verified
    ROSTR->>Compiler: Compile 9-node JSON + PAS Email Scripts
    Compiler-->>ROSTR: Validated n8n JSON payload
    ROSTR->>DB: Persist Run Artifact & Session State
    ROSTR-->>API: Stream tokens + emit 'updateWorkflowConfig' event
    API-->>UI: Real-time SSE Stream + Interactive Graph Update
    UI-->>User: Renders Canvas & displays Ready-to-Deploy Badge
```

---

## 3. Artispreneur-Style Architecture Design

The backend is strictly organized into decoupled, modular namespaces:

```
src/lib/
├── agents/                  # Autonomous Agents Directory
│   ├── gtm-architect.ts     # 5-Pillar compiler & graph architect
│   ├── crm-shield.ts        # Zero-collision CRM protection
│   ├── copywriter.ts        # 3-Sentence PAS email copywriter
│   └── execution-analyst.ts # n8n runData telemetry triage & fix agent
├── sub-agents/              # Delegated Sub-Agents for Task Splitting
│   ├── normalizer.ts        # Domain sanitization & name parsing
│   ├── waterfall-reveal.ts  # Multi-provider contact reveal (Apollo/Clay)
│   ├── email-verifier.ts    # MX record, SMTP handshake & bounce shield
│   └── sequencer-enroller.ts# Smartlead / Instantly campaign enrollment
├── skills/                  # Repeatable Execution Workflows
│   ├── ddc-plan/            # 11-stage campaign planning skill
│   ├── pas-copywriting/     # 3-sentence Problem-Agitate-Solution generator
│   └── error-triage/        # n8n execution telemetry diagnostic skill
├── tools/                   # Platform & Service Connectors (MCP)
│   ├── apollo.ts            # Apollo search & reveal connector
│   ├── hubspot.ts           # HubSpot CRM OAuth & dedupe connector
│   ├── smartlead.ts         # Smartlead campaign & lead connector
│   └── web-search.ts        # Live DuckDuckGo / Tavily research
├── functions/               # Atomic Tasks (Normalize, Hash, Validate)
├── knowledge/               # Static RAG Knowledge & Prompt Catalogs
├── memory/                  # Session & Ephemeral Context Management
├── instructions/            # Canonical System Prompts & Guardrails
├── harness/                 # Runtime Agent Harness Wiring
├── gateway/                 # Vercel AI Multi-Provider Failover Gateway
└── sandbox/                 # Secure Isolated Code Execution Environment
```
