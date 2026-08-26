# Prospect PAL Onboarding Flow

Complete guide for the intake wizard and campaign setup process.

---

## Intake Wizard Steps

### Step 1: Company Information
**Purpose**: Understand who is selling

**Fields**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| company_name | text | Yes | 2-100 chars |
| company_background | textarea | Yes | 50-500 chars |
| company_product | textarea | Yes | 50-500 chars |

**Example**:
```json
{
  "company_name": "Prospect PAL",
  "company_background": "B2B SaaS company that helps sales teams automate their outbound prospecting with AI-powered workflow generation.",
  "company_product": "AI-powered prospect automation platform that generates n8n workflows, email scripts, and manages CRM integration."
}
```

### Step 2: Campaign Definition
**Purpose**: Define the outbound campaign

**Fields**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| campaign_title | text | Yes | 5-100 chars |
| campaign_description | textarea | No | 0-500 chars |

**Example**:
```json
{
  "campaign_title": "Q1 2025 Mid-Market Sales Push",
  "campaign_description": "Target VP of Sales at mid-market SaaS companies who are scaling their sales teams and need automation."
}
```

### Step 3: ICP Definition
**Purpose**: Define target companies

**Fields**:
| Field | Type | Required | Options/Validation |
|-------|------|----------|-------------------|
| target_industries | multi-select | Yes | SaaS, FinTech, Healthcare, E-commerce, Manufacturing, Professional Services, Other |
| company_size | select | Yes | 1-10, 11-50, 51-200, 201-500, 501-1000, 1000+ |
| geographies | multi-select | Yes | US, Canada, UK, EU, APAC, LATAM, Global |
| icp_prompt | textarea | No | Free-form description |

**Example**:
```json
{
  "target_industries": ["SaaS", "FinTech"],
  "company_size": "51-200",
  "geographies": ["US", "Canada"],
  "icp_prompt": "B2B SaaS companies that recently raised Series A/B funding and are scaling their sales team."
}
```

### Step 4: Buyer Persona
**Purpose**: Define target contacts

**Fields**:
| Field | Type | Required | Options/Validation |
|-------|------|----------|-------------------|
| target_titles | multi-select | Yes | CEO, CTO, VP Sales, VP Revenue, Director of Sales, Sales Manager, RevOps, Other |
| target_seniority | multi-select | Yes | C-Level, VP, Director, Manager |
| target_departments | multi-select | Yes | Sales, Marketing, Revenue Operations, Business Development |
| persona_prompt | textarea | No | Free-form description |

**Example**:
```json
{
  "target_titles": ["VP Sales", "Director of Sales", "Head of Sales"],
  "target_seniority": ["VP", "Director"],
  "target_departments": ["Sales", "Revenue Operations"],
  "persona_prompt": "Sales leaders who are frustrated with manual prospecting and looking to scale their outbound efforts without hiring more SDRs."
}
```

### Step 5: Target Signals
**Purpose**: Define buyer triggers

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| trigger_events | multi-select | Yes | Funding, Hiring, Product Launch, Leadership Change, Tech Adoption, Expansion |
| pain_points | textarea | Yes | What problems they face |
| signals_prompt | textarea | No | Additional context |

**Example**:
```json
{
  "trigger_events": ["Funding", "Hiring", "Tech Adoption"],
  "pain_points": "Manual prospecting taking too much time, low email deliverability, difficulty scaling outbound without hiring more SDRs, poor CRM data quality.",
  "signals_prompt": "Companies actively hiring SDRs or BDRs, or posting about sales automation challenges."
}
```

### Step 6: Tool Selection
**Purpose**: Configure automation stack

