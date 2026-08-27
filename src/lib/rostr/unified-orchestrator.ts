import { compilePAL, AgentManifest } from './pal-compiler';
import { classifyPhase, calculatePriority, PhaseClassification, PriorityScore } from './npao-classifier';
import { selectSkillForPhase, SkillName } from './skill-router';
import { loadSkill, Skill } from './skill-loader';
import { executeSkill, SkillResult } from './skill-executor';
import { generateN8nJson, buildNodeSequence } from '../workflow-generator';

/**
 * Unified PAL Orchestrator
 *
 * Connects all ROSTR components into a single orchestration pipeline:
 * User Input → PAL Compilation → NPAO Classification → Skill Loading →
 * Agent Execution → Workflow Compilation → n8n JSON Output
 *
 * This is the production-ready harness that finally makes the system work end-to-end.
 */

export interface UserInput {
  // Core campaign details
  icpPrompt: string;
  companyUrls?: string[];
  companyPrompt?: string;

  // Tool configuration
  leadSource: 'apollo' | 'linkedin' | 'upload_csv' | 'hubspot_stage' | 'manual';
  enrichment: ('clay' | 'hunter' | 'clearbit' | 'apollo_enrich')[];
  crm: 'hubspot' | 'salesforce' | 'attio' | 'pipedrive' | 'none';
  sequencer: 'smartlead' | 'amplemarket' | 'instantly' | 'lemlist' | 'hubspot_seq';

  // Workflow options
  approvalGate?: boolean;
  slackAlerts?: boolean;

  // Context
  productDescription?: string;
  valueProposition?: string;
}

export interface OrchestratorConfig {
  apiKey?: string; // BYOK: User's OpenRouter or Anthropic key
  timeout?: number; // Max execution time in ms
  enableSkillDelegation?: boolean; // Allow orchestrator to invoke sub-skills
  saveToDatabase?: boolean; // Persist orchestration state
  userId?: string; // For database persistence
}

export interface OrchestrationResult {
  // Core outputs
  workflow: any; // n8n JSON
  deployGuide: string;

  // Execution trace
  trace: {
    manifest: AgentManifest;
    phase: PhaseClassification;
    priority: PriorityScore;
    skill: SkillName;
    skillInstructions: string;
  };

  // Sub-skill results (if orchestrator was used)
  skillResults?: SkillResult;

  // Metadata
  executionTimeMs: number;
  tokensUsed?: {
    input: number;
    output: number;
    total: number;
  };
}

export class UnifiedPALOrchestrator {
  /**
   * Main orchestration pipeline
   *
   * Executes the full ROSTR flow from user input to n8n JSON workflow.
   */
  async orchestrate(
    userInput: UserInput,
    config: OrchestratorConfig = {}
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();

    // Stage 1: PAL Compilation
    // Transform natural language input into structured AgentManifest
    console.log('[Orchestrator] Stage 1: PAL Compilation');
    const manifest = await this.compilePALManifest(userInput);

    // Stage 2: NPAO Classification
    // Determine phase (PreD/Design/Development/Deployment/Debugging) and priority
    console.log('[Orchestrator] Stage 2: NPAO Classification');
    const phase = classifyPhase(manifest);
    const priority = calculatePriority(phase, manifest);

    // Stage 3: Skill Selection
    // Map NPAO phase to appropriate skill
    console.log('[Orchestrator] Stage 3: Skill Selection');
    const skillName = selectSkillForPhase(phase.phase);
    const skill = await loadSkill(skillName);

    // Stage 4: Agent Execution with Skill
    // Execute agent with skill instructions (with optional sub-skill delegation)
    console.log(`[Orchestrator] Stage 4: Agent Execution (${skillName})`);
    const skillResult = await executeSkill(skillName, manifest, {
      apiKey: config.apiKey,
      timeout: config.timeout,
      maxSubSkillDepth: config.enableSkillDelegation ? 1 : 0,
    });

    // Stage 5: Workflow Compilation
    // Generate n8n JSON from agent results
    console.log('[Orchestrator] Stage 5: Workflow Compilation');
    const workflow = await this.compileWorkflow(userInput, skillResult);

    // Stage 6: Generate Deploy Guide
    console.log('[Orchestrator] Stage 6: Deploy Guide Generation');
    const deployGuide = await this.generateDeployGuide(userInput, workflow);

    // Stage 7: Persist State (optional)
    if (config.saveToDatabase && config.userId) {
      await this.saveOrchestrationState(config.userId, {
        manifest,
        phase,
        priority,
        skill: skillName,
        skillResult,
        workflow,
      });
    }

    const executionTimeMs = Date.now() - startTime;

    return {
      workflow,
      deployGuide,
      trace: {
        manifest,
        phase,
        priority,
        skill: skillName,
        skillInstructions: skill.instructions,
      },
      skillResults: skillResult,
      executionTimeMs,
      tokensUsed: this.aggregateTokenUsage(skillResult),
    };
  }

  /**
   * Stage 1: Compile PAL Manifest
   */
  private async compilePALManifest(userInput: UserInput): Promise<AgentManifest> {
    // Construct natural language description for PAL compiler
    const description = `
User wants to build a prospect automation workflow with the following configuration:

ICP: ${userInput.icpPrompt}
${userInput.companyUrls ? `Target companies: ${userInput.companyUrls.join(', ')}` : ''}
${userInput.companyPrompt || ''}

Tool Stack:
- Lead source: ${userInput.leadSource}
- Enrichment: ${userInput.enrichment.join(', ')}
- CRM: ${userInput.crm}
- Sequencer: ${userInput.sequencer}

Workflow Options:
- Approval gate: ${userInput.approvalGate ? 'Yes' : 'No'}
- Slack alerts: ${userInput.slackAlerts ? 'Yes' : 'No'}

${userInput.productDescription ? `Product: ${userInput.productDescription}` : ''}
${userInput.valueProposition ? `Value Prop: ${userInput.valueProposition}` : ''}

Generate a complete n8n workflow JSON that automates prospect outreach for this ICP.
`.trim();

    // Compile using PAL Compiler
    const manifest = await compilePAL(description, {
      domain: 'automation',
      urgency: 'immediate',
    });

    return manifest;
  }

