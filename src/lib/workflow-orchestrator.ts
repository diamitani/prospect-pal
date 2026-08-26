/**
 * Workflow Orchestrator
 * Core orchestration logic for the 11-step automation workflow
 */

import { v4 as uuidv4 } from "uuid";
import { STEP_NAMES, TOTAL_STEPS } from "./step-prompts";
import { supabase } from "./supabase";

// ===========================================================================
// TYPES
// ===========================================================================

export type WorkflowStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed';
export type StepStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped';

export interface ToolStackConfig {
  leadSource: 'apollo' | 'linkedin' | 'upload_csv' | 'hubspot_stage' | 'manual';
  enrichment: ('clay' | 'hunter' | 'clearbit' | 'apollo_enrich')[];
  crm: 'hubspot' | 'salesforce' | 'attio' | 'pipedrive' | 'none';
  sequencer: 'smartlead' | 'amplemarket' | 'instantly' | 'lemlist' | 'hubspot_seq';
  approvalGate?: boolean;
  slackNotifications?: boolean;
}

export interface WorkflowInputs {
  companyName: string;
  campaignTitle: string;
  campaignIcp: string;
  userPersona: string;
  companyProduct: string;
  companyBackground: string;
  targetSignals: string;
  toolStack: ToolStackConfig;
}

export interface StepResult {
  step: number;
  name: string;
  status: StepStatus;
  output: unknown;
  duration: number;
  timestamp: string;
  error?: string;
}

export interface WebhookConfig {
  webhookPath: string;
  webhookNode: Record<string, unknown>;
  inputSchema: Record<string, unknown>;
}

export interface SchemaMapping {
  fieldMappings: Record<string, string>;
  transformations: { field: string; transform: string }[];
  validationRules: { field: string; rule: string }[];
}

export interface BuildPlan {
  icpProfile: {
    targetIndustries: string[];
    targetTitles: string[];
    companySizeRange: string;
    geographies: string[];
    painPoints: string[];
    triggerEvents: string[];
  };
  toolRecommendations: Record<string, unknown>;
  workflowArchitecture: Record<string, unknown>;
  personalizationStrategy: Record<string, unknown>;
}

export interface EmailSequence {
  day0: { subject: string; body: string };
  day3: { subject: string; body: string };
  day7: { subject: string; body: string };
  day14: { subject: string; body: string };
  personalizationVariables: string[];
}

export interface WorkflowReport {
  campaignName: string;
  icpSummary: string;
  toolStack: Record<string, unknown>;
  nodeCount: number;
  estimatedLeadsPerDay: number;
  estimatedEmailsPerDay: number;
  setupInstructions: string[];
}

export interface N8nNodeConfig {
  id: string;
  name: string;
  type: string;
  typeVersion?: number;
  position: [number, number];
  parameters: Record<string, unknown>;
  credentials?: Record<string, unknown>;
}

export interface WorkflowArtifacts {
  webhookConfig?: WebhookConfig;
  schemaMapping?: SchemaMapping;
  dbNodes?: { dataMapperNode: N8nNodeConfig; upsertNode: N8nNodeConfig };
  buildPlan?: BuildPlan;
  triggerNode?: N8nNodeConfig;
  companyDataNode?: N8nNodeConfig;
  contactSearchNode?: N8nNodeConfig;
  crmNodes?: { dedupeNode: N8nNodeConfig; createNode: N8nNodeConfig };
  researchNode?: N8nNodeConfig;
  emailNode?: N8nNodeConfig;
  emailSequence?: EmailSequence;
  enrollmentNode?: N8nNodeConfig;
  reportNode?: N8nNodeConfig;
  workflowReport?: WorkflowReport;
  finalN8nJson?: string;
}

