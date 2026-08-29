/**
 * n8n API Types
 * Based on n8n REST API v1
 */

export interface N8nWorkflow {
  id?: string;
  name: string;
  active: boolean;
  nodes: N8nWorkflowNode[];
  connections: Record<string, N8nConnection>;
  settings?: N8nWorkflowSettings;
  staticData?: Record<string, unknown>;
  tags?: N8nTag[];
  createdAt?: string;
  updatedAt?: string;
}

export interface N8nWorkflowNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, unknown>;
  credentials?: Record<string, { id: string; name: string }>;
  disabled?: boolean;
  notes?: string;
}

export interface N8nConnection {
  main: Array<Array<{ node: string; type: string; index: number }>>;
}

export interface N8nWorkflowSettings {
  executionOrder?: "v0" | "v1";
  saveDataErrorExecution?: "all" | "none";
  saveDataSuccessExecution?: "all" | "none";
  saveManualExecutions?: boolean;
  timezone?: string;
}

export interface N8nTag {
  id: string;
  name: string;
}

export interface N8nExecution {
  id: string;
  finished: boolean;
  mode: "manual" | "trigger" | "webhook" | "cli" | "internal";
  retryOf?: string;
  retrySuccessId?: string;
  startedAt: string;
  stoppedAt?: string;
  workflowId: string;
  workflowData: N8nWorkflow;
  data?: {
    resultData?: {
      runData?: Record<string, unknown>;
      error?: { message: string; stack?: string };
    };
  };
  status: "waiting" | "running" | "success" | "error" | "canceled";
}

export interface N8nCredential {
  id: string;
  name: string;
  type: string;
  nodesAccess?: Array<{ nodeType: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface N8nApiResponse<T> {
  data: T;
  nextCursor?: string;
}

export interface N8nApiError {
  message: string;
  code?: string;
  httpCode?: number;
}

export interface N8nClientConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
}
