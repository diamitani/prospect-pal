import { authenticate, safeEqual } from "./auth";
import { AGENT_SLUG, schemas, type Providers } from "./steps";
import type { Store } from "./types";

type Ctx = { userId: string; store: Store; providers: Providers };

export const MCP_TOOL_DEFINITIONS = [
  {
    name: "identify_signals",
    step: "01",
    phase: "Phase 1: Identification & Targeting",
    title: "Step 01: Identify Signals & ICP",
    description:
      "Step 01 of the Prospect Outreach Workflow: define the ICP and the external/internal buying signals that start the workflow.",
    gatedByHumanApproval: false,
    inputSchema: {
      type: "object",
      required: ["icp"],
      properties: {
        icp: { type: "string", description: "Who your ideal customer is" },
        signalSources: {
          type: "array",
          items: { type: "string" },
          description: "External or internal systems that show a signal (e.g. funding, hiring, platform migrations)",
        },
        workflowOrigin: {
          type: "string",
          enum: ["static_icp", "search_or_prompt", "another_workflow"],
          default: "static_icp",
        },
        searchQueries: { type: "array", items: { type: "string" } },
      },
    },
  },
  {
    name: "build_company_list",
    step: "02",
    phase: "Phase 1: Identification & Targeting",
    title: "Step 02: Target Companies",
    description:
      "Step 02: segment and isolate target accounts into a single structured list from a spreadsheet, CRM extraction, or dynamic webhook.",
    gatedByHumanApproval: false,
    inputSchema: {
      type: "object",
      required: ["source"],
      properties: {
        source: {
          type: "string",
          enum: ["spreadsheet", "crm", "webhook"],
          description: "Spreadsheet, CRM view or dynamic webhook",
        },
        companies: {
          type: "array",
          items: {
            type: "object",
            required: ["name"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              signals: { type: "array", items: { type: "string" } },
            },
          },
        },
        crmFilter: { type: "string" },
      },
    },
  },
  {
    name: "find_contacts",
    step: "03",
    phase: "Phase 2: Sourcing & Intelligence",
    title: "Step 03: Contact Information",
    description:
      "Step 03: locate key decision-makers via public search + email syntax + MX record verification, data enrichment platforms (Clay, ZoomInfo, Apollo), or pre-acquired lead lists.",
    gatedByHumanApproval: false,
    inputSchema: {
      type: "object",
      required: ["method", "personas"],
      properties: {
        method: {
          type: "string",
          enum: ["search_syntax_mx", "enrichment_platform", "pre_acquired_list"],
        },
        personas: {
          type: "array",
          items: { type: "string" },
          description: "Target buyer titles, e.g. ['VP Sales', 'Head of Growth']",
        },
        enrichmentProvider: {
          type: "string",
          enum: ["clay", "zoominfo", "apollo", "other"],
        },
      },
    },
  },
  {
    name: "research_prospect",
    step: "04",
    phase: "Phase 2: Sourcing & Intelligence",
    title: "Step 04: Deep Research",
    description:
      "Step 04: build the 6-part intelligence brief (company overview, prospect overview, induced signals, deduced signals, products, value proposition).",
    gatedByHumanApproval: false,
    inputSchema: {
      type: "object",
      required: ["company", "prospect", "yourProducts", "valueProposition"],
      properties: {
        company: { type: "string" },
        domain: { type: "string" },
        prospect: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
            title: { type: "string" },
            linkedinUrl: { type: "string" },
          },
        },
        yourProducts: { type: "string" },
        valueProposition: { type: "string" },
        knownSignals: { type: "array", items: { type: "string" } },
      },
    },
  },
  {
    name: "write_email",
    step: "05",
    phase: "Phase 3: Messaging & Execution",
    title: "Step 05: Personalized Email Copy",
    description:
      "Step 05: write either Delivery Framework A (full_email with greeting, body, sign-off) or Delivery Framework B (body_only modular CRM token).",
    gatedByHumanApproval: false,
    inputSchema: {
      type: "object",
      required: ["brief", "format"],
      properties: {
        brief: { type: "object" },
        format: { type: "string", enum: ["full_email", "body_only"] },
        tone: { type: "string" },
        firstName: { type: "string" },
        signature: { type: "string" },
      },
    },
  },
  {
    name: "enroll_outreach",
    step: "06",
    phase: "Phase 3: Messaging & Execution",
    title: "Step 06: Connect & Enroll",
    description:
      "Step 06: send via direct mailbox connection or sequencing platform (Smartlead, Outreach, HubSpot Sales). Gated by human approval.",
    gatedByHumanApproval: true,
    inputSchema: {
      type: "object",
      required: ["route"],
      properties: {
        route: { type: "string", enum: ["mailbox_direct", "sequencer"] },
        sequencerId: { type: "string" },
        contacts: {
          type: "array",
          items: {
            type: "object",
            required: ["email", "body"],
            properties: {
              email: { type: "string" },
              firstName: { type: "string" },
              subject: { type: "string" },
              body: { type: "string" },
            },
          },
        },
        approvalId: {
          type: "string",
          description: "Pass the id of a human-approved request to send it",
        },
      },
    },
  },
  {
    name: "n8n_architect_and_deploy",
    step: "07",
    phase: "Phase 4: n8n Engineer & Workflow Architect",
    title: "n8n Architect & Deploy",
    description:
      "Powered by n8n-workflow-architect + n8n-engineer skills: compiles a 7-node workflow or @n8n/n8n-nodes-langchain.mcpTrigger server and deploys via X-N8N-API-KEY.",
    gatedByHumanApproval: false,
    inputSchema: {
      type: "object",
      required: ["intent"],
      properties: {
        intent: { type: "string" },
        surface: {
          type: "string",
          enum: [
            "instance_mcp",
            "mcp_server_trigger",
            "mcp_client_tool",
            "standard_workflow",
          ],
          default: "mcp_server_trigger",
        },
        integrations: { type: "array", items: { type: "string" } },
        n8nInstanceUrl: { type: "string" },
        deployMode: {
          type: "string",
          enum: ["spec_and_json", "live_deploy"],
          default: "spec_and_json",
        },
      },
    },
  },
  {
    name: "n8n_inspect_executions",
    step: "08",
    phase: "Phase 4: n8n Execution Analyst",
    title: "n8n Execution Analyst (Read-Only Telemetry)",
    description:
      "Powered by n8n-execution-analyst skill: connects read-only to n8n via X-N8N-API-KEY, diagnoses stop-nodes (429 rate_limit, 401 auth, timeout), flags 26h stalled workflows, and answers plain-English queries grounded in execution IDs.",
    gatedByHumanApproval: false,
    inputSchema: {
      type: "object",
      properties: {
        question: { type: "string", default: "snapshot" },
        executionId: { type: "string" },
        workflowId: { type: "string" },
        n8nInstanceUrl: { type: "string" },
      },
    },
  },
  {
    name: "composio_connect_integration",
    step: "09",
    phase: "Phase 4: Composio & Stack Integrations",
    title: "Composio OAuth & Stack Credential Bridge",
    description:
      "Connects or inspects GTM stack integrations (Apollo, HubSpot, Salesforce, Twenty, Slack, Gmail, LinkedIn) via Composio OAuth, n8n named credentials, or MCP ENV bindings.",
    gatedByHumanApproval: false,
    inputSchema: {
      type: "object",
      properties: {
        appId: {
          type: "string",
          enum: [
            "apollo",
            "twenty",
            "hubspot",
            "salesforce",
            "slack",
            "gmail",
            "linkedin",
          ],
          default: "hubspot",
        },
        mode: {
          type: "string",
          enum: ["status", "initiate_oauth", "mcp_credential_spec"],
          default: "status",
        },
        userId: { type: "string" },
      },
    },
  },
] as const;

