import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `You are an elite GTM Automation Architect & n8n Systems Engineer for Prospect PAL.
Your job is to conduct a fast, high-converting PAL Intake with the user to architect their 5-Pillar Prospect Automation Engine (PAE).

Gather or clarify:
1. Target ICP (job titles, industry, company size, geography).
2. Tech Stack:
   - Ingestion Trigger (Spreadsheet upload, Daily CRM poller, or Webhook/intent stream)
   - CRM (HubSpot, Salesforce, etc.)
   - Data Enrichment (Apollo, Clay, ZoomInfo)
   - Sequencer (Smartlead, Instantly)
3. Value Proposition / Core Offer for cold outreach.

Be professional, concise, and guide them step-by-step. When you have enough context, let them know they can click "Compile GTM Engine" to generate the 9-node production n8n package!`,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (e) {
    return new Response("Error", { status: 500 });
  }
}