  /**
   * Stage 5: Compile Workflow from Agent Results
   */
  private async compileWorkflow(userInput: UserInput, skillResult: SkillResult): Promise<any> {
    // Build node sequence from config
    const nodes = buildNodeSequence(userInput);

    // If orchestrator skill was used, extract workflow from sub-skill results
    if (skillResult.subSkillResults) {
      const workflowSubSkill = skillResult.subSkillResults.get('prospect-pal-workflow');
      if (workflowSubSkill && workflowSubSkill.output) {
        return workflowSubSkill.output;
      }
    }

    // Fallback: Generate workflow using existing workflow-generator
    try {
      const workflowJson = await generateN8nJson(userInput, nodes);
      return workflowJson;
    } catch (error) {
      console.error('[Orchestrator] Workflow compilation failed:', error);
      throw new Error('Failed to compile workflow from agent results');
    }
  }

  /**
   * Stage 6: Generate Deployment Guide
   */
  private async generateDeployGuide(userInput: UserInput, workflow: any): Promise<string> {
    // Generate step-by-step deployment instructions
    const nodeCount = workflow.nodes?.length || 0;
    const credentials = this.extractRequiredCredentials(userInput);

    return `
# Prospect PAL Workflow Deployment Guide

## Workflow Overview
- **ICP**: ${userInput.icpPrompt}
- **Nodes**: ${nodeCount} configured
- **Lead Source**: ${userInput.leadSource}
- **CRM**: ${userInput.crm}
- **Sequencer**: ${userInput.sequencer}

## Step 1: Import to n8n
1. Open your n8n instance
2. Click "Import from File"
3. Paste the workflow JSON
4. Click "Save"

## Step 2: Configure Credentials
Required credentials:
${credentials.map((cred) => `- ${cred}`).join('\n')}

For each credential:
1. Go to Settings → Credentials
2. Click "Add Credential"
3. Select credential type
4. Enter your API key
5. Test connection
6. Save

## Step 3: Test the Workflow
1. Click "Execute Workflow" in n8n
2. Check the execution log for errors
3. Verify each node completes successfully
4. Review the output data

## Step 4: Activate
1. Toggle "Active" switch in n8n
2. Your workflow will run ${userInput.leadSource === 'apollo' || userInput.leadSource === 'manual' ? 'on schedule' : 'when triggered'}
3. Monitor execution logs in n8n dashboard

## Troubleshooting
- **Authentication errors**: Re-check API keys in credentials
- **Rate limits**: Add delays between nodes
- **Missing data**: Check data mappings in each node
- **Workflow not triggering**: Verify trigger node configuration

For support: hello@prospectpal.com
`.trim();
  }

  /**
   * Stage 7: Save Orchestration State
   */
  private async saveOrchestrationState(userId: string, state: any): Promise<void> {
    // TODO: Implement Supabase persistence
    // For now, just log
    console.log('[Orchestrator] Would save state for user:', userId);
  }

  /**
   * Extract required credentials from config
   */
  private extractRequiredCredentials(userInput: UserInput): string[] {
    const credentials: string[] = [];

    if (userInput.leadSource === 'apollo') credentials.push('Apollo API Key');
    if (userInput.enrichment.includes('clay')) credentials.push('Clay API Key');
    if (userInput.enrichment.includes('hunter')) credentials.push('Hunter.io API Key');
    if (userInput.enrichment.includes('clearbit')) credentials.push('Clearbit API Key');

    if (userInput.crm === 'hubspot') credentials.push('HubSpot API Key');
    else if (userInput.crm === 'salesforce') credentials.push('Salesforce OAuth');
    else if (userInput.crm === 'attio') credentials.push('Attio API Key');
    else if (userInput.crm === 'pipedrive') credentials.push('Pipedrive API Key');

    if (userInput.sequencer === 'smartlead') credentials.push('Smartlead API Key');
    else if (userInput.sequencer === 'amplemarket') credentials.push('AmpleMarket API Key');
    else if (userInput.sequencer === 'instantly') credentials.push('Instantly API Key');
    else if (userInput.sequencer === 'lemlist') credentials.push('Lemlist API Key');

    if (userInput.slackAlerts) credentials.push('Slack Webhook URL');

    credentials.push('OpenAI API Key (for AI research & email generation)');

    return credentials;
  }

  /**
   * Aggregate token usage from skill results
   */
  private aggregateTokenUsage(skillResult: SkillResult): { input: number; output: number; total: number } | undefined {
    if (!skillResult.tokensUsed) return undefined;

    let input = skillResult.tokensUsed.input;
    let output = skillResult.tokensUsed.output;

    // Add sub-skill token usage
    if (skillResult.subSkillResults) {
      for (const subResult of skillResult.subSkillResults.values()) {
        if (subResult.tokensUsed) {
          input += subResult.tokensUsed.input;
          output += subResult.tokensUsed.output;
        }
      }
    }

    return {
      input,
      output,
      total: input + output,
    };
  }
}

/**
 * Convenience function for one-shot orchestration
 */
export async function orchestrate(
  userInput: UserInput,
  config?: OrchestratorConfig
): Promise<OrchestrationResult> {
  const orchestrator = new UnifiedPALOrchestrator();
  return orchestrator.orchestrate(userInput, config);
}
