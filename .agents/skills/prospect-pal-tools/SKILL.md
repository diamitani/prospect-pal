---
name: prospect-pal-tools
description: >
  Tool Configuration Agent for Prospect PAL. Creates MCP scripts and integrations for 
  lead sources, enrichment providers, CRMs, and sequencers. Use when configuring 
  data enrichment tools, CRM connections, or outreach platform integrations.
  Triggers: configure tools, setup integration, mcp script, api connection, 
  lead source setup, crm connect, sequencer config.
tools: Read, Write, Edit, Bash, WebFetch
---

# Tool Configuration Agent

Configure and connect all the tools in your prospect automation stack.

---

## Supported Tool Categories

### Lead Sources
| Tool | Type | Configuration |
|------|------|---------------|
| Apollo | API | `APOLLO_API_KEY`, search filters |
| LinkedIn | OAuth | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` |
| CSV Upload | File | Column mapping, file path |
| HubSpot Lists | API | `HUBSPOT_API_KEY`, list ID |
| Manual Entry | Form | Direct input fields |

### Enrichment Providers
| Tool | Type | Returns |
|------|------|---------|
| Clay | Webhook | Email, phone, LinkedIn, company data, AI personalization |
| Hunter | API | Verified email addresses |
| Clearbit | API | Full person and company profiles |
| Apollo Enrich | API | Contact and company enrichment |
| ZoomInfo | API | B2B contact data |

### CRM Systems
| CRM | Auth | Objects |
|-----|------|---------|
| HubSpot | API Key / OAuth | Contacts, Companies, Deals, Notes |
| Salesforce | OAuth | Leads, Contacts, Accounts, Opportunities |
| Attio | API Key | Objects, Attributes, Records |
| Pipedrive | API Key | Persons, Organizations, Deals |

### Sequencers
| Tool | Auth | Capabilities |
|------|------|--------------|
| Smartlead | API Key | Multi-mailbox, warm-up, campaigns |
| Amplemarket | API Key | AI sequencing, intent data |
| Instantly | API Key | Email warm-up, campaigns |
| Lemlist | API Key | Personalized images, multi-channel |

---

## Configuration Workflows

### Pattern 1: Company Ingestion

**From CRM (HubSpot)**
```javascript
// n8n HTTP Request node configuration
{
  "method": "GET",
  "url": "https://api.hubapi.com/crm/v3/lists/{{listId}}/memberships",
  "headers": {
    "Authorization": "Bearer {{HUBSPOT_API_KEY}}"
  },
  "query": {
    "limit": 100
  }
}
```

**From Spreadsheet**
```javascript
// n8n Read Binary File + Spreadsheet File node
{
  "fileFormat": "csv",
  "headerRow": true,
  "columns": {
    "company_name": "A",
    "domain": "B",
    "contact_name": "C",
    "email": "D",
    "title": "E"
  }
}
```

**From Direct Search (Apollo)**
```javascript
// n8n HTTP Request to Apollo
{
  "method": "POST",
  "url": "https://api.apollo.io/v1/mixed_people/search",
  "headers": {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache"
  },
  "body": {
    "api_key": "{{APOLLO_API_KEY}}",
    "q_organization_domains": "{{domains}}",
    "person_titles": ["VP Sales", "Director of Sales", "Sales Manager"],
    "person_seniorities": ["vp", "director", "manager"],
    "per_page": 25,
    "page": 1
  }
}
```

### Pattern 2: Contact Search

**People Search with Filters**
```javascript
// Clay People Search configuration
{
  "provider": "clay_people_search",
  "config": {
    "company_domain_column": "Domain",
    "job_titles": ["CEO", "CTO", "VP Sales", "VP Revenue", "Director"],
    "departments": ["Sales", "Revenue Operations", "Business Development"],
    "seniority": ["C-Level", "VP", "Director"],
    "max_results": 5
  }
}
```

**Technology Filter**
```javascript
// Filter contacts by tech stack
{
  "conditions": {
    "any": [
      { "field": "tech_stack", "contains": "HubSpot" },
      { "field": "tech_stack", "contains": "Salesforce" },
      { "field": "tech_stack", "contains": "Outreach" }
    ]
  }
}
```

### Pattern 3: CRM Push

**Create HubSpot Contact**
```javascript
// n8n HubSpot node - Create Contact
{
  "resource": "contact",
  "operation": "create",
  "properties": {
    "email": "={{ $json.email }}",
    "firstname": "={{ $json.first_name }}",
    "lastname": "={{ $json.last_name }}",
    "jobtitle": "={{ $json.title }}",
    "company": "={{ $json.company_name }}",
    "phone": "={{ $json.phone }}",
    "linkedin_url": "={{ $json.linkedin }}",
    "clay_icp_score": "={{ $json.icp_score }}",
    "clay_ai_hook": "={{ $json.personalized_hook }}",
    "lead_source": "Prospect PAL"
  }
}
```

**Create Salesforce Lead**
```javascript
// n8n Salesforce node - Create Lead
{
  "resource": "lead",
  "operation": "create",
  "fields": {
    "FirstName": "={{ $json.first_name }}",
    "LastName": "={{ $json.last_name }}",
    "Email": "={{ $json.email }}",
    "Title": "={{ $json.title }}",
    "Company": "={{ $json.company_name }}",
    "Phone": "={{ $json.phone }}",
    "Website": "={{ $json.domain }}",
    "LeadSource": "Outbound - Prospect PAL",
    "Description": "={{ $json.research_notes }}"
  }
}
```

### Pattern 4: Outreach Enrollment

**Smartlead Campaign Add**
```javascript
// n8n HTTP Request to Smartlead
{
  "method": "POST",
  "url": "https://server.smartlead.ai/api/v1/campaigns/{{CAMPAIGN_ID}}/leads",
  "headers": {
    "Authorization": "Bearer {{SMARTLEAD_API_KEY}}",
    "Content-Type": "application/json"
  },
  "body": {
    "email": "={{ $json.email }}",
    "first_name": "={{ $json.first_name }}",
    "last_name": "={{ $json.last_name }}",
    "company_name": "={{ $json.company_name }}",
    "custom_fields": {
      "title": "={{ $json.title }}",
      "personalized_hook": "={{ $json.personalized_hook }}",
      "pain_point": "={{ $json.pain_point }}"
    }
  }
}
```

**Amplemarket Lead Create**
```javascript
// n8n HTTP Request to Amplemarket
{
  "method": "POST",
  "url": "https://api.amplemarket.com/v2/leads",
  "headers": {
    "Authorization": "Bearer {{AMPLEMARKET_API_KEY}}",
    "Content-Type": "application/json"
  },
  "body": {
    "email": "={{ $json.email }}",
    "first_name": "={{ $json.first_name }}",
    "last_name": "={{ $json.last_name }}",
    "company": "={{ $json.company_name }}",
    "title": "={{ $json.title }}",
    "sequence_id": "{{SEQUENCE_ID}}",
    "custom_fields": {
      "icp_score": "={{ $json.icp_score }}",
      "ai_hook": "={{ $json.personalized_hook }}"
    }
  }
}
```

---

## MCP Server Templates

### Clay MCP Server
```typescript
// mcp-clay-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server({
  name: "clay-mcp",
  version: "1.0.0",
});

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "clay_create_table",
      description: "Create a new Clay table",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string" },
          columns: { type: "array", items: { type: "object" } },
        },
      },
    },
    {
      name: "clay_add_rows",
      description: "Add rows to a Clay table",
      inputSchema: {
        type: "object",
        properties: {
          table_id: { type: "string" },
          rows: { type: "array" },
        },
      },
    },
    {
      name: "clay_run_enrichment",
      description: "Trigger enrichment on a Clay table",
      inputSchema: {
        type: "object",
        properties: {
          table_id: { type: "string" },
          column_ids: { type: "array", items: { type: "string" } },
        },
      },
    },
  ],
}));
```

### HubSpot MCP Server
```typescript
// mcp-hubspot-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server({
  name: "hubspot-mcp",
  version: "1.0.0",
});

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "hubspot_search_contacts",
      description: "Search HubSpot contacts",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
          properties: { type: "array", items: { type: "string" } },
        },
      },
    },
    {
      name: "hubspot_create_contact",
      description: "Create a HubSpot contact",
      inputSchema: {
        type: "object",
        properties: {
          email: { type: "string" },
          properties: { type: "object" },
        },
      },
    },
    {
      name: "hubspot_get_lists",
      description: "Get all HubSpot lists",
      inputSchema: { type: "object", properties: {} },
    },
  ],
}));
```

---

## Environment Variables Template

```bash
# .env.template for Prospect PAL

