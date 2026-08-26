---
name: prospect-pal-n8n-engineer
description: >
  n8n Systems Engineer Agent for Prospect PAL. Self-service workflow building, 
  customization, and debugging. Import/export n8n JSON, edit nodes, configure 
  credentials, and optimize performance. Use when building workflows yourself,
  editing existing automations, or debugging n8n issues.
  Triggers: n8n engineer, edit workflow, customize n8n, debug workflow, 
  n8n json, workflow editor, self-hosted n8n, n8n build.
tools: Read, Write, Edit, Bash, WebFetch
---

# n8n Systems Engineer Agent

Build, customize, and debug n8n workflows yourself with expert guidance.

---

## Workflow JSON Schema

### Root Structure
```json
{
  "name": "Workflow Name",
  "nodes": [],
  "connections": {},
  "active": false,
  "settings": {
    "executionOrder": "v1"
  },
  "versionId": "1",
  "meta": {
    "instanceId": "unique-id"
  }
}
```

### Node Structure
```json
{
  "id": "unique_node_id",
  "name": "Display Name",
  "type": "n8n-nodes-base.nodeType",
  "typeVersion": 1,
  "position": [x, y],
  "parameters": {},
  "credentials": {}
}
```

### Connection Structure
```json
{
  "Source Node Name": {
    "main": [
      [
        { "node": "Target Node Name", "type": "main", "index": 0 }
      ]
    ]
  }
}
```

---

## Common Node Types

### Triggers
| Type | Slug | Description |
|------|------|-------------|
| Schedule | `n8n-nodes-base.scheduleTrigger` | Time-based trigger |
| Webhook | `n8n-nodes-base.webhook` | HTTP endpoint |
| Manual | `n8n-nodes-base.manualTrigger` | Click to run |
| Cron | `n8n-nodes-base.cron` | Cron expression |

### HTTP & API
| Type | Slug | Description |
|------|------|-------------|
| HTTP Request | `n8n-nodes-base.httpRequest` | Generic API calls |
| GraphQL | `n8n-nodes-base.graphql` | GraphQL queries |
| Webhook Response | `n8n-nodes-base.respondToWebhook` | Return HTTP response |

### Logic
| Type | Slug | Description |
|------|------|-------------|
| IF | `n8n-nodes-base.if` | Conditional branching |
| Switch | `n8n-nodes-base.switch` | Multi-way branching |
| Filter | `n8n-nodes-base.filter` | Filter items |
| Merge | `n8n-nodes-base.merge` | Combine branches |
| Split In Batches | `n8n-nodes-base.splitInBatches` | Process in chunks |

### Data
| Type | Slug | Description |
|------|------|-------------|
| Code | `n8n-nodes-base.code` | JavaScript/Python |
| Set | `n8n-nodes-base.set` | Set field values |
| Function | `n8n-nodes-base.functionItem` | Transform data |
| Item Lists | `n8n-nodes-base.itemLists` | Array operations |

### Integrations
| Type | Slug | Description |
|------|------|-------------|
| HubSpot | `n8n-nodes-base.hubspot` | CRM operations |
| Salesforce | `n8n-nodes-base.salesforce` | CRM operations |
| Slack | `n8n-nodes-base.slack` | Messaging |
| Google Sheets | `n8n-nodes-base.googleSheets` | Spreadsheet |
| Airtable | `n8n-nodes-base.airtable` | Database |

---

## Expression Syntax

### Basic Expressions
```javascript
// Access input data
={{ $json.fieldName }}

// Access nested data
={{ $json.data.nested.field }}

// Access array item
={{ $json.items[0].name }}

// Access environment variable
={{ $env.API_KEY }}

// Access previous node output
={{ $node["Node Name"].json.field }}
```

### JavaScript Expressions
```javascript
// String concatenation
={{ "Hello " + $json.name }}

// Conditional
={{ $json.score > 80 ? "High" : "Low" }}

// Date formatting
={{ new Date($json.timestamp).toISOString() }}

// JSON operations
={{ JSON.stringify($json.data) }}
={{ JSON.parse($json.jsonString) }}
```

### Built-in Functions
```javascript
// Current timestamp
={{ $now.toISOString() }}

// Generate UUID
={{ $uuid }}

// Random number
={{ Math.random() }}

// Array operations
={{ $json.items.length }}
={{ $json.items.filter(i => i.active) }}
={{ $json.items.map(i => i.name) }}
```

