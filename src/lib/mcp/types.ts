export type ApiKeyRecord = {
  id: string;
  userId: string;
  keyHash: string;
  keyPrefix: string;
  name: string;
  revokedAt: string | null;
};

export type ApprovalStatus = "pending" | "approved" | "rejected" | "executed";

export type ApprovalRecord = {
  id: string;
  userId: string;
  agentSlug: string;
  toolName: string;
  input: unknown;
  status: ApprovalStatus;
  createdAt?: string;
  decidedAt?: string | null;
};

/** Everything the ROSTR MCP kit needs from a database. Supabase for production, in-memory for local/tests. */
export interface Store {
  findApiKeyByHash(hash: string): Promise<ApiKeyRecord | null>;
  touchApiKey(id: string): Promise<void>;
  insertApiKey(rec: {
    userId: string;
    keyHash: string;
    keyPrefix: string;
    name: string;
  }): Promise<ApiKeyRecord>;
  hasEntitlement(userId: string, agentSlug: string): Promise<boolean>;
  grantEntitlement(userId: string, agentSlug: string): Promise<void>;
  createApproval(a: {
    userId: string;
    agentSlug: string;
    toolName: string;
    input: unknown;
  }): Promise<ApprovalRecord>;
  getApproval(id: string): Promise<ApprovalRecord | null>;
  listApprovals?(userId?: string): Promise<ApprovalRecord[]>;
  /** Only moves a pending approval. Returns null if it was not pending. */
  decideApproval(
    id: string,
    decision: "approved" | "rejected"
  ): Promise<ApprovalRecord | null>;
  /** Only moves an approved approval to executed. Returns false if it was not approved (blocks double use). */
  markApprovalExecuted(id: string): Promise<boolean>;
  logUsage(e: { userId: string; toolName: string; ok: boolean }): Promise<void>;
}

