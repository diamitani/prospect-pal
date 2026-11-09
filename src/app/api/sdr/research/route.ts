import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Research synthesis for a lead. Never invents signals or emails.
 * Without OPENAI_API_KEY, returns honest unknowns + draft template placeholders.
 */
export async function POST(req: NextRequest) {
  try {
    const { lead } = await req.json();

    if (!lead || !lead.company) {
      return NextResponse.json(
        { error: "Lead company required" },
        { status: 400 }
      );
    }

    const firstName = (lead.name || lead.contact_name || "there")
      .toString()
      .split(" ")[0];
    const company = lead.company;
    const title = lead.title || null;

    if (process.env.OPENAI_API_KEY) {
      try {
        const { object } = await generateObject({
          model: openai("gpt-4o"),
          system: `You help Salesgency SDRs draft research notes.
Rules:
- Never invent specific funding rounds, hiring counts, or tech stack facts.
- If evidence is missing, set fields to null and list blockers.
- PAS email must be labeled as a DRAFT hypothesis, not observed fact.
- Do not claim verification.`,
          prompt: `Lead:
- Name: ${lead.name || lead.contact_name || "unknown"}
- Title: ${title || "unknown"}
- Company: ${company}
- Domain: ${lead.domain || "unknown"}
- Known signal: ${lead.signal || "none"}
- Source URLs: ${JSON.stringify(lead.source_urls || [])}`,
          schema: z.object({
            timelyTrigger: z
              .string()
              .nullable()
              .describe("Only from provided signal/sources; else null"),
            painHypothesis: z
              .string()
              .describe("Labeled hypothesis, not observed fact"),
            techStack: z.array(z.string()).default([]),
            emailSubject: z.string(),
            emailBody: z.string(),
            blockers: z.array(z.string()).default([]),
          }),
        });
        return NextResponse.json({ success: true, research: object });
      } catch (llmErr) {
        console.warn("[SDR Research LLM error]:", llmErr);
      }
    }

    const synthesis = {
      timelyTrigger: lead.signal || null,
      painHypothesis: `Hypothesis only (unverified): ${company} may have outbound research / CRM hygiene bottlenecks. Not observed evidence.`,
      techStack: Array.isArray(lead.tech_stack) ? lead.tech_stack : [],
      emailSubject: `Draft: ${company} outbound`,
      emailBody: `Hi ${firstName},

[DRAFT — not sent] Sharing a hypothesis about outbound research load at ${company}${title ? ` for ${title}s` : ""}. Happy to refine once we have sourced evidence.

— Prospect Pal by Salesgency`,
      blockers: [
        ...(lead.signal ? [] : ["no_observed_signal"]),
        ...(process.env.OPENAI_API_KEY ? [] : ["openai_key_missing"]),
        "draft_only_never_sent",
      ],
    };

    return NextResponse.json({ success: true, research: synthesis });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to synthesize research",
      },
      { status: 500 }
    );
  }
}
