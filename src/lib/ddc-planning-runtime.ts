/**
 * DDC Planning Runtime for Prospect PAL
 * Deterministic walker for Delali Development Cycle campaign planning.
 * The model proposes artifact payloads; only this runtime advances stage.
 */

export type DdcStatus =
  | "completed"
  | "needs_clarification"
  | "awaiting_approval"
  | "blocked";

export type CampaignType =
  | "outbound_cold"
  | "inbound_nurture"
  | "event_followup"
  | "account_based"
  | "expansion"
  | "reactivation"
  | "other";

export const STAGES = [
  "created",
  "intake",
  "pal_parse",
  "pal_ambiguity",
  "pal_latent",
  "pal_expand",
  "pal_compile",
  "intent",
  "evidence",
  "jtbd",
  "npao",
  "documentation",
  "architecture",
  "gtm",
  "design_system",
  "quality_plan",
  "scaffolding",
  "scripts",
  "connecting",
  "deploying",
  "testing",
  "refining",
  "maintaining",
  "completed",
] as const;

export type Stage = (typeof STAGES)[number];

const BUILD_STAGES: Stage[] = [
  "scaffolding",
  "scripts",
  "connecting",
  "deploying",
  "testing",
  "refining",
  "maintaining",
  "completed",
];

const SIDE_EFFECT_STAGES: Stage[] = ["connecting", "deploying"];

export const STAGE_TEACHING: Record<Stage, string> = {
  created: "We open a new campaign run so nothing is lost if the chat ends.",
  intake: "Intake writes down what you want. If we skip it, we build the wrong thing.",
  pal_parse: "Parse splits what you said from what we guessed. Guesses must be labeled.",
  pal_ambiguity: "We look for holes: which CRM, which data tool, who approves outreach.",
  pal_latent: "Latent intent is the job under the request. You want a workflow. You hired pipeline.",
  pal_expand: "Expand fills ICP, messaging, and analytics without making you design the database.",
  pal_compile: "Compile turns the thinking into a package the workflow builder can run.",
  intent: "The intent spec is the fence. It says what this campaign is and what it is not.",
  evidence: "Evidence looks at real outbound campaigns so quality is measured, not hoped.",
  jtbd: "Jobs to be done name the situation, the action, and the outcome. Nodes follow jobs.",
  npao: "Now, Next, Later, Out of scope. This stops us from building a marketing suite when you needed one sequence.",
  documentation: "ICP matrix, email templates, and specs. This is the blueprint a stranger could build from.",
  architecture: "Architecture is how the 9 nodes connect: trigger, enrich, research, approve, enroll.",
  gtm: "Go-to-market is who it is for, what we say (AIDA), and through which channels.",
  design_system: "Taste rules for email copy: PAS framework, no AI-slop, personalization tokens.",
  quality_plan: "We score the plan before generating nodes. If the plan is weak, building faster fails faster.",
  scaffolding: "The 9-node template with empty configuration. Still no production.",
  scripts: "The real logic: HTTP requests, AI prompts, field mappings.",
  connecting: "Plug in credentials. Keys never live in the workflow JSON.",
  deploying: "Push to your n8n instance. Needs your approval. We must be able to roll back.",
  testing: "Run with test data. If it breaks, we are not done.",
  refining: "Compare email open rates to benchmarks. Close the gap on personalization.",
  maintaining: "Ongoing support: new personas, updated messaging, error monitoring.",
  completed: "This campaign is live. Start a new run to change it.",
};

export type WafPillar =
  | "operational_excellence"
  | "security"
  | "reliability"
  | "performance_efficiency"
  | "cost_optimization"
  | "sustainability";

export type GateResult = "pending" | "pass" | "fail" | "waived";

export interface ArtifactRef {
  type: string;
  version: string;
  status: "draft" | "review" | "approved" | "superseded";
  confidence: number;
}

