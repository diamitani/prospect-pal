/**
 * PAL (Prompt Abstraction Layer) Compiler
 * Transforms natural language intent into strict agent runtime manifests
 */

import { v4 as uuidv4 } from "uuid";

export interface IntentExtraction {
  primary_intent: string;
  domain:
    | "code"
    | "design"
    | "research"
    | "ops"
    | "sales"
    | "content"
    | "deploy"
    | "debug"
    | "automation";
  subject: string;
  constraints: string[];
  desired_output: string;
  urgency: "immediate" | "queued" | "scheduled";
  ambiguity_score: number;
}

export interface AgentManifest {
  manifestId: string;
  runtime: {
    agent_type:
      | "builder"
      | "researcher"
      | "reviewer"
      | "designer"
      | "deployer"
      | "debugger"
      | "orchestrator"
      | "analyst"
      | "copywriter";
    model: string;
    temperature: number;
    max_parallel_tasks: number;
    timeout_seconds: number;
  };
  instructions: {
    system: string;
    behavior_profile: "analytical" | "creative" | "operational" | "investigative";
    task_description: string;
    completion_criteria: string[];
    escalation_policy: "auto-proceed" | "require-approval" | "human-in-loop";
  };
  tools_enabled: {
    allow: string[];
    deny: string[];
  };
  memory: {
    mode: "session" | "project" | "persistent";
    context_sources: string[];
    save_triggers: string[];
  };
  output: {
    format: "markdown" | "json" | "code" | "action";
    destination: string;
    verification: "none" | "test" | "human-review";
  };
  context: {
    project?: any;
    session?: any;
    user?: any;
  };
}

/**
 * Stage 1: Extract Intent from Natural Language
 */
export function extractIntent(userInput: string, context?: any): IntentExtraction {
  // Simple keyword-based extraction (in production, use LLM)
  const input = userInput.toLowerCase();

  let domain: IntentExtraction["domain"] = "research";
  let urgency: IntentExtraction["urgency"] = "queued";

  // Domain classification
  if (input.includes("build") || input.includes("implement") || input.includes("create workflow")) {
    domain = "automation";
  } else if (input.includes("research") || input.includes("analyze") || input.includes("find")) {
    domain = "research";
  } else if (input.includes("write") || input.includes("email") || input.includes("copy")) {
    domain = "content";
  } else if (input.includes("deploy") || input.includes("launch")) {
    domain = "deploy";
  } else if (input.includes("fix") || input.includes("debug") || input.includes("error")) {
    domain = "debug";
  }

  // Urgency detection
  if (input.includes("urgent") || input.includes("asap") || input.includes("immediately")) {
    urgency = "immediate";
  } else if (input.includes("schedule") || input.includes("later")) {
    urgency = "scheduled";
  }

  // Calculate ambiguity score
  const hasVerb = /\b(build|create|research|analyze|write|deploy|fix)\b/.test(input);
  const hasObject = input.split(" ").length >= 3;
  const ambiguity_score = (hasVerb && hasObject) ? 0.2 : 0.7;

  return {
    primary_intent: userInput.substring(0, 100),
    domain,
    subject: context?.subject || "general task",
    constraints: context?.constraints || [],
    desired_output: context?.desired_output || "completed task",
    urgency,
    ambiguity_score,
  };
}

/**
 * Stage 2: Inject Context from Reference Hub
 */
export async function injectContext(
  intent: IntentExtraction,
  projectId?: string,
  userId?: string
): Promise<any> {
  // In production, fetch from DynamoDB/vector DB
  const context: any = {
    session: {
      projectId,
      userId,
      timestamp: new Date().toISOString(),
    },
    project: null,
    org: null,
  };

  // Load project context if available
  if (projectId) {
    // Fetch from DynamoDB - stub for now
    context.project = {
      id: projectId,
      // Would load: architecture, conventions, recent decisions
    };
  }

  return context;
}

/**
 * Stage 3: Semantic Enhancement
 */
