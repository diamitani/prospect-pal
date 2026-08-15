/**
 * Workflow Generator — DuckDuckGo AI powered
 * Replaces pal-pipeline.ts with a cleaner, working implementation
 * Uses DuckDuckGo AI (free, no key needed) as primary backend
 */

import { askDDG, DDGMessage } from "./duckduckgo";

// ===========================================================================
// TYPES
// ===========================================================================

export interface WorkflowConfig {
  // Step 1: Tools
  leadSource:   "apollo" | "linkedin" | "upload_csv" | "hubspot_stage" | "manual";
  enrichment:   ("clay" | "hunter" | "clearbit" | "apollo_enrich")[];
  crm:          "hubspot" | "salesforce" | "attio" | "pipedrive" | "none";
  sequencer:    "smartlead" | "amplemarket" | "instantly" | "lemlist" | "hubspot_seq";
  approvalGate: boolean;
  slackAlerts:  boolean;

  // Step 2: ICP
  icpPrompt: string;         // Free-text ICP description
  icpFile?:  string;         // Uploaded document content

  // Step 3: Company Data
  companyUrls:   string[];   // Target company URLs
  companyPrompt: string;     // Additional company context
}

export interface N8nNode {
  id:       string;
  type:     string;          // n8n node type slug
  label:    string;          // Display name
  category: NodeCategory;
  icon:     string;          // Emoji or SVG
  color:    string;          // Accent color hex
  subtitle: string;          // Short description
  config?:  Record<string, unknown>; // Node parameters
}

export type NodeCategory =
  | "trigger"
  | "api"
  | "crm"
  | "enrichment"
  | "ai"
  | "logic"
  | "messaging"
  | "sequencer"
  | "output";

export interface WorkflowResult {
  nodes:          N8nNode[];
  connections:    [string, string][];  // [fromId, toId]
  n8nJson:        string;
  deployGuide:    string;
  emailTemplate:  string;
  buildPrompts:   string;
}

// ===========================================================================
// STATIC NODE LIBRARY — pre-built nodes for each tool
// ===========================================================================