export interface AutomationWorkflow {
  id: string;
  projectId?: string;
  userId: string;
  currentStep: number;
  totalSteps: number;
  status: WorkflowStatus;
  inputs: WorkflowInputs;
  stepResults: StepResult[];
  artifacts: WorkflowArtifacts;
  webhookUrl?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// ===========================================================================
// SUPABASE PERSISTENCE
// ===========================================================================

/**
 * Initialize a new automation workflow
 */
export async function initializeWorkflow(
  inputs: WorkflowInputs,
  userId: string,
  projectId?: string
): Promise<AutomationWorkflow> {
  const workflowId = uuidv4();
  const now = new Date().toISOString();

  const workflow: AutomationWorkflow = {
    id: workflowId,
    projectId,
    userId,
    currentStep: 0,
    totalSteps: TOTAL_STEPS,
    status: 'pending',
    inputs,
    stepResults: [],
    artifacts: {},
    createdAt: now,
    updatedAt: now,
  };

  // Store workflow in Supabase
  const { data, error } = await supabase
    .from('automation_workflows')
    .insert({
      id: workflow.id,
      user_id: workflow.userId,
      project_id: workflow.projectId,
      status: workflow.status,
      current_step: workflow.currentStep,
      total_steps: workflow.totalSteps,
      inputs: workflow.inputs,
      artifacts: workflow.artifacts,
      step_results: workflow.stepResults,
      created_at: workflow.createdAt,
      updated_at: workflow.updatedAt,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to initialize workflow: ${error.message}`);
  }

  return workflow;
}

/**
 * Get workflow status
 */
export async function getWorkflowStatus(workflowId: string): Promise<AutomationWorkflow | null> {
  const { data, error } = await supabase
    .from('automation_workflows')
    .select('*')
    .eq('id', workflowId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Failed to fetch workflow:', error);
    return null;
  }

  if (!data) return null;

  // Map database fields to AutomationWorkflow interface
  return {
    id: data.id,
    projectId: data.project_id,
    userId: data.user_id,
    currentStep: data.current_step,
    totalSteps: data.total_steps,
    status: data.status as WorkflowStatus,
    inputs: data.inputs as WorkflowInputs,
    stepResults: (data.step_results as StepResult[]) || [],
    artifacts: (data.artifacts as WorkflowArtifacts) || {},
    webhookUrl: data.webhook_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    completedAt: data.completed_at,
  };
}

/**
 * Update workflow with step result
 */
export async function updateWorkflowStep(
  workflowId: string,
  stepResult: StepResult,
  artifacts?: Partial<WorkflowArtifacts>
): Promise<AutomationWorkflow> {
  const workflow = await getWorkflowStatus(workflowId);
  if (!workflow) {
    throw new Error(`Workflow not found: ${workflowId}`);
  }

  // Update step results
  const existingIndex = workflow.stepResults.findIndex(r => r.step === stepResult.step);
  if (existingIndex >= 0) {
    workflow.stepResults[existingIndex] = stepResult;
  } else {
    workflow.stepResults.push(stepResult);
  }

  // Update artifacts
  if (artifacts) {
    workflow.artifacts = { ...workflow.artifacts, ...artifacts };
  }

  // Update current step and status
  let completedAt = workflow.completedAt;
  if (stepResult.status === 'success') {
    workflow.currentStep = stepResult.step;
    if (stepResult.step >= TOTAL_STEPS) {
      workflow.status = 'completed';
      completedAt = new Date().toISOString();
    } else {
      workflow.status = 'running';
    }
  } else if (stepResult.status === 'failed') {
    workflow.status = 'failed';
  }

  workflow.updatedAt = new Date().toISOString();

  // Update in Supabase
  const { error } = await supabase
    .from('automation_workflows')
    .update({
      current_step: workflow.currentStep,
      status: workflow.status,
      step_results: workflow.stepResults,
      artifacts: workflow.artifacts,
      updated_at: workflow.updatedAt,
      completed_at: completedAt,
    })
    .eq('id', workflowId);

  if (error) {
    throw new Error(`Failed to update workflow: ${error.message}`);
  }

  return workflow;
}

/**
 * Resume workflow from last successful step
 */
export async function resumeWorkflow(workflowId: string): Promise<AutomationWorkflow> {
  const workflow = await getWorkflowStatus(workflowId);
  if (!workflow) {
    throw new Error(`Workflow not found: ${workflowId}`);
  }

  if (workflow.status === 'completed') {
    throw new Error('Workflow already completed');
  }

  workflow.status = 'running';
  workflow.updatedAt = new Date().toISOString();

  // Update in Supabase
  const { error } = await supabase
    .from('automation_workflows')
    .update({
      status: workflow.status,
      updated_at: workflow.updatedAt,
    })
    .eq('id', workflowId);

  if (error) {
    throw new Error(`Failed to resume workflow: ${error.message}`);
  }

  return workflow;
}

/**
 * Get the next step to execute
 */
export function getNextStep(workflow: AutomationWorkflow): number | null {
  if (workflow.status === 'completed') return null;
  if (workflow.status === 'failed') return null;

  const nextStep = workflow.currentStep + 1;
  return nextStep <= TOTAL_STEPS ? nextStep : null;
}

/**
 * Validate that a step can be executed
 */
export function canExecuteStep(workflow: AutomationWorkflow, stepNumber: number): boolean {
  if (stepNumber < 1 || stepNumber > TOTAL_STEPS) return false;
  if (workflow.status === 'completed') return false;

  // Step 1 can always be executed
  if (stepNumber === 1) return true;

  // Other steps require previous step to be completed
  const previousResult = workflow.stepResults.find(r => r.step === stepNumber - 1);
  return previousResult?.status === 'success';
}

/**
 * Get step name
 */
export function getStepName(stepNumber: number): string {
  return STEP_NAMES[stepNumber] || `Step ${stepNumber}`;
}

/**
 * Assemble final n8n workflow JSON from artifacts
 */
export function assembleWorkflowJson(workflow: AutomationWorkflow): string {
  const { artifacts, inputs } = workflow;
  const nodes: N8nNodeConfig[] = [];
  const connections: Record<string, { main: { node: string; type: string; index: number }[][] }> = {};

  // Helper to add node and connection
  const addNode = (node: N8nNodeConfig | undefined, previousNodeName?: string) => {
    if (!node) return;
    nodes.push(node);
    if (previousNodeName) {
      if (!connections[previousNodeName]) {
        connections[previousNodeName] = { main: [[]] };
      }
      connections[previousNodeName].main[0].push({
        node: node.name,
        type: 'main',
        index: 0,
      });
    }
  };

  // Build node sequence
  let lastNodeName: string | undefined;

  if (artifacts.triggerNode) {
    addNode(artifacts.triggerNode);
    lastNodeName = artifacts.triggerNode.name;
  }

  if (artifacts.companyDataNode) {
    addNode(artifacts.companyDataNode, lastNodeName);
    lastNodeName = artifacts.companyDataNode.name;
  }

  if (artifacts.crmNodes?.dedupeNode) {
    addNode(artifacts.crmNodes.dedupeNode, lastNodeName);
    lastNodeName = artifacts.crmNodes.dedupeNode.name;
  }

  if (artifacts.contactSearchNode) {
    addNode(artifacts.contactSearchNode, lastNodeName);
    lastNodeName = artifacts.contactSearchNode.name;
  }

  if (artifacts.researchNode) {
    addNode(artifacts.researchNode, lastNodeName);
    lastNodeName = artifacts.researchNode.name;
  }

  if (artifacts.emailNode) {
    addNode(artifacts.emailNode, lastNodeName);
    lastNodeName = artifacts.emailNode.name;
  }

  if (artifacts.enrollmentNode) {
    addNode(artifacts.enrollmentNode, lastNodeName);
    lastNodeName = artifacts.enrollmentNode.name;
  }

  if (artifacts.crmNodes?.createNode) {
    addNode(artifacts.crmNodes.createNode, lastNodeName);
    lastNodeName = artifacts.crmNodes.createNode.name;
  }

  if (artifacts.reportNode) {
    addNode(artifacts.reportNode, lastNodeName);
  }

  const workflowJson = {
    name: `Prospect PAL - ${inputs.campaignTitle}`,
    nodes,
    connections,
    active: false,
    settings: { executionOrder: 'v1' },
    versionId: '1',
    meta: {
      instanceId: 'prospect-pal',
      templateId: workflow.id,
    },
  };

  return JSON.stringify(workflowJson, null, 2);
}

// ===========================================================================
// EXPORTS
// ===========================================================================

export { TOTAL_STEPS };
