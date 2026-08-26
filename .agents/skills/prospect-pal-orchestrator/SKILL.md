---
name: prospect-pal-orchestrator
description: >
  11-Step Automation Workflow Orchestrator for Prospect PAL. Transforms campaign 
  inputs into production-ready n8n workflows through a sequential pipeline. 
  Each step uses AWS Bedrock Claude to generate configurations.
  Triggers: orchestrate workflow, 11-step automation, run pipeline, 
  automation orchestrator, workflow pipeline, step-by-step automation.
tools: Read, Write, Edit, Bash, WebFetch
---

# Prospect PAL Orchestrator

Coordinates the 11-step automation workflow that transforms campaign inputs into a complete n8n workflow package.

---

## Workflow Overview

```
┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐
│  Step 1   │───│  Step 2   │───│  Step 3   │───│  Step 4   │
│ Generate  │   │   Map     │   │  Upsert   │   │ Generate  │
│ Webhook   │   │  Schema   │   │ Database  │   │Build Plan │
└───────────┘   └───────────┘   └───────────┘   └───────────┘
                                                       │
┌──────────────────────────────────────────────────────┘
│
▼
┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐
│  Step 5   │───│  Step 6   │───│  Step 7   │───│  Step 8   │
│ Configure │   │ Configure │   │ Configure │   │ Configure │
│  Trigger  │   │  Company  │   │  Contact  │   │CRM Update │
└───────────┘   └───────────┘   └───────────┘   └───────────┘
                                                       │
┌──────────────────────────────────────────────────────┘
│
▼
┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐
│  Step 9   │───│  Step 10  │───│  Step 11  │───│  Step 12  │
│ Configure │   │ Configure │   │ Configure │   │ Generate  │
│ Research  │   │Email Copy │   │Enrollment │   │  Report   │
└───────────┘   └───────────┘   └───────────┘   └───────────┘
```

---

## Step Definitions

### Step 1: Generate Webhook with Input Data
**Purpose**: Create a webhook endpoint configuration

**Input**: Campaign inputs (company, ICP, persona, product, signals)

**Output**:
- Webhook URL path pattern
- n8n webhook node configuration
- Input validation schema

### Step 2: Map Webhook Data with Database Schema
**Purpose**: Transform webhook fields to DynamoDB Project schema

**Input**: Webhook config from Step 1

**Output**:
- Field mappings (webhook → database)
- Data transformations
- Validation rules

### Step 3: Upsert New Webhook Data to Database
**Purpose**: Generate database persistence nodes

**Input**: Schema mapping from Step 2

**Output**:
- Data mapper Code node
- HTTP Request node for API call
- Error handling configuration

### Step 4: Generate Build Plan Based on Inputs
**Purpose**: Create comprehensive workflow architecture plan

**Input**: All campaign inputs + previous step outputs

**Output**:
- ICP profile (industries, titles, size, pain points, triggers)
- Tool recommendations (lead source, enrichment, CRM, sequencer)
- Workflow architecture (node sequence, estimated volume)
- Personalization strategy

### Step 5: Configure Trigger JSON
**Purpose**: Generate the workflow trigger node

**Input**: Build plan trigger type

**Output**:
- Schedule Trigger (daily at 7 AM) OR
- Webhook Trigger (HTTP POST) OR
- Manual Trigger

### Step 6: Configure Company Data Node
**Purpose**: Generate lead source node

**Input**: ICP profile + lead source tool

**Output**:
- Apollo/LinkedIn/HubSpot search node
- Search filters (industry, size, location)
- Pagination configuration

### Step 7: Configure Contact Search Node
**Purpose**: Generate contact enrichment node

**Input**: Persona config + enrichment tools

**Output**:
- Clay/Hunter/Clearbit node
- Title and seniority filters
- Waterfall enrichment configuration

### Step 8: Configure Contact Update Node (CRM)
**Purpose**: Generate CRM dedup and create nodes

**Input**: CRM type + field requirements

**Output**:
- Deduplication check node
- Contact create/update node
- Field mappings (standard + custom)

### Step 9: Configure Contact Research Node
**Purpose**: Generate AI research node

**Input**: ICP profile + research requirements

**Output**:
- Bedrock API call node
- Research system prompt
- Output field definitions (trigger, pain, hook)

### Step 10: Configure Email Copy Node
**Purpose**: Generate AI email writer node

**Input**: Product info + research output schema

**Output**:
- Bedrock API call node
- PAS email system prompt
- Multi-step sequence templates (Day 0, 3, 7, 14)
- Personalization variable map

### Step 11: Configure Enroll in Sequence Node
**Purpose**: Generate sequencer enrollment node

**Input**: Sequencer type + custom fields

**Output**:
- Smartlead/Amplemarket/Instantly API node
- Custom field mappings
- Campaign/sequence ID configuration

### Step 12: Configure Workflow Details Report
**Purpose**: Generate final report and assemble workflow

**Input**: All previous step outputs

