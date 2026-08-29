/**
 * AI Tools Registry
 * Type-safe tool definitions for AI agents using Vercel AI SDK Core
 */

import { z } from "zod";
import { tool } from "ai";

export const webSearchTool = tool({
  description: "Search the web for current information",
  parameters: z.object({ query: z.string(), maxResults: z.number().optional() }),
  execute: async ({ query }: { query: string; maxResults?: number }) => {
    return { results: [`Search results for: ${query}`] };
  },
} as any);

export const generateN8nWorkflowTool = tool({
  description: "Generate n8n workflow JSON for prospect automation",
  parameters: z.object({ icp: z.string(), crm: z.string(), trigger: z.string() }),
  execute: async (args: { icp: string; crm: string; trigger: string }) => ({ workflow: { nodes: [], connections: {} } }),
} as any);

export const tools = {
  webSearch: webSearchTool,
  generateN8nWorkflow: generateN8nWorkflowTool,
};

export function getAllTools() {
  return tools;
}
