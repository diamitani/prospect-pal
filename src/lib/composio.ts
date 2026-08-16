/**
 * Composio Integration Library
 * Wraps composio-core for server-side tool OAuth and action execution.
 * Used by: /api/composio/* routes + /api/workflow/generate agent.
 */

import { Composio, ComposioToolSet } from "composio-core";

export const runtime = "nodejs";

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

const COMPOSIO_API_KEY = process.env.COMPOSIO_API_KEY || "";

// Apps we support + their metadata
export const COMPOSIO_APPS = [
  {
    id:       "apollo",
    appName:  "apollo",
    name:     "Apollo",
    emoji:    "🏺",
    desc:     "250M+ contact database for lead search",
    category: "lead-source",
    color:    "#3B82F6",
  },
  {
    id:       "hubspot",
    appName:  "hubspot",
    name:     "HubSpot",
    emoji:    "🔶",
    desc:     "CRM sync, contact deduplication",
    category: "crm",
    color:    "#FF7A59",
  },
  {
    id:       "salesforce",
    appName:  "salesforce",
    name:     "Salesforce",
    emoji:    "☁️",
    desc:     "Enterprise CRM integration",
    category: "crm",
    color:    "#00A1E0",
  },
  {
    id:       "slack",
    appName:  "slack",
    name:     "Slack",
    emoji:    "💬",
    desc:     "Approval gate & daily summaries",
    category: "notifications",
    color:    "#4ADE80",
  },
  {
    id:       "gmail",
    appName:  "gmail",
    name:     "Gmail",
    emoji:    "📧",
    desc:     "Email sending fallback",
    category: "sequencer",
    color:    "#EA4335",
  },
  {
    id:       "linkedin",
    appName:  "linkedin",
    name:     "LinkedIn",
    emoji:    "💼",
    desc:     "Professional network prospecting",
    category: "lead-source",
    color:    "#0077B5",
  },
] as const;

export type ComposioAppId = typeof COMPOSIO_APPS[number]["id"];

// ---------------------------------------------------------------------------
// CLIENT FACTORIES
// ---------------------------------------------------------------------------

function getComposio(): Composio {
  if (!COMPOSIO_API_KEY) throw new Error("COMPOSIO_API_KEY not configured");
  return new Composio({ apiKey: COMPOSIO_API_KEY });
}

function getToolSet(entityId: string): ComposioToolSet {
  if (!COMPOSIO_API_KEY) throw new Error("COMPOSIO_API_KEY not configured");
  return new ComposioToolSet({ apiKey: COMPOSIO_API_KEY, entityId });
}

// ---------------------------------------------------------------------------
// CONNECTION MANAGEMENT
// ---------------------------------------------------------------------------

export interface ConnectionStatus {
  appId:     string;
  connected: boolean;
  accountId: string | null;
}

/** Return connection status for all supported apps for a given user */
export async function getConnectionStatuses(userId: string): Promise<ConnectionStatus[]> {
  try {
    const composio = getComposio();
    const entity   = composio.getEntity(userId);
    const connections: Awaited<ReturnType<typeof entity.getConnections>> =
      await entity.getConnections();

    return COMPOSIO_APPS.map((app) => {
      const conn = connections.find(
        (c: { appName?: string; status?: string }) =>
          c.appName?.toLowerCase() === app.appName.toLowerCase()
      );
      return {
        appId:     app.id,
        connected: !!conn,
        accountId: (conn as { id?: string } | undefined)?.id ?? null,
      };
    });
  } catch (err) {
    console.error("[composio] getConnectionStatuses failed:", err);
    // Return all disconnected on error
    return COMPOSIO_APPS.map((app) => ({ appId: app.id, connected: false, accountId: null }));
  }
}

/** Initiate OAuth connection flow — returns the URL to redirect user to */
export async function initiateConnection(
  appId: string,
  userId: string,
  redirectUrl: string
): Promise<{ redirectUrl: string } | { error: string }> {
  try {
    const app = COMPOSIO_APPS.find((a) => a.id === appId);
    if (!app) return { error: `Unknown app: ${appId}` };

    const composio = getComposio();
    const entity   = composio.getEntity(userId);

    const connectionRequest = await entity.initiateConnection({
      appName: app.appName,
      config: { redirectUrl },
    });

    // initiateConnection returns object with redirectUrl
    const url = (connectionRequest as { redirectUrl?: string }).redirectUrl;
    if (!url) return { error: "No redirect URL returned from Composio" };

    return { redirectUrl: url };
  } catch (err) {
    console.error("[composio] initiateConnection failed:", err);
    return { error: err instanceof Error ? err.message : "Connection initiation failed" };
  }
}

// ---------------------------------------------------------------------------
// ACTION EXECUTION (for agent tool calling)
// ---------------------------------------------------------------------------

/** Execute a Composio action on behalf of a user */
export async function executeComposioAction(
  action: string,
  params: Record<string, unknown>,
  userId: string
): Promise<{ data: unknown } | { error: string }> {
  try {
    const toolset = getToolSet(userId);
    const result = await toolset.executeAction({
      action,
      params,
      entityId: userId,
    });
    return { data: result };
  } catch (err) {
    console.error(`[composio] executeAction(${action}) failed:`, err);
    return { error: err instanceof Error ? err.message : "Action execution failed" };
  }
}

/** Get tools schema for a set of apps (for agent tool definitions) */
export async function getAppTools(
  appIds: string[],
  userId: string
): Promise<unknown[]> {
  try {
    const toolset = getToolSet(userId);
    const tools = await toolset.getToolsSchema({ apps: appIds });
    return tools;
  } catch (err) {
    console.error("[composio] getAppTools failed:", err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/** True if Composio API key is configured */
export const isComposioConfigured = (): boolean => !!COMPOSIO_API_KEY;
