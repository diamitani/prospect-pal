# Delali Development Cycle — Planning Harness

**Codename:** DDC Planning Runtime  
**Version:** 1.0.0  
**Product:** Prospect PAL — Campaign-based prospect automation workflow builder  
**Mode:** Planning is the default. Build is a later mode that may not start until every gate passes.  
**Education:** `education_mode: true` by default. The operator may turn it off.

---

## 0. Product Context: Prospect PAL

Prospect PAL generates **campaigns** — bundled configurations that include:
- **Tools**: CRM, data enrichment, outreach sequencer, LLM provider
- **ICP**: Ideal Customer Profile with firmographics, signals, disqualifiers
- **Messaging**: Product/service value proposition, PAS framework copy
- **Analytics**: Reporting and tracking configuration

The output is a **custom n8n workflow** the user owns — deployed to their instance or downloaded as JSON.

---

## 1. Invariants (never expire until an ADR says so)

1. PAL precedes execution. Parse → Ambiguity Scan → Latent Intent → Expand → Compile.
2. One material question at a time. Never a 40-field form.
3. Artifacts are versioned and not overwritten.
4. Secrets never live in git, client bundles, chat logs, or screenshots.
5. Side effects (payments, deploys, emails) require explicit approval.
6. Education mode defaults on. Explain each stage simply, then deliver the artifact.
7. Intake is 7th-grade reading. Output is executive-level.
8. Campaign type is a parameter. The road is not.
9. Build mode is locked until Quality ≥ 4/5 or a written waiver.
10. Factors that may change (stack, taste, vendors) live in ADRs.

---

## 2. The 9-Stage Cycle

```
created
  ↓ intake                 # DDC 1 — Capture campaign requirements
  ↓ pal_parse              # Parse stated vs inferred
  ↓ pal_ambiguity          # Identity? Payments? Data ownership?
  ↓ pal_latent             # What job is the campaign hired for?
  ↓ pal_expand             # Fill ICP, tools, messaging, analytics
  ↓ pal_compile            # Package for downstream
  ↓ intent                 # Fence: what v1 is and is not
  ↓ evidence               # Competitor research, quality bar
  ↓ jtbd                   # Primary job + metric
  ↓ npao                   # Now / Next / Later / Out
  ↓ documentation          # ICP, sitemap, flows, specs
  ↓ architecture           # System design + WAF answers
  ↓ gtm                    # Channels, AIDA, brand
  ↓ design_system          # Taste/tokens
  ↓ quality_plan           # Scorecard — unlock build
  ↓ scaffolding            # DDC 3 — Structure workflow
  ↓ scripts                # DDC 4 — Configure nodes
  ↓ connecting             # DDC 5 — Wire integrations
  ↓ deploying              # DDC 6 — Push to n8n (approval required)
  ↓ testing                # DDC 7 — Verify flow
  ↓ refining               # DDC 8 — Optimize
  ↓ maintaining            # DDC 9 — Ongoing support
  ↓ completed
```

Alternate states: `needs_clarification` · `awaiting_approval` · `blocked` · `cancelled`

---

## 3. Campaign Intake (Hard Gates)

Before generating any workflow, collect:

| Gate | What | Example |
|------|------|---------|
| 1 | Company background | "B2B SaaS selling DevOps tools" |
| 2 | Product/offer/proof | "CI/CD platform, 30% faster deploys" |
| 3 | ICP | "50-500 employees, Series A+, using GitHub" |
| 4 | Persona | "VP Engineering, DevOps Lead" |
| 5 | Data tool | Apollo, Clay, ZoomInfo, Amplemarket |
| 6 | CRM | HubSpot, Salesforce, Pipedrive, Attio |
| 7 | Outreach | Smartlead, Instantly, HubSpot Sequences |
| 8 | LLM | Anthropic, OpenAI, Bedrock |
| 9 | Trigger type | `search` (daily) or `csv` (webhook) |
| 10 | Approval policy | auto-send, human approval, draft-only |

If any gate is missing, ask ONE question. Do not quiz the user.

---

## 4. Stage Bible

### 4.1 Intake — DDC 1

**Why (simple):** We write down what you want so we don't build something else tomorrow.

**Output:** `campaign/intake/v1` immutable. Company, ICP, tools, goals.

**Gate:** All 10 hard gates answered or confidently inferred.

**Forbidden:** Generating workflow nodes. Promising timelines.

### 4.2 PAL Parse

**Why:** Separate "said" from "guessed."

**Output:** Every claim tagged `stated` or `inferred`.

### 4.3 PAL Ambiguity

**Why:** Missing auth, payments, or data ownership wrecks the build.

**Output:** At most one blocking question.

### 4.4 PAL Latent Intent