export interface CampaignIntake {
  company_background: string | null;
  product_offer: string | null;
  icp: string | null;
  persona: string | null;
  data_tool: string | null;
  crm: string | null;
  outreach: string | null;
  llm_provider: string | null;
  trigger_type: "search" | "csv" | null;
  approval_policy: "auto" | "human" | "draft" | null;
}

export interface DdcRun {
  run_id: string;
  framework: "ddc-prospect-pal";
  version: "1.0.0";
  education_mode: boolean;
  campaign_type: CampaignType;
  stage: Stage;
  build_eligible: boolean;
  prompt: string;
  intake: CampaignIntake;
  artifacts: Record<string, ArtifactRef>;
  open_question: string | null;
  approvals: string[];
  waf: Record<WafPillar, GateResult>;
  quality: Record<string, number>;
  next_action: string;
  status: DdcStatus | "in_progress";
}

export interface IntakeInput {
  prompt: string;
  campaign_type?: CampaignType;
  education_mode?: boolean;
  company_background?: string;
  product_offer?: string;
  icp?: string;
  persona?: string;
  data_tool?: string;
  crm?: string;
  outreach?: string;
  llm_provider?: string;
  trigger_type?: "search" | "csv";
  approval_policy?: "auto" | "human" | "draft";
}

export interface StageSubmission {
  artifact_type: string;
  version: string;
  confidence: number;
  payload_ok: boolean;
  blocking_question?: string;
  needs_approval?: boolean;
  waf?: Partial<Record<WafPillar, GateResult>>;
  quality?: Record<string, number>;
  intake_updates?: Partial<CampaignIntake>;
}

const QUALITY_KEYS = [
  "contract",
  "taste",
  "usefulness",
  "security",
  "reliability",
  "performance",
  "ops",
  "scale",
] as const;

const HARD_GATES: (keyof CampaignIntake)[] = [
  "company_background",
  "product_offer",
  "icp",
  "persona",
  "data_tool",
  "crm",
  "outreach",
  "llm_provider",
  "trigger_type",
  "approval_policy",
];

