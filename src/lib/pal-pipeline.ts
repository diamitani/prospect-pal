/**
 * PAL — Prompt Abstraction Layer
 * 
 * The 5-stage pipeline that transforms a plain-English ICP description
 * into a complete prospect automation engine package.
 *
 * Stage 1: EXTRACT   — Parse intent, product, ICP from user input
 * Stage 2: CATEGORIZE — Classify lead type, industry, persona, tools
 * Stage 3: ENHANCE   — Fill gaps, add context, validate completeness
 * Stage 4: INSTRUCT  — Write AI system prompt for the automation agent
 * Stage 5: COMPILE   — Generate n8n JSON + skill + deploy guide
 */

import { invokeClaude, invokeClaudeStream, BedrockMessage } from "./bedrock";

// ===========================================================================
// TYPES
// ===========================================================================

export interface PalInput {
  userDescription: string;    // Raw natural language input
  selectedTools?: ToolStack;  // Optional pre-selected tools
  existingContext?: string;   // Previous conversation context
}

export interface ToolStack {
  leadSource: "apollo" | "linkedin" | "upload_csv" | "hubspot_stage" | "manual";
  enrichment: ("clay" | "hunter" | "clearbit" | "apollo_enrich")[];
  crm: "hubspot" | "salesforce" | "attio" | "pipedrive" | "none";
  sequencer: "smartlead" | "amplemarket" | "instantly" | "lemlist" | "hubspot_seq";
  approvalGate: boolean;
  slackNotifications: boolean;
}

export interface IcpProfile {
  productDescription: string;
  valueProposition: string;
  targetIndustries: string[];
  targetTitles: string[];
  companySizeRange: string;
  geographies: string[];
  painPoints: string[];
  triggerEvents: string[];
  keyPersonaTraits: string[];
}

export interface PalOutput {
  icpProfile: IcpProfile;
  toolStack: ToolStack;
  systemInstructions: string;   // The AI agent system prompt
  n8nWorkflowJson: string;      // Ready-to-import n8n JSON
  skillDefinition: string;      // .skill.md content
  deployGuide: string;          // Step-by-step setup instructions
  buildPrompts: string;         // Prompts for regenerating/adjusting
  emailFramework: string;       // PAS email template
  palStages: PalStageResult[];
}

export interface PalStageResult {
  stage: number;
  name: string;
  description: string;
  output: string;
  duration: number;
}

// ===========================================================================
// SYSTEM PROMPTS FOR EACH PAL STAGE
// ===========================================================================

