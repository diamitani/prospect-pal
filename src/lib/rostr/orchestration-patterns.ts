/**
 * Orchestration Patterns for Agent Swarm
 * Advanced patterns for coordinating multi-agent task execution
 */

import type { AgentManifest } from "./pal-compiler";
import type { SwarmTask } from "./agent-swarm";
import { AgentSwarm } from "./agent-swarm";

/**
 * Result from any orchestration pattern
 */
export interface OrchestrationResult {
  success: boolean;
  results: any[];
  errors: string[];
  duration_ms: number;
  pattern: string;
  metadata?: {
    attempts?: number;
    stages_completed?: number;
    branch_taken?: "true" | "false";
    aggregation_count?: number;
  };
}

/**
 * Stage definition for pipeline pattern
 */
export interface PipelineStage {
  name: string;
  manifest: AgentManifest;
  transform?: (previousResult: any) => Partial<AgentManifest>;
}

/**
 * Condition function for conditional pattern
 */
export type ConditionFn = (result: any) => boolean | Promise<boolean>;

/**
 * Reducer function for aggregate pattern
 */
export type ReducerFn<T = any> = (results: T[]) => T;

/**
 * Backoff configuration for retry pattern
 */
export interface BackoffConfig {
  initial_ms: number;
  multiplier: number;
  max_ms: number;
}

/**
 * Task wrapper with abort support
 */
interface AbortableTask<T> {
  promise: Promise<T>;
  abort: () => void;
}

/**
 * Create an abortable delay
 */
function abortableDelay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timeout = setTimeout(resolve, ms);

    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

/**
 * Wrap a promise with timeout
 */
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  signal?: AbortSignal
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timeout = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);

    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });

    promise
      .then((result) => {
        clearTimeout(timeout);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeout);
        reject(error);
      });
  });
}

/**
 * Check if error is an abort error
 */
function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/**
 * Orchestration Patterns class - composes with AgentSwarm
 */
export class OrchestrationPatterns {
  private swarm: AgentSwarm;

  constructor(swarm?: AgentSwarm) {
    this.swarm = swarm || new AgentSwarm();
  }

  /**
   * Fan-Out Pattern
   * Run the same task with N agents in parallel, aggregate results
   */
  async fanOut(
    manifest: AgentManifest,
    count: number,
    signal?: AbortSignal
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();
    const results: any[] = [];
    const errors: string[] = [];

    if (signal?.aborted) {
      return {
        success: false,
        results: [],
        errors: ["Operation aborted before start"],
        duration_ms: 0,
        pattern: "fan-out",
      };
    }

    try {
      // Create N copies of the task with unique identifiers
      const tasks = Array.from({ length: count }, (_, index) => ({
        ...manifest,
        instructions: {
          ...manifest.instructions,
          task_description: `[Agent ${index + 1}/${count}] ${manifest.instructions.task_description}`,
        },
      }));

      // Submit all tasks in parallel
      const taskPromises = tasks.map((task) =>
        this.executeWithAbort(task, signal)
      );

      // Wait for all to settle
      const settlements = await Promise.allSettled(taskPromises);

      for (const settlement of settlements) {
        if (settlement.status === "fulfilled") {
          const task = settlement.value;
          if (task.status === "completed") {
            results.push(task.result);
          } else if (task.status === "failed") {
            errors.push(task.error || "Unknown error");
          }
        } else {
          if (!isAbortError(settlement.reason)) {
            errors.push(String(settlement.reason));
          }
        }
      }

      return {
        success: results.length > 0,
        results,
        errors,
        duration_ms: Date.now() - startTime,
        pattern: "fan-out",
        metadata: {
          aggregation_count: results.length,
        },
      };
    } catch (error) {
      if (isAbortError(error)) {
        return {
          success: false,
          results,
          errors: [...errors, "Operation aborted"],
          duration_ms: Date.now() - startTime,
          pattern: "fan-out",
        };
      }
      throw error;
    }
  }

