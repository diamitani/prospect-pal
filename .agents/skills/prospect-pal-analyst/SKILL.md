---
name: prospect-pal-analyst
description: >
  Execution Analyst Agent for Prospect PAL. Monitor, diagnose, and fix n8n 
  workflow executions. Parse runData telemetry, identify failure patterns, 
  diagnose rate limits and API errors, and generate post-mortem reports.
  Triggers: analyze execution, workflow error, n8n failed, debug run, 
  execution analyst, fix workflow, diagnose error, run report.
tools: Read, Write, Edit, Bash, WebFetch
---

# Execution Analyst Agent

Monitor, diagnose, and fix n8n workflow executions with 95%+ accuracy.

---

## Execution Data Structure

### runData Format
```json
{
  "data": {
    "resultData": {
      "runData": {
        "Node Name": [
          {
            "startTime": 1704067200000,
            "executionTime": 1234,
            "source": [{ "previousNode": "Previous Node" }],
            "data": {
              "main": [[{ "json": { "field": "value" } }]]
            },
            "error": {
              "message": "Error message",
              "description": "Detailed description",
              "httpCode": "401"
            }
          }
        ]
      }
    },
    "startData": { "startNodes": ["Trigger Node"] },
    "executionData": {
      "nodeExecutionOrder": ["Node1", "Node2", "Node3"]
    }
  },
  "mode": "manual",
  "startedAt": "2024-01-01T00:00:00.000Z",
  "stoppedAt": "2024-01-01T00:00:05.000Z",
  "status": "error",
  "workflowId": "abc123"
}
```

---

## Error Classification

### HTTP Status Codes
| Code | Category | Common Cause | Fix |
|------|----------|--------------|-----|
| 400 | Bad Request | Invalid payload | Check request body format |
| 401 | Unauthorized | Invalid/expired credential | Refresh API key |
| 403 | Forbidden | Missing permissions | Check API scopes |
| 404 | Not Found | Invalid endpoint/ID | Verify URL and resource |
| 429 | Rate Limited | Too many requests | Add delay, reduce batch |
| 500 | Server Error | Upstream issue | Retry with backoff |
| 502 | Bad Gateway | Proxy/load balancer | Retry after delay |
| 503 | Service Unavailable | Service down | Check status page, retry later |
| 504 | Gateway Timeout | Slow response | Increase timeout |

### Error Types
| Type | Pattern | Diagnosis | Fix |
|------|---------|-----------|-----|
| Auth | 401, "unauthorized", "invalid token" | Credential expired/invalid | Regenerate API key |
| Rate Limit | 429, "rate limit", "too many requests" | Hitting API limits | Add delays, batch smaller |
| Timeout | "timeout", "ETIMEDOUT", 504 | Slow external service | Increase timeout, async |
| Data | "undefined", "null", "missing field" | Input data issue | Add null checks |
| Format | "invalid json", "parse error" | Malformed payload | Validate JSON structure |
| Network | "ECONNREFUSED", "ENOTFOUND" | Connection issue | Check URL, DNS |

---

## Diagnostic Patterns

### Pattern 1: Authentication Failure
```
Symptom: 401 Unauthorized on API node
Diagnosis: API key invalid, expired, or missing

Checks:
1. Is the credential configured in n8n?
2. Is the API key valid? (test in Postman)
3. Is the auth header format correct?
4. Does the key have required scopes?

Fix:
- Regenerate API key in provider dashboard
- Update credential in n8n Settings → Credentials
- Verify header format (Bearer vs API Key)
```

### Pattern 2: Rate Limiting
```
Symptom: 429 Too Many Requests, intermittent failures
Diagnosis: Exceeding API rate limits

Checks:
1. What are the API rate limits?
2. How many requests per minute?
3. Are requests batched?
4. Is there a delay between calls?

Fix:
- Add Wait node (1-2 seconds between calls)
- Reduce batch size (e.g., 10 instead of 100)
- Implement exponential backoff
- Use API's bulk endpoints if available
```

### Pattern 3: Timeout
```
Symptom: ETIMEDOUT, Gateway Timeout, execution hangs
Diagnosis: External service slow to respond

Checks:
1. What is the default timeout?
2. Is the external service healthy?
3. How long does the operation take?
4. Is the payload too large?

Fix:
- Increase timeout in node options
- Use webhook for async processing
- Split into smaller requests
- Check service status page
```

### Pattern 4: Data Missing
```
Symptom: "Cannot read property 'X' of undefined"
Diagnosis: Expected data not present in input

Checks:
1. Does the previous node output data?
2. Is the field name spelled correctly?
3. Is the data in the expected structure?
4. Are there null/empty values?

Fix:
- Add null checks: {{ $json.field || "default" }}
- Use IF node to filter empty items
- Add Set node to normalize data structure
- Check upstream node for data issues
```

### Pattern 5: JSON Parse Error
```
Symptom: "Unexpected token", "invalid json"
Diagnosis: Response is not valid JSON

Checks:
1. Is the response actually JSON?
2. Is there HTML in the response (error page)?
3. Is the Content-Type correct?
4. Is the body double-encoded?

Fix:
- Check response format in API docs
- Add error handling for non-JSON responses
- Verify Content-Type header
- Use JSON.parse() only when needed
```

---

## Diagnostic Queries

### Get Failed Executions
```javascript
// n8n API - Get failed executions
const executions = await fetch(
  `${N8N_URL}/api/v1/executions?status=error&limit=10`,
  { headers: { "X-N8N-API-KEY": apiKey } }
).then(r => r.json());
```

### Analyze Error Distribution
```javascript
// Group errors by type
const errorCounts = executions.reduce((acc, exec) => {
  const error = exec.data?.resultData?.runData?.[errorNode]?.[0]?.error;
  if (error) {
    const type = error.httpCode || error.message?.split(':')[0] || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
  }
  return acc;
}, {});
```

