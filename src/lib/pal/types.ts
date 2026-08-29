/**
 * Prospect PAL Pipeline Types
 * Core type definitions for the PAL Methodology
 */

export interface ParsedIntent {
  companyName: string;
  companyBackground: string;
  productOffer: string;
  icpDescription: string;
  personaDescription: string;
  signals: string[];
  selectedTools: ToolSelection;
  triggerType: 'search' | 'csv' | 'manual' | 'webhook';
  approvalPolicy: 'auto-send' | 'human-approval' | 'draft-only';
}

export interface ToolSelection {
  leadSource: string;
  enrichment: string;
  crm: string;
  sequencer: string;
  llm: 'claude' | 'gpt4' | 'other';
}

export interface AmbiguityReport {
  missingFields: string[];
  suggestedQuestions: string[];
  confidenceScore: number;
}

export interface JTBD {
  primaryJob: string;
  successMetrics: string[];
  currentApproach: string;
  constraints: string[];
}

export interface ExpandedDesign {
  icpSegments: string[];
  messagingFramework: MessagingFramework;
  workflowNodes: WorkflowNode[];
  analyticsPlan: AnalyticsPlan;
  riskMitigation: RiskItem[];
}

export interface MessagingFramework {
  pasSequences: PASMessage[];
  variableFields: string[];
  toneVoice: string;
}

export interface PASMessage {
  id: string;
  stage: number;
  problem: string;
  agitation: string;
  solution: string;
  subjectLine: string;
}

export interface WorkflowNode {
  id: string;
  nodeNumber: number;
  name: string;
  type: string;
  toolBinding?: string;
  config: Record<string, unknown>;
  dependencies: string[];
}

export interface AnalyticsPlan {
  kpis: string[];
  trackingEvents: string[];
  reportingSchedule: 'daily' | 'weekly' | 'realtime';
}

export interface RiskItem {
  risk: string;
  mitigation: string;
  severity: 'low' | 'medium' | 'high';
}

export interface InstructionPack {
  workflowJson: Record<string, unknown>;
  setupInstructions: string[];
  testingPlan: string[];
  monitoringConfig: Record<string, unknown>;
}

// 9-Node Pipeline Stage Definitions
export const PIPELINE_STAGES = [
  { number: 1, id: 'trigger', name: 'Intake & Cron', color: 'cobalt', icon: 'clock' },
  { number: 2, id: 'normalizer', name: 'Data Normalizer', color: 'slate', icon: 'arrow-right-left' },
  { number: 3, id: 'shield', name: 'CRM Dedupe', color: 'green', icon: 'shield' },
  { number: 4, id: 'adapter', name: 'Data Adapter', color: 'blue', icon: 'database' },
  { number: 5, id: 'ai', name: 'Research + PAS', color: 'purple', icon: 'sparkles' },
  { number: 6, id: 'approval', name: 'Approval Switch', color: 'champagne', icon: 'git-compare' },
  { number: 7, id: 'crm', name: 'CRM Upsert', color: 'blue', icon: 'users' },
  { number: 8, id: 'enroll', name: 'Sequence Enroll', color: 'green', icon: 'mail' },
  { number: 9, id: 'alert', name: 'Review Alert', color: 'slate', icon: 'bell' },
] as const;

export type PipelineStage = typeof PIPELINE_STAGES[number];
