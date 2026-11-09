import { DEMO_API_KEY, hashKey } from "./auth";
import { claudeProviders } from "./claude-provider";
import { AGENT_SLUG, stubProviders } from "./steps";
import { MemoryStore } from "./store.memory";
import { createSupabaseStore } from "./store.supabase";
import type { Store } from "./types";

function initMemoryStore(): MemoryStore {
  const mem = new MemoryStore();
  // Seed demo playground key so the vertical web workbench & MCP inspector work out of the box
  const demoUserId = "demo-operator-salesgency";
  void mem.insertApiKey({
    userId: demoUserId,
    keyHash: hashKey(DEMO_API_KEY),
    keyPrefix: DEMO_API_KEY.slice(0, 12),
    name: "Interactive Workbench & MCP Demo Key",
  });
  void mem.grantEntitlement(demoUserId, AGENT_SLUG);
  void mem.grantEntitlement(demoUserId, "n8n-engineer");
  void mem.grantEntitlement(demoUserId, "n8n-execution-analyst");
  void mem.grantEntitlement(demoUserId, "n8n-workflow-architect");
  void mem.grantEntitlement(demoUserId, "inbound-responder");
  void mem.grantEntitlement(demoUserId, "crm-hygiene");
  return mem;
}

const globalForMcp = globalThis as unknown as {
  __salesgencyMcpStore?: Store;
};

export const store: Store =
  globalForMcp.__salesgencyMcpStore ??
  (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createSupabaseStore()
    : initMemoryStore());

if (!globalForMcp.__salesgencyMcpStore) {
  globalForMcp.__salesgencyMcpStore = store;
}

export const providers = process.env.ANTHROPIC_API_KEY
  ? claudeProviders()
  : stubProviders;