const NODE_LIBRARY: Record<string, N8nNode> = {
  schedule_trigger: {
    id: "schedule_trigger", type: "n8n-nodes-base.scheduleTrigger",
    label: "Daily Schedule", category: "trigger", icon: "⏰", color: "#F59E0B",
    subtitle: "Runs at 7:00 AM every day",
  },
  apollo_search: {
    id: "apollo_search", type: "n8n-nodes-base.httpRequest",
    label: "Apollo Lead Search", category: "api", icon: "🏺", color: "#3B82F6",
    subtitle: "GET /v1/people/search — returns 25 leads",
  },
  linkedin_search: {
    id: "linkedin_search", type: "n8n-nodes-base.httpRequest",
    label: "LinkedIn Prospect Search", category: "api", icon: "💼", color: "#0077B5",
    subtitle: "Search by title, company, industry",
  },
  csv_trigger: {
    id: "csv_trigger", type: "n8n-nodes-base.readBinaryFile",
    label: "Read CSV Upload", category: "trigger", icon: "📄", color: "#6B7280",
    subtitle: "Parse uploaded lead list",
  },
  hubspot_check: {
    id: "hubspot_check", type: "n8n-nodes-base.hubspot",
    label: "HubSpot CRM Check", category: "crm", icon: "🔶", color: "#FF7A59",
    subtitle: "Skip if contact exists",
  },
  salesforce_check: {
    id: "salesforce_check", type: "n8n-nodes-base.salesforce",
    label: "Salesforce CRM Check", category: "crm", icon: "☁️", color: "#00A1E0",
    subtitle: "Deduplicate against Salesforce",
  },
  attio_check: {
    id: "attio_check", type: "n8n-nodes-base.httpRequest",
    label: "Attio CRM Check", category: "crm", icon: "🔬", color: "#6E40C9",
    subtitle: "Check existing records",
  },
  dedup_filter: {
    id: "dedup_filter", type: "n8n-nodes-base.filter",
    label: "Deduplication Filter", category: "logic", icon: "🔀", color: "#6B7280",
    subtitle: "Remove existing CRM contacts",
  },
  clay_enrich: {
    id: "clay_enrich", type: "n8n-nodes-base.httpRequest",
    label: "Clay Enrichment", category: "enrichment", icon: "🧱", color: "#8B5CF6",
    subtitle: "Waterfall: email + LinkedIn + company data",
  },
  hunter_enrich: {
    id: "hunter_enrich", type: "n8n-nodes-base.httpRequest",
    label: "Hunter Email Finder", category: "enrichment", icon: "🎯", color: "#EC4899",
    subtitle: "Verify email deliverability",
  },
  clearbit_enrich: {
    id: "clearbit_enrich", type: "n8n-nodes-base.httpRequest",
    label: "Clearbit Company Data", category: "enrichment", icon: "🔍", color: "#3B82F6",
    subtitle: "Firmographics & tech stack",
  },
  ai_research: {
    id: "ai_research", type: "n8n-nodes-base.httpRequest",
    label: "AI Deep Research", category: "ai", icon: "🤖", color: "#7C3AED",
    subtitle: "Claude: pain points & triggers",
  },
  ai_email: {
    id: "ai_email", type: "n8n-nodes-base.httpRequest",
    label: "AI Email Writer", category: "ai", icon: "✍️", color: "#7C3AED",
    subtitle: "PAS framework, <75 words",
  },
  approval_gate: {
    id: "approval_gate", type: "n8n-nodes-base.if",
    label: "Approval Gate", category: "logic", icon: "🚦", color: "#F59E0B",
    subtitle: "Route to Slack review queue",
  },
  slack_approval: {
    id: "slack_approval", type: "n8n-nodes-base.slack",
    label: "Slack Review Message", category: "messaging", icon: "💬", color: "#4ADE80",
    subtitle: "Human approves/rejects email",
  },
  smartlead_enroll: {
    id: "smartlead_enroll", type: "n8n-nodes-base.httpRequest",
    label: "Smartlead Enrollment", category: "sequencer", icon: "📬", color: "#06B6D4",
    subtitle: "POST /campaigns/{id}/leads",
  },
  amplemarket_enroll: {
    id: "amplemarket_enroll", type: "n8n-nodes-base.httpRequest",
    label: "Amplemarket Enrollment", category: "sequencer", icon: "📡", color: "#06B6D4",
    subtitle: "Add to outreach sequence",
  },
  instantly_enroll: {
    id: "instantly_enroll", type: "n8n-nodes-base.httpRequest",
    label: "Instantly Enrollment", category: "sequencer", icon: "⚡", color: "#F59E0B",
    subtitle: "Add to email campaign",
  },
  lemlist_enroll: {
    id: "lemlist_enroll", type: "n8n-nodes-base.httpRequest",
    label: "Lemlist Enrollment", category: "sequencer", icon: "✉️", color: "#7C3AED",
    subtitle: "Add to personalized sequence",
  },
  hubspot_create: {
    id: "hubspot_create", type: "n8n-nodes-base.hubspot",
    label: "Create HubSpot Contact", category: "crm", icon: "🔶", color: "#FF7A59",
    subtitle: "Save enriched contact + dossier",
  },
  salesforce_create: {
    id: "salesforce_create", type: "n8n-nodes-base.salesforce",
    label: "Create Salesforce Lead", category: "crm", icon: "☁️", color: "#00A1E0",
    subtitle: "Create lead record with notes",
  },
  slack_summary: {
    id: "slack_summary", type: "n8n-nodes-base.slack",
    label: "Daily Summary Report", category: "messaging", icon: "📊", color: "#4ADE80",
    subtitle: "Send run stats to Slack",
  },
};

// ===========================================================================
// BUILD NODE SEQUENCE from config
// ===========================================================================

