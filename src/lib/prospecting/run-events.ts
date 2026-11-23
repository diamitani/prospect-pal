/**
 * Durable step recorder. Every harness step gets a start/finish/duration/error
 * record; the sink persists to ppal_run_events (or is a no-op in tests).
 */

import type { RunEvent, RunEventLevel, RunStep } from "./types";

export type RunEventSink = (event: RunEvent) => Promise<void> | void;

export interface StepHandle {
  step: RunStep;
  startedAt: number;
  meta: Record<string, unknown>;
}

export class RunEventRecorder {
  readonly events: RunEvent[] = [];

  constructor(
    private readonly runId: string | null,
    private readonly sink?: RunEventSink,
    private readonly now: () => number = () => Date.now()
  ) {}

  private async emit(e: RunEvent) {
    this.events.push(e);
    if (!this.sink) return;
    try {
      await this.sink(e);
    } catch (err) {
      // Never let event persistence break a run.
      console.warn("[run-events] sink failed", err instanceof Error ? err.message : err);
    }
  }

  /** Run `fn` as a recorded step. Errors are recorded then re-thrown. */
  async step<T>(
    step: RunStep,
    message: string,
    fn: (meta: Record<string, unknown>) => Promise<T> | T
  ): Promise<T> {
    const started = this.now();
    const meta: Record<string, unknown> = {};
    try {
      const out = await fn(meta);
      const finished = this.now();
      await this.emit({
        run_id: this.runId,
        step,
        level: (meta.level as RunEventLevel) || "info",
        message: (meta.message as string) || message,
        meta: stripControl(meta),
        started_at: new Date(started).toISOString(),
        finished_at: new Date(finished).toISOString(),
        duration_ms: finished - started,
        error: null,
      });
      return out;
    } catch (err) {
      const finished = this.now();
      const msg = err instanceof Error ? err.message : String(err);
      await this.emit({
        run_id: this.runId,
        step,
        level: "error",
        message: `${message} — failed`,
        meta: stripControl(meta),
        started_at: new Date(started).toISOString(),
        finished_at: new Date(finished).toISOString(),
        duration_ms: finished - started,
        error: msg,
      });
      throw err;
    }
  }
}

function stripControl(meta: Record<string, unknown>): Record<string, unknown> {
  const rest = { ...meta };
  delete rest.level;
  delete rest.message;
  return rest;
}
