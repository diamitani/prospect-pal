"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo, Badge, Button, Icon } from "@/components/ds";
import {
  Zap,
  ShieldCheck,
  Search,
  Sparkles,
  Scale,
  Send,
  Database,
  Workflow,
  Layers,
  Cloud,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Settings2,
  FileCode,
  FileText,
} from "lucide-react";

interface IntakeFormState {
  trigger: "cron" | "csv" | "webhook" | "search";
  crm: "hubspot" | "salesforce" | "pipedrive" | "attio";
  outreach: "smartlead" | "instantly" | "outreach" | "hubspot-sales";
  targetEngine: "n8n" | "make" | "gumloop" | "core-sdr";
  enrichment: "apollo" | "clay" | "zoominfo" | "clearbit";
  llm: "anthropic" | "openai" | "azure";
  agentLayer: "agent-scaffold" | "workflow-only";
  approvalGate: "slack-review" | "full-auto";
  companyName: string;
  icpGoal: string;
}

const STEPS = [
  { id: 1, label: "Lead Trigger", icon: Zap, desc: "How leads enter the engine" },
  { id: 2, label: "CRM Shield", icon: Database, desc: "Pipeline & deduplication database" },
  { id: 3, label: "Outreach Tool", icon: Send, desc: "Multi-inbox sending provider" },
  { id: 4, label: "Automation Target", icon: Workflow, desc: "Where the engine executes" },
  { id: 5, label: "Data Enrichment", icon: Search, desc: "Decision-maker verification" },
  { id: 6, label: "LLM Reasoning", icon: Sparkles, desc: "AI research and PAS copywriting" },
  { id: 7, label: "Agent Scaffolding", icon: Layers, desc: "Workflow or autonomous agent" },
  { id: 8, label: "Approval & Review", icon: Scale, desc: "Safety gate & compilation recap" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  const [formData, setFormData] = useState<IntakeFormState>({
    trigger: "cron",
    crm: "hubspot",
    outreach: "smartlead",
    targetEngine: "n8n",
    enrichment: "apollo",
    llm: "anthropic",
    agentLayer: "agent-scaffold",
    approvalGate: "slack-review",
    companyName: "Acme Corp",
    icpGoal: "VP of Sales & RevOps leaders at B2B SaaS companies",
  });

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setIsCompiling(true);

    try {
      // Save onboarding answers to API
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch(() => null);

      // Simulate PAL Intent Compiler compilation
      setTimeout(() => {
        setIsCompiling(false);
        setLoading(false);
        router.push("/dashboard");
      }, 1400);
    } catch {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--surface-page)" }}>
      {/* Top Bar */}
      <nav
        style={{
          padding: "16px 32px",
          background: "var(--surface-deep)",
          borderBottom: "1px solid var(--border-deep)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Logo size={32} onDeep />
          <Badge tone="premium">PAL Intake Compiler</Badge>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-300)" }}>
          <Lock size={14} color="var(--signal-verified)" />
          <span>Zero-Storage Security Policy: Credentials stay local</span>
        </div>
      </nav>

      {/* Main Multi-Step Form */}
      <main style={{ flex: 1, padding: "36px 32px", maxWidth: 840, margin: "0 auto", width: "100%" }}>
        {/* Step Rail Indicator */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {STEPS.map((s) => (
              <div
                key={s.id}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: s.id <= currentStep ? "var(--cobalt-600)" : "var(--paper-200)",
                  transition: "background 0.2s ease",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, fontFamily: "var(--font-data)", color: "var(--cobalt-600)", fontWeight: 700, textTransform: "uppercase" }}>
              STAGE {String(currentStep).padStart(2, "0")} / 08 · {STEPS[currentStep - 1].label}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {STEPS[currentStep - 1].desc}
            </span>
          </div>
        </div>

        {/* Form Container Card */}
        <div
          style={{
            background: "var(--surface-card)",
            borderRadius: "var(--radius-2xl)",
            border: "1px solid var(--border-hairline)",
            boxShadow: "var(--shadow-card)",
            padding: "36px 32px",
          }}
        >
          {/* STEP 1: TRIGGER */}
          {currentStep === 1 && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: "var(--text-primary)" }}>
                How should new leads enter your engine?
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 24px" }}>
                Select the intake method that initiates the outbound prospecting workflow.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { value: "cron", title: "Daily Cron Schedule", desc: "Runs automated batch queries on a fixed recurring schedule." },
                  { value: "csv", title: "CSV / Sheet Upload", desc: "Batch processes prospect spreadsheets uploaded by reps." },
                  { value: "webhook", title: "Real-time CRM Webhook", desc: "Triggers automatically when a deal changes stage in your CRM." },
                  { value: "search", title: "Live Data Tool Query", desc: "Streams live new hiring and funding signals via Apollo/Clay." },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setFormData({ ...formData, trigger: opt.value as IntakeFormState["trigger"] })}
                    style={{
                      padding: 18,
                      borderRadius: "var(--radius-xl)",
                      border: formData.trigger === opt.value ? "2px solid var(--cobalt-600)" : "1px solid var(--border-hairline)",
                      background: formData.trigger === opt.value ? "var(--cobalt-50)" : "var(--surface-card)",
                      cursor: "pointer",
                      transition: "var(--transition-control)",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>
                      {opt.title}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                      {opt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: CRM */}
          {currentStep === 2 && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: "var(--text-primary)" }}>
                Which platform holds your contact & deal data?
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 24px" }}>
                The engine embeds a mandatory Deduplication Shield (Node 03) to protect your active deals.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { value: "hubspot", title: "HubSpot CRM", desc: "Two-way dedupe matching against contacts, companies, and deals." },
                  { value: "salesforce", title: "Salesforce CRM", desc: "Enterprise object upsert with lead-to-account matching." },
                  { value: "pipedrive", title: "Pipedrive", desc: "Lightweight CRM sync with automated organization association." },
                  { value: "attio", title: "Attio", desc: "Next-generation relational data platform with custom attribute bindings." },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setFormData({ ...formData, crm: opt.value as IntakeFormState["crm"] })}
                    style={{
                      padding: 18,
                      borderRadius: "var(--radius-xl)",
                      border: formData.crm === opt.value ? "2px solid var(--cobalt-600)" : "1px solid var(--border-hairline)",
                      background: formData.crm === opt.value ? "var(--cobalt-50)" : "var(--surface-card)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>
                      {opt.title}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                      {opt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: OUTREACH */}
          {currentStep === 3 && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: "var(--text-primary)" }}>
                Which sequencer should deliver the messages?
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 24px" }}>
                Target multi-inbox deliverability platform for sequence enrollment.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { value: "smartlead", title: "Smartlead.ai", desc: "Multi-inbox warmup and automated sequence enrollment." },
                  { value: "instantly", title: "Instantly.ai", desc: "High-volume cold outreach deliverability network." },
                  { value: "outreach", title: "Outreach.io", desc: "Enterprise sales engagement sequences." },
                  { value: "hubspot-sales", title: "HubSpot Sales Hub", desc: "Native sequence enrollment directly inside HubSpot." },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setFormData({ ...formData, outreach: opt.value as IntakeFormState["outreach"] })}
                    style={{
                      padding: 18,
                      borderRadius: "var(--radius-xl)",
                      border: formData.outreach === opt.value ? "2px solid var(--cobalt-600)" : "1px solid var(--border-hairline)",
                      background: formData.outreach === opt.value ? "var(--cobalt-50)" : "var(--surface-card)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>
                      {opt.title}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                      {opt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: AUTOMATION TARGET */}
          {currentStep === 4 && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: "var(--text-primary)" }}>
                Where should this engine execute?
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 24px" }}>
                Prospect PAL compiles runnable JSON for your target platform — or you can run as a Core SDR Agent directly in-app.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { value: "n8n", title: "n8n (Self-Hosted / Cloud)", desc: "Production 9-node JSON compiled against your n8n instance API." },
                  { value: "make", title: "Make.com (Integromat)", desc: "Modular blueprint JSON exportable for Make.com scenarios." },
                  { value: "gumloop", title: "Gumloop Pipeline", desc: "AI-native flow for Gumloop workflow execution." },
                  { value: "core-sdr", title: "Core Autonomous SDR", desc: "Runs directly in Prospect PAL. No external automation tools needed." },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setFormData({ ...formData, targetEngine: opt.value as IntakeFormState["targetEngine"] })}
                    style={{
                      padding: 18,
                      borderRadius: "var(--radius-xl)",
                      border: formData.targetEngine === opt.value ? "2px solid var(--cobalt-600)" : "1px solid var(--border-hairline)",
                      background: formData.targetEngine === opt.value ? "var(--cobalt-50)" : "var(--surface-card)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>
                      {opt.title}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                      {opt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: ENRICHMENT */}
          {currentStep === 5 && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: "var(--text-primary)" }}>
                Which data provider finds & verifies decision-makers?
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 24px" }}>
                Resolved to Node 04 (Data Tool Adapter) in your compiled graph.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { value: "apollo", title: "Apollo.io", desc: "B2B database with verified corporate email reveal." },
                  { value: "clay", title: "Clay Waterfall", desc: "Multi-provider waterfall enrichment." },
                  { value: "zoominfo", title: "ZoomInfo Enterprise", desc: "Deep enterprise org chart intelligence." },
                  { value: "clearbit", title: "Clearbit / HubSpot Data", desc: "Domain-level company firmographics and technographics." },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setFormData({ ...formData, enrichment: opt.value as IntakeFormState["enrichment"] })}
                    style={{
                      padding: 18,
                      borderRadius: "var(--radius-xl)",
                      border: formData.enrichment === opt.value ? "2px solid var(--cobalt-600)" : "1px solid var(--border-hairline)",
                      background: formData.enrichment === opt.value ? "var(--cobalt-50)" : "var(--surface-card)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>
                      {opt.title}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                      {opt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: LLM */}
          {currentStep === 6 && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: "var(--text-primary)" }}>
                Which LLM powers company research & copywriting?
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 24px" }}>
                Powers Node 05 (AI Research & PAS Copywriter).
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { value: "anthropic", title: "Anthropic Claude 3.7 / 3.5", desc: "Industry-leading reasoning for nuance and 3-sentence PAS copy." },
                  { value: "openai", title: "OpenAI GPT-4o", desc: "High-throughput intelligence with structured outputs." },
                  { value: "azure", title: "Azure OpenAI Service", desc: "Enterprise compliance with private VPC data tenancy." },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setFormData({ ...formData, llm: opt.value as IntakeFormState["llm"] })}
                    style={{
                      padding: 18,
                      borderRadius: "var(--radius-xl)",
                      border: formData.llm === opt.value ? "2px solid var(--cobalt-600)" : "1px solid var(--border-hairline)",
                      background: formData.llm === opt.value ? "var(--cobalt-50)" : "var(--surface-card)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>
                      {opt.title}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                      {opt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: AGENT LAYER */}
          {currentStep === 7 && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: "var(--text-primary)" }}>
                Do you also want an Agent Scaffolding package?
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 24px" }}>
                Emits `soul.md`, `manifest.json`, and MCP server stubs to plug this pipeline into Claude Code or Cursor.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { value: "agent-scaffold", title: "Full Agent Scaffolding Pack", desc: "Workflow JSON + soul.md + manifest.json + prompt suite." },
                  { value: "workflow-only", title: "Standard Workflow Only", desc: "Only emits the pure execution graph JSON." },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setFormData({ ...formData, agentLayer: opt.value as IntakeFormState["agentLayer"] })}
                    style={{
                      padding: 18,
                      borderRadius: "var(--radius-xl)",
                      border: formData.agentLayer === opt.value ? "2px solid var(--cobalt-600)" : "1px solid var(--border-hairline)",
                      background: formData.agentLayer === opt.value ? "var(--cobalt-50)" : "var(--surface-card)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>
                      {opt.title}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                      {opt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: APPROVAL GATE & RECAP */}
          {currentStep === 8 && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: "var(--text-primary)" }}>
                Approval Switch & Compilation Review
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 20px" }}>
                Review resolved NPAO bindings before generating your workspace engine.
              </p>

              {/* Safety Gate Selection */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { value: "slack-review", title: "Slack 1-Click Approval Gate", desc: "Drafts route to Slack channel for human sign-off before sending." },
                  { value: "full-auto", title: "Autonomous Direct Dispatch", desc: "Auto-dispatches verified prospects matching >90% ICP score." },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setFormData({ ...formData, approvalGate: opt.value as IntakeFormState["approvalGate"] })}
                    style={{
                      padding: 14,
                      borderRadius: "var(--radius-lg)",
                      border: formData.approvalGate === opt.value ? "2px solid var(--cobalt-600)" : "1px solid var(--border-hairline)",
                      background: formData.approvalGate === opt.value ? "var(--cobalt-50)" : "var(--surface-card)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)", marginBottom: 2 }}>
                      {opt.title}
                    </div>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>
                      {opt.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Compilation Ack Card */}
              <div
                style={{
                  padding: 18,
                  background: "var(--surface-deep)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--border-deep)",
                  color: "var(--paper-0)",
                  fontFamily: "var(--font-data)",
                  fontSize: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, color: "var(--champagne-300)" }}>
                  <span>PAL INTENT COMPILER · RESOLVED BINDINGS</span>
                  <Badge tone="verified">Ready to Compile</Badge>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, color: "var(--ink-200)" }}>
                  <div>Trigger: <strong style={{ color: "white" }}>{formData.trigger}</strong></div>
                  <div>CRM Shield: <strong style={{ color: "white" }}>{formData.crm}</strong></div>
                  <div>Outreach: <strong style={{ color: "white" }}>{formData.outreach}</strong></div>
                  <div>Target Engine: <strong style={{ color: "white" }}>{formData.targetEngine}</strong></div>
                  <div>Enrichment: <strong style={{ color: "white" }}>{formData.enrichment}</strong></div>
                  <div>LLM Provider: <strong style={{ color: "white" }}>{formData.llm}</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid var(--border-hairline)",
            }}
          >
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  padding: "10px 18px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-hairline)",
                  background: "var(--surface-card)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <div />
            )}

            <Button
              variant="accent"
              size="lg"
              icon={currentStep === 8 ? "Zap" : "ArrowRight"}
              onClick={handleNext}
              disabled={loading}
            >
              {isCompiling
                ? "Compiling 9-Node Graph..."
                : currentStep === 8
                ? "Compile & Launch Workspace"
                : "Continue"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

