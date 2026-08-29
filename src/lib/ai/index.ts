/**
 * BYOK AI Gateway - Core
 * Integrated with Vercel AI Gateway & Vercel AI SDK Core
 */

import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { bedrock } from "@ai-sdk/amazon-bedrock";
import { streamText, generateText, type UIMessage } from "ai";
import { z } from "zod";
import { getAllTools } from "./tools";

// If you have a Vercel AI Gateway, define it in your .env.local as VERCEL_AI_GATEWAY_URL
const gatewayUrl = process.env.VERCEL_AI_GATEWAY_URL;

// Configure providers to use the Vercel AI Gateway if configured
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: gatewayUrl ? `${gatewayUrl}/openai` : undefined,
});

export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: gatewayUrl ? `${gatewayUrl}/anthropic` : undefined,
});

export type AIProvider = "bedrock" | "openai" | "anthropic";

export interface AIConfig {
  provider?: AIProvider;
  model?: string;
  temperature?: number;
  system?: string;
  tools?: Record<string, any>;
}

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  bedrock: "anthropic.claude-3-5-sonnet-20241022-v2:0",
  openai: "gpt-4o-mini",
  anthropic: "claude-3-5-sonnet-20241022",
};

/** Create model instance based on requested provider */
export function createModel(provider: AIProvider, modelId?: string) {
  const model = modelId || DEFAULT_MODELS[provider];
  switch (provider) {
    case "bedrock": return bedrock(model);
    case "openai": return openai(model);
    case "anthropic": return anthropic(model);
    default: return openai(DEFAULT_MODELS.openai);
  }
}

/** 
 * Stream chat using Vercel AI SDK
 * Fallbacks are handled upstream by Vercel AI Gateway if configured.
 */
export async function streamChat(messages: UIMessage[], config: AIConfig = {}) {
  const { provider = "openai", model, system, temperature = 0.7, tools = getAllTools() } = config;
  
  const aiModel = createModel(provider, model);
  
  const result = streamText({
    model: aiModel,
    messages: messages as any, // Cast to any to avoid strict type mismatch with internal ModelMessage
    system,
    temperature,
    tools,
  });

  return result.toTextStreamResponse();
}

/** 
 * Generate text using Vercel AI SDK 
 */
export async function generateChatResponse(messages: UIMessage[], config: AIConfig = {}) {
  const { provider = "openai", model, system, temperature = 0.7, tools = getAllTools() } = config;
  
  const aiModel = createModel(provider, model);
  
  const result = await generateText({ 
    model: aiModel, 
    messages: messages as any, 
    system, 
    temperature,
    tools
  });
  
  return { text: result.text, provider };
}

export { z, type UIMessage };
