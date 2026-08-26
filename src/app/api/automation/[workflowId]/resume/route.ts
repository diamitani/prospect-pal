/**
 * POST /api/automation/[workflowId]/resume
 * Resume a paused or failed workflow from the last successful step
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getWorkflowStatus,
  resumeWorkflow,
  getNextStep,
} from "@/lib/workflow-orchestrator";
import { executeStep, executeAllSteps } from "@/lib/step-executor";

export const runtime = "nodejs";
export const maxDuration = 300;

interface ResumeRequest {
  runAllRemaining?: boolean;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  try {
    const { workflowId } = await params;
    const body = await req.json().catch(() => ({})) as ResumeRequest;

    // Get workflow
    let workflow = await getWorkflowStatus(workflowId);
    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    // Check if workflow can be resumed
    if (workflow.status === "completed") {
      return NextResponse.json(
        { error: "Workflow already completed" },
        { status: 400 }
      );
    }

    if (workflow.status === "running") {
      return NextResponse.json(
        { error: "Workflow is already running" },
        { status: 400 }
      );
    }

    // Resume workflow
    workflow = await resumeWorkflow(workflowId);

    const nextStep = getNextStep(workflow);
    if (!nextStep) {
      return NextResponse.json(
        { error: "No steps remaining to execute" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // If runAllRemaining is true, execute all remaining steps
    if (body.runAllRemaining) {
      const results = await executeAllSteps(workflowId);
      const finalResult = results[results.length - 1];

      return NextResponse.json({
        success: finalResult?.status === "success",
        workflowId,
        status: finalResult?.status === "success" ? "completed" : "failed",
        stepsCompleted: results.filter(r => r.status === "success").length,
        totalSteps: workflow.totalSteps,
        results: results.map(r => ({
          step: r.step,
          name: r.name,
          status: r.status,
          duration: r.duration,
          error: r.error,
        })),
      });
    }

    // Otherwise execute just the next step
    const result = await executeStep(workflowId, nextStep);

    return NextResponse.json({
      success: result.status === "success",
      resumed: true,
      step: result.step,
      name: result.name,
      status: result.status,
      duration: result.duration,
      error: result.error,
      urls: {
        nextStep: result.status === "success" && nextStep < workflow.totalSteps
          ? `${baseUrl}/api/automation/${workflowId}/step/${nextStep + 1}`
          : null,
        status: `${baseUrl}/api/automation/${workflowId}/status`,
      },
    });
  } catch (error) {
    console.error("Error resuming workflow:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to resume workflow" },
      { status: 500 }
    );
  }
}
