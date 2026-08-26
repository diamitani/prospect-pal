/**
 * Step Executor
 * Individual step execution logic for the 11-step automation workflow
 */

import { invokeClaude } from "./bedrock";
import { STEP_PROMPTS, STEP_NAMES } from "./step-prompts";
import {
  AutomationWorkflow,
  StepResult,
  WorkflowArtifacts,
  updateWorkflowStep,
  getWorkflowStatus,
  assembleWorkflowJson,
} from "./workflow-orchestrator";

// ===========================================================================
// TYPES
// ===========================================================================

type StepExecutor = (
  workflow: AutomationWorkflow
) => Promise<{ result: StepResult; artifacts?: Partial<WorkflowArtifacts> }>;

interface StepDefinition {
  name: string;
  executor: StepExecutor;
}

// ===========================================================================
// HELPER FUNCTIONS
// ===========================================================================

function buildStepContext(workflow: AutomationWorkflow, stepNumber: number): string {
  const { inputs, artifacts, stepResults } = workflow;

  let context = `## Campaign Inputs
Company Name: ${inputs.companyName}
Campaign Title: ${inputs.campaignTitle}
Campaign ICP: ${inputs.campaignIcp}
User Persona: ${inputs.userPersona}
Company Product: ${inputs.companyProduct}
Company Background: ${inputs.companyBackground}
Target Signals: ${inputs.targetSignals}

## Tool Stack Configuration
Lead Source: ${inputs.toolStack.leadSource}
Enrichment: ${inputs.toolStack.enrichment.join(', ')}
CRM: ${inputs.toolStack.crm}
Sequencer: ${inputs.toolStack.sequencer}
Approval Gate: ${inputs.toolStack.approvalGate ?? true}
`;

  // Add previous step outputs as context
  if (stepNumber > 1 && stepResults.length > 0) {
    context += `\n## Previous Step Outputs\n`;
    for (const result of stepResults) {
      if (result.status === 'success' && result.output) {
        context += `\n### Step ${result.step}: ${result.name}\n`;
        context += JSON.stringify(result.output, null, 2).slice(0, 2000);
      }
    }
  }

  // Add relevant artifacts
  if (artifacts.buildPlan && stepNumber >= 5) {
    context += `\n## Build Plan\n`;
    context += JSON.stringify(artifacts.buildPlan, null, 2).slice(0, 1500);
  }

  return context;
}

async function executeStepWithLLM(
  workflow: AutomationWorkflow,
  stepNumber: number
): Promise<unknown> {
  const systemPrompt = STEP_PROMPTS[stepNumber];
  if (!systemPrompt) {
    throw new Error(`No prompt defined for step ${stepNumber}`);
  }

  const context = buildStepContext(workflow, stepNumber);

  const response = await invokeClaude(
    [{ role: "user", content: context }],
    systemPrompt,
    8192
  );

  // Parse JSON response
  let parsed: unknown;
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      parsed = JSON.parse(response);
    }
  } catch {
    // If parsing fails, return raw response wrapped in object
    parsed = { raw: response };
  }

  return parsed;
}

// ===========================================================================
// STEP EXECUTORS
// ===========================================================================