**Fields**:
| Field | Type | Required | Options |
|-------|------|----------|---------|
| lead_source | select | Yes | Apollo, LinkedIn, CSV Upload, HubSpot List, Manual |
| enrichment | multi-select | Yes | Clay, Hunter, Clearbit, Apollo Enrich, ZoomInfo |
| crm | select | Yes | HubSpot, Salesforce, Attio, Pipedrive, None |
| sequencer | select | Yes | Smartlead, Amplemarket, Instantly, Lemlist, HubSpot Sequences |
| approval_gate | toggle | No | Default: true |
| slack_notifications | toggle | No | Default: true |

**Example**:
```json
{
  "lead_source": "apollo",
  "enrichment": ["clay", "hunter"],
  "crm": "hubspot",
  "sequencer": "smartlead",
  "approval_gate": true,
  "slack_notifications": true
}
```

### Step 7: Review & Generate
**Purpose**: Confirm and create

**Display**:
- Campaign summary
- ICP profile preview
- Tool stack visualization
- Estimated workflow nodes

**Actions**:
- Edit any section
- Generate campaign
- Save as draft

---

## Generated Outputs

### 1. Campaign Overview (campaign-overview.md)
```markdown
# Campaign: {{campaign_title}}

## Company Profile
...

## Target ICP
...

## Buyer Persona
...

## Tool Stack
...
```

### 2. n8n Workflow JSON (workflow.json)
Production-ready n8n workflow with all nodes configured.

### 3. Email Framework (email-framework.md)
PAS email templates with personalization variables.

### 4. Build Prompts (build-prompts.md)
Prompts for regenerating or adjusting the workflow.

### 5. Deploy Guide (deploy-guide.md)
Step-by-step instructions for going live.

### 6. Skill Definition (skill.md)
Claude Code skill for reuse.

---

## Dashboard Integration

### Campaign List View
```typescript
interface Campaign {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
  stats: {
    leads_found: number;
    emails_sent: number;
    replies: number;
    meetings: number;
  };
}
```

### Campaign Workspace View
```typescript
interface CampaignWorkspace {
  campaign: Campaign;
  outputs: {
    workflow_json: string;
    email_framework: string;
    deploy_guide: string;
    skill_definition: string;
  };
  agents: {
    tools: AgentStatus;
    copywriter: AgentStatus;
    workflow: AgentStatus;
    analyst: AgentStatus;
  };
}
```

### Quick Actions
- Edit Campaign
- Download Outputs
- Deploy to n8n
- View Analytics
- Chat with Agent

---

## Webhook Payload

### POST /api/webhook/intake
```json
{
  "company": {
    "name": "...",
    "background": "...",
    "product": "..."
  },
  "campaign": {
    "title": "...",
    "description": "..."
  },
  "icp": {
    "industries": [],
    "company_size": "...",
    "geographies": [],
    "prompt": "..."
  },
  "persona": {
    "titles": [],
    "seniority": [],
    "departments": [],
    "prompt": "..."
  },
  "signals": {
    "triggers": [],
    "pain_points": "...",
    "prompt": "..."
  },
  "tools": {
    "lead_source": "...",
    "enrichment": [],
    "crm": "...",
    "sequencer": "...",
    "approval_gate": true,
    "slack_notifications": true
  }
}
```

### Response
```json
{
  "campaign_id": "uuid",
  "status": "processing",
  "outputs": {
    "workflow_json": "/api/campaigns/{id}/workflow.json",
    "email_framework": "/api/campaigns/{id}/email-framework.md",
    "deploy_guide": "/api/campaigns/{id}/deploy-guide.md",
    "skill_definition": "/api/campaigns/{id}/skill.md"
  },
  "estimated_time_seconds": 30
}
```

---

## Pricing Tiers

### DIY Package ($19.99 one-time)
- n8n workflow templates
- Email framework templates
- Build prompts
- Self-serve deploy guide
- Claude Code skills

### Pro BYOK ($99/month)
- Full dashboard access
- Unlimited campaigns
- All agents (tools, copy, workflow, analyst)
- BYOK API key management
- Priority support

### Custom Build ($999+)
- White-glove implementation
- Custom integrations
- Dedicated support
- Training sessions
- SLA guarantees