---

## Credential Configuration

### API Key Credential
```json
{
  "credentials": {
    "httpHeaderAuth": {
      "id": "credential_id",
      "name": "API Key Auth"
    }
  }
}
```

### OAuth2 Credential
```json
{
  "credentials": {
    "oAuth2Api": {
      "id": "credential_id", 
      "name": "OAuth2 Connection"
    }
  }
}
```

### Custom Header Auth
```json
{
  "parameters": {
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "headerParameters": {
      "parameters": [
        { "name": "Authorization", "value": "=Bearer {{$env.API_KEY}}" }
      ]
    }
  }
}
```

---

## Common Patterns

### Error Handling
```json
{
  "name": "Error Handler",
  "type": "n8n-nodes-base.errorTrigger",
  "position": [500, 500],
  "parameters": {}
}
```

### Retry Logic
```json
{
  "parameters": {
    "options": {
      "retry": {
        "enabled": true,
        "maxRetries": 3,
        "waitBetweenRetries": 1000
      }
    }
  }
}
```

### Rate Limiting (Wait Node)
```json
{
  "name": "Wait 1 Second",
  "type": "n8n-nodes-base.wait",
  "parameters": {
    "amount": 1,
    "unit": "seconds"
  }
}
```

### Batch Processing
```json
{
  "name": "Split In Batches",
  "type": "n8n-nodes-base.splitInBatches",
  "parameters": {
    "batchSize": 10,
    "options": {}
  }
}
```

---

## Common GTM Workflow Patterns

### Pattern: Clay webhook → enrich → HubSpot create
```
Clay Table (webhook trigger on new row)
  → Webhook node (receives Clay row data)
  → IF node (ICP score >= 7?)
    → [true] HTTP Request → POST HubSpot contact
    → [true] HTTP Request → POST HubSpot note
    → [false] Set node (log as low-priority)
```

Node sequence:
```json
{
  "nodes": [
    {
      "name": "Clay Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "clay-to-hubspot",
        "responseMode": "onReceived"
      }
    },
    {
      "name": "Check ICP Score",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "number": [{
            "value1": "={{ $json.icp_score }}",
            "operation": "largerEqual",
            "value2": 7
          }]
        }
      }
    },
    {
      "name": "Create HubSpot Contact",
      "type": "n8n-nodes-base.hubspot",
      "parameters": {
        "resource": "contact",
        "operation": "create",
        "additionalFields": {
          "email": "={{ $json.email }}",
          "firstName": "={{ $json.first_name }}",
          "lastName": "={{ $json.last_name }}",
          "company": "={{ $json.company_name }}"
        }
      }
    }
  ]
}
```

### Pattern: HubSpot deal stage change → Amplemarket enroll
```
HubSpot Trigger (deal moved to "Demo Scheduled")
  → Get contact from deal (HTTP Request → HubSpot associations API)
  → HTTP Request → Amplemarket enroll contact in "Post-Demo" sequence
```

### Pattern: Scheduled Clay sync (daily)
```
Schedule Trigger (every day at 8am CT)
  → HTTP Request → GET Clay table rows (enriched=true, outreach_ready=true)
  → Split In Batches (50 per batch)
  → HTTP Request → POST HubSpot contacts (bulk upsert)
```

Schedule node config:
```json
{
  "name": "Daily 8am CT",
  "type": "n8n-nodes-base.scheduleTrigger",
  "parameters": {
    "rule": {
      "interval": [{
        "field": "cronExpression",
        "expression": "0 8 * * *"
      }]
    },
    "triggerTimes": {
      "item": [{
        "mode": "everyX",
        "value": 1,
        "unit": "days",
        "hour": 8,
        "timezone": "America/Chicago"
      }]
    }
  }
}
```

---

## Workflow Optimization

### Performance Tips
1. **Minimize HTTP calls** - Batch requests when possible
2. **Use filtering early** - Filter data before expensive operations
3. **Parallel branches** - Split independent operations
4. **Caching** - Store reusable data in workflow variables

### Memory Management
1. **Limit batch size** - Don't process 10,000 items at once
2. **Select only needed fields** - Don't pass unnecessary data
3. **Clean up** - Remove intermediate data after use

### Reliability
1. **Add error handling** - Use error trigger node
2. **Set timeouts** - Configure request timeouts
3. **Retry transient errors** - Enable retry for API calls
4. **Log important events** - Send to Slack/logging service

