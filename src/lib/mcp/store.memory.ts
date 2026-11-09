import { randomUUID } from "node:crypto";
import type { ApiKeyRecord, ApprovalRecord, Store } from "./types";

export class MemoryStore implements Store {
  private keys = new Map<string, ApiKeyRecord>();
  private entitlements = new Set<string>();
  private approvals = new Map<string, ApprovalRecord>();
  public usage: Array<{ userId: string; toolName: string; ok: boolean }> = [];

  async findApiKeyByHash(hash: string): Promise<ApiKeyRecord | null> {
    for (const k of this.keys.values()) {
      if (k.keyHash === hash) return k;
    }
    return null;
  }

  async touchApiKey(_id: string): Promise<void> {}

  async insertApiKey(rec: {
    userId: string;
    keyHash: string;
    keyPrefix: string;
    name: string;
  }): Promise<ApiKeyRecord> {
    const row: ApiKeyRecord = {
      id: randomUUID(),
      revokedAt: null,
      ...rec,
    };
    this.keys.set(row.id, row);
    return row;
  }

  revokeKey(id: string): void {
    const k = this.keys.get(id);
    if (k) k.revokedAt = new Date().toISOString();
  }

  async hasEntitlement(userId: string, agentSlug: string): Promise<boolean> {
    return this.entitlements.has(`${userId}:${agentSlug}`);
  }

  async grantEntitlement(userId: string, agentSlug: string): Promise<void> {
    this.entitlements.add(`${userId}:${agentSlug}`);
  }

  async createApproval(a: {
    userId: string;
    agentSlug: string;
    toolName: string;
    input: unknown;
  }): Promise<ApprovalRecord> {
    const row: ApprovalRecord = {
      id: `apr_${randomUUID().slice(0, 8)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      decidedAt: null,
      ...a,
    };
    this.approvals.set(row.id, row);
    return row;
  }

  async getApproval(id: string): Promise<ApprovalRecord | null> {
    return this.approvals.get(id) ?? null;
  }

  async listApprovals(userId?: string): Promise<ApprovalRecord[]> {
    const all = Array.from(this.approvals.values());
    return userId ? all.filter((a) => a.userId === userId) : all;
  }

  async decideApproval(
    id: string,
    decision: "approved" | "rejected"
  ): Promise<ApprovalRecord | null> {
    const row = this.approvals.get(id);
    if (!row || row.status !== "pending") return null;
    row.status = decision;
    row.decidedAt = new Date().toISOString();
    return row;
  }

  async markApprovalExecuted(id: string): Promise<boolean> {
    const row = this.approvals.get(id);
    if (!row || row.status !== "approved") return false;
    row.status = "executed";
    return true;
  }

  async logUsage(e: {
    userId: string;
    toolName: string;
    ok: boolean;
  }): Promise<void> {
    this.usage.push(e);
  }
}

