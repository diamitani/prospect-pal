# Agent Swarm System Guide

Complete guide to using Prospect PAL's ROSTR-powered agent swarm with dual integration paths.

---

## Overview

The Agent Swarm system provides intelligent task orchestration with:

- **PAL Compilation**: Natural language → Agent manifests
- **NPAO Classification**: 5D phase + 4D priority scoring
- **Dual Integration**: Route to Agent Swarm OR N8N based on task type
- **Orchestration Patterns**: Sequential, Parallel, Fan-Out/In
- **AWS Bedrock**: Claude execution via Bedrock Runtime

---

## Quick Start

### 1. Single Task via Webhook

```bash
curl -X POST http://localhost:3000/api/swarm/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "user_input": "Research the top 10 SaaS companies in the marketing automation space",
    "project_id": "proj_123",
    "user_id": "user_456",
    "routing_preference": "auto"
  }'
```

**Response:**
```json
{
  "manifest_id": "uuid",
  "phase": "PreD",
  "priority": {
    "score": 4.8,
    "threshold": "queued"
  },
  "routing": {
    "destination": "agent-swarm",
    "reasoning": "Task requires AI processing",
    "confidence": 0.85
  },
  "result": {
    "type": "agent-swarm",
    "task_id": "task_uuid",
    "status": "completed",
    "result": { ... }
  }
}
```

---

## Routing Modes

### Auto Routing (Recommended)

System automatically routes based on task characteristics.

```json
{
  "user_input": "Analyze competitor pricing",
  "routing_preference": "auto"
}
```

**Routes to Agent Swarm:**
- Research/analysis tasks
- Content generation
- Multi-step reasoning
- AI-heavy processing

**Routes to N8N:**
- CRM updates
- Email sending
- Simple API calls
- Data transformations

### Agent-Only Mode

Force execution via agent swarm.

```json
{
  "user_input": "Write 5 email variations",
  "routing_preference": "agent-only"
}
```

### N8N-Only Mode

Force execution via N8N webhook.

```json
{
  "user_input": "Create contact in HubSpot",
  "routing_preference": "n8n-only",
  "n8n_webhook_url": "https://n8n.example.com/webhook/abc123"
}
```

### Hybrid Mode

Use both systems in sequence.

```json
{
  "user_input": "Research company and enroll in sequence",
  "routing_preference": "hybrid",
  "n8n_webhook_url": "https://n8n.example.com/webhook/abc123"
}
```

**Flow:**
1. Agent researches company (AI processing)
2. N8N enrolls contact in email sequence (integration)

---

## Orchestration Patterns

### Sequential Execution

Tasks run one after another. Each task waits for previous completion.

```bash
curl -X POST http://localhost:3000/api/swarm/orchestrate \
  -H "Content-Type: application/json" \
  -d '{
    "pattern": "sequential",
    "project_id": "proj_123",
    "tasks": [
      "Research top competitors",
      "Analyze their pricing models",
      "Generate competitive positioning report"
    ]
  }'
```

**Use cases:**
- Multi-step research pipelines
- Dependent data processing
- Report generation workflows

### Parallel Execution

Tasks run simultaneously.

```bash
curl -X POST http://localhost:3000/api/swarm/orchestrate \
  -H "Content-Type: application/json" \
  -d '{
    "pattern": "parallel",
    "project_id": "proj_123",
    "tasks": [
      "Write email for VP of Sales",
      "Write email for Director of Marketing",
      "Write email for CTO"
    ]
  }'
```

**Use cases:**
- Content generation at scale
- Independent research queries
- Batch processing

### Fan-Out Pattern

One input → Multiple outputs (parallel processing).

```bash
curl -X POST http://localhost:3000/api/swarm/orchestrate \
  -H "Content-Type: application/json" \
  -d '{
    "pattern": "fan-out",
    "project_id": "proj_123",
    "tasks": [
      {
        "user_input": "Analyze company XYZ",
        "context": { "industry": "SaaS" }
      },
      {
        "user_input": "Analyze company ABC",
        "context": { "industry": "FinTech" }
      }
    ]
  }'
```

---

## Phase Classification

### 5D Phase Taxonomy

| Phase | Description | Agent Behavior |
|-------|-------------|----------------|
| **PreD** | Pre-Development research | Research-heavy, no code |
| **Design** | Architecture & planning | Design agents, specs |
| **Development** | Building & implementation | Builder agents, code |
| **Deployment** | Shipping to production | Deploy agents, monitoring |
| **Debugging** | Fixing issues | Investigate, root cause |

**Example classifications:**

