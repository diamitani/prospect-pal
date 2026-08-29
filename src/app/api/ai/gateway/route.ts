/**
 * Universal AI Gateway API
 * POST /api/ai/gateway
 * 
 * Single endpoint for all AI providers with automatic fallback
 * Supports streaming and non-streaming responses
 */

import { NextRequest, NextResponse } from "next/server";
import { streamChat, generateChatResponse, type AIProvider, type AIConfig } from "@/lib/ai";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

const RequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })),
  provider: z.enum(["bedrock", "openai", "anthropic"]).optional(),
  model: z.string().optional(),
  system: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(128000).optional(),
  stream: z.boolean().optional().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { messages, provider, model, system, temperature, stream } = parsed.data;

    const config: AIConfig = {
      provider: provider as AIProvider,
      model,
      system,
      temperature,
    };

    // Handle streaming requests
    if (stream) {
      return streamChat(messages as any, config);
    }

    // Handle non-streaming text response
    const result = await generateChatResponse(messages as any, config);
    
    return NextResponse.json({
      text: result.text,
      provider: result.provider,
      success: true,
    });

  } catch (error) {
    console.error("[AI Gateway API] Error:", error);
    
    return NextResponse.json(
      { 
        error: "AI processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/gateway
 * Returns available providers and their status
 */
export async function GET() {
  const { DEFAULT_MODELS } = await import("@/lib/ai");
  
  return NextResponse.json({
    available: ["bedrock", "openai", "anthropic"],
    primary: "openai",
    models: DEFAULT_MODELS,
    timestamp: new Date().toISOString(),
  });
}
