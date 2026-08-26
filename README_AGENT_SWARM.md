# Agent Swarm System

**Production-ready multi-agent orchestration with dual integration paths (Agent Swarm ↔ N8N)**

Built using the ROSTR framework (Runtime, Orchestration, State, Tools, Reference) for phase-aware workflow management.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

```bash
# AWS Bedrock (required)
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret

# DynamoDB (required)
export DYNAMODB_TABLE_PROJECTS=ProspectPALProjects
export DYNAMODB_TABLE_SESSIONS=ProspectPALSessions
export DYNAMODB_TABLE_ARTIFACTS=ProspectPALArtifacts

# N8N (optional)
export N8N_WEBHOOK_BASE_URL=https://n8n.example.com/webhook
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Test the API

```bash
# Run test suite
./scripts/test-agent-swarm.sh

# Or manually test
curl -X POST http://localhost:3000/api/swarm/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "user_input": "Research top 10 B2B SaaS companies in marketing automation",
    "routing_preference": "auto"
  }'
```

---

## 📁 Project Structure

```
prospect-pal/
├── src/
│   ├── lib/
│   │   └── rostr/
│   │       ├── pal-compiler.ts         # Intent → Agent Manifest
│   │       ├── npao-classifier.ts      # Phase + Priority + Allocation
│   │       ├── agent-swarm.ts          # Multi-agent orchestrator
│   │       ├── integration-router.ts   # Agent vs N8N routing
│   │       └── bedrock-executor.ts     # AWS Bedrock integration
│   │
│   └── app/
│       └── api/
│           └── swarm/
│               ├── webhook/route.ts     # Main webhook API
│               └── orchestrate/route.ts # Multi-task API
│
├── docs/
│   └── agent-swarm-guide.md            # Complete usage guide
│
├── examples/
│   └── agent-swarm-examples.ts         # TypeScript examples
│
├── scripts/
│   └── test-agent-swarm.sh             # Test script
│
└── AGENT_SWARM_IMPLEMENTATION.md       # Implementation summary
```

---

## 🎯 Core Concepts

### ROSTR Framework

**R**untime - Agent execution environment (AWS Bedrock)  
**O**rchestration - Task routing and orchestration patterns  
**S**tate - Persistent context (DynamoDB)  
**T**ools - Available capabilities per agent  
**R**eference - Knowledge hub and context sources

### PAL (Prompt Abstraction Layer)

Transforms natural language → agent runtime manifests in 5 stages:

1. **Intent Extraction** - Parse user input
2. **Context Injection** - Load project/org/user context
3. **Semantic Enhancement** - Add precision and best practices
4. **Runtime Compilation** - Generate agent manifest
5. **Output Routing** - Route to execution layer

### NPAO (Navigate, Prioritize, Allocate, Orchestrate)

**5D Phase Taxonomy:**
- PreD (Pre-Development research)
- Design (Architecture)
- Development (Implementation)
- Deployment (Production)
- Debugging (Issue resolution)

**4D Priority Scoring:**
```
Priority = (Phase Urgency × 0.35) +
           (Dependency Impact × 0.30) +
           (Business Impact × 0.25) +
           (Resource Efficiency × 0.10)
```

---

## 🔀 Routing Modes

### Auto (Recommended)

System decides based on task characteristics.

```bash
curl -X POST http://localhost:3000/api/swarm/webhook \
  -d '{"user_input": "Research competitors", "routing_preference": "auto"}'
```

**Routes to Agent Swarm:**
- Research/analysis
- Content generation
- Multi-step reasoning

**Routes to N8N:**
- CRM updates
- Email sending
- API integrations

### Agent-Only

Force execution via agent swarm (AI processing).

```bash
curl -X POST http://localhost:3000/api/swarm/webhook \
  -d '{"user_input": "Write email copy", "routing_preference": "agent-only"}'
```

### N8N-Only

Force execution via N8N webhook (integrations).

```bash
curl -X POST http://localhost:3000/api/swarm/webhook \
  -d '{
    "user_input": "Update HubSpot contacts",
    "routing_preference": "n8n-only",
    "n8n_webhook_url": "https://n8n.example.com/webhook/abc123"
  }'
```

### Hybrid

Use both systems in sequence (research → action).

```bash
curl -X POST http://localhost:3000/api/swarm/webhook \
  -d '{
    "user_input": "Research company and enroll in sequence",
    "routing_preference": "hybrid",
    "n8n_webhook_url": "https://n8n.example.com/webhook/abc123"
  }'
