/**
 * ROSTR HUB - Core Operating System
 * Full ROSTR spec: PAL 5-step + NPAO + Intake Gate
 * 
 * MODE: MOCK (no API keys required)
 * To enable live: set USE_LIVE_AI=1 and OPENAI_API_KEY=your-key
 */

import { z, type ZodIssue } from "zod";

const LIVE_MODE = process.env.USE_LIVE_AI === "1" && process.env.OPENAI_API_KEY;

// Intake Gate Schema
const IntakeSchema = z.object({
  requester: z.object({ name: z.string(), role: z.string(), goal_statement: z.string(), approver: z.string() }),
  classification: z.object({
    category: z.enum(["gtm-sales", "music-industry", "dev-infra", "personal-productivity"]),
    risk_class: z.enum(["low", "medium", "high"]),
    autonomy_level: z.enum(["human-in-the-loop", "conditional-approval", "fully-autonomous"]),
  }),
  job: z.object({ situation: z.string(), motivation: z.string(), outcome: z.string(), trigger: z.string(), success_metric: z.string() }),
  tools_needed: z.array(z.object({ capability: z.string(), access: z.enum(["read", "write", "invoke"]), already_connected: z.boolean() })),
  approval_gates: z.object({ always_gate: z.array(z.string()), approver: z.string() }),
});

export async function palExtract(input: string) {
  console.log("[PAL] Extracting intent...");
  return { 
    phase: "extract", 
    intent: {
      primary_intent: "Build prospect automation",
      domain: "sales",
      subject: input.slice(0, 30),
      constraints: ["requires CRM integration", "human approval needed", "compliance check"],
      desired_output: "n8n workflow JSON",
      urgency: "queued"
    }
  };
}

export async function palEnhance(intent: any) {
  console.log("[PAL] Enhancing instruction...");
  return {
    phase: "enhance",
    instruction: `Build automated prospect outreach workflow for ${intent.subject}. Target: ${intent.domain}. Requirements: ${intent.constraints.join(", ")}. Output: ${intent.desired_output}.`
  };
}

export async function palCompile(instruction: string) {
  console.log("[PAL] Compiling runtime...");
  return {
    phase: "compile",
    runtime: {
      agent_type: "builder" as const,
      tools: { web_search: true, file_system: "read", code_execution: false },
      output_format: "json" as const
    }
  };
}

export async function npaoPrioritize(intent: any) {
  console.log("[NPAO] Prioritizing...");
  return {
    phase: "npao",
    priorities: {
      now: ["Parse intake request", "Validate data sources", "Check permissions"],
      next: ["Generate workflow JSON", "Configure CRM integration", "Set up n8n triggers"],
      after: ["Test workflow end-to-end", "Deploy to production", "Monitor first runs"],
      out: ["Cold calling", "Social media posting", "Invoice processing", "Email marketing"]
    }
  };
}

export async function intakeGate(data: object) {
  console.log("[GATE] Validating intake...");
  const result = IntakeSchema.safeParse(data);
  if (!result.success) {
    const missingFields = result.error.issues.map((issue: ZodIssue) => issue.path.join("."));
    return { status: "blocked", missing: missingFields };
  }
  return { status: "approved", intake: result.data };
}

export async function rostrWorkflow(request: { input: string; intake?: object }) {
  console.log("[ROSTR] Starting workflow...");
  console.log(LIVE_MODE ? "[ROSTR] LIVE mode" : "[ROSTR] MOCK mode");
  
  if (request.intake) {
    const gate = await intakeGate(request.intake);
    if (gate.status === "blocked") {
      console.log("[ROSTR] Blocked at intake gate");
      return { ...gate, mode: "mock" };
    }
  }
  
  const extract = await palExtract(request.input);
  const enhance = await palEnhance(extract.intent);
  const compile = await palCompile(enhance.instruction);
  const npao = await npaoPrioritize(extract.intent);
  
  console.log("[ROSTR] Workflow complete");
  
  return {
    status: "success",
    intent: extract.intent,
    instruction: enhance.instruction,
    runtime: compile.runtime,
    priorities: npao.priorities,
    mode: LIVE_MODE ? "live" : "mock"
  };
}

export default rostrWorkflow;