export function buildNodeSequence(config: WorkflowConfig): { nodes: N8nNode[]; connections: [string, string][] } {
  const nodes: N8nNode[] = [];
  const connections: [string, string][] = [];

  const add = (key: string, overrides?: Partial<N8nNode>) => {
    if (NODE_LIBRARY[key]) {
      nodes.push({ ...NODE_LIBRARY[key], ...overrides });
    }
  };

  const connect = (a: string, b: string) => connections.push([a, b]);

  // 1. Trigger
  const triggerMap: Record<string, string> = {
    apollo: "apollo_search",
    linkedin: "linkedin_search",
    upload_csv: "csv_trigger",
    hubspot_stage: "hubspot_check",
    manual: "csv_trigger",
  };
  const triggerId = triggerMap[config.leadSource] || "apollo_search";

  if (config.leadSource === "upload_csv" || config.leadSource === "manual") {
    add("csv_trigger");
  } else {
    add("schedule_trigger");
    connect("schedule_trigger", triggerId);
    if (triggerId !== "schedule_trigger") add(triggerId);
  }

  // 2. CRM dedup check
  const crmCheckMap: Record<string, string> = {
    hubspot: "hubspot_check", salesforce: "salesforce_check", attio: "attio_check",
    pipedrive: "hubspot_check", none: "dedup_filter",
  };
  const crmCheckId = crmCheckMap[config.crm] || "hubspot_check";
  add(crmCheckId);
  connect(triggerId, crmCheckId);

  // Filter node
  add("dedup_filter");
  connect(crmCheckId, "dedup_filter");

  // 3. Enrichment
  const lastEnrichId = { current: "dedup_filter" };
  config.enrichment.forEach((enr) => {
    const key = `${enr}_enrich`;
    if (NODE_LIBRARY[key]) {
      add(key);
      connect(lastEnrichId.current, key);
      lastEnrichId.current = key;
    }
  });
  if (config.enrichment.length === 0) {
    add("clay_enrich");
    connect("dedup_filter", "clay_enrich");
    lastEnrichId.current = "clay_enrich";
  }

  // 4. AI Research + Email
  add("ai_research");
  connect(lastEnrichId.current, "ai_research");
  add("ai_email");
  connect("ai_research", "ai_email");

  // 5. Approval gate
  let preSequenceId = "ai_email";
  if (config.approvalGate) {
    add("approval_gate");
    connect("ai_email", "approval_gate");
    add("slack_approval");
    connect("approval_gate", "slack_approval");
    preSequenceId = "slack_approval";
  }

  // 6. Sequencer
  const seqMap: Record<string, string> = {
    smartlead: "smartlead_enroll", amplemarket: "amplemarket_enroll",
    instantly: "instantly_enroll", lemlist: "lemlist_enroll",
    hubspot_seq: "hubspot_create",
  };
  const seqId = seqMap[config.sequencer] || "smartlead_enroll";
  add(seqId);
  connect(preSequenceId, seqId);

  // 7. CRM sync (if not using CRM as sequencer)
  const crmCreateMap: Record<string, string> = {
    hubspot: "hubspot_create", salesforce: "salesforce_create",
  };
  const crmCreateId = crmCreateMap[config.crm];
  if (crmCreateId && crmCreateId !== seqId) {
    add(crmCreateId);
    connect(seqId, crmCreateId);
  }

  // 8. Slack summary (if enabled)
  if (config.slackAlerts) {
    add("slack_summary");
    connect(crmCreateId || seqId, "slack_summary");
  }

  return { nodes, connections };
}

// ===========================================================================
// AI-POWERED ARTIFACT GENERATION (DuckDuckGo AI)
// ===========================================================================