**Output**:
- Slack notification node
- Workflow summary report
- Final assembled n8n JSON
- Deploy instructions

---

## API Endpoints

### Initialize Workflow
```
POST /api/automation/start
{
  "companyName": "...",
  "campaignTitle": "...",
  "campaignIcp": "...",
  "userPersona": "...",
  "companyProduct": "...",
  "companyBackground": "...",
  "targetSignals": "...",
  "toolStack": {
    "leadSource": "apollo",
    "enrichment": ["clay"],
    "crm": "hubspot",
    "sequencer": "smartlead"
  }
}

Response: { workflowId, statusUrl, nextStepUrl }
```

### Execute Step
```
POST /api/automation/{workflowId}/step/{stepNumber}

Response: { step, name, status, output, nextStepUrl }
```

### Get Status
```
GET /api/automation/{workflowId}/status

Response: { status, currentStep, progress, artifacts }
```

### Resume Workflow
```
POST /api/automation/{workflowId}/resume
{ "runAllRemaining": true }

Response: { results, finalN8nJson }
```

### Webhook Trigger
```
POST /api/automation/webhook
{ ...campaign_inputs, "run_all_steps": true }

Response: { workflowId, status, results }
```

---

## Generated Artifacts

| Step | Artifact | Type |
|------|----------|------|
| 1 | webhookConfig | WebhookConfig |
| 2 | schemaMapping | SchemaMapping |
| 3 | dbNodes | N8nNodeConfig[] |
| 4 | buildPlan | BuildPlan |
| 5 | triggerNode | N8nNodeConfig |
| 6 | companyDataNode | N8nNodeConfig |
| 7 | contactSearchNode | N8nNodeConfig |
| 8 | crmNodes | { dedupeNode, createNode } |
| 9 | researchNode | N8nNodeConfig |
| 10 | emailNode, emailSequence | N8nNodeConfig, EmailSequence |
| 11 | enrollmentNode | N8nNodeConfig |
| 12 | reportNode, workflowReport, finalN8nJson | N8nNodeConfig, Report, string |

---

## Implementation Files

| File | Purpose |
|------|---------|
| `src/lib/step-prompts.ts` | System prompts for each step |
| `src/lib/workflow-orchestrator.ts` | State management and types |
| `src/lib/step-executor.ts` | Step execution logic |
| `src/app/api/automation/start/route.ts` | Initialize workflow |
| `src/app/api/automation/webhook/route.ts` | Webhook trigger |
| `src/app/api/automation/[workflowId]/status/route.ts` | Get status |
| `src/app/api/automation/[workflowId]/step/[stepNumber]/route.ts` | Execute step |
| `src/app/api/automation/[workflowId]/resume/route.ts` | Resume workflow |

---

## Usage Examples

### Example 1: Full Pipeline via Webhook
```bash
curl -X POST http://localhost:3000/api/automation/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Acme SaaS",
    "campaign_title": "Q1 Outbound",
    "campaign_icp": "B2B SaaS companies 50-200 employees",
    "user_persona": "VP of Sales, Director of Revenue",
    "company_product": "Sales automation platform",
    "company_background": "We help sales teams automate prospecting",
    "target_signals": "Recent funding, hiring SDRs",
    "run_all_steps": true
  }'
```

### Example 2: Step-by-Step Execution
```bash
# Start workflow
WORKFLOW=$(curl -s -X POST http://localhost:3000/api/automation/start \
  -H "Content-Type: application/json" \
  -d '{"companyName": "Test", ...}' | jq -r '.workflowId')

# Execute each step
for step in {1..12}; do
  curl -X POST "http://localhost:3000/api/automation/$WORKFLOW/step/$step"
  sleep 2
done

# Get final status
curl "http://localhost:3000/api/automation/$WORKFLOW/status"
```

### Example 3: Resume Failed Workflow
```bash
# Resume and run all remaining steps
curl -X POST "http://localhost:3000/api/automation/$WORKFLOW/resume" \
  -H "Content-Type: application/json" \
  -d '{"runAllRemaining": true}'
```

---

## Integration with Sub-Agents

The orchestrator delegates to specialized skills:

| Step | Skill Used | Purpose |
|------|------------|---------|
| 4 | prospect-pal-master | ICP analysis |
| 5-8 | prospect-pal-workflow | Node configuration |
| 9 | prospect-pal-tools | Research setup |
| 10 | prospect-pal-copywriter | Email generation |
| 11 | prospect-pal-tools | Sequencer setup |
| 12 | prospect-pal-analyst | Report generation |

---

## Error Handling

- Each step is atomic and can be retried independently
- Failed steps stop the pipeline but preserve progress
- Resume from last successful step with `/resume` endpoint
- Error details stored in step results

---

## Performance

- Each step takes 5-15 seconds (LLM call + processing)
- Full 12-step pipeline: ~2-3 minutes
- Webhook with `run_all_steps`: ~3 minutes
- Status polling recommended every 5 seconds during execution
