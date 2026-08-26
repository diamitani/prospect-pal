/**
 * GET /api/automation/[workflowId]/status
 * Get current workflow status and artifacts
 */

import { NextRequest, NextResponse } from "next/server";
import { getWorkflowStatus } from "@/lib/workflow-orchestrator";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  try {
    const { workflowId } = await params;

    const workflow = await getWorkflowStatus(workflowId);

    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const nextStep = workflow.currentStep < workflow.totalSteps ? workflow.currentStep + 1 : null;

    return NextResponse.json({
      id: workflow.id,
      projectId: workflow.projectId,
      userId: workflow.userId,
      status: workflow.status,
      currentStep: workflow.currentStep,
      totalSteps: workflow.totalSteps,
      progress: `${workflow.currentStep}/${workflow.totalSteps}`,
      progressPercent: Math.round((workflow.currentStep / workflow.totalSteps) * 100),
      inputs: {
        companyName: workflow.inputs.companyName,
        campaignTitle: workflow.inputs.campaignTitle,
        toolStack: workflow.inputs.toolStack,
      },
      stepResults: workflow.stepResults.map(r => ({
        step: r.step,
        name: r.name,
        status: r.status,
        duration: r.duration,
        timestamp: r.timestamp,
        error: r.error,
      })),
      artifacts: {
        hasWebhookConfig: !!workflow.artifacts.webhookConfig,
        hasBuildPlan: !!workflow.artifacts.buildPlan,
        hasEmailSequence: !!workflow.artifacts.emailSequence,
        hasWorkflowReport: !!workflow.artifacts.workflowReport,
        hasFinalN8nJson: !!workflow.artifacts.finalN8nJson,
      },
      urls: {
        nextStep: nextStep ? `${baseUrl}/api/automation/${workflowId}/step/${nextStep}` : null,
        resume: workflow.status === "paused" || workflow.status === "failed"
          ? `${baseUrl}/api/automation/${workflowId}/resume`
          : null,
        downloadN8n: workflow.artifacts.finalN8nJson
          ? `${baseUrl}/api/automation/${workflowId}/download/n8n`
          : null,
      },
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
      completedAt: workflow.completedAt,
    });
  } catch (error) {
    console.error("Error getting workflow status:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get status" },
      { status: 500 }
    );
  }
}
