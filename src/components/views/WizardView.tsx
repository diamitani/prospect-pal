"use client";

import { useState } from "react";
import { Button, Badge, Icon } from "@/components/ds";

interface WizardViewProps {
  onComplete?: (data: IntakeData) => void;
}

export interface IntakeData {
  trigger: string;
  crm: string;
  outreach: string;
  dataTools: string;
  llm: string;
  approvalPolicy: string;
  targetUrl: string;
  companyBackground: string;
  product: string;
  icp: string;
}

const STEPS = [
  { key: "trigger", title: "How should leads enter?", gate: false },
  { key: "crm", title: "Which CRM holds your contacts?", gate: true },
  { key: "outreach", title: "Which tool sends messages?", gate: true },
  { key: "dataTools", title: "Where does enrichment come from?", gate: true },
  { key: "llm", title: "Which AI writes your copy?", gate: true },
  { key: "approvalPolicy", title: "How should we handle approvals?", gate: true },
  { key: "targetUrl", title: "Where should we deploy?", gate: false },
  { key: "companyBackground", title: "Tell us about your company", gate: true },
  { key: "product", title: "What do you sell?", gate: true },
  { key: "icp", title: "Who is your ideal customer?", gate: true },
];

const OPTIONS: Record<string, { value: string; label: string; description: string }[]> = {
  trigger: [
    { value: "schedule", label: "Daily cron", description: "Search and enrich on a schedule" },
    { value: "csv", label: "CSV upload", description: "Process a spreadsheet of accounts" },
    { value: "webhook", label: "Live webhook", description: "Real-time intent signals" },
  ],
  crm: [
    { value: "hubspot", label: "HubSpot", description: "Dedupe + contact upsert via OAuth2" },
    { value: "salesforce", label: "Salesforce", description: "Enterprise pipeline protection" },
    { value: "pipedrive", label: "Pipedrive", description: "Sales-focused CRM sync" },
    { value: "attio", label: "Attio", description: "Modern CRM of record" },
  ],
  outreach: [
    { value: "smartlead", label: "Smartlead", description: "Multi-inbox warmup + sending" },
    { value: "instantly", label: "Instantly", description: "High-volume cold sequencing" },
    { value: "hubspot_sequences", label: "HubSpot Sales", description: "Native sequence enrollment" },
  ],
  dataTools: [
    { value: "apollo", label: "Apollo.io", description: "Contact & company enrichment" },
    { value: "clay", label: "Clay", description: "Waterfall enrichment builder" },
    { value: "zoominfo", label: "ZoomInfo", description: "Enterprise-grade data" },
  ],
  llm: [
    { value: "anthropic", label: "Claude (Anthropic)", description: "Research + PAS copywriting" },
    { value: "openai", label: "GPT-4 (OpenAI)", description: "General-purpose AI" },
    { value: "bedrock", label: "AWS Bedrock", description: "Enterprise cloud AI" },
  ],
  approvalPolicy: [
    { value: "auto", label: "Auto-send", description: "Send without human review" },
    { value: "approval", label: "Human approval", description: "Review each batch before send" },
    { value: "draft", label: "Draft only", description: "Generate but never send" },
  ],
};

