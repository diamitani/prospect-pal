import { z } from "zod";
import { COMPOSIO_APPS, getConnectionStatuses, initiateConnection, isComposioConfigured } from "@/lib/composio";

export const AGENT_SLUG = "prospect-automation-engine";

export const schemas = {
  identify_signals: {
    icp: z.string().min(1).describe("Who your ideal customer is"),
    signalSources: z
      .array(z.string())
      .optional()
      .describe(
        "External or internal systems that show a signal (e.g. funding, hiring, platform migrations)"
      ),
    workflowOrigin: z
      .enum(["static_icp", "search_or_prompt", "another_workflow"])
      .default("static_icp")
      .describe("Where this workflow starts"),
    searchQueries: z.array(z.string()).optional(),
  },
  build_company_list: {
    source: z
      .enum(["spreadsheet", "crm", "webhook"])
      .describe("Spreadsheet, CRM view or dynamic webhook"),
    companies: z
      .array(
        z.object({
          name: z.string(),
          domain: z.string().optional(),
          signals: z.array(z.string()).optional(),
        })
      )
      .optional(),
    crmFilter: z.string().optional(),
    webhookPayload: z.record(z.string(), z.unknown()).optional(),
  },
  find_contacts: {
    method: z
      .enum(["search_syntax_mx", "enrichment_platform", "pre_acquired_list"])
      .describe(
        "Public search + email syntax + MX check, enrichment platform (Clay/ZoomInfo/Apollo), or a pre-acquired list"
      ),
    companies: z
      .array(z.object({ name: z.string(), domain: z.string().optional() }))
      .optional(),
    personas: z
      .array(z.string())
      .min(1)
      .describe('Target titles, e.g. ["VP Sales", "Head of Growth"]'),
    enrichmentProvider: z
      .enum(["clay", "zoominfo", "apollo", "other"])
      .optional(),
    preAcquiredContacts: z
      .array(
        z.object({
          name: z.string(),
          title: z.string().optional(),
          email: z.string().email().optional(),
          company: z.string(),
          linkedinUrl: z.string().optional(),
        })
      )
      .optional(),
  },
  research_prospect: {
    company: z.string(),
    domain: z.string().optional(),
    prospect: z.object({
      name: z.string(),
      title: z.string().optional(),
      linkedinUrl: z.string().optional(),
    }),
    yourProducts: z.string().describe("What you sell"),
    valueProposition: z.string(),
    knownSignals: z.array(z.string()).optional(),
  },
  write_email: {
    brief: z
      .record(z.string(), z.unknown())
      .describe("The brief returned by research_prospect"),
    format: z
      .enum(["full_email", "body_only"])
      .describe(
        "full_email = greeting, body and signature (Delivery Framework A). body_only = just the body, for a CRM messaging token (Delivery Framework B)"
      ),
    tone: z.string().optional(),
    firstName: z.string().optional(),
    signature: z.string().optional(),
  },
  enroll_outreach: {
    route: z.enum(["mailbox_direct", "sequencer"]),
    sequencerId: z
      .string()
      .optional()
      .describe("Required when route is sequencer"),
    contacts: z
      .array(
        z.object({
          email: z.string().email(),
          firstName: z.string().optional(),
          subject: z.string().optional(),
          body: z.string(),
        })
      )
      .min(1)
      .optional()
      .describe("Required the first time. Leave out when you pass approvalId."),
    approvalId: z
      .string()
      .optional()
      .describe("Pass the id of a human-approved request to send it"),
  },
  n8n_architect_and_deploy: {
    intent: z
      .string()
      .min(1)
      .describe(
        "Plain-English automation objective (e.g. 'Factors.ai signal -> Clay enrich -> HubSpot dedupe -> Amplemarket enroll')"
      ),
    surface: z
      .enum([
        "instance_mcp",
        "mcp_server_trigger",
        "mcp_client_tool",
        "standard_workflow",
      ])
      .default("mcp_server_trigger")
      .describe(
        "n8n integration surface from n8n-engineer: instance_mcp, mcp_server_trigger, mcp_client_tool, or standard_workflow"
      ),
    integrations: z
      .array(z.string())
      .optional()
      .describe("Stack tools (e.g. ['HubSpot', 'Clay', 'Amplemarket', 'Slack'])"),
    n8nInstanceUrl: z
      .string()
      .optional()
      .describe("Optional n8n instance URL (e.g. https://atlas-hxm.app.n8n.cloud)"),
    deployMode: z
      .enum(["spec_and_json", "live_deploy"])
      .default("spec_and_json"),
  },
  n8n_inspect_executions: {
    question: z
      .string()
      .default("snapshot")
      .describe(
        "Plain-English query grounded in n8n execution telemetry (e.g. 'why did execution 1003 fail', 'how many failures today', 'stalled workflows')"
      ),
    executionId: z.string().optional(),
    workflowId: z.string().optional(),
    n8nInstanceUrl: z.string().optional(),
  },
  composio_connect_integration: {
    appId: z
      .enum([
        "apollo",
        "twenty",
        "hubspot",
        "salesforce",
        "slack",
        "gmail",
        "linkedin",
      ])
      .default("hubspot")
      .describe("Target GTM app to inspect or connect via Composio OAuth / MCP"),
    mode: z
      .enum(["status", "initiate_oauth", "mcp_credential_spec"])
      .default("status"),
    userId: z.string().optional(),
  },
} as const;