  /**
   * Pipeline Pattern
   * Execute stages sequentially, passing data between stages
   */
  async pipeline(
    stages: PipelineStage[],
    initialData?: any,
    signal?: AbortSignal
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();
    const results: any[] = [];
    const errors: string[] = [];
    let stagesCompleted = 0;
    let currentData = initialData;

    if (signal?.aborted) {
      return {
        success: false,
        results: [],
        errors: ["Operation aborted before start"],
        duration_ms: 0,
        pattern: "pipeline",
        metadata: { stages_completed: 0 },
      };
    }

    try {
      for (const stage of stages) {
        if (signal?.aborted) {
          errors.push(`Pipeline aborted at stage "${stage.name}"`);
          break;
        }

        // Transform manifest based on previous result if transform function provided
        let manifest = stage.manifest;
        if (stage.transform && currentData !== undefined) {
          const updates = stage.transform(currentData);
          manifest = {
            ...manifest,
            ...updates,
            instructions: {
              ...manifest.instructions,
              ...updates.instructions,
            },
          };
        }

        // Execute stage
        const task = await this.executeWithAbort(manifest, signal);

        if (task.status === "completed") {
          results.push({
            stage: stage.name,
            result: task.result,
          });
          currentData = task.result;
          stagesCompleted++;
        } else {
          errors.push(`Stage "${stage.name}" failed: ${task.error || "Unknown error"}`);
          break; // Stop pipeline on failure
        }
      }

      return {
        success: stagesCompleted === stages.length,
        results,
        errors,
        duration_ms: Date.now() - startTime,
        pattern: "pipeline",
        metadata: {
          stages_completed: stagesCompleted,
        },
      };
    } catch (error) {
      if (isAbortError(error)) {
        return {
          success: false,
          results,
          errors: [...errors, "Pipeline aborted"],
          duration_ms: Date.now() - startTime,
          pattern: "pipeline",
          metadata: { stages_completed: stagesCompleted },
        };
      }
      throw error;
    }
  }

  /**
   * Conditional Pattern
   * Branch execution based on a condition evaluated against a result
   */
  async conditional(
    evaluateManifest: AgentManifest,
    condition: ConditionFn,
    ifTrueManifest: AgentManifest,
    ifFalseManifest: AgentManifest,
    signal?: AbortSignal
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();
    const results: any[] = [];
    const errors: string[] = [];
    let branchTaken: "true" | "false" | undefined;

    if (signal?.aborted) {
      return {
        success: false,
        results: [],
        errors: ["Operation aborted before start"],
        duration_ms: 0,
        pattern: "conditional",
      };
    }

    try {
      // Execute evaluation task
      const evalTask = await this.executeWithAbort(evaluateManifest, signal);

      if (evalTask.status !== "completed") {
        return {
          success: false,
          results: [],
          errors: [`Condition evaluation failed: ${evalTask.error || "Unknown error"}`],
          duration_ms: Date.now() - startTime,
          pattern: "conditional",
        };
      }

      results.push({
        stage: "evaluation",
        result: evalTask.result,
      });

      // Evaluate condition
      const conditionResult = await condition(evalTask.result);
      branchTaken = conditionResult ? "true" : "false";

      // Execute appropriate branch
      const branchManifest = conditionResult ? ifTrueManifest : ifFalseManifest;
      const branchTask = await this.executeWithAbort(branchManifest, signal);

      if (branchTask.status === "completed") {
        results.push({
          stage: `branch_${branchTaken}`,
          result: branchTask.result,
        });
      } else {
        errors.push(`Branch execution failed: ${branchTask.error || "Unknown error"}`);
      }

      return {
        success: branchTask.status === "completed",
        results,
        errors,
        duration_ms: Date.now() - startTime,
        pattern: "conditional",
        metadata: {
          branch_taken: branchTaken,
        },
      };
    } catch (error) {
      if (isAbortError(error)) {
        return {
          success: false,
          results,
          errors: [...errors, "Conditional execution aborted"],
          duration_ms: Date.now() - startTime,
          pattern: "conditional",
          metadata: branchTaken ? { branch_taken: branchTaken } : undefined,
        };
      }
      throw error;
    }
  }

