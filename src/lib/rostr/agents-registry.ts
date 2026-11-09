export interface RostrAgentTool {
  name: string;
  file: string;
  phase: string;
  description: string;
  gatedByHumanApproval: boolean;
  requiresApproval: boolean;
}

export interface RostrAgentSpec {
  name: string;
  slug: string;
  version: string;
  category: string;
  tagline: string;
  summary: string;
  description: string;
  skillFile: string;
  price: string;
  nodeCount: number;
  pricing: {
    oneTime: string;
    pro: string;
    agency: string;
  };
  humanApprovalGate: string | null;
  approvalGates: string[];
  requiredScopes: string[];
  files: string[];
  tools: RostrAgentTool[];
  directoryTree: string[];
  harnesses: string[];
  manifestJson: Record<string, unknown>;
}

export const ROSTR_AGENTS: RostrAgentSpec[] = [
  {
    name: "Prospect Automation Engine",
    slug: "prospect-automation-engine",
    version: "1.0.0",
    category: "Outbound GTM",
    tagline: "1 ICP or buying signal to a full 6-step autonomous outbound pipeline.",
    summary:
      "Finds ICP accounts, extracts decision-makers, verifies MX records, compiles 4-part deep research briefs, drafts PAS outreach (Framework A or B), and enrolls prospects behind a human approval gate.",
    description:
      "Finds ICP accounts, extracts decision-makers, verifies MX records, compiles 4-part deep research briefs, drafts PAS outreach (Full-Body or Modular CRM Token), and enrolls prospects behind a human approval gate.",
    skillFile: "prospect-automation-engine-skill.md",
    price: "$19.99",
    nodeCount: 9,
    pricing: {
      oneTime: "$19.99",
      pro: "$49/mo",
      agency: "$249/mo",
    },
    humanApprovalGate: "enroll_in_sequencer",
    approvalGates: ["enroll_in_sequencer"],
    requiredScopes: [
      "ENV:HUBSPOT_API_KEY",
      "ENV:CLAY_API_KEY",
      "ENV:ANTHROPIC_API_KEY",
      "ENV:SMARTLEAD_API_KEY",
      "ENV:APPROVAL_SECRET",
    ],
    files: [
      "agent.json",
      "soul.md",
      "SKILL.md",
      "tools.json",
      "workflow.n8n.json",
      "prompt.md",
      "eval.json",
      "README.md",
    ],
    tools: [
      {
        name: "scrape_buying_signals",
        file: "tools/scrape_buying_signals.js",
        phase: "Step 01: Signals & ICP",
        description:
          "Detects funding, GTM hiring, and tech stack migration triggers matching ICP.",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
      {
        name: "dedupe_crm_contact",
        file: "tools/dedupe_crm_contact.js",
        phase: "Step 02-03: Target & Shield",
        description:
          "Queries HubSpot, Salesforce, or Twenty CRM by domain to exclude active customers and open deals.",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
      {
        name: "generate_pas_outreach",
        file: "tools/generate_pas_outreach.js",
        phase: "Step 04-05: Research & Copy",
        description:
          "Compiles induced and deduced signals into Full-Body (Framework A) or Modular Body Token (Framework B) outreach.",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
      {
        name: "enroll_in_sequencer",
        file: "tools/enroll_in_sequencer.js",
        phase: "Step 06: Outreach Execution",
        description:
          "Pushes approved prospects into Smartlead, Outreach, HubSpot Sequences, or direct SMTP.",
        gatedByHumanApproval: true,
        requiresApproval: true,
      },
    ],
    directoryTree: [
      "agents/prospect-automation-engine/",
      "  manifest.json",
      "  instructions.md",
      "  skills/prospect-automation-engine-skill.md",
      "  tools/scrape_buying_signals.js",
      "  tools/dedupe_crm_contact.js",
      "  tools/generate_pas_outreach.js",
      "  tools/enroll_in_sequencer.js  # Gated by human approval",
    ],
    harnesses: [
      "Claude Code",
      "Cursor",
      "Antigravity",
      "Vercel AI SDK",
      "Cloudflare Workers",
      "n8n",
    ],
    manifestJson: {
      name: "Prospect Automation Engine",
      slug: "prospect-automation-engine",
      version: "1.0.0",
      runtime: "rostr-v1",
      mcpEndpoint: "/api/mcp",
      skill: "skills/prospect-automation-engine-skill.md",
      tools: [
        "scrape_buying_signals",
        "dedupe_crm_contact",
        "generate_pas_outreach",
        "enroll_in_sequencer",
      ],
      humanApprovalGates: ["enroll_in_sequencer"],
      escalationPolicy: "human-in-the-loop",
    },
  },
  {
    name: "n8n Systems Engineer & MCP Architect",
    slug: "n8n-engineer",
    version: "1.2.0",
    category: "n8n Instance Control Plane",
    tagline:
      "Build, deploy, and expose live n8n workflows as MCP servers via X-N8N-API-KEY.",
    summary:
      "Operates n8n as both an automation fabric and an agent runtime. Configures Instance-Level MCP, @n8n/n8n-nodes-langchain.mcpTrigger, MCP Client Tool, Call n8n Workflow Tool, and remote deployment via X-N8N-API-KEY.",
    description:
      "Operates n8n as both an automation fabric and an agent runtime. Configures Instance-Level MCP, MCP Server Trigger, MCP Client Tool, sub-workflows, and remote deployment via the n8n Public REST API (X-N8N-API-KEY).",
    skillFile: "n8n-engineer/SKILL.md",
    price: "$19.99",
    nodeCount: 7,
    pricing: {
      oneTime: "$19.99",
      pro: "$49/mo",
      agency: "$249/mo",
    },
    humanApprovalGate: "deploy_live_n8n_workflow",
    approvalGates: ["deploy_live_n8n_workflow"],
    requiredScopes: [
      "ENV:N8N_BASE_URL",
      "ENV:N8N_API_KEY",
      "ENV:COMPOSIO_API_KEY",
    ],
    files: [
      "SKILL.md",
      "references/architecture.md",
      "references/agents.md",
      "references/http-api.md",
      "assets/workflows/mcp-server-gtm-skeleton.json",
      "assets/workflows/gtm-outbound-personalization-gateway.json",
      "assets/workflows/gtm-account-research-copilot.json",
      "assets/workflows/gtm-deal-acceleration-orchestrator.json",
    ],
    tools: [
      {
        name: "n8n_architect_and_deploy",
        file: "tools/n8n_architect_and_deploy.js",
        phase: "n8n Control Plane",
        description:
          "Compiles 7-node outbound workflows or @n8n/n8n-nodes-langchain.mcpTrigger servers and pushes to n8n via POST /api/v1/workflows.",
        gatedByHumanApproval: true,
        requiresApproval: true,
      },
      {
        name: "configure_mcp_server_trigger",
        file: "tools/configure_mcp_server_trigger.js",
        phase: "MCP Server Trigger",
        description:
          "Wires @n8n/n8n-nodes-langchain.mcpTrigger + @n8n/n8n-nodes-langchain.toolWorkflow to expose safe n8n playbooks to Claude and Cursor.",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
      {
        name: "composio_connect_integration",
        file: "tools/composio_connect_integration.js",
        phase: "Composio & Stack Auth",
        description:
          "Binds Composio 1-click OAuth or named n8n credentials (HubSpot_Prod, Clay_Prod, Amplemarket_Prod) without plaintext secrets.",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
    ],
    directoryTree: [
      "n8n-engineer/",
      "  SKILL.md",
      "  references/architecture.md",
      "  references/agents.md",
      "  references/http-api.md",
      "  references/gtm.md",
      "  assets/workflows/mcp-server-gtm-skeleton.json",
      "  assets/workflows/gtm-outbound-personalization-gateway.json",
    ],
    harnesses: [
      "Claude Code",
      "Cursor",
      "Antigravity",
      "n8n Instance MCP",
      "Vercel AI SDK",
    ],
    manifestJson: {
      name: "n8n Systems Engineer & MCP Architect",
      slug: "n8n-engineer",
      version: "1.2.0",
      runtime: "rostr-v1",
      mcpEndpoint: "/api/mcp",
      skill: "n8n-engineer/SKILL.md",
      tools: [
        "n8n_architect_and_deploy",
        "configure_mcp_server_trigger",
        "composio_connect_integration",
      ],
      humanApprovalGates: ["deploy_live_n8n_workflow"],
      escalationPolicy: "human-in-the-loop",
    },
  },
  {
    name: "n8n Execution Analyst",
    slug: "n8n-execution-analyst",
    version: "1.1.0",
    category: "n8n Telemetry & Diagnostics",
    tagline:
      "Read-only n8n execution telemetry, stop-node root cause analysis, and 26h stall detection.",
    summary:
      "Connects read-only to any n8n instance via X-N8N-API-KEY, pulls node-level runData, classifies 401/429/504 errors, flags active workflows stalled >26h, and answers plain-English queries grounded in real execution IDs.",
    description:
      "Monitors every workflow execution in your n8n instance via the Public API (X-N8N-API-KEY), extracts full node-level runData and stop-nodes, answers grounded plain-English questions citing real execution IDs, and alerts on recurring failures or stalls.",
    skillFile: "n8n-execution-analyst/SKILL.md",
    price: "$19.99",
    nodeCount: 6,
    pricing: {
      oneTime: "$19.99",
      pro: "$49/mo",
      agency: "$249/mo",
    },
    humanApprovalGate: null,
    approvalGates: [],
    requiredScopes: [
      "ENV:N8N_BASE_URL",
      "ENV:N8N_API_KEY",
      "ENV:REPORT_RECIPIENT",
    ],
    files: [
      "SKILL.md",
      "docs/README.md",
      "docs/SCHEMA.md",
      "docs/RUNBOOK.md",
      "docs/n8n-workflow.json",
      "scripts/ingest.py",
      "scripts/diagnose.py",
      "scripts/query.py",
    ],
    tools: [
      {
        name: "n8n_inspect_executions",
        file: "scripts/query.py",
        phase: "Read-Only Telemetry",
        description:
          "Answers grounded questions over n8n execution logs ('why did execution 1003 fail', 'how many failures today') citing exact execution IDs.",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
      {
        name: "diagnose_stop_node",
        file: "scripts/diagnose.py",
        phase: "Root Cause Analysis",
        description:
          "Extracts lastNodeExecuted, classifies error signatures (rate_limit 429, auth 401, timeout 504, validation), and recommends node-level fixes.",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
      {
        name: "detect_stalled_workflows",
        file: "scripts/diagnose.py",
        phase: "Stall Monitor (>26h)",
        description:
          "Flags active scheduled workflows that have gone silent for >26 hours without fabricating telemetry.",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
    ],
    directoryTree: [
      "n8n-execution-analyst/",
      "  SKILL.md",
      "  docs/README.md",
      "  docs/SCHEMA.md",
      "  docs/n8n-workflow.json",
      "  scripts/ingest.py",
      "  scripts/diagnose.py",
      "  scripts/query.py",
      "  dashboard/build.py",
    ],
    harnesses: [
      "Claude Code",
      "Cursor",
      "Antigravity",
      "n8n Native Workflow",
      "Vercel AI SDK",
    ],
    manifestJson: {
      name: "n8n Execution Analyst",
      slug: "n8n-execution-analyst",
      version: "1.1.0",
      runtime: "rostr-v1",
      mcpEndpoint: "/api/mcp",
      skill: "n8n-execution-analyst/SKILL.md",
      tools: [
        "n8n_inspect_executions",
        "diagnose_stop_node",
        "detect_stalled_workflows",
      ],
      humanApprovalGates: [],
      escalationPolicy: "read-only-safe",
    },
  },
  {
    name: "n8n Workflow Architect (FDE)",
    slug: "n8n-workflow-architect",
    version: "1.0.0",
    category: "PAL x ROSTR Compiler",
    tagline:
      "Forward-Deployed Engineer compiler: turns raw GTM intent into 6-output n8n specs & JSON.",
    summary:
      "Runs Phase 1 PAL Intake and Phase 2 ROSTR NPAO Classification (Necessity, Anxiety, Priority, Opportunity) to produce a 6-part production spec, Mermaid architecture diagram, node config table, and importable JSON.",
    description:
      "Takes any natural-language automation description, SOP, or rough idea and compiles a complete 6-output production specification: plain-English overview, step-by-step node breakdown, node config chart, Mermaid diagram, architecture doc, and importable n8n JSON.",
    skillFile: "n8n-workflow-architect/SKILL.md",
    price: "$19.99",
    nodeCount: 9,
    pricing: {
      oneTime: "$19.99",
      pro: "$49/mo",
      agency: "$249/mo",
    },
    humanApprovalGate: null,
    approvalGates: [],
    requiredScopes: [
      "ENV:HUBSPOT_API_KEY",
      "ENV:CLAY_API_KEY",
      "ENV:AMPLEMARKET_API_KEY",
      "ENV:SLACK_BOT_TOKEN",
    ],
    files: [
      "n8n-workflow-architect/SKILL.md",
      "agent.json",
      "workflow.n8n.json",
      "README.md",
    ],
    tools: [
      {
        name: "pal_intake_compiler",
        file: "tools/pal_intake_compiler.js",
        phase: "Phase 1: PAL Intake",
        description:
          "Extracts intent, trigger_type, integrations, data_in, data_out, and ambiguity_score (0.0-1.0).",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
      {
        name: "rostr_npao_classifier",
        file: "tools/rostr_npao_classifier.js",
        phase: "Phase 2: ROSTR NPAO",
        description:
          "Classifies workflow requirements into Necessity (Auth/Schema), Anxiety (Rate limits/Errors), Priority (Core logic), and Opportunity (Alerts).",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
      {
        name: "compile_six_outputs",
        file: "tools/compile_six_outputs.js",
        phase: "Phase 3: 6-Output Spec",
        description:
          "Produces Overview, Step Breakdown, Node Config Chart, Mermaid Diagram, Error/Batching Architecture, and ELT Summary.",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
    ],
    directoryTree: [
      "n8n-workflow-architect/",
      "  SKILL.md",
      "  agent.json",
      "  workflow.n8n.json",
      "  README.md",
    ],
    harnesses: ["Claude Code", "Cursor", "Antigravity", "Vercel AI SDK", "n8n"],
    manifestJson: {
      name: "n8n Workflow Architect (FDE)",
      slug: "n8n-workflow-architect",
      version: "1.0.0",
      runtime: "rostr-v1",
      mcpEndpoint: "/api/mcp",
      skill: "n8n-workflow-architect/SKILL.md",
      tools: [
        "pal_intake_compiler",
        "rostr_npao_classifier",
        "compile_six_outputs",
      ],
      humanApprovalGates: [],
      escalationPolicy: "spec-only-safe",
    },
  },
  {
    name: "Inbound Responder",
    slug: "inbound-responder",
    version: "1.0.0",
    category: "Inbound Speed-to-Lead",
    tagline:
      "Instant webhook parsing, ICP scoring, and Slack routing for inbound intent (<90s SLA).",
    summary:
      "Ingests inbound form fills and RB2B/Factors.ai website intent webhooks, scores ICP fit against firmographic criteria, and dispatches high-urgency lead cards to Slack.",
    description:
      "Ingests inbound form fills and RB2B website intent webhooks, scores ICP fit against firmographic criteria, and dispatches high-urgency lead cards to Slack.",
    skillFile: "inbound-automation-engine-skill.md",
    price: "$19.99",
    nodeCount: 5,
    pricing: {
      oneTime: "$19.99",
      pro: "$49/mo",
      agency: "$249/mo",
    },
    humanApprovalGate: null,
    approvalGates: [],
    requiredScopes: [
      "ENV:HUBSPOT_API_KEY",
      "ENV:CLAY_API_KEY",
      "ENV:SLACK_BOT_TOKEN",
    ],
    files: [
      "agent.json",
      "soul.md",
      "SKILL.md",
      "tools.json",
      "workflow.n8n.json",
      "README.md",
    ],
    tools: [
      {
        name: "parse_inbound_lead",
        file: "tools/parse_inbound_lead.js",
        phase: "Step 01: Webhook Ingest",
        description:
          "Normalizes webhook payloads, resolves company domain, and extracts role metadata.",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
      {
        name: "score_icp_fit",
        file: "tools/score_icp_fit.js",
        phase: "Step 02: ICP Scoring",
        description:
          "Evaluates employee count, funding stage, and stack fit on a 0-100 rubric.",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
      {
        name: "route_to_slack",
        file: "tools/route_to_slack.js",
        phase: "Step 03: Instant Alert",
        description:
          "Dispatches interactive lead brief and rep assignment card to Slack.",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
    ],
    directoryTree: [
      "agents/inbound-responder/",
      "  manifest.json",
      "  instructions.md",
      "  skills/inbound-automation-engine-skill.md",
      "  tools/parse_inbound_lead.js",
      "  tools/score_icp_fit.js",
      "  tools/route_to_slack.js",
    ],
    harnesses: ["Claude Code", "Cursor", "Antigravity", "Vercel AI SDK", "n8n"],
    manifestJson: {
      name: "Inbound Responder",
      slug: "inbound-responder",
      version: "1.0.0",
      runtime: "rostr-v1",
      skill: "skills/inbound-automation-engine-skill.md",
      tools: ["parse_inbound_lead", "score_icp_fit", "route_to_slack"],
      humanApprovalGates: [],
      escalationPolicy: "auto-proceed",
    },
  },
  {
    name: "CRM Hygiene & Deal Risk",
    slug: "crm-hygiene",
    version: "1.0.0",
    category: "RevOps Infrastructure",
    tagline:
      "Continuous deal-risk scanning, duplicate detection, and gated CRM merges.",
    summary:
      "Audits active CRM pipelines for stalled deals, flags duplicate contact/company records by domain, and generates weekly RevOps hygiene scorecards with human-gated record merges.",
    description:
      "Audits active CRM pipelines for stalled deals, flags duplicate contact/company records by domain, and generates weekly RevOps hygiene scorecards with human-gated record merges.",
    skillFile: "crm-hygiene-scorer.md",
    price: "$19.99",
    nodeCount: 6,
    pricing: {
      oneTime: "$19.99",
      pro: "$49/mo",
      agency: "$249/mo",
    },
    humanApprovalGate: "dedupe_crm_records",
    approvalGates: ["dedupe_crm_records"],
    requiredScopes: [
      "ENV:HUBSPOT_API_KEY",
      "ENV:SALESFORCE_TOKEN",
      "ENV:APPROVAL_SECRET",
    ],
    files: [
      "agent.json",
      "soul.md",
      "SKILL.md",
      "tools.json",
      "workflow.n8n.json",
      "README.md",
    ],
    tools: [
      {
        name: "scan_deal_risk",
        file: "tools/scan_deal_risk.js",
        phase: "Step 01: Pipeline Audit",
        description:
          "Identifies open opportunities with missing next steps or stalled buyer activity.",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
      {
        name: "dedupe_crm_records",
        file: "tools/dedupe_crm_records.js",
        phase: "Step 02: Gated Merge",
        description:
          "Stages duplicate company and contact merges across HubSpot or Salesforce.",
        gatedByHumanApproval: true,
        requiresApproval: true,
      },
      {
        name: "generate_hygiene_scorecard",
        file: "tools/generate_hygiene_scorecard.js",
        phase: "Step 03: RevOps Digest",
        description:
          "Compiles pipeline cleanliness metrics and missing attribute coverage.",
        gatedByHumanApproval: false,
        requiresApproval: false,
      },
    ],
    directoryTree: [
      "agents/crm-hygiene/",
      "  manifest.json",
      "  instructions.md",
      "  skills/crm-hygiene-scorer.md",
      "  tools/scan_deal_risk.js",
      "  tools/dedupe_crm_records.js  # Gated by human approval",
      "  tools/generate_hygiene_scorecard.js",
    ],
    harnesses: ["Claude Code", "Cursor", "Antigravity", "Vercel AI SDK", "n8n"],
    manifestJson: {
      name: "CRM Hygiene & Deal Risk",
      slug: "crm-hygiene",
      version: "1.0.0",
      runtime: "rostr-v1",
      skill: "skills/crm-hygiene-scorer.md",
      tools: [
        "scan_deal_risk",
        "dedupe_crm_records",
        "generate_hygiene_scorecard",
      ],
      humanApprovalGates: ["dedupe_crm_records"],
      escalationPolicy: "human-in-the-loop",
    },
  },
];

export const SIX_STEP_AUTOMATION_FLOW = [
  {
    step: "01",
    phase: "Phase 1: Identification & Targeting",
    title: "Signals & ICP",
    subtitle: "Trigger Sources, Workflow Origins & Search Frameworks",
    mcpTool: "identify_signals",
    summary:
      "Define the precise triggers and characteristics that indicate a prospect is ready for outreach. Establish internal or external workflow origins.",
    description:
      "Define the precise triggers and characteristics that indicate a prospect is ready for outreach. Establish internal or external workflow origins.",
    bullets: [
      "Trigger Sources: Funding rounds, GTM hiring, platform migrations",
      "Workflow Origins: Secondary automation workflows or direct signal hooks",
      "Search Parameters: Active web search queries or AI prompt frameworks",
      "Static ICP: Well-defined Ideal Customer Profile firmographics",
    ],
    highlights: [
      "Trigger Sources: Funding rounds, GTM hiring, platform migrations",
      "Workflow Origins: Secondary automation workflows or direct signal hooks",
      "Search Parameters: Active web search queries or AI prompt frameworks",
      "Static ICP: Well-defined Ideal Customer Profile firmographics",
    ],
  },
  {
    step: "02",
    phase: "Phase 1: Identification & Targeting",
    title: "Targeting",
    subtitle: "Spreadsheets, CRM Extraction & Dynamic Intent Webhooks",
    mcpTool: "build_company_list",
    summary:
      "Segment and isolate your target accounts into structured operational lists regardless of data source (CSV, CRM, Webhooks).",
    description:
      "Segment and isolate your target accounts into structured operational lists regardless of data source (CSV, CRM, Webhooks).",
    bullets: [
      "Spreadsheet Repositories: Standardized CSV or Google Sheets databases",
      "CRM Extraction: Filtered account views pulled from HubSpot or Salesforce",
      "Dynamic Webhooks: Real-time streams from website intent tools (RB2B, Factors.ai)",
    ],
    highlights: [
      "Spreadsheet Repositories: Standardized CSV or Google Sheets databases",
      "CRM Extraction: Filtered account views pulled from HubSpot or Salesforce",
      "Dynamic Webhooks: Real-time streams from website intent tools (RB2B, Factors.ai)",
    ],
  },
  {
    step: "03",
    phase: "Phase 2: Sourcing & Intelligence",
    title: "Contact Sourcing",
    subtitle: "Public Search + MX Check, Clay/Apollo/ZoomInfo, or Lead Lists",
    mcpTool: "find_contacts",
    summary:
      "Identify specific decision-makers using data enrichment platforms, web search, syntax matching, and MX record verification.",
    description:
      "Identify specific decision-makers using data enrichment platforms, web search, syntax matching, and MX record verification.",
    bullets: [
      "Public Search & Syntax Matching: LinkedIn mapping + domain naming + MX verification",
      "Data Enrichment Platforms: Clay, ZoomInfo, or Apollo automatic sync",
      "Pre-Acquired Lead Databases: Bypass Steps 1 and 2 directly to research",
    ],
    highlights: [
      "Public Search & Syntax Matching: LinkedIn mapping + domain naming + MX verification",
      "Data Enrichment Platforms: Clay, ZoomInfo, or Apollo automatic sync",
      "Pre-Acquired Lead Databases: Bypass Steps 1 and 2 directly to research",
    ],
  },
  {
    step: "04",
    phase: "Phase 2: Sourcing & Intelligence",
    title: "Deep Research",
    subtitle: "Induced Facts + Deduced Bottlenecks + Value Prop",
    mcpTool: "research_prospect",
    summary:
      "Gather contextual account and lead intelligence. Uncover induced and deduced signals, and map them to your value proposition.",
    description:
      "Gather contextual account and lead intelligence. Uncover induced and deduced signals, and map them to your value proposition.",
    bullets: [
      "Company & Prospect Overview: Core business model, growth, and prospect role",
      "Induced Signals: Explicit events like job postings, funding, or migrations",
      "Deduced Signals: Implicit challenges implied by company size, stack, or shifts",
      "Value Proposition: Precise ROI narrative tailored to their current scenario",
    ],
    highlights: [
      "Company & Prospect Overview: Core business model, growth, and prospect role",
      "Induced Signals: Explicit events like job postings, funding, or migrations",
      "Deduced Signals: Implicit challenges implied by company size, stack, or shifts",
      "Value Proposition: Precise ROI narrative tailored to their current scenario",
    ],
  },
  {
    step: "05",
    phase: "Phase 3: Messaging & Execution",
    title: "Personalization",
    subtitle: "Delivery Framework A (Full-Body) & Framework B (CRM Token)",
    mcpTool: "write_email",
    summary:
      "Deploy generative AI agents to process research data into high-converting messaging aligned with your brand voice.",
    description:
      "Deploy generative AI agents to process research data into high-converting messaging aligned with your brand voice.",
    bullets: [
      "Delivery Framework A (Full-Body): Greeting, context, value prop, CTA, and sign-off",
      "Delivery Framework B (Modular Body Only): Core body mapped as a CRM token (Hi [Name], {{email_body_token}}, Best, [Sig])",
    ],
    highlights: [
      "Delivery Framework A (Full-Body): Greeting, context, value prop, CTA, and sign-off",
      "Delivery Framework B (Modular Body Only): Core body mapped as a CRM token (Hi [Name], {{email_body_token}}, Best, [Sig])",
    ],
  },
  {
    step: "06",
    phase: "Phase 3: Messaging & Execution",
    title: "Outreach Execution",
    subtitle: "Direct Mailbox SMTP or Sequencer API (Human-Gated)",
    mcpTool: "enroll_outreach",
    summary:
      "Connect payloads to delivery platforms. Map emails directly to SMTP mailboxes or enroll contacts into sequencer APIs behind a human approval gate.",
    description:
      "Connect payloads to delivery platforms. Map emails directly to SMTP mailboxes or enroll contacts into sequencer APIs behind a human approval gate.",
    bullets: [
      "Direct Mailbox Connection: Map email, subject, and body directly to SMTP node",
      "Sequencing Platform Integration: Push enriched records to Outreach, HubSpot Sales, or Smartlead",
      "Human-in-the-Loop Gate: Never sends on first call; requires verified approvalId",
    ],
    highlights: [
      "Direct Mailbox Connection: Map email, subject, and body directly to SMTP node",
      "Sequencing Platform Integration: Push enriched records to Outreach, HubSpot Sales, or Smartlead",
      "Human-in-the-Loop Gate: Never sends on first call; requires verified approvalId",
    ],
  },
] as const;

export const ARCHITECTURE_BLUEPRINT_NODES = [
  {
    id: "01",
    node: "01 Intake & Cron",
    title: "Intake & Cron",
    caption:
      "Executes daily batches or triggers on-demand via webhook or @n8n/n8n-nodes-langchain.mcpTrigger.",
    function:
      "Executes daily batches or triggers on-demand via webhook when intent is detected or lists are uploaded.",
    platforms: "n8n, Make.com, Webhooks",
    binding: "n8n-nodes-base.scheduleTrigger",
    stage: "trigger" as const,
    icon: "Zap" as const,
  },
  {
    id: "02",
    node: "02 Data Normalizer",
    title: "Data Normalizer",
    caption:
      "Cleans messy lead entries, normalizes domains, and standardizes payload schemas.",
    function:
      "Cleans messy lead entries, normalizes domains, and standardizes payload schemas.",
    platforms: "JavaScript / Code Nodes",
    binding: "n8n-nodes-base.code",
    stage: "logic" as const,
    icon: "FileCode" as const,
  },
  {
    id: "03",
    node: "03 Deduplication Shield",
    title: "Deduplication Shield",
    caption:
      "Queries CRM by domain. Excludes active customers or open deals to protect existing relationships.",
    function:
      "Queries CRM by domain. Excludes active customers or open deals to protect existing relationships.",
    platforms: "HubSpot API, Salesforce API",
    binding: "n8n-nodes-base.hubspot",
    stage: "shield" as const,
    icon: "ShieldCheck" as const,
  },
  {
    id: "04",
    node: "04 Data Tool Adapter",
    title: "Data Tool Adapter",
    caption:
      "Locates target decision-makers based on ICP roles and verifies work emails via MX records.",
    function:
      "Locates target decision-makers based on ICP roles and verifies work emails via MX records.",
    platforms: "Clay, ZoomInfo, Apollo",
    binding: "n8n-nodes-base.httpRequest",
    stage: "data" as const,
    icon: "Search" as const,
  },
  {
    id: "05",
    node: "05 AI Research & Copy",
    title: "AI Research & Copy",
    caption:
      "Scrapes website, uncovers induced/deduced bottlenecks, and writes tailored PAS outreach on behalf of reps.",
    function:
      "Scrapes website, uncovers induced/deduced bottlenecks, and writes tailored PAS outreach on behalf of reps.",
    platforms: "Claude 3.5 Sonnet, GPT-4o, Vercel AI SDK",
    binding: "@n8n/n8n-nodes-langchain.agent",
    stage: "ai" as const,
    icon: "Sparkles" as const,
  },
  {
    id: "06",
    node: "06 Approval Switch",
    title: "Approval Switch",
    caption:
      "Routes drafted messages into a private channel for quick 1-click SDR approval (Human-in-the-loop).",
    function:
      "Routes drafted messages into a private channel for quick 1-click SDR approval (Human-in-the-loop).",
    platforms: "Slack Webhooks, ROSTR Approvals API",
    binding: "n8n-nodes-base.switch",
    stage: "logic" as const,
    icon: "Scale" as const,
  },
  {
    id: "07",
    node: "07 CRM & Sequencer",
    title: "CRM & Sequencer",
    caption:
      "Auto-upserts records, attaches research notes, and enrolls leads into multi-day cadences.",
    function:
      "Auto-upserts records, attaches research notes, and enrolls leads into multi-day cadences.",
    platforms: "HubSpot Sales, Outreach, Smartlead",
    binding: "n8n-nodes-base.smartlead",
    stage: "sequence" as const,
    icon: "Send" as const,
  },
] as const;

export const ROSTR_RUNTIME_MODULES = [
  {
    module: "api/rostr/validator.js",
    path: "api/rostr/validator.js",
    purpose:
      "Validates the manifest version, required strings, tool list, and escalation policies.",
    responsibility:
      "Validates the manifest version, required strings, tool list, and escalation policies.",
  },
  {
    module: "api/rostr/registry.js",
    path: "api/rostr/registry.js",
    purpose:
      "Dynamically discovers and loads agent definitions, skill files, and tool schemas.",
    responsibility:
      "Dynamically discovers and loads agent definitions, skill files, and tool schemas.",
  },
  {
    module: "api/rostr/entitlements.js",
    path: "api/rostr/entitlements.js",
    purpose:
      "Enforces access control based on user purchases, subscriptions, or master bundle licenses.",
    responsibility:
      "Enforces access control based on user purchases, subscriptions, or master bundle licenses.",
  },
  {
    module: "api/rostr/runtime.js",
    path: "api/rostr/runtime.js",
    purpose:
      "Orchestrates dynamic skill injection, PAL prompt compilation, and human-in-the-loop approval blocks.",
    responsibility:
      "Orchestrates dynamic skill injection, PAL prompt compilation, and human-in-the-loop approval blocks.",
  },
  {
    module: "scripts/package-rostr-agents.js",
    path: "scripts/package-rostr-agents.js",
    purpose:
      "Deterministically compiles each agent folder into a standalone .zip archive with README.md, LICENSE.txt, and data/rostr-manifest-ledger.json.",
    responsibility:
      "Deterministically compiles each agent folder into a standalone .zip archive with README.md, LICENSE.txt, and data/rostr-manifest-ledger.json.",
  },
] as const;

export const C4_SYSTEM_CONTEXT_LINKS = [
  {
    link: "Operator to SalesGency Platform",
    protocol: "HTTPS",
    flows: "Purchases agents, configures active skills, signs off on staged leads",
  },
  {
    link: "Platform to Customer n8n Instance",
    protocol: "REST API (X-N8N-API-KEY) & MCP Trigger",
    flows:
      "Deploys 7-node workflows, exposes @n8n/n8n-nodes-langchain.mcpTrigger, and ingests read-only execution telemetry",
  },
  {
    link: "Platform to Composio OAuth Hub",
    protocol: "Composio SDK / OAuth 2.0",
    flows:
      "1-click OAuth connections for HubSpot, Salesforce, Twenty, Apollo, Slack, Gmail, and LinkedIn",
  },
  {
    link: "Platform to LLM Inference Providers",
    protocol: "Vercel AI SDK / Streaming",
    flows: "Sends compiled PAL prompts, receives tool calls and PAS copy",
  },
  {
    link: "Platform to Outreach Sequencer",
    protocol: "REST API",
    flows: "Enrolls approved prospects with custom Framework A or Framework B copy",
  },
  {
    link: "Platform to Slack Workspace",
    protocol: "Webhooks",
    flows: "Dispatches high-urgency lead cards and 1-click approval requests",
  },
] as const;
