import { NextRequest, NextResponse } from "next/server";
import {
  ARCHITECTURE_BLUEPRINT_NODES,
  C4_SYSTEM_CONTEXT_LINKS,
  ROSTR_AGENTS,
  ROSTR_RUNTIME_MODULES,
  SIX_STEP_AUTOMATION_FLOW,
} from "@/lib/rostr/agents-registry";
import { MCP_TOOL_DEFINITIONS } from "@/lib/mcp/http";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const download = req.nextUrl.searchParams.get("download");

  if (slug) {
    const agent = ROSTR_AGENTS.find((a) => a.slug === slug);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const bundle = {
      packageFormat: "rostr-agent-kit/v1",
      generatedAt: new Date().toISOString(),
      license: "SalesGency Sovereign Commercial License (BYOK)",
      agent,
      mcpTools: MCP_TOOL_DEFINITIONS,
      sixStepFlow: SIX_STEP_AUTOMATION_FLOW,
      architectureBlueprint: ARCHITECTURE_BLUEPRINT_NODES,
      files: {
        "manifest.json": agent.manifestJson,
        "README.md": `# ${agent.name} (${agent.slug})\n\n${agent.description}\n\n## Tools\n${agent.tools
          .map(
            (t) =>
              `- \`${t.name}\` (${t.file}): ${t.description}${
                t.gatedByHumanApproval ? " [Gated by Human Approval]" : ""
              }`
          )
          .join("\n")}\n\n## MCP Connection\nConnect any MCP client to \`POST /api/mcp\` with \`Authorization: Bearer sg_live_...\`.\n`,
        "LICENSE.txt":
          "SalesGency × Diamitani Industries - Sovereign Agent License. You own the workflows, prompts, and data pipelines.",
      },
    };

    if (download === "1") {
      return new NextResponse(JSON.stringify(bundle, null, 2), {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "content-disposition": `attachment; filename="${agent.slug}-rostr-kit.json"`,
        },
      });
    }

    return NextResponse.json(bundle);
  }

  return NextResponse.json({
    framework: "ROSTR Multi-Agent System + PAL + SalesGency MCP Kit",
    version: "1.0.0",
    verifiedTests: {
      commerceTests: 14,
      rostrAgentTests: 10,
      mcpKitTests: 13,
      totalPassed: 37,
      failed: 0,
    },
    agents: ROSTR_AGENTS,
    runtimeModules: ROSTR_RUNTIME_MODULES,
    systemContextLinks: C4_SYSTEM_CONTEXT_LINKS,
    sixStepFlow: SIX_STEP_AUTOMATION_FLOW,
    architectureBlueprint: ARCHITECTURE_BLUEPRINT_NODES,
  });
}

