/**
 * POST /api/pal/generate
 * Runs the full 5-stage PAL pipeline and saves artifacts
 */
import { NextRequest, NextResponse } from "next/server";
import { runPalPipeline, PalInput } from "@/lib/pal-pipeline";
import { createProject, updateProject, saveArtifact } from "@/lib/dynamodb";
import { uploadArtifact } from "@/lib/s3";

export const runtime = "nodejs";
export const maxDuration = 60; // 2 min for full pipeline

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as PalInput & {
      projectId?: string;
      userId?: string;
      projectName?: string;
    };

    const { userDescription, selectedTools, existingContext, userId = "demo-user", projectName } = body;

    if (!userDescription) {
      return NextResponse.json({ error: "userDescription is required" }, { status: 400 });
    }

    // Create or use existing project
    let projectId = body.projectId;
    if (!projectId) {
      const project = await createProject(
        userId,
        projectName || `Campaign ${new Date().toLocaleDateString()}`,
        userDescription.slice(0, 200)
      );
      projectId = project.id;
    }

    // Run PAL pipeline
    const input: PalInput = { userDescription, selectedTools, existingContext };
    const output = await runPalPipeline(input);

    // Upload n8n JSON to S3
    let n8nS3Key: string | undefined;
    try {
      n8nS3Key = await uploadArtifact(
        projectId,
        "n8n_json",
        `prospect-pal-workflow-v1.json`,
        output.n8nWorkflowJson,
        "application/json"
      );
    } catch (s3Err) {
      console.warn("S3 upload failed (continuing):", s3Err);
    }

    // Save all artifacts to DynamoDB
    await Promise.allSettled([
      saveArtifact(projectId, "n8n_json",     "Workflow JSON",    output.n8nWorkflowJson,    n8nS3Key),
      saveArtifact(projectId, "skill_md",     "Skill Definition", output.skillDefinition),
      saveArtifact(projectId, "deploy_guide", "Deploy Guide",     output.deployGuide),
      saveArtifact(projectId, "build_prompt", "Build Prompts",    output.buildPrompts),
      saveArtifact(projectId, "pal_config",   "PAL Config",       JSON.stringify({ icpProfile: output.icpProfile, toolStack: output.toolStack }, null, 2)),
    ]);

    // Update project with output
    await updateProject(projectId, {
      icpConfig: output.icpProfile as unknown as Record<string, unknown>,
      toolStack: output.toolStack as unknown as Record<string, unknown>,
      palOutput: output as unknown as Record<string, unknown>,
      status: "configured",
    });

    return NextResponse.json({
      projectId,
      output: {
        icpProfile: output.icpProfile,
        toolStack: output.toolStack,
        systemInstructions: output.systemInstructions,
        n8nWorkflowJson: output.n8nWorkflowJson,
        skillDefinition: output.skillDefinition,
        deployGuide: output.deployGuide,
        buildPrompts: output.buildPrompts,
        emailFramework: output.emailFramework,
        palStages: output.palStages,
      },
      n8nS3Key,
    });
  } catch (error) {
    console.error("PAL generate error:", error);
    const msg = error instanceof Error ? error.message : "Pipeline failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