export default function WizardView({ onComplete }: WizardViewProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<IntakeData>>({
    trigger: "schedule",
    crm: "",
    outreach: "",
    dataTools: "",
    llm: "",
    approvalPolicy: "",
    targetUrl: "",
    companyBackground: "",
    product: "",
    icp: "",
  });

  const currentStep = STEPS[step];
  const isGate = currentStep.gate;
  const options = OPTIONS[currentStep.key];

  const handleSelect = (value: string) => {
    setData((prev) => ({ ...prev, [currentStep.key]: value }));
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete?.(data as IntakeData);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const canProceed = !!data[currentStep.key as keyof IntakeData];

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "26px 32px 40px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Step Indicator */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              onClick={() => i < step && setStep(i)}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: i <= step ? "var(--cobalt-500)" : "var(--paper-200)",
                cursor: i < step ? "pointer" : "default",
                transition: "background 0.15s ease",
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-h1)",
                fontWeight: "var(--weight-bold)",
                letterSpacing: "var(--tracking-display)",
              }}
            >
              {currentStep.title}
            </h1>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "var(--text-body-sm)",
                color: "var(--text-secondary)",
                maxWidth: 560,
                lineHeight: "var(--leading-relaxed)",
              }}
            >
              {isGate
                ? "This is a hard gate — we need this to compile your workflow."
                : "We can skip this if you prefer to configure it later."}
            </p>
          </div>
          <Badge tone={isGate ? "attention" : "neutral"} icon={isGate ? "Lock" : "CircleDashed"}>
            {isGate ? "Hard gate" : "Optional"}
          </Badge>
        </div>

        {/* Options or Input */}
        {options ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {options.map((opt) => {
              const selected = data[currentStep.key as keyof IntakeData] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "16px 18px",
                    borderRadius: "var(--radius-lg)",
                    border: selected ? "1.5px solid var(--cobalt-500)" : "1px solid var(--border-hairline)",
                    background: selected ? "var(--cobalt-50)" : "var(--surface-card)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: selected ? "6px solid var(--cobalt-500)" : "2px solid var(--border-strong)",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "var(--text-body)", fontWeight: "var(--weight-semibold)", color: "var(--text-primary)" }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: "var(--text-body-sm)", color: "var(--text-secondary)" }}>
                      {opt.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            {currentStep.key === "targetUrl" && (
              <div style={{ padding: "var(--space-9)", borderRadius: "var(--radius-xl)", background: "var(--surface-sunken)", border: "1px solid var(--border-hairline)" }}>
                <label style={{ display: "block", fontSize: "var(--text-body-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-secondary)", marginBottom: 8 }}>
                  n8n instance URL
                </label>
                <input
                  type="url"
                  value={data.targetUrl || ""}
                  onChange={(e) => setData((prev) => ({ ...prev, targetUrl: e.target.value }))}
                  placeholder="https://your-instance.n8n.cloud"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    fontSize: "var(--text-body-sm)",
                    fontFamily: "var(--font-data)",
                    borderRadius: "var(--radius-md)",
                    border: "1.5px solid var(--border-hairline)",
                    outline: "none",
                  }}
                />
                <div style={{ display: "flex", gap: 7, alignItems: "flex-start", marginTop: 12, fontSize: "var(--text-caption)", color: "var(--text-secondary)" }}>
                  <Icon name="ShieldCheck" size={14} color="var(--signal-verified)" />
                  <span>The workflow lives entirely on your instance. We keep no credentials.</span>
                </div>
              </div>
            )}
            {currentStep.key === "companyBackground" && (
              <textarea
                value={data.companyBackground || ""}
                onChange={(e) => setData((prev) => ({ ...prev, companyBackground: e.target.value }))}
                placeholder="We're a B2B SaaS company building developer tools..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: "var(--text-body-sm)",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--border-hairline)",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            )}
            {currentStep.key === "product" && (
              <textarea
                value={data.product || ""}
                onChange={(e) => setData((prev) => ({ ...prev, product: e.target.value }))}
                placeholder="Our platform helps teams automate CI/CD pipelines with 30% faster deploy times..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: "var(--text-body-sm)",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--border-hairline)",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            )}
            {currentStep.key === "icp" && (
              <textarea
                value={data.icp || ""}
                onChange={(e) => setData((prev) => ({ ...prev, icp: e.target.value }))}
                placeholder="VP Engineering, DevOps Lead at Series A+ SaaS companies, 50-500 employees, using GitHub..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: "var(--text-body-sm)",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--border-hairline)",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <Button variant="ghost" icon="ArrowLeft" onClick={handleBack} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="primary" iconRight="ArrowRight" onClick={handleNext} disabled={isGate && !canProceed}>
              Continue
            </Button>
          ) : (
            <Button variant="accent" iconRight="Zap" onClick={handleNext} disabled={!canProceed}>
              Compile workflow
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
