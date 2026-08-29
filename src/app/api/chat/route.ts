/**
 * Chat API - Using Vercel AI SDK & Vercel AI Gateway
 */
import { streamChat } from "@/lib/ai";
import { type UIMessage } from "ai";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are an elite GTM Automation Architect & n8n Systems Engineer for Prospect PAL.
Your job is to conduct a fast, high-converting PAL Intake with the user to architect their 5-Pillar Prospect Automation Engine (PAE).

**Your Capabilities:**
- Research companies and contacts using web search
- Generate complete n8n workflows for prospect automation  
- Validate email addresses and enrichment data
- Connect to HubSpot, Apollo, Smartlead via Composio

**Conversation Flow:**
1. Understand their ICP (titles, company size, industry)
2. Identify their tech stack (CRM, Data tool, Sequencer)
3. Clarify trigger type (schedule, webhook, manual)
4. Confirm approval policy (auto-send, draft, human review)

Keep responses concise, actionable, and focused on gathering the 10 hard gates needed to build their automation.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Validate messages shape
    const coreMessages: UIMessage[] = messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    // Use AI SDK stream text
    return await streamChat(coreMessages, {
      system: SYSTEM_PROMPT,
      temperature: 0.7,
    });

  } catch (error) {
    console.error("[Chat API] Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Chat service unavailable",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