const generateWebhookStep: StepExecutor = async (workflow) => {
  const startTime = Date.now();
  try {
    const output = await executeStepWithLLM(workflow, 1);
    return {
      result: {
        step: 1,
        name: STEP_NAMES[1],
        status: 'success',
        output,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      artifacts: {
        webhookConfig: output as WorkflowArtifacts['webhookConfig'],
      },
    };
  } catch (error) {
    return {
      result: {
        step: 1,
        name: STEP_NAMES[1],
        status: 'failed',
        output: null,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

const mapSchemaStep: StepExecutor = async (workflow) => {
  const startTime = Date.now();
  try {
    const output = await executeStepWithLLM(workflow, 2);
    return {
      result: {
        step: 2,
        name: STEP_NAMES[2],
        status: 'success',
        output,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      artifacts: {
        schemaMapping: output as WorkflowArtifacts['schemaMapping'],
      },
    };
  } catch (error) {
    return {
      result: {
        step: 2,
        name: STEP_NAMES[2],
        status: 'failed',
        output: null,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

const upsertDatabaseStep: StepExecutor = async (workflow) => {
  const startTime = Date.now();
  try {
    const output = await executeStepWithLLM(workflow, 3) as WorkflowArtifacts['dbNodes'];
    return {
      result: {
        step: 3,
        name: STEP_NAMES[3],
        status: 'success',
        output,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      artifacts: {
        dbNodes: output,
      },
    };
  } catch (error) {
    return {
      result: {
        step: 3,
        name: STEP_NAMES[3],
        status: 'failed',
        output: null,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

const generateBuildPlanStep: StepExecutor = async (workflow) => {
  const startTime = Date.now();
  try {
    const output = await executeStepWithLLM(workflow, 4);
    return {
      result: {
        step: 4,
        name: STEP_NAMES[4],
        status: 'success',
        output,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      artifacts: {
        buildPlan: output as WorkflowArtifacts['buildPlan'],
      },
    };
  } catch (error) {
    return {
      result: {
        step: 4,
        name: STEP_NAMES[4],
        status: 'failed',
        output: null,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

const configureTriggerStep: StepExecutor = async (workflow) => {
  const startTime = Date.now();
  try {
    const output = await executeStepWithLLM(workflow, 5) as { triggerNode?: unknown };
    return {
      result: {
        step: 5,
        name: STEP_NAMES[5],
        status: 'success',
        output,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      artifacts: {
        triggerNode: output.triggerNode as WorkflowArtifacts['triggerNode'],
      },
    };
  } catch (error) {
    return {
      result: {
        step: 5,
        name: STEP_NAMES[5],
        status: 'failed',
        output: null,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

const configureCompanyDataStep: StepExecutor = async (workflow) => {
  const startTime = Date.now();
  try {
    const output = await executeStepWithLLM(workflow, 6) as { companyDataNode?: unknown };
    return {
      result: {
        step: 6,
        name: STEP_NAMES[6],
        status: 'success',
        output,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      artifacts: {
        companyDataNode: output.companyDataNode as WorkflowArtifacts['companyDataNode'],
      },
    };
  } catch (error) {
    return {
      result: {
        step: 6,
        name: STEP_NAMES[6],
        status: 'failed',
        output: null,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

const configureContactSearchStep: StepExecutor = async (workflow) => {
  const startTime = Date.now();
  try {
    const output = await executeStepWithLLM(workflow, 7) as { contactSearchNode?: unknown };
    return {
      result: {
        step: 7,
        name: STEP_NAMES[7],
        status: 'success',
        output,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      artifacts: {
        contactSearchNode: output.contactSearchNode as WorkflowArtifacts['contactSearchNode'],
      },
    };
  } catch (error) {
    return {
      result: {
        step: 7,
        name: STEP_NAMES[7],
        status: 'failed',
        output: null,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

const configureCrmUpdateStep: StepExecutor = async (workflow) => {
  const startTime = Date.now();
  try {
    const output = await executeStepWithLLM(workflow, 8) as {
      crmDedupeNode?: unknown;
      crmCreateNode?: unknown;
    };
    return {
      result: {
        step: 8,
        name: STEP_NAMES[8],
        status: 'success',
        output,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      artifacts: {
        crmNodes: {
          dedupeNode: output.crmDedupeNode,
          createNode: output.crmCreateNode,
        } as WorkflowArtifacts['crmNodes'],
      },
    };
  } catch (error) {
    return {
      result: {
        step: 8,
        name: STEP_NAMES[8],
        status: 'failed',
        output: null,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

const configureResearchNodeStep: StepExecutor = async (workflow) => {
  const startTime = Date.now();
  try {
    const output = await executeStepWithLLM(workflow, 9) as { researchNode?: unknown };
    return {
      result: {
        step: 9,
        name: STEP_NAMES[9],
        status: 'success',
        output,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      artifacts: {
        researchNode: output.researchNode as WorkflowArtifacts['researchNode'],
      },
    };
  } catch (error) {
    return {
      result: {
        step: 9,
        name: STEP_NAMES[9],
        status: 'failed',
        output: null,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

const configureEmailCopyStep: StepExecutor = async (workflow) => {
  const startTime = Date.now();
  try {
    const output = await executeStepWithLLM(workflow, 10) as {
      emailNode?: unknown;
      emailTemplates?: unknown;
    };
    return {
      result: {
        step: 10,
        name: STEP_NAMES[10],
        status: 'success',
        output,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      artifacts: {
        emailNode: output.emailNode as WorkflowArtifacts['emailNode'],
        emailSequence: output.emailTemplates as WorkflowArtifacts['emailSequence'],
      },
    };
  } catch (error) {
    return {
      result: {
        step: 10,
        name: STEP_NAMES[10],
        status: 'failed',
        output: null,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

const configureEnrollmentStep: StepExecutor = async (workflow) => {
  const startTime = Date.now();
  try {
    const output = await executeStepWithLLM(workflow, 11) as { enrollmentNode?: unknown };
    return {
      result: {
        step: 11,
        name: STEP_NAMES[11],
        status: 'success',
        output,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      artifacts: {
        enrollmentNode: output.enrollmentNode as WorkflowArtifacts['enrollmentNode'],
      },
    };
  } catch (error) {
    return {
      result: {
        step: 11,
        name: STEP_NAMES[11],
        status: 'failed',
        output: null,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

const generateReportStep: StepExecutor = async (workflow) => {
  const startTime = Date.now();
  try {
    const output = await executeStepWithLLM(workflow, 12) as {
      reportNode?: unknown;
      workflowReport?: unknown;
    };

    // Assemble final workflow JSON
    const finalN8nJson = assembleWorkflowJson(workflow);

    return {
      result: {
        step: 12,
        name: STEP_NAMES[12],
        status: 'success',
        output: { ...output, finalN8nJson },
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      artifacts: {
        reportNode: output.reportNode as WorkflowArtifacts['reportNode'],
        workflowReport: output.workflowReport as WorkflowArtifacts['workflowReport'],
        finalN8nJson,
      },
    };
  } catch (error) {
    return {
      result: {
        step: 12,
        name: STEP_NAMES[12],
        status: 'failed',
        output: null,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

// ===========================================================================
// STEP DEFINITIONS MAP
// ===========================================================================

export const STEP_DEFINITIONS: Record<number, StepDefinition> = {
  1:  { name: STEP_NAMES[1],  executor: generateWebhookStep },
  2:  { name: STEP_NAMES[2],  executor: mapSchemaStep },
  3:  { name: STEP_NAMES[3],  executor: upsertDatabaseStep },
  4:  { name: STEP_NAMES[4],  executor: generateBuildPlanStep },
  5:  { name: STEP_NAMES[5],  executor: configureTriggerStep },
  6:  { name: STEP_NAMES[6],  executor: configureCompanyDataStep },
  7:  { name: STEP_NAMES[7],  executor: configureContactSearchStep },
  8:  { name: STEP_NAMES[8],  executor: configureCrmUpdateStep },
  9:  { name: STEP_NAMES[9],  executor: configureResearchNodeStep },
  10: { name: STEP_NAMES[10], executor: configureEmailCopyStep },
  11: { name: STEP_NAMES[11], executor: configureEnrollmentStep },
  12: { name: STEP_NAMES[12], executor: generateReportStep },
};

// ===========================================================================
// MAIN EXECUTION FUNCTION
// ===========================================================================

/**
 * Execute a specific step in the workflow
 */
export async function executeStep(
  workflowId: string,
  stepNumber: number
): Promise<StepResult> {
  const workflow = await getWorkflowStatus(workflowId);
  if (!workflow) {
    throw new Error(`Workflow not found: ${workflowId}`);
  }

  const stepDef = STEP_DEFINITIONS[stepNumber];
  if (!stepDef) {
    throw new Error(`Invalid step number: ${stepNumber}`);
  }

  // Execute the step
  const { result, artifacts } = await stepDef.executor(workflow);

  // Update workflow with result
  await updateWorkflowStep(workflowId, result, artifacts);

  return result;
}

/**
 * Execute all remaining steps in the workflow
 */
export async function executeAllSteps(workflowId: string): Promise<StepResult[]> {
  const results: StepResult[] = [];
  let workflow = await getWorkflowStatus(workflowId);

  if (!workflow) {
    throw new Error(`Workflow not found: ${workflowId}`);
  }

  const startStep = workflow.currentStep + 1;

  for (let step = startStep; step <= 12; step++) {
    const result = await executeStep(workflowId, step);
    results.push(result);

    if (result.status === 'failed') {
      break;
    }

    // Refresh workflow state
    workflow = await getWorkflowStatus(workflowId);
    if (!workflow || workflow.status === 'completed') {
      break;
    }
  }

  return results;
}