```javascript
// PreD
"Should we build a competitor tracking feature?"

// Design
"Design the workflow architecture for lead enrichment"

// Development
"Build the n8n workflow for Apollo → Clay → HubSpot"

// Deployment
"Deploy workflow to production n8n instance"

// Debugging
"Fix the 429 rate limit errors in Apollo node"
```

---

## Priority Scoring

### 4D Priority Formula

```
Priority = (Phase Urgency × 0.35) +
           (Dependency Impact × 0.30) +
           (Business Impact × 0.25) +
           (Resource Efficiency × 0.10)
```

### Thresholds

| Score | Threshold | Action |
|-------|-----------|--------|
| ≥ 7.0 | Immediate | Execute now |
| 4.0-6.9 | Queued | Wait for agent |
| < 4.0 | Backlog | Low priority |

### Modifiers

**High Priority Examples:**
- Production bugs (Debugging phase = 10)
- Revenue-impacting deployments (+2)
- Blocking 5+ tasks (+10 dependency)

**Low Priority Examples:**
- Research tasks (PreD = 2)
- Internal tooling (business = 3)
- Multi-day uncertain work (resource = 2)

---

## Integration with N8N

### Webhook Setup

1. Create webhook trigger in n8n
2. Get webhook URL
3. Pass URL in API call

