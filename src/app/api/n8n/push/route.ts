/**
 * POST /api/n8n/push
 * Pushes a generated workflow JSON directly into the user's n8n instance.
 * Requires: n8nUrl (e.g. https://myinstance.app.n8n.cloud), n8nApiKey, workflowJson
 */
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-supabase";

export const runtime = "nodejs";
export const maxDuration = 30;

interface N8nWorkflow {
  id?:    string;
  name?:  string;
  nodes?: unknown[];
  active?: boolean;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { n8nUrl?: string; n8nApiKey?: string; workflowJson?: string; workflowName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { n8nUrl, n8nApiKey, workflowJson, workflowName } = body;

  if (!n8nUrl || !n8nApiKey || !workflowJson) {
    return NextResponse.json({ error: "n8nUrl, n8nApiKey, and workflowJson are required" }, { status: 400 });
  }

  // Normalize base URL
  const base = n8nUrl.replace(/\/+$/, "");

  // Step 1: Validate credentials by listing workflows
  let testRes: Response;
  try {
    testRes = await fetch(`${base}/api/v1/workflows?limit=1`, {
      headers: {
        "X-N8N-API-KEY": n8nApiKey,
        "Content-Type":  "application/json",
      },
    });
  } catch (err) {
    return NextResponse.json({
      error: `Cannot reach n8n instance at ${base}. Check the URL and make sure it's publicly accessible.`,
    }, { status: 400 });
  }

  if (!testRes.ok) {
    const text = await testRes.text().catch(() => "");
    return NextResponse.json({
      error: testRes.status === 401
        ? "Invalid n8n API key — check Settings → API in your n8n instance"
        : `n8n returned ${testRes.status}: ${text.slice(0, 200)}`,
    }, { status: 400 });
  }

  // Step 2: Parse the workflow JSON
  let workflowData: N8nWorkflow;
  try {
    workflowData = JSON.parse(workflowJson);
  } catch {
    return NextResponse.json({ error: "Invalid workflow JSON — could not parse" }, { status: 400 });
  }

  // Step 3: Create the workflow in n8n
  const createPayload = {
    name:        workflowName || `Prospect PAL — ${new Date().toLocaleDateString()}`,
    nodes:       workflowData.nodes || [],
    connections: (workflowData as Record<string, unknown>).connections || {},
    settings:    { executionOrder: "v1" },
    active:      false,  // Start inactive — user activates manually after review
  };

  let createRes: Response;
  try {
    createRes = await fetch(`${base}/api/v1/workflows`, {
      method: "POST",
      headers: {
        "X-N8N-API-KEY": n8nApiKey,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify(createPayload),
    });
  } catch (err) {
    return NextResponse.json({
      error: `Failed to create workflow in n8n: ${err instanceof Error ? err.message : "Network error"}`,
    }, { status: 500 });
  }

  if (!createRes.ok) {
    const text = await createRes.text().catch(() => "");
    return NextResponse.json({
      error: `n8n rejected the workflow (${createRes.status}): ${text.slice(0, 300)}`,
    }, { status: 400 });
  }

  const created = await createRes.json() as N8nWorkflow;
  const workflowId = created.id;

  // Step 4: Return the workflow canvas URL
  const canvasUrl = `${base}/workflow/${workflowId}`;

  return NextResponse.json({
    success:    true,
    workflowId,
    workflowUrl: canvasUrl,
    nodeCount:  (createPayload.nodes as unknown[]).length,
    name:       createPayload.name,
    message:    `Workflow "${createPayload.name}" created in your n8n instance. Click "Open in n8n" to view the canvas.`,
  });
}

/**
 * GET /api/n8n/push
 * Test connectivity to a user's n8n instance.
 */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const n8nUrl    = searchParams.get("url");
  const n8nApiKey = searchParams.get("key");

  if (!n8nUrl || !n8nApiKey) {
    return NextResponse.json({ error: "url and key query params required" }, { status: 400 });
  }

  try {
    const base = n8nUrl.replace(/\/+$/, "");
    const res  = await fetch(`${base}/api/v1/workflows?limit=1`, {
      headers: { "X-N8N-API-KEY": n8nApiKey },
    });
    if (!res.ok) {
      return NextResponse.json({ connected: false, error: `HTTP ${res.status}` });
    }
    const data = await res.json() as { count?: number; data?: unknown[] };
    return NextResponse.json({
      connected:      true,
      workflowCount:  data.count ?? (data.data?.length ?? 0),
    });
  } catch (err) {
    return NextResponse.json({ connected: false, error: err instanceof Error ? err.message : "Connection failed" });
  }
}
