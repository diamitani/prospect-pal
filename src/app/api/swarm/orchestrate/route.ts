/**
 * Advanced Orchestration API
 * Sequential, Parallel, Fan-Out patterns
 */

import { NextRequest, NextResponse } from "next/server";
import { compilePAL } from "@/lib/rostr/pal-compiler";
import { agentSwarm } from "@/lib/rostr/agent-swarm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      pattern = "sequential", // "sequential" | "parallel" | "fan-out"
      tasks,
      project_id,
      user_id = "demo-user",
    } = body;

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { error: "tasks array is required" },
        { status: 400 }
      );
    }

    // Compile all task manifests
    const manifests = await Promise.all(
      tasks.map((task: any) =>
        compilePAL(
          task.user_input || task,
          project_id,
          user_id,
          task.context
        )
      )
    );

    let orchestration;

    switch (pattern) {
      case "sequential":
        orchestration = await agentSwarm.sequential(manifests);
        break;

      case "parallel":
        orchestration = await agentSwarm.parallel(manifests);
        break;

      case "fan-out":
        // Fan-out is just parallel execution
        orchestration = await agentSwarm.parallel(manifests);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown pattern: ${pattern}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      orchestration_id: orchestration.id,
      pattern: orchestration.pattern,
      status: orchestration.status,
      tasks: orchestration.tasks.map((t) => ({
        task_id: t.id,
        phase: t.phase.phase,
        priority: t.priority.total,
        status: t.status,
        result: t.result,
        error: t.error,
      })),
      created_at: orchestration.createdAt,
      completed_at: orchestration.completedAt,
    });
  } catch (error) {
    console.error("Orchestration error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
