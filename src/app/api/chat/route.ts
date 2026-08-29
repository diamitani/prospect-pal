/**
 * Chat API - Using Vercel AI SDK with DDC Runtime Integration
 * Automatically detects campaign-building intent and routes through DDC stages
 */
import { streamChat } from "@/lib/ai";
import {
  createRun,
  getMissingGates,
  teach,
  type DdcRun,
  STAGE_TEACHING,
} from "@/lib/ddc-planning-runtime";
import { saveAgentSession, loadAgentSession } from "@/lib/agent-session";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const CAMPAIGN_INTENT_PATTERNS = [
  /\b(build|create|set\s?up|configure|make|design)\b.*(campaign|workflow|automation|sequence|outbound|outreach|prospecting)/i,
  /\b(outbound|cold\s?email|prospect|lead\s?gen|sales\s?automation)/i,
  /\b(n8n|workflow|automation)\b.*(prospect|lead|sales|outreach)/i,
  /\bwant\s+(to\s+)?(automate|reach|contact|email)\b.*\b(prospect|lead|customer|company)/i,
  /\b(apollo|smartlead|instantly|lemlist|hubspot|salesforce)\b.*(integration|connect|workflow)/i,
];

function detectCampaignIntent(message: string): boolean {
  return CAMPAIGN_INTENT_PATTERNS.some((pattern) => pattern.test(message));
}

function buildDdcSystemPrompt(run: DdcRun): string {
  const missingGates = getMissingGates(run.intake);
  const teaching = teach(run);
  const progress = `Stage ${run.stage} (${Object.keys(run.artifacts).length + 1}/22)`;

  const gatesStatus =
    missingGates.length > 0
      ? `\n\n**Missing Information (${missingGates.length} gates):**\n${missingGates.map((g) => `- ${g.replace(/_/g, " ")}`).join("\n")}`
      : "\n\n**All 10 hard gates collected. Ready to proceed.**";

  const educationBlock = teaching ? `\n\n**Why this stage matters:**\n${teaching}` : "";

  return `You are PAE (Prospect Automation Engineer), an elite GTM Automation Architect for Prospect PAL.

**Current Campaign Run:** ${run.run_id}
**Progress:** ${progress}
**Status:** ${run.status}
**Next Action:** ${run.next_action}
${gatesStatus}
${educationBlock}

**Your Capabilities:**
- Research companies/industries using web search tools
- Generate complete n8n workflow JSON for prospect automation
- Modify the workflow graph visually using the \`updateWorkflowConfig\` tool if the user asks to add nodes, change CRMs, etc.
- Guide users through the 10 hard gates: company background, product/offer, ICP, persona, data tool, CRM, outreach tool, LLM provider, trigger type, approval policy

**Current Intake Data:**
${
  Object.entries(run.intake)
    .filter(([, v]) => v !== null)
    .map(([k, v]) => `- ${k.replace(/_/g, " ")}: ${v}`)
    .join("\n") || "- (none yet)"
}

**Conversation Rules:**
1. Ask ONE clear question at a time to fill missing gates
2. When you learn new info, acknowledge it and state what's still needed
3. Once all gates are filled, summarize the campaign spec and ask to proceed
4. Keep responses concise and actionable
5. Use tools when the user asks for research or workflow generation
6. CRITICAL: If the user explicitly asks to modify the workflow graph (e.g. "Add a Slack node", "Use Salesforce instead"), you MUST call the \`updateWorkflowConfig\` tool with the updated configuration fields.

${run.stage === "intake" ? "Focus on gathering the 10 hard gates before moving to design." : `Current stage: ${run.stage}. ${STAGE_TEACHING[run.stage]}`}`;
}

const BASE_SYSTEM_PROMPT = `You are PAE (Prospect Automation Engineer), an elite GTM Automation Architect & n8n Systems Engineer for Prospect PAL.

**Your Capabilities:**
- Research companies and contacts using web search
- Generate complete n8n workflows for prospect automation
- Connect to HubSpot, Apollo, Smartlead, and other sales tools

**If the user wants to build a campaign or automation:**
Start gathering the 10 hard gates needed:
1. Company background (what does your company do?)
2. Product/offer (what are you selling?)
3. ICP (ideal customer profile - size, industry, etc.)
4. Persona (job titles, seniority)
5. Data tool (Apollo, Clay, LinkedIn, etc.)
6. CRM (HubSpot, Salesforce, etc.)
7. Outreach tool (Smartlead, Instantly, etc.)
8. LLM provider (using Anthropic by default)
9. Trigger type (daily search or CSV upload)
10. Approval policy (auto-send, human review, or draft only)

Keep responses concise and actionable. Ask one clear question at a time.`;

