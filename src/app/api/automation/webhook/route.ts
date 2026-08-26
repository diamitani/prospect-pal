/**
 * POST /api/automation/webhook
 * External webhook trigger for automation workflows
 */

import { NextRequest, NextResponse } from "next/server";
import {
  initializeWorkflow,
  WorkflowInputs,
  ToolStackConfig,
} from "@/lib/workflow-orchestrator";
import { executeAllSteps } from "@/lib/step-executor";

export const runtime = "nodejs";
export const maxDuration = 60; // 5 minutes for full workflow

interface WebhookPayload {
  company_name: string;
  campaign_title: string;
  campaign_icp: string;
  user_persona: string;
  company_product: string;
  company_background: string;
  target_signals: string;
  lead_source?: string;
  enrichment?: string[];
  crm?: string;
  sequencer?: string;
  approval_gate?: boolean;
  slack_notifications?: boolean;
  user_id?: string;
  project_id?: string;
  run_all_steps?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as WebhookPayload;

    // Map snake_case webhook fields to camelCase
    const inputs: WorkflowInputs = {
      companyName: body.company_name,
      campaignTitle: body.campaign_title,
      campaignIcp: body.campaign_icp,
      userPersona: body.user_persona,
      companyProduct: body.company_product,
      companyBackground: body.company_background,
      targetSignals: body.target_signals,
      toolStack: {
        leadSource: (body.lead_source || "apollo") as ToolStackConfig["leadSource"],
        enrichment: (body.enrichment || ["clay"]) as ToolStackConfig["enrichment"],
        crm: (body.crm || "hubspot") as ToolStackConfig["crm"],
        sequencer: (body.sequencer || "smartlead") as ToolStackConfig["sequencer"],
        approvalGate: body.approval_gate ?? true,
        slackNotifications: body.slack_notifications ?? true,
      },
    };

    // Validate required fields
    const requiredFields = [
      "company_name",
      "campaign_title",
      "campaign_icp",
      "user_persona",
      "company_product",
      "company_background",
      "target_signals",
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof WebhookPayload]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const userId = body.user_id || "webhook-user";

    // Initialize workflow
    const workflow = await initializeWorkflow(inputs, userId, body.project_id);

    // If run_all_steps is true, execute the full pipeline
    if (body.run_all_steps) {
      const results = await executeAllSteps(workflow.id);
      const finalResult = results[results.length - 1];

      return NextResponse.json({
        success: finalResult?.status === "success",
        workflowId: workflow.id,
        status: finalResult?.status === "success" ? "completed" : "failed",
        stepsCompleted: results.filter(r => r.status === "success").length,
        totalSteps: 12,
        results: results.map(r => ({
          step: r.step,
          name: r.name,
          status: r.status,
          duration: r.duration,
          error: r.error,
        })),
      });
    }

    // Otherwise just initialize and return
    return NextResponse.json({
      success: true,
      workflowId: workflow.id,
      status: "initialized",
      message: "Workflow created. Use the step endpoints to execute.",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed" },
      { status: 500 }
    );
  }
}
