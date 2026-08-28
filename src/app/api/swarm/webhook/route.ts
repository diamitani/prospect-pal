/**
 * Agent Swarm Webhook API
 * Entry point for user submissions that routes to agent swarm or N8N
 */

import { NextRequest, NextResponse } from "next/server";
import { compilePAL } from "@/lib/rostr/pal-compiler";
import { classifyPhase, calculatePriority } from "@/lib/rostr/npao-classifier";
import { agentSwarm, type SessionContext } from "@/lib/rostr/agent-swarm";
import { routeTask, routeHybrid, buildN8NPayload, sendToN8N } from "@/lib/rostr/integration-router";
import { saveArtifact } from "@/lib/supabase";
import { generateSessionId } from "@/lib/agent-session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_input,
      project_id,
      user_id = "demo-user",
      session_id = generateSessionId(), // Session ID for context persistence
      routing_preference = "auto", // "auto" | "agent-only" | "n8n-only" | "hybrid"
      n8n_webhook_url,
      agent_type_hint, // Optional agent type from frontend
      use_streaming = false, // Whether to suggest streaming endpoint
    } = body;

    if (!user_input) {
      return NextResponse.json(
        { error: "user_input is required" },
        { status: 400 }
      );
    }

    // Initialize swarm with skill-based agents (idempotent)
    await agentSwarm.initialize();

    // Get or create session context
    const sessionContext: SessionContext = await agentSwarm.getSessionContext(
      session_id,
      user_id
    );

    // Step 1: Compile PAL (Intent → Agent Manifest)
    const manifest = await compilePAL(user_input, project_id, user_id, {}, agent_type_hint);

    // Step 2: Classify Phase (5D Phase Taxonomy)
    const phase = classifyPhase(manifest);

    // Step 3: Calculate Priority (4D Priority Scoring)
    const priority = calculatePriority(phase, manifest);

    // Step 4: Route based on preference
    let result: any;
    let routing: any;

    if (routing_preference === "agent-only") {
      // Force agent swarm with session context
      const task = await agentSwarm.submitTask(manifest, sessionContext);

      // Wait for completion (in production, use async/polling)
      await waitForTask(task.id, 60000); // 60s timeout

      const completedTask = agentSwarm.getTask(task.id);

      result = {
        type: "agent-swarm",
        task_id: task.id,
        session_id,
        status: completedTask?.status,
        result: completedTask?.result,
        phase: phase.phase,
        priority: priority.total,
      };
    } else if (routing_preference === "n8n-only") {
      // Force N8N
      if (!n8n_webhook_url) {
        return NextResponse.json(
          { error: "n8n_webhook_url required for n8n-only mode" },
          { status: 400 }
        );
      }

      const n8nPayload = buildN8NPayload(manifest, n8n_webhook_url);
      const n8nResult = await sendToN8N(n8nPayload);

      result = {
        type: "n8n",
        webhook_url: n8n_webhook_url,
        success: n8nResult.success,
        response: n8nResult.response,
        error: n8nResult.error,
      };
    } else if (routing_preference === "hybrid") {
      // Hybrid routing with session context
      const hybridRoute = routeHybrid(manifest, phase);

      if (hybridRoute.sequence === "agent-first") {
        // Agent → N8N
        const task = await agentSwarm.submitTask(manifest, sessionContext);
        await waitForTask(task.id, 60000);
        const completedTask = agentSwarm.getTask(task.id);

        let n8nResult = null;
        if (hybridRoute.use_n8n && n8n_webhook_url) {
          const n8nPayload = buildN8NPayload(manifest, n8n_webhook_url);
          n8nPayload.payload.agent_result = completedTask?.result;
          n8nResult = await sendToN8N(n8nPayload);
        }

        result = {
          type: "hybrid-agent-first",
          agent_task_id: task.id,
          agent_result: completedTask?.result,
          n8n_result: n8nResult,
        };
      } else {
        // N8N → Agent (if needed)
        if (n8n_webhook_url) {
          const n8nPayload = buildN8NPayload(manifest, n8n_webhook_url);
          const n8nResult = await sendToN8N(n8nPayload);

          result = {
            type: "hybrid-n8n-first",
            n8n_result: n8nResult,
          };
        }
      }

      routing = hybridRoute;
    } else {
      // Auto routing
      const routingDecision = routeTask(manifest, phase);
      routing = routingDecision;

      if (routingDecision.destination === "agent-swarm") {
        const task = await agentSwarm.submitTask(manifest, sessionContext);

        // For immediate tasks, wait for completion
        if (priority.threshold === "immediate") {
          await waitForTask(task.id, 60000);
          const completedTask = agentSwarm.getTask(task.id);

          result = {
            type: "agent-swarm",
            task_id: task.id,
            session_id,
            status: completedTask?.status,
            result: completedTask?.result,
          };
        } else {
          result = {
            type: "agent-swarm",
            task_id: task.id,
            session_id,
            status: "queued",
            message: "Task queued for processing",
          };
        }
      } else {
        // Route to N8N
        if (!n8n_webhook_url) {
          return NextResponse.json(
            {
              error:
                "Task routed to N8N but n8n_webhook_url not provided. Set routing_preference=agent-only to force agent processing.",
            },
            { status: 400 }
          );
        }

        const n8nPayload = buildN8NPayload(manifest, n8n_webhook_url);
        const n8nResult = await sendToN8N(n8nPayload);

        result = {
          type: "n8n",
          webhook_url: n8n_webhook_url,
          success: n8nResult.success,
          response: n8nResult.response,
          error: n8nResult.error,
        };
      }
    }

    // Save execution artifact
    if (project_id && result.result) {
      await saveArtifact(
        project_id,
        "pal_config",
        `Execution ${manifest.manifestId}`,
        JSON.stringify(result, null, 2)
      ).catch((err) => console.error("Failed to save artifact:", err));
    }

    // Build response with session and streaming info
    const response: Record<string, unknown> = {
      manifest_id: manifest.manifestId,
      session_id,
      phase: phase.phase,
      priority: {
        score: priority.total,
        threshold: priority.threshold,
      },
      routing: routing || { destination: routing_preference },
      result,
      swarm_status: agentSwarm.getStatus(),
    };

    // Add streaming endpoint reference if requested or beneficial
    if (use_streaming || priority.threshold === "immediate") {
      response.streaming = {
        endpoint: "/api/swarm/stream",
        method: "POST",
        hint: "Use SSE streaming for real-time token output",
        payload_example: {
          user_input: "<your message>",
          session_id,
          agent_type_hint: manifest.runtime.agent_type,
          user_id,
          project_id,
        },
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Swarm webhook error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Get swarm status
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const taskId = url.searchParams.get("task_id");

  if (taskId) {
    const task = agentSwarm.getTask(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      task_id: taskId,
      status: task.status,
      phase: task.phase.phase,
      priority: task.priority,
      result: task.result,
      error: task.error,
      created_at: task.createdAt,
      started_at: task.startedAt,
      completed_at: task.completedAt,
    });
  }

  // Return overall swarm status
  return NextResponse.json(agentSwarm.getStatus());
}

/**
 * Helper: Wait for task completion
 */
async function waitForTask(
  taskId: string,
  timeoutMs: number = 60000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const task = agentSwarm.getTask(taskId);

    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    if (task.status === "completed" || task.status === "failed") {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Task ${taskId} timed out after ${timeoutMs}ms`);
}
