/**
 * POST /api/pal/build-routine
 * 
 * Production backend Prospect PAL Generator.
 * Compiles custom outbound workflows, tailored PAS copy, CRM shields, and agent skills.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateProspectPalRoutine } from "@/lib/prospect-pal-generator";
import type { GeneratorIntake, SectionToolSelection } from "@/lib/prospect-pal-generator";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const intake: Partial<GeneratorIntake> = body.intake || {};
    const tools: Partial<SectionToolSelection> = body.tools || {};

    const result = await generateProspectPalRoutine(intake, tools);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Backend Prospect PAL generator error:", error);
    const msg = error instanceof Error ? error.message : "Generator failed";
    return NextResponse.json(
      {
        success: false,
        error: msg,
      },
      { status: 500 }
    );
  }
}

