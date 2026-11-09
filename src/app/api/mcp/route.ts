import { NextResponse } from "next/server";
import { DEMO_API_KEY } from "@/lib/mcp/auth";
import { handleMcp, MCP_TOOL_DEFINITIONS } from "@/lib/mcp/http";
import { providers, store } from "@/lib/mcp/runtime";
import { ROSTR_AGENTS, SIX_STEP_AUTOMATION_FLOW } from "@/lib/rostr/agents-registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/mcp: Streamable HTTP JSON-RPC 2.0 MCP Server
 * Compatible with Claude Code, Cursor, Antigravity, MCP Inspector, Cloudflare Workers, and the interactive workbench.
 */
export const POST = (req: Request) => handleMcp(req, { store, providers });

/**
 * GET /api/mcp: Discovery manifest for agent harnesses, App Store / Marketplace browsers, and documentation.
 */
export const GET = () =>
  NextResponse.json({
    name: "salesgency-prospect-outreach",
    version: "1.0.0",
    protocol: "Model Context Protocol (Streamable HTTP JSON-RPC 2.0)",
    endpoint: "/api/mcp",
    approvalsEndpoint: "/api/approvals/[id]",
    valueProposition: "1 ICP or buying signal to full 6-step autonomous outbound workflow",
    demoKeyHeader: `Authorization: Bearer ${DEMO_API_KEY}`,
    tools: MCP_TOOL_DEFINITIONS,
    workflowSteps: SIX_STEP_AUTOMATION_FLOW,
    agents: ROSTR_AGENTS.map((a) => ({
      slug: a.slug,
      name: a.name,
      version: a.version,
      humanApprovalGate: a.humanApprovalGate,
      tools: a.tools.map((t) => t.name),
    })),
    harnessConfigs: {
      claudeCodeAndCursor: {
        mcpServers: {
          "salesgency-outbound": {
            url: "https://prospect.salesgency.com/api/mcp",
            headers: {
              Authorization: "Bearer sg_live_YOUR_API_KEY",
            },
          },
        },
      },
      cloudflareWorkerOAuth: {
        provider: "@cloudflare/workers-oauth-provider",
        upstreamMcpUrl: "https://prospect.salesgency.com/api/mcp",
        note: "Wraps Streamable HTTP MCP with OAuth 2.1 for web-based Claude/ChatGPT connectors.",
      },
    },
  });

export const DELETE = () => new Response("Method not allowed", { status: 405 });

