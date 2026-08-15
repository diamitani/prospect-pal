"use client";

import { useState, useCallback } from "react";
import N8nCanvas from "@/components/N8nCanvas";
import type { WorkflowConfig, N8nNode } from "@/lib/workflow-generator";
import { buildNodeSequence } from "@/lib/workflow-generator";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4;

interface LogEntry {
  id:   string;
  type: "info" | "success" | "building" | "done" | "error";
  text: string;
  ts:   Date;
}

interface GeneratedOutput {
  n8nJson:       string;
  deployGuide:   string;
  emailTemplate: string;
  buildPrompts:  string;
}

// ─────────────────────────────────────────────────────────────
// TOOL OPTIONS
// ─────────────────────────────────────────────────────────────
const LEAD_SOURCES = [
  { id: "apollo",        label: "Apollo",        emoji: "🏺", desc: "250M+ contacts database" },
  { id: "linkedin",      label: "LinkedIn",       emoji: "💼", desc: "Professional network" },
  { id: "upload_csv",    label: "Upload CSV",     emoji: "📄", desc: "Your own lead list" },
  { id: "hubspot_stage", label: "HubSpot Stage",  emoji: "🔶", desc: "Pull from pipeline stage" },
];

const ENRICHMENT_TOOLS = [
  { id: "clay",          label: "Clay",     emoji: "🧱", desc: "Waterfall enrichment" },
  { id: "hunter",        label: "Hunter",   emoji: "🎯", desc: "Email verification" },
  { id: "clearbit",      label: "Clearbit", emoji: "🔍", desc: "Company data" },
  { id: "apollo_enrich", label: "Apollo",   emoji: "🏺", desc: "Contact enrichment" },
];

const CRM_OPTIONS = [
  { id: "hubspot",    label: "HubSpot",    emoji: "🔶" },
  { id: "salesforce", label: "Salesforce", emoji: "☁️" },
  { id: "attio",      label: "Attio",      emoji: "🔬" },
  { id: "pipedrive",  label: "Pipedrive",  emoji: "📊" },
  { id: "none",       label: "Skip CRM",   emoji: "○" },
];

