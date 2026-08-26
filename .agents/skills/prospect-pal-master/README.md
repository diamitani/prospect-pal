# Prospect PAL Skills Package

Complete multi-agent skill suite for the Prospect PAL autonomous prospect automation platform.

---

## Quick Start

```bash
# The skills are already installed in this project
# To use them with Claude Code, they're located at:
# /Users/patmini/prospect-pal/.agents/skills/

# Main orchestrator skill
/prospect-pal-master

# Sub-agent skills
/prospect-pal-tools      # Tool configuration
/prospect-pal-copywriter # Email/messaging
/prospect-pal-workflow   # n8n JSON generation
/prospect-pal-n8n-engineer # Self-service workflow building
/prospect-pal-analyst    # Execution monitoring
```

---

## Skills Overview

### 1. prospect-pal-master
**The Orchestrator** - Master agent that coordinates the entire campaign creation flow.

**Triggers**: `prospect automation`, `campaign setup`, `outbound workflow`, `gtm automation`

**Capabilities**:
- Campaign intake wizard
- ICP profile generation
- Tool stack recommendation
- Output coordination

### 2. prospect-pal-tools
**Tool Configuration Agent** - Sets up integrations and MCP scripts.

**Triggers**: `configure tools`, `setup integration`, `mcp script`, `api connection`

**Capabilities**:
- Lead source setup (Apollo, LinkedIn, CSV)
- Enrichment configuration (Clay, Hunter, Clearbit)
- CRM connections (HubSpot, Salesforce)
- Sequencer integration (Smartlead, Amplemarket)

### 3. prospect-pal-copywriter
**AI Copy Writer** - Generates high-converting outreach copy.

**Triggers**: `write email`, `cold email`, `outreach copy`, `email sequence`

**Capabilities**:
- PAS/BAB/AIDA email frameworks
- Multi-touch sequences
- LinkedIn DM templates
- Subject line A/B variants

### 4. prospect-pal-workflow
**Workflow Generator** - Builds production-ready n8n JSON.

**Triggers**: `generate workflow`, `n8n json`, `build workflow`, `automation workflow`

**Capabilities**:
- Node library (20+ pre-built nodes)
- Connection mapping
- Credential placeholders
- Complete workflow templates

### 5. prospect-pal-n8n-engineer
**n8n Systems Engineer** - Self-service workflow building and debugging.

**Triggers**: `n8n engineer`, `edit workflow`, `customize n8n`, `debug workflow`

**Capabilities**:
- Workflow JSON editing
- Node configuration
- Expression syntax
- Performance optimization

### 6. prospect-pal-analyst
**Execution Analyst** - Monitors and fixes workflow executions.

**Triggers**: `analyze execution`, `workflow error`, `n8n failed`, `debug run`

**Capabilities**:
- Error classification
- Root cause analysis
- Fix recommendations
- Post-mortem reports

---

## Reference Documents

Located in `/prospect-pal-master/references/`:

| Document | Description |
|----------|-------------|
| `onboarding-flow.md` | Complete intake wizard specification |
| `dashboard-components.md` | React component patterns |
| `marketing-site.md` | Marketing site content and structure |

---

## Campaign Flow

```
1. User describes ICP in plain English
         ↓
2. PAL Compilation (Extract → Categorize → Enhance)
         ↓
3. Tool Stack Selection (Lead → Enrich → CRM → Sequencer)
         ↓
4. Output Generation:
   - n8n Workflow JSON
   - Email Framework
   - Deploy Guide
   - Skill Definition
         ↓
5. Deploy & Monitor
```

---

## Generated Outputs

For each campaign, the system generates:

1. **campaign-overview.md** - Company, ICP, persona, tool stack summary
2. **workflow.json** - Production-ready n8n workflow
3. **email-framework.md** - PAS templates with personalization
4. **deploy-guide.md** - Step-by-step setup instructions
5. **build-prompts.md** - Prompts for regenerating/adjusting
6. **skill.md** - Claude Code skill for reuse

---

## Tool Stack Options

### Lead Sources
- Apollo (API search)
- LinkedIn (Sales Navigator)
- CSV Upload
- HubSpot Lists
- Manual Entry

### Enrichment
- Clay (waterfall enrichment)
- Hunter (email verification)
- Clearbit (company/person data)
- Apollo Enrich
- ZoomInfo

### CRMs
- HubSpot
- Salesforce
- Attio
- Pipedrive

### Sequencers
- Smartlead
- Amplemarket
- Instantly
- Lemlist
- HubSpot Sequences

---

## Environment Variables

```bash
# Lead Sources
APOLLO_API_KEY=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# Enrichment
CLAY_WEBHOOK_URL=
HUNTER_API_KEY=
CLEARBIT_API_KEY=

# CRM
HUBSPOT_API_KEY=
SALESFORCE_CLIENT_ID=
SALESFORCE_CLIENT_SECRET=

# Sequencers
SMARTLEAD_API_KEY=
AMPLEMARKET_API_KEY=

# AI
ANTHROPIC_API_KEY=

# Notifications
SLACK_WEBHOOK_URL=
```

---

## Usage Examples

### Create New Campaign
```
User: "Set up an outbound campaign for my SaaS product that helps 
       sales teams automate prospecting. Target VP of Sales at 
       mid-market B2B companies."

System: 
1. Extracts: SaaS, sales automation, VP Sales, mid-market, B2B
2. Recommends: Apollo → Clay → HubSpot → Smartlead
3. Generates: ICP profile, workflow JSON, email templates
4. Outputs: Complete campaign package
```

### Write Cold Emails
```
User: "Write cold emails for this campaign using PAS framework"

Copywriter Agent:
- Generates 3 subject line variants
- Creates 4-touch sequence (Day 0, 3, 7, 14)
- Includes personalization variables
- Applies guardrails (no spam words, <75 words)
```

### Debug Workflow Error
```
User: "My Apollo search keeps failing with 429 errors"

Analyst Agent:
- Diagnosis: Rate limiting (100 req/min limit)
- Fix: Add Wait node (2s delay), reduce batch to 25
- Output: Modified workflow JSON
```

---

## Pricing Tiers

| Tier | Price | Includes |
|------|-------|----------|
| DIY | $19.99 one-time | Templates + skills + deploy guide |
| Pro | $99/month | Dashboard + agents + BYOK |
| Custom | $999+ | White-glove implementation |

---

## Support

- Documentation: `/docs/` directory
- Issues: GitHub Issues
- Discord: discord.gg/prospectpal

---

## Version

- **Skills Version**: 2.0.0
- **Compatible with**: Prospect PAL v2.0+
- **Last Updated**: August 2026