---

## Debugging Techniques

### Check Execution Data
```javascript
// Add a Code node to inspect data
console.log(JSON.stringify($input.all(), null, 2));
return $input.all();
```

### Test Individual Nodes
1. Click node → Execute Node Only
2. Check output in right panel
3. Verify data structure

### Common Issues

#### 401 Unauthorized
- Check credential configuration
- Verify API key is valid and not expired
- Confirm correct auth header format

#### 429 Rate Limited
- Add Wait node between calls
- Reduce batch size
- Implement exponential backoff

#### Timeout
- Increase timeout in node settings
- Split into smaller batches
- Use webhook for async processing

#### Missing Data
- Check input node has data
- Verify field names (case sensitive)
- Add null checks in expressions

---

## n8n API for Remote Management

### Authentication
**Auth header:** `X-N8N-API-KEY: <token>` (NOT Authorization: Bearer)

```bash
curl -H "X-N8N-API-KEY: $N8N_API_KEY" \
  https://your-n8n-instance.com/api/v1/workflows
```

---

### Workflows

#### List all workflows
```bash
GET /api/v1/workflows

# Query params:
# - limit: max results (default 10, max 250)
# - cursor: for pagination
# - active: true | false to filter by active status
# - tags: filter by tag name

curl -X GET \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "https://your-n8n-instance.com/api/v1/workflows?limit=250&active=true"
```

Response:
```json
{
  "data": [
    {
      "id": "wf_abc123",
      "name": "Clay → HubSpot Sync",
      "active": true,
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-20T14:30:00Z",
      "tags": [{ "id": "tag_1", "name": "gtm" }],
      "nodes": [...],
      "connections": {...}
    }
  ],
  "nextCursor": "next_page_cursor_here"
}
```

#### Get a specific workflow
```bash
GET /api/v1/workflows/{workflowId}

curl -X GET \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  https://your-n8n-instance.com/api/v1/workflows/{id}
```

Returns full workflow definition including all nodes and connections.

#### Create a workflow
```bash
POST /api/v1/workflows

curl -X POST \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d @workflow.json \
  https://your-n8n-instance.com/api/v1/workflows
```

Request body:
```json
{
  "name": "My New Workflow",
  "nodes": [...],
  "connections": {...},
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null
}
```

#### Update a workflow
```bash
PATCH /api/v1/workflows/{workflowId}

curl -X PATCH \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", "nodes": [...]}' \
  https://your-n8n-instance.com/api/v1/workflows/{id}
```

#### Delete a workflow
```bash
DELETE /api/v1/workflows/{workflowId}

curl -X DELETE \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  https://your-n8n-instance.com/api/v1/workflows/{id}
```

#### Activate a workflow
```bash
POST /api/v1/workflows/{workflowId}/activate

curl -X POST \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  https://your-n8n-instance.com/api/v1/workflows/{id}/activate
```

#### Deactivate a workflow
```bash
POST /api/v1/workflows/{workflowId}/deactivate

curl -X POST \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  https://your-n8n-instance.com/api/v1/workflows/{id}/deactivate
```

#### Trigger a workflow manually (webhook-based)
Workflows with a Webhook trigger node can be called directly:
```bash
POST https://your-n8n-instance.com/webhook/{webhookPath}

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"data": {...}}' \
  https://your-n8n-instance.com/webhook/{webhookPath}
```
The webhookPath is set in the Webhook trigger node config.

---

### Executions

#### List executions
```bash
GET /api/v1/executions

# Query params:
# - workflowId: filter by specific workflow
# - status: success | error | waiting | running | canceled
# - limit: max results (default 20, max 250)
# - cursor: for pagination
# - includeData: true to include full input/output data (expensive)

curl -X GET \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "https://your-n8n-instance.com/api/v1/executions?workflowId=wf_abc&status=error&limit=50"
```

Response:
```json
{
  "data": [
    {
      "id": 1234,
      "finished": true,
      "mode": "webhook",
      "startedAt": "2025-01-20T10:00:00Z",
      "stoppedAt": "2025-01-20T10:00:05Z",
      "workflowId": "wf_abc123",
      "workflowName": "Clay → HubSpot Sync",
      "status": "success",
      "data": { ... }
    }
  ],
  "nextCursor": null
}
```