const STAGE_PROMPTS = {
  EXTRACT: `You are the PAL Intent Extractor for Prospect PAL, a B2B outbound automation platform.

Your job: Parse the user's natural language input and extract structured data.

Extract:
1. What they SELL (product/service)
2. Who they SELL TO (ICP characteristics)
3. The core VALUE PROPOSITION (why buyers choose them)
4. Any TOOL PREFERENCES mentioned
5. Any PAIN POINTS they solve for customers

Respond in JSON only (no markdown, no explanation):
{
  "product": "...",
  "valueProposition": "...",
  "icpSignals": {
    "industries": [],
    "titles": [],
    "companySize": "...",
    "geographies": []
  },
  "toolHints": [],
  "painPointsSolved": [],
  "confidence": 0.0-1.0,
  "missingInfo": []
}`,

  CATEGORIZE: `You are the PAL Categorizer for Prospect PAL.

Given extracted ICP signals, your job is to:
1. Confirm and expand the target industry list with standard SIC/NAICS codes
2. Expand titles to include synonyms and seniority variations
3. Categorize the deal complexity (transactional / mid-market / enterprise)
4. Select the optimal tool stack based on budget signals and company size
5. Identify the best lead discovery method

Respond in JSON only:
{
  "industries": [{"name": "...", "naics": "..."}],
  "targetTitles": [],
  "seniority": "C-suite | VP | Director | Manager",
  "dealType": "transactional | mid-market | enterprise",
  "recommendedTools": {
    "leadSource": "...",
    "enrichment": [],
    "crm": "...",
    "sequencer": "..."
  },
  "estimatedVolume": "...",
  "category": "SaaS | Agency | Professional Services | VC/PE | Other"
}`,

  ENHANCE: `You are the PAL Context Enhancer for Prospect PAL.

Given the extracted ICP and categorization, your job is to:
1. Generate 5 specific pain points this ICP experiences (with evidence rationale)
2. Identify 5 trigger events that signal buying intent (hiring, funding, etc.)
3. Write 3 key persona traits that define the ideal contact
4. Suggest 3 personalization angles for cold outreach
5. Define data enrichment requirements

Be specific, not generic. Use industry knowledge.

Respond in JSON only:
{
  "painPoints": [],
  "triggerEvents": [],
  "personaTraits": [],
  "personalizationAngles": [],
  "enrichmentFields": [],
  "researchDataSources": [],
  "icpScore": {
    "clarity": 0-10,
    "specificity": 0-10,
    "reachability": 0-10
  }
}`,

  INSTRUCT: `You are the PAL System Instruction Writer for Prospect PAL.

Your job: Write the complete AI agent system prompt that will drive the prospect automation engine.

This system prompt will be used by Claude 3.5 Sonnet inside n8n to:
- Research each prospect
- Identify their specific pain points
- Write a personalized cold email using PAS framework

The system prompt should be:
- Specific to this exact product/ICP
- Include the value proposition as context
- Reference the pain points to look for
- Define the email format (3 sentences max, PAS structure)
- Include guardrails (no spam words, no false claims)

Write the complete system prompt as a string. No JSON wrapper.`,

  COMPILE: `You are the PAL n8n Engineer for Prospect PAL.

Your job: Generate a complete, production-ready n8n workflow JSON.

The workflow must include these nodes (in order):
1. Schedule Trigger (daily at 7 AM)
2. HTTP Request → Apollo lead search (GET /v1/people/search)
3. HubSpot → Check if contact exists (GET /contacts)
4. Filter → Skip if exists in CRM
5. HTTP Request → Clay enrichment webhook
6. HTTP Request → Bedrock Claude research (POST to invoke model)
7. HTTP Request → Bedrock Claude email write (POST to invoke model)  
8. IF node → Approval gate (if approvalGate=true)
9. HTTP Request → Slack approval message
10. HTTP Request → Sequencer enrollment (Smartlead/Amplemarket)
11. HTTP Request → CRM sync (HubSpot create contact)

Use placeholder credential names: {{APOLLO_API_KEY}}, {{HUBSPOT_API_KEY}}, {{SMARTLEAD_API_KEY}}, {{AWS_BEARER_TOKEN}}

Return valid n8n JSON only (no markdown fence, just the raw JSON object with "nodes" and "connections" keys).`,
};

// ===========================================================================
// PAL PIPELINE EXECUTOR
// ===========================================================================

