# Step-by-Step Prompt Build Catalog & Section Refinement Playbook
**Document Type:** Build Prompts & Iterative Engineering Catalog  
**Project:** Prospect PAL Full-Stack GTM Automation Engine  
**Version:** v2.0.0-PROD  
**Status:** Approved  

---

## 1. How to Use this Build Catalog

This catalog contains precise, copy-pasteable **Execution Prompts** designed to configure, refine, and deep-dive into each individual subsystem of the Prospect PAL platform. When pair-programming with an agent or building in Cursor/AntiGravity/Claude Code, pass these prompts sequentially.

---

## 2. Master Section Build Prompts

### Prompt 01: Core ROSTR v2 Runtime & Multi-Agent Swarm Configuration
```markdown
Context: Prospect PAL Full-Stack GTM Automation Engine.
Task: Configure the ROSTR v2 Multi-Agent Swarm with dynamic skill loading.
Requirements:
1. Implement the 4 specialized agents: GTM Architect, CRM Dedupe Shield, Enably Copywriter, and Execution Analyst in `src/lib/agents/v2/`.
2. Connect the NPAO classifier (`src/lib/rostr/npao-classifier.ts`) to route intents dynamically.
3. Ensure each agent has access to its respective system prompt, tools, and Zod output schemas.
4. Add telemetry logging to record execution latency, token counts, and tool invocations.
```

### Prompt 02: Resilient AI Multi-Provider Gateway & Fallback
```markdown
Context: Prospect PAL AI Gateway Integration.
Task: Harden `src/lib/ai/index.ts` with multi-provider auto-failover to eliminate single-provider outages.
Requirements:
1. Implement sequential failover: Anthropic Direct (Claude 3.5 Sonnet) -> OpenAI (GPT-4o) -> Google Gemini (Gemini 2.5/3 Flash) -> AWS Bedrock.
2. Catch 401, 403, 429, and 5xx errors automatically and retry on the next provider.
3. Support BYOK (Bring Your Own Key) where user-supplied keys take precedence over system default keys.
4. Support streaming responses via Vercel AI SDK Core (`streamText`).
```

### Prompt 03: 5-Pillar Outbound Compiler & n8n JSON Graph Generation
```markdown
Context: Prospect PAL 5-Pillar Compiler.
Task: Build the deterministic n8n Workflow JSON compiler in `src/lib/workflow-generator.ts`.
Requirements:
1. Output valid n8n Workflow Schema v1 containing the 9 canonical nodes:
   - Node 01: Cron / Ingest Trigger
   - Node 02: Data Normalizer
   - Node 03: CRM Deduplication Shield (HubSpot/Salesforce)
   - Node 04: Waterfall Reveal & Verification (Apollo/Clay)
   - Node 05: Deep Account Research & PAS Copywriting
   - Node 06: Approval Gate
   - Node 07: CRM Upsert
   - Node 08: Sequencer Enrollment (Smartlead/Instantly)
   - Node 09: Slack Review Alert
2. Provide direct JSON export and deployment via n8n REST API.
```

### Prompt 04: Pure White Premium UI & 9-Node Interactive Canvas
```markdown
Context: Prospect PAL Frontend & Design System.
Task: Build the Dual-Pane GTM Studio in `src/app/(dashboard)/builder/page.tsx`.
Requirements:
1. Apply the Pure White Premium design system (`src/styles/tokens.css`).
2. Left Pane: Assistant-UI streaming chat with live tool call feedback and campaign intake wizard.
3. Right Pane: Interactive 9-Node Canvas using React Flow (`@xyflow/react`) with custom SVG node components, animated edge splines, and live zoom/pan controls.
4. Ensure 60fps animations, zero layout shifts, and full responsiveness across 375px (mobile) and 1440px (desktop).
```

### Prompt 05: Execution Analyst & n8n Error Diagnostics
```markdown
Context: Prospect PAL Execution QA & Run Diagnostics.
Task: Build the self-healing telemetry parser in `src/lib/rostr/execution-analyst.ts` and UI in `/app/[workspace]/analyst`.
Requirements:
1. Parse raw n8n `runData` execution trees.
2. Identify root-cause errors: 429 rate limits, 401 expired API keys, malformed JSON keys, and missing contact properties.
3. Generate a structured remediation report with 1-click retry payloads.
```

### Prompt 06: Stripe Payments, Entitlements & Webhooks
```markdown
Context: Prospect PAL Commerce & Billing.
Task: Implement Stripe Checkout and webhook handling in `src/app/api/webhooks/stripe/route.ts`.
Requirements:
1. Support 3 plans: Free Trial (3 runs), Pro BYOK ($99/mo, unlimited runs), Enterprise ($999/mo).
2. Verify Stripe webhook signatures cryptographically.
3. Upsert workspace entitlements idempotently upon `checkout.session.completed` and `customer.subscription.updated`.
4. Provide a self-serve Stripe Customer Portal link in workspace settings.
```
