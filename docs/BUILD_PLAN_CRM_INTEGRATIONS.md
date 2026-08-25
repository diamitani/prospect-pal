# Subagent Build Plan: CRM Setup & Tool Integrations

**Role**: CRM & Systems Integration Engineer  
**Objective**: Connect customer CRM systems of record, manage OAuth tokens via Composio, verify self-hosted n8n instances, and enforce strict deduplication shields.

---

## 1. Scope of Work
- Manage OAuth connections for HubSpot, Salesforce, Slack, Gmail, and LinkedIn via Composio SDK.
- Configure and test self-hosted n8n REST endpoints (`/api/v1/workflows`) and API keys.
- Enforce the **CRM Shield Policy**: Never enroll a contact if active deals or customer tags exist in the CRM of record.

## 2. API Endpoints
- `POST /api/composio/connect`: Initiates secure OAuth popup for selected CRM.
- `GET /api/composio/status`: Polls connection health and active account IDs.
- `POST /api/n8n/deploy`: Validates connection and deploys compiled JSON directly into n8n instance.

## 3. QA Acceptance Criteria
- [x] Zero credential exposure on server storage (strictly client-held or AWS Secrets Manager).
- [x] Seamless fallback from direct API push to downloadable JSON package.
- [x] CRM dedupe gate returns binary halt / proceed signal with 100% reliability.
