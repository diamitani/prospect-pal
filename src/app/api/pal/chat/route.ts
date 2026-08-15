/**
 * POST /api/pal/chat — streaming chat (now powered by DuckDuckGo AI)
 */
import { NextRequest } from "next/server";
import { streamDDG, ddgStreamToResponse } from "@/lib/duckduckgo";
import type { DDGMessage } from "@/lib/duckduckgo";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a B2B outbound automation expert helping users build prospect automation workflows.

You help users:
1. Understand their ICP (Ideal Customer Profile)
2. Choose the right tool stack (Apollo, Clay, HubSpot, Smartlead, etc.)
3. Configure their 6-step automation: Lead Discovery → Company Data → Contact Enrichment → AI Research → Email Writing → Sequence Enrollment
4. Understand what the generated n8n workflow will do

Keep responses concise and direct. When you have enough context, suggest they click "Generate Workflow" to build their automation.

Key tools to recommend:
- Lead source: Apollo (best), LinkedIn, CSV upload
- Enrichment: Clay (best waterfall), Hunter (email), Clearbit (company data)
- CRM: HubSpot (most common), Salesforce (enterprise), Attio (modern)
- Sequencer: Smartlead (AI-powered), Amplemarket (all-in-one), Instantly (volume), Lemlist (personalization)

Always be helpful and specific. Reference real tool capabilities.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: DDGMessage[] };
    if (!messages?.length) {
      return new Response("messages required", { status: 400 });
    }

    const stream = await streamDDG(messages, SYSTEM_PROMPT, "gpt-4o-mini");
    return ddgStreamToResponse(stream);
  } catch (err) {
    console.error("Chat error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}