export type Brief = {
  companyOverview: string;
  prospectOverview: string;
  signalInduced: string;
  signalDeduced: string;
  products: string;
  valueProposition: string;
};

export type In<K extends keyof typeof schemas> = z.infer<
  z.ZodObject<(typeof schemas)[K]>
>;

/** Swap these for real connectors (search, Clay, your CRM, Claude, your sequencer, n8n, Composio). */
export interface Providers {
  identifySignals(i: In<"identify_signals">): Promise<unknown>;
  buildCompanyList(i: In<"build_company_list">): Promise<unknown>;
  findContacts(i: In<"find_contacts">): Promise<unknown>;
  researchProspect(i: In<"research_prospect">): Promise<Brief>;
  writeEmail(
    i: In<"write_email">
  ): Promise<{
    subject?: string;
    body: string;
    crmTokenPreview?: string;
    framework?: string;
  }>;
  enroll(
    i: Required<Pick<In<"enroll_outreach">, "route" | "contacts">> & {
      sequencerId?: string;
    }
  ): Promise<unknown>;
  n8nArchitectAndDeploy(i: In<"n8n_architect_and_deploy">): Promise<unknown>;
  n8nInspectExecutions(i: In<"n8n_inspect_executions">): Promise<unknown>;
  composioConnectIntegration(
    i: In<"composio_connect_integration">
  ): Promise<unknown>;
}

// Grounded execution telemetry store from n8n-execution-analyst.skill
const GROUNDED_N8N_WORKFLOWS = [
  { id: "wf_clay_hubspot", name: "Clay -> HubSpot Sync", active: true, lastRunHoursAgo: 1.5 },
  { id: "wf_factors_signals", name: "Factors.ai Intent Signals", active: true, lastRunHoursAgo: 2.2 },
  { id: "wf_amplemarket_enroll", name: "Amplemarket Enrollment", active: true, lastRunHoursAgo: 31.4 },
  { id: "wf_old_import", name: "Legacy Apollo Import", active: false, lastRunHoursAgo: 120.0 },
];