### Find Failing Node
```javascript
// Identify which node failed
function findFailingNode(execution) {
  const runData = execution.data?.resultData?.runData;
  for (const [nodeName, nodeRuns] of Object.entries(runData || {})) {
    if (nodeRuns[0]?.error) {
      return {
        node: nodeName,
        error: nodeRuns[0].error,
        input: nodeRuns[0].source
      };
    }
  }
  return null;
}
```

---

## Fix Templates

### Add Retry Logic
```json
{
  "parameters": {
    "options": {
      "retry": {
        "enabled": true,
        "maxRetries": 3,
        "waitBetweenRetries": 2000
      }
    }
  }
}
```

### Add Rate Limit Delay
```json
{
  "name": "Rate Limit Delay",
  "type": "n8n-nodes-base.wait",
  "position": [beforeFailingNode, y],
  "parameters": {
    "amount": 1,
    "unit": "seconds"
  }
}
```

### Add Null Check
```javascript
// In Code node or expression
const value = $json.field ?? "default";
// Or
const value = $json.nested?.deeply?.field || "fallback";
```

### Add Error Handler
```json
{
  "name": "Error Handler",
  "type": "n8n-nodes-base.errorTrigger",
  "position": [500, 500],
  "parameters": {}
}
```

### Add Timeout
```json
{
  "parameters": {
    "options": {
      "timeout": 30000
    }
  }
}
```

---

## Post-Mortem Report Template

```markdown
# Execution Post-Mortem Report

## Summary
- **Workflow**: {{workflow_name}}
- **Execution ID**: {{execution_id}}
- **Status**: Failed
- **Duration**: {{duration_ms}}ms
- **Failed At**: {{timestamp}}

## Error Details
- **Failing Node**: {{node_name}}
- **Error Type**: {{error_type}}
- **HTTP Code**: {{http_code}}
- **Message**: {{error_message}}

## Root Cause Analysis
{{root_cause_analysis}}

## Timeline
1. {{node_1}} - Success ({{duration_1}}ms)
2. {{node_2}} - Success ({{duration_2}}ms)
3. {{node_3}} - **FAILED** ({{error_summary}})

## Fix Applied
{{fix_description}}

## Prevention
{{prevention_recommendations}}

## Metrics Impact
- Leads processed before failure: {{leads_processed}}
- Estimated leads lost: {{leads_lost}}
- Time to resolution: {{resolution_time}}
```

---

## Health Check Dashboard

### Key Metrics
| Metric | Description | Healthy | Warning | Critical |
|--------|-------------|---------|---------|----------|
| Success Rate | % of successful executions | >95% | 90-95% | <90% |
| Avg Duration | Average execution time | <5min | 5-10min | >10min |
| Error Rate | Errors per day | <5 | 5-20 | >20 |
| Queue Depth | Pending executions | <10 | 10-50 | >50 |

### Daily Health Check Query
```javascript
// Get execution stats for last 24 hours
const stats = await getExecutionStats(workflowId, 24);
return {
  totalExecutions: stats.total,
  successRate: (stats.success / stats.total * 100).toFixed(1) + '%',
  avgDuration: (stats.totalDuration / stats.total / 1000).toFixed(1) + 's',
  errors: stats.errors,
  topErrors: getTopErrors(stats.errorDetails, 3)
};
```

### Slack Alert Template
```
🚨 Workflow Alert: {{workflow_name}}

Status: {{status}}
Error: {{error_message}}
Node: {{failing_node}}

Last successful run: {{last_success}}
Consecutive failures: {{failure_count}}

View execution: {{execution_url}}
```

---

## Monitoring Setup

### Webhook for Execution Failures
```json
{
  "name": "Monitor Failed Executions",
  "nodes": [
    {
      "name": "Error Trigger",
      "type": "n8n-nodes-base.errorTrigger",
      "parameters": {}
    },
    {
      "name": "Send Alert",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#alerts",
        "text": "=🚨 Workflow failed: {{ $json.workflow.name }}\n\nError: {{ $json.execution.error.message }}\n\nView: {{ $json.execution.url }}"
      }
    }
  ]
}
```

### Daily Summary Report
```javascript
// Generate daily execution summary
const summary = {
  date: new Date().toISOString().split('T')[0],
  workflows: {},
  totals: {
    executions: 0,
    success: 0,
    failed: 0,
    avgDuration: 0
  }
};

for (const workflow of workflows) {
  const stats = await getStats(workflow.id);
  summary.workflows[workflow.name] = stats;
  summary.totals.executions += stats.total;
  summary.totals.success += stats.success;
  summary.totals.failed += stats.failed;
}

summary.totals.successRate = 
  (summary.totals.success / summary.totals.executions * 100).toFixed(1) + '%';
```

---

## Usage

```
User: "My Apollo search node keeps failing with 429 errors"

Agent:
1. Diagnosis: Rate limiting - exceeding Apollo API limits
2. Apollo limit: 100 requests/minute for standard tier
3. Current workflow: No delay between calls, 50 leads/batch

Fix:
1. Add Wait node (2 seconds) before Apollo node
2. Reduce batch size to 25 leads
3. Enable retry with 5s backoff

Output: Modified workflow JSON with rate limit protection
```

```
User: "The workflow ran but no contacts were created in HubSpot"

Agent:
1. Check execution data for HubSpot node
2. Verify input data exists at that node
3. Check for silent failures (201 but no data)
4. Review HubSpot API response

Diagnosis: Filter node removed all items (ICP score threshold too high)

Fix: Adjust filter threshold from 80 to 70, or review scoring logic
```
