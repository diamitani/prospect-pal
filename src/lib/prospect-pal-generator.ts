/**
 * Backend Prospect PAL Generator
 * 
 * Takes user intake (ICP, offer, personas, buying signals), uploaded documents (playbooks,
 * messaging guides, transcripts), and section-by-section tool selection, then compiles:
 * 1. Customized ICP & Campaign Strategy Dossier
 * 2. 3-Sentence Problem-Agitate-Solution (PAS) Email Sequence
 * 3. Production 9-Node n8n Workflow JSON
 * 4. Autonomous Agent Routine / SKILL.md package
 */

export interface GeneratorIntake {
  companyName: string;
  website?: string;
  offer: string;
  icp: string;
  personas: string;
  triggers: string;
  pastedBrief?: string;
  docs?: {
    name: string;
    content: string;
    type?: string;
  }[];
}

export interface SectionToolSelection {
  trigger: "cron" | "webhook" | "csv" | "apollo_search";
  crm: "twenty" | "hubspot" | "salesforce" | "pipedrive" | "attio";
  dataTool: "apollo" | "clay" | "prospeo" | "dropcontact" | "zoominfo";
  aiEngine: "claude" | "gpt4" | "gemini" | "bedrock";
  sequencer: "smartlead" | "instantly" | "hubspot_seq" | "lemlist";
  alertChannel: "slack" | "discord" | "email" | "auto";
  /**
   * "auto" is accepted for backwards compatibility but is ALWAYS coerced to
   * human approval — generated routines are draft-only (see enforceDraftOnly).
   */
  approvalPolicy: "auto" | "approval" | "draft";
}

export type EnforcedApprovalPolicy = "approval" | "draft";

export const ROUTINE_GUARDRAILS = {
  draftOnly: true,
  humanApprovalRequired: true,
  autoSend: false,
  autoEnroll: false,
} as const;

/**
 * Guardrail: generated routines never auto-send or auto-enroll. Any "auto"
 * (or unknown) policy becomes human approval; "draft" stays draft-only.
 */
export function enforceDraftOnlyPolicy(policy: unknown): EnforcedApprovalPolicy {
  return policy === "draft" ? "draft" : "approval";
}

export interface GeneratedRoutineResult {
  campaignId: string;
  createdAt: string;
  strategyDossier: {
    summary: string;
    icpTarget: string;
    decisionMakers: string[];
    buyingTriggers: string[];
    messagingAngles: string[];
    shieldRules: string[];
  };
  pasCopy: {
    subjectVariants: string[];
    emailBody: {
      hook: string;
      agitate: string;
      solution: string;
      fullText: string;
    };
    followUp: {
      day: number;
      body: string;
    };
  };
  n8nWorkflowJson: Record<string, unknown>;
  agentSkillMd: string;
  routineInstructions: string;
}

// ── Default Fallback Presets ──
export const DEFAULT_TOOL_SELECTION: SectionToolSelection = {
  trigger: "cron",
  crm: "twenty",
  dataTool: "apollo",
  aiEngine: "claude",
  sequencer: "smartlead",
  alertChannel: "slack",
  approvalPolicy: "approval",
};

export const DEFAULT_INTAKE: GeneratorIntake = {
  companyName: "Acme Cloud",
  offer: "Automated Kubernetes cost optimization reducing AWS bills by 35%",
  icp: "Series A-C B2B SaaS companies with 50-500 employees running AWS EKS",
  personas: "VP of Engineering, Head of Infrastructure, DevOps Lead",
  triggers: "Expanding multi-region Kubernetes clusters, hiring DevOps engineers",
};

/**
 * Generate complete Prospect PAL package
 */