const GROUNDED_N8N_EXECUTIONS = [
  {
    execution_id: "1001",
    workflow_id: "wf_clay_hubspot",
    workflow_name: "Clay -> HubSpot Sync",
    status: "success",
    mode: "trigger",
    started_at: "2026-07-07T10:00:00Z",
    duration_ms: 842,
    stop_node: "HubSpot Contact Upsert",
    error_message: null,
    error_category: null,
    verdict: "Completed. Last node executed: 'HubSpot Contact Upsert'.",
  },
  {
    execution_id: "1002",
    workflow_id: "wf_clay_hubspot",
    workflow_name: "Clay -> HubSpot Sync",
    status: "success",
    mode: "trigger",
    started_at: "2026-07-07T12:00:00Z",
    duration_ms: 910,
    stop_node: "HubSpot Contact Upsert",
    error_message: null,
    error_category: null,
    verdict: "Completed. Last node executed: 'HubSpot Contact Upsert'.",
  },
  {
    execution_id: "1003",
    workflow_id: "wf_clay_hubspot",
    workflow_name: "Clay -> HubSpot Sync",
    status: "error",
    mode: "trigger",
    started_at: "2026-07-07T14:10:03Z",
    duration_ms: 1205,
    stop_node: "Clay Enrichment",
    error_message: "Request failed with status code 429 - rate limit exceeded",
    error_category: "rate_limit",
    verdict: "Stopped at node 'Clay Enrichment'.",
    remediation: "Add SplitInBatches (size=10) + Wait node (1000ms) + retryOnFail (maxRetries=3, waitBetweenTries=5000ms).",
  },
  {
    execution_id: "1004",
    workflow_id: "wf_clay_hubspot",
    workflow_name: "Clay -> HubSpot Sync",
    status: "error",
    mode: "trigger",
    started_at: "2026-07-07T15:10:03Z",
    duration_ms: 1190,
    stop_node: "Clay Enrichment",
    error_message: "Request failed with status code 429 - rate limit exceeded",
    error_category: "rate_limit",
    verdict: "Stopped at node 'Clay Enrichment'.",
    remediation: "Add SplitInBatches (size=10) + Wait node (1000ms) + retryOnFail (maxRetries=3, waitBetweenTries=5000ms).",
  },
  {
    execution_id: "2001",
    workflow_id: "wf_factors_signals",
    workflow_name: "Factors.ai Intent Signals",
    status: "success",
    mode: "webhook",
    started_at: "2026-07-07T11:30:00Z",
    duration_ms: 640,
    stop_node: "Slack GTM Alert",
    error_message: null,
    error_category: null,
    verdict: "Completed. Last node executed: 'Slack GTM Alert'.",
  },
  {
    execution_id: "2002",
    workflow_id: "wf_factors_signals",
    workflow_name: "Factors.ai Intent Signals",
    status: "error",
    mode: "trigger",
    started_at: "2026-07-07T13:10:03Z",
    duration_ms: 1203,
    stop_node: "HubSpot Update",
    error_message: "Request failed with status code 401 - invalid API key",
    error_category: "auth",
    verdict: "Stopped at node 'HubSpot Update'.",
    remediation: "Rotate HubSpot_Prod OAuth2/Private App token in n8n Credentials and re-run failed execution.",
  },
];