function nextStage(stage: Stage): Stage {
  const i = STAGES.indexOf(stage);
  return STAGES[Math.min(i + 1, STAGES.length - 1)];
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ddc_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function createRun(input: IntakeInput): DdcRun {
  const prompt = input.prompt.trim();
  if (!prompt) {
    throw new Error("Intake requires a prompt.");
  }
  return {
    run_id: newId(),
    framework: "ddc-prospect-pal",
    version: "1.0.0",
    education_mode: input.education_mode ?? true,
    campaign_type: input.campaign_type ?? "outbound_cold",
    stage: "intake",
    build_eligible: false,
    prompt,
    intake: {
      company_background: input.company_background ?? null,
      product_offer: input.product_offer ?? null,
      icp: input.icp ?? null,
      persona: input.persona ?? null,
      data_tool: input.data_tool ?? null,
      crm: input.crm ?? null,
      outreach: input.outreach ?? null,
      llm_provider: input.llm_provider ?? null,
      trigger_type: input.trigger_type ?? null,
      approval_policy: input.approval_policy ?? null,
    },
    artifacts: {},
    open_question: null,
    approvals: [],
    waf: {
      operational_excellence: "pending",
      security: "pending",
      reliability: "pending",
      performance_efficiency: "pending",
      cost_optimization: "pending",
      sustainability: "pending",
    },
    quality: {},
    next_action: "Capture campaign requirements. Ask for any missing hard gates.",
    status: "in_progress",
  };
}

export function teach(run: DdcRun): string | null {
  if (!run.education_mode) return null;
  return STAGE_TEACHING[run.stage];
}

export function getMissingGates(intake: CampaignIntake): (keyof CampaignIntake)[] {
  return HARD_GATES.filter((gate) => intake[gate] === null);
}

export function canEnter(run: DdcRun, target: Stage): { ok: boolean; reason?: string } {
  if (BUILD_STAGES.includes(target) && !run.build_eligible) {
    return { ok: false, reason: "Build stages are locked until Quality Plan passes." };
  }
  if (SIDE_EFFECT_STAGES.includes(target) && !run.approvals.includes(target)) {
    return { ok: false, reason: `${target} requires explicit approval.` };
  }
  return { ok: true };
}

function qualityUnlocksBuild(quality: Record<string, number>): boolean {
  return QUALITY_KEYS.every((k) => (quality[k] ?? 0) >= 4);
}

export function submitStage(run: DdcRun, submission: StageSubmission): DdcRun {
  const copy: DdcRun = {
    ...run,
    intake: { ...run.intake, ...submission.intake_updates },
    artifacts: { ...run.artifacts },
    waf: { ...run.waf },
    quality: { ...run.quality, ...submission.quality },
    approvals: [...run.approvals],
  };

  if (submission.blocking_question) {
    copy.status = "needs_clarification";
    copy.open_question = submission.blocking_question;
    copy.next_action = "Answer the single open question, then resubmit this stage.";
    return copy;
  }

  if (submission.needs_approval) {
    copy.status = "awaiting_approval";
    copy.next_action = `Approve side effect for ${copy.stage} before continuing.`;
    return copy;
  }

  if (!submission.payload_ok) {
    copy.status = "blocked";
    copy.next_action = `Fix ${copy.stage} artifact until the exit gate passes.`;
    return copy;
  }

  copy.artifacts[submission.artifact_type] = {
    type: submission.artifact_type,
    version: submission.version,
    status: "draft",
    confidence: submission.confidence,
  };
  copy.open_question = null;
  copy.status = "in_progress";

  if (submission.waf) {
    copy.waf = { ...copy.waf, ...submission.waf };
  }

  if (copy.stage === "quality_plan") {
    copy.build_eligible = qualityUnlocksBuild(copy.quality);
    if (!copy.build_eligible) {
      copy.status = "blocked";
      copy.next_action = "Raise every quality dimension to 4/5 or record a written waiver.";
      return copy;
    }
  }

  if (copy.stage === "architecture") {
    const wafFail = Object.values(copy.waf).some((v) => v === "pending" || v === "fail");
    if (wafFail) {
      copy.status = "blocked";
      copy.next_action = "Answer all six Well-Architected pillars before leaving architecture.";
      return copy;
    }
  }

  const target = nextStage(copy.stage);
  const allowed = canEnter(copy, target);
  if (!allowed.ok) {
    copy.status = "blocked";
    copy.next_action = allowed.reason ?? "Cannot advance.";
    return copy;
  }

  copy.stage = target;
  if (target === "completed") {
    copy.status = "completed";
    copy.next_action = "Campaign live. Start a new run to change it.";
  } else {
    copy.next_action = `Execute stage ${target}. ${STAGE_TEACHING[target]}`;
  }
  return copy;
}

export function answerQuestion(run: DdcRun, answer: string): DdcRun {
  if (run.status !== "needs_clarification") return run;
  return {
    ...run,
    status: "in_progress",
    open_question: null,
    prompt: `${run.prompt}\n\nClarification: ${answer.trim()}`,
    next_action: `Resubmit ${run.stage} with the clarification applied.`,
  };
}

export function approve(run: DdcRun, stage: Stage): DdcRun {
  if (run.approvals.includes(stage)) return run;
  return {
    ...run,
    approvals: [...run.approvals, stage],
    status: "in_progress",
    next_action: `Approval recorded for ${stage}. Resubmit or advance.`,
  };
}

export function setEducation(run: DdcRun, on: boolean): DdcRun {
  return { ...run, education_mode: on };
}

export function isPlanningStage(stage: Stage): boolean {
  return !BUILD_STAGES.includes(stage);
}

export function getStageProgress(stage: Stage): { current: number; total: number } {
  const current = STAGES.indexOf(stage);
  return { current, total: STAGES.length - 1 };
}