export async function POST(req: Request) {
  try {
    const { messages, sessionId, userId = "demo-user" } = await req.json();

    // Normalize messages to ChatMessage format for processing
    const chatMessages: ChatMessage[] = messages.map((m: any) => {
      let content = "";
      if (typeof m.content === "string") {
        content = m.content;
      } else if (Array.isArray(m.content)) {
        content = m.content.map((part: any) => part.text || "").join("");
      }
      return {
        role: m.role,
        content,
      };
    });

    // Get last user message for intent detection
    const lastUserMessage = chatMessages.filter((m) => m.role === "user").pop();
    const userText = lastUserMessage?.content || "";

    // Try to load existing DDC run from session metadata
    let ddcRun: DdcRun | null = null;
    let systemPrompt = BASE_SYSTEM_PROMPT;

    if (sessionId) {
      try {
        const sessionData = await loadAgentSession(userId, sessionId);
        const metadata = (sessionData as any)?.ddcRun;
        if (metadata) {
          ddcRun = metadata as DdcRun;
        }
      } catch {
        // Session not found or no DDC run - continue without
      }
    }

    // Detect campaign intent and create DDC run if needed
    if (!ddcRun && detectCampaignIntent(userText)) {
      ddcRun = createRun({
        prompt: userText,
        education_mode: true,
        campaign_type: "outbound_cold",
      });
    }

    // If we have a DDC run, use the DDC-aware system prompt
    if (ddcRun) {
      // Extract any new intake info from the conversation
      ddcRun = extractIntakeFromMessages(ddcRun, chatMessages);
      systemPrompt = buildDdcSystemPrompt(ddcRun);

      // Persist DDC state
      if (sessionId) {
        try {
          await saveAgentSession(userId, sessionId, [
            ...chatMessages,
            { role: "system" as const, content: JSON.stringify({ ddcRun }) },
          ]);
        } catch (e) {
          console.warn("Failed to persist DDC state:", e);
        }
      }
    }

    // Use AI SDK stream text - pass original messages format
    return await streamChat(messages, {
      system: systemPrompt,
      temperature: 0.7,
    });
  } catch (error) {
    console.error("[Chat API] Error:", error);

    return new Response(
      JSON.stringify({
        error: "Chat service unavailable",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * Extract intake information from conversation messages
 * Simple keyword-based extraction for common patterns
 */
function extractIntakeFromMessages(run: DdcRun, messages: ChatMessage[]): DdcRun {
  const allText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join(" ")
    .toLowerCase();

  const updates: Partial<typeof run.intake> = {};

  // CRM detection
  if (!run.intake.crm) {
    if (/hubspot/i.test(allText)) updates.crm = "hubspot";
    else if (/salesforce/i.test(allText)) updates.crm = "salesforce";
    else if (/pipedrive/i.test(allText)) updates.crm = "pipedrive";
    else if (/attio/i.test(allText)) updates.crm = "attio";
  }

  // Data tool detection
  if (!run.intake.data_tool) {
    if (/apollo/i.test(allText)) updates.data_tool = "apollo";
    else if (/clay/i.test(allText)) updates.data_tool = "clay";
    else if (/zoominfo/i.test(allText)) updates.data_tool = "zoominfo";
    else if (/linkedin/i.test(allText)) updates.data_tool = "linkedin";
  }

  // Outreach tool detection
  if (!run.intake.outreach) {
    if (/smartlead/i.test(allText)) updates.outreach = "smartlead";
    else if (/instantly/i.test(allText)) updates.outreach = "instantly";
    else if (/lemlist/i.test(allText)) updates.outreach = "lemlist";
    else if (/amplemarket/i.test(allText)) updates.outreach = "amplemarket";
  }

  // Trigger type detection
  if (!run.intake.trigger_type) {
    if (/csv|upload|file/i.test(allText)) updates.trigger_type = "csv";
    else if (/daily|schedule|cron|automatic/i.test(allText)) updates.trigger_type = "search";
  }

  // Approval policy detection
  if (!run.intake.approval_policy) {
    if (/auto.?send|automatic|no.?review/i.test(allText)) updates.approval_policy = "auto";
    else if (/human|review|approve|manual/i.test(allText)) updates.approval_policy = "human";
    else if (/draft/i.test(allText)) updates.approval_policy = "draft";
  }

  if (Object.keys(updates).length > 0) {
    return {
      ...run,
      intake: { ...run.intake, ...updates },
    };
  }

  return run;
}
