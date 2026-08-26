/**
 * POST /api/automation/[workflowId]/step/[stepNumber]
 * Execute a specific step in the workflow
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getWorkflowStatus,
  canExecuteStep,
  getStepName,
  TOTAL_STEPS,
} from "@/lib/workflow-orchestrator";
import { executeStep } from "@/lib/step-executor";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workflowId: string; stepNumber: string }> }
) {
  try {
    const { workflowId, stepNumber: stepStr } = await params;
    const stepNumber = parseInt(stepStr, 10);

    // Validate step number
    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > TOTAL_STEPS) {
      return NextResponse.json(
        { error: `Invalid step number. Must be between 1 and ${TOTAL_STEPS}` },
        { status: 400 }
      );
    }

    // Get workflow
    const workflow = await getWorkflowStatus(workflowId);
    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    // Check if step can be executed
    if (!canExecuteStep(workflow, stepNumber)) {
      const prevStep = stepNumber - 1;
      const prevResult = workflow.stepResults.find(r => r.step === prevStep);

      if (workflow.status === "completed") {
        return NextResponse.json(
          { error: "Workflow already completed" },
          { status: 400 }
        );
      }

      if (prevStep > 0 && prevResult?.status !== "success") {
        return NextResponse.json(
          {
            error: `Step ${stepNumber} cannot run. Step ${prevStep} (${getStepName(prevStep)}) must complete first.`,
            previousStep: {
              step: prevStep,
              name: getStepName(prevStep),
              status: prevResult?.status || "not started",
            },
          },
          { status: 400 }
        );
      }
    }

    // Execute the step
    const result = await executeStep(workflowId, stepNumber);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const nextStep = stepNumber < TOTAL_STEPS ? stepNumber + 1 : null;

    return NextResponse.json({
      success: result.status === "success",
      step: result.step,
      name: result.name,
      status: result.status,
      duration: result.duration,
      timestamp: result.timestamp,
      error: result.error,
      output: result.output,
      workflow: {
        id: workflowId,
        progress: `${stepNumber}/${TOTAL_STEPS}`,
        progressPercent: Math.round((stepNumber / TOTAL_STEPS) * 100),
        isComplete: stepNumber >= TOTAL_STEPS && result.status === "success",
      },
      urls: {
        nextStep: nextStep && result.status === "success"
          ? `${baseUrl}/api/automation/${workflowId}/step/${nextStep}`
          : null,
        status: `${baseUrl}/api/automation/${workflowId}/status`,
      },
    });
  } catch (error) {
    console.error("Error executing step:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to execute step" },
      { status: 500 }
    );
  }
}
