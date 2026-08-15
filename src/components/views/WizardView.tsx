"use client";

import { useState } from "react";

interface WizardViewProps {
  onComplete: (projectId: string, projectName: string) => void;
}

const TOOL_OPTIONS = {
  leadSource: [
    { id: "apollo",        label: "Apollo",         desc: "Search 250M+ contacts",  emoji: "🏺" },
    { id: "linkedin",      label: "LinkedIn",        desc: "Professional network",   emoji: "💼" },
    { id: "upload_csv",    label: "Upload CSV",      desc: "Your own lead list",     emoji: "📄" },
    { id: "hubspot_stage", label: "HubSpot Stage",   desc: "Pull from CRM stage",    emoji: "🔶" },
  ],
  enrichment: [
    { id: "clay",      label: "Clay",     desc: "Best waterfall enrichment", emoji: "🧱" },
    { id: "hunter",    label: "Hunter",   desc: "Email finder",              emoji: "🎯" },
    { id: "clearbit",  label: "Clearbit", desc: "Company data",             emoji: "🔍" },
    { id: "apollo_enrich", label: "Apollo", desc: "Contact enrichment",     emoji: "🏺" },
  ],
  crm: [
    { id: "hubspot",     label: "HubSpot",     emoji: "🔶" },
    { id: "salesforce",  label: "Salesforce",  emoji: "☁️" },
    { id: "attio",       label: "Attio",       emoji: "🔬" },
    { id: "pipedrive",   label: "Pipedrive",   emoji: "📊" },
  ],
  sequencer: [
    { id: "smartlead",    label: "Smartlead",    desc: "AI-powered sending",       emoji: "📬" },
    { id: "amplemarket",  label: "Amplemarket",  desc: "All-in-one sales",         emoji: "📡" },
    { id: "instantly",    label: "Instantly",    desc: "High-volume outreach",     emoji: "⚡" },
    { id: "lemlist",      label: "Lemlist",      desc: "Personalized sequences",   emoji: "✉️" },
  ],
};

interface WizardState {
  projectName: string;
  productDescription: string;
  targetDescription: string;
  leadSource: string;
  enrichment: string[];
  crm: string;
  sequencer: string;
  approvalGate: boolean;
}

const STEPS = [
  { num: 1, title: "About Your Product",   desc: "What do you sell?" },
  { num: 2, title: "Your Target Customer", desc: "Who do you sell to?" },
  { num: 3, title: "Lead Discovery",       desc: "Where do leads come from?" },
  { num: 4, title: "Data & Enrichment",    desc: "How do we enrich contacts?" },
  { num: 5, title: "CRM & Sequences",      desc: "Where do leads go?" },
];

