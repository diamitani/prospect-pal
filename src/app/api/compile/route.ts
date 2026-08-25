import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { intakeData } = await req.json();

    if (!intakeData) {
      return NextResponse.json({ error: "Intake data is required" }, { status: 400 });
    }

    // 1. Master Agent Synthesis (GTM Architect + n8n Engineer)
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      system: `You are the Master Prospect Automation Engine Architect and n8n Systems Engineer.
Based on the user's intake, compile the full GTM production package.
Analyze the user's target ICP, CRM (HubSpot, Salesforce, etc.), Data Enrichment (Apollo, Clay, etc.), Outreach Sequencer (Smartlead, Instantly, etc.), and Trigger method.

Generate:
1. triggerType: 'spreadsheet' (for uploaded lead lists/CSV), 'schedule' (for daily cron polling CRM/data), or 'webhook' (for real-time intent webhooks).
2. prdOverview: A comprehensive GTM PRD markdown document explaining the 5-Pillar Architecture, ICP targeting rules, and data flow.
3. buildPrompt: A complete BUILD_PROMPT.md deploy guide with step-by-step instructions on importing to n8n and configuring credentials.
4. envTemplate: A complete .env.template file with placeholders for all required API keys and webhook secrets.
5. emailTemplate: A 3-sentence Problem-Agitate-Solve (PAS) email framework tailored with dynamic variable placeholders (e.g. {{first_name}}, {{company_name}}, {{pain_point}}).
6. resolvedBindings: An array of tool bindings describing which node type and auth method are bound for each capability (CRM, Data Enrichment, Sequencer, LLM, Alerts).
7. requiresConnection: An array of environment variable keys or credentials that must be configured (e.g. ['ENV:APOLLO_API_KEY', 'ENV:HUBSPOT_OAUTH']).`,
      prompt: `User Intake & Conversation History:\n${JSON.stringify(intakeData)}`,
      schema: z.object({
        triggerType: z.enum(["spreadsheet", "schedule", "webhook"]).describe("The ingestion trigger pattern"),
        prdOverview: z.string().describe("Complete GTM PRD overview in Markdown"),
        buildPrompt: z.string().describe("BUILD_PROMPT.md deploy guide in Markdown"),
        envTemplate: z.string().describe(".env.template file contents"),
        emailTemplate: z.string().describe("PAS cold email framework in Markdown"),
        resolvedBindings: z.array(
          z.object({
            capability: z.string().describe("e.g. crm-read-write, contact-enrichment, sequencer, llm-inference"),
            concreteBinding: z.string().describe("e.g. n8n-nodes-base.hubspot, HTTP Request to Clay"),
            authMode: z.string().describe("e.g. OAuth2, API Key, Header Auth"),
          })
        ),
        requiresConnection: z.array(z.string()).describe("List of required credential keys"),
      }),
    });

    // 2. Read the appropriate production template JSON
    const templateName = `prospect-automation-${object.triggerType}.json`;
    const templatePath = path.join(process.cwd(), "src/lib/templates", templateName);
    let baseN8nJson = "";
    try {
      baseN8nJson = await fs.readFile(templatePath, "utf-8");
    } catch (e) {
      console.warn(`Template ${templateName} not found, trying base template`);
      try {
        const fallbackPath = path.join(process.cwd(), "src/lib/templates/prospect-automation-template.json");
        baseN8nJson = await fs.readFile(fallbackPath, "utf-8");
      } catch {
        baseN8nJson = JSON.stringify({ error: "Template missing" });
      }
    }

    // 3. Assemble the structured Ack JSON Contract
    const projectId = `proj_${Math.random().toString(36).slice(2, 10)}`;
    const runId = `run_${Date.now()}`;

    const ackJson = {
      artifact_type: "pae-compile-ack",
      project_id: projectId,
      run_id: runId,
      status: "approved",
      trigger_type: object.triggerType,
      resolved_bindings: object.resolvedBindings,
      requires_connection: object.requiresConnection,
      workflow: {
        node_count: 9,
        preview_nodes: [
          object.triggerType === "spreadsheet"
            ? "Spreadsheet Webhook Ingest"
            : object.triggerType === "schedule"
            ? "Daily Cron Poller"
            : "Intent Webhook Stream",
          "Data Normalizer & Domain Sanitizer",
          "CRM Deduplication Shield",
          "Contact Reveal & Data Enrichment",
          "AI Research & PAS Copywriting",
          "Human Approval Switch",
          "CRM Contact Creation & Upsert",
          "Sequencer Outreach Enrollment",
          "Slack Notification & Review Alert",
        ],
      },
      next_actions: ["review_workflow", "copy_env", "deploy_to_n8n"],
    };

    return NextResponse.json({
      success: true,
      projectId,
      triggerType: object.triggerType,
      n8nJson: baseN8nJson,
      buildPrompt: object.buildPrompt,
      envTemplate: object.envTemplate,
      prdOverview: object.prdOverview,
      emailTemplate: object.emailTemplate,
      ackJson,
    });
  } catch (err) {
    console.error("Master Compile error:", err);
    return NextResponse.json({ error: "Failed to compile master workflow" }, { status: 500 });
  }
}
