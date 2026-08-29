import { UnifiedPALOrchestrator, UserInput } from '@/lib/rostr/unified-orchestrator';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Unified Orchestration Endpoint
 *
 * Production-ready agent harness that executes the complete ROSTR pipeline:
 * User Input → PAL → NPAO → Skill Loading → Agent Execution → Workflow Compilation
 *
 * Supports BYOK (Bring Your Own Key) model for zero LLM cost risk.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userInput, apiKey } = body as { userInput: UserInput; apiKey?: string };

    // Validate user input
    if (!userInput || !userInput.icpPrompt) {
      return Response.json(
        {
          error: 'Missing required field: userInput.icpPrompt',
          hint: 'Provide at minimum: { icpPrompt, leadSource, enrichment, crm, sequencer }',
        },
        { status: 400 }
      );
    }

    // Validate API key (BYOK model)
    const effectiveApiKey = apiKey || process.env.DEFAULT_LLM_API_KEY;

    if (!effectiveApiKey) {
      return Response.json(
        {
          error: 'API key required',
          message: 'Provide your OpenRouter or Anthropic API key in the request body or set DEFAULT_LLM_API_KEY env var',
          byok: true,
          instructions: {
            openRouter: 'Get key at https://openrouter.ai/keys',
            anthropic: 'Get key at https://console.anthropic.com/',
          },
        },
        { status: 401 }
      );
    }

    // Get user ID from session (if authenticated)
    const userId = req.headers.get('x-user-id') || 'anonymous';

    // Create orchestrator instance
    const orchestrator = new UnifiedPALOrchestrator();

    // Execute full orchestration pipeline
    const result = await orchestrator.orchestrate(userInput, {
      apiKey: effectiveApiKey,
      timeout: 50000, // 50s max (stay under 60s edge function limit)
      enableSkillDelegation: true, // Allow orchestrator to invoke sub-skills
      saveToDatabase: userId !== 'anonymous',
      userId,
    });

    // Return workflow and trace
    return Response.json({
      success: true,
      workflow: result.workflow,
      deployGuide: result.deployGuide,
      trace: {
        phase: result.trace.phase.phase,
        priority: result.trace.priority.total,
        skill: result.trace.skill,
        executionTimeMs: result.executionTimeMs,
        tokensUsed: result.tokensUsed,
      },
      metadata: {
        nodeCount: result.workflow?.nodes?.length || 0,
        credentialsRequired: extractCredentialCount(result.workflow),
      },
    });
  } catch (error) {
    console.error('[Unified Orchestrator API] Error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Skill not found')) {
        return Response.json(
          {
            error: 'Skill loading failed',
            message: error.message,
            hint: 'Check that .agents/skills/ directory contains the required skill files',
          },
          { status: 500 }
        );
      }

      if (error.message.includes('PAL compilation failed')) {
        return Response.json(
          {
            error: 'PAL compilation failed',
            message: error.message,
            hint: 'Review userInput format - ensure icpPrompt is descriptive',
          },
          { status: 400 }
        );
      }

      if (error.message.includes('Agent execution failed')) {
        return Response.json(
          {
            error: 'Agent execution failed',
            message: error.message,
            hint: 'Check API key validity and try again',
          },
          { status: 500 }
        );
      }
    }

    // Generic error response
    return Response.json(
      {
        error: 'Orchestration failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Helper: Extract credential count from workflow
 */
function extractCredentialCount(workflow: any): number {
  if (!workflow || !workflow.nodes) return 0;

  const credentialNodes = workflow.nodes.filter(
    (node: any) => node.credentials && Object.keys(node.credentials).length > 0
  );

  return credentialNodes.length;
}

/**
 * GET endpoint: Health check
 */
export async function GET() {
  return Response.json({
    service: 'Unified PAL Orchestrator',
    status: 'operational',
    version: '1.0.0',
    capabilities: [
      'PAL Compilation',
      'NPAO Classification',
      'Skill Loading',
      'Agent Execution',
      'Sub-Skill Delegation',
      'Workflow Compilation',
    ],
    byok: true,
    supportedProviders: ['OpenRouter', 'Anthropic'],
  });
}
