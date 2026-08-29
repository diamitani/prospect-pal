/**
 * POST /api/assistant
 * n8n Engineer assistant using BYOK AI Gateway
 * Supports: Bedrock (primary), OpenAI, Anthropic, DuckDuckGo
 */
import { streamChat, type UIMessage } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are the **Prospect Automation Engineer** for Prospect PAL.

## CAPABILITIES
- Build n8n workflows for prospect automation (9-node pipeline)
- Research companies and contacts
- Connect to HubSpot, Apollo, Smartlead
- Validate data and configurations

## HARD GATES (must collect before compile)
1. Company background
2. Product / offer / proof  
3. ICP (Ideal Customer Profile)
4. Persona (job titles, departments)
5. Data tool (Apollo, Clay, ZoomInfo)
6. CRM (HubSpot, Salesforce, Pipedrive)
7. Sequencer (Smartlead, Instantly)
8. LLM provider (Anthropic, OpenAI, Bedrock)
9. Trigger type (schedule or webhook)
10. Approval policy (auto-send, human review, or draft-only)

## CREDENTIAL SAFETY
NEVER include API keys in responses. Always use placeholders like {{HUBSPOT_CREDENTIAL}} or {{APOLLO_API_KEY}}.

Ready to help build prospect automation workflows!`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const coreMessages: UIMessage[] = messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    // Use AI Gateway - will use Bedrock if available
    return streamChat(coreMessages, {
      system: SYSTEM_PROMPT,
      temperature: 0.7,
    });

  } catch (err) {
    console.error("[Assistant] Error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to process request", message: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  const { DEFAULT_MODELS } = await import("@/lib/ai");
  
  return Response.json({
    status: "ok",
    endpoint: "/api/assistant",
    providers: {
      available: ["bedrock", "openai", "anthropic"],
      active: "openai",
    },
    tools: ["webSearch", "generateN8nWorkflow", "composio", "researchCompany", "validateEmail"],
  });
}
