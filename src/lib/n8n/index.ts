/**
 * n8n Integration Module
 * Provides workflow management for Prospect PAL campaigns
 */

export { N8nClient, getN8nClient } from "./client";
export type {
  N8nWorkflow,
  N8nWorkflowNode,
  N8nConnection,
  N8nWorkflowSettings,
  N8nExecution,
  N8nCredential,
  N8nApiResponse,
  N8nClientConfig,
} from "./types";