```

---

## 🎼 Orchestration Patterns

### Sequential

Tasks run one after another (dependencies).

```bash
curl -X POST http://localhost:3000/api/swarm/orchestrate \
  -d '{
    "pattern": "sequential",
    "tasks": [
      "Find 20 companies",
      "Enrich with data",
      "Score for fit",
      "Generate report"
    ]
  }'
```

### Parallel

Tasks run simultaneously (speed).

```bash
curl -X POST http://localhost:3000/api/swarm/orchestrate \
  -d '{
    "pattern": "parallel",
    "tasks": [
      "Write email for VP Sales",
      "Write email for CMO",
      "Write email for CTO"
    ]
  }'
```

### Fan-Out

One input → many parallel outputs.

```bash
curl -X POST http://localhost:3000/api/swarm/orchestrate \
  -d '{
    "pattern": "fan-out",
    "tasks": [
      {"user_input": "Analyze Company A", "context": {...}},
      {"user_input": "Analyze Company B", "context": {...}}
    ]
  }'
```

---

## 📊 Monitoring

### Check Task Status

```bash
curl "http://localhost:3000/api/swarm/webhook?task_id=TASK_ID"
```

### Swarm Health

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
        "tasks_completed": 47,
        "avg_completion_minutes": 18.5,
        "success_rate": 0.95
      }
    }
  ]
}
```

---

## 🔌 Integration with N8N

### 1. Create N8N Webhook

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "prospect-pal-agent"
      }
    }
  ]
}
```

### 2. Get Webhook URL

```
https://n8n.example.com/webhook/prospect-pal-agent
```

### 3. Use in API Call

```bash
curl -X POST http://localhost:3000/api/swarm/webhook \
  -d '{
    "user_input": "Your task",
    "routing_preference": "n8n-only",
    "n8n_webhook_url": "https://n8n.example.com/webhook/prospect-pal-agent"
  }'
```

---

## 🛠️ Agent Types

| Agent | Phases | Specialization |
|-------|--------|----------------|
| Orchestrator | Design, Development | Multi-step workflows |
| Analyst | Debugging, PreD | Root cause analysis |
| Copywriter | Development | Content generation |
| Researcher | PreD, Design | Information gathering |

Register custom agents via `.agents/skills/` directory.

---

## 📚 Documentation

- **[Complete Usage Guide](docs/agent-swarm-guide.md)** - Full API reference and examples
- **[Implementation Summary](AGENT_SWARM_IMPLEMENTATION.md)** - Technical details
- **[TypeScript Examples](examples/agent-swarm-examples.ts)** - Code samples
- **[Test Script](scripts/test-agent-swarm.sh)** - Test suite

---

## 🧪 Testing

### Run Test Suite

```bash
./scripts/test-agent-swarm.sh
```

### Manual Tests

```bash
# Test 1: Auto routing
curl -X POST http://localhost:3000/api/swarm/webhook \
  -d '{"user_input": "Research competitors", "routing_preference": "auto"}'

# Test 2: Parallel execution
curl -X POST http://localhost:3000/api/swarm/orchestrate \
  -d '{"pattern": "parallel", "tasks": ["Task 1", "Task 2", "Task 3"]}'

# Test 3: Check status
curl "http://localhost:3000/api/swarm/webhook"
```

---

## 🔧 Configuration

### Agent Capacity

Modify in `src/lib/rostr/agent-swarm.ts`:

```typescript
{
  id: "orchestrator-1",
  max_parallel_tasks: 3, // Adjust capacity
  // ...
}
```

### Model Selection

Modify in `src/lib/rostr/pal-compiler.ts`:

```typescript
const model = intent.domain === "automation" 
  ? "claude-sonnet-4"  // Change model
  : "claude-sonnet-4";
```

### Timeout

```typescript
runtime: {
  timeout_seconds: 300, // 5 minutes
}
```

---

## 🐛 Troubleshooting

### Task Stuck in "pending"

**Cause:** No available agents

**Solution:**
```bash
curl http://localhost:3000/api/swarm/webhook
# Check current_load vs max_capacity
```

### Bedrock Execution Fails

**Cause:** Invalid AWS credentials

**Solution:**
```bash
# Test credentials
aws bedrock-runtime invoke-model \
  --model-id us.anthropic.claude-sonnet-4-20250514-v1:0 \
  --body '{"anthropic_version":"bedrock-2023-05-31","max_tokens":100,"messages":[{"role":"user","content":"test"}]}'