**N8N Workflow Template:**

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "prospect-pal-agent",
        "responseMode": "responseNode",
        "options": {}
      }
    },
    {
      "name": "Process Agent Data",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const data = $input.item.json;\nreturn data;"
      }
    },
    {
      "name": "Update CRM",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.hubspot.com/contacts",
        "method": "POST"
      }
    }
  ]
}
```

### Payload Structure

Agent swarm sends this payload to N8N:

```json
{
  "task_id": "uuid",
  "task_description": "...",
  "agent_type": "researcher",
  "context": {
    "project": { ... },
    "session": { ... }
  },
  "agent_result": {
    "findings": [...],
    "recommendations": [...]
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Environment Variables

```bash
# AWS Credentials (for Bedrock)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# DynamoDB Tables
DYNAMODB_TABLE_PROJECTS=ProspectPALProjects
DYNAMODB_TABLE_SESSIONS=ProspectPALSessions
DYNAMODB_TABLE_ARTIFACTS=ProspectPALArtifacts

# N8N (optional)
N8N_WEBHOOK_BASE_URL=https://n8n.example.com/webhook
```

---

## Monitoring & Status

### Check Task Status

```bash
curl "http://localhost:3000/api/swarm/webhook?task_id=task_uuid"
```

**Response:**
```json
{
  "task_id": "task_uuid",
  "status": "completed",
  "phase": "Development",
  "priority": { "total": 6.5, "threshold": "queued" },
  "result": { ... },
  "created_at": "...",
  "completed_at": "..."
}
```

### Swarm Status

```bash
curl "http://localhost:3000/api/swarm/webhook"
```

**Response:**
```json
{
  "queue_size": 3,
  "running_tasks": 2,
  "completed_tasks": 47,
  "agents": [
    {
      "id": "orchestrator-1",
      "name": "Orchestrator Agent",
      "current_load": 2,
      "max_capacity": 3,
      "performance": {
        "tasks_completed": 15,
        "avg_completion_minutes": 18.5,
        "success_rate": 0.95
      }
    }
  ]
}
```

---

## Error Handling

### Retry Logic

Agents automatically retry with exponential backoff:

- Attempt 1: Immediate
- Attempt 2: 2s delay
- Attempt 3: 4s delay

### Timeout

- Default: 300s (5 minutes)
- Override via manifest: `runtime.timeout_seconds`

### Failed Tasks

Check error field:

```json
{
  "task_id": "uuid",
  "status": "failed",
  "error": "AWS Bedrock timeout after 300s"
}
```

---

## Best Practices

### 1. Use Auto Routing

Let the system decide unless you have specific requirements.

```json
{ "routing_preference": "auto" }
```

### 2. Provide Context

More context = better results.

```json
{
  "user_input": "Research competitors",
  "context": {
    "industry": "Marketing Automation",
    "company_size": "50-200 employees",
    "focus_areas": ["pricing", "features", "positioning"]
  }
}
```

### 3. Batch Independent Tasks

Use parallel execution for independent work.

```javascript
// Good - 3 minutes total
orchestrate({ pattern: "parallel", tasks: [task1, task2, task3] });

// Bad - 9 minutes total (sequential when not needed)
orchestrate({ pattern: "sequential", tasks: [task1, task2, task3] });
```

### 4. Use Sequential for Dependencies

```javascript
orchestrate({
  pattern: "sequential",
  tasks: [
    "Research company XYZ",
    "Generate personalized email based on research"
  ]
});
```

### 5. Save Artifacts

Artifacts auto-save to DynamoDB for projects.

```json
{
  "project_id": "proj_123", // Enables artifact saving
  "user_input": "..."
}
```

---

## Example Workflows

### 1. Lead Research Pipeline

```bash
curl -X POST http://localhost:3000/api/swarm/orchestrate \
  -d '{
    "pattern": "sequential",
    "tasks": [
      "Find 20 companies matching ICP: B2B SaaS, 50-200 employees",
      "Enrich each company with funding, tech stack, and recent news",
      "Score each company for fit (0-100)",
      "Generate top 10 priority list with reasoning"
    ]
  }'
```

### 2. Multi-Persona Email Generation

```bash
curl -X POST http://localhost:3000/api/swarm/orchestrate \
  -d '{
    "pattern": "parallel",
    "tasks": [
      {
        "user_input": "Write cold email for VP of Sales",
        "context": { "pain_point": "low pipeline velocity" }
      },
      {
        "user_input": "Write cold email for CMO",
        "context": { "pain_point": "lead quality" }
      },
      {
        "user_input": "Write cold email for CEO",
        "context": { "pain_point": "revenue growth" }
      }
    ]
  }'
```

### 3. Hybrid: Research + Enroll

```bash
curl -X POST http://localhost:3000/api/swarm/webhook \
  -d '{
    "user_input": "Research Acme Corp and enroll key contacts in Q1 campaign",
    "routing_preference": "hybrid",
    "n8n_webhook_url": "https://n8n.example.com/webhook/enroll"
  }'
```

**Flow:**
1. Agent researches Acme Corp (AI)
2. Agent identifies key contacts (AI)
3. N8N enrolls contacts in Smartlead (Integration)
4. N8N updates HubSpot (Integration)

---

## Integration with Existing Orchestrator

The agent swarm system complements the existing 11-step orchestrator:

**Existing Orchestrator**: `/api/automation/*`
- Fixed 12-step workflow
- N8N workflow generation
- Step-by-step execution

**New Agent Swarm**: `/api/swarm/*`
- Flexible task execution
- Dual routing (agent/n8n)
- Dynamic orchestration

**Use both:**

```javascript
// Use swarm for research phase
const research = await fetch('/api/swarm/webhook', {
  body: JSON.stringify({
    user_input: 'Research ICP and generate build plan',
    routing_preference: 'agent-only'
  })
});

// Use existing orchestrator for n8n generation
const workflow = await fetch('/api/automation/start', {
  body: JSON.stringify({
    companyName: research.result.company,
    campaignIcp: research.result.icp,
    // ... other fields
  })
});
```

---

## Troubleshooting

### Task Stuck in "pending"

**Cause**: No available agents.

**Solution**: Check swarm status for agent availability.

```bash
curl "http://localhost:3000/api/swarm/webhook"
# Check agents[].current_load vs max_capacity
```

### N8N Webhook Fails

**Cause**: Invalid webhook URL or n8n down.

**Solution**: Test webhook directly.

```bash
curl -X POST "https://n8n.example.com/webhook/abc123" \
  -d '{"test": true}'
```

### AWS Bedrock Errors

**Cause**: Invalid credentials or region.

**Solution**: Verify environment variables.

```bash
aws bedrock-runtime invoke-model \
  --model-id us.anthropic.claude-sonnet-4-20250514-v1:0 \
  --body '{"anthropic_version":"bedrock-2023-05-31","max_tokens":100,"messages":[{"role":"user","content":"test"}]}'
```

---

## API Reference

### POST `/api/swarm/webhook`

Submit single task.

**Body:**
- `user_input` (string, required): Task description
- `project_id` (string, optional): Project context
- `user_id` (string, optional): User context
- `routing_preference` (enum, optional): "auto" | "agent-only" | "n8n-only" | "hybrid"
- `n8n_webhook_url` (string, optional): N8N webhook URL

### POST `/api/swarm/orchestrate`

Submit multi-task orchestration.

**Body:**
- `pattern` (enum, required): "sequential" | "parallel" | "fan-out"
- `tasks` (array, required): Array of task strings or objects
- `project_id` (string, optional)
- `user_id` (string, optional)

### GET `/api/swarm/webhook?task_id={id}`

Get task status.

### GET `/api/swarm/webhook`

Get swarm status.

---

## Next Steps

1. **Test the APIs** - Try the curl examples
2. **Build UI** - Create frontend for task submission
3. **Add Skills** - Register custom agent types
4. **Monitor Performance** - Track agent success rates
5. **Scale** - Add more agent instances as needed

For questions, see existing skills in `.agents/skills/` or check ROSTR framework docs in `CLAUDE.md`.
