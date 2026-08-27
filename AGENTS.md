<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# AGENTS.md — Delali Development Cycle Planning Runtime

## Prospect PAL Campaign Builder

On any request to build, create, or configure a prospect automation campaign or n8n workflow:

1. **Do not wait for a special prompt.** Trigger automatically.
2. **Load `ddc-planning-harness.md`** and skill `ddc-plan`.
3. **Create or resume a run** with `ddc-planning-runtime.ts` rules.
4. **Walk stages in order.** One artifact per turn. One question if blocked.
5. **`education_mode` defaults true:** Teach in simple language, then write the executive doc.
6. **Do not generate workflow JSON** until `build_eligible` is true.

## PAL Methodology

Every campaign runs through:
- **Parse**: What was explicitly asked?
- **Ambiguity Scan**: What's missing (CRM? data tool? approval policy)?
- **Latent Intent**: What job is the user hiring this campaign for?
- **Expand**: Fill ICP, messaging, analytics without 50 questions.
- **Compile**: Package for the workflow builder.

## ROSTR Framework

- **Navigate**: Determine current DDC stage
- **Prioritize**: Hard gates before nice-to-haves
- **Allocate**: Right tool/node for each job
- **Orchestrate**: 9-node pipeline in fixed order

## Hard Gates (must collect before compile)

| # | Gate | Example |
|---|------|---------|
| 1 | Company background | "B2B SaaS selling DevOps tools" |
| 2 | Product/offer/proof | "CI/CD platform, 30% faster deploys" |
| 3 | ICP | "50-500 employees, Series A+, using GitHub" |
| 4 | Persona | "VP Engineering, DevOps Lead" |
| 5 | Data tool | Apollo, Clay, ZoomInfo |
| 6 | CRM | HubSpot, Salesforce, Pipedrive |
| 7 | Outreach | Smartlead, Instantly, HubSpot Sequences |
| 8 | LLM | Anthropic, OpenAI, Bedrock |
| 9 | Trigger type | `search` (daily) or `csv` (webhook) |
| 10 | Approval policy | auto-send, human approval, draft-only |

## 9-Node Pipeline

```
01 Intake & Cron    → 02 Normalizer     → 03 CRM Dedupe
       ↓                    ↓                   ↓
04 Data Adapter    → 05 Research+PAS   → 06 Approval
       ↓                    ↓                   ↓
07 CRM Upsert      → 08 Enroll         → 09 Review Alert
```

## Forbidden

- Secrets in JSON, prompts, chat, or ack
- Skipping stages
- Live enroll/send in fresh compile
- Production deploys without approval
- Claiming "tested" unless TEST.md ran

## Quality Gates

Score ≥ 4/5 on: contract, taste, usefulness, security, reliability, performance, ops, scale.

Build is locked until quality passes.