const textResult = (value: unknown, isError = false) => ({
  content: [
    {
      type: "text" as const,
      text: typeof value === "string" ? value : JSON.stringify(value, null, 2),
    },
  ],
  ...(isError ? { isError: true } : {}),
});

export async function executeMcpToolCall(
  ctx: Ctx,
  toolName: string,
  rawArgs: unknown
) {
  const { userId, store, providers } = ctx;

  // License check on every tool call
  if (!(await store.hasEntitlement(userId, AGENT_SLUG))) {
    await store.logUsage({ userId, toolName, ok: false });
    return textResult(
      `No active license for ${AGENT_SLUG}. Purchase or activate your entitlement first.`,
      true
    );
  }

  try {
    if (toolName === "identify_signals") {
      const args = schemas.identify_signals.parse(rawArgs);
      const out = await providers.identifySignals(args);
      await store.logUsage({ userId, toolName, ok: true });
      return textResult(out);
    }

    if (toolName === "build_company_list") {
      const args = schemas.build_company_list.parse(rawArgs);
      const out = await providers.buildCompanyList(args);
      await store.logUsage({ userId, toolName, ok: true });
      return textResult(out);
    }

    if (toolName === "find_contacts") {
      const args = schemas.find_contacts.parse(rawArgs);
      const out = await providers.findContacts(args);
      await store.logUsage({ userId, toolName, ok: true });
      return textResult(out);
    }

    if (toolName === "research_prospect") {
      const args = schemas.research_prospect.parse(rawArgs);
      const out = await providers.researchProspect(args);
      await store.logUsage({ userId, toolName, ok: true });
      return textResult(out);
    }

    if (toolName === "write_email") {
      const args = schemas.write_email.parse(rawArgs);
      const out = await providers.writeEmail(args);
      await store.logUsage({ userId, toolName, ok: true });
      return textResult(out);
    }

    if (toolName === "enroll_outreach") {
      const args = schemas.enroll_outreach.parse(rawArgs);

      if (!args.approvalId) {
        if (!args.contacts?.length) {
          await store.logUsage({ userId, toolName, ok: false });
          return textResult(
            "contacts is required when creating an approval request.",
            true
          );
        }
        if (args.route === "sequencer" && !args.sequencerId) {
          await store.logUsage({ userId, toolName, ok: false });
          return textResult(
            "sequencerId is required when route is sequencer.",
            true
          );
        }

        const payload = {
          route: args.route,
          sequencerId: args.sequencerId,
          contacts: args.contacts,
        };
        const approval = await store.createApproval({
          userId,
          agentSlug: AGENT_SLUG,
          toolName: "enroll_outreach",
          input: payload,
        });
        await store.logUsage({ userId, toolName, ok: true });
        return textResult({
          status: "pending_approval",
          approvalId: approval.id,
          contactsStaged: args.contacts.length,
          route: args.route,
          next: `Wait for a human to approve request ${approval.id}, then call enroll_outreach again with approvalId: "${approval.id}".`,
        });
      }

      const approval = await store.getApproval(args.approvalId);
      if (!approval || approval.userId !== userId) {
        await store.logUsage({ userId, toolName, ok: false });
        return textResult("Approval not found.", true);
      }
      if (approval.status === "pending") {
        await store.logUsage({ userId, toolName, ok: true });
        return textResult({
          status: "pending_approval",
          approvalId: approval.id,
          next: "Still waiting for human approval.",
        });
      }
      if (approval.status === "rejected") {
        await store.logUsage({ userId, toolName, ok: false });
        return textResult("This outreach was rejected by the reviewer.", true);
      }
      if (!(await store.markApprovalExecuted(approval.id))) {
        await store.logUsage({ userId, toolName, ok: false });
        return textResult("This approval has already been used.", true);
      }

      // Run the exact payload that was approved, ignoring anything passed on the second call.
      const approvedInput = approval.input as {
        route: "mailbox_direct" | "sequencer";
        sequencerId?: string;
        contacts: Array<{
          email: string;
          firstName?: string;
          subject?: string;
          body: string;
        }>;
      };
      const result = await providers.enroll(approvedInput);
      await store.logUsage({ userId, toolName, ok: true });
      return textResult({
        status: "sent",
        approvalId: approval.id,
        result,
      });
    }

    if (toolName === "n8n_architect_and_deploy") {
      const args = schemas.n8n_architect_and_deploy.parse(rawArgs);
      const out = await providers.n8nArchitectAndDeploy(args);
      await store.logUsage({ userId, toolName, ok: true });
      return textResult(out);
    }

    if (toolName === "n8n_inspect_executions") {
      const args = schemas.n8n_inspect_executions.parse(rawArgs);
      const out = await providers.n8nInspectExecutions(args);
      await store.logUsage({ userId, toolName, ok: true });
      return textResult(out);
    }

    if (toolName === "composio_connect_integration") {
      const args = schemas.composio_connect_integration.parse(rawArgs);
      const out = await providers.composioConnectIntegration(args);
      await store.logUsage({ userId, toolName, ok: true });
      return textResult(out);
    }

    await store.logUsage({ userId, toolName, ok: false });
    return textResult(`Unknown tool: ${toolName}`, true);
  } catch (err) {
    await store.logUsage({ userId, toolName, ok: false });
    return textResult(
      err instanceof Error ? err.message : "Tool execution failed",
      true
    );
  }
}