#### Get a specific execution
```bash
GET /api/v1/executions/{executionId}

# Add ?includeData=true to get full input/output data for each node

curl -X GET \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "https://your-n8n-instance.com/api/v1/executions/{id}?includeData=true"
```

#### Delete an execution
```bash
DELETE /api/v1/executions/{executionId}

curl -X DELETE \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  https://your-n8n-instance.com/api/v1/executions/{id}
```

---

### Python API Examples

```python
import requests

N8N_BASE = "https://your-n8n-instance.com/api/v1"  # UPDATE
N8N_HEADERS = {
    "X-N8N-API-KEY": "<your_token>",
    "Content-Type": "application/json"
}

# List all active workflows
def list_workflows(active_only=True):
    params = {"limit": 250}
    if active_only:
        params["active"] = "true"
    resp = requests.get(f"{N8N_BASE}/workflows", headers=N8N_HEADERS, params=params)
    resp.raise_for_status()
    return resp.json()["data"]

# Get recent executions for a workflow
def get_executions(workflow_id, status=None, limit=20):
    params = {"workflowId": workflow_id, "limit": limit}
    if status:
        params["status"] = status
    resp = requests.get(f"{N8N_BASE}/executions", headers=N8N_HEADERS, params=params)
    resp.raise_for_status()
    return resp.json()["data"]

# Trigger workflow via webhook
def trigger_workflow(webhook_path, payload):
    url = f"https://your-n8n-instance.com/webhook/{webhook_path}"
    resp = requests.post(url, headers=N8N_HEADERS, json=payload)
    resp.raise_for_status()
    return resp.json()

# Create a workflow
def create_workflow(workflow_json):
    resp = requests.post(f"{N8N_BASE}/workflows", headers=N8N_HEADERS, json=workflow_json)
    resp.raise_for_status()
    return resp.json()

# Activate a workflow
def activate_workflow(workflow_id):
    resp = requests.post(f"{N8N_BASE}/workflows/{workflow_id}/activate", headers=N8N_HEADERS)
    resp.raise_for_status()
    return resp.json()
```

---

## Self-Hosted Setup

### Docker Compose
```yaml
version: "3.8"
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=password
      - N8N_ENCRYPTION_KEY=your-encryption-key
      - WEBHOOK_URL=https://your-domain.com/
    volumes:
      - n8n_data:/home/node/.n8n
    restart: always

volumes:
  n8n_data:
```

### Environment Variables
```bash
# n8n Configuration
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=https
WEBHOOK_URL=https://your-n8n-domain.com/

# Security
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=secure-password

# Database (optional - default is SQLite)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=password

# Encryption
N8N_ENCRYPTION_KEY=your-32-character-encryption-key
```

---

## Import/Export Workflows

### Export Workflow
```javascript
// From n8n UI: Workflow → Download

// Via API:
const workflow = await fetch(`${N8N_URL}/api/v1/workflows/${id}`, {
  headers: { "X-N8N-API-KEY": apiKey }
}).then(r => r.json());

// Save to file
fs.writeFileSync('workflow.json', JSON.stringify(workflow, null, 2));
```

### Import Workflow
```javascript
// From n8n UI: Workflow → Import from File

// Via API:
const workflow = JSON.parse(fs.readFileSync('workflow.json'));
await fetch(`${N8N_URL}/api/v1/workflows`, {
  method: 'POST',
  headers: {
    "X-N8N-API-KEY": apiKey,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(workflow)
});
```

### Merge Workflows
```javascript
// Combine nodes from multiple workflows
const merged = {
  name: "Merged Workflow",
  nodes: [...workflow1.nodes, ...workflow2.nodes],
  connections: {...workflow1.connections, ...workflow2.connections},
  active: false,
  settings: { executionOrder: "v1" }
};
```

---

## Usage

```
User: "Add a Slack notification at the end of my workflow 
       that sends a summary of processed leads"

Agent:
1. Load existing workflow JSON
2. Add Slack node at the end of the chain
3. Configure message with summary template
4. Update connections to include new node
5. Output: Modified workflow JSON with Slack notification
```

```
User: "My workflow is timing out on the Clay enrichment step"

Agent:
1. Identify the timeout issue
2. Add Wait node before Clay call (rate limiting)
3. Enable retry with exponential backoff
4. Split into smaller batches if needed
5. Output: Optimized workflow with reliability improvements
```
