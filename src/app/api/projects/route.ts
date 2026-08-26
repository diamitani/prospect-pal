/**
 * Projects API — CRUD via DynamoDB
 * GET  /api/projects        → list user projects
 * POST /api/projects        → create project
 * GET  /api/projects/[id]   → get single project
 */
import { NextRequest, NextResponse } from "next/server";
import { createProject, getProjectsByUser } from "@/lib/dynamodb";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id") || "demo-user";
  const projects = await getProjectsByUser(userId).catch(() => []);
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, icpConfig, toolStack } = await req.json() as {
      name: string;
      description?: string;
      icpConfig?: Record<string, unknown>;
      toolStack?: Record<string, unknown>;
    };
    const userId = req.headers.get("x-user-id") || "demo-user";
    const project = await createProject(userId, name || "New Campaign", description, icpConfig, toolStack);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