export async function generateN8nJson(config: WorkflowConfig, nodes: N8nNode[]): Promise<string> {
  const prompt = `Generate a valid n8n workflow JSON for this outbound prospect automation.

Tools configured:
- Lead Source: ${config.leadSource}
- Enrichment: ${config.enrichment.join(", ")}
- CRM: ${config.crm}
- Sequencer: ${config.sequencer}
- Approval Gate: ${config.approvalGate}

Nodes to include (in order):
${nodes.map((n, i) => `${i + 1}. ${n.label} (type: ${n.type})`).join("\n")}

ICP Context: ${config.icpPrompt.slice(0, 200)}

Rules:
- Use {{CREDENTIAL_NAME}} placeholders for all API keys
- Include position data for each node (x, y coords spaced 250px apart horizontally)
- Connect all nodes with proper connections object
- Return ONLY valid JSON, no markdown fences
- The JSON must have "nodes" array and "connections" object at root level`;

  try {
    return await askDDG(
      [{ role: "user", content: prompt }],
      "You are an n8n workflow engineer. Output only valid n8n workflow JSON. No markdown. No explanation.",
      "gpt-4o-mini"
    );
  } catch {
    // Fallback: generate a template JSON
    return generateFallbackJson(config, nodes);
  }
}

export async function generateDeployGuide(config: WorkflowConfig): Promise<string> {
  const creds: Record<string, string[]> = {
    apollo:      ["APOLLO_API_KEY"],
    linkedin:    ["LINKEDIN_CLIENT_ID", "LINKEDIN_CLIENT_SECRET"],
    upload_csv:  [],
    hubspot_stage: ["HUBSPOT_API_KEY"],
    manual:      [],
  };

  const enrichCreds: Record<string, string> = {
    clay: "CLAY_WEBHOOK_URL", hunter: "HUNTER_API_KEY",
    clearbit: "CLEARBIT_API_KEY", apollo_enrich: "APOLLO_API_KEY",
  };

  const seqCreds: Record<string, string> = {
    smartlead: "SMARTLEAD_API_KEY", amplemarket: "AMPLEMARKET_API_KEY",
    instantly: "INSTANTLY_API_KEY", lemlist: "LEMLIST_API_KEY",
    hubspot_seq: "HUBSPOT_API_KEY",
  };

  const allCreds = [
    ...(creds[config.leadSource] || []),
    ...config.enrichment.map((e) => enrichCreds[e]).filter(Boolean),
    config.crm !== "none" ? `${config.crm.toUpperCase()}_API_KEY` : "",
    seqCreds[config.sequencer] || "",
    config.slackAlerts ? "SLACK_WEBHOOK_URL" : "",
  ].filter(Boolean);

  return `# Deployment Guide
Generated: ${new Date().toLocaleDateString()}

## Step 1: Import Workflow
1. Open n8n → New Workflow → Import from File
2. Upload \`prospect-pal-workflow.json\`

## Step 2: Add Credentials
In n8n Settings → Credentials, add:
${allCreds.map((c) => `- [ ] **${c}**`).join("\n")}

## Step 3: Configure Lead Source (${config.leadSource})
${config.leadSource === "apollo"
  ? "- Set Apollo search: titles, industries, company size\n- Recommended: 25 leads/day limit"
  : config.leadSource === "upload_csv"
  ? "- Upload your CSV with columns: name, email, company, title, domain"
  : "- Configure your data source in the trigger node"}

## Step 4: Test Run
1. Click Execute Workflow manually
2. Check each node output in the execution log
3. Verify a contact appears in ${config.crm} and ${config.sequencer}

## Step 5: Enable Schedule
- The workflow runs at 7 AM daily by default
- Change in the Schedule Trigger node
`;
}

export async function generateEmailTemplate(config: WorkflowConfig): Promise<string> {
  try {
    return await askDDG(
      [{ role: "user", content: `Write a 3-sentence cold email template using the PAS framework for this ICP:\n\n${config.icpPrompt}\n\nInclude {{first_name}}, {{company}}, {{trigger_event}} variables. Keep it under 75 words. Add 3 subject line options.` }],
      "You are an expert cold email copywriter. Write concise, high-converting outreach emails.",
      "gpt-4o-mini"
    );
  } catch {
    return `Subject: Quick question about {{company}}'s outbound

Hi {{first_name}},

Noticed {{trigger_event}} at {{company}} — most teams your size struggle with [pain point from ICP].

We help similar companies [specific outcome] without [painful alternative].

Worth a 15-min call this week?`;
  }
}