export async function runPalPipeline(input: PalInput): Promise<PalOutput> {
  const stages: PalStageResult[] = [];
  const startTime = Date.now();

  // ─── STAGE 1: EXTRACT ─────────────────────────────────────────────────────
  const s1Start = Date.now();
  const extractedRaw = await invokeClaude(
    [{ role: "user", content: input.userDescription }],
    STAGE_PROMPTS.EXTRACT,
    2048
  );
  let extracted: Record<string, unknown>;
  try { extracted = JSON.parse(extractedRaw); }
  catch { extracted = { product: "Unknown", icpSignals: {}, painPointsSolved: [] }; }

  stages.push({
    stage: 1, name: "Extract Intent",
    description: "Parsing your description to identify product, ICP, and value proposition",
    output: JSON.stringify(extracted, null, 2),
    duration: Date.now() - s1Start,
  });

  // ─── STAGE 2: CATEGORIZE ──────────────────────────────────────────────────
  const s2Start = Date.now();
  const categorizedRaw = await invokeClaude(
    [{ role: "user", content: `Extracted data:\n${JSON.stringify(extracted, null, 2)}` }],
    STAGE_PROMPTS.CATEGORIZE,
    2048
  );
  let categorized: Record<string, unknown>;
  try { categorized = JSON.parse(categorizedRaw); }
  catch { categorized = { recommendedTools: {}, targetTitles: [], industries: [] }; }

  stages.push({
    stage: 2, name: "Categorize & Classify",
    description: "Classifying ICP by industry, seniority, deal type, and optimal tool stack",
    output: JSON.stringify(categorized, null, 2),
    duration: Date.now() - s2Start,
  });

  // ─── STAGE 3: ENHANCE ─────────────────────────────────────────────────────
  const s3Start = Date.now();
  const enhancedRaw = await invokeClaude(
    [{ role: "user", content: `Product context:\n${JSON.stringify({ extracted, categorized }, null, 2)}` }],
    STAGE_PROMPTS.ENHANCE,
    3000
  );
  let enhanced: Record<string, unknown>;
  try { enhanced = JSON.parse(enhancedRaw); }
  catch { enhanced = { painPoints: [], triggerEvents: [], personaTraits: [] }; }

  stages.push({
    stage: 3, name: "Enhance Context",
    description: "Generating pain points, trigger events, personalization angles, and enrichment requirements",
    output: JSON.stringify(enhanced, null, 2),
    duration: Date.now() - s3Start,
  });

  // ─── STAGE 4: INSTRUCT ────────────────────────────────────────────────────
  const s4Start = Date.now();
  const fullContext = `
Product: ${(extracted as {product?: string}).product || "B2B SaaS"}
Value Proposition: ${(extracted as {valueProposition?: string}).valueProposition || ""}
Target Industries: ${JSON.stringify((categorized as {industries?: unknown}).industries || [])}
Target Titles: ${JSON.stringify((categorized as {targetTitles?: unknown}).targetTitles || [])}
Pain Points: ${JSON.stringify((enhanced as {painPoints?: unknown}).painPoints || [])}
Trigger Events: ${JSON.stringify((enhanced as {triggerEvents?: unknown}).triggerEvents || [])}
Personalization Angles: ${JSON.stringify((enhanced as {personalizationAngles?: unknown}).personalizationAngles || [])}
`;
  const systemInstructions = await invokeClaude(
    [{ role: "user", content: `Generate the agent system prompt for this context:\n${fullContext}` }],
    STAGE_PROMPTS.INSTRUCT,
    3000
  );

  stages.push({
    stage: 4, name: "Write System Instructions",
    description: "Creating the AI agent system prompt that powers your automation",
    output: systemInstructions,
    duration: Date.now() - s4Start,
  });

  // ─── STAGE 5: COMPILE ─────────────────────────────────────────────────────
  const s5Start = Date.now();
  const toolsContext = JSON.stringify(
    (input.selectedTools || (categorized as {recommendedTools?: unknown}).recommendedTools || {}),
    null, 2
  );

  const n8nWorkflowJson = await invokeClaude(
    [{ role: "user", content: `Generate n8n workflow JSON for:\n${fullContext}\nTool stack: ${toolsContext}` }],
    STAGE_PROMPTS.COMPILE,
    8192
  );

  stages.push({
    stage: 5, name: "Compile Engine",
    description: "Generating n8n workflow JSON, skill definition, and deployment guide",
    output: n8nWorkflowJson,
    duration: Date.now() - s5Start,
  });

  // ─── BUILD OUTPUT ARTIFACTS ───────────────────────────────────────────────
  const recs = (categorized as {recommendedTools?: {crm?: string; sequencer?: string; leadSource?: string; enrichment?: string[]}}).recommendedTools || {};
  const toolStack: ToolStack = {
    leadSource: (input.selectedTools?.leadSource || recs.leadSource || "apollo") as ToolStack["leadSource"],
    enrichment: (input.selectedTools?.enrichment || recs.enrichment || ["clay"]) as ToolStack["enrichment"],
    crm: (input.selectedTools?.crm || recs.crm || "hubspot") as ToolStack["crm"],
    sequencer: (input.selectedTools?.sequencer || recs.sequencer || "smartlead") as ToolStack["sequencer"],
    approvalGate: input.selectedTools?.approvalGate ?? true,
    slackNotifications: input.selectedTools?.slackNotifications ?? true,
  };

  const icpProfile: IcpProfile = {
    productDescription: (extracted as {product?: string}).product || "",
    valueProposition: (extracted as {valueProposition?: string}).valueProposition || "",
    targetIndustries: (categorized as {industries?: {name?: string}[]}).industries?.map((i) => i.name || "") || [],
    targetTitles: (categorized as {targetTitles?: string[]}).targetTitles || [],
    companySizeRange: (extracted as {icpSignals?: {companySize?: string}}).icpSignals?.companySize || "11-500",
    geographies: (extracted as {icpSignals?: {geographies?: string[]}}).icpSignals?.geographies || ["United States"],
    painPoints: (enhanced as {painPoints?: string[]}).painPoints || [],
    triggerEvents: (enhanced as {triggerEvents?: string[]}).triggerEvents || [],
    keyPersonaTraits: (enhanced as {personaTraits?: string[]}).personaTraits || [],
  };

  const skillDefinition = generateSkillDefinition(icpProfile, toolStack);
  const deployGuide = generateDeployGuide(toolStack, icpProfile);
  const buildPrompts = generateBuildPrompts(icpProfile);
  const emailFramework = generateEmailFramework(icpProfile);

  // Clean n8n JSON
  let cleanedJson = n8nWorkflowJson.trim();
  if (cleanedJson.startsWith("```")) {
    cleanedJson = cleanedJson.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
  }

  return {
    icpProfile,
    toolStack,
    systemInstructions,
    n8nWorkflowJson: cleanedJson,
    skillDefinition,
    deployGuide,
    buildPrompts,
    emailFramework,
    palStages: stages,
  };
}

