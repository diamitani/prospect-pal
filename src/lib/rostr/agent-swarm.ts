/**
 * Agent Swarm Orchestrator
 * Coordinates multiple agents using ROSTR framework
 */

import { v4 as uuidv4 } from "uuid";
import type { AgentManifest } from "./pal-compiler";
import type { PhaseClassification, PriorityScore, Agent } from "./npao-classifier";
import { classifyPhase, calculatePriority, allocateAgent } from "./npao-classifier";
import { loadSkill, listAvailableSkills, type Skill } from "./skill-loader";
import {
  loadAgentSession,
  saveAgentSession,
  generateSessionId,
} from "../agent-session";

// Re-export orchestration patterns for external use
export {
  OrchestrationPatterns,
  createPatterns,
  fanOut,
  pipeline,
  conditional,
  retry,
  timeout,
  aggregate,
  race,
  type OrchestrationResult,
  type PipelineStage,
  type ConditionFn,
  type ReducerFn,
  type BackoffConfig,
} from "./orchestration-patterns";

/**
 * Session context for task execution
 */
export interface SessionContext {
  sessionId: string;
  userId: string;
  conversationHistory: Array<{ role: string; content: string }>;
  metadata?: Record<string, unknown>;
}

export interface SwarmTask {
  id: string;
  manifest: AgentManifest;
  phase: PhaseClassification;
  priority: PriorityScore;
  allocation?: {
    agentId?: string;
    allocation_score: number;
  };
  status: "pending" | "running" | "completed" | "failed";
  result?: any;
  error?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  sessionContext?: SessionContext;
}

export interface SwarmOrchestration {
  id: string;
  tasks: SwarmTask[];
  pattern: "sequential" | "parallel" | "fan-out" | "fan-in" | "conditional";
  status: "pending" | "running" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
}

/**
 * Agent Registry - Available Agents
 */
export class AgentRegistry {
  private agents: Map<string, Agent> = new Map();
  private skills: Map<string, Skill> = new Map();
  private initialized: boolean = false;

  constructor() {
    this.registerDefaultAgents();
  }

  private registerDefaultAgents() {
    const defaultAgents: Agent[] = [
      {
        id: "orchestrator-1",
        name: "Orchestrator Agent",
        type: "orchestrator",
        phases: ["Design", "Development"],
        tools: ["Read", "Write", "Bash", "WebFetch"],
        current_tasks: 0,
        max_parallel_tasks: 3,
        performance: {
          tasks_completed: 0,
          avg_completion_minutes: 180,
          success_rate: 0.95,
        },
      },
      {
        id: "analyst-1",
        name: "Analyst Agent",
        type: "analyst",
        phases: ["Debugging", "PreD"],
        tools: ["Read", "Bash", "WebFetch"],
        current_tasks: 0,
        max_parallel_tasks: 5,
        performance: {
          tasks_completed: 0,
          avg_completion_minutes: 15,
          success_rate: 0.92,
        },
      },
      {
        id: "copywriter-1",
        name: "Copywriter Agent",
        type: "copywriter",
        phases: ["Development"],
        tools: ["Read", "Write", "WebFetch"],
        current_tasks: 0,
        max_parallel_tasks: 5,
        performance: {
          tasks_completed: 0,
          avg_completion_minutes: 12,
          success_rate: 0.94,
        },
      },
      {
        id: "researcher-1",
        name: "Researcher Agent",
        type: "researcher",
        phases: ["PreD", "Design"],
        tools: ["Read", "WebFetch", "Bash"],
        current_tasks: 0,
        max_parallel_tasks: 5,
        performance: {
          tasks_completed: 0,
          avg_completion_minutes: 20,
          success_rate: 0.90,
        },
      },
    ];

    defaultAgents.forEach((agent) => this.agents.set(agent.id, agent));
  }

