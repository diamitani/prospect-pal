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
  approvalPolicy: "auto" | "approval" | "draft";
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

  const mergedTools: SectionToolSelection = {
    ...DEFAULT_TOOL_SELECTION,
    ...tools,
  };

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
        campaignId: "prospect_pal_campaign",
        email: "={{ $json.email }}",
      },
      name: `08 Sequence Enrollment (${mergedTools.sequencer.toUpperCase()})`,
      type: `n8n-nodes-base.${mergedTools.sequencer === "smartlead" ? "smartlead" : "httpRequest"}`,
      typeVersion: 1,
      position: [1860, 300],
      notes: `Enrolls prospect into ${mergedTools.sequencer} with warm-up safety`,
    },
    {
      parameters: {
        channel: "#outbound-telemetry",
        text: "={{ 'Prospect enrolled: ' + $json.email + ' | Status: ' + $json.status }}",
      },
      name: `09 Review & Error Triage (${mergedTools.alertChannel.toUpperCase()})`,
      type: `n8n-nodes-base.${mergedTools.alertChannel === "discord" ? "discord" : "slack"}`,
      typeVersion: 1,
      position: [2090, 300],
      notes: `Alerts on enrollment & triggers self-healing on failure`,
    },
  ];

  const workflowConnections = {
    "01 Intake & Cron Trigger": { main: [[{ node: "02 Data Normalizer", type: "main", index: 0 }]] },
    "02 Data Normalizer": { main: [[{ node: `03 CRM Dedupe Shield (${mergedTools.crm.toUpperCase()})`, type: "main", index: 0 }]] },
    [`03 CRM Dedupe Shield (${mergedTools.crm.toUpperCase()})`]: { main: [[{ node: `04 Waterfall Contact Reveal (${mergedTools.dataTool.toUpperCase()})`, type: "main", index: 0 }]] },
    [`04 Waterfall Contact Reveal (${mergedTools.dataTool.toUpperCase()})`]: { main: [[{ node: "05 Deep Account PAS Research", type: "main", index: 0 }]] },
    "05 Deep Account PAS Research": { main: [[{ node: "06 PAS AI Copywriter", type: "main", index: 0 }]] },
    "06 PAS AI Copywriter": { main: [[{ node: `07 CRM Contact Upsert (${mergedTools.crm.toUpperCase()})`, type: "main", index: 0 }]] },
    [`07 CRM Contact Upsert (${mergedTools.crm.toUpperCase()})`]: { main: [[{ node: `08 Sequence Enrollment (${mergedTools.sequencer.toUpperCase()})`, type: "main", index: 0 }]] },
    [`08 Sequence Enrollment (${mergedTools.sequencer.toUpperCase()})`]: { main: [[{ node: `09 Review & Error Triage (${mergedTools.alertChannel.toUpperCase()})`, type: "main", index: 0 }]] },
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
- **Approval Policy:** \`${mergedTools.approvalPolicy}\`

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
${docContext ? `\n## Ingested Playbook & Collateral\n${docContext.slice(0, 1500)}...` : ""}
`;

  const routineInstructions = `Prospect PAL Routine for ${company}:
1. Run Node 01 daily at 09:00 AM to fetch new candidates matching ICP: "${mergedIntake.icp}".
2. Check ${mergedTools.crm} for deal collisions. Drop matches immediately.
3. Run waterfall reveal via ${mergedTools.dataTool}. Validate SMTP handshake.
4. Synthesize PAS email using ${mergedTools.aiEngine}.
5. ${mergedTools.approvalPolicy === "approval" ? "Send draft to " + mergedTools.alertChannel + " for 1-click human approval." : "Auto-enroll directly into " + mergedTools.sequencer + "."}
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