// ===========================================================================
// ARTIFACT GENERATORS
// ===========================================================================

function generateSkillDefinition(icp: IcpProfile, tools: ToolStack): string {
  return `---
name: prospect-automation
version: 1.0.0
description: Custom prospect automation skill for ${icp.productDescription}
author: Prospect PAL
---

# Prospect Automation Skill

## ICP Profile
- **Product**: ${icp.productDescription}
- **Value Prop**: ${icp.valueProposition}
- **Target Industries**: ${icp.targetIndustries.join(", ")}
- **Target Titles**: ${icp.targetTitles.join(", ")}
- **Company Size**: ${icp.companySizeRange}
- **Geographies**: ${icp.geographies.join(", ")}

## Pain Points to Address
${icp.painPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}

## Trigger Events (Buying Signals)
${icp.triggerEvents.map((t, i) => `${i + 1}. ${t}`).join("\n")}

## Tool Stack
- **Lead Source**: ${tools.leadSource}
- **Enrichment**: ${tools.enrichment.join(", ")}
- **CRM**: ${tools.crm}
- **Sequencer**: ${tools.sequencer}
- **Approval Gate**: ${tools.approvalGate ? "Enabled (Slack review)" : "Disabled (auto-send)"}

## Workflow Steps
1. Pull leads from ${tools.leadSource}
2. Deduplicate against ${tools.crm} CRM
3. Enrich with ${tools.enrichment[0]} waterfall
4. AI research via Claude 3.5 Sonnet
5. Generate PAS email copy
6. ${tools.approvalGate ? "Route to Slack approval queue" : "Auto-enroll in sequence"}
7. Push to ${tools.sequencer} + sync ${tools.crm}
`;
}

function generateDeployGuide(tools: ToolStack, icp: IcpProfile): string {
  const creds: Record<string, string> = {
    apollo: "APOLLO_API_KEY",
    clay: "CLAY_API_KEY / CLAY_WEBHOOK_URL",
    hubspot: "HUBSPOT_API_KEY",
    salesforce: "SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET",
    smartlead: "SMARTLEAD_API_KEY",
    amplemarket: "AMPLEMARKET_API_KEY",
  };

  const requiredCreds = [
    creds[tools.leadSource] || "",
    ...tools.enrichment.map((e) => creds[e] || ""),
    creds[tools.crm] || "",
    creds[tools.sequencer] || "",
    "AWS_BEARER_TOKEN_BEDROCK",
  ].filter(Boolean);

  return `# Prospect PAL — Deployment Guide

## For: ${icp.productDescription}
Generated: ${new Date().toLocaleDateString()}

---

## Step 1: Import the n8n Workflow
1. Open your n8n instance (cloud.n8n.io or self-hosted)
2. Click **"+"** → **"Import from File"**
3. Upload the \`prospect-pal-workflow.json\` file
4. Click **"Save"**

## Step 2: Configure Credentials
Add these credentials in n8n (Settings → Credentials):

${requiredCreds.map((c) => `- [ ] **${c}**`).join("\n")}

## Step 3: Set the Schedule
The workflow runs at **7:00 AM daily** by default.
To change: Click the "Schedule Trigger" node → Edit interval.

## Step 4: Configure Lead Source (${tools.leadSource})
${tools.leadSource === "apollo"
  ? "- Set Apollo search filters: industries, titles, company size\n- Set daily lead limit (recommended: 25-50)"
  : tools.leadSource === "upload_csv"
  ? "- Place your CSV at the configured path\n- Ensure columns: name, email, company, title, domain"
  : "- Configure the integration webhook URL in the trigger node"}

## Step 5: Set Up CRM Deduplication (${tools.crm})
- Connect your ${tools.crm} account in the CRM node
- The workflow auto-skips leads already in ${tools.crm}

## Step 6: ${tools.approvalGate ? "Configure Slack Approval" : "Review Auto-Send Settings"}
${tools.approvalGate
  ? "- Connect your Slack workspace\n- Set the #approval-queue channel ID in the Slack node\n- Reviewers click ✅ or ❌ directly in Slack"
  : "- Emails send automatically after AI confidence score > 85%\n- Monitor via the n8n execution log"}

## Step 7: Test Run
1. Click **"Execute Workflow"** manually
2. Check each node's output in the execution view
3. Verify a test lead appears in your ${tools.crm} and ${tools.sequencer}

## Troubleshooting
- **Auth errors**: Re-check credentials in Step 2
- **No leads found**: Loosen Apollo filters (company size, geography)
- **Email not sending**: Check ${tools.sequencer} campaign status (must be "Active")

## Support
Questions? Start a new chat in Prospect PAL and describe the issue.
`;
}