  /**
   * Load and register agents from skill files dynamically
   */
  async loadSkillBasedAgents(): Promise<void> {
    if (this.initialized) return;

    try {
      const availableSkills = listAvailableSkills();

      for (const skillName of availableSkills) {
        try {
          const skill = await loadSkill(skillName);
          this.skills.set(skillName, skill);

          // Create agent from skill
          const agentType = this.inferAgentTypeFromSkill(skill);
          const agentId = `skill-${skillName}`;

          const agent: Agent = {
            id: agentId,
            name: skill.name,
            type: agentType,
            phases: this.inferPhasesFromSkill(skill),
            tools: skill.tools,
            current_tasks: 0,
            max_parallel_tasks: skill.metadata.complexity === "high" ? 2 : 5,
            performance: {
              tasks_completed: 0,
              avg_completion_minutes: skill.metadata.estimatedTokens
                ? Math.ceil(skill.metadata.estimatedTokens / 1000)
                : 15,
              success_rate: 0.90,
            },
          };

          this.agents.set(agentId, agent);
        } catch (err) {
          console.warn(`Failed to load skill ${skillName}:`, err);
        }
      }

      this.initialized = true;
    } catch (err) {
      console.error("Failed to load skill-based agents:", err);
    }
  }

  /**
   * Infer agent type from skill metadata
   */
  private inferAgentTypeFromSkill(skill: Skill): string {
    const domain = skill.metadata.domain?.toLowerCase() || "";
    const name = skill.name.toLowerCase();

    if (domain.includes("research") || name.includes("research")) return "researcher";
    if (domain.includes("copy") || name.includes("copy") || name.includes("writer")) return "copywriter";
    if (domain.includes("analyze") || name.includes("analyst")) return "analyst";
    if (domain.includes("architect") || name.includes("architect")) return "architect";
    return "orchestrator";
  }

  /**
   * Infer phases from skill complexity and domain
   */
  private inferPhasesFromSkill(skill: Skill): PhaseClassification["phase"][] {
    const domain = skill.metadata.domain?.toLowerCase() || "";
    const complexity = skill.metadata.complexity;

    if (domain.includes("research")) return ["PreD", "Design"];
    if (domain.includes("debug")) return ["Debugging"];
    if (domain.includes("deploy")) return ["Deployment"];
    if (complexity === "high") return ["Design", "Development"];
    return ["Development"];
  }

  /**
   * Get skill by name
   */
  getSkill(skillName: string): Skill | undefined {
    return this.skills.get(skillName);
  }

  /**
   * Get all loaded skills
   */
  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  updateAgentLoad(agentId: string, delta: number) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.current_tasks = Math.max(0, agent.current_tasks + delta);
    }
  }

  updateAgentPerformance(
    agentId: string,
    durationMinutes: number,
    success: boolean
  ) {
    const agent = this.agents.get(agentId);
    if (agent) {
      const perf = agent.performance;
      perf.tasks_completed += 1;
      perf.avg_completion_minutes =
        (perf.avg_completion_minutes * (perf.tasks_completed - 1) +
          durationMinutes) /
        perf.tasks_completed;
      perf.success_rate =
        (perf.success_rate * (perf.tasks_completed - 1) +
          (success ? 1 : 0)) /
        perf.tasks_completed;
    }
  }
}

/**
 * Task Queue with Priority Sorting
 */
export class TaskQueue {
  private queue: SwarmTask[] = [];

  enqueue(task: SwarmTask) {
    this.queue.push(task);
    // Sort by priority (highest first)
    this.queue.sort((a, b) => b.priority.total - a.priority.total);
  }

  dequeue(): SwarmTask | undefined {
    return this.queue.shift();
  }

  peek(): SwarmTask | undefined {
    return this.queue[0];
  }

  size(): number {
    return this.queue.length;
  }

  getTasks(): SwarmTask[] {
    return [...this.queue];
  }
}

/**
 * Agent Swarm Orchestrator
 */
export class AgentSwarm {
  private registry: AgentRegistry;
  private queue: TaskQueue;
  private runningTasks: Map<string, SwarmTask> = new Map();
  private completedTasks: Map<string, SwarmTask> = new Map();
  private sessionContextCache: Map<string, SessionContext> = new Map();

  constructor() {
    this.registry = new AgentRegistry();
    this.queue = new TaskQueue();
  }

