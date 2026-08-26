---
name: prospect-pal-workflow
description: >
  Workflow Generator Agent for Prospect PAL. Generates production-ready n8n JSON 
  workflows from campaign configuration. Builds node sequences for lead discovery, 
  enrichment, AI research, email generation, and sequencer enrollment.
  Triggers: generate workflow, n8n json, build workflow, create automation, 
  workflow builder, n8n template, automation workflow.
tools: Read, Write, Edit
---

# Workflow Generator Agent

Generate production-ready n8n workflow JSON from your campaign configuration.

---

## Workflow Architecture

### Standard Pipeline
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   TRIGGER   │───▶│  CRM CHECK  │───▶│   FILTER    │───▶│   ENRICH    │
│  (Schedule) │    │  (Dedup)    │    │ (New only)  │    │   (Clay)    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
       ┌────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ AI RESEARCH │───▶│  AI EMAIL   │───▶│  APPROVAL   │───▶│  SEQUENCER  │
│  (Claude)   │    │  (Claude)   │    │   (Slack)   │    │ (Smartlead) │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
       ┌────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐    ┌─────────────┐
│  CRM SYNC   │───▶│   REPORT    │
│ (HubSpot)   │    │   (Slack)   │
└─────────────┘    └─────────────┘
```

---

## Node Library

### Trigger Nodes

#### Schedule Trigger
```json
{
  "id": "schedule_trigger",
  "name": "Daily Schedule",
  "type": "n8n-nodes-base.scheduleTrigger",
  "typeVersion": 1.1,
  "position": [250, 300],
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "hours",
          "triggerAtHour": 7
        }
      ]
    }
  }
}
```

#### Webhook Trigger
```json
{
  "id": "webhook_trigger",
  "name": "Webhook Receiver",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 1,
  "position": [250, 300],
  "parameters": {
    "path": "prospect-pal-intake",
    "httpMethod": "POST",
    "responseMode": "responseNode"
  },
  "webhookId": "{{uuid}}"
}
```

### Lead Source Nodes

#### Apollo Search
```json
{
  "id": "apollo_search",
  "name": "Apollo Lead Search",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "position": [500, 300],
  "parameters": {
    "method": "POST",
    "url": "https://api.apollo.io/v1/mixed_people/search",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "api_key",
          "value": "={{$env.APOLLO_API_KEY}}"
        },
        {
          "name": "person_titles",
          "value": "={{$json.target_titles}}"
        },
        {
          "name": "q_organization_num_employees_ranges",
          "value": "=['11,50', '51,200', '201,500']"
        },
        {
          "name": "per_page",
          "value": "=25"
        }
      ]
    }
  }
}
```

### CRM Nodes

#### HubSpot Check (Dedup)
```json
{
  "id": "hubspot_check",
  "name": "Check HubSpot Exists",
  "type": "n8n-nodes-base.hubspot",
  "typeVersion": 2,
  "position": [750, 300],
  "parameters": {
    "resource": "contact",
    "operation": "search",
    "filters": {
      "propertyName": "email",
      "operator": "EQ",
      "propertyValue": "={{ $json.email }}"
    },
    "limit": 1
  },
  "credentials": {
    "hubspotApi": {
      "id": "{{HUBSPOT_CREDENTIAL_ID}}",
      "name": "HubSpot API"
    }
  }
}
```

#### HubSpot Create Contact
```json
{
  "id": "hubspot_create",
  "name": "Create HubSpot Contact",
  "type": "n8n-nodes-base.hubspot",
  "typeVersion": 2,
  "position": [2250, 300],
  "parameters": {
    "resource": "contact",
    "operation": "create",
    "properties": [
      { "name": "email", "value": "={{ $json.email }}" },
      { "name": "firstname", "value": "={{ $json.first_name }}" },
      { "name": "lastname", "value": "={{ $json.last_name }}" },
      { "name": "jobtitle", "value": "={{ $json.title }}" },
      { "name": "company", "value": "={{ $json.company_name }}" },
      { "name": "phone", "value": "={{ $json.phone }}" },
      { "name": "website", "value": "={{ $json.domain }}" },
      { "name": "clay_icp_score", "value": "={{ $json.icp_score }}" },
      { "name": "clay_ai_hook", "value": "={{ $json.personalized_hook }}" }
    ]
  },
  "credentials": {
    "hubspotApi": {
      "id": "{{HUBSPOT_CREDENTIAL_ID}}",
      "name": "HubSpot API"
    }
  }
}
```

### Filter Node

#### Deduplication Filter
```json
{
  "id": "dedup_filter",
  "name": "Filter New Leads Only",
  "type": "n8n-nodes-base.filter",
  "typeVersion": 1,
  "position": [1000, 300],
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": true,
        "leftValue": "",
        "typeValidation": "strict"
      },
      "conditions": [
        {
          "id": "condition_1",
          "leftValue": "={{ $json.results.length }}",
          "rightValue": "0",
          "operator": {
            "type": "number",
            "operation": "equals"
          }
        }
      ]
    }
  }
}
```

### Enrichment Nodes

#### Clay Webhook
```json
{
  "id": "clay_enrich",
  "name": "Clay Enrichment",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "position": [1250, 300],
  "parameters": {
    "method": "POST",
    "url": "={{$env.CLAY_WEBHOOK_URL}}",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={{ JSON.stringify({ domain: $json.domain, company: $json.company_name, name: $json.name, title: $json.title }) }}"
  }
}
```

### AI Nodes

#### Claude Research
```json
{
  "id": "ai_research",
  "name": "AI Deep Research",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "position": [1500, 300],
  "parameters": {
    "method": "POST",
    "url": "https://api.anthropic.com/v1/messages",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "x-api-key", "value": "={{$env.ANTHROPIC_API_KEY}}" },
        { "name": "anthropic-version", "value": "2023-06-01" },
        { "name": "Content-Type", "value": "application/json" }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={{ JSON.stringify({ model: 'claude-3-5-sonnet-20241022', max_tokens: 1024, messages: [{ role: 'user', content: 'Research this prospect for personalized outreach:\\n\\nName: ' + $json.name + '\\nTitle: ' + $json.title + '\\nCompany: ' + $json.company_name + '\\nDomain: ' + $json.domain + '\\n\\nFind: 1) Recent trigger events (funding, hiring, product launch) 2) Specific pain points based on their role 3) A personalized hook for cold outreach. Return JSON with keys: trigger_event, pain_point, personalized_hook' }] }) }}"
  }
}
```

#### Claude Email Writer
```json
{
  "id": "ai_email",
  "name": "AI Email Writer",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "position": [1750, 300],
  "parameters": {
    "method": "POST",
    "url": "https://api.anthropic.com/v1/messages",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "x-api-key", "value": "={{$env.ANTHROPIC_API_KEY}}" },
        { "name": "anthropic-version", "value": "2023-06-01" },
        { "name": "Content-Type", "value": "application/json" }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={{ JSON.stringify({ model: 'claude-3-5-sonnet-20241022', max_tokens: 512, system: 'You are an expert cold email copywriter. Write in PAS framework: Problem (1 sentence), Agitate (1 sentence), Solution (1 sentence), CTA (1 sentence). Keep total email under 75 words. No spam words. Be specific and personalized.', messages: [{ role: 'user', content: 'Write a cold email for:\\n\\nRecipient: ' + $json.name + ', ' + $json.title + ' at ' + $json.company_name + '\\nTrigger Event: ' + $json.research.trigger_event + '\\nPain Point: ' + $json.research.pain_point + '\\nPersonalized Hook: ' + $json.research.personalized_hook + '\\n\\nOur Product: [PRODUCT_DESCRIPTION]\\nValue Prop: [VALUE_PROPOSITION]\\n\\nReturn JSON with keys: subject, body' }] }) }}"
  }
}
```

### Approval Nodes

#### IF Approval Gate
```json
{
  "id": "approval_gate",
  "name": "Approval Required?",
  "type": "n8n-nodes-base.if",
  "typeVersion": 2,
  "position": [2000, 300],
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": true,
        "leftValue": "",
        "typeValidation": "strict"
      },
      "conditions": [
        {
          "id": "condition_approval",
          "leftValue": "={{$env.APPROVAL_REQUIRED}}",
          "rightValue": "true",
          "operator": {
            "type": "string",
            "operation": "equals"
          }
        }
      ]
    }
  }
}
```

#### Slack Approval Message
```json
{
  "id": "slack_approval",
  "name": "Slack Review Queue",
  "type": "n8n-nodes-base.slack",
  "typeVersion": 2.1,
  "position": [2250, 400],
  "parameters": {
    "resource": "message",
    "operation": "post",
    "channel": "={{$env.SLACK_APPROVAL_CHANNEL}}",
    "text": "=🎯 New outreach ready for review\\n\\n*To:* {{ $json.name }} ({{ $json.title }})\\n*Company:* {{ $json.company_name }}\\n*Subject:* {{ $json.email.subject }}\\n\\n{{ $json.email.body }}\\n\\nReact ✅ to approve or ❌ to reject"
  },
  "credentials": {
    "slackApi": {
      "id": "{{SLACK_CREDENTIAL_ID}}",
      "name": "Slack API"
    }
  }
}
```

### Sequencer Nodes

#### Smartlead Enrollment
```json
{
  "id": "smartlead_enroll",
  "name": "Smartlead Enrollment",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "position": [2500, 300],
  "parameters": {
    "method": "POST",
    "url": "=https://server.smartlead.ai/api/v1/campaigns/{{$env.SMARTLEAD_CAMPAIGN_ID}}/leads",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "Authorization", "value": "=Bearer {{$env.SMARTLEAD_API_KEY}}" },
        { "name": "Content-Type", "value": "application/json" }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={{ JSON.stringify({ email: $json.email, first_name: $json.first_name, last_name: $json.last_name, company_name: $json.company_name, custom_fields: { title: $json.title, personalized_hook: $json.research.personalized_hook, pain_point: $json.research.pain_point } }) }}"
  }
}
```

---

## Complete Workflow Template

```json
{
  "name": "Prospect PAL - Outbound Automation",
  "nodes": [
    {{schedule_trigger}},
    {{apollo_search}},
    {{hubspot_check}},
    {{dedup_filter}},
    {{clay_enrich}},
    {{ai_research}},
    {{ai_email}},
    {{approval_gate}},
    {{slack_approval}},
    {{smartlead_enroll}},
    {{hubspot_create}}
  ],
  "connections": {
    "Daily Schedule": {
      "main": [[{ "node": "Apollo Lead Search", "type": "main", "index": 0 }]]
    },
    "Apollo Lead Search": {
      "main": [[{ "node": "Check HubSpot Exists", "type": "main", "index": 0 }]]
    },
    "Check HubSpot Exists": {
      "main": [[{ "node": "Filter New Leads Only", "type": "main", "index": 0 }]]
    },
    "Filter New Leads Only": {
      "main": [[{ "node": "Clay Enrichment", "type": "main", "index": 0 }]]
    },
    "Clay Enrichment": {
      "main": [[{ "node": "AI Deep Research", "type": "main", "index": 0 }]]
    },
    "AI Deep Research": {
      "main": [[{ "node": "AI Email Writer", "type": "main", "index": 0 }]]
    },
    "AI Email Writer": {
      "main": [[{ "node": "Approval Required?", "type": "main", "index": 0 }]]
    },
    "Approval Required?": {
      "main": [
        [{ "node": "Slack Review Queue", "type": "main", "index": 0 }],
        [{ "node": "Smartlead Enrollment", "type": "main", "index": 0 }]
      ]
    },
    "Slack Review Queue": {
      "main": [[{ "node": "Smartlead Enrollment", "type": "main", "index": 0 }]]
    },
    "Smartlead Enrollment": {
      "main": [[{ "node": "Create HubSpot Contact", "type": "main", "index": 0 }]]
    }
  },
  "active": false,
  "settings": {
    "executionOrder": "v1"
  },
  "versionId": "1",
  "meta": {
    "instanceId": "prospect-pal"
  }
}
```

---

## Configuration Options

### Lead Source Variants
| Source | Trigger Node | Configuration |
|--------|--------------|---------------|
| Apollo | httpRequest | API search params |
| LinkedIn | httpRequest | Sales Navigator API |
| CSV | readBinaryFile | File path, column map |
| HubSpot List | hubspot | List ID |
| Webhook | webhook | POST endpoint |

### Enrichment Chains
| Chain | Nodes | Fallback |
|-------|-------|----------|
| Clay Only | clay_enrich | - |
| Clay + Hunter | clay_enrich → hunter_verify | Skip if Clay has email |
| Full Waterfall | clay → hunter → clearbit | Stop on first valid email |

### Sequencer Options
| Sequencer | Node | Enrollment |
|-----------|------|------------|
| Smartlead | httpRequest | Campaign ID |
| Amplemarket | httpRequest | Sequence ID |
| Instantly | httpRequest | Campaign ID |
| Lemlist | httpRequest | Campaign ID |
| HubSpot Seq | hubspot | Sequence enrollment |

---

## Usage

```
User: "Generate an n8n workflow that uses Apollo for leads, 
       Clay for enrichment, and Smartlead for outreach. 
       Add HubSpot dedup and Slack approval."

Agent:
1. Select nodes: schedule_trigger, apollo_search, hubspot_check, 
   dedup_filter, clay_enrich, ai_research, ai_email, 
   approval_gate, slack_approval, smartlead_enroll, hubspot_create
2. Build connections based on standard pipeline
3. Generate complete n8n JSON
4. Output: Production-ready workflow file
```