export default function WizardView({ onComplete }: WizardViewProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<WizardState>({
    projectName: "",
    productDescription: "",
    targetDescription: "",
    leadSource: "apollo",
    enrichment: ["clay"],
    crm: "hubspot",
    sequencer: "smartlead",
    approvalGate: true,
  });

  const update = (key: keyof WizardState, value: unknown) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const toggleEnrichment = (id: string) => {
    setState((prev) => ({
      ...prev,
      enrichment: prev.enrichment.includes(id)
        ? prev.enrichment.filter((e) => e !== id)
        : [...prev.enrichment, id],
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Create project first
      const projResp = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.projectName || `Campaign ${new Date().toLocaleDateString()}`,
          description: state.productDescription,
        }),
      });
      const { project } = await projResp.json() as { project: { id: string; name: string } };

      onComplete(project.id, project.name);
    } catch {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return state.productDescription.trim().length > 10;
    if (step === 2) return state.targetDescription.trim().length > 10;
    return true;
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > s.num ? "bg-brand-700 text-white"
                  : step === s.num ? "bg-brand-700 text-white ring-4 ring-brand-200"
                  : "bg-surface-100 text-ink-muted"
                }`}>
                  {step > s.num ? "✓" : s.num}
                </div>
                <div className={`text-xs mt-1.5 font-medium ${step >= s.num ? "text-ink" : "text-ink-muted"}`}>
                  {s.title.split(" ")[0]}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 mt-[-14px] transition-all ${step > s.num ? "bg-brand-700" : "bg-surface-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white border border-surface-200 rounded-2xl p-6 shadow-card mb-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-ink">{STEPS[step - 1].title}</h2>
          <p className="text-sm text-ink-secondary mt-0.5">{STEPS[step - 1].desc}</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="label">Campaign Name</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Q4 SaaS Founder Outreach"
                value={state.projectName}
                onChange={(e) => update("projectName", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Describe what you sell *</label>
              <textarea
                className="input h-28 resize-none"
                placeholder="e.g. We sell an AI-powered revenue operations platform that helps mid-market SaaS companies automate their SDR workflows and reduce manual research time by 80%."
                value={state.productDescription}
                onChange={(e) => update("productDescription", e.target.value)}
              />
              <p className="text-xs text-ink-muted mt-1">Be specific — this shapes your entire automation engine.</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="label">Describe your ideal customer *</label>
              <textarea
                className="input h-28 resize-none"
                placeholder="e.g. VP of Sales or Head of Revenue Ops at B2B SaaS companies with 50-500 employees in the US, Series A-C funded, tech stack includes Salesforce or HubSpot."
                value={state.targetDescription}
                onChange={(e) => update("targetDescription", e.target.value)}
              />
            </div>
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-3">
              <p className="text-xs text-brand-700 font-medium">
                💡 Tip: Include titles, company size, funding stage, industry, and any tech stack signals.
                The more specific, the better the workflow PAL builds for you.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="label">Where should leads come from?</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              {TOOL_OPTIONS.leadSource.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => update("leadSource", opt.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    state.leadSource === opt.id
                      ? "border-brand-700 bg-brand-50"
                      : "border-surface-200 bg-white hover:border-surface-300"
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <div className="font-semibold text-sm text-ink mt-1">{opt.label}</div>
                  <div className="text-xs text-ink-muted">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <label className="label">Select enrichment providers (can select multiple)</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              {TOOL_OPTIONS.enrichment.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleEnrichment(opt.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    state.enrichment.includes(opt.id)
                      ? "border-brand-700 bg-brand-50"
                      : "border-surface-200 bg-white hover:border-surface-300"
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <div className="font-semibold text-sm text-ink mt-1">{opt.label}</div>
                  <div className="text-xs text-ink-muted">{opt.desc}</div>
                  {state.enrichment.includes(opt.id) && (
                    <span className="text-xs text-brand-700 font-bold">✓ Selected</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <div>
              <label className="label">CRM System</label>
              <div className="grid grid-cols-4 gap-2">
                {TOOL_OPTIONS.crm.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => update("crm", opt.id)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      state.crm === opt.id
                        ? "border-brand-700 bg-brand-50"
                        : "border-surface-200 bg-white hover:border-surface-300"
                    }`}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <div className="text-xs font-semibold text-ink mt-1">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Email Sequencer</label>
              <div className="grid grid-cols-2 gap-3">
                {TOOL_OPTIONS.sequencer.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => update("sequencer", opt.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      state.sequencer === opt.id
                        ? "border-brand-700 bg-brand-50"
                        : "border-surface-200 bg-white hover:border-surface-300"
                    }`}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <div className="font-semibold text-sm text-ink mt-1">{opt.label}</div>
                    <div className="text-xs text-ink-muted">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-50 border border-surface-200 rounded-xl">
              <div>
                <div className="font-semibold text-sm text-ink">Human Approval Gate</div>
                <div className="text-xs text-ink-muted">Review emails in Slack before sending</div>
              </div>
              <button
                onClick={() => update("approvalGate", !state.approvalGate)}
                className={`w-12 h-6 rounded-full transition-all relative ${state.approvalGate ? "bg-brand-700" : "bg-surface-300"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${state.approvalGate ? "left-7" : "left-1"}`} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="btn-ghost disabled:opacity-30"
        >
          ← Back
        </button>
        <span className="text-xs text-ink-muted">{step} of {STEPS.length}</span>
        {step < STEPS.length ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="btn-brand disabled:opacity-40"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn-brand disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                Creating...
              </span>
            ) : (
              "✦ Launch PAL Agent →"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
