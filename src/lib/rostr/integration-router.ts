/**
 * Integration Router
 * Routes tasks to either Agent Swarm or N8N based on task characteristics
 */

import type { AgentManifest } from "./pal-compiler";
import type { PhaseClassification } from "./npao-classifier";

export interface RoutingDecision {
  destination: "agent-swarm" | "n8n";
  reasoning: string;
  confidence: number;
}

export interface N8NWebhookPayload {
  webhook_url: string;
  payload: Record<string, any>;
  metadata?: {
    source: string;
    timestamp: string;
  };
}

/**
 * Decision Matrix for Routing
 */
export function routeTask(
  manifest: AgentManifest,
  phase: PhaseClassification
): RoutingDecision {
  const { task_description } = manifest.instructions;
  const desc = task_description.toLowerCase();

  // Agent Swarm indicators
  const agentIndicators = [
    /\b(research|analyze|investigate|diagnose)\b/i,
    /\b(write|generate|create) (email|copy|content)\b/i,
    /\b(ai|llm|claude|gpt)\b/i,
    /\b(multi-step|complex|orchestrate)\b/i,
  ];

  // N8N indicators
  const n8nIndicators = [
    /\b(crm|hubspot|salesforce|pipedrive)\b/i,
    /\b(email|send|notify|alert)\b/i,
    /\b(webhook|api call|http request)\b/i,
    /\b(transform|map|filter) data\b/i,
    /\b(schedule|trigger|automate)\b/i,
  ];

  let agentScore = 0;
  let n8nScore = 0;

  // Score based on patterns
  agentIndicators.forEach((pattern) => {
    if (pattern.test(desc)) agentScore += 1;
  });

  n8nIndicators.forEach((pattern) => {
    if (pattern.test(desc)) n8nScore += 1;
  });

  // Phase-based scoring
  if (phase.phase === "PreD" || phase.phase === "Design") {
    agentScore += 2; // Research/design favors agents
  }

  if (phase.phase === "Deployment") {
    n8nScore += 2; // Deployment favors n8n
  }

  // Task complexity
  const hasManySteps = manifest.runtime.max_parallel_tasks > 3;
  if (hasManySteps) agentScore += 1;

  // Make decision
  const totalScore = agentScore + n8nScore;
  const confidence = totalScore > 0 ? Math.max(agentScore, n8nScore) / totalScore : 0.5;

  if (agentScore > n8nScore) {
    return {
      destination: "agent-swarm",
      reasoning: `Task requires AI processing (agent score: ${agentScore}, n8n score: ${n8nScore})`,
      confidence,
    };
  } else if (n8nScore > agentScore) {
    return {
      destination: "n8n",
      reasoning: `Task is integration-focused (agent score: ${agentScore}, n8n score: ${n8nScore})`,
      confidence,
    };
  } else {
    // Tie - default to agent swarm for complex reasoning
    return {
      destination: "agent-swarm",
      reasoning: `Tie score - defaulting to agent swarm for reasoning capability`,
      confidence: 0.5,
    };
  }
}

/**
 * Build N8N webhook payload
 */
export function buildN8NPayload(
  manifest: AgentManifest,
  n8nWebhookUrl: string
): N8NWebhookPayload {
  // Extract relevant data from manifest
  const payload: Record<string, any> = {
    task_id: manifest.manifestId,
    task_description: manifest.instructions.task_description,
    agent_type: manifest.runtime.agent_type,
    context: manifest.context,
    timestamp: new Date().toISOString(),
  };

  // Add project-specific fields if available
  if (manifest.context.project) {
    payload.project_id = manifest.context.project.id;
  }

  if (manifest.context.session) {
    payload.user_id = manifest.context.session.userId;
  }

  return {
    webhook_url: n8nWebhookUrl,
    payload,
    metadata: {
      source: "prospect-pal-agent-swarm",
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Send webhook to N8N
 */
export async function sendToN8N(
  n8nPayload: N8NWebhookPayload
): Promise<{ success: boolean; response?: any; error?: string }> {
  try {
    const response = await fetch(n8nPayload.webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(n8nPayload.payload),
    });

    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      response: data,
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Hybrid Routing - Can use both
 */
export interface HybridRoute {
  use_agent_swarm: boolean;
  use_n8n: boolean;
  sequence: "agent-first" | "n8n-first" | "parallel";
  reasoning: string;
}

export function routeHybrid(
  manifest: AgentManifest,
  phase: PhaseClassification
): HybridRoute {
  const desc = manifest.instructions.task_description.toLowerCase();

  // Patterns that benefit from both
  const needsAIProcessing =
    /\b(analyze|research|generate|write)\b/i.test(desc);
  const needsIntegration =
    /\b(crm|send|notify|enroll|update)\b/i.test(desc);

  if (needsAIProcessing && needsIntegration) {
    return {
      use_agent_swarm: true,
      use_n8n: true,
      sequence: "agent-first",
      reasoning: "Task needs AI processing followed by CRM/email integration",
    };
  }

  if (needsAIProcessing) {
    return {
      use_agent_swarm: true,
      use_n8n: false,
      sequence: "agent-first",
      reasoning: "Task is AI-heavy, no integration needed",
    };
  }

  if (needsIntegration) {
    return {
      use_agent_swarm: false,
      use_n8n: true,
      sequence: "n8n-first",
      reasoning: "Task is integration-only",
    };
  }

  // Default
  return {
    use_agent_swarm: true,
    use_n8n: false,
    sequence: "agent-first",
    reasoning: "Default to agent processing",
  };
}