const json = (
  body: unknown,
  status: number,
  headers: Record<string, string> = {}
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });

/**
 * POST /api/mcp: Streamable HTTP JSON-RPC 2.0 MCP front door.
 * Stateless per request so it runs on Vercel Serverless and Cloudflare Workers.
 */
export async function handleMcp(
  req: Request,
  deps: { store: Store; providers: Providers }
): Promise<Response> {
  const auth = await authenticate(req, deps.store);
  if (!auth.ok) {
    return json(
      { error: "Missing or invalid API key" },
      401,
      { "www-authenticate": 'Bearer realm="salesgency"' }
    );
  }

  const body = (await req.json().catch(() => null)) as {
    jsonrpc?: string;
    id?: string | number | null;
    method?: string;
    params?: Record<string, unknown>;
  } | null;

  if (!body || typeof body !== "object") {
    return json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error" },
      },
      400
    );
  }

  const id = body.id ?? 1;
  const method = body.method;

  if (method === "initialize") {
    return json(
      {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: {
            name: "salesgency-prospect-outreach",
            version: "1.0.0",
          },
        },
      },
      200
    );
  }

  if (method === "notifications/initialized" || method === "ping") {
    return json({ jsonrpc: "2.0", id, result: {} }, 200);
  }

  if (method === "tools/list") {
    return json(
      {
        jsonrpc: "2.0",
        id,
        result: {
          tools: MCP_TOOL_DEFINITIONS.map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
          })),
        },
      },
      200
    );
  }

  if (method === "tools/call") {
    const params = (body.params ?? {}) as {
      name?: string;
      arguments?: unknown;
    };
    if (!params.name) {
      return json(
        {
          jsonrpc: "2.0",
          id,
          error: { code: -32602, message: "Missing tool name" },
        },
        400
      );
    }
    const result = await executeMcpToolCall(
      { userId: auth.userId, store: deps.store, providers: deps.providers },
      params.name,
      params.arguments ?? {}
    );
    return json({ jsonrpc: "2.0", id, result }, 200);
  }

  return json(
    {
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Method not found: ${String(method)}` },
    },
    404
  );
}

/**
 * POST /api/approvals/:id with {"decision":"approved"|"rejected"}.
 * Called by the operator dashboard or Slack webhook, protected by APPROVAL_SECRET.
 */
export async function handleApproval(
  req: Request,
  id: string,
  deps: { store: Store; secret?: string }
): Promise<Response> {
  const secret =
    deps.secret ??
    process.env.APPROVAL_SECRET ??
    "salesgency-operator-approval-secret-2026";
  const given = req.headers.get("x-approval-secret") ?? "";
  if (!secret || secret.length < 16 || !safeEqual(given, secret)) {
    return json({ error: "Forbidden" }, 403);
  }

  const body = (await req.json().catch(() => null)) as {
    decision?: string;
  } | null;
  if (body?.decision !== "approved" && body?.decision !== "rejected") {
    return json({ error: 'decision must be "approved" or "rejected"' }, 400);
  }
  const row = await deps.store.decideApproval(id, body.decision);
  if (!row) {
    return json({ error: "Approval not found or already decided" }, 409);
  }
  return json({ id: row.id, status: row.status, decidedAt: row.decidedAt }, 200);
}

