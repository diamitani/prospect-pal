import { describe, expect, it } from "vitest";
import { isWorkerSecretAuthorized, ownerFromSession, ownerOrFilter, ownsRow, isUuid } from "@/lib/harness/auth";
import { enforceDraftOnlyPolicy, generateProspectPalRoutine, ROUTINE_GUARDRAILS } from "@/lib/prospect-pal-generator";
import { normalizeDomain, normalizeEmail } from "@/lib/prospecting/guardrails";
import { TABLES } from "@/lib/db/tables";
import fs from "node:fs";
import path from "node:path";

const U = "11111111-1111-4111-8111-111111111111";
const W = "22222222-2222-4222-8222-222222222222";

describe("worker secret enforcement", () => {
  it("denies when WORKER_SECRET is unset in production", () => {
    expect(isWorkerSecretAuthorized("dev", { NODE_ENV: "production" })).toBe(false);
    expect(isWorkerSecretAuthorized(null, { NODE_ENV: "production" })).toBe(false);
  });
  it("allows unset secret only outside production", () => {
    expect(isWorkerSecretAuthorized(null, { NODE_ENV: "development" })).toBe(true);
    expect(isWorkerSecretAuthorized(null, { NODE_ENV: "test" })).toBe(true);
  });
  it("requires an exact match when set", () => {
    const env = { NODE_ENV: "production", WORKER_SECRET: "s3cret-value" };
    expect(isWorkerSecretAuthorized("s3cret-value", env)).toBe(true);
    expect(isWorkerSecretAuthorized("s3cret-valuX", env)).toBe(false);
    expect(isWorkerSecretAuthorized("dev", env)).toBe(false);
    expect(isWorkerSecretAuthorized(undefined, env)).toBe(false);
  });
});

describe("owner scoping (Enably-safe)", () => {
  it("drops non-UUID Enably workspace ids and falls back to user-only scope", () => {
    const o = ownerFromSession({ id: U, email: "a@b.co", workspaceId: "ws_text_enably" });
    expect(o.workspaceId).toBeNull();
    expect(ownerOrFilter(o)).toBe(`created_by.eq.${U}`);
    const empty = ownerFromSession({ id: U, email: "a@b.co", workspaceId: "" });
    expect(empty.workspaceId).toBeNull();
  });
  it("includes UUID workspaces", () => {
    const o = ownerFromSession({ id: U, email: "a@b.co", workspaceId: W });
    expect(ownerOrFilter(o, "user_id")).toBe(`user_id.eq.${U},workspace_id.eq.${W}`);
  });
  it("refuses to build a filter from a non-UUID user id (no injection)", () => {
    expect(() => ownerOrFilter({ userId: "x,or(1.eq.1)", workspaceId: null, email: "" })).toThrow();
  });
  it("ownsRow checks creator or workspace", () => {
    const o = ownerFromSession({ id: U, email: "", workspaceId: W });
    expect(ownsRow(o, { created_by: U })).toBe(true);
    expect(ownsRow(o, { workspace_id: W })).toBe(true);
    expect(ownsRow(o, { created_by: W, workspace_id: null })).toBe(false);
    expect(ownsRow(o, null)).toBe(false);
    expect(isUuid("nope")).toBe(false);
  });
});

describe("draft-only generator guardrail", () => {
  it("coerces auto to human approval", () => {
    expect(enforceDraftOnlyPolicy("auto")).toBe("approval");
    expect(enforceDraftOnlyPolicy("draft")).toBe("draft");
    expect(enforceDraftOnlyPolicy(undefined)).toBe("approval");
  });
  it("never emits auto-send / auto-enroll even when auto is requested", async () => {
    const r = await generateProspectPalRoutine({}, { approvalPolicy: "auto", sequencer: "instantly" });
    const text = `${r.routineInstructions}\n${r.agentSkillMd}\n${JSON.stringify(r.n8nWorkflowJson)}`;
    expect(text).not.toMatch(/auto-enroll directly/i);
    expect(text).not.toMatch(/Sequence Enrollment/);
    expect(text).not.toMatch(/Prospect enrolled/);
    expect(r.routineInstructions).toMatch(/only after a human approves/);
    expect(r.agentSkillMd).toMatch(/requested auto was overridden/);
    const meta = (r.n8nWorkflowJson as { meta: { guardrails: unknown; approvalPolicy: string }; active: boolean });
    expect(meta.meta.guardrails).toEqual(ROUTINE_GUARDRAILS);
    expect(meta.meta.approvalPolicy).toBe("approval");
    expect(meta.active).toBe(false);
  });
  it("draft policy stays draft-only", async () => {
    const r = await generateProspectPalRoutine({}, { approvalPolicy: "draft" });
    expect(r.routineInstructions).toMatch(/Never send or enroll/);
  });
});

describe("normalizers", () => {
  it("normalizes emails and domains", () => {
    expect(normalizeEmail(" Dana@Acme.IO ")).toBe("dana@acme.io");
    expect(normalizeEmail("nope")).toBeNull();
    expect(normalizeDomain("https://www.Acme.io/path?x")).toBe("acme.io");
    expect(normalizeDomain("dana@acme.io")).toBe("acme.io");
    expect(normalizeDomain("localhost")).toBeNull();
  });
});

describe("Phase A migration is Enably-safe", () => {
  const sql = fs.readFileSync(
    path.resolve(__dirname, "../supabase/migrations/20261123000000_ppal_harness_phase_a.sql"),
    "utf8"
  );
  const code = sql.replace(/--.*$/gm, "");
  it("only references ppal_* tables in public", () => {
    const refs = Array.from(code.matchAll(/public\.([a-z_]+)/g)).map((m) => m[1]);
    expect(refs.length).toBeGreaterThan(0);
    for (const r of refs) expect(r.startsWith("ppal_") || r === "set_ppal_updated_at").toBe(true);
    expect(code).not.toMatch(/\b(TABLE|ON)\s+(public\.)?(runs|workspaces|users|artifacts)\b/i);
  });
  it("removes USING (true) policies", () => {
    expect(code).not.toMatch(/USING\s*\(\s*true\s*\)/i);
    expect(code).toMatch(/DROP POLICY IF EXISTS "ppal_leads_auth_read"/);
  });
  it("creates the new harness tables registered in TABLES", () => {
    expect(code).toContain(`public.${TABLES.runEvents}`);
    expect(code).toContain(`public.${TABLES.suppressions}`);
  });
});