export async function generateBuildPrompts(config: WorkflowConfig): Promise<string> {
  return `# Workflow Customization Prompts

## Change Lead Source
"Update my workflow to use LinkedIn Sales Navigator instead of ${config.leadSource}. Keep the same enrichment pipeline."

## Add More Enrichment
"Add ZoomInfo company data enrichment between the Clay step and AI research."

## Adjust ICP Filters
"Narrow my Apollo search to companies with 50-200 employees in the FinTech vertical only."

## Change Email Framework
"Rewrite the email node to use the BAB (Before-After-Bridge) framework instead of PAS."

## Add Follow-Up Sequence
"Add a 3-touch follow-up: Day 3 (case study), Day 7 (different angle), Day 14 (break-up)."

## Add Reporting
"Add a Google Sheets node to log each lead with status, email sent, and reply date."
`;
}

// ===========================================================================
// FALLBACK JSON GENERATOR (no AI needed)
// ===========================================================================

function generateFallbackJson(config: WorkflowConfig, nodes: N8nNode[]): string {
  const n8nNodes = nodes.map((node, i) => ({
    id: `node_${i + 1}`,
    name: node.label,
    type: node.type,
    typeVersion: 1,
    position: [300 + i * 280, 300],
    parameters: getNodeParameters(node, config),
    credentials: getNodeCredentials(node, config),
  }));

  const connections: Record<string, unknown> = {};
  const { connections: edges } = buildNodeSequence(config);
  edges.forEach(([from, to]) => {
    const fromIdx = nodes.findIndex((n) => n.id === from);
    const toIdx   = nodes.findIndex((n) => n.id === to);
    if (fromIdx >= 0 && toIdx >= 0) {
      const fromName = nodes[fromIdx].label;
      const toName   = nodes[toIdx].label;
      if (!connections[fromName]) connections[fromName] = { main: [[]] };
      (connections[fromName] as { main: { node: string; type: string; index: number }[][] }).main[0].push({ node: toName, type: "main", index: 0 });
    }
  });

  return JSON.stringify({ nodes: n8nNodes, connections, active: false, settings: { executionOrder: "v1" } }, null, 2);
}

function getNodeParameters(node: N8nNode, config: WorkflowConfig): Record<string, unknown> {
  const params: Record<string, Record<string, unknown>> = {
    "n8n-nodes-base.scheduleTrigger": { rule: { interval: [{ field: "hours", hoursInterval: 24 }] } },
    "n8n-nodes-base.httpRequest": {
      method: "POST",
      url: getNodeUrl(node.id, config),
      authentication: "genericCredentialType",
      headers: { parameters: [{ name: "Content-Type", value: "application/json" }] },
    },
    "n8n-nodes-base.if": { conditions: { conditions: [{ value1: "={{$json.confidence}}", operation: "larger", value2: 0.85 }] } },
  };
  return params[node.type] || {};
}

function getNodeUrl(nodeId: string, _config: WorkflowConfig): string {
  const urls: Record<string, string> = {
    apollo_search:      "https://api.apollo.io/v1/people/search",
    clay_enrich:        "https://api.clay.com/v1/webhooks",
    hunter_enrich:      "https://api.hunter.io/v2/email-finder",
    ai_research:        "https://api.anthropic.com/v1/messages",
    ai_email:           "https://api.anthropic.com/v1/messages",
    smartlead_enroll:   "https://server.smartlead.ai/api/v1/campaigns",
    amplemarket_enroll: "https://api.amplemarket.com/v2/leads",
  };
  return urls[nodeId] || "https://api.example.com/endpoint";
}

function getNodeCredentials(node: N8nNode, _config: WorkflowConfig): Record<string, unknown> {
  const creds: Record<string, { name: string }> = {
    "n8n-nodes-base.hubspot":     { name: "HubSpot API" },
    "n8n-nodes-base.salesforce":  { name: "Salesforce OAuth" },
    "n8n-nodes-base.slack":       { name: "Slack API" },
  };
  return creds[node.type] ? { [node.type + "Api"]: creds[node.type] } : {};
}
