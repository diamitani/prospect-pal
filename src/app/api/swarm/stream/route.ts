/**
 * POST /api/swarm/stream
 * Streaming SSE endpoint for real-time agent responses
 *
 * Streams events:
 *   - phase: { stage: 'compiling' | 'classifying' | 'executing' | 'complete' }
 *   - token: { text: string }
 *   - result: { task_id, output, usage }
 *   - error: { message: string }
 */

import { NextRequest } from "next/server";
import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { compilePAL, type AgentManifest } from "@/lib/rostr/pal-compiler";
import { classifyPhase, calculatePriority } from "@/lib/rostr/npao-classifier";
import {
  loadAgentSession,
  saveAgentSession,
  generateSessionId,
} from "@/lib/agent-session";

export const runtime = "nodejs";
export const maxDuration = 120;

// SSE event types
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

// Bedrock client configuration
function createBedrockClient(): BedrockRuntimeClient {
  const region = process.env.AWS_REGION || "us-east-1";

  if (process.env.AWS_BEDROCK_BEARER_TOKEN) {
    return new BedrockRuntimeClient({
      region,
      token: { token: process.env.AWS_BEDROCK_BEARER_TOKEN },
    });
  }

  return new BedrockRuntimeClient({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

// Map model names to Bedrock model IDs
const MODEL_ID_MAP: Record<string, string> = {
  "claude-sonnet-4": "us.anthropic.claude-sonnet-4-20250514-v1:0",
  "claude-opus-4": "us.anthropic.claude-opus-4-20250514-v1:0",
  "claude-haiku-4": "us.anthropic.claude-haiku-4-20250320-v1:0",
  default: "us.anthropic.claude-sonnet-4-20250514-v1:0",
};

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
  const client = createBedrockClient();
  const startTime = Date.now();

  const modelId = MODEL_ID_MAP[manifest.runtime.model] || MODEL_ID_MAP.default;
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

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 4096,
    temperature: manifest.runtime.temperature,
    system: systemPrompt,
    messages,
  };

  const command = new InvokeModelWithResponseStreamCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  });

  let fullOutput = "";
  let usage = { input_tokens: 0, output_tokens: 0 };

  try {
    const response = await client.send(command);

    if (!response.body) {
      throw new Error("No response body from Bedrock");
    }

    for await (const chunk of response.body) {
      if (chunk.chunk?.bytes) {
        const decoded = new TextDecoder().decode(chunk.chunk.bytes);
        const parsed = JSON.parse(decoded);

        if (parsed.type === "content_block_delta") {
          const text = parsed.delta?.text || "";
          if (text) {
            fullOutput += text;
            yield { type: "token", text };
          }
        }

        if (parsed.type === "message_delta" && parsed.usage) {
          usage.output_tokens = parsed.usage.output_tokens || 0;
        }

        if (parsed.type === "message_start" && parsed.message?.usage) {
          usage.input_tokens = parsed.message.usage.input_tokens || 0;
        }
      }
    }

    const duration_ms = Date.now() - startTime;

    yield {
      type: "result",
      task_id: manifest.manifestId,
      output: fullOutput,
      usage,
      phase: manifest.runtime.agent_type,
      agent_type: manifest.runtime.agent_type,
      duration_ms,
    };
  } catch (error) {
    yield {
      type: "error",
      message: error instanceof Error ? error.message : String(error),
      code: "BEDROCK_EXECUTION_ERROR",
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
        // Phase 1: Compiling
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

        // Phase 2: Classifying
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

        // Load conversation history
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

        // Phase 3: Executing
        enqueue({
          type: "phase",
          stage: "executing",
          details: {
            model: manifest.runtime.model,
            temperature: manifest.runtime.temperature,
          },
        });

        let finalOutput = "";
        let finalUsage = { input_tokens: 0, output_tokens: 0 };

        for await (const event of streamAgentExecution(
          manifest,
          conversationHistory
        )) {
          enqueue(event);

          if (event.type === "result") {
            finalOutput = event.output;
            finalUsage = event.usage;
          }

          if (event.type === "error") {
            controller.close();
            return;
          }
        }

        // Phase 4: Complete
        enqueue({
          type: "phase",
          stage: "complete",
          details: { session_id, task_id: manifest.manifestId },
        });

        // Persist session
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