export async function generateProspectPalRoutine(
  intake: Partial<GeneratorIntake>,
  tools: Partial<SectionToolSelection>
): Promise<GeneratedRoutineResult> {
  const mergedIntake: GeneratorIntake = {
    ...DEFAULT_INTAKE,
    ...intake,
  };

  const requestedPolicy = tools.approvalPolicy ?? DEFAULT_TOOL_SELECTION.approvalPolicy;
  const mergedTools: Omit<SectionToolSelection, "approvalPolicy"> & {
    approvalPolicy: EnforcedApprovalPolicy;
  } = {
    ...DEFAULT_TOOL_SELECTION,
    ...tools,
    approvalPolicy: enforceDraftOnlyPolicy(requestedPolicy),
  };
  const policyOverridden = requestedPolicy === "auto";

  const campaignId = `pal_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  // Combine uploaded docs context if present
  let docContext = "";
  if (mergedIntake.docs && mergedIntake.docs.length > 0) {
    docContext = mergedIntake.docs
      .map((d) => `--- DOCUMENT: ${d.name} ---\n${d.content.slice(0, 3000)}`)
      .join("\n\n");
  }

  // Synthesize PAS Copy
  const company = mergedIntake.companyName;
  const DRAFT_NODE = "08 Draft Queue (Human Approval Required)";
  const offer = mergedIntake.offer;
  const primaryPersona = mergedIntake.personas.split(",")[0].trim() || "Engineering Leader";
  const primaryTrigger = mergedIntake.triggers.split(",")[0].trim() || "Scaling infrastructure";

  const hook = `Saw ${company} is prioritizing ${primaryTrigger.toLowerCase()} this quarter.`;
  const agitate = `Most ${primaryPersona}s we talk with waste 15+ hours weekly wrestling with unoptimized tooling drift and broken data syncs.`;
  const solution = `We built ${offer.toLowerCase()} so your team can move faster with zero manual overhead. Open to a 2-minute benchmark?`;

  const fullText = `Hi {{first_name}},\n\n${hook} ${agitate} ${solution}\n\nBest,\n{{sender_name}}`;

  // Build n8n 9-Node Workflow Structure with selected tools
  const workflowNodes = [
    {
      parameters: {
        rule: {
          interval: [{ field: "hours", hoursInterval: 24 }],
        },
      },
      name: "01 Intake & Cron Trigger",
      type: mergedTools.trigger === "webhook" ? "n8n-nodes-base.webhook" : "n8n-nodes-base.cron",
      typeVersion: 1,
      position: [250, 300],
      notes: `Trigger mechanism: ${mergedTools.trigger.toUpperCase()}`,
    },
    {
      parameters: {
        keepOnlySet: false,
        values: {
          string: [
            { name: "normalized_domain", value: "={{ $json.domain.toLowerCase().trim() }}" },
            { name: "clean_title", value: "={{ $json.title.trim() }}" },
          ],
        },
      },
      name: "02 Data Normalizer",
      type: "n8n-nodes-base.set",
      typeVersion: 2,
      position: [480, 300],
      notes: "Sanitizes messy schemas & extracts domains",
    },
    {
      parameters: {
        operation: "get",
        resource: "company",
        domain: "={{ $json.normalized_domain }}",
      },
      name: `03 CRM Dedupe Shield (${mergedTools.crm.toUpperCase()})`,
      type: `n8n-nodes-base.${mergedTools.crm === "twenty" ? "httpRequest" : mergedTools.crm}`,
      typeVersion: 1,
      position: [710, 300],
      notes: `Queries ${mergedTools.crm} to drop active opportunities & opt-outs`,
    },
    {
      parameters: {
        resource: "contact",
        operation: "enrich",
        email: "={{ $json.email }}",
      },
      name: `04 Waterfall Contact Reveal (${mergedTools.dataTool.toUpperCase()})`,
      type: `n8n-nodes-base.${mergedTools.dataTool === "apollo" ? "apollo" : "httpRequest"}`,
      typeVersion: 1,
      position: [940, 300],
      notes: `Cascades enrichment through ${mergedTools.dataTool} with SMTP verification`,
    },
    {
      parameters: {
        model: mergedTools.aiEngine === "claude" ? "claude-3-5-sonnet" : "gpt-4o",
        prompt: `Analyze 10-K, open job postings, and tech stack for company {{ $json.normalized_domain }}. Extract pain points for ${primaryPersona}.`,
      },
      name: "05 Deep Account PAS Research",
      type: "n8n-nodes-base.openAi",
      typeVersion: 1,
      position: [1170, 300],
      notes: "Scrapes telemetry & maps pain points",
    },
    {
      parameters: {
        model: mergedTools.aiEngine === "claude" ? "claude-3-5-sonnet" : "gpt-4o",
        prompt: `Generate a 3-sentence Problem-Agitate-Solution email tailored to: Hook=${hook}, Offer=${offer}`,
      },
      name: "06 PAS AI Copywriter",
      type: "n8n-nodes-base.openAi",
      typeVersion: 1,
      position: [1400, 300],
      notes: "Zero generic slop · 3-sentence email draft",
    },
    {
      parameters: {
        operation: "upsert",
        resource: "contact",
      },
      name: `07 CRM Contact Upsert (${mergedTools.crm.toUpperCase()})`,
      type: `n8n-nodes-base.${mergedTools.crm === "twenty" ? "httpRequest" : mergedTools.crm}`,
      typeVersion: 1,
      position: [1630, 300],
      notes: `Writes enriched lead & copy to ${mergedTools.crm}`,
    },
    {
      parameters: {
        method: "POST",
        url: "={{ $env.PROSPECT_PAL_URL }}/api/sdr/dispatch",
        body: "={{ { leadId: $json.lead_id, emailSubject: $json.subject, emailBody: $json.body } }}",
        draftOnly: true,
      },
      name: DRAFT_NODE,
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 1,
      position: [1860, 300],
      notes: `Queues a DRAFT in Prospect Pal (POST /api/sdr/dispatch → draft_queued). Never sends or enrolls. ${mergedTools.sequencer} enrollment happens only after a human approves.`,
    },
    {
      parameters: {
        channel: "#outbound-telemetry",
        text: "={{ 'Draft queued for human approval: ' + $json.email + ' | Status: ' + $json.status }}",
      },
      name: `09 Review & Error Triage (${mergedTools.alertChannel.toUpperCase()})`,
      type: `n8n-nodes-base.${mergedTools.alertChannel === "discord" ? "discord" : "slack"}`,
      typeVersion: 1,
      position: [2090, 300],
      notes: `Notifies reviewers that drafts await approval & triggers self-healing on failure`,
    },
  ];

  const workflowConnections = {
    "01 Intake & Cron Trigger": { main: [[{ node: "02 Data Normalizer", type: "main", index: 0 }]] },
    "02 Data Normalizer": { main: [[{ node: `03 CRM Dedupe Shield (${mergedTools.crm.toUpperCase()})`, type: "main", index: 0 }]] },
    [`03 CRM Dedupe Shield (${mergedTools.crm.toUpperCase()})`]: { main: [[{ node: `04 Waterfall Contact Reveal (${mergedTools.dataTool.toUpperCase()})`, type: "main", index: 0 }]] },
    [`04 Waterfall Contact Reveal (${mergedTools.dataTool.toUpperCase()})`]: { main: [[{ node: "05 Deep Account PAS Research", type: "main", index: 0 }]] },
    "05 Deep Account PAS Research": { main: [[{ node: "06 PAS AI Copywriter", type: "main", index: 0 }]] },
    "06 PAS AI Copywriter": { main: [[{ node: `07 CRM Contact Upsert (${mergedTools.crm.toUpperCase()})`, type: "main", index: 0 }]] },
    [`07 CRM Contact Upsert (${mergedTools.crm.toUpperCase()})`]: { main: [[{ node: DRAFT_NODE, type: "main", index: 0 }]] },
    [DRAFT_NODE]: { main: [[{ node: `09 Review & Error Triage (${mergedTools.alertChannel.toUpperCase()})`, type: "main", index: 0 }]] },
  };

  const n8nWorkflowJson = {
    name: `Prospect PAL — ${company} Outbound Pipeline`,
    nodes: workflowNodes,
    connections: workflowConnections,
    active: false,
    settings: {
      executionOrder: "v1",
      saveManualExecutions: true,
      saveExecutionProgress: true,
    },
    meta: {
      guardrails: ROUTINE_GUARDRAILS,
      approvalPolicy: mergedTools.approvalPolicy,
      generator: "Prospect PAL v2.4",
      campaignId,
      createdAt: now,
    },
  };

  // Generate Agent SKILL.md
  const agentSkillMd = `# Prospect PAL Agent: ${company} Autonomous Outbound Routine
**Campaign ID:** \`${campaignId}\`  
**Generated:** \`${now}\`  
**Governing Standard:** Site Empire OS · 5-Pillar Architecture  

## Campaign Intelligence
- **Company:** ${company}
- **Core Offer:** ${offer}
- **Target ICP:** ${mergedIntake.icp}
- **Primary Personas:** ${mergedIntake.personas}
- **Buying Signals / Triggers:** ${mergedIntake.triggers}

## Selected Tool Stack
- **Trigger:** \`${mergedTools.trigger}\`
- **CRM Shield:** \`${mergedTools.crm}\` (Zero Collision Guarantee)
- **Data Reveal:** \`${mergedTools.dataTool}\`
- **AI Engine:** \`${mergedTools.aiEngine}\`
- **Outreach Sequencer:** \`${mergedTools.sequencer}\`
- **Alert Channel:** \`${mergedTools.alertChannel}\`
- **Approval Policy:** \`${mergedTools.approvalPolicy}\` (draft-only, never auto-send or auto-enroll${policyOverridden ? "; requested auto was overridden to human approval" : ""})

## 3-Sentence PAS Messaging Directive
\`\`\`
Hook: ${hook}
Agitate: ${agitate}
Solution: ${solution}
\`\`\`

## Safety & Governance
1. **Never pitch existing active accounts:** Verify against ${mergedTools.crm} before contact reveal.
2. **Never send generic AI clichés:** Respect the 3-sentence PAS rule.
3. **Domain reputation shield:** Maintain deliverability > 94% with SMTP verification.
4. **Draft-only:** Never auto-send and never auto-enroll. Every message is queued as a draft and requires explicit human approval before any sequencer enrollment.
5. **Suppression list:** Skip any email or domain on the Prospect Pal suppression list and any lead already found in a prior run.
${docContext ? `\n## Ingested Playbook & Collateral\n${docContext.slice(0, 1500)}...` : ""}
`;

  const routineInstructions = `Prospect PAL Routine for ${company}:
1. Run Node 01 daily at 09:00 AM to fetch new candidates matching ICP: "${mergedIntake.icp}".
2. Check ${mergedTools.crm} for deal collisions. Drop matches immediately.
3. Run waterfall reveal via ${mergedTools.dataTool}. Validate SMTP handshake.
4. Synthesize PAS email using ${mergedTools.aiEngine}.
5. ${mergedTools.approvalPolicy === "draft" ? "Queue as draft only in Prospect Pal. Never send or enroll." : "Queue draft in Prospect Pal and notify " + mergedTools.alertChannel + " for human approval. Enroll into " + mergedTools.sequencer + " only after a human approves."}
6. Monitor run telemetry; alert if error rate exceeds 1%.`;

  return {
    campaignId,
    createdAt: now,
    strategyDossier: {
      summary: `Autonomous GTM engine targeting ${mergedIntake.personas} at ${mergedIntake.icp}.`,
      icpTarget: mergedIntake.icp,
      decisionMakers: mergedIntake.personas.split(",").map((p) => p.trim()),
      buyingTriggers: mergedIntake.triggers.split(",").map((t) => t.trim()),
      messagingAngles: [
        `Operational efficiency and cost reduction via ${offer}`,
        `Eliminating manual drudgery for ${primaryPersona}`,
        `Addressing ${primaryTrigger} before it bottlenecks growth`,
      ],
      shieldRules: [
        `Exclude accounts with active deals in ${mergedTools.crm}`,
        `Exclude contacts contacted within past 90 days`,
        `Drop invalid MX or non-deliverable SMTP responses`,
      ],
    },
    pasCopy: {
      subjectVariants: [
        `Quick question re: ${primaryPersona} at {{company}}`,
        `${company} & {{company}} · ${primaryTrigger.toLowerCase()}`,
        `Question about {{company}}'s ${primaryTrigger.split(" ")[0].toLowerCase()} roadmap`,
      ],
      emailBody: {
        hook,
        agitate,
        solution,
        fullText,
      },
      followUp: {
        day: 3,
        body: `Hi {{first_name}},\n\nWanted to float this to the top of your inbox in case ${primaryTrigger.toLowerCase()} is on your roadmap this quarter. Would a 1-page breakdown of how we achieved this for similar teams be helpful?\n\nBest,\n{{sender_name}}`,
      },
    },
    n8nWorkflowJson,
    agentSkillMd,
    routineInstructions,
  };
}

