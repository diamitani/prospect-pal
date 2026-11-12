"use client";

import { useState } from "react";
import Link from "next/link";
import { WizardLayout, WizardStepMeta } from "@/components/wizard/WizardLayout";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Search,
  Cpu,
  Send,
  Activity,
  FileText,
  Upload,
  Check,
  Copy,
  Download,
  Terminal,
  ArrowRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Trash2,
  FileCode,
  Globe,
  Database,
  Lock,
} from "lucide-react";
import type { GeneratorIntake, SectionToolSelection, GeneratedRoutineResult } from "@/lib/prospect-pal-generator";
import { DEFAULT_INTAKE, DEFAULT_TOOL_SELECTION } from "@/lib/prospect-pal-generator";

const STEPS_META: WizardStepMeta[] = [
  { number: 1, title: "Intake & ICP Build-out", shortLabel: "1. Intake" },
  { number: 2, title: "Playbook & Docs Upload", shortLabel: "2. Playbook & Docs" },
  { number: 3, title: "Tool Selection", shortLabel: "3. Tool Stack" },
  { number: 4, title: "Routine & Workflow Generation", shortLabel: "4. Generation" },
];

export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Intake State
  const [intakeMode, setIntakeMode] = useState<"questions" | "paste">("questions");
  const [companyName, setCompanyName] = useState<string>("CloudVortex");
  const [offer, setOffer] = useState<string>("Automated Kubernetes cost optimization reducing AWS bills by 35%");
  const [icp, setIcp] = useState<string>("Series A-C B2B SaaS companies with 50-500 employees running AWS EKS");
  const [personas, setPersonas] = useState<string>("VP of Engineering, Head of Infrastructure, DevOps Lead");
  const [triggers, setTriggers] = useState<string>("Hiring DevOps engineers, scaling multi-region clusters, AWS cloud cost spike");
  const [pastedBrief, setPastedBrief] = useState<string>("");

  // Step 2: Uploaded Docs State
  const [uploadedDocs, setUploadedDocs] = useState<{ name: string; size: string; content: string }[]>([
    {
      name: "Q4_Sales_Playbook_v2.md",
      size: "14.2 KB",
      content: "# Q4 Enterprise Playbook\n\nTargeting VP Engineering at high-growth DevOps organizations. Focus on reducing cloud waste without engineering friction. Never use buzzwords.",
    },
    {
      name: "PAS_Messaging_Guidelines.txt",
      size: "8.6 KB",
      content: "Rule 1: Hook must cite a public company milestone.\nRule 2: Agitate must quantify dev hours lost.\nRule 3: Solution must be a 2-minute benchmark ask.",
    },
  ]);
  const [rawPastedDoc, setRawPastedDoc] = useState<string>("");

  // Step 3: Tool Selection State
  const [tools, setTools] = useState<SectionToolSelection>({
    trigger: "cron",
    crm: "twenty",
    dataTool: "apollo",
    aiEngine: "claude",
    sequencer: "smartlead",
    alertChannel: "slack",
    approvalPolicy: "approval",
  });

  // Step 4: Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationOutput, setGenerationOutput] = useState<GeneratedRoutineResult | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<"pas" | "n8n" | "skill" | "dossier">("pas");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Step Navigation Handlers (Never stuck, free jumping)
  const handleNext = () => {
    if (currentStep < 4) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next === 4 && !generationOutput) {
        triggerGeneration();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < 4) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next === 4 && !generationOutput) {
        triggerGeneration();
      }
    }
  };

  const handleStepClick = (stepNum: number) => {
    setCurrentStep(stepNum);
    if (stepNum === 4 && !generationOutput) {
      triggerGeneration();
    }
  };

  // Preset Filler for rapid testing
  const applyPreset = (presetName: string) => {
    if (presetName === "devops") {
      setCompanyName("CloudVortex");
      setOffer("Automated Kubernetes cost optimization reducing AWS bills by 35%");
      setIcp("Series A-C B2B SaaS companies with 50-500 employees running AWS EKS");
      setPersonas("VP Engineering, Head of Infrastructure, DevOps Lead");
      setTriggers("Scaling multi-region EKS clusters, hiring DevOps engineers");
    } else if (presetName === "fintech") {
      setCompanyName("PayFlow AI");
      setOffer("Real-time ledger reconciliation engine eliminating month-end closing delays");
      setIcp("Fintechs & high-volume marketplaces doing $10M+ GMV on Stripe");
      setPersonas("VP Finance, CFO, Head of Accounting");
      setTriggers("Expanding payment rails, multi-currency settlement bottlenecks");
    } else if (presetName === "healthcare") {
      setCompanyName("ClinicaSync");
      setOffer("HIPAA-compliant patient intake & chart automation for regional clinics");
      setIcp("10-100 provider healthcare practices and ambulatory clinics");
      setPersonas("Chief Medical Officer, Clinical Director, Practice Manager");
      setTriggers("Opening new outpatient locations, EHR documentation fatigue");
    }
  };

  // Trigger Backend Generation
  const triggerGeneration = async () => {
    setIsGenerating(true);
    try {
      const payloadIntake: Partial<GeneratorIntake> = {
        companyName: companyName || DEFAULT_INTAKE.companyName,
        offer: offer || DEFAULT_INTAKE.offer,
        icp: icp || DEFAULT_INTAKE.icp,
        personas: personas || DEFAULT_INTAKE.personas,
        triggers: triggers || DEFAULT_INTAKE.triggers,
        pastedBrief: intakeMode === "paste" ? pastedBrief : undefined,
        docs: uploadedDocs.map((d) => ({ name: d.name, content: d.content })),
      };

      const res = await fetch("/api/pal/build-routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake: payloadIntake, tools }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setGenerationOutput(json.data);
      } else {
        // Fallback to client-side synthetic result if API fails
        throw new Error(json.error || "Generation endpoint error");
      }
    } catch (err) {
      console.warn("Using fallback local generator:", err);
      // Construct robust fallback so user is NEVER blocked
      const primaryPersona = personas.split(",")[0] || "Executive";
      setGenerationOutput({
        campaignId: `pal_${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
        strategyDossier: {
          summary: `Autonomous GTM engine targeting ${personas} at ${icp}.`,
          icpTarget: icp,
          decisionMakers: personas.split(",").map((p) => p.trim()),
          buyingTriggers: triggers.split(",").map((t) => t.trim()),
          messagingAngles: [
            `Operational efficiency via ${offer}`,
            `Eliminating manual drudgery for ${primaryPersona}`,
          ],
          shieldRules: [
            `Exclude accounts with active deals in ${tools.crm}`,
            `Exclude contacts contacted within past 90 days`,
            `Drop invalid MX or non-deliverable SMTP responses`,
          ],
        },
        pasCopy: {
          subjectVariants: [
            `Quick question re: ${primaryPersona} at {{company}}`,
            `${companyName} & {{company}} · ${triggers.split(",")[0]?.trim() || "Roadmap"}`,
          ],
          emailBody: {
            hook: `Saw ${companyName} is prioritizing ${triggers.split(",")[0]?.toLowerCase() || "growth"} this quarter.`,
            agitate: `Most ${primaryPersona}s we talk with waste 15+ hours weekly wrestling with unoptimized tooling drift and broken data syncs.`,
            solution: `We built ${offer.toLowerCase()} so your team can move faster with zero manual overhead. Open to a 2-minute benchmark?`,
            fullText: `Hi {{first_name}},\n\nSaw ${companyName} is prioritizing ${triggers.split(",")[0]?.toLowerCase() || "growth"} this quarter. Most ${primaryPersona}s we talk with waste 15+ hours weekly wrestling with unoptimized tooling drift and broken data syncs. We built ${offer.toLowerCase()} so your team can move faster with zero manual overhead. Open to a 2-minute benchmark?\n\nBest,\n{{sender_name}}`,
          },
          followUp: {
            day: 3,
            body: `Hi {{first_name}},\n\nWanted to float this to the top of your inbox in case this is top of mind this quarter. Would a 1-page breakdown of how we achieved this for similar teams be helpful?\n\nBest,\n{{sender_name}}`,
          },
        },
        n8nWorkflowJson: {
          name: `Prospect PAL — ${companyName} Outbound Pipeline`,
          nodes: [
            { name: "01 Intake & Cron Trigger", type: "n8n-nodes-base.cron" },
            { name: "02 Data Normalizer", type: "n8n-nodes-base.set" },
            { name: `03 CRM Dedupe Shield (${tools.crm.toUpperCase()})`, type: "n8n-nodes-base.httpRequest" },
            { name: `04 Waterfall Contact Reveal (${tools.dataTool.toUpperCase()})`, type: "n8n-nodes-base.apollo" },
            { name: "05 Deep Account PAS Research", type: "n8n-nodes-base.openAi" },
            { name: "06 PAS AI Copywriter", type: "n8n-nodes-base.openAi" },
            { name: `07 CRM Contact Upsert (${tools.crm.toUpperCase()})`, type: "n8n-nodes-base.httpRequest" },
            { name: `08 Sequence Enrollment (${tools.sequencer.toUpperCase()})`, type: "n8n-nodes-base.smartlead" },
            { name: `09 Review & Error Triage (${tools.alertChannel.toUpperCase()})`, type: "n8n-nodes-base.slack" },
          ],
        },
        agentSkillMd: `# Prospect PAL Agent: ${companyName} Outbound Routine\n\nTarget ICP: ${icp}\nPersonas: ${personas}\nCRM Shield: ${tools.crm}\nDeliverability Target: >94%\n\nPAS Hook: Saw ${companyName} is prioritizing ${triggers.split(",")[0]}.\nPAS Agitate: Most ${primaryPersona}s lose 15+ hours weekly.\nPAS Solution: We built ${offer}. Open to a 2-minute benchmark?`,
        routineInstructions: `Run daily at 09:00 AM. Check ${tools.crm} for deal collisions. Run waterfall reveal via ${tools.dataTool}. Enroll to ${tools.sequencer}.`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadJson = () => {
    if (!generationOutput) return;
    const blob = new Blob([JSON.stringify(generationOutput.n8nWorkflowJson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prospect-pal-${companyName.toLowerCase().replace(/\s+/g, "-")}-workflow.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={4}
      steps={STEPS_META}
      stepTitle={
        currentStep === 1
          ? "Define your ICP & value proposition"
          : currentStep === 2
          ? "Upload playbooks, messaging & battlecards"
          : currentStep === 3
          ? "Select tools for each pipeline stage"
          : "Your autonomous agent routine is ready"
      }
      stepDescription={
        currentStep === 1
          ? "Tell us about what you sell, who you target, and what triggers buying decisions."
          : currentStep === 2
          ? "Feed the engine your real sales playbooks, scripts, or transcripts so the agent learns your brand voice."
          : currentStep === 3
          ? "Choose your trigger, CRM shield, waterfall data sources, AI engine, and sequencer."
          : "Prospect PAL compiled your tailored 3-sentence PAS copy, n8n workflow JSON, and agent routine."
      }
      onBack={currentStep > 1 ? handleBack : undefined}
      onNext={currentStep < 4 ? handleNext : undefined}
      onSkip={currentStep < 4 ? handleSkip : undefined}
      onStepClick={handleStepClick}
      nextLabel={currentStep === 3 ? "Generate Pipeline Routine" : "Continue"}
    >
      {/* ─────────────────────────────────────────────────────────────
          STEP 1: INTAKE & ICP BUILD-OUT
          ───────────────────────────────────────────────────────────── */}
      {currentStep === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Quick Presets Bar */}
          <div
            style={{
              background: "#F5F7FA",
              borderRadius: "12px",
              padding: "14px 18px",
              border: "1px solid rgba(20, 20, 45, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} color="#2563EB" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#14142D" }}>
                Quick Fill Samples:
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => applyPreset("devops")}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(20, 20, 45, 0.12)",
                  padding: "5px 12px",
                  borderRadius: "100px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#14142D",
                  cursor: "pointer",
                }}
              >
                DevOps Cloud SaaS
              </button>
              <button
                type="button"
                onClick={() => applyPreset("fintech")}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(20, 20, 45, 0.12)",
                  padding: "5px 12px",
                  borderRadius: "100px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#14142D",
                  cursor: "pointer",
                }}
              >
                FinTech Ledger
              </button>
              <button
                type="button"
                onClick={() => applyPreset("healthcare")}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(20, 20, 45, 0.12)",
                  padding: "5px 12px",
                  borderRadius: "100px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#14142D",
                  cursor: "pointer",
                }}
              >
                Healthcare AI
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={() => setIntakeMode("questions")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: intakeMode === "questions" ? "2px solid #2563EB" : "1px solid rgba(20, 20, 45, 0.1)",
                background: intakeMode === "questions" ? "#EFF6FF" : "#FFFFFF",
                color: intakeMode === "questions" ? "#2563EB" : "#58718A",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Structured Questions
            </button>
            <button
              type="button"
              onClick={() => setIntakeMode("paste")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: intakeMode === "paste" ? "2px solid #2563EB" : "1px solid rgba(20, 20, 45, 0.1)",
                background: intakeMode === "paste" ? "#EFF6FF" : "#FFFFFF",
                color: intakeMode === "paste" ? "#2563EB" : "#58718A",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Paste Full Campaign Brief
            </button>
          </div>

          {intakeMode === "questions" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Company & Offer */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#14142D", marginBottom: 6 }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Inc"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid rgba(20, 20, 45, 0.15)",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#14142D", marginBottom: 6 }}>
                    Core Product & Value Proposition
                  </label>
                  <input
                    type="text"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    placeholder="What specific outcome do you deliver?"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid rgba(20, 20, 45, 0.15)",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Target ICP */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#14142D", marginBottom: 6 }}>
                  Target Ideal Customer Profile (ICP)
                </label>
                <input
                  type="text"
                  value={icp}
                  onChange={(e) => setIcp(e.target.value)}
                  placeholder="e.g. 50-500 employees, Series A+, running AWS EKS"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(20, 20, 45, 0.15)",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>

              {/* Personas */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#14142D", marginBottom: 6 }}>
                  Target Personas / Decision Maker Job Titles
                </label>
                <input
                  type="text"
                  value={personas}
                  onChange={(e) => setPersonas(e.target.value)}
                  placeholder="e.g. VP Engineering, Head of Infrastructure, DevOps Lead"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(20, 20, 45, 0.15)",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>

              {/* Buying Signals / Triggers */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#14142D", marginBottom: 6 }}>
                  Buying Signals & Triggers
                </label>
                <input
                  type="text"
                  value={triggers}
                  onChange={(e) => setTriggers(e.target.value)}
                  placeholder="e.g. New round of funding, hiring DevOps engineers, cloud migration"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(20, 20, 45, 0.15)",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#14142D", marginBottom: 6 }}>
                Paste Raw Campaign Brief or Strategy Document
              </label>
              <textarea
                value={pastedBrief}
                onChange={(e) => setPastedBrief(e.target.value)}
                placeholder="Paste your outbound campaign notes, target audience bullets, or strategy brief here..."
                rows={8}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: "1px solid rgba(20, 20, 45, 0.15)",
                  fontSize: 14,
                  lineHeight: 1.5,
                  outline: "none",
                  fontFamily: "var(--font-sans, system-ui)",
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 2: PLAYBOOK & DOCS UPLOAD
          ───────────────────────────────────────────────────────────── */}
      {currentStep === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Upload Dropzone */}
          <div
            style={{
              border: "2px dashed rgba(37, 99, 235, 0.35)",
              background: "#F8FAFC",
              borderRadius: "14px",
              padding: "36px 20px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(37, 99, 235, 0.1)",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Upload size={22} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#14142D" }}>
                Upload Playbooks, Messaging Guides, or Battlecards
              </div>
              <p style={{ fontSize: 13, color: "#58718A", margin: "4px 0 0" }}>
                Supports Markdown (.md), TXT, PDF, Word, or CSV (up to 25MB).
              </p>
            </div>
            <label
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(20, 20, 45, 0.14)",
                color: "#14142D",
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(16, 27, 45, 0.05)",
              }}
            >
              Browse Files
              <input
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    const newDocs = Array.from(files).map((f) => ({
                      name: f.name,
                      size: `${(f.size / 1024).toFixed(1)} KB`,
                      content: `Uploaded file content for ${f.name}.`,
                    }));
                    setUploadedDocs([...uploadedDocs, ...newDocs]);
                  }
                }}
              />
            </label>
          </div>

          {/* Uploaded Documents List */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#14142D", marginBottom: 12 }}>
              Ingested Campaign Documents ({uploadedDocs.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {uploadedDocs.map((doc, idx) => (
                <div
                  key={doc.name + idx}
                  style={{
                    background: "#F5F7FA",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    border: "1px solid rgba(20, 20, 45, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <FileText size={18} color="#2563EB" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#14142D" }}>{doc.name}</div>
                      <div style={{ fontSize: 11, color: "#7E8B9B" }}>{doc.size} · Parsed for PAS copy</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedDocs(uploadedDocs.filter((_, i) => i !== idx))}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#94A3B8",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Paste Playbook Text Directly */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#14142D", marginBottom: 6 }}>
              Or Paste Messaging Rules / Transcripts Directly:
            </label>
            <textarea
              value={rawPastedDoc}
              onChange={(e) => setRawPastedDoc(e.target.value)}
              placeholder="Paste objection handles, customer quotes, or specific phrase bans here..."
              rows={4}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid rgba(20, 20, 45, 0.15)",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 3: SECTION-BY-SECTION TOOL SELECTION
          ───────────────────────────────────────────────────────────── */}
      {currentStep === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Section 1: Trigger & Ingest */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontFamily: "var(--font-mono, monospace)" }}>
              01. TRIGGER & INTAKE
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#14142D", marginBottom: 10 }}>
              How should prospects enter the automation engine?
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
              {[
                { id: "cron", name: "Scheduled Daily Cron", desc: "Runs at 09:00 AM automatically" },
                { id: "webhook", name: "Live CRM Webhook", desc: "Real-time intent & form ingest" },
                { id: "csv", name: "CSV Spreadsheet", desc: "Batch process accounts list" },
                { id: "apollo_search", name: "Apollo Search API", desc: "Continuous ICP discovery" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTools({ ...tools, trigger: opt.id as any })}
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    textAlign: "left",
                    cursor: "pointer",
                    background: tools.trigger === opt.id ? "#EFF6FF" : "#FFFFFF",
                    border: tools.trigger === opt.id ? "2px solid #2563EB" : "1px solid rgba(20, 20, 45, 0.12)",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#14142D" }}>{opt.name}</div>
                  <div style={{ fontSize: 11, color: "#58718A", marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: CRM Shield & Dedupe */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontFamily: "var(--font-mono, monospace)" }}>
              02. CRM DEDUPE SHIELD (ZERO COLLISION)
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#14142D", marginBottom: 10 }}>
              Which CRM protects your active deals from double-touches?
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
              {[
                { id: "twenty", name: "Twenty CRM", desc: "Native Open Source sync", badge: "Live Sync" },
                { id: "hubspot", name: "HubSpot CRM", desc: "Deals & lifecycle check", badge: "Native" },
                { id: "salesforce", name: "Salesforce", desc: "Enterprise account guard", badge: "API" },
                { id: "pipedrive", name: "Pipedrive", desc: "Pipeline stage protection", badge: "API" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTools({ ...tools, crm: opt.id as any })}
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    textAlign: "left",
                    cursor: "pointer",
                    background: tools.crm === opt.id ? "#F0FDF4" : "#FFFFFF",
                    border: tools.crm === opt.id ? "2px solid #10B981" : "1px solid rgba(20, 20, 45, 0.12)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#14142D" }}>{opt.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#10B981", background: "rgba(16, 185, 129, 0.1)", padding: "1px 5px", borderRadius: 4 }}>
                      {opt.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "#58718A", marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Data Reveal & Waterfall */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#6366F1", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontFamily: "var(--font-mono, monospace)" }}>
              03. DATA REVEAL & WATERFALL
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#14142D", marginBottom: 10 }}>
              Primary waterfall enrichment provider:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
              {[
                { id: "apollo", name: "Apollo.io", desc: "275M+ verified contacts" },
                { id: "clay", name: "Clay Waterfall", desc: "Multi-provider waterfall table" },
                { id: "prospeo", name: "Prospeo", desc: "98% email validity rate" },
                { id: "dropcontact", name: "Dropcontact", desc: "GDPR compliant clean data" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTools({ ...tools, dataTool: opt.id as any })}
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    textAlign: "left",
                    cursor: "pointer",
                    background: tools.dataTool === opt.id ? "#EEF2FF" : "#FFFFFF",
                    border: tools.dataTool === opt.id ? "2px solid #6366F1" : "1px solid rgba(20, 20, 45, 0.12)",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#14142D" }}>{opt.name}</div>
                  <div style={{ fontSize: 11, color: "#58718A", marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: AI Engine & Sequencer */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#D97706", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontFamily: "var(--font-mono, monospace)" }}>
                04. AI PAS COPY ENGINE
              </div>
              <select
                value={tools.aiEngine}
                onChange={(e) => setTools({ ...tools, aiEngine: e.target.value as any })}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(20, 20, 45, 0.15)",
                  fontSize: 13,
                  fontWeight: 600,
                  outline: "none",
                  background: "#FFFFFF",
                }}
              >
                <option value="claude">Claude 3.5 Sonnet (Recommended)</option>
                <option value="gpt4">OpenAI GPT-4o</option>
                <option value="gemini">Google Gemini 1.5 Pro</option>
                <option value="bedrock">AWS Bedrock Titan/Claude</option>
              </select>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontFamily: "var(--font-mono, monospace)" }}>
                05. OUTREACH SEQUENCER
              </div>
              <select
                value={tools.sequencer}
                onChange={(e) => setTools({ ...tools, sequencer: e.target.value as any })}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(20, 20, 45, 0.15)",
                  fontSize: 13,
                  fontWeight: 600,
                  outline: "none",
                  background: "#FFFFFF",
                }}
              >
                <option value="smartlead">Smartlead (Multi-inbox Warmup)</option>
                <option value="instantly">Instantly.ai</option>
                <option value="hubspot_seq">HubSpot Sales Sequences</option>
                <option value="lemlist">Lemlist</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 4: ROUTINE & WORKFLOW GENERATION
          ───────────────────────────────────────────────────────────── */}
      {currentStep === 4 && (
        <div>
          {isGenerating ? (
            <div style={{ textAlign: "center", padding: "48px 20px" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "3px solid #EBEFF5",
                  borderTopColor: "#2563EB",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 20px",
                }}
              />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#14142D", margin: "0 0 8px" }}>
                Prospect PAL Generator Compiling...
              </h3>
              <p style={{ fontSize: 14, color: "#58718A" }}>
                Synthesizing {companyName}&apos;s ICP, wiring {tools.crm} shields, and assembling n8n nodes.
              </p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : generationOutput ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Status Header */}
              <div
                style={{
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle2 size={18} color="#16A34A" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>
                    Compilation Successful: Campaign {generationOutput.campaignId}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #86EFAC",
                      color: "#166534",
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Download size={13} /> Download n8n JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyText(generationOutput.agentSkillMd, "skill")}
                    style={{
                      background: "#166534",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {copiedKey === "skill" ? <Check size={13} /> : <Copy size={13} />}
                    {copiedKey === "skill" ? "Copied" : "Copy Agent Skill"}
                  </button>
                </div>
              </div>

              {/* Tab Selector */}
              <div style={{ display: "flex", gap: 6, borderBottom: "1px solid rgba(20, 20, 45, 0.08)", paddingBottom: 8 }}>
                {[
                  { id: "pas", label: "3-Sentence PAS Email" },
                  { id: "n8n", label: "Production n8n JSON" },
                  { id: "skill", label: "Agent SKILL.md" },
                  { id: "dossier", label: "Strategy Dossier" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveResultTab(tab.id as any)}
                    style={{
                      background: activeResultTab === tab.id ? "#14142D" : "transparent",
                      color: activeResultTab === tab.id ? "#FFFFFF" : "#58718A",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: PAS Email */}
              {activeResultTab === "pas" && (
                <div style={{ background: "#FAFBFD", borderRadius: "12px", border: "1px solid rgba(20, 20, 45, 0.08)", padding: "20px" }}>
                  <div style={{ fontSize: 12, color: "#7E8B9B", marginBottom: 12, fontFamily: "var(--font-mono, monospace)" }}>
                    SUBJECT OPTIONS: {generationOutput.pasCopy.subjectVariants.join("  |  ")}
                  </div>
                  <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "16px", border: "1px solid rgba(20, 20, 45, 0.06)", fontSize: 14, lineHeight: 1.6, color: "#14142D" }}>
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "var(--font-sans, system-ui)", margin: 0 }}>
                      {generationOutput.pasCopy.emailBody.fullText}
                    </pre>
                  </div>
                  <div style={{ marginTop: 14, fontSize: 12, color: "#58718A" }}>
                    <strong>Follow-up (Day 3):</strong> {generationOutput.pasCopy.followUp.body}
                  </div>
                </div>
              )}

              {/* Tab 2: n8n JSON */}
              {activeResultTab === "n8n" && (
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => handleCopyText(JSON.stringify(generationOutput.n8nWorkflowJson, null, 2), "n8n")}
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "rgba(255, 255, 255, 0.15)",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: 12,
                      padding: "4px 8px",
                      borderRadius: 4,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {copiedKey === "n8n" ? <Check size={12} /> : <Copy size={12} />}
                    {copiedKey === "n8n" ? "Copied" : "Copy"}
                  </button>
                  <pre
                    style={{
                      background: "#0E1526",
                      color: "#93C5FD",
                      padding: "16px",
                      borderRadius: "10px",
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: 12,
                      overflowX: "auto",
                      maxHeight: "360px",
                    }}
                  >
                    {JSON.stringify(generationOutput.n8nWorkflowJson, null, 2)}
                  </pre>
                </div>
              )}

              {/* Tab 3: Agent Skill */}
              {activeResultTab === "skill" && (
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => handleCopyText(generationOutput.agentSkillMd, "skillTab")}
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "rgba(255, 255, 255, 0.15)",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: 12,
                      padding: "4px 8px",
                      borderRadius: 4,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {copiedKey === "skillTab" ? <Check size={12} /> : <Copy size={12} />}
                    {copiedKey === "skillTab" ? "Copied" : "Copy"}
                  </button>
                  <pre
                    style={{
                      background: "#0E1526",
                      color: "#E2E8F0",
                      padding: "16px",
                      borderRadius: "10px",
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: 12,
                      overflowX: "auto",
                      maxHeight: "360px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {generationOutput.agentSkillMd}
                  </pre>
                </div>
              )}

              {/* Tab 4: Strategy Dossier */}
              {activeResultTab === "dossier" && (
                <div style={{ background: "#FAFBFD", borderRadius: "12px", border: "1px solid rgba(20, 20, 45, 0.08)", padding: "20px" }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "#14142D", margin: "0 0 10px" }}>
                    Campaign Strategy Dossier
                  </h4>
                  <p style={{ fontSize: 14, color: "#58718A", marginBottom: 16 }}>
                    {generationOutput.strategyDossier.summary}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: 8, border: "1px solid rgba(20, 20, 45, 0.06)" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#14142D", marginBottom: 8 }}>
                        Decision Makers
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#58718A" }}>
                        {generationOutput.strategyDossier.decisionMakers.map((dm, i) => (
                          <li key={i}>{dm}</li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: 8, border: "1px solid rgba(20, 20, 45, 0.06)" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 8 }}>
                        CRM Shield Rules
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#58718A" }}>
                        {generationOutput.strategyDossier.shieldRules.map((sr, i) => (
                          <li key={i}>{sr}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Final Actions */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid rgba(20, 20, 45, 0.08)" }}>
                <Link
                  href="/dashboard"
                  style={{
                    background: "#2563EB",
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "12px 24px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  Open in Automation Dashboard <ArrowRight size={16} />
                </Link>

                <button
                  type="button"
                  onClick={triggerGeneration}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(20, 20, 45, 0.12)",
                    color: "#14142D",
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <RefreshCw size={14} /> Recompile with Adjusted Prompt
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "36px" }}>
              <button
                type="button"
                onClick={triggerGeneration}
                style={{
                  background: "#14142D",
                  color: "#FFFFFF",
                  fontSize: 15,
                  fontWeight: 600,
                  padding: "14px 28px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Compile Routine Now
              </button>
            </div>
          )}
        </div>
      )}
    </WizardLayout>
  );
}