```

### N8N Webhook Not Responding

**Cause:** Invalid webhook URL

**Solution:**
```bash
# Test webhook directly
curl -X POST "https://n8n.example.com/webhook/abc123" -d '{"test": true}'
```

---

## 🚦 Best Practices

### 1. Use Auto Routing

Let the system decide unless you have specific requirements.

### 2. Provide Context

```json
{
  "user_input": "Research competitors",
  "context": {
    "industry": "Marketing Automation",
    "company_size": "50-200 employees"
  }
}
```

### 3. Batch Independent Tasks

Use parallel execution for independent work (3x faster).

### 4. Use Sequential for Dependencies

Only use sequential when task B needs task A's output.

### 5. Monitor Performance

Check agent performance metrics regularly.

---

## 🎓 Examples

### Example 1: Lead Research Pipeline

```typescript
const response = await fetch('/api/swarm/orchestrate', {
  method: 'POST',
  body: JSON.stringify({
    pattern: 'sequential',
    tasks: [
      'Find 20 companies matching ICP',
      'Enrich with funding, tech stack',
      'Score for fit (0-100)',
      'Generate top 10 priority list'
    ]
  })
});
```

### Example 2: Multi-Persona Email Generation

```typescript
const response = await fetch('/api/swarm/orchestrate', {
  method: 'POST',
  body: JSON.stringify({
    pattern: 'parallel',
    tasks: [
      { user_input: 'Write email for VP Sales', context: { pain: 'pipeline' } },
      { user_input: 'Write email for CMO', context: { pain: 'lead quality' } },
      { user_input: 'Write email for CEO', context: { pain: 'growth' } }
    ]
  })
});
```

### Example 3: Hybrid Research + Enroll

```typescript
const response = await fetch('/api/swarm/webhook', {
  method: 'POST',
  body: JSON.stringify({
    user_input: 'Research Acme Corp and enroll contacts in campaign',
    routing_preference: 'hybrid',
    n8n_webhook_url: 'https://n8n.example.com/webhook/enroll'
  })
});
```

---

## 🔗 Integration with Existing System

### Existing: 11-Step Orchestrator

**Endpoints:** `/api/automation/*`  
**Purpose:** N8N workflow generation  
**Use for:** Building n8n workflows

### New: Agent Swarm

**Endpoints:** `/api/swarm/*`  
**Purpose:** AI-heavy processing  
**Use for:** Research, content, analysis

### Combining Both

```typescript
// Phase 1: Agent swarm for ICP research
const research = await fetch('/api/swarm/webhook', {
  body: JSON.stringify({
    user_input: 'Research target ICP',
    routing_preference: 'agent-only'
  })
});

// Phase 2: Existing orchestrator for n8n workflow
const workflow = await fetch('/api/automation/start', {
  body: JSON.stringify({
    campaignIcp: research.result.result.output,
    // ... other fields
  })
});
```

---

## 📈 Performance

- **PAL Compilation:** ~50-100ms
- **Phase Classification:** ~10ms
- **AWS Bedrock Execution:** 2-15s (depends on task complexity)
- **Parallel Tasks:** 3-5x faster than sequential

---

## 🔐 Security

- AWS credentials via environment variables
- DynamoDB for secure state persistence
- N8N webhooks require explicit URLs
- No sensitive data in logs

---

## 🎉 What You Get

✅ **ROSTR Framework** - Production-grade architecture  
✅ **Dual Integration** - Agent Swarm ↔ N8N  
✅ **Smart Routing** - Auto, agent-only, n8n-only, hybrid  
✅ **Orchestration** - Sequential, parallel, fan-out  
✅ **AWS Bedrock** - Claude API integration  
✅ **Performance Tracking** - Agent metrics  
✅ **Complete API** - REST endpoints with examples  
✅ **Full Documentation** - Guides, examples, tests  

---

## 📞 Support

- **Usage Guide:** [docs/agent-swarm-guide.md](docs/agent-swarm-guide.md)
- **Examples:** [examples/agent-swarm-examples.ts](examples/agent-swarm-examples.ts)
- **Test Script:** [scripts/test-agent-swarm.sh](scripts/test-agent-swarm.sh)
- **Implementation:** [AGENT_SWARM_IMPLEMENTATION.md](AGENT_SWARM_IMPLEMENTATION.md)

---

## 📝 License

Part of Prospect PAL - Premium Enterprise GTM Engine

---

**Ready to use!** Start with:

```bash
npm run dev
./scripts/test-agent-swarm.sh
```
