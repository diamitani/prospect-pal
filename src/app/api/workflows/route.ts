/**
 * Workflow SDK Routes - Delali Development Cycle (DDC) Planning Harness
 * Manage and execute PAL pipeline as progressive planning workflow
 * 
 * POST /api/workflows/execute - Start or progress a DDC workflow
 * GET /api/workflows/[id] - Get DDC workflow status
 */

import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse, type UIMessage } from "@/lib/ai";
import { z } from "zod";

type DDCStage = 
  | "intake"
  | "pal_parse"
  | "pal_ambiguity"
  | "pal_latent"
  | "pal_expand"
  | "pal_compile"
  | "intent"
  | "quality_plan"
  | "build";

interface HardGates {
  companyBackground?: string | null;
  productOffer?: string | null;
  icp?: string | null;
  persona?: string | null;
  dataTool?: string | null;
  crm?: string | null;
  outreach?: string | null;
  llmProvider?: string | null;
  triggerType?: string | null;
  approvalPolicy?: string | null;
}

interface WorkflowState {
  id: string;
  stage: DDCStage;
  gates: HardGates;
  educationMode: boolean;
  buildEligible: boolean;
  messages: UIMessage[];
  artifacts: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory store (use Redis/DB in production or Agent Swarm DynamoDB)
const workflowStore = new Map<string, WorkflowState>();

// Schema for extracting gates from natural language progressively
const GATES_EXTRACTION_SCHEMA = z.object({
  extractedGates: z.object({
    companyBackground: z.string().optional().nullable().describe("Company background, e.g. B2B SaaS selling DevOps tools"),
    productOffer: z.string().optional().nullable().describe("Product/offer/proof, e.g. CI/CD platform, 30% faster deploys"),
    icp: z.string().optional().nullable().describe("Ideal Customer Profile, e.g. 50-500 employees, Series A+, using GitHub"),
    persona: z.string().optional().nullable().describe("Persona, e.g. VP Engineering, DevOps Lead"),
    dataTool: z.string().optional().nullable().describe("Data tool, e.g. Apollo, Clay, ZoomInfo"),
    crm: z.string().optional().nullable().describe("CRM, e.g. HubSpot, Salesforce"),
    outreach: z.string().optional().nullable().describe("Outreach sequencer, e.g. Smartlead, Instantly"),
    llmProvider: z.string().optional().nullable().describe("LLM provider, e.g. Anthropic, OpenAI"),
    triggerType: z.string().optional().nullable().describe("Trigger type, e.g. search (daily) or csv (webhook)"),
    approvalPolicy: z.string().optional().nullable().describe("Approval policy, e.g. auto-send, human approval, draft-only"),
  }),
  nextQuestion: z.string().optional().describe("If any hard gate is missing, ask EXACTLY ONE question to fill ONE missing gate. NEVER ask a 40-field form or quiz the user."),
  teach: z.string().optional().describe("If educationMode is true, teach the current stage in simple 7th-grade language (3-6 sentences). What this step is, why it exists."),
});

const GATES_KEYS = [
  "companyBackground", "productOffer", "icp", "persona", "dataTool", 
  "crm", "outreach", "llmProvider", "triggerType", "approvalPolicy"
] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, workflowId, messages, educationMode = true } = body;

    // Start new workflow
    if (action === "start") {
      const id = `wf-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      const workflow: WorkflowState = {
        id,
        stage: "intake",
        gates: {},
        educationMode,
        buildEligible: false,
        messages: messages || [],
        artifacts: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      workflowStore.set(id, workflow);

      return NextResponse.json({
        success: true,
        workflowId: id,
        stage: workflow.stage,
        message: "DDC Planning Engine started. What kind of campaign are you looking to build?",
      });
    }

    // Progress workflow
    if (action === "chat" || action === "execute") {
      if (!workflowId || !messages) {
        return NextResponse.json({ error: "workflowId and messages are required" }, { status: 400 });
      }

      const workflow = workflowStore.get(workflowId);
      if (!workflow) {
        return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
      }

      workflow.messages = messages; // Update chat history

      if (workflow.stage === "intake") {
        // Build the system prompt with current state
        const systemPrompt = `You are the Delali Development Cycle (DDC) Planning Runtime.
You are currently in the INTAKE stage. Your job is to extract 10 hard gates from the conversation.
Current Known Gates:
${JSON.stringify(workflow.gates, null, 2)}

Instructions:
1. Extract any newly provided gates from the latest user message.
2. If ANY of the 10 gates are still missing, provide exactly ONE 'nextQuestion' targeting the most logical next missing gate. Do NOT quiz the user or ask multiple questions at once.
3. If educationMode is ${workflow.educationMode}, provide a 'teach' string explaining why we need this information.
4. If ALL gates are filled, omit 'nextQuestion'.`;

        const result = await generateChatResponse(messages as UIMessage[], {
          system: systemPrompt,
          temperature: 0.1,
        });

        // Parse JSON from the response
        let extractedGates: any = {};
        let nextQuestion: string | undefined;
        let teach: string | undefined;
        
        try {
          const parsed = JSON.parse(result.text);
          extractedGates = parsed.extractedGates || {};
          nextQuestion = parsed.nextQuestion;
          teach = parsed.teach;
        } catch (e) {
          // If not valid JSON, treat entire response as nextQuestion
          nextQuestion = result.text;
        }

        // Merge newly extracted gates
        for (const key of GATES_KEYS) {
          if (extractedGates[key] && !workflow.gates[key]) {
            workflow.gates[key] = extractedGates[key] as string;
          }
        }

        const missingGates = GATES_KEYS.filter(key => !workflow.gates[key]);

        if (missingGates.length > 0 && nextQuestion) {
          // Still in intake, need more info
          workflow.updatedAt = new Date();
          return NextResponse.json({
            success: true,
            workflowId,
            stage: workflow.stage,
            gates: workflow.gates,
            missingCount: missingGates.length,
            teach: workflow.educationMode ? teach : undefined,
            deliver: nextQuestion,
          });
        } else if (missingGates.length === 0) {
          // Intake complete! Transition to next stage
          workflow.stage = "pal_parse";
          workflow.artifacts["campaign/intake/v1"] = workflow.gates;
          workflow.updatedAt = new Date();

          return NextResponse.json({
            success: true,
            workflowId,
            stage: workflow.stage,
            gates: workflow.gates,
            teach: workflow.educationMode ? "Intake complete. Moving to PAL Parse to separate stated requirements from inferred context." : undefined,
            deliver: "All requirements captured. Shall we proceed with generating the campaign architecture?",
          });
        }
      }

      // Handle subsequent stages here (pal_parse, pal_ambiguity, etc.)
      // For now, if we reach here, we just mock the progression for the example
      if (workflow.stage !== "intake" && workflow.stage !== "build") {
        const stages: DDCStage[] = ["pal_parse", "pal_ambiguity", "pal_latent", "pal_expand", "pal_compile", "intent", "quality_plan", "build"];
        const currentIndex = stages.indexOf(workflow.stage);
        
        if (currentIndex !== -1 && currentIndex < stages.length - 1) {
          const nextStage = stages[currentIndex + 1];
          workflow.stage = nextStage;
          if (nextStage === "quality_plan") {
            workflow.buildEligible = true;
          }
          workflow.updatedAt = new Date();
          
          return NextResponse.json({
            success: true,
            workflowId,
            stage: workflow.stage,
            teach: workflow.educationMode ? `Progressing through DDC: Moving to ${nextStage}` : undefined,
            deliver: `Stage ${workflow.stage} complete. Ready for next step.`,
          });
        }
      }

      return NextResponse.json({
        success: true,
        workflowId,
        stage: workflow.stage,
        message: "Workflow is ready for build execution.",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("[Workflow API] Error:", error);
    return NextResponse.json(
      { error: "Workflow execution failed", message: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workflowId = searchParams.get("id");

  if (!workflowId) {
    // List all workflows
    const workflows = Array.from(workflowStore.values()).map(w => ({
      id: w.id,
      stage: w.stage,
      buildEligible: w.buildEligible,
      createdAt: w.createdAt,
    }));
    return NextResponse.json({ workflows });
  }

  const workflow = workflowStore.get(workflowId);
  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: workflow.id,
    stage: workflow.stage,
    gates: workflow.gates,
    educationMode: workflow.educationMode,
    buildEligible: workflow.buildEligible,
    artifacts: workflow.artifacts,
    createdAt: workflow.createdAt,
    updatedAt: workflow.updatedAt,
  });
}