  /**
   * Retry Pattern
   * Retry a task with exponential backoff on failure
   */
  async retry(
    manifest: AgentManifest,
    maxAttempts: number,
    backoff: BackoffConfig = { initial_ms: 1000, multiplier: 2, max_ms: 30000 },
    signal?: AbortSignal
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let attempts = 0;
    let currentDelay = backoff.initial_ms;

    if (signal?.aborted) {
      return {
        success: false,
        results: [],
        errors: ["Operation aborted before start"],
        duration_ms: 0,
        pattern: "retry",
        metadata: { attempts: 0 },
      };
    }

    while (attempts < maxAttempts) {
      attempts++;

      try {
        const task = await this.executeWithAbort(manifest, signal);

        if (task.status === "completed") {
          return {
            success: true,
            results: [task.result],
            errors,
            duration_ms: Date.now() - startTime,
            pattern: "retry",
            metadata: {
              attempts,
            },
          };
        }

        // Task failed but did not throw
        errors.push(`Attempt ${attempts}/${maxAttempts}: ${task.error || "Task failed"}`);
      } catch (error) {
        if (isAbortError(error)) {
          return {
            success: false,
            results: [],
            errors: [...errors, "Retry aborted"],
            duration_ms: Date.now() - startTime,
            pattern: "retry",
            metadata: { attempts },
          };
        }
        errors.push(`Attempt ${attempts}/${maxAttempts}: ${String(error)}`);
      }

      // Check if we should retry
      if (attempts < maxAttempts) {
        try {
          await abortableDelay(currentDelay, signal);
          currentDelay = Math.min(currentDelay * backoff.multiplier, backoff.max_ms);
        } catch (error) {
          if (isAbortError(error)) {
            return {
              success: false,
              results: [],
              errors: [...errors, "Retry aborted during backoff"],
              duration_ms: Date.now() - startTime,
              pattern: "retry",
              metadata: { attempts },
            };
          }
          throw error;
        }
      }
    }

    return {
      success: false,
      results: [],
      errors,
      duration_ms: Date.now() - startTime,
      pattern: "retry",
      metadata: {
        attempts,
      },
    };
  }

  /**
   * Timeout Pattern
   * Fail if task exceeds time limit
   */
  async timeout(
    manifest: AgentManifest,
    timeoutMs: number,
    signal?: AbortSignal
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();

    if (signal?.aborted) {
      return {
        success: false,
        results: [],
        errors: ["Operation aborted before start"],
        duration_ms: 0,
        pattern: "timeout",
      };
    }

    // Create combined abort controller
    const controller = new AbortController();
    const combinedSignal = controller.signal;

    // Forward external abort
    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const taskPromise = this.swarm.submitTask(manifest).then(async (task) => {
        // Poll for completion
        while (task.status === "pending" || task.status === "running") {
          if (combinedSignal.aborted) {
            throw new DOMException("Aborted", "AbortError");
          }
          await abortableDelay(100, combinedSignal);
          // Refresh task status
          const updatedTask = this.swarm.getTask(task.id);
          if (updatedTask) {
            task.status = updatedTask.status;
            task.result = updatedTask.result;
            task.error = updatedTask.error;
          }
        }
        return task;
      });

      const task = await withTimeout(taskPromise, timeoutMs, combinedSignal);

      return {
        success: task.status === "completed",
        results: task.status === "completed" ? [task.result] : [],
        errors: task.status === "failed" ? [task.error || "Task failed"] : [],
        duration_ms: Date.now() - startTime,
        pattern: "timeout",
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      if (isAbortError(error)) {
        return {
          success: false,
          results: [],
          errors: ["Operation aborted"],
          duration_ms: duration,
          pattern: "timeout",
        };
      }

      if (error instanceof Error && error.message.includes("timed out")) {
        return {
          success: false,
          results: [],
          errors: [`Task exceeded timeout of ${timeoutMs}ms`],
          duration_ms: duration,
          pattern: "timeout",
        };
      }

      return {
        success: false,
        results: [],
        errors: [String(error)],
        duration_ms: duration,
        pattern: "timeout",
      };
    }
  }

  /**
   * Aggregate Pattern
   * Run multiple tasks in parallel and reduce results
   */
  async aggregate<T = any>(
    manifests: AgentManifest[],
    reducer: ReducerFn<T>,
    signal?: AbortSignal
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();
    const results: T[] = [];
    const errors: string[] = [];

    if (signal?.aborted) {
      return {
        success: false,
        results: [],
        errors: ["Operation aborted before start"],
        duration_ms: 0,
        pattern: "aggregate",
      };
    }

    try {
      // Execute all tasks in parallel
      const taskPromises = manifests.map((manifest) =>
        this.executeWithAbort(manifest, signal)
      );

      const settlements = await Promise.allSettled(taskPromises);

      for (const settlement of settlements) {
        if (settlement.status === "fulfilled") {
          const task = settlement.value;
          if (task.status === "completed") {
            results.push(task.result as T);
          } else if (task.status === "failed") {
            errors.push(task.error || "Unknown error");
          }
        } else {
          if (!isAbortError(settlement.reason)) {
            errors.push(String(settlement.reason));
          }
        }
      }

      // Apply reducer if we have results
      let aggregatedResult: T | undefined;
      if (results.length > 0) {
        try {
          aggregatedResult = reducer(results);
        } catch (reducerError) {
          errors.push(`Reducer failed: ${String(reducerError)}`);
          return {
            success: false,
            results,
            errors,
            duration_ms: Date.now() - startTime,
            pattern: "aggregate",
            metadata: { aggregation_count: results.length },
          };
        }
      }

      return {
        success: results.length > 0 && errors.length === 0,
        results: aggregatedResult !== undefined ? [aggregatedResult] : results,
        errors,
        duration_ms: Date.now() - startTime,
        pattern: "aggregate",
        metadata: {
          aggregation_count: results.length,
        },
      };
    } catch (error) {
      if (isAbortError(error)) {
        return {
          success: false,
          results,
          errors: [...errors, "Aggregation aborted"],
          duration_ms: Date.now() - startTime,
          pattern: "aggregate",
          metadata: { aggregation_count: results.length },
        };
      }
      throw error;
    }
  }

