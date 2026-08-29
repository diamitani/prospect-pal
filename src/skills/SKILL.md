# Prospect PAL Skills Registry

## Overview

This directory contains the skill specifications for the Prospect PAL agent system. Each skill defines how an AI agent interacts with the platform to perform specific tasks.

## Skill Architecture

```
skills/
├── SKILL.md                    # This registry
├── n8n-engineer/               # Builds and edits workflows
├── n8n-analyst/                # Monitors and reports on executions
├── copywriter/                 # Generates PAS copy sequences
├── tool-config/                # Builds MCP tool integrations
└── orchestrator/               # Coordinates multi-agent workflows
```

## PAL Pipeline

All skills follow the **Parse → Ambiguity Scan → Latent Intent → Expand → Compile** methodology:

1. **Parse**: Extract explicit requirements from user input
2. **Ambiguity Scan**: Identify missing information (CRM choice, approval policy, etc.)
3. **Latent Intent**: Determine the job-to-be-done (JTBD)
4. **Expand**: Fill in ICP, messaging, analytics without excessive questioning
5. **Compile**: Generate final deliverable (workflow JSON, copy, config)

## Hard Gates (must collect before compile)

| # | Gate | Skill |
|---|------|-------|
| 1 | Company background | All |
| 2 | Product/offer/proof | All |
| 3 | ICP | All |
| 4 | Persona | All |
| 5 | Data tool | Engineer, Config |
| 6 | CRM | Engineer, Config |
| 7 | Outreach | Engineer, Config |
| 8 | LLM | Engineer, Copywriter |
| 9 | Trigger type | Engineer |
| 10 | Approval policy | Engineer |

## 9-Node Canonical Pipeline

All workflows follow this structure:

```
01 Intake & Cron    → 02 Normalizer     → 03 CRM Dedupe
       ↓                    ↓                   ↓
04 Data Adapter    → 05 Research+PAS   → 06 Approval
       ↓                    ↓                   ↓
07 CRM Upsert      → 08 Enroll         → 09 Review Alert
```

Each skill maps to specific nodes in this pipeline.

## Usage

Skills are invoked via API:

```typescript
POST /api/skills/invoke
{
  "skill": "n8n-engineer",
  "action": "build",
  "intake": { ... },
  "blueprint_id": "apollo-hubspot-smartlead"
}
```

Results are streamed as Server-Sent Events (SSE) for real-time updates.