# Lead Sources
APOLLO_API_KEY=your_apollo_key
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Enrichment
CLAY_API_KEY=your_clay_key
CLAY_WEBHOOK_URL=https://api.clay.com/v1/webhooks/your_webhook_id
HUNTER_API_KEY=your_hunter_key
CLEARBIT_API_KEY=your_clearbit_key
ZOOMINFO_API_KEY=your_zoominfo_key

# CRM
HUBSPOT_API_KEY=your_hubspot_key
SALESFORCE_CLIENT_ID=your_salesforce_client_id
SALESFORCE_CLIENT_SECRET=your_salesforce_client_secret
ATTIO_API_KEY=your_attio_key
PIPEDRIVE_API_KEY=your_pipedrive_key

# Sequencers
SMARTLEAD_API_KEY=your_smartlead_key
AMPLEMARKET_API_KEY=your_amplemarket_key
INSTANTLY_API_KEY=your_instantly_key
LEMLIST_API_KEY=your_lemlist_key

# AI
AWS_BEARER_TOKEN=your_aws_bedrock_token
OPENAI_API_KEY=your_openai_key

# Notifications
SLACK_WEBHOOK_URL=your_slack_webhook
SLACK_BOT_TOKEN=your_slack_bot_token

# n8n
N8N_API_KEY=your_n8n_key
N8N_BASE_URL=https://your-n8n-instance.com
```

---

## Connection Test Functions

### Test Apollo Connection
```javascript
async function testApollo(apiKey) {
  const response = await fetch("https://api.apollo.io/v1/auth/health", {
    headers: { "Api-Key": apiKey }
  });
  return response.ok;
}
```

### Test HubSpot Connection
```javascript
async function testHubSpot(apiKey) {
  const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts?limit=1", {
    headers: { "Authorization": `Bearer ${apiKey}` }
  });
  return response.ok;
}
```

### Test Clay Connection
```javascript
async function testClay(webhookUrl) {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ test: true })
  });
  return response.ok;
}
```

---

## Usage

```
User: "Configure Apollo as my lead source and connect to HubSpot"

Agent:
1. Generate Apollo search configuration
2. Create HubSpot dedup check node
3. Generate credential template
4. Output: n8n node configurations ready to import
```
