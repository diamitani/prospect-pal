/**
 * POST /api/workflow/generate
 * Generates all workflow artifacts using DuckDuckGo AI
 */
import { NextRequest, NextResponse } from "next/server";
import {
  generateN8nJson,
  generateDeployGuide,
  generateEmailTemplate,
  generateBuildPrompts,
} from "@/lib/workflow-generator";
import type { WorkflowConfig, N8nNode } from "@/lib/workflow-generator";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { config, nodes } = await req.json() as {
      config: WorkflowConfig;
      nodes: N8nNode[];
    };

    if (!config || !nodes) {
      return NextResponse.json({ error: "config and nodes required" }, { status: 400 });
    }

    // Run all 4 artifact generators in parallel
    const [n8nJson, deployGuide, emailTemplate, buildPrompts] = await Promise.allSettled([
      generateN8nJson(config, nodes),
      generateDeployGuide(config),
      generateEmailTemplate(config),
      generateBuildPrompts(config),
    ]);

    return NextResponse.json({
      n8nJson:       n8nJson.status       === "fulfilled" ? n8nJson.value       : "// Generation failed — see logs",
      deployGuide:   deployGuide.status   === "fulfilled" ? deployGuide.value   : "# Deploy Guide\n\nSee documentation.",
      emailTemplate: emailTemplate.status === "fulfilled" ? emailTemplate.value : "Hi {{first_name}},\n\n...",
      buildPrompts:  buildPrompts.status  === "fulfilled" ? buildPrompts.value  : "# Build Prompts\n\nSee documentation.",
    });
  } catch (err) {
    console.error("Workflow generate error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
