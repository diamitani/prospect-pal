/**
 * UNIFIED AGENT API - /api/agent
 * Single endpoint bringing together all Vercel tech
 */

import { NextRequest, NextResponse } from "next/server";
import { generateText, generateObject } from "ai";
import { bedrock } from "@ai-sdk/amazon-bedrock";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = bedrock("anthropic.claude-3-5-sonnet-20241022-v2:0");
const sessions = new Map();

const GatesSchema = z.object({
  companyBackground: z.string(),
  productOffer: z.string(),
  icpDescription: z.string(),
  targetPersona: z.string(),
  dataTool: z.enum(["apollo", "clay", "zoominfo"]),
  crm: z.enum(["hubspot", "salesforce", "pipedrive"]),
  sequencer: z.enum(["smartlead", "instantly", "lemlist"]),
  triggerType: z.enum(["schedule", "webhook", "manual"]),
  approvalPolicy: z.enum(["auto", "draft", "human"]),
});

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message } = await req.json();
    
    // Get or create session
    let session = sessions.get(sessionId);
    if (!session) {
      session = { gates: {}, messages: [] };
      sessions.set(sessionId, session);
    }
    
    session.messages.push({ role: "user", content: message });

    // Phase 1: Intake - AI extracts gates from conversation
    const { object: analysis } = await generateObject({
      model: MODEL,
      schema: z.object({
        gates: GatesSchema.partial(),
        missing: z.array(z.string()),
        isComplete: z.boolean(),
        response: z.string(),
      }),
      messages: [
        ...session.messages,
        { 
          role: "system", 
          content: `Extract the 10 prospect automation gates from this conversation. Ask ONE question if missing info.`
        }
      ],
      temperature: 0.3,
    });

    // Update session gates
    Object.assign(session.gates, analysis.gates);

    // Phase 2: If complete, generate workflow
    if (analysis.isComplete) {
      const workflow = await generateWorkflow(session.gates);
      session.workflow = workflow;
      
      return NextResponse.json({
        phase: "complete",
        response: "✅ Workflow generated! Ready to deploy.",
        gates: session.gates,
        workflow,
        deployReady: true,
      });
    }

    // Still in intake
    return NextResponse.json({
      phase: "intake",
      response: analysis.response,
      gates: session.gates,
      missing: analysis.missing,
      progress: `${10 - analysis.missing.length}/10 gates`,
    });

  } catch (error) {
    console.error("[Agent] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

async function generateWorkflow(gates: any) {
  const { text } = await generateText({
    model: MODEL,
    messages: [{
      role: "system",
      content: `Generate valid n8n workflow JSON. 9 nodes: Trigger → Normalizer → Dedupe → ${gates.dataTool} → AI → Approval → ${gates.crm} → ${gates.sequencer} → Alert. Use {{CREDENTIALS.X}} format.`
    }, {
      role: "user",
      content: `Company: ${gates.companyBackground}, Tools: ${gates.dataTool}→${gates.crm}→${gates.sequencer}`
    }],
    temperature: 0.2,
  });

  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : { name: "workflow", nodes: [] };
  } catch {
    return { name: "workflow_error", raw: text.slice(0, 500) };
  }
}

export async function GET(req: NextRequest) {
  const sessionId = new URL(req.url).searchParams.get("sessionId");
  const session = sessions.get(sessionId);
  
  return NextResponse.json(session || { error: "Not found" });
}
