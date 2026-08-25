import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { askDDG } from "@/lib/duckduckgo";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (process.env.OPENAI_API_KEY) {
      try {
        const result = streamText({
          model: openai("gpt-4o-mini"),
          system: `You are an elite GTM Automation Architect & n8n Systems Engineer for Prospect PAL.
Your job is to conduct a fast, high-converting PAL Intake with the user to architect their 5-Pillar Prospect Automation Engine (PAE).
Gather target ICP, tech stack (CRM, Data Enrichment, Sequencer, Trigger), and value prop.`,
          messages,
        });
        return result.toTextStreamResponse();
      } catch (err) {
        console.warn("OpenAI chat failed, using fallback:", err);
      }
    }

    // Fallback via DuckDuckGo AI
    const lastUserMessage = messages[messages.length - 1]?.content || "Hi";
    const systemPrompt = "You are an elite GTM Automation Architect for Prospect PAL. Help the user define their outbound prospecting workflow (ICP, CRM, Apollo/Clay, Smartlead, Trigger). Keep responses concise and under 3 sentences.";
    
    let reply = "";
    try {
      reply = await askDDG(lastUserMessage, systemPrompt);
    } catch {
      reply = "Got it! Tell me more about your target ICP titles (e.g. VP of Sales) and your preferred CRM (HubSpot or Salesforce) so I can configure your 5-pillar n8n engine.";
    }

    return new Response(reply, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    return new Response("I received your input. When ready, click 'Compile GTM Engine'.", { status: 200 });
  }
}
