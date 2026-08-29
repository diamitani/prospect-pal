/**
 * WORKFLOW SDK - Prospect Automation Pipeline
 * 5 steps: Parse → Validate → Research → Build → Deploy
 * 
 * Native implementation (Vercel Workflow SDK ready)
 */

import { generateText, generateObject } from "ai";
import { bedrock } from "@ai-sdk/amazon-bedrock";
import { z } from "zod";

// Use Bedrock (your existing key)
const MODEL = bedrock("anthropic.claude-3-5-sonnet-20241022-v2:0");

// Step 1: Parse input
export async function parseStep(input: string) {
  const { object } = await generateObject({
    model: MODEL,
    schema: z.object({
      company: z.string(),
      product: z.string(),
      icp: z.string(),
      tools: z.any(),
    }),
    prompt: `Extract from: "${input}"`,
  });
  return { parsed: object };
}

// Step 2: Validate gates
export async function validateStep(data: any) {
  const required = ['company', 'product', 'icp', 'dataTool', 'crm', 'sequencer'];
  const missing = required.filter(k => !data[k]);
  return { valid: missing.length === 0, missing };
}

// Step 3: Research
export async function researchStep(gates: any) {
  const { text } = await generateText({
    model: MODEL,
    prompt: `Research ICP: ${gates.icp}. Company: ${gates.company}`,
  });
  return { summary: text };
}

// Step 4: Build workflow
export async function buildStep(gates: any) {
  const { text } = await generateText({
    model: MODEL,
    prompt: `Generate n8n JSON for ${gates.company} using ${gates.dataTool}→${gates.crm}→${gates.sequencer}`,
  });
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return { success: true, workflow: match ? JSON.parse(match[0]) : {} };
  } catch {
    return { success: false, error: "Parse failed" };
  }
}

// Master workflow
export async function prospectWorkflow(input: string) {
  const parse = await parseStep(input);
  const validation = await validateStep(parse.parsed);
  
  if (!validation.valid) {
    return { phase: "intake", missing: validation.missing };
  }
  
  const research = await researchStep(parse.parsed);
  const build = await buildStep(parse.parsed);
  
  return {
    phase: "complete",
    workflow: build.workflow,
    research: research.summary,
  };
}

export default prospectWorkflow;
