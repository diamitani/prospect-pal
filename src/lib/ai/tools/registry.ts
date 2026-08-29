/**
 * UNIFIED TOOL REGISTRY
 * Merges AI SDK + Composio + n8n tools
 */

import { z } from "zod";
import { queryComposio } from "@/lib/composio";

export const tools = {
  // AI Native
  webSearch: {
    description: "Search web for company/industry research",
    parameters: z.object({ query: z.string(), limit: z.number().optional() }),
    execute: async ({ query }: { query: string }) => {
      return { results: [`Search: ${query}`] };
    },
  },

  // Composio Integrations
  hubspotUpsert: {
    description: "Create/update contact in HubSpot",
    parameters: z.object({ email: z.string(), data: z.any() }),
    execute: async (params: any) => {
      return await queryComposio({ app: "hubspot", action: "create-or-update-contact", params });
    },
  },

  apolloSearch: {
    description: "Search Apollo.io for contacts",
    parameters: z.object({ domain: z.string(), titles: z.array(z.string()) }),
    execute: async (params: any) => {
      return await queryComposio({ app: "apollo", action: "people-search", params });
    },
  },

  smartleadEnroll: {
    description: "Enroll in Smartlead sequence",
    parameters: z.object({ email: z.string(), campaignId: z.string() }),
    execute: async (params: any) => {
      return await queryComposio({ app: "smartlead", action: "add-lead", params });
    },
  },

  slackNotify: {
    description: "Send Slack notification",
    parameters: z.object({ channel: z.string(), message: z.string() }),
    execute: async (params: any) => {
      return await queryComposio({ app: "slack", action: "send-message", params });
    },
  },

  // n8n
  generateWorkflow: {
    description: "Generate n8n workflow JSON",
    parameters: z.object({ gates: z.any(), name: z.string() }),
    execute: async ({ gates, name }: any) => {
      return {
        name,
        nodes: [
          { id: "1", name: "Trigger", type: "schedule", position: [0, 0] },
          { id: "2", name: gates.crm, type: gates.crm, position: [200, 0] },
        ],
        connections: {},
      };
    },
  },
};

export default tools;