export function enhanceInstruction(
  intent: IntentExtraction,
  context: any
): string {
  let enhanced = intent.primary_intent;

  // Add precision
  if (intent.domain === "automation") {
    enhanced += "\n\nDeliver:\n";
    enhanced += "- Complete n8n workflow JSON\n";
    enhanced += "- Node configuration for all steps\n";
    enhanced += "- Error handling and retry logic\n";
    enhanced += "- Deployment instructions\n";
  }

  if (intent.domain === "research") {
    enhanced += "\n\nDeliver:\n";
    enhanced += "- Structured findings with sources (credibility tier)\n";
    enhanced += "- Confidence score per claim (≥0.8 target)\n";
    enhanced += "- Gaps or uncertainties clearly marked\n";
  }

  if (intent.domain === "content") {
    enhanced += "\n\nDeliver:\n";
    enhanced += "- Email copy following PAS framework\n";
    enhanced += "- Personalization variables marked {{ }}\n";
    enhanced += "- 3-4 variations for A/B testing\n";
  }

  // Add domain best practices
  if (context.project?.conventions) {
    enhanced += `\n\nFollow project conventions: ${context.project.conventions}`;
  }

  // Remove hedging
  enhanced = enhanced.replace(/maybe we should|perhaps|possibly/gi, "");

  return enhanced.trim();
}

/**
 * Stage 4: Compile Runtime Manifest
 */
export function compileManifest(
  intent: IntentExtraction,
  enhancedInstruction: string,
  context: any
): AgentManifest {
  const manifestId = uuidv4();

  // Select agent type based on domain
  const agentTypeMap: Record<string, AgentManifest["runtime"]["agent_type"]> = {
    automation: "orchestrator",
    research: "researcher",
    content: "copywriter",
    debug: "debugger",
    deploy: "deployer",
    design: "designer",
    code: "builder",
  };

  const agent_type = agentTypeMap[intent.domain] || "researcher";

  // Model selection
  const model = intent.domain === "automation" ? "claude-sonnet-4" : "claude-sonnet-4";
  const temperature = intent.domain === "content" ? 0.7 : 0.2;

  return {
    manifestId,
    runtime: {
      agent_type,
      model,
      temperature,
      max_parallel_tasks: intent.urgency === "immediate" ? 5 : 3,
      timeout_seconds: 300,
    },
    instructions: {
      system: `/Users/patmini/prospect-pal/.agents/skills/prospect-pal-${agent_type}/SKILL.md`,
      behavior_profile:
        intent.domain === "content" ? "creative" :
        intent.domain === "research" ? "analytical" :
        intent.domain === "automation" ? "operational" : "investigative",
      task_description: enhancedInstruction,
      completion_criteria: [
        "All requested deliverables provided",
        "Output format matches specification",
        "Quality checks passed",
      ],
      escalation_policy: intent.urgency === "immediate" ? "auto-proceed" : "require-approval",
    },
    tools_enabled: {
      allow: ["Read", "Write", "Bash", "WebFetch"],
      deny: ["destructive_operations"],
    },
    memory: {
      mode: "project",
      context_sources: [
        `projects/${context.session.projectId}`,
        `users/${context.session.userId}`,
      ],
      save_triggers: ["decisions", "learnings", "artifacts"],
    },
    output: {
      format: intent.domain === "automation" ? "json" : "markdown",
      destination: `return`,
      verification: intent.urgency === "immediate" ? "none" : "human-review",
    },
    context,
  };
}

/**
 * Full PAL Pipeline
 */
export async function compilePAL(
  userInput: string,
  projectId?: string,
  userId?: string,
  additionalContext?: any,
  agentTypeHint?: string
): Promise<AgentManifest> {
  // Stage 1: Extract intent
  const intent = extractIntent(userInput, additionalContext);

  // Stage 2: Inject context
  const context = await injectContext(intent, projectId, userId);

  // Stage 3: Enhance instruction
  const enhancedInstruction = enhanceInstruction(intent, context);

  // Stage 4: Compile manifest
  const manifest = compileManifest(intent, enhancedInstruction, context);

  // Override agent type if hint provided
  if (agentTypeHint) {
    const validTypes: AgentManifest["runtime"]["agent_type"][] = [
      "builder",
      "researcher",
      "reviewer",
      "designer",
      "deployer",
      "debugger",
      "orchestrator",
      "analyst",
      "copywriter",
    ];

    if (validTypes.includes(agentTypeHint as any)) {
      manifest.runtime.agent_type = agentTypeHint as AgentManifest["runtime"]["agent_type"];
    } else if (agentTypeHint === "architect") {
      // Map "architect" to "designer"
      manifest.runtime.agent_type = "designer";
    }
  }

  return manifest;
}
