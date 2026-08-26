/**
 * AWS Bedrock Agent Executor
 * Executes agent manifests using Claude via AWS Bedrock
 */

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import type { AgentManifest } from "./pal-compiler";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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
 * Execute agent manifest using AWS Bedrock Claude
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

    // Add context if available
    if (manifest.context?.project) {
      systemPrompt += `\n\nProject Context:\n${JSON.stringify(manifest.context.project, null, 2)}`;
    }

    // Build user message
    const userMessage = manifest.instructions.task_description;

    // Map model name to Bedrock model ID
    const modelIdMap: Record<string, string> = {
      "claude-sonnet-4": "us.anthropic.claude-sonnet-4-20250514-v1:0",
      "claude-opus-4": "us.anthropic.claude-opus-4-20250514-v1:0",
      "claude-haiku-4": "us.anthropic.claude-haiku-4-20250320-v1:0",
    };

    const modelId =
      modelIdMap[manifest.runtime.model] ||
      "us.anthropic.claude-sonnet-4-20250514-v1:0";

    // Build request payload
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4096,
      temperature: manifest.runtime.temperature,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    };

    // Invoke Bedrock
    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    const duration_ms = Date.now() - startTime;

    // Extract response
    const output = responseBody.content[0].text;
    const usage = {
      input_tokens: responseBody.usage.input_tokens,
      output_tokens: responseBody.usage.output_tokens,
    };

    return {
      success: true,
      output,
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

    // Exponential backoff
    if (attempt < maxRetries) {
      const delayMs = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // All retries failed
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
