import { tool } from 'ai';
import { z } from 'zod';
import { generateN8nJson, buildNodeSequence, generateDeployGuide, generateEmailTemplate } from './workflow-generator';

/**
 * Agent tool definitions for Vercel AI SDK
 * These tools connect the LLM to the existing workflow generation infrastructure
 */

export const workflowTools = {
  compile_workflow: tool({
    description: 'Generate complete n8n workflow JSON from ICP and tool stack. Returns importable n8n JSON with configured nodes for trigger, enrichment, AI research, email generation, CRM sync, and sequence enrollment.',
    parameters: z.object({
      icpPrompt: z.string().describe('Ideal Customer Profile description (e.g., "Series A SaaS companies with 50-200 employees in DevOps space")'),
      companyUrls: z.array(z.string()).optional().describe('Optional array of target company URLs or domains'),
      companyPrompt: z.string().optional().describe('Additional context about the company or campaign'),
      leadSource: z.enum(['apollo', 'linkedin', 'upload_csv', 'hubspot_stage', 'manual']).describe('How leads enter the workflow'),
      enrichment: z.array(z.enum(['clay', 'hunter', 'clearbit', 'apollo_enrich'])).describe('Data enrichment tools to use'),
      crm: z.enum(['hubspot', 'salesforce', 'attio', 'pipedrive', 'none']).describe('CRM system for deduplication and syncing'),
      sequencer: z.enum(['smartlead', 'amplemarket', 'instantly', 'lemlist', 'hubspot_seq']).describe('Email sequence tool for outreach'),
      approvalGate: z.boolean().default(false).describe('Whether to require human approval before sending'),
      slackAlerts: z.boolean().default(false).describe('Whether to send Slack notifications'),
    }),
    execute: async (params) => {
      try {
        // Build node sequence from config
        const nodes = buildNodeSequence(params);

        // Generate n8n JSON using AI or fallback
        const workflowJson = await generateN8nJson(params, nodes);

        return {
          success: true,
          workflow: workflowJson,
          nodeCount: nodes.length,
          summary: `Generated ${nodes.length}-node workflow for ${params.icpPrompt}`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error during compilation',
        };
      }
    },
  }),

  extract_icp: tool({
    description: 'Extract and enhance ICP from user description. Returns structured ICP with industries, job titles, company size, pain points, and trigger events.',
    parameters: z.object({
      userDescription: z.string().describe('Raw user description of their target customer'),
    }),
    execute: async (params) => {
      try {
        // This would call PAL pipeline stages 1-3 when fully integrated
        // For now, return a structured format based on the description

        // Simple extraction logic (to be replaced with PAL pipeline)
        const description = params.userDescription.toLowerCase();

        return {
          success: true,
          icp: {
            industries: extractIndustries(description),
            companySize: extractCompanySize(description),
            jobTitles: extractJobTitles(description),
            geography: extractGeography(description),
            painPoints: extractPainPoints(description),
            triggerEvents: extractTriggers(description),
          },
          confidence: 0.8,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to extract ICP',
        };
      }
    },
  }),

  generate_deploy_guide: tool({
    description: 'Generate deployment guide for the n8n workflow. Returns step-by-step instructions for importing, configuring credentials, and testing the workflow.',
    parameters: z.object({
      workflowConfig: z.object({
        icpPrompt: z.string(),
        leadSource: z.string(),
        enrichment: z.array(z.string()),
        crm: z.string(),
        sequencer: z.string(),
      }),
    }),
    execute: async (params) => {
      try {
        const guide = generateDeployGuide(params.workflowConfig as any);
        return {
          success: true,
          guide,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to generate deploy guide',
        };
      }
    },
  }),

  generate_email_copy: tool({
    description: 'Generate PAS (Problem-Agitate-Solution) email template for the campaign. Returns email subject and body with personalization tokens.',
    parameters: z.object({
      icpPrompt: z.string().describe('Ideal Customer Profile'),
      product: z.string().describe('Product or service being sold'),
      valueProposition: z.string().describe('Main value proposition or benefit'),
    }),
    execute: async (params) => {
      try {
        const emailTemplate = generateEmailTemplate(params as any);
        return {
          success: true,
          template: emailTemplate,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to generate email copy',
        };
      }
    },
  }),

  configure_node: tool({
    description: 'Configure a specific n8n node with custom parameters. Returns the updated node configuration.',
    parameters: z.object({
      nodeType: z.enum(['trigger', 'enrichment', 'ai_research', 'email_generation', 'crm', 'sequencer', 'approval']).describe('Type of node to configure'),
      configuration: z.record(z.any()).describe('Node-specific configuration parameters'),
    }),
    execute: async (params) => {
      try {
        // Node configuration logic
        const nodeConfig = {
          type: params.nodeType,
          parameters: params.configuration,
          position: [0, 0], // Will be calculated during workflow assembly
        };

        return {
          success: true,
          node: nodeConfig,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to configure node',
        };
      }
    },
  }),
};

// Helper functions for ICP extraction (simple heuristics, to be replaced with PAL pipeline)

function extractIndustries(description: string): string[] {
  const industries: string[] = [];
  const industryKeywords = {
    'saas': ['saas', 'software', 'tech', 'technology'],
    'ecommerce': ['ecommerce', 'e-commerce', 'retail', 'online store'],
    'fintech': ['fintech', 'finance', 'banking', 'payments'],
    'healthcare': ['healthcare', 'medical', 'health', 'hospital'],
    'devops': ['devops', 'developer tools', 'infrastructure', 'cloud'],
  };

  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    if (keywords.some(kw => description.includes(kw))) {
      industries.push(industry);
    }
  }

  return industries.length > 0 ? industries : ['technology'];
}

function extractCompanySize(description: string): string {
  if (description.includes('enterprise') || description.includes('large')) return '1000+';
  if (description.includes('mid-market') || description.includes('medium')) return '200-1000';
  if (description.includes('startup') || description.includes('small')) return '10-200';
  if (description.includes('series a') || description.includes('series b')) return '50-500';
  return '50-500'; // default
}

function extractJobTitles(description: string): string[] {
  const titles: string[] = [];
  const titleKeywords = {
    'VP Engineering': ['vp engineering', 'vp of engineering', 'head of engineering'],
    'CTO': ['cto', 'chief technology officer'],
    'CEO': ['ceo', 'chief executive', 'founder'],
    'Head of Sales': ['head of sales', 'vp sales', 'sales director'],
    'CMO': ['cmo', 'chief marketing officer', 'vp marketing'],
  };

  for (const [title, keywords] of Object.entries(titleKeywords)) {
    if (keywords.some(kw => description.includes(kw))) {
      titles.push(title);
    }
  }

  return titles.length > 0 ? titles : ['VP Engineering', 'CTO', 'Head of Sales'];
}

function extractGeography(description: string): string {
  if (description.includes('us') || description.includes('united states') || description.includes('usa')) return 'United States';
  if (description.includes('europe') || description.includes('eu')) return 'Europe';
  if (description.includes('global') || description.includes('worldwide')) return 'Global';
  return 'United States'; // default
}

function extractPainPoints(description: string): string[] {
  // Simple extraction, to be replaced with AI-powered analysis
  return [
    'Manual prospecting is time-consuming',
    'Inconsistent outreach quality',
    'Low response rates',
    'Lack of personalization at scale',
  ];
}

function extractTriggers(description: string): string[] {
  // Simple extraction, to be replaced with AI-powered analysis
  return [
    'Funding announcement',
    'Executive hire',
    'Product launch',
    'Company expansion',
  ];
}
