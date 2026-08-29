/**
 * AI Tools Registry
 * Type-safe tool definitions for AI agents using Vercel AI SDK Core
 */

import { z } from "zod";
import { tool } from "ai";
import {
  buildNodeSequence,
  generateN8nJson,
  generateDeployGuide,
  generateEmailTemplate,
  type WorkflowConfig,
} from "@/lib/workflow-generator";

/**
 * DuckDuckGo Instant Answer API - free, no key needed
 */
async function searchDuckDuckGo(query: string, maxResults = 5): Promise<{ title: string; url: string; snippet: string }[]> {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "ProspectPAL/1.0" },
    });

    if (!res.ok) throw new Error(`DDG search failed: ${res.status}`);

    const data = await res.json();
    const results: { title: string; url: string; snippet: string }[] = [];

    // Abstract (main result)
    if (data.Abstract && data.AbstractURL) {
      results.push({
        title: data.Heading || query,
        url: data.AbstractURL,
        snippet: data.Abstract,
      });
    }

    // Related topics
    if (data.RelatedTopics) {
      for (const topic of data.RelatedTopics.slice(0, maxResults - results.length)) {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(" - ")[0] || topic.Text.slice(0, 50),
            url: topic.FirstURL,
            snippet: topic.Text,
          });
        }
      }
    }

    // If no results, return a fallback
    if (results.length === 0) {
      results.push({
        title: `Results for: ${query}`,
        url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        snippet: `Search DuckDuckGo for more results on "${query}"`,
      });
    }

    return results.slice(0, maxResults);
  } catch (error) {
    console.error("DDG search error:", error);
    return [{
      title: `Search: ${query}`,
      url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      snippet: `Unable to fetch results. Try searching directly.`,
    }];
  }
}

export const webSearchTool = tool({
  description: "Search the web for current information about companies, industries, or topics",
  parameters: z.object({
    query: z.string().describe("Search query"),
    maxResults: z.number().optional().describe("Maximum results to return (default: 5)")
  }),
  execute: async ({ query, maxResults = 5 }: { query: string; maxResults?: number }) => {
    const results = await searchDuckDuckGo(query, maxResults);
    return { results };
  },
} as any);

export const generateN8nWorkflowTool = tool({
  description: "Generate n8n workflow JSON for prospect automation based on configuration",
  parameters: z.object({
    icp: z.string().describe("Ideal Customer Profile description"),
    crm: z.enum(["hubspot", "salesforce", "attio", "pipedrive", "none"]).describe("CRM system"),
    leadSource: z.enum(["apollo", "linkedin", "upload_csv", "hubspot_stage", "manual"]).optional().describe("Lead source"),
    sequencer: z.enum(["smartlead", "amplemarket", "instantly", "lemlist", "hubspot_seq"]).optional().describe("Email sequencer"),
    enrichment: z.array(z.enum(["clay", "hunter", "clearbit", "apollo_enrich"])).optional().describe("Enrichment tools"),
    approvalGate: z.boolean().optional().describe("Require human approval before sending"),
    slackAlerts: z.boolean().optional().describe("Send Slack notifications"),
  }),
  execute: async (args: {
    icp: string;
    crm: "hubspot" | "salesforce" | "attio" | "pipedrive" | "none";
    leadSource?: "apollo" | "linkedin" | "upload_csv" | "hubspot_stage" | "manual";
    sequencer?: "smartlead" | "amplemarket" | "instantly" | "lemlist" | "hubspot_seq";
    enrichment?: ("clay" | "hunter" | "clearbit" | "apollo_enrich")[];
    approvalGate?: boolean;
    slackAlerts?: boolean;
  }) => {
    const config: WorkflowConfig = {
      leadSource: args.leadSource || "apollo",
      enrichment: args.enrichment || ["clay"],
      crm: args.crm,
      sequencer: args.sequencer || "smartlead",
      approvalGate: args.approvalGate ?? true,
      slackAlerts: args.slackAlerts ?? true,
      icpPrompt: args.icp,
      companyUrls: [],
      companyPrompt: "",
    };

    const { nodes, connections } = buildNodeSequence(config);
    const [n8nJson, deployGuide, emailTemplate] = await Promise.all([
      generateN8nJson(config, nodes),
      generateDeployGuide(config),
      generateEmailTemplate(config),
    ]);

    return {
      workflow: {
        nodes,
        connections,
        n8nJson,
      },
      deployGuide,
      emailTemplate,
      config,
    };
  },
} as any);

export const updateWorkflowConfigTool = tool({
  description: "Update the user's workflow configuration (e.g. changing CRM, enabling Slack, setting lead source). The UI will instantly reflect these changes in the graph.",
  parameters: z.object({
    crm: z.enum(["hubspot", "salesforce", "attio", "pipedrive", "none"]).optional().describe("CRM system"),
    leadSource: z.enum(["apollo", "linkedin", "upload_csv", "hubspot_stage", "manual"]).optional().describe("Lead source"),
    sequencer: z.enum(["smartlead", "amplemarket", "instantly", "lemlist", "hubspot_seq"]).optional().describe("Email sequencer"),
    enrichment: z.array(z.enum(["clay", "hunter", "clearbit", "apollo_enrich"])).optional().describe("Enrichment tools"),
    approvalGate: z.boolean().optional().describe("Require human approval before sending"),
    slackAlerts: z.boolean().optional().describe("Send Slack notifications"),
  }),
  execute: async (args: any) => {
    // The server just echoes back the args so the client can intercept and apply them to local state.
    return {
      success: true,
      updatedFields: args,
      message: "Config updated successfully. The client UI will now re-render the graph.",
    };
  },
} as any);

export const tools = {
  webSearch: webSearchTool,
  generateN8nWorkflow: generateN8nWorkflowTool,
  updateWorkflowConfig: updateWorkflowConfigTool,
};

export function getAllTools() {
  return tools;
}