  /**
   * Initialize skill-based agents (call once at startup)
   */
  async initialize(): Promise<void> {
    await this.registry.loadSkillBasedAgents();
  }

  /**
   * Get or create session context
   */
  async getSessionContext(
    sessionId: string,
    userId: string = "anonymous"
  ): Promise<SessionContext> {
    // Check cache first
    if (this.sessionContextCache.has(sessionId)) {
      return this.sessionContextCache.get(sessionId)!;
    }

    // Load from persistent storage
    try {
      const history = await loadAgentSession(userId, sessionId);
      const context: SessionContext = {
        sessionId,
        userId,
        conversationHistory: history.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };
      this.sessionContextCache.set(sessionId, context);
      return context;
    } catch {
      // Create new session context
      const context: SessionContext = {
        sessionId,
        userId,
        conversationHistory: [],
      };
      this.sessionContextCache.set(sessionId, context);
      return context;
    }
  }

  /**
   * Update session context with new messages
   */
  async updateSessionContext(
    sessionId: string,
    userMessage: string,
    assistantMessage: string
  ): Promise<void> {
    const context = this.sessionContextCache.get(sessionId);
    if (!context) return;

    context.conversationHistory.push(
      { role: "user", content: userMessage },
      { role: "assistant", content: assistantMessage }
    );

    // Persist to storage
    try {
      await saveAgentSession(
        context.userId,
        sessionId,
        context.conversationHistory.map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
          timestamp: new Date().toISOString(),
        }))
      );
    } catch (err) {
      console.warn("Failed to persist session:", err);
    }
  }

  /**
   * Submit task to swarm
   */
  async submitTask(
    manifest: AgentManifest,
    sessionContext?: SessionContext
  ): Promise<SwarmTask> {
    // Classify phase
    const phase = classifyPhase(manifest);

    // Calculate priority
    const priority = calculatePriority(phase, manifest);

    // Create task
    const task: SwarmTask = {
      id: uuidv4(),
      manifest,
      phase,
      priority,
      status: "pending",
      createdAt: new Date().toISOString(),
      sessionContext,
    };

    // Try immediate allocation if high priority
    if (priority.threshold === "immediate") {
      const allocation = allocateAgent(
        manifest,
        phase,
        this.registry.getAllAgents()
      );
      task.allocation = allocation;

      if (allocation.agentId) {
        await this.executeTask(task);
      } else {
        this.queue.enqueue(task);
      }
    } else {
      this.queue.enqueue(task);
    }

    return task;
  }

  /**
   * Execute task with allocated agent
   */
  private async executeTask(task: SwarmTask): Promise<void> {
    task.status = "running";
    task.startedAt = new Date().toISOString();
    this.runningTasks.set(task.id, task);

    const agentId = task.allocation?.agentId;
    if (agentId) {
      this.registry.updateAgentLoad(agentId, 1);
    }

    try {
      // Execute agent via AWS Bedrock
      const result = await this.executeAgentViaBedrock(task);

      task.status = "completed";
      task.result = result;
      task.completedAt = new Date().toISOString();

      // Update agent performance
      if (agentId && task.startedAt) {
        const durationMs =
          new Date(task.completedAt!).getTime() -
          new Date(task.startedAt).getTime();
        const durationMinutes = durationMs / 60000;
        this.registry.updateAgentPerformance(agentId, durationMinutes, true);
        this.registry.updateAgentLoad(agentId, -1);
      }
    } catch (error) {
      task.status = "failed";
      task.error = String(error);

      // Update agent performance (failure)
      if (agentId && task.startedAt) {
        const durationMs =
          new Date().getTime() - new Date(task.startedAt).getTime();
        const durationMinutes = durationMs / 60000;
        this.registry.updateAgentPerformance(agentId, durationMinutes, false);
        this.registry.updateAgentLoad(agentId, -1);
      }
    }

    this.runningTasks.delete(task.id);
    this.completedTasks.set(task.id, task);

    // Process next task in queue
    await this.processQueue();
  }

  /**
   * Process queued tasks
   */
  async processQueue(): Promise<void> {
    while (this.queue.size() > 0) {
      const task = this.queue.peek();
      if (!task) break;

      // Try to allocate agent
      const allocation = allocateAgent(
        task.manifest,
        task.phase,
        this.registry.getAllAgents()
      );

      if (allocation.agentId) {
        // Agent available - dequeue and execute
        this.queue.dequeue();
        task.allocation = allocation;
        await this.executeTask(task);
      } else {
        // No agent available - wait
        break;
      }
    }
  }

  /**
   * Execute agent via AWS Bedrock
   */
  private async executeAgentViaBedrock(task: SwarmTask): Promise<any> {
    // Import dynamically to avoid circular deps
    const { executeWithRetry } = await import("./bedrock-executor");

    // Include session context in manifest if available
    const manifestWithContext = task.sessionContext
      ? {
          ...task.manifest,
          context: {
            ...task.manifest.context,
            conversationHistory: task.sessionContext.conversationHistory,
            sessionId: task.sessionContext.sessionId,
          },
        }
      : task.manifest;

    const result = await executeWithRetry(manifestWithContext, 3);

    if (!result.success) {
      throw new Error(result.error || "Agent execution failed");
    }

    // Update session context with result if available
    if (task.sessionContext && result.output) {
      await this.updateSessionContext(
        task.sessionContext.sessionId,
        task.manifest.instructions.task_description,
        result.output
      );
    }

    return {
      task_id: task.id,
      phase: task.phase.phase,
      agent_type: task.manifest.runtime.agent_type,
      output: result.output,
      usage: result.usage,
      duration_ms: result.duration_ms,
      session_id: task.sessionContext?.sessionId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get task status
   */
  getTask(taskId: string): SwarmTask | undefined {
    return (
      this.runningTasks.get(taskId) ||
      this.completedTasks.get(taskId) ||
      this.queue.getTasks().find((t) => t.id === taskId)
    );
  }

  /**
   * Get swarm status
   */
  getStatus() {
    return {
      queue_size: this.queue.size(),
      running_tasks: this.runningTasks.size,
      completed_tasks: this.completedTasks.size,
      active_sessions: this.sessionContextCache.size,
      agents: this.registry.getAllAgents().map((a) => ({
        id: a.id,
        name: a.name,
        current_load: a.current_tasks,
        max_capacity: a.max_parallel_tasks,
        performance: a.performance,
      })),
      skills: this.registry.getAllSkills().map((s) => ({
        name: s.name,
        description: s.description,
        tools: s.tools,
        domain: s.metadata.domain,
        complexity: s.metadata.complexity,
      })),
    };
  }

  /**
   * Get registry for external access
   */
  getRegistry(): AgentRegistry {
    return this.registry;
  }

  /**
   * Orchestration Patterns
   */

  async sequential(manifests: AgentManifest[]): Promise<SwarmOrchestration> {
    const orchestrationId = uuidv4();
    const tasks: SwarmTask[] = [];

    for (const manifest of manifests) {
      const task = await this.submitTask(manifest);
      tasks.push(task);

      // Wait for completion
      while (task.status === "running" || task.status === "pending") {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (task.status === "failed") {
        break; // Stop on failure
      }
    }

    return {
      id: orchestrationId,
      tasks,
      pattern: "sequential",
      status: tasks.every((t) => t.status === "completed")
        ? "completed"
        : "failed",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
  }

  async parallel(manifests: AgentManifest[]): Promise<SwarmOrchestration> {
    const orchestrationId = uuidv4();
    const tasks: SwarmTask[] = [];

    // Submit all tasks
    for (const manifest of manifests) {
      const task = await this.submitTask(manifest);
      tasks.push(task);
    }

    // Wait for all to complete
    while (tasks.some((t) => t.status === "running" || t.status === "pending")) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return {
      id: orchestrationId,
      tasks,
      pattern: "parallel",
      status: tasks.every((t) => t.status === "completed")
        ? "completed"
        : "failed",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
  }
}

// Singleton instance
export const agentSwarm = new AgentSwarm();
