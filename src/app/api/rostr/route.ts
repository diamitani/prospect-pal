import { NextRequest, NextResponse } from "next/server";
import { rostrWorkflow } from "@/lib/rostr/hub";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input, workspaceId = "default", intake } = body;

    if (!input) {
      return NextResponse.json(
        { error: "input required" },
        { status: 400 }
      );
    }

    console.log(`[ROSTR API] Processing: ${input.slice(0, 50)}...`);

    const result = await rostrWorkflow({ input, intake });

    console.log(`[ROSTR API] Complete: ${result.status}`);

    return NextResponse.json({
      success: result.status === "success",
      workspaceId,
      result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("[ROSTR API] Error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "ROSTR workflow failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    rostr: "active",
    models: process.env.OPENAI_API_KEY ? ["gpt-4o"] : ["bedrock-claude"],
    timestamp: new Date().toISOString(),
  });
}
