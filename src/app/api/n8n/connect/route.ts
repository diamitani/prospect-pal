/**
 * VERCEL CONNECT - n8n Instance Integration
 * 
 * OAuth flow to connect user's self-hosted or cloud n8n instance.
 * Enables one-click deployment of generated workflows.
 */

import { NextRequest, NextResponse } from "next/server";

// n8n OAuth configuration
const N8N_CONFIG = {
  // Cloud n8n
  cloud: {
    authUrl: "https://app.n8n.cloud/oauth/authorize",
    tokenUrl: "https://app.n8n.cloud/oauth/token",
    apiBase: "https://app.n8n.cloud/api/v1",
  },
  // Self-hosted (user provides URL)
  selfHosted: {
    authUrl: "/oauth/authorize",
    tokenUrl: "/oauth/token", 
    apiBase: "/api/v1",
  }
};

// ============================================================================
// STEP 1: Initiate OAuth Connection
// GET /api/n8n/connect?instanceUrl=...
// ============================================================================

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const instanceUrl = searchParams.get("instanceUrl");
  
  if (!instanceUrl) {
    return NextResponse.json(
      { error: "instanceUrl required" },
      { status: 400 }
    );
  }

  // For demo purposes, return connection instructions
  // In production, this initiates OAuth flow
  return NextResponse.json({
    status: "oauth_required",
    instanceUrl,
    instructions: [
      "1. Go to your n8n instance Settings → API",
      "2. Create API key with 'Workflows:write' scope",
      "3. Paste key in Vercel Connect modal",
    ],
    manualConnect: {
      method: "POST",
      endpoint: "/api/n8n/connect",
      body: {
        instanceUrl,
        apiKey: "your-n8n-api-key",
      }
    }
  });
}

// ============================================================================
// STEP 2: Complete Connection (Manual for now)
// POST /api/n8n/connect
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const { instanceUrl, apiKey, workflowJson } = await req.json();

    if (!instanceUrl || !apiKey) {
      return NextResponse.json(
        { error: "instanceUrl and apiKey required" },
        { status: 400 }
      );
    }

    // Test connection to n8n
    const testRes = await fetch(`${instanceUrl}/api/v1/workflows`, {
      headers: {
        "X-N8N-API-KEY": apiKey,
        "Accept": "application/json",
      },
    });

    if (!testRes.ok) {
      return NextResponse.json(
        { error: "Invalid n8n credentials", details: await testRes.text() },
        { status: 401 }
      );
    }

    const workflows = await testRes.json();

    // If workflowJson provided, deploy it
    if (workflowJson) {
      const deployRes = await fetch(`${instanceUrl}/api/v1/workflows`, {
        method: "POST",
        headers: {
          "X-N8N-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workflowJson),
      });

      if (!deployRes.ok) {
        return NextResponse.json(
          { error: "Failed to deploy workflow", details: await deployRes.text() },
          { status: 500 }
        );
      }

      const deployed = await deployRes.json();

      return NextResponse.json({
        connected: true,
        instanceUrl,
        deployed: {
          id: deployed.id,
          name: deployed.name,
          url: `${instanceUrl}/workflow/${deployed.id}`,
        },
        existingWorkflows: workflows.data?.length || 0,
      });
    }

    // Connection test only
    return NextResponse.json({
      connected: true,
      instanceUrl,
      workflows: workflows.data?.length || 0,
      message: "Connection successful. POST with workflowJson to deploy.",
    });

  } catch (error) {
    console.error("[n8n Connect] Error:", error);
    return NextResponse.json(
      { error: "Connection failed", message: String(error) },
      { status: 500 }
    );
  }
}

// ============================================================================
// STEP 3: List/Activate Workflows
// PUT /api/n8n/connect
// ============================================================================

export async function PUT(req: NextRequest) {
  const { instanceUrl, apiKey, workflowId, active } = await req.json();

  try {
    const res = await fetch(`${instanceUrl}/api/v1/workflows/${workflowId}/activate`, {
      method: active ? "POST" : "DELETE",
      headers: { "X-N8N-API-KEY": apiKey },
    });

    return NextResponse.json({
      success: res.ok,
      workflowId,
      active,
    });

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// ============================================================================
// STEP 4: Download Workflow JSON
// For users who prefer manual import
// ============================================================================

export async function PATCH(req: NextRequest) {
  const { workflow } = await req.json();
  
  // Return as downloadable JSON
  return new Response(JSON.stringify(workflow, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${workflow.name || 'workflow'}.json"`,
    },
  });
}
