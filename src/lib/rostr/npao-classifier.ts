/**
 * NPAO (Navigate, Prioritize, Allocate, Orchestrate) Classifier
 * 5D Phase Taxonomy + 4D Priority Scoring
 */

import type { AgentManifest } from "./pal-compiler";

export type Phase = "PreD" | "Design" | "Development" | "Deployment" | "Debugging";

export interface PhaseClassification {
  phase: Phase;
  confidence: number;
  reasoning: string;
  completion_criteria: string[];
}

export interface PriorityScore {
  total: number;
  phase_urgency: number;
  dependency_impact: number;
  business_impact: number;
  resource_efficiency: number;
  threshold: "immediate" | "queued" | "backlog";
}

export interface TaskAllocation {
  agentId?: string;
  allocation_score: number;
  reasoning: string;
}

/**
 * Classify task into 5D Phase Taxonomy
 */
export function classifyPhase(manifest: AgentManifest): PhaseClassification {
  const { task_description } = manifest.instructions;
  const desc = task_description.toLowerCase();

  // Phase detection patterns
  const patterns: Record<Phase, RegExp[]> = {
    PreD: [
      /should we build/i,
      /feasibility/i,
      /competitive research/i,
      /problem definition/i,
      /go.no-go/i,
    ],
    Design: [
      /architecture/i,
      /design/i,
      /data model/i,
      /api contract/i,
      /workflow structure/i,
      /plan/i,
    ],
    Development: [
      /build/i,
      /implement/i,
      /create workflow/i,
      /generate/i,
      /configure/i,
    ],
    Deployment: [
      /deploy/i,
      /ship/i,
      /launch/i,
      /production/i,
      /release/i,
    ],
    Debugging: [
      /fix/i,
      /debug/i,
      /error/i,
      /failed/i,
      /not working/i,
    ],
  };

  // Score each phase
  const scores: Record<Phase, number> = {
    PreD: 0,
    Design: 0,
    Development: 0,
    Deployment: 0,
    Debugging: 0,
  };

  for (const [phase, regexes] of Object.entries(patterns)) {
    for (const regex of regexes) {
      if (regex.test(desc)) {
        scores[phase as Phase] += 1;
      }
    }
  }

  // Find highest scoring phase
  const phase = (Object.keys(scores) as Phase[]).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  const maxScore = Math.max(...Object.values(scores));
  const confidence = maxScore > 0 ? maxScore / 3 : 0.5; // Normalize

  // Phase-specific completion criteria
  const criteriaMap: Record<Phase, string[]> = {
    PreD: [
      "Problem stated in one sentence",
      "Target user identified",
      "≥3 alternatives considered",
      "Go/no-go decision made",
    ],
    Design: [
      "Architecture diagram exists",
      "Data models defined",
      "Tech choices justified",
    ],
    Development: [
      "All features implemented",
      "Code passes review",
      "Documentation updated",
    ],
    Deployment: [
      "Staging QA passed",
      "Monitoring active",
      "Production deploy verified",
    ],
    Debugging: [
      "Bug reproduced",
      "Root cause identified",
      "Fix implemented and tested",
    ],
  };

  return {
    phase,
    confidence,
    reasoning: `Detected "${phase}" phase based on task description patterns`,
    completion_criteria: criteriaMap[phase],
  };
}

/**
 * Calculate 4D Priority Score
 */
export function calculatePriority(
  phaseClass: PhaseClassification,
  manifest: AgentManifest,
  context?: {
    blockedTasks?: number;
    revenueImpact?: boolean;
    estimatedHours?: number;
  }
): PriorityScore {
  // Dimension 1: Phase Urgency (0-10)
  const phaseUrgencyBase: Record<Phase, number> = {
    Debugging: 10,
    Deployment: 8,
    Development: 6,
    Design: 4,
    PreD: 2,
  };

  let phase_urgency = phaseUrgencyBase[phaseClass.phase];

  // Modifiers
  if (context?.revenueImpact && phaseClass.phase === "Deployment") {
    phase_urgency += 2;
  }

  // Dimension 2: Dependency Impact (0-10)
  const blockedCount = context?.blockedTasks || 0;
  let dependency_impact = 0;
  if (blockedCount === 0) dependency_impact = 0;
  else if (blockedCount <= 2) dependency_impact = 3;
  else if (blockedCount <= 5) dependency_impact = 6;
  else dependency_impact = 10;

  // Dimension 3: Business Impact (0-10)
  let business_impact = 5; // Default moderate
  if (context?.revenueImpact) business_impact = 9;
  if (phaseClass.phase === "PreD") business_impact = 3; // Research phase

  // Dimension 4: Resource Efficiency (0-10)
  const hours = context?.estimatedHours || 4;
  let resource_efficiency = 7; // Default
  if (hours < 1) resource_efficiency = 10;
  else if (hours <= 4) resource_efficiency = 7;
  else if (hours <= 8) resource_efficiency = 4;
  else resource_efficiency = 2;

  // Composite score
  const total =
    phase_urgency * 0.35 +
    dependency_impact * 0.30 +
    business_impact * 0.25 +
    resource_efficiency * 0.10;

  // Threshold classification
  let threshold: PriorityScore["threshold"] = "queued";
  if (total >= 7.0) threshold = "immediate";
  else if (total < 4.0) threshold = "backlog";

  return {
    total: parseFloat(total.toFixed(2)),
    phase_urgency,
    dependency_impact,
    business_impact,
    resource_efficiency,
    threshold,
  };
}

/**
 * Agent Allocation Algorithm
 */
export interface Agent {
  id: string;
  name: string;
  type: string;
  phases: Phase[];
  tools: string[];
  current_tasks: number;
  max_parallel_tasks: number;
  performance: {
    tasks_completed: number;
    avg_completion_minutes: number;
    success_rate: number;
  };
}

export function allocateAgent(
  manifest: AgentManifest,
  phaseClass: PhaseClassification,
  availableAgents: Agent[]
): TaskAllocation {
  // Filter eligible agents
  const eligible = availableAgents.filter((agent) => {
    const hasPhase = agent.phases.includes(phaseClass.phase);
    const hasCapacity = agent.current_tasks < agent.max_parallel_tasks;
    const hasTools = manifest.tools_enabled.allow.every((tool) =>
      agent.tools.includes(tool)
    );

    return hasPhase && hasCapacity && hasTools;
  });

  if (eligible.length === 0) {
    return {
      allocation_score: 0,
      reasoning: "No eligible agents available - will queue",
    };
  }

  // Score each eligible agent
  const scored = eligible.map((agent) => {
    // Specialization score (does agent's type match manifest?)
    const specializationScore =
      agent.type === manifest.runtime.agent_type ? 1.0 : 0.5;

    // Load score (prefer less loaded agents)
    const loadScore = 1.0 - (agent.current_tasks / agent.max_parallel_tasks);

    // Performance score
    const performanceScore = agent.performance.success_rate;

    // Composite
    const allocation_score =
      specializationScore * 0.50 +
      loadScore * 0.25 +
      performanceScore * 0.25;

    return {
      agent,
      allocation_score: parseFloat(allocation_score.toFixed(3)),
    };
  });

  // Pick highest scorer
  const best = scored.reduce((a, b) =>
    a.allocation_score > b.allocation_score ? a : b
  );

  return {
    agentId: best.agent.id,
    allocation_score: best.allocation_score,
    reasoning: `Allocated to ${best.agent.name} (score: ${best.allocation_score})`,
  };
}
