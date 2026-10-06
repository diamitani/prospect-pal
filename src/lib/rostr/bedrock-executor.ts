/**
 * Vercel AI Suite Agent Executor
 * Executes agent manifests using Claude / GPT-4o via Vercel AI SDK Core
 * Zero AWS dependencies.
 */

import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { AgentManifest } from "./pal-compiler";

export interface AgentExecutionResult {
  success: boolean;
  output: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  duration_ms: number;
  error?: string;
}

/**
 * Execute agent manifest using Vercel AI SDK
 */
export async function executeAgentWithBedrock(
  manifest: AgentManifest
): Promise<AgentExecutionResult> {
  const startTime = Date.now();

  try {
    // Build system prompt
    let systemPrompt = `You are a ${manifest.runtime.agent_type} agent.

Behavior Profile: ${manifest.instructions.behavior_profile}

Task:
${manifest.instructions.task_description}

Completion Criteria:
${manifest.instructions.completion_criteria.map((c) => `- ${c}`).join("\n")}

Output Format: ${manifest.output.format}
`;

    if (manifest.context?.project) {
      systemPrompt += `\n\nProject Context:\n${JSON.stringify(manifest.context.project, null, 2)}`;
    }

    const userMessage = manifest.instructions.task_description;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;

    let responseText = "";
    let usage = { input_tokens: 0, output_tokens: 0 };

    if (anthropicKey) {
      const anthropic = createAnthropic({ apiKey: anthropicKey });
      const result = await generateText({
        model: anthropic("claude-3-5-sonnet-20241022"),
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
        temperature: manifest.runtime.temperature,
      });
      responseText = result.text;
      usage = {
        input_tokens: result.usage?.inputTokens || 0,
        output_tokens: result.usage?.outputTokens || 0,
      };
    } else if (openAIKey) {
      const openai = createOpenAI({ apiKey: openAIKey });
      const result = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
        temperature: manifest.runtime.temperature,
      });
      responseText = result.text;
      usage = {
        input_tokens: result.usage?.inputTokens || 0,
        output_tokens: result.usage?.outputTokens || 0,
      };
    } else {
      throw new Error("Missing ANTHROPIC_API_KEY or OPENAI_API_KEY for Vercel AI SDK execution.");
    }

    const duration_ms = Date.now() - startTime;

    return {
      success: true,
      output: responseText,
      usage,
      duration_ms,
    };
  } catch (error) {
    const duration_ms = Date.now() - startTime;

    return {
      success: false,
      output: "",
      usage: {
        input_tokens: 0,
        output_tokens: 0,
      },
      duration_ms,
      error: String(error),
    };
  }
}

/**
 * Execute with retry logic
 */
export async function executeWithRetry(
  manifest: AgentManifest,
  maxRetries: number = 3
): Promise<AgentExecutionResult> {
  let lastError: string = "";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await executeAgentWithBedrock(manifest);

    if (result.success) {
      return result;
    }

    lastError = result.error || "Unknown error";

    if (attempt < maxRetries) {
      const delayMs = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return {
    success: false,
    output: "",
    usage: { input_tokens: 0, output_tokens: 0 },
    duration_ms: 0,
    error: `Failed after ${maxRetries} retries. Last error: ${lastError}`,
  };
}

/**
 * Batch execution for multiple manifests
 */
export async function executeBatch(
  manifests: AgentManifest[]
): Promise<AgentExecutionResult[]> {
  return Promise.all(manifests.map((m) => executeWithRetry(m)));
}
