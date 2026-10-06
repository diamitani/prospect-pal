/**
 * AI Execution Client & Multi-Provider Gateway
 * Powered by Vercel AI SDK Core (Anthropic, OpenAI, Google Gemini)
 * Completely eliminates AWS SDK dependencies.
 */
import { generateText, streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";

export interface BedrockMessage {
  role: "user" | "assistant";
  content: string;
}

const DEFAULT_MODEL = "claude-3-5-sonnet-20241022";

/**
 * Get active AI client with automatic fallback
 */
function getClient() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openAIKey = process.env.OPENAI_API_KEY;
  const gatewayUrl = process.env.VERCEL_AI_GATEWAY_URL;

  if (anthropicKey) {
    const anthropic = createAnthropic({
      apiKey: anthropicKey,
      baseURL: gatewayUrl ? `${gatewayUrl}/anthropic` : undefined,
    });
    return { provider: "anthropic" as const, model: anthropic(DEFAULT_MODEL) };
  }

  if (openAIKey) {
    const openai = createOpenAI({
      apiKey: openAIKey,
      baseURL: gatewayUrl ? `${gatewayUrl}/openai` : undefined,
    });
    return { provider: "openai" as const, model: openai("gpt-4o") };
  }

  // Fallback demo client
  const openai = createOpenAI({ apiKey: "demo-key" });
  return { provider: "openai" as const, model: openai("gpt-4o-mini") };
}

/**
 * Invoke Claude / OpenAI with streaming
 */
export async function invokeClaudeStream(
  messages: BedrockMessage[],
  systemPrompt: string,
  _maxTokens = 4096
): Promise<ReadableStream<Uint8Array>> {
  const { model } = getClient();

  const result = streamText({
    model,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  return result.textStream.pipeThrough(
    new TransformStream<string, Uint8Array>({
      transform(chunk, controller) {
        controller.enqueue(new TextEncoder().encode(chunk));
      },
    })
  );
}

/**
 * Invoke Claude / OpenAI for structured JSON output
 */
export async function invokeClaude(
  messages: BedrockMessage[],
  systemPrompt: string,
  _maxTokens = 8192
): Promise<string> {
  const { model } = getClient();

  try {
    const { text } = await generateText({
      model,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    return text;
  } catch (error: any) {
    console.error("[AI Gateway] Execution error:", error);
    // Auto-fallback to OpenAI if Anthropic errored
    if (process.env.OPENAI_API_KEY) {
      const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      });
      return text;
    }
    throw error;
  }
}

export const MODEL_ID = DEFAULT_MODEL;
