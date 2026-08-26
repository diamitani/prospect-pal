/**
 * POST /api/automation/start
 * Initialize a new 11-step automation workflow
 */

import { NextRequest, NextResponse } from "next/server";
import {
  initializeWorkflow,
  WorkflowInputs,
  ToolStackConfig,
} from "@/lib/workflow-orchestrator";
import { executeStep } from "@/lib/step-executor";

export const runtime = "nodejs";
export const maxDuration = 120;

interface StartRequest {
  companyName: string;
  campaignTitle: string;
  campaignIcp: string;
  userPersona: string;
  companyProduct: string;
  companyBackground: string;
  targetSignals: string;
  toolStack?: Partial<ToolStackConfig>;
  projectId?: string;
  autoStart?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as StartRequest;
    const userId = req.headers.get("x-user-id") || "demo-user";

    // Validate required fields
    const requiredFields = [
      "companyName",
      "campaignTitle",
      "campaignIcp",
      "userPersona",
      "companyProduct",
      "companyBackground",
      "targetSignals",
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof StartRequest]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Build workflow inputs with defaults
    const inputs: WorkflowInputs = {
      companyName: body.companyName,
      campaignTitle: body.campaignTitle,
      campaignIcp: body.campaignIcp,
      userPersona: body.userPersona,
      companyProduct: body.companyProduct,
      companyBackground: body.companyBackground,
      targetSignals: body.targetSignals,
      toolStack: {
        leadSource: body.toolStack?.leadSource || "apollo",
        enrichment: body.toolStack?.enrichment || ["clay"],
        crm: body.toolStack?.crm || "hubspot",
        sequencer: body.toolStack?.sequencer || "smartlead",
        approvalGate: body.toolStack?.approvalGate ?? true,
        slackNotifications: body.toolStack?.slackNotifications ?? true,
      },
    };

    // Initialize workflow
    const workflow = await initializeWorkflow(inputs, userId, body.projectId);

    // Optionally auto-start first step
    if (body.autoStart) {
      await executeStep(workflow.id, 1);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json({
      success: true,
      workflowId: workflow.id,
      status: workflow.status,
      totalSteps: workflow.totalSteps,
      webhookUrl: `${baseUrl}/api/automation/webhook?workflowId=${workflow.id}`,
      statusUrl: `${baseUrl}/api/automation/${workflow.id}/status`,
      nextStepUrl: `${baseUrl}/api/automation/${workflow.id}/step/1`,
      message: body.autoStart
        ? "Workflow initialized and step 1 started"
        : "Workflow initialized. Call /step/1 to begin.",
    });
  } catch (error) {
    console.error("Error starting workflow:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start workflow" },
      { status: 500 }
    );
  }
}
