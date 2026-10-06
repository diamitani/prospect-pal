/**
 * POST /api/swarm/stream
 * Streaming SSE endpoint for real-time agent responses
 * Powered by Vercel AI SDK Core (Zero AWS SDK)
 *
 * Streams events:
 *   - phase: { stage: 'compiling' | 'classifying' | 'executing' | 'complete' }
 *   - token: { text: string }
 *   - result: { task_id, output, usage }
 *   - error: { message: string }
 */

import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { compilePAL, type AgentManifest } from "@/lib/rostr/pal-compiler";
import { classifyPhase, calculatePriority } from "@/lib/rostr/npao-classifier";
import {
  loadAgentSession,
  saveAgentSession,
  generateSessionId,
} from "@/lib/agent-session";

export const runtime = "nodejs";
export const maxDuration = 120;

type PhaseStage = "compiling" | "classifying" | "executing" | "complete";

interface SSEPhaseEvent {
  type: "phase";
  stage: PhaseStage;
  details?: Record<string, unknown>;
}

interface SSETokenEvent {
  type: "token";
  text: string;
}

interface SSEResultEvent {
  type: "result";
  task_id: string;
  output: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  phase?: string;
  agent_type?: string;
  duration_ms?: number;
}

interface SSEErrorEvent {
  type: "error";
  message: string;
  code?: string;
}

type SSEEvent = SSEPhaseEvent | SSETokenEvent | SSEResultEvent | SSEErrorEvent;

function formatSSE(event: SSEEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

function buildSystemPrompt(manifest: AgentManifest): string {
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

  return systemPrompt;
}

async function* streamAgentExecution(
  manifest: AgentManifest,
  conversationHistory: Array<{ role: string; content: string }>
): AsyncGenerator<SSEEvent> {
  const startTime = Date.now();
  const systemPrompt = buildSystemPrompt(manifest);

  const messages = [
    ...conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    {
      role: "user" as const,
      content: manifest.instructions.task_description,
    },
  ];

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openAIKey = process.env.OPENAI_API_KEY;
  let model: any;

  if (anthropicKey) {
    const anthropic = createAnthropic({ apiKey: anthropicKey });
    model = anthropic("claude-3-5-sonnet-20241022");
  } else if (openAIKey) {
    const openai = createOpenAI({ apiKey: openAIKey });
    model = openai("gpt-4o");
  } else {
    const openai = createOpenAI({ apiKey: "demo-key" });
    model = openai("gpt-4o-mini");
  }

  let fullOutput = "";

  try {
    const result = streamText({
      model,
      system: systemPrompt,
      messages,
      temperature: manifest.runtime.temperature,
    });

    for await (const delta of result.textStream) {
      if (delta) {
        fullOutput += delta;
        yield { type: "token", text: delta };
      }
    }

    const duration_ms = Date.now() - startTime;
    const usage = await result.usage;

    yield {
      type: "result",
      task_id: manifest.manifestId,
      output: fullOutput,
      usage: {
        input_tokens: usage?.inputTokens || 0,
        output_tokens: usage?.outputTokens || 0,
      },
      phase: manifest.runtime.agent_type,
      agent_type: manifest.runtime.agent_type,
      duration_ms,
    };
  } catch (error) {
    yield {
      type: "error",
      message: error instanceof Error ? error.message : String(error),
      code: "AI_EXECUTION_ERROR",
    };
  }
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  let body: {
    user_input: string;
    session_id?: string;
    agent_type_hint?: string;
    user_id?: string;
    project_id?: string;
  };

  try {
    body = await req.json();
  } catch {
    const errorStream = new ReadableStream({
      start(controller) {
        const event: SSEErrorEvent = {
          type: "error",
          message: "Invalid JSON in request body",
          code: "INVALID_REQUEST",
        };
        controller.enqueue(encoder.encode(formatSSE(event)));
        controller.close();
      },
    });

    return new Response(errorStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const {
    user_input,
    session_id = generateSessionId(),
    agent_type_hint,
    user_id = "anonymous",
    project_id,
  } = body;

  if (!user_input) {
    const errorStream = new ReadableStream({
      start(controller) {
        const event: SSEErrorEvent = {
          type: "error",
          message: "user_input is required",
          code: "MISSING_INPUT",
        };
        controller.enqueue(encoder.encode(formatSSE(event)));
        controller.close();
      },
    });

    return new Response(errorStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const enqueue = (event: SSEEvent) => {
        controller.enqueue(encoder.encode(formatSSE(event)));
      };

      try {
        enqueue({
          type: "phase",
          stage: "compiling",
          details: { session_id, agent_type_hint },
        });

        const manifest = await compilePAL(
          user_input,
          project_id,
          user_id,
          undefined,
          agent_type_hint
        );

        enqueue({
          type: "phase",
          stage: "classifying",
          details: {
            manifest_id: manifest.manifestId,
            agent_type: manifest.runtime.agent_type,
          },
        });

        const phase = classifyPhase(manifest);
        const priority = calculatePriority(phase, manifest);

        enqueue({
          type: "phase",
          stage: "classifying",
          details: {
            phase: phase.phase,
            confidence: phase.confidence,
            priority_score: priority.total,
            threshold: priority.threshold,
          },
        });

        let conversationHistory: Array<{ role: string; content: string }> = [];
        try {
          const sessionMessages = await loadAgentSession(user_id, session_id);
          conversationHistory = sessionMessages.map((m) => ({
            role: m.role,
            content: m.content,
          }));
        } catch {
          // No existing session
        }

        enqueue({
          type: "phase",
          stage: "executing",
          details: {
            model: manifest.runtime.model,
            temperature: manifest.runtime.temperature,
          },
        });

        let finalOutput = "";

        for await (const event of streamAgentExecution(
          manifest,
          conversationHistory
        )) {
          enqueue(event);

          if (event.type === "result") {
            finalOutput = event.output;
          }

          if (event.type === "error") {
            controller.close();
            return;
          }
        }

        enqueue({
          type: "phase",
          stage: "complete",
          details: { session_id, task_id: manifest.manifestId },
        });

        try {
          const updatedMessages = [
            ...conversationHistory.map((m) => ({
              role: m.role as "user" | "assistant" | "system",
              content: m.content,
              timestamp: new Date().toISOString(),
            })),
            {
              role: "user" as const,
              content: user_input,
              timestamp: new Date().toISOString(),
            },
            {
              role: "assistant" as const,
              content: finalOutput,
              timestamp: new Date().toISOString(),
            },
          ];

          await saveAgentSession(user_id, session_id, updatedMessages);
        } catch (sessionError) {
          console.warn("Failed to persist session:", sessionError);
        }

        controller.close();
      } catch (error) {
        enqueue({
          type: "error",
          message: error instanceof Error ? error.message : String(error),
          code: "STREAM_ERROR",
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(
          formatSSE({
            type: "phase",
            stage: "complete",
            details: { status: "connected", timestamp: new Date().toISOString() },
          })
        )
      );
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