/** Deterministic outbound, n8n engineer/analyst, and Composio providers. */
export const stubProviders: Providers = {
  async identifySignals(i) {
    const sources =
      i.signalSources && i.signalSources.length > 0
        ? i.signalSources
        : [
            "Series A-B funding announcements",
            "GTM & RevOps job postings",
            "CRM & n8n stack detection",
          ];
    return {
      step: "01_signals_and_icp",
      icp: i.icp,
      workflowOrigin: i.workflowOrigin ?? "static_icp",
      sources,
      searchParameters:
        i.searchQueries && i.searchQueries.length > 0
          ? i.searchQueries
          : [
              `site:linkedin.com/jobs "${i.icp}" ("RevOps" OR "Outbound" OR "n8n")`,
              `"${i.icp}" AND ("Series A" OR "Series B" OR "HubSpot")`,
            ],
      signalsDetected: [
        "Hiring GTM Automation or RevOps Engineer in last 14 days",
        "Active HubSpot or Salesforce CRM with outbound sequencing stack",
        "Expansion of SDR / AE headcount without dedicated ops tooling",
      ],
    };
  },

  async buildCompanyList(i) {
    const defaultCompanies = [
      {
        name: "NexusFlow Data",
        domain: "nexusflow.io",
        crmStatus: "clean_no_active_deal",
        signals: [
          "Series A ($12M)",
          "Hiring GTM Automation Engineer",
          "Runs HubSpot + n8n",
        ],
      },
      {
        name: "HyperScale AI",
        domain: "hyperscale.ai",
        crmStatus: "clean_no_active_deal",
        signals: [
          "Series B ($28M)",
          "Hiring Head of Outbound Growth",
          "Runs Salesforce + Clay",
        ],
      },
      {
        name: "CloudPulse Systems",
        domain: "cloudpulse.dev",
        crmStatus: "clean_no_active_deal",
        signals: [
          "Seed ($4.5M)",
          "Hiring Founding GTM Specialist",
          "Runs Attio + Instantly",
        ],
      },
    ];
    return {
      step: "02_target_companies",
      source: i.source,
      crmDedupeShield:
        "active (excluded 2 existing customers and 1 open opportunity)",
      companies:
        i.companies && i.companies.length > 0 ? i.companies : defaultCompanies,
    };
  },

  async findContacts(i) {
    if (i.method === "pre_acquired_list" && i.preAcquiredContacts?.length) {
      return {
        step: "03_contact_sourcing",
        method: i.method,
        bypassedSteps: ["01_signals_and_icp", "02_target_companies"],
        contacts: i.preAcquiredContacts.map((c) => ({
          ...c,
          mxVerified: true,
          syntaxPattern: "{first}.{last}@domain",
        })),
      };
    }

    const contacts = [
      {
        name: "Marcus Vance",
        firstName: "Marcus",
        title: i.personas[0] || "VP RevOps",
        company: i.companies?.[0]?.name || "NexusFlow Data",
        domain: i.companies?.[0]?.domain || "nexusflow.io",
        email: "marcus.vance@nexusflow.io",
        linkedinUrl: "https://linkedin.com/in/marcus-vance-revops",
        syntaxPattern: "{first}.{last}@nexusflow.io",
        mxVerified: true,
        provider: i.enrichmentProvider || "clay",
      },
      {
        name: "Elena Rostova",
        firstName: "Elena",
        title: i.personas[1] || i.personas[0] || "Head of Growth",
        company: i.companies?.[1]?.name || "HyperScale AI",
        domain: i.companies?.[1]?.domain || "hyperscale.ai",
        email: "elena.rostova@hyperscale.ai",
        linkedinUrl: "https://linkedin.com/in/elena-rostova-growth",
        syntaxPattern: "{first}.{last}@hyperscale.ai",
        mxVerified: true,
        provider: i.enrichmentProvider || "apollo",
      },
    ];

    return {
      step: "03_contact_sourcing",
      method: i.method,
      enrichmentProvider: i.enrichmentProvider || "clay",
      mxVerification: "passed (100% valid MX records)",
      contacts,
    };
  },

  async researchProspect(i): Promise<Brief> {
    const signalList =
      i.knownSignals && i.knownSignals.length > 0
        ? i.knownSignals.join("; ")
        : "Recent GTM Automation & RevOps hiring post plus active CRM pipeline expansion";

    return {
      companyOverview: `${i.company}${i.domain ? ` (${i.domain})` : ""} is scaling its B2B revenue motion and modernizing its outbound data and CRM infrastructure.`,
      prospectOverview: `${i.prospect.name}${i.prospect.title ? `, ${i.prospect.title}` : ""} owns outbound pipeline efficiency, tool orchestration, and rep productivity at ${i.company}.`,
      signalInduced: `Explicit trigger detected: ${signalList}.`,
      signalDeduced: `As ${i.company} scales outbound volume, reps risk spending 20+ hours per week manually stitching enrichment, CRM deduplication, and personalized copy across disconnected tools.`,
      products: i.yourProducts,
      valueProposition: i.valueProposition,
    };
  },

  async writeEmail(i) {
    const firstName = i.firstName || "Marcus";
    const induced = String(
      i.brief.signalInduced ||
        "noticed your team is scaling its outbound GTM engineering motion"
    );
    const deduced = String(
      i.brief.signalDeduced ||
        "most RevOps teams lose 20+ hours a week manually deduplicating CRM records and researching accounts before reps can send a single email"
    );
    const valueProp = String(
      i.brief.valueProposition ||
        "SalesGency deploys a 1-ICP-to-full-outbound engine directly inside your CRM and n8n stack in under 30 days, lifting reply rates 3.4x while reps only handle warm replies"
    );

    const coreBody = `Saw the signal on your end (${induced.replace(/\.$/, "")}). Typically at this stage, ${deduced.charAt(0).toLowerCase() + deduced.slice(1).replace(/\.$/, "")}.\n\n${valueProp.replace(/\.$/, "")}. Open to a 15-minute architecture walkthrough this week?`;

    const sig = i.signature || "Best,\nPatrick Diamitani\nFounder, SalesGency";

    if (i.format === "full_email") {
      return {
        framework: "Delivery Framework A: Full-Body",
        subject: "autonomous outbound architecture / quick question",
        body: `Hi ${firstName},\n\n${coreBody}\n\n${sig}`,
        crmTokenPreview: `Hi ${firstName},\n\n${coreBody}\n\n${sig}`,
      };
    }

    return {
      framework: "Delivery Framework B: Modular Body Only (CRM Token)",
      body: coreBody,
      crmTokenPreview: `Hi ${firstName},\n\n{{email_body_token}}\n\n${sig}`,
    };
  },

  async enroll(i) {
    return {
      step: "06_connect_and_enroll",
      route: i.route,
      sequencerId:
        i.sequencerId ||
        (i.route === "sequencer" ? "smartlead_prod_seq_01" : "smtp_direct_node"),
      enrolled: i.contacts.length,
      contacts: i.contacts.map((c) => c.email),
      timestamp: new Date().toISOString(),
    };
  },

  async n8nArchitectAndDeploy(i) {
    const tools =
      i.integrations && i.integrations.length > 0
        ? i.integrations
        : ["HubSpot", "Clay", "Amplemarket", "Slack"];
    const surface = i.surface || "mcp_server_trigger";
    const instanceUrl =
      i.n8nInstanceUrl ||
      process.env.N8N_BASE_URL ||
      "https://atlas-hxm.app.n8n.cloud";

    const workflowJson = {
      name: `[GTM] ${i.intent.slice(0, 42)} v1`,
      nodes: [
        surface === "mcp_server_trigger"
          ? {
              id: "node_mcp_trigger",
              name: "MCP Server Trigger",
              type: "@n8n/n8n-nodes-langchain.mcpTrigger",
              typeVersion: 1.1,
              position: [240, 320],
              parameters: { path: "gtm-outbound-engine" },
            }
          : {
              id: "node_schedule_trigger",
              name: "01 Intake & Cron",
              type: "n8n-nodes-base.scheduleTrigger",
              typeVersion: 1.2,
              position: [240, 320],
              parameters: {
                rule: {
                  interval: [{ field: "cronExpression", expression: "0 8 * * *" }],
                },
              },
            },
        {
          id: "node_normalizer",
          name: "02 Data Normalizer",
          type: "n8n-nodes-base.set",
          typeVersion: 3.4,
          position: [480, 320],
          parameters: {
            assignments: {
              assignments: [
                { name: "domain", value: "={{ $json.domain }}", type: "string" },
                { name: "icpSignal", value: "={{ $json.signal }}", type: "string" },
              ],
            },
          },
        },
        {
          id: "node_crm_dedupe",
          name: "03 CRM Dedupe Shield",
          type: "n8n-nodes-base.hubspot",
          typeVersion: 2,
          position: [720, 320],
          credentials: { hubspotOAuth2Api: { id: "cred_hubspot_prod", name: "HubSpot_Prod" } },
          parameters: { resource: "contact", operation: "search" },
        },
        {
          id: "node_enrichment",
          name: "04 Data Tool Adapter (Clay/Apollo)",
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.2,
          position: [960, 320],
          parameters: {
            method: "POST",
            url: "https://api.clay.com/v1/tables/enrich",
            options: { retry: { enabled: true, maxRetries: 3, waitBetweenRetries: 2000 } },
          },
        },
        {
          id: "node_ai_research",
          name: "05 AI Research & PAS Copy",
          type: "@n8n/n8n-nodes-langchain.agent",
          typeVersion: 1.6,
          position: [1200, 320],
          parameters: {
            text: "=Research {{ $json.domain }} and generate Delivery Framework A/B copy.",
          },
        },
        {
          id: "node_approval_gate",
          name: "06 Human Approval Gate",
          type: "n8n-nodes-base.if",
          typeVersion: 2.2,
          position: [1440, 320],
          parameters: {
            conditions: {
              conditions: [
                {
                  leftValue: "={{ $json.approvalStatus }}",
                  rightValue: "approved",
                  operator: { type: "string", operation: "equals" },
                },
              ],
            },
          },
        },
        {
          id: "node_sequencer_enroll",
          name: "07 Sequencer & CRM Sync",
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.2,
          position: [1680, 320],
          parameters: {
            method: "POST",
            url: "https://server.smartlead.ai/api/v1/campaigns/leads",
          },
        },
      ],
      connections: {
        "02 Data Normalizer": {
          main: [[{ node: "03 CRM Dedupe Shield", type: "main", index: 0 }]],
        },
        "03 CRM Dedupe Shield": {
          main: [[{ node: "04 Data Tool Adapter (Clay/Apollo)", type: "main", index: 0 }]],
        },
        "04 Data Tool Adapter (Clay/Apollo)": {
          main: [[{ node: "05 AI Research & PAS Copy", type: "main", index: 0 }]],
        },
        "05 AI Research & PAS Copy": {
          main: [[{ node: "06 Human Approval Gate", type: "main", index: 0 }]],
        },
        "06 Human Approval Gate": {
          main: [[{ node: "07 Sequencer & CRM Sync", type: "main", index: 0 }]],
        },
      },
      active: false,
      settings: { executionOrder: "v1" },
    };

    return {
      skillsUsed: ["n8n-workflow-architect", "n8n-engineer"],
      palIntake: {
        intent: i.intent,
        surface,
        integrations: tools,
        ambiguityScore: 0.12,
      },
      rostrNpaoCanvas: {
        necessity: [
          "Named credentials only (HubSpot_Prod, Clay_Prod, Amplemarket_Prod, Slack_GTM)",
          "X-N8N-API-KEY configured in environment for remote deployment",
        ],
        anxiety: [
          "Rate-limit protection on Clay/Apollo enrichment (SplitInBatches=10 + retryOnFail)",
          "Mandatory human approval switch before any outbound sequencer write",
        ],
        priority: [
          "7-node pipeline from signal intake -> CRM dedupe -> AI research -> approval -> enroll",
        ],
        opportunity: [
          "Expose workflow via @n8n/n8n-nodes-langchain.mcpTrigger so Claude/Cursor can invoke it directly",
        ],
      },
      architectureSurface: {
        selected: surface,
        explanation:
          surface === "mcp_server_trigger"
            ? "Uses @n8n/n8n-nodes-langchain.mcpTrigger + @n8n/n8n-nodes-langchain.toolWorkflow to expose this n8n workflow as a narrow, safe MCP tool server."
            : surface === "instance_mcp"
            ? "Uses n8n Instance-Level MCP so external AI harnesses can discover and trigger enabled workflows."
            : "Standard scheduled/webhook 7-node n8n workflow with sub-workflow modularity.",
      },
      n8nApiEndpoint: `${instanceUrl}/api/v1/workflows`,
      authHeaderRequired: "X-N8N-API-KEY: $N8N_API_KEY",
      workflowJson,
    };
  },

  async n8nInspectExecutions(i) {
    const q = (i.question || "snapshot").toLowerCase();
    const instanceUrl =
      i.n8nInstanceUrl ||
      process.env.N8N_BASE_URL ||
      "https://atlas-hxm.app.n8n.cloud";

    const total = GROUNDED_N8N_EXECUTIONS.length;
    const successes = GROUNDED_N8N_EXECUTIONS.filter(
      (e) => e.status === "success"
    ).length;
    const errors = GROUNDED_N8N_EXECUTIONS.filter(
      (e) => e.status === "error"
    ).length;
    const successRate = Math.round((successes / total) * 1000) / 10;

    const stalledWorkflows = GROUNDED_N8N_WORKFLOWS.filter(
      (w) => w.active && w.lastRunHoursAgo > 26
    );

    const recurringFailures = [
      {
        workflow_id: "wf_clay_hubspot",
        workflow_name: "Clay -> HubSpot Sync",
        stop_node: "Clay Enrichment",
        error_category: "rate_limit",
        error_message: "Request failed with status code 429 - rate limit exceeded",
        count: 2,
        execution_ids: ["1003", "1004"],
        remediation:
          "Insert SplitInBatches (10) + Wait (1s) before Clay Enrichment node and enable retryOnFail.",
      },
    ];

    if (i.executionId || q.includes("1003") || q.includes("2002")) {
      const targetId =
        i.executionId || (q.includes("2002") ? "2002" : "1003");
      const found = GROUNDED_N8N_EXECUTIONS.find(
        (e) => e.execution_id === targetId
      );
      if (found) {
        return {
          skillUsed: "n8n-execution-analyst",
          mode: "read_only_grounded",
          instanceUrl,
          answer: `Execution ${found.execution_id} (${found.workflow_name}): ${found.status}. ${found.verdict} Reason: ${found.error_message || "None"} [category: ${found.error_category || "none"}]. Recommended fix: ${found.remediation || "None required."}`,
          diagnosis: found,
        };
      }
    }

    if (q.includes("stall") || q.includes("stopped running")) {
      return {
        skillUsed: "n8n-execution-analyst",
        mode: "read_only_grounded",
        instanceUrl,
        answer: `${stalledWorkflows.length} active workflow(s) look stalled (>26h without execution): ${stalledWorkflows.map((w) => `${w.name} (${w.lastRunHoursAgo}h since last run)`).join(", ")}.`,
        stalledWorkflows,
      };
    }

    return {
      skillUsed: "n8n-execution-analyst",
      mode: "read_only_grounded",
      instanceUrl,
      answer: `Grounded n8n Snapshot: ${total} executions tracked (${successes} success / ${errors} error, ${successRate}% success rate). 2 failures in 'Clay -> HubSpot Sync' (executions 1003, 1004 - HTTP 429 rate_limit at node 'Clay Enrichment') and 1 failure in 'Factors.ai Intent Signals' (execution 2002 - HTTP 401 auth at node 'HubSpot Update'). 1 active workflow stalled >26h ('Amplemarket Enrollment', 31.4h).`,
      summary: {
        totalExecutions: total,
        successes,
        errors,
        successRatePct: successRate,
      },
      recurringFailures,
      stalledWorkflows,
      executions: GROUNDED_N8N_EXECUTIONS,
    };
  },

  async composioConnectIntegration(i) {
    const configured = isComposioConfigured();
    const appMeta =
      COMPOSIO_APPS.find((a) => a.id === i.appId) || COMPOSIO_APPS[2];

    if (i.mode === "initiate_oauth" && configured) {
      const res = await initiateConnection(
        i.appId,
        i.userId || "default_workspace",
        "https://prospectpal.io/api/composio/callback"
      );
      return {
        integrationLayer: "composio_oauth",
        app: appMeta,
        ...res,
      };
    }

    const statuses = configured
      ? await getConnectionStatuses(i.userId || "default_workspace")
      : COMPOSIO_APPS.map((a) => ({
          appId: a.id,
          name: a.name,
          category: a.category,
          connected: false,
          authModes: ["Composio 1-Click OAuth", "n8n Named Credential", "MCP Bearer / ENV"],
        }));

    return {
      integrationLayer: "hybrid_composio_mcp_n8n",
      composioConfigured: configured,
      selectedApp: {
        ...appMeta,
        n8nCredentialName: `${appMeta.name.replace(/\s+/g, "_")}_Prod`,
        envVarReference: `ENV:${appMeta.id.toUpperCase()}_API_KEY`,
        oauthEndpoint: `/api/composio/connect?appId=${appMeta.id}`,
      },
      availableApps: statuses,
    };
  },
};
