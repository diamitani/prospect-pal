/**
 * POST /api/assistant
 * Chat endpoint using AWS Bedrock via Vercel AI SDK
 * Compatible with assistant-ui
 */
import { streamText } from "ai";
import { bedrock } from "@ai-sdk/amazon-bedrock";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are PAL, the GTM Automation Architect for Prospect PAL — a platform that helps teams automate their go-to-market outreach.

Your role is to help users:
1. Define their Ideal Customer Profile (ICP) and target personas
2. Configure their tech stack (CRM, data enrichment, sequencer)
3. Design automated prospecting workflows
4. Generate personalized outreach messaging
5. Optimize their sales development process

Be concise, actionable, and focused on delivering value. When gathering information, ask one question at a time. When providing recommendations, be specific and include examples.

Current capabilities you can help configure:
- Lead generation via Apollo, Clay, or LinkedIn
- CRM sync with HubSpot or Salesforce
- Email sequencing with Smartlead or Instantly
- AI-powered personalization and research
- Slack notifications and approval gates

Always aim to understand the user's specific use case before making recommendations.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Use Claude via Bedrock
    const result = streamText({
      model: bedrock("us.anthropic.claude-sonnet-4-6"),
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (err) {
    console.error("[assistant] Error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