**Why:** People ask for a workflow. They hire a result (meetings, pipeline, revenue).

**Output:** "When I [situation], I want [action], so I can [outcome]."

### 4.5 PAL Expand

**Why:** Fill the details without 50 questions.

**Output:** Full ICP matrix, tool bindings, email templates, analytics events.

### 4.6 PAL Compile

**Why:** Package for the build stage.

**Output:** Instruction pack pointing to all artifacts.

### 4.7 Intent Spec

**Why:** Bound the campaign. Non-goals save months.

**Output:** `docs/01-intent-spec.md`

### 4.8 Evidence

**Why:** Quality needs real comparables.

**Output:** 3 competitor workflows, quality scores.

### 4.9 JTBD

**Why:** Features follow jobs.

**Output:** Primary job + success metric.

### 4.10 NPAO

**Why:** Now / Next / Later / Out stops gold-plating.

**Output:** v1 is: intake → enrich → research → copy → sequence. Later: analytics, A/B.

### 4.11 Documentation

Sitemap, flows, user stories, PRD, specs.

### 4.12 Architecture

System design + 6 Well-Architected answers.

### 4.13 GTM

ICP, AIDA messaging, channels.

### 4.14 Design System

Taste tokens, anti-slop.

### 4.15 Quality Plan

Score the plan. Unlock `build_eligible = true`.

### 4.16-4.22 Build Stages

| Stage | Does | Gate |
|-------|------|------|
| Scaffolding | Structure 9-node template | Nodes match intake |
| Scripts | Configure each node | HTTP requests valid |
| Connecting | Wire credentials | No secrets in JSON |
| Deploying | Push to n8n | Approval + test mode |
| Testing | Run with test data | Flow completes |
| Refining | Optimize copy, timing | Quality improved |
| Maintaining | Support changes | Runbook exists |

---

## 5. 9-Node Workflow Architecture

Every campaign compiles to this pipeline:

```
01 Intake & Cron    → 02 Normalizer     → 03 CRM Dedupe
       ↓                    ↓                   ↓
04 Data Adapter    → 05 Research+PAS   → 06 Approval
       ↓                    ↓                   ↓
07 CRM Upsert      → 08 Enroll         → 09 Review Alert
```

### Node Descriptions

1. **Intake & Cron** — Schedule trigger (daily ICP search) OR webhook (CSV upload)
2. **Normalizer** — Schema transform, field mapping, validation
3. **CRM Dedupe** — Check existing contacts/deals, skip if in pipeline
4. **Data Adapter** — HTTP Request to data tool for company enrich + people search
5. **Research + PAS** — AI node: company research → pain hypothesis → value prop
6. **Approval Switch** — Route to human approval or auto-proceed
7. **CRM Upsert** — Create or update contact + company in CRM
8. **Sequence Enroll** — Add to outreach sequence or direct mailbox send
9. **Review Alert** — Slack/email notification of enrolled prospects

---

## 6. Output Files

Each campaign compile produces:

```
campaign-output/
  workflow.json              # Importable n8n workflow
  ai/research.system_prompt.md
  ai/email.system_prompt.md
  CREDENTIALS.md             # Setup instructions (no secrets)
  TEST.md                    # QA checklist
  ack.json                   # Status, bindings, requires_connection[]
```

---

## 7. Quality Scorecard

Score 0-5. Ship only if each ≥ 4 or waiver exists.

| Dimension | 5 looks like |
|-----------|--------------|
| Contract | All gates answered, artifacts versioned |
| Taste | Email copy is PAS, not generic |
| Usefulness | Workflow completes end-to-end |
| Payments | Stripe checkout works |
| Security | No secrets in workflow JSON |
| Reliability | Error handlers on every HTTP node |
| Performance | <10s per prospect processed |
| Ops | Runbook exists |
| Scale | Can process 1000 prospects/day |

---

## 8. Education Mode

When `education_mode: true` (default), every stage response has:

1. **Teach** — 3-6 sentences, grade 7. What this step is, why it exists.
2. **Deliver** — Executive artifact.

Example:
> **Teach:** The CRM Dedupe step checks if this prospect is already in your pipeline. If they're already a customer or in an active deal, we skip them. This prevents embarrassing duplicate outreach.
>
> **Deliver:** Node 03 configured with HubSpot search by email + domain, skip if deal_stage != null.

---

## 9. Compatibility

| Surface | Install |
|---------|---------|
| Claude Code | `SKILL-ddc-plan.md` in skill path |
| Cursor | `.cursor/rules/ddc.mdc` |
| Codex | `AGENTS.md` includes DDC walker |
| Prospect PAL Chat | Built-in PAE agent uses DDC stages |

---

*DDC Planning Harness v1.0.0 for Prospect PAL. Supersede with an ADR.*