const SEQUENCER_OPTIONS = [
  { id: "smartlead",   label: "Smartlead",   emoji: "📬", desc: "AI-powered sending" },
  { id: "amplemarket", label: "Amplemarket", emoji: "📡", desc: "All-in-one sales" },
  { id: "instantly",   label: "Instantly",   emoji: "⚡", desc: "High-volume outreach" },
  { id: "lemlist",     label: "Lemlist",     emoji: "✉️", desc: "Personalized sequences" },
];

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function BuilderView({
  onOutputReady,
}: {
  onOutputReady: (output: Record<string, unknown>) => void;
}) {
  const [step,    setStep]    = useState<Step>(1);
  const [config,  setConfig]  = useState<WorkflowConfig>({
    leadSource:   "apollo",
    enrichment:   ["clay"],
    crm:          "hubspot",
    sequencer:    "smartlead",
    approvalGate: true,
    slackAlerts:  true,
    icpPrompt:    "",
    icpFile:      undefined,
    companyUrls:  [],
    companyPrompt: "",
  });

  // Canvas state — starts empty, fills during generation
  const [canvasNodes,    setCanvasNodes]    = useState<N8nNode[]>([]);
  const [canvasEdges,    setCanvasEdges]    = useState<[string, string][]>([]);
  const [activeNodeId,   setActiveNodeId]   = useState<string | null>(null);
  const [isBuilding,     setIsBuilding]     = useState(false);
  const [isDone,         setIsDone]         = useState(false);
  const [log,            setLog]            = useState<LogEntry[]>([]);
  const [activeTab,      setActiveTab]      = useState<"json" | "guide" | "email" | "prompts">("json");
  const [output,         setOutput]         = useState<GeneratedOutput | null>(null);
  const [urlInput,       setUrlInput]       = useState("");
  const [copied,         setCopied]         = useState(false);

  const addLog = useCallback((type: LogEntry["type"], text: string) => {
    setLog((prev) => [...prev, { id: Math.random().toString(36).slice(2), type, text, ts: new Date() }]);
  }, []);

  const toggleEnrichment = (id: string) => {
    setConfig((c) => ({
      ...c,
      enrichment: c.enrichment.includes(id as WorkflowConfig["enrichment"][0])
        ? c.enrichment.filter((e) => e !== id)
        : [...c.enrichment, id as WorkflowConfig["enrichment"][0]],
    }));
  };

  const addUrl = () => {
    if (urlInput.trim()) {
      setConfig((c) => ({ ...c, companyUrls: [...c.companyUrls, urlInput.trim()] }));
      setUrlInput("");
    }
  };

  // ── GENERATE WORKFLOW ───────────────────────────────────────
  const generate = async () => {
    setIsBuilding(true);
    setCanvasNodes([]);
    setCanvasEdges([]);
    setLog([]);

    addLog("info", "Starting workflow generation...");
    await delay(400);

    // Build node sequence immediately (static)
    const { nodes, connections } = buildNodeSequence(config);

    // Reveal nodes one by one with a delay (live build effect)
    addLog("building", `Building ${nodes.length} nodes for your stack...`);
    for (let i = 0; i < nodes.length; i++) {
      setActiveNodeId(nodes[i].id);
      setCanvasNodes(nodes.slice(0, i + 1));
      setCanvasEdges(connections.filter(([f, t]) =>
        nodes.slice(0, i + 1).some((n) => n.id === f) &&
        nodes.slice(0, i + 1).some((n) => n.id === t)
      ));
      addLog("building", `Adding node: ${nodes[i].label}`);
      await delay(350);
    }

    setActiveNodeId(null);
    addLog("success", "Node graph complete ✓");
    await delay(300);

    // Call API to generate artifacts
    addLog("building", "Generating n8n workflow JSON via AI...");
    let genOutput: GeneratedOutput = {
      n8nJson: "",
      deployGuide: "",
      emailTemplate: "",
      buildPrompts: "",
    };

    try {
      const res = await fetch("/api/workflow/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, nodes }),
      });
      const data = await res.json() as GeneratedOutput & { error?: string };
      if (data.error) throw new Error(data.error);
      genOutput = data;
      addLog("success", "Workflow JSON generated ✓");
    } catch (err) {
      addLog("error", `AI generation failed: ${err instanceof Error ? err.message : "Unknown"} — using fallback template`);
      genOutput = {
        n8nJson: generateFallbackJson(config, nodes),
        deployGuide: "# Deploy Guide\n\n1. Import the workflow JSON into n8n\n2. Add your API credentials\n3. Test and activate",
        emailTemplate: "Subject: Quick question about {{company}}\n\nHi {{first_name}},\n\nNoticed {{trigger_event}} at {{company}}...",
        buildPrompts:  "# Customization Prompts\n\n## Change lead source\n\"Switch from Apollo to LinkedIn Sales Navigator.\"",
      };
    }

    addLog("success", "Deploy guide generated ✓");
    addLog("success", "Email framework generated ✓");
    addLog("done", "🎉 Your workflow is ready — download below");

    setOutput(genOutput);
    setIsBuilding(false);
    setIsDone(true);
    onOutputReady(genOutput as unknown as Record<string, unknown>);
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const canGenerate = step === 4 || (config.icpPrompt.trim().length > 20);

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

      {/* ── LEFT PANEL: Questionnaire ── */}
      <div style={{
        width: 380, flexShrink: 0,
        borderRight: "1px solid #eceae4",
        display: "flex", flexDirection: "column",
        background: "white", overflow: "hidden",
      }}>
        {/* Step header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f4f3ef" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {([1, 2, 3, 4] as Step[]).map((s) => (
              <button
                key={s}
                onClick={() => !isBuilding && setStep(s)}
                style={{
                  flex: 1, padding: "6px 0",
                  fontSize: 11, fontWeight: 700, borderRadius: 8, border: "none",
                  cursor: isBuilding ? "not-allowed" : "pointer",
                  background: step === s ? "#1c5a1c" : step > s ? "#dcf0dc" : "#f4f3ef",
                  color: step === s ? "white" : step > s ? "#1c5a1c" : "#9CA3AF",
                  transition: "all 0.2s",
                }}
              >
                {step > s ? "✓" : s}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>
            {step === 1 ? "Choose Your Tools" :
             step === 2 ? "Define Your ICP" :
             step === 3 ? "Add Company Data" :
             "Review & Generate"}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
            {step === 1 ? "Select your lead source, CRM, enrichment & sequencer" :
             step === 2 ? "Describe your ideal customer profile" :
             step === 3 ? "Add target company URLs or context" :
             "Preview your workflow and generate"}
          </div>
        </div>

        {/* Step content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {step === 1 && <Step1 config={config} setConfig={setConfig} toggleEnrichment={toggleEnrichment} />}
          {step === 2 && <Step2 config={config} setConfig={setConfig} />}
          {step === 3 && <Step3 config={config} setConfig={setConfig} urlInput={urlInput} setUrlInput={setUrlInput} addUrl={addUrl} />}
          {step === 4 && <Step4 config={config} nodes={canvasNodes.length > 0 ? canvasNodes : buildNodeSequence(config).nodes} />}
        </div>

        {/* Navigation */}
        <div style={{
          padding: "16px 24px", borderTop: "1px solid #f4f3ef",
          display: "flex", gap: 8, background: "white",
        }}>
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              disabled={isBuilding}
              style={{
                padding: "10px 16px", fontSize: 13, fontWeight: 600,
                color: "#4B5563", background: "#f4f3ef", border: "none",
                borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
              }}
            >← Back</button>
          )}
          <button
            onClick={step < 4 ? () => setStep((s) => (s + 1) as Step) : generate}
            disabled={isBuilding || (step === 2 && config.icpPrompt.trim().length < 10)}
            style={{
              flex: 1, padding: "10px", fontSize: 13, fontWeight: 700,
              color: "white",
              background: isBuilding ? "#2d762d" : "#1c5a1c",
              border: "none", borderRadius: 10,
              cursor: isBuilding ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              opacity: (step === 2 && config.icpPrompt.trim().length < 10) ? 0.4 : 1,
              fontFamily: "inherit", transition: "all 0.2s",
            }}
          >
            {isBuilding ? (
              <>
                <span style={{
                  width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white", borderRadius: "50%",
                  animation: "spin 0.8s linear infinite", display: "inline-block",
                }} />
                Building...
              </>
            ) : step < 4 ? "Continue →" : "⚡ Generate Workflow"}
          </button>
        </div>
      </div>

      {/* ── RIGHT PANEL: Canvas + Output ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#111118" }}>

        {/* Canvas header */}
        <div style={{
          padding: "12px 20px", background: "#16161e",
          borderBottom: "1px solid #2a2a35",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#888", fontFamily: "monospace" }}>
              n8n workflow canvas
            </span>
            {isBuilding && (
              <span style={{
                fontSize: 11, fontWeight: 600, color: "#7C3AED",
                background: "#7C3AED22", padding: "2px 8px", borderRadius: 100, border: "1px solid #7C3AED44",
              }}>● Building...</span>
            )}
            {isDone && (
              <span style={{
                fontSize: 11, fontWeight: 600, color: "#4ADE80",
                background: "#4ADE8022", padding: "2px 8px", borderRadius: 100, border: "1px solid #4ADE8044",
              }}>✓ {canvasNodes.length} nodes</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {isDone && output && (
              <>
                {(["json", "guide", "email", "prompts"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 6,
                      border: "none", cursor: "pointer", fontFamily: "inherit",
                      background: activeTab === tab ? "#2a2a35" : "transparent",
                      color: activeTab === tab ? "#e0e0e0" : "#555",
                    }}
                  >
                    {tab === "json" ? "n8n JSON" : tab === "guide" ? "Deploy" : tab === "email" ? "Email" : "Prompts"}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Canvas area */}
        <div style={{ flex: isDone ? "0 0 55%" : "1", overflow: "hidden", position: "relative", minHeight: 280 }}>
          <N8nCanvas
            nodes={canvasNodes}
            connections={canvasEdges}
            activeNodeId={activeNodeId}
            isBuilding={isBuilding}
          />

          {/* Build log overlay */}
          {(isBuilding || log.length > 0) && (
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "rgba(17,17,24,0.92)",
              backdropFilter: "blur(8px)",
              borderTop: "1px solid #2a2a35",
              maxHeight: 110, overflowY: "auto",
              padding: "10px 16px",
            }}>
              {log.slice(-6).map((entry) => (
                <div key={entry.id} style={{
                  display: "flex", alignItems: "flex-start", gap: 8,
                  fontSize: 11, color:
                    entry.type === "success" ? "#4ADE80" :
                    entry.type === "error"   ? "#F87171" :
                    entry.type === "done"    ? "#7C3AED" :
                    entry.type === "building"? "#7C9EF8" : "#888",
                  marginBottom: 3, fontFamily: "monospace",
                }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>
                    {entry.type === "success" ? "✓" :
                     entry.type === "error"   ? "✗" :
                     entry.type === "done"    ? "★" :
                     entry.type === "building"? "›" : "·"}
                  </span>
                  {entry.text}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Code output panel */}
        {isDone && output && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            borderTop: "1px solid #2a2a35", overflow: "hidden",
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 16px", background: "#16161e", borderBottom: "1px solid #2a2a35", flexShrink: 0,
            }}>
              <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>
                {activeTab === "json"    ? "prospect-pal-workflow.json" :
                 activeTab === "guide"   ? "deploy-guide.md" :
                 activeTab === "email"   ? "email-template.md" : "build-prompts.md"}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => copy(
                    activeTab === "json"   ? output.n8nJson :
                    activeTab === "guide"  ? output.deployGuide :
                    activeTab === "email"  ? output.emailTemplate : output.buildPrompts
                  )}
                  style={{
                    padding: "4px 10px", fontSize: 11, fontWeight: 600,
                    color: copied ? "#4ADE80" : "#888", background: "#2a2a35",
                    border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
                <button
                  onClick={() => download(
                    activeTab === "json"   ? output.n8nJson :
                    activeTab === "guide"  ? output.deployGuide :
                    activeTab === "email"  ? output.emailTemplate : output.buildPrompts,
                    activeTab === "json"   ? "prospect-pal-workflow.json" :
                    activeTab === "guide"  ? "deploy-guide.md" :
                    activeTab === "email"  ? "email-template.md" : "build-prompts.md"
                  )}
                  style={{
                    padding: "4px 10px", fontSize: 11, fontWeight: 700,
                    color: "white", background: "#1c5a1c",
                    border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
                  }}
                >↓ Download</button>
              </div>
            </div>
            <div style={{ flex: 1, overflow: "auto" }}>
              <pre style={{
                margin: 0, padding: "14px 16px",
                fontSize: 11, lineHeight: 1.6,
                color: "#a8b4c8", fontFamily: "monospace",
                whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                {activeTab === "json"    ? output.n8nJson :
                 activeTab === "guide"   ? output.deployGuide :
                 activeTab === "email"   ? output.emailTemplate : output.buildPrompts}
              </pre>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUB-STEP COMPONENTS
// ─────────────────────────────────────────────────────────────
function Step1({ config, setConfig, toggleEnrichment }: {
  config: WorkflowConfig;
  setConfig: React.Dispatch<React.SetStateAction<WorkflowConfig>>;
  toggleEnrichment: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Section label="Lead Source" hint="Where do prospects come from?">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {LEAD_SOURCES.map((s) => (
            <OptionRow
              key={s.id}
              emoji={s.emoji} label={s.label} desc={s.desc}
              selected={config.leadSource === s.id}
              onClick={() => setConfig((c) => ({ ...c, leadSource: s.id as WorkflowConfig["leadSource"] }))}
              single
            />
          ))}
        </div>
      </Section>

      <Section label="Enrichment" hint="Select one or more">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {ENRICHMENT_TOOLS.map((t) => (
            <OptionRow
              key={t.id}
              emoji={t.emoji} label={t.label} desc={t.desc}
              selected={config.enrichment.includes(t.id as WorkflowConfig["enrichment"][0])}
              onClick={() => toggleEnrichment(t.id)}
            />
          ))}
        </div>
      </Section>

      <Section label="CRM">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {CRM_OPTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setConfig((cfg) => ({ ...cfg, crm: c.id as WorkflowConfig["crm"] }))}
              style={{
                padding: "8px 10px", borderRadius: 8,
                border: `1.5px solid ${config.crm === c.id ? "#1c5a1c" : "#eceae4"}`,
                background: config.crm === c.id ? "#f0f9f0" : "white",
                cursor: "pointer", fontSize: 12, fontWeight: 600,
                color: config.crm === c.id ? "#1c5a1c" : "#6B7280",
                display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
              }}
            >
              <span>{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>
      </Section>

      <Section label="Email Sequencer">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {SEQUENCER_OPTIONS.map((s) => (
            <OptionRow
              key={s.id}
              emoji={s.emoji} label={s.label} desc={s.desc}
              selected={config.sequencer === s.id}
              onClick={() => setConfig((c) => ({ ...c, sequencer: s.id as WorkflowConfig["sequencer"] }))}
              single
            />
          ))}
        </div>
      </Section>

      <Section label="Options">
        <Toggle
          label="Human approval gate"
          desc="Review emails in Slack before sending"
          value={config.approvalGate}
          onChange={(v) => setConfig((c) => ({ ...c, approvalGate: v }))}
        />
        <Toggle
          label="Slack daily summary"
          desc="Get daily stats in Slack"
          value={config.slackAlerts}
          onChange={(v) => setConfig((c) => ({ ...c, slackAlerts: v }))}
        />
      </Section>
    </div>
  );
}

function Step2({ config, setConfig }: {
  config: WorkflowConfig;
  setConfig: React.Dispatch<React.SetStateAction<WorkflowConfig>>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Section label="Your ICP Description" hint="Required — be specific">
        <textarea
          value={config.icpPrompt}
          onChange={(e) => setConfig((c) => ({ ...c, icpPrompt: e.target.value }))}
          placeholder="e.g. VP of Sales or Head of Revenue Ops at B2B SaaS companies with 50-500 employees, US-based, Series A-C, using Salesforce or HubSpot. They struggle with manual SDR research and poor email personalization at scale."
          style={{
            width: "100%", minHeight: 160, padding: "12px",
            fontSize: 13, lineHeight: 1.6, borderRadius: 10, resize: "vertical",
            border: "1.5px solid #eceae4", outline: "none", fontFamily: "inherit",
            color: "#111", background: "white", boxSizing: "border-box",
          }}
          onFocus={(e) => e.target.style.borderColor = "#1c5a1c"}
          onBlur={(e)  => e.target.style.borderColor = "#eceae4"}
        />
        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>
          Include: titles, company size, industry, pain points, tech stack signals
        </div>
      </Section>

      <div style={{
        background: "#f0f9f0", border: "1px solid #bce3bc",
        borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#2d762d", lineHeight: 1.6,
      }}>
        <strong>💡 Tips for better results:</strong><br />
        • Name specific job titles (VP Sales, not "sales people")<br />
        • Include company size range (50-500 employees)<br />
        • Mention buying triggers (hiring SDRs, Series A funded)
      </div>

      <Section label="What do you sell?" hint="Your value proposition">
        <textarea
          value={(config as WorkflowConfig & { productDescription?: string }).productDescription || ""}
          onChange={(e) => setConfig((c) => ({ ...c, productDescription: e.target.value } as WorkflowConfig & { productDescription: string }))}
          placeholder="e.g. AI-powered sales intelligence platform that automates prospect research and email personalization for B2B sales teams."
          style={{
            width: "100%", minHeight: 80, padding: "12px",
            fontSize: 13, lineHeight: 1.6, borderRadius: 10, resize: "vertical",
            border: "1.5px solid #eceae4", outline: "none", fontFamily: "inherit",
            color: "#111", background: "white", boxSizing: "border-box",
          }}
          onFocus={(e) => e.target.style.borderColor = "#1c5a1c"}
          onBlur={(e)  => e.target.style.borderColor = "#eceae4"}
        />
      </Section>
    </div>
  );
}

function Step3({ config, setConfig, urlInput, setUrlInput, addUrl }: {
  config: WorkflowConfig;
  setConfig: React.Dispatch<React.SetStateAction<WorkflowConfig>>;
  urlInput: string;
  setUrlInput: (v: string) => void;
  addUrl: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Section label="Target Company URLs" hint="Optional — add specific companies to target">
        <div style={{ display: "flex", gap: 6 }}>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addUrl()}
            placeholder="https://company.com"
            style={{
              flex: 1, padding: "9px 12px", fontSize: 13,
              border: "1.5px solid #eceae4", borderRadius: 8,
              outline: "none", fontFamily: "inherit", color: "#111",
            }}
          />
          <button onClick={addUrl} style={{
            padding: "9px 14px", fontSize: 13, fontWeight: 700,
            color: "white", background: "#1c5a1c", border: "none", borderRadius: 8,
            cursor: "pointer", fontFamily: "inherit",
          }}>+</button>
        </div>
        {config.companyUrls.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
            {config.companyUrls.map((url, i) => (
              <span key={i} style={{
                fontSize: 11, padding: "3px 8px",
                background: "#f4f3ef", borderRadius: 100, color: "#4B5563",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                🔗 {new URL(url).hostname}
                <button
                  onClick={() => setConfig((c) => ({ ...c, companyUrls: c.companyUrls.filter((_, j) => j !== i) }))}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0 }}
                >✕</button>
              </span>
            ))}
          </div>
        )}
      </Section>

      <Section label="Additional Context" hint="Optional — paste company data, job descriptions, press releases">
        <textarea
          value={config.companyPrompt}
          onChange={(e) => setConfig((c) => ({ ...c, companyPrompt: e.target.value }))}
          placeholder="Paste any relevant context: competitor names, recent news, specific pain points you've heard, verticals to focus on..."
          style={{
            width: "100%", minHeight: 120, padding: "12px",
            fontSize: 13, lineHeight: 1.6, borderRadius: 10, resize: "vertical",
            border: "1.5px solid #eceae4", outline: "none", fontFamily: "inherit",
            color: "#111", background: "white", boxSizing: "border-box",
          }}
          onFocus={(e) => e.target.style.borderColor = "#1c5a1c"}
          onBlur={(e)  => e.target.style.borderColor = "#eceae4"}
        />
      </Section>

      <div style={{
        background: "#fffbeb", border: "1px solid #fde68a",
        borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#92400e",
      }}>
        <strong>⚡ Optional step</strong> — you can skip this and generate now. Company URLs and context
        make the AI email writer more personalized.
      </div>
    </div>
  );
}

function Step4({ config, nodes }: { config: WorkflowConfig; nodes: N8nNode[] }) {
  const toolStack = [
    { label: "Lead Source",  value: config.leadSource },
    { label: "Enrichment",   value: config.enrichment.join(", ") },
    { label: "CRM",          value: config.crm },
    { label: "Sequencer",    value: config.sequencer },
    { label: "Approval",     value: config.approvalGate ? "Enabled (Slack)" : "Auto-send" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#f0f9f0", border: "1px solid #bce3bc", borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1c5a1c", marginBottom: 10 }}>Your Configuration</div>
        {toolStack.map((t) => (
          <div key={t.label} style={{
            display: "flex", justifyContent: "space-between",
            fontSize: 12, marginBottom: 6, color: "#4B5563",
          }}>
            <span style={{ color: "#9CA3AF" }}>{t.label}</span>
            <span style={{ fontWeight: 600, color: "#111" }}>{t.value}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "#f4f3ef", borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 10 }}>
          {nodes.length} Nodes Will Be Generated
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {nodes.map((n, i) => (
            <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                background: "#1c5a1c", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, flexShrink: 0,
              }}>{i + 1}</span>
              <span>{n.icon}</span>
              <span style={{ color: "#111", fontWeight: 500 }}>{n.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: "white", border: "1px solid #eceae4",
        borderRadius: 12, padding: 14, fontSize: 12, color: "#6B7280", lineHeight: 1.6,
      }}>
        <strong style={{ color: "#111" }}>What you'll get:</strong><br />
        📄 n8n workflow JSON (import-ready)<br />
        📖 Step-by-step deploy guide<br />
        ✉️ PAS email template with variables<br />
        💬 Build prompts to customize later
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// REUSABLE UI PRIMITIVES
// ─────────────────────────────────────────────────────────────
function Section({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{label}</span>
        {hint && <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 6 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function OptionRow({ emoji, label, desc, selected, onClick, single }: {
  emoji: string; label: string; desc: string;
  selected: boolean; onClick: () => void; single?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 12px", borderRadius: 8, cursor: "pointer",
        border: `1.5px solid ${selected ? "#1c5a1c" : "#eceae4"}`,
        background: selected ? "#f0f9f0" : "white",
        textAlign: "left", width: "100%", fontFamily: "inherit",
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 16, flexShrink: 0 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: selected ? "#1c5a1c" : "#111" }}>{label}</div>
        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{desc}</div>
      </div>
      <div style={{
        width: 16, height: 16, borderRadius: single ? "50%" : 4, flexShrink: 0,
        border: `2px solid ${selected ? "#1c5a1c" : "#D1D5DB"}`,
        background: selected ? "#1c5a1c" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {selected && <span style={{ color: "white", fontSize: 9, fontWeight: 800 }}>✓</span>}
      </div>
    </button>
  );
}

function Toggle({ label, desc, value, onChange }: {
  label: string; desc: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 0", borderBottom: "1px solid #f4f3ef",
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>{label}</div>
        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 40, height: 22, borderRadius: 11, border: "none",
          background: value ? "#1c5a1c" : "#D1D5DB", cursor: "pointer",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute", top: 3,
          left: value ? 20 : 3,
          width: 16, height: 16, borderRadius: "50%", background: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s",
        }} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function generateFallbackJson(config: WorkflowConfig, nodes: N8nNode[]): string {
  const n8nNodes = nodes.map((n, i) => ({
    id: `node_${i + 1}`, name: n.label, type: n.type,
    typeVersion: 1, position: [300 + (i % 4) * 260, 200 + Math.floor(i / 4) * 200],
    parameters: {}, credentials: {},
  }));
  return JSON.stringify({
    nodes: n8nNodes, connections: {}, active: false,
    settings: { executionOrder: "v1" },
    meta: { generatedBy: "Prospect PAL", config: { leadSource: config.leadSource, crm: config.crm, sequencer: config.sequencer } },
  }, null, 2);
}