  /**
   * Race Pattern
   * Run multiple tasks in parallel, return first successful result
   */
  async race(
    manifests: AgentManifest[],
    signal?: AbortSignal
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();
    const errors: string[] = [];

    if (signal?.aborted) {
      return {
        success: false,
        results: [],
        errors: ["Operation aborted before start"],
        duration_ms: 0,
        pattern: "race",
      };
    }

    // Create internal abort controller to cancel losers
    const controller = new AbortController();
    const raceSignal = controller.signal;

    // Forward external abort
    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const taskPromises = manifests.map(async (manifest, index) => {
        const task = await this.executeWithAbort(manifest, raceSignal);
        if (task.status === "completed") {
          return { index, task };
        }
        throw new Error(task.error || `Task ${index} failed`);
      });

      const winner = await Promise.race(taskPromises);

      // Abort remaining tasks
      controller.abort();

      return {
        success: true,
        results: [winner.task.result],
        errors,
        duration_ms: Date.now() - startTime,
        pattern: "race",
      };
    } catch (error) {
      controller.abort();

      if (isAbortError(error)) {
        return {
          success: false,
          results: [],
          errors: ["Race aborted"],
          duration_ms: Date.now() - startTime,
          pattern: "race",
        };
      }

      return {
        success: false,
        results: [],
        errors: [String(error)],
        duration_ms: Date.now() - startTime,
        pattern: "race",
      };
    }
  }

  /**
   * Helper: Execute task with abort support
   */
  private async executeWithAbort(
    manifest: AgentManifest,
    signal?: AbortSignal
  ): Promise<SwarmTask> {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const task = await this.swarm.submitTask(manifest);

    // Poll for completion with abort check
    while (task.status === "pending" || task.status === "running") {
      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      await abortableDelay(100, signal);
      // Refresh task status from swarm
      const updatedTask = this.swarm.getTask(task.id);
      if (updatedTask) {
        task.status = updatedTask.status;
        task.result = updatedTask.result;
        task.error = updatedTask.error;
      }
    }

    return task;
  }

  /**
   * Get the underlying swarm instance
   */
  getSwarm(): AgentSwarm {
    return this.swarm;
  }
}

/**
 * Factory function to create patterns with existing swarm
 */
export function createPatterns(swarm?: AgentSwarm): OrchestrationPatterns {
  return new OrchestrationPatterns(swarm);
}

/**
 * Convenience functions for standalone usage
 */
export const fanOut = (
  manifest: AgentManifest,
  count: number,
  signal?: AbortSignal
) => createPatterns().fanOut(manifest, count, signal);

export const pipeline = (
  stages: PipelineStage[],
  initialData?: any,
  signal?: AbortSignal
) => createPatterns().pipeline(stages, initialData, signal);

export const conditional = (
  evaluateManifest: AgentManifest,
  condition: ConditionFn,
  ifTrueManifest: AgentManifest,
  ifFalseManifest: AgentManifest,
  signal?: AbortSignal
) =>
  createPatterns().conditional(
    evaluateManifest,
    condition,
    ifTrueManifest,
    ifFalseManifest,
    signal
  );

export const retry = (
  manifest: AgentManifest,
  maxAttempts: number,
  backoff?: BackoffConfig,
  signal?: AbortSignal
) => createPatterns().retry(manifest, maxAttempts, backoff, signal);

export const timeout = (
  manifest: AgentManifest,
  timeoutMs: number,
  signal?: AbortSignal
) => createPatterns().timeout(manifest, timeoutMs, signal);

export const aggregate = <T = any>(
  manifests: AgentManifest[],
  reducer: ReducerFn<T>,
  signal?: AbortSignal
) => createPatterns().aggregate(manifests, reducer, signal);

export const race = (manifests: AgentManifest[], signal?: AbortSignal) =>
  createPatterns().race(manifests, signal);
