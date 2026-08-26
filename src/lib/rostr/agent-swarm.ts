/**
 * Agent Swarm Orchestrator
 * Coordinates multiple agents using ROSTR framework
 */

import { v4 as uuidv4 } from "uuid";
import type { AgentManifest } from "./pal-compiler";
import type { PhaseClassification, PriorityScore, Agent } from "./npao-classifier";
import { classifyPhase, calculatePriority, allocateAgent } from "./npao-classifier";

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

  constructor() {
    this.registry = new AgentRegistry();
    this.queue = new TaskQueue();
  }

  /**
   * Submit task to swarm
   */
  async submitTask(manifest: AgentManifest): Promise<SwarmTask> {
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

    const result = await executeWithRetry(task.manifest, 3);

    if (!result.success) {
      throw new Error(result.error || "Agent execution failed");
    }

    return {
      task_id: task.id,
      phase: task.phase.phase,
      agent_type: task.manifest.runtime.agent_type,
      output: result.output,
      usage: result.usage,
      duration_ms: result.duration_ms,
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
      agents: this.registry.getAllAgents().map((a) => ({
        id: a.id,
        name: a.name,
        current_load: a.current_tasks,
        max_capacity: a.max_parallel_tasks,
        performance: a.performance,
      })),
    };
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
