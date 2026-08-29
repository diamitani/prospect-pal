/**
 * ROSTR HUB - Core Operating System
 * Full ROSTR spec: PAL 5-step + NPAO + Intake Gate
 */

// @ts-ignore
import { workflow } from "@vercel/workflow";
import { generateText, generateObject } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";

// Multi-model support
const MODEL = process.env.OPENAI_API_KEY 
  ? openai("gpt-4o")
  : (await import("@ai-sdk/amazon-bedrock")).bedrock("anthropic.claude-3-5-sonnet-20241022-v2:0");

// Intake Gate Schema (from agent-intake.schema.json)
const IntakeSchema = z.object({
  requester: z.object({
    name: z.string(), role: z.string(), goal_statement: z.string(), approver: z.string()
  }),
  classification: z.object({
    category: z.enum(["gtm-sales", "music-industry", "dev-infra", "personal-productivity"]),
    risk_class: z.enum(["low", "medium", "high"]),
    autonomy_level: z.enum(["human-in-the-loop", "conditional-approval", "fully-autonomous"]),
  }),
  job: z.object({
    situation: z.string(), motivation: z.string(), outcome: z.string(),
    trigger: z.string(), success_metric: z.string()
  }),
  tools_needed: z.array(z.object({
    capability: z.string(), access: z.enum(["read", "write", "invoke"]), already_connected: z.boolean()
  })),
  approval_gates: z.object({ always_gate: z.array(z.string()), approver: z.string() }),
});

// PAL Step 1: Extract Intent
export const palExtract = workflow("pal-extract", async (input: string) => {
  const { object } = await generateObject({
    model: MODEL,
    schema: z.object({
      primary_intent: z.string(), domain: z.string(), subject: z.string(),
      constraints: z.array(z.string()), desired_output: z.string(), urgency: z.string(),
    }),
    prompt: `Extract structured intent from: "${input}"`,
    temperature: 0.3,
  });
  return { phase: "extract", intent: object };
});

// PAL Step 3: Enhance
export const palEnhance = workflow("pal-enhance", async ({ intent }: any) => {
  const { text } = await generateText({
    model: MODEL,
    prompt: `Enhance into precise instruction: ${JSON.stringify(intent)}`,
    temperature: 0.5,
  });
  return { phase: "enhance", instruction: text };
});

// PAL Step 4: Compile Runtime
export const palCompile = workflow("pal-compile", async ({ instruction }: any) => {
  const { object } = await generateObject({
    model: MODEL,
    schema: z.object({
      agent_type: z.enum(["builder", "researcher", "orchestrator"]),
      tools: z.object({ web_search: z.boolean(), file_system: z.string(), code_execution: z.boolean() }),
      output_format: z.enum(["markdown", "json", "code"]),
    }),
    prompt: `Compile runtime for: ${instruction}`,
  });
  return { phase: "compile", runtime: object };
});

// NPAO Prioritization
export const npaoPrioritize = workflow("npao", async ({ intent }: any) => {
  const { object } = await generateObject({
    model: MODEL,
    schema: z.object({
      now: z.array(z.string()), next: z.array(z.string()), after: z.array(z.string()), out: z.array(z.string())
    }),
    prompt: `Apply NPAO to: ${JSON.stringify(intent)}`,
  });
  return { phase: "npao", priorities: object };
});

// Intake Gate
export const intakeGate = workflow("intake-gate", async (data: object) => {
  const result = IntakeSchema.safeParse(data);
  if (!result.success) {
    return { status: "blocked", missing: (result.error as any).errors.map((e: any) => e.path.join(".")) };
  }
  return { status: "approved", intake: result.data };
});

// Master Workflow
export const rostrWorkflow = workflow("rostr", async (request: { input: string; intake?: object }) => {
  // Gate
  if (request.intake) {
    const gate = await intakeGate.run(request.intake);
    if (gate.status === "blocked") return gate;
  }
  
  // PAL 4-step (simplified)
  const extract = await palExtract.run(request.input);
  const enhance = await palEnhance.run(extract);
  const compile = await palCompile.run(enhance);
  const npao = await npaoPrioritize.run(extract);
  
  return {
    status: "success",
    intent: extract.intent,
    instruction: enhance.instruction,
    runtime: compile.runtime,
    priorities: npao.priorities,
  };
});

export default rostrWorkflow;
