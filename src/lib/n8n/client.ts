/**
 * n8n API Client
 * REST API client for managing n8n workflows
 * Docs: https://docs.n8n.io/api/
 */

import type {
  N8nWorkflow,
  N8nExecution,
  N8nCredential,
  N8nApiResponse,
  N8nClientConfig,
} from "./types";

const DEFAULT_TIMEOUT = 30000;

export class N8nClient {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;

  constructor(config?: Partial<N8nClientConfig>) {
    this.baseUrl = (config?.baseUrl || process.env.N8N_BASE_URL || "").replace(/\/$/, "");
    this.apiKey = config?.apiKey || process.env.N8N_API_KEY || "";
    this.timeout = config?.timeout || DEFAULT_TIMEOUT;

    if (!this.baseUrl) {
      console.warn("N8nClient: N8N_BASE_URL not configured");
    }
    if (!this.apiKey) {
      console.warn("N8nClient: N8N_API_KEY not configured");
    }
  }

  private async request<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    body?: unknown
  ): Promise<T> {
    if (!this.baseUrl || !this.apiKey) {
      throw new Error("n8n not configured: missing N8N_BASE_URL or N8N_API_KEY");
    }

    const url = `${this.baseUrl}/api/v1${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "X-N8N-API-KEY": this.apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`n8n API error ${res.status}: ${error}`);
      }

      return res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`n8n API timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Check if n8n is configured and reachable
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.request<{ status: string }>("GET", "/workflows?limit=1");
      return true;
    } catch {
      return false;
    }
  }

  // =========================================================================
  // WORKFLOWS
  // =========================================================================

  /**
   * List all workflows
   */
  async listWorkflows(options?: {
    active?: boolean;
    limit?: number;
    cursor?: string;
  }): Promise<N8nApiResponse<N8nWorkflow[]>> {
    const params = new URLSearchParams();
    if (options?.active !== undefined) params.set("active", String(options.active));
    if (options?.limit) params.set("limit", String(options.limit));
    if (options?.cursor) params.set("cursor", options.cursor);

    const query = params.toString();
    return this.request("GET", `/workflows${query ? `?${query}` : ""}`);
  }

  /**
   * Get a workflow by ID
   */
  async getWorkflow(id: string): Promise<N8nWorkflow> {
    return this.request("GET", `/workflows/${id}`);
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(workflow: Omit<N8nWorkflow, "id" | "createdAt" | "updatedAt">): Promise<N8nWorkflow> {
    return this.request("POST", "/workflows", workflow);
  }

  /**
   * Update an existing workflow
   */
  async updateWorkflow(id: string, workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow> {
    return this.request("PUT", `/workflows/${id}`, workflow);
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(id: string): Promise<void> {
    await this.request("DELETE", `/workflows/${id}`);
  }

  /**
   * Activate a workflow
   */
  async activateWorkflow(id: string): Promise<N8nWorkflow> {
    return this.request("PATCH", `/workflows/${id}`, { active: true });
  }

  /**
   * Deactivate a workflow
   */
  async deactivateWorkflow(id: string): Promise<N8nWorkflow> {
    return this.request("PATCH", `/workflows/${id}`, { active: false });
  }

  // =========================================================================
  // EXECUTIONS
  // =========================================================================

  /**
   * Execute a workflow manually
   */
  async executeWorkflow(id: string, inputData?: Record<string, unknown>): Promise<N8nExecution> {
    return this.request("POST", `/workflows/${id}/execute`, inputData ? { data: inputData } : undefined);
  }

  /**
   * Get execution by ID
   */
  async getExecution(id: string): Promise<N8nExecution> {
    return this.request("GET", `/executions/${id}`);
  }

  /**
   * List executions for a workflow
   */
  async listExecutions(workflowId: string, options?: {
    status?: "waiting" | "running" | "success" | "error";
    limit?: number;
  }): Promise<N8nApiResponse<N8nExecution[]>> {
    const params = new URLSearchParams();
    params.set("workflowId", workflowId);
    if (options?.status) params.set("status", options.status);
    if (options?.limit) params.set("limit", String(options.limit));

    return this.request("GET", `/executions?${params.toString()}`);
  }

  /**
   * Stop a running execution
   */
  async stopExecution(id: string): Promise<N8nExecution> {
    return this.request("POST", `/executions/${id}/stop`);
  }

  // =========================================================================
  // CREDENTIALS
  // =========================================================================

  /**
   * List credentials (names only, not secrets)
   */
  async listCredentials(): Promise<N8nApiResponse<N8nCredential[]>> {
    return this.request("GET", "/credentials");
  }

  // =========================================================================
  // HIGH-LEVEL HELPERS
  // =========================================================================

  /**
   * Deploy a workflow from JSON string
   * Creates new or updates existing based on name
   */
  async deployWorkflow(
    name: string,
    workflowJson: string,
    options?: { activate?: boolean }
  ): Promise<{ workflow: N8nWorkflow; created: boolean }> {
    let parsed: N8nWorkflow;
    try {
      parsed = JSON.parse(workflowJson);
    } catch {
      throw new Error("Invalid workflow JSON");
    }

    parsed.name = name;

    // Check if workflow with same name exists
    const existing = await this.listWorkflows();
    const match = existing.data.find((w) => w.name === name);

    let workflow: N8nWorkflow;
    let created = false;

    if (match?.id) {
      workflow = await this.updateWorkflow(match.id, parsed);
    } else {
      workflow = await this.createWorkflow(parsed);
      created = true;
    }

    if (options?.activate && workflow.id) {
      workflow = await this.activateWorkflow(workflow.id);
    }

    return { workflow, created };
  }

  /**
   * Deploy and run a workflow, returning execution result
   */
  async deployAndRun(
    name: string,
    workflowJson: string,
    inputData?: Record<string, unknown>
  ): Promise<{ workflow: N8nWorkflow; execution: N8nExecution }> {
    const { workflow } = await this.deployWorkflow(name, workflowJson, { activate: false });

    if (!workflow.id) {
      throw new Error("Workflow created but no ID returned");
    }

    const execution = await this.executeWorkflow(workflow.id, inputData);

    return { workflow, execution };
  }
}

// Singleton instance
let _client: N8nClient | null = null;

export function getN8nClient(config?: Partial<N8nClientConfig>): N8nClient {
  if (!_client || config) {
    _client = new N8nClient(config);
  }
  return _client;
}

export default N8nClient;
