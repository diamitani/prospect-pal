# Prospect PAL Skills Package

Complete multi-agent skill suite for autonomous prospect automation.

## Installation

### For Claude Code

Skills are already installed in the `.agents/skills/` directory. They are automatically available when working in this project.

### For Codex Upload

```bash
# Package all skills
cd /Users/patmini/prospect-pal/.agents/skills
tar -czf prospect-pal-skills-v2.0.0.tar.gz \
  prospect-pal-master/ \
  prospect-pal-orchestrator/ \
  prospect-pal-workflow/ \
  prospect-pal-copywriter/ \
  prospect-pal-tools/ \
  prospect-pal-n8n-engineer/ \
  prospect-pal-analyst/

# Upload to Codex
# (Use /codex command in Claude Code)
```

## Included Skills

| Skill | Purpose | Triggers |
|-------|---------|----------|
| **orchestrator** | 11-step automation pipeline | `orchestrate workflow`, `11-step automation` |
| **master** | Campaign intake and coordination | `prospect automation`, `campaign setup` |
| **workflow** | n8n JSON generation | `generate workflow`, `n8n json` |
| **copywriter** | Email and messaging copy | `write email`, `cold email`, `outreach copy` |
| **tools** | Tool configuration and MCPs | `configure tools`, `setup integration` |
| **n8n-engineer** | Workflow customization | `n8n engineer`, `edit workflow` |
| **analyst** | Execution monitoring | `analyze execution`, `workflow error` |

## Quick Start

### Option 1: Full Orchestrator Pipeline

```bash
curl -X POST http://localhost:3000/api/automation/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Acme Corp",
    "campaign_title": "Q1 2025 Outbound",
    "campaign_icp": "B2B SaaS 50-200 employees",
    "user_persona": "VP of Sales, Director of Sales",
    "company_product": "Sales automation platform",
    "company_background": "We help sales teams automate prospecting",
    "target_signals": "Recent funding, hiring SDRs",
    "lead_source": "apollo",
    "enrichment": ["clay"],
    "crm": "hubspot",
    "sequencer": "smartlead",
    "run_all_steps": true
  }'
```

### Option 2: Interactive with Claude Code

```
User: "Set up an outbound campaign for my SaaS product targeting VP of Sales"

Claude: [Uses prospect-pal-master skill]
- Collects ICP details
- Recommends tool stack
- Generates workflow
- Provides deploy guide
```

### Option 3: Step-by-Step via API

```bash
# Initialize
WORKFLOW=$(curl -X POST http://localhost:3000/api/automation/start \
  -H "Content-Type: application/json" \
  -d '{...inputs...}' | jq -r '.workflowId')

# Execute each step
for step in {1..12}; do
  curl -X POST "http://localhost:3000/api/automation/$WORKFLOW/step/$step"
done
```

## Architecture

```
prospect-pal-master (Orchestrator)
├── prospect-pal-orchestrator (11-step pipeline)
│   ├── Step 1-12 execution via Bedrock
│   └── State management
├── prospect-pal-workflow (n8n generation)
│   ├── Node library
│   └── Connection builder
├── prospect-pal-copywriter (Copy generation)
│   ├── PAS/BAB frameworks
│   └── Multi-touch sequences
├── prospect-pal-tools (Integrations)
│   ├── MCP scripts
│   └── Tool configs
├── prospect-pal-n8n-engineer (Customization)
│   ├── JSON editing
│   └── Node configuration
└── prospect-pal-analyst (Monitoring)
    ├── Error diagnosis
    └── Performance reports
```

## Environment Variables

```bash
# AWS Bedrock (required for orchestrator)
AWS_BEDROCK_BEARER_TOKEN=your_token
AWS_REGION=us-east-1

# Tool APIs (configure as needed)
APOLLO_API_KEY=
CLAY_WEBHOOK_URL=
HUNTER_API_KEY=
HUBSPOT_API_KEY=
SMARTLEAD_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Generated Outputs

Each campaign generates:

1. **n8n Workflow JSON** - Production-ready workflow
2. **Build Plan** - ICP analysis and architecture
3. **Email Sequence** - 4-touch PAS framework
4. **Deploy Guide** - Step-by-step setup
5. **Build Prompts** - Regeneration/adjustment prompts
6. **Workflow Report** - Summary and metrics

## Support

- **Documentation**: See individual SKILL.md files
- **Issues**: GitHub Issues
- **Discord**: discord.gg/prospectpal

## Enhancements

**n8n Systems Engineer** now includes:
- Complete n8n REST API reference (list, create, update, delete, activate workflows)
- Executions API (query, filter, retrieve execution data)
- Python API client examples
- Common GTM workflow patterns (Clay → HubSpot, scheduled sync, deal stage triggers)
- Enhanced with patterns from Master GTM Architect n8n-api.md reference

**Execution Analyst** provides:
- 95%+ accuracy error diagnosis
- 5 common diagnostic patterns with symptom/diagnosis/fix workflows
- Post-mortem report templates
- Health check dashboards with key metrics
- Slack alert integration

## Version

- **Package Version**: 2.0.1
- **Skills Version**: 2.0.1
- **Compatible with**: Prospect PAL v2.0+, Claude Code, Codex
- **Last Updated**: August 2026