function generateBuildPrompts(icp: IcpProfile): string {
  return `# Prospect PAL — Build & Customization Prompts

## Regenerate the Workflow
"Regenerate my n8n workflow for ${icp.productDescription} but change the lead source to LinkedIn and add Hunter.io for email verification."

## Adjust Email Framework
"Rewrite the email template using the BAB (Before-After-Bridge) framework instead of PAS. Focus on the pain point: ${icp.painPoints[0] || "manual research overhead"}."

## Add New Data Source
"Add a ZoomInfo enrichment step between the Apollo search and the Clay waterfall in my workflow."

## Change Target ICP
"Update my ICP to target ${icp.targetTitles[0] || "VPs of Sales"} at companies in the FinTech vertical with 200-500 employees."

## Customize Research Prompt
"Update the Claude research node to also check for recent job postings that signal the company is scaling their sales team."

## Add Follow-Up Sequence
"Add a 3-touch follow-up sequence (Day 3, Day 7, Day 14) to my current workflow with a different value angle each time."

## Generate Reporting
"Add a daily Slack summary node that sends me a report of: leads found, emails sent, replies received."
`;
}

function generateEmailFramework(icp: IcpProfile): string {
  const painPoint = icp.painPoints[0] || "manual prospecting overhead";
  const trigger = icp.triggerEvents[0] || "a recent hiring surge";
  return `# PAS Email Framework
## For: ${icp.productDescription}

---

### Subject Line Options
1. "{{company}}'s outbound — quick question"
2. "Saw {{trigger_event}} at {{company}}"
3. "How {{similar_company}} solved ${painPoint.toLowerCase()}"

---

### Email Body (PAS Framework)
**P — Problem (1 sentence)**
"Most ${icp.targetTitles[0] || "sales leaders"} I talk to at {{company_size}} companies tell me ${painPoint.toLowerCase()} is costing them [specific metric]."

**A — Agitate (1 sentence)**
"When I looked at {{company}}'s [public signal from ${trigger}], it seemed like you might be dealing with the same thing."

**S — Solution (1 sentence)**
"[Our product] helps ${icp.targetIndustries[0] || "companies like yours"} [achieve outcome] without [the painful alternative] — typically in under [timeframe]."

**CTA (1 sentence)**
"Worth a 15-min call this week to see if it makes sense for {{company}}?"

---

### Personalization Variables
- {{company}} — company name
- {{first_name}} — contact first name
- {{trigger_event}} — specific signal (hiring, funding, etc.)
- {{company_size}} — headcount
- {{pain_point_specific}} — AI-researched specific pain

---

### Guardrails
- ❌ No "I hope this email finds you well"
- ❌ No "We help companies like yours" (too generic)
- ❌ No attachments in first touch
- ✅ Always reference a specific, observable signal
- ✅ Keep total email under 75 words
- ✅ One CTA only
`;
}

// ===========================================================================
// STREAMING PAL CHAT (for conversational interface)
// ===========================================================================

const CHAT_SYSTEM_PROMPT = `You are the PAL (Prompt Abstraction Layer) Agent for Prospect PAL.

You help users build outbound prospect automation engines through natural conversation.

Your personality: Direct, knowledgeable, efficient. You're a RevOps expert who has set up hundreds of outbound systems.

Your workflow:
1. Understand what they sell and who they target
2. Ask clarifying questions if needed (keep it to 1-2 at a time)
3. Recommend the right tool stack
4. Walk them through the 5-step PAL pipeline
5. When ready, trigger the full pipeline generation

Key behaviors:
- Always acknowledge what you understood before asking follow-up
- If they give you enough context, proceed — don't over-question
- Reference specific tools by name (Apollo, Clay, Smartlead, etc.)
- When describing the automation, use the 6-step framework: Leads → Company → Enrich → Research → Email → Sequence
- If they ask "what will I get?", explain: n8n workflow JSON + skill definition + deploy guide + build prompts + email framework
- NEVER say "I can't help with that" — find a way to help

Special commands you recognize:
- "generate workflow" or "build it" → Trigger PAL pipeline
- "show me the steps" → Explain the 6-step pipeline
- "what tools do I need?" → Recommend tool stack based on context
- "pricing" → Explain the platform tiers`;

export async function streamPalChat(
  messages: BedrockMessage[],
  projectContext?: string
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = projectContext
    ? `${CHAT_SYSTEM_PROMPT}\n\n## Current Project Context:\n${projectContext}`
    : CHAT_SYSTEM_PROMPT;

  return invokeClaudeStream(messages, systemPrompt, 2048);
}
