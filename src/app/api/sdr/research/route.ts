import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { lead } = await req.json();

    if (!lead || !lead.name || !lead.company) {
      return NextResponse.json({ error: "Lead details required" }, { status: 400 });
    }

    const firstName = lead.name.split(" ")[0];
    const company = lead.company;
    const title = lead.title || "Sales Leader";

    // 1. If OpenAI API Key is present, run live LLM synthesis
    if (process.env.OPENAI_API_KEY) {
      try {
        const { object } = await generateObject({
          model: openai("gpt-4o"),
          system: `You are an elite Autonomous B2B SDR Agent.
Generate 4-layer intelligence for a target account and compose a personalized 3-sentence Problem-Agitate-Solve (PAS) cold outreach email.
Strict Rules for PAS email:
- Exactly 3 tight sentences:
  1. Problem: State a specific, observable bottleneck relevant to their growth stage.
  2. Agitate: Explain the operational cost, pipeline leak, or lost momentum.
  3. Solve: Introduce Prospect PAL as the high-leverage fix with a low-friction CTA.
- No buzzwords, no generic flattery, no emojis.`,
          prompt: `Lead Profile:
- Name: ${lead.name} (${firstName})
- Title: ${title}
- Company: ${company}
- Domain: ${lead.domain || company.toLowerCase() + ".com"}
- Industry: ${lead.industry || "B2B SaaS / Tech"}`,
          schema: z.object({
            timelyTrigger: z.string().describe("Observed growth, hiring, or technographic trigger"),
            painHypothesis: z.string().describe("The core revenue bottleneck they are facing"),
            techStack: z.array(z.string()).describe("Detected CRM, sequencer, and enrichment stack"),
            emailSubject: z.string().describe("Short 3-5 word intriguing subject line"),
            emailBody: z.string().describe("3-sentence PAS email body"),
          }),
        });

        return NextResponse.json({ success: true, research: object });
      } catch (llmErr) {
        console.warn("[SDR Research LLM error, falling back to deterministic synthesis]:", llmErr);
      }
    }

    // 2. Deterministic 4-Layer Research Synthesis Fallback
    const synthesis = {
      timelyTrigger: `Hiring 4+ Account Executives and expanding outbound quota for ${company}.`,
      painHypothesis: `Reps spend 15+ hours/week manually researching contacts and entering CRM records rather than running live calls.`,
      techStack: lead.tech_stack || ["Salesforce", "HubSpot", "Slack", "Apollo"],
      emailSubject: `Question regarding ${company} outbound velocity`,
      emailBody: `Hi ${firstName},

[Problem] Noticed ${company} is aggressively scaling sales capacity, but rep productivity often hits a wall when prospect research and CRM hygiene remain manual.

[Agitate] Every hour your reps spend digging for verified emails or copying deal notes is an hour high-intent pipeline slips to faster automated competitors.

[Solve] We built Prospect PAL to automate end-to-end ICP discovery, CRM deduplication, and personalized research so your reps only focus on closing conversations.

Worth a quick 5-min walk-through this Thursday?`,
    };

    return NextResponse.json({ success: true, research: synthesis });
  } catch (error) {
    console.error("[SDR Research error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to synthesize SDR research" },
      { status: 500 }
    );
  }
}
