"use client";

import { useState, useRef, useEffect, FormEvent, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Button, Card, Badge, Icon, PipelineRail, PipelineNode } from "@/components/ds";
import { IntakeData } from "./WizardView";
import { WorkflowCanvas } from "@/components/canvas";
import { DeployModal } from "@/components/ds/app/DeployModal";
import { buildNodeSequence } from "@/lib/workflow-generator";
interface BuilderViewProps {
  wizardData?: IntakeData | null;
  onCompiled?: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface WorkflowConfig {
  icpPrompt: string;
  leadSource: "apollo" | "linkedin" | "upload_csv" | "hubspot_stage" | "manual";
  enrichment: ("clay" | "hunter" | "clearbit" | "apollo_enrich")[];
  crm: "hubspot" | "salesforce" | "attio" | "pipedrive" | "none";
  sequencer: "smartlead" | "amplemarket" | "instantly" | "lemlist" | "hubspot_seq";
  approvalGate: boolean;
  slackAlerts: boolean;
}

interface OrchestrationResult {
  success: boolean;
  workflow?: any;
  deployGuide?: string;
  trace?: {
    phase: string;
    priority: number;
    skill: string;
    executionTimeMs: number;
  };
  metadata?: {
    nodeCount?: number;
  };
  error?: string;
}

const NINE_NODES: PipelineNode[] = [
  { title: "Intake & cron", subtitle: "Trigger source", icon: "Zap", stage: "trigger", binding: "n8n-nodes-base.cron" },
  { title: "Data normalizer", subtitle: "Schema transform", icon: "FileBraces", stage: "logic", binding: "n8n-nodes-base.set" },
  { title: "CRM dedupe shield", subtitle: "Deal protection", icon: "ShieldCheck", stage: "shield", binding: "n8n-nodes-base.hubspot" },
  { title: "Data tool adapter", subtitle: "Contact reveal", icon: "Search", stage: "data", binding: "n8n-nodes-base.apollo" },
  { title: "AI research & PAS", subtitle: "Email copy", icon: "Sparkles", stage: "ai", binding: "n8n-nodes-base.openai" },
  { title: "Approval switch", subtitle: "Human gate", icon: "Scale", stage: "logic", binding: "n8n-nodes-base.switch" },
  { title: "CRM contact create", subtitle: "Lead sync", icon: "Database", stage: "shield", binding: "n8n-nodes-base.hubspot" },
  { title: "Sequence enrollment", subtitle: "Outreach start", icon: "Send", stage: "sequence", binding: "n8n-nodes-base.smartlead" },
  { title: "Review alert", subtitle: "Slack notify", icon: "Bell", stage: "logic", binding: "n8n-nodes-base.slack" },
];

const DEFAULT_CONFIG: WorkflowConfig = {
  icpPrompt: "",
  leadSource: "apollo",
  enrichment: ["apollo_enrich"],
  crm: "hubspot",
  sequencer: "smartlead",
  approvalGate: true,
  slackAlerts: true,
};

export default function BuilderView({ wizardData, onCompiled }: BuilderViewProps) {
  const [mode, setMode] = useState<"chat" | "form">("chat");
  const [activeNode, setActiveNode] = useState(2);
  const [isCompiling, setIsCompiling] = useState(false);

  // Map wizard data to config
  const initialConfig: WorkflowConfig = wizardData ? {
    icpPrompt: `${wizardData.companyBackground}\n\nProduct: ${wizardData.product}\n\nICP: ${wizardData.icp}`,
    leadSource: (wizardData.trigger?.toLowerCase().includes("apollo") ? "apollo" :
                 wizardData.trigger?.toLowerCase().includes("csv") ? "upload_csv" : "apollo") as WorkflowConfig["leadSource"],
    enrichment: [wizardData.dataTools?.toLowerCase().includes("clay") ? "clay" : "apollo_enrich"] as WorkflowConfig["enrichment"],
    crm: (wizardData.crm?.toLowerCase().includes("hubspot") ? "hubspot" :
          wizardData.crm?.toLowerCase().includes("salesforce") ? "salesforce" :
          wizardData.crm?.toLowerCase().includes("pipedrive") ? "pipedrive" : "hubspot") as WorkflowConfig["crm"],
    sequencer: (wizardData.outreach?.toLowerCase().includes("smartlead") ? "smartlead" :
                wizardData.outreach?.toLowerCase().includes("instantly") ? "instantly" :
                wizardData.outreach?.toLowerCase().includes("lemlist") ? "lemlist" : "smartlead") as WorkflowConfig["sequencer"],
    approvalGate: wizardData.approvalPolicy?.toLowerCase().includes("human") || wizardData.approvalPolicy?.toLowerCase().includes("approval") || true,
    slackAlerts: true,
  } : DEFAULT_CONFIG;

  const initialMessage = wizardData
    ? `Got it! I've configured your workflow based on your inputs:\n\n• **CRM:** ${wizardData.crm}\n• **Outreach:** ${wizardData.outreach}\n• **Enrichment:** ${wizardData.dataTools}\n• **AI:** ${wizardData.llm}\n\nReady to compile? Click "Compile Workflow" or refine any settings below.`
    : "I'm your GTM automation architect. Tell me who you sell to, which tools hold your data, and how leads should enter the system.";

  const { messages, status, sendMessage, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: [
      {
        id: "initial",
        role: "assistant",
        parts: [{ type: "text", text: initialMessage }],
      } as unknown as UIMessage
    ]
  });

  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";
  
  const [config, setConfig] = useState<WorkflowConfig>(initialConfig);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [result, setResult] = useState<OrchestrationResult | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { nodes: generatedNodes, connections: generatedConnections } = useMemo(() => buildNodeSequence({ ...config, companyUrls: [], companyPrompt: "" }), [config]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Chat mode: conversational interaction
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Extract ICP from chat input
    setConfig((prev) => ({ ...prev, icpPrompt: prev.icpPrompt || input.trim() }));

    sendMessage({ role: "user", parts: [{ type: "text", text: input.trim() }] } as any);
    setInput("");
  };

  // Form mode: structured configuration
  const handleCompile = async () => {
    if (!config.icpPrompt.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          parts: [{ type: "text", text: "Please describe your ICP first (either in chat or form mode)." }],
        } as unknown as UIMessage,
      ]);
      return;
    }

    setIsCompiling(true);
    setResult(null);

    try {
      const res = await fetch("/api/orchestrate/unified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: config,
          apiKey: apiKey || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data);
        setMessages((prev) => [
          ...prev,
          {
            id: `compile-${Date.now()}`,
            role: "assistant",
            parts: [{ type: "text", text: `Workflow compiled successfully!\n\nPhase: ${data.trace?.phase}\nSkill: ${data.trace?.skill}\nNodes: ${data.metadata?.nodeCount || "9"}\nTime: ${data.trace?.executionTimeMs}ms\n\nClick "Download JSON" to get your n8n workflow.` }],
          } as unknown as UIMessage,
        ]);
        onCompiled?.();
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            parts: [{ type: "text", text: data.error || "Compilation failed. Please check your API key and try again." }],
          } as unknown as UIMessage,
        ]);
      }
    } catch (error) {
      console.error("Compile error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          parts: [{ type: "text", text: "Compilation failed. Check your API key or try again." }],
        } as unknown as UIMessage,
      ]);
    } finally {
      setIsCompiling(false);
    }
  };

  const downloadWorkflow = () => {
    if (!result?.workflow) return;
    const blob = new Blob([JSON.stringify(result.workflow, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prospect-pal-workflow.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Left: Chat/Form Pane */}
      <div
        style={{
          width: "var(--layout-pane, 440px)",
          flexShrink: 0,
          background: "var(--surface-card)",
          borderRight: "1px solid var(--border-hairline)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--border-hairline)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "var(--text-h4)", fontWeight: "var(--weight-bold)" }}>
              PAE workflow compiler
            </div>
            <div style={{ fontSize: "var(--text-micro)", color: "var(--text-muted)" }}>
              PAL intake gate &middot; 9-node reference pattern
            </div>
          </div>
          <div style={{ display: "flex", background: "var(--surface-sunken)", padding: 3, borderRadius: "var(--radius-sm)" }}>
            {(["chat", "form"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: "4px 11px",
                  fontSize: "var(--text-micro)",
                  fontWeight: "var(--weight-semibold)",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "var(--radius-xs)",
                  fontFamily: "inherit",
                  background: mode === m ? "var(--surface-card)" : "transparent",
                  color: mode === m ? "var(--text-brand)" : "var(--text-muted)",
                  boxShadow: mode === m ? "var(--shadow-hairline)" : "none",
                }}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {mode === "chat" ? (
          <>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "var(--radius-xl)",
                    maxWidth: msg.role === "user" ? "80%" : "85%",
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    background: msg.role === "user" ? "var(--action-primary)" : "var(--surface-card)",
                    color: msg.role === "user" ? "var(--text-inverse)" : "var(--text-primary)",
                    border: msg.role === "assistant" ? "1px solid var(--border-hairline)" : "none",
                    boxShadow: msg.role === "assistant" ? "var(--shadow-card)" : "none",
                    fontSize: "var(--text-body-sm)",
                    lineHeight: "var(--leading-relaxed)",
                    whiteSpace: "pre-wrap",
                    borderBottomRightRadius: msg.role === "user" ? "var(--radius-xs)" : undefined,
                    borderBottomLeftRadius: msg.role === "assistant" ? "var(--radius-xs)" : undefined,
                  }}
                >
                  {msg.parts?.[0]?.type === "text" ? msg.parts[0].text : "..."}
                </div>
              ))}
              {isLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "var(--ink-400)",
                          animation: `bounce-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                  <span>Resolving tool bindings</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={onSubmit} style={{ padding: "12px 16px", borderTop: "1px solid var(--border-hairline)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. VP Sales at Series A SaaS, HubSpot + Apollo..."
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    fontSize: "var(--text-body-sm)",
                    borderRadius: "var(--radius-md)",
                    border: "1.5px solid var(--border-hairline)",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                />
                <Button type="submit" variant="primary" icon="ArrowUp" disabled={isLoading || !input.trim()}>
                  Send
                </Button>
              </div>
            </form>
          </>
        ) : (
          /* Form Mode */
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* ICP */}
              <div>
                <label style={{ fontSize: "var(--text-micro)", fontWeight: "var(--weight-semibold)", color: "var(--text-muted)", marginBottom: 6, display: "block" }}>
                  Ideal Customer Profile *
                </label>
                <textarea
                  value={config.icpPrompt}
                  onChange={(e) => setConfig((prev) => ({ ...prev, icpPrompt: e.target.value }))}
                  placeholder="e.g. Series A SaaS companies with 50-200 employees in DevOps space"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    fontSize: "var(--text-body-sm)",
                    borderRadius: "var(--radius-md)",
                    border: "1.5px solid var(--border-hairline)",
                    fontFamily: "inherit",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Lead Source */}
              <div>
                <label style={{ fontSize: "var(--text-micro)", fontWeight: "var(--weight-semibold)", color: "var(--text-muted)", marginBottom: 6, display: "block" }}>
                  Lead Source
                </label>
                <select
                  value={config.leadSource}
                  onChange={(e) => setConfig((prev) => ({ ...prev, leadSource: e.target.value as any }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-hairline)", fontFamily: "inherit" }}
                >
                  <option value="apollo">Apollo (search)</option>
                  <option value="linkedin">LinkedIn Sales Navigator</option>
                  <option value="upload_csv">CSV Upload</option>
                  <option value="hubspot_stage">HubSpot Stage Change</option>
                  <option value="manual">Manual Entry</option>
                </select>
              </div>

              {/* CRM */}
              <div>
                <label style={{ fontSize: "var(--text-micro)", fontWeight: "var(--weight-semibold)", color: "var(--text-muted)", marginBottom: 6, display: "block" }}>
                  CRM
                </label>
                <select
                  value={config.crm}
                  onChange={(e) => setConfig((prev) => ({ ...prev, crm: e.target.value as any }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-hairline)", fontFamily: "inherit" }}
                >
                  <option value="hubspot">HubSpot</option>
                  <option value="salesforce">Salesforce</option>
                  <option value="attio">Attio</option>
                  <option value="pipedrive">Pipedrive</option>
                  <option value="none">None</option>
                </select>
              </div>

              {/* Sequencer */}
              <div>
                <label style={{ fontSize: "var(--text-micro)", fontWeight: "var(--weight-semibold)", color: "var(--text-muted)", marginBottom: 6, display: "block" }}>
                  Sequencer
                </label>
                <select
                  value={config.sequencer}
                  onChange={(e) => setConfig((prev) => ({ ...prev, sequencer: e.target.value as any }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-hairline)", fontFamily: "inherit" }}
                >
                  <option value="smartlead">Smartlead</option>
                  <option value="amplemarket">AmpleMarket</option>
                  <option value="instantly">Instantly</option>
                  <option value="lemlist">Lemlist</option>
                  <option value="hubspot_seq">HubSpot Sequences</option>
                </select>
              </div>

              {/* Toggles */}
              <div style={{ display: "flex", gap: 16 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={config.approvalGate}
                    onChange={(e) => setConfig((prev) => ({ ...prev, approvalGate: e.target.checked }))}
                  />
                  <span style={{ fontSize: "var(--text-body-sm)" }}>Approval Gate</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={config.slackAlerts}
                    onChange={(e) => setConfig((prev) => ({ ...prev, slackAlerts: e.target.checked }))}
                  />
                  <span style={{ fontSize: "var(--text-body-sm)" }}>Slack Alerts</span>
                </label>
              </div>

              {/* API Key (BYOK) */}
              <div style={{ borderTop: "1px solid var(--border-hairline)", paddingTop: 14, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    fontSize: "var(--text-micro)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Icon name="KeyRound" size={12} />
                  {showApiKeyInput ? "Hide API Key" : "Add API Key (BYOK)"}
                </button>
                {showApiKeyInput && (
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-... (OpenRouter) or sk-ant-... (Anthropic)"
                    style={{
                      width: "100%",
                      marginTop: 8,
                      padding: "10px 14px",
                      fontSize: "var(--text-body-sm)",
                      borderRadius: "var(--radius-md)",
                      border: "1.5px solid var(--border-hairline)",
                      fontFamily: "var(--font-data)",
                      outline: "none",
                    }}
                  />
                )}
                <p style={{ fontSize: "var(--text-micro)", color: "var(--text-muted)", marginTop: 6, lineHeight: 1.4 }}>
                  Your key is never stored. Get one at{" "}
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-brand)" }}>
                    openrouter.ai
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Compile Button (both modes) */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-hairline)", display: "flex", flexDirection: "column", gap: 8 }}>
          <Button variant="accent" fullWidth icon="Zap" onClick={handleCompile} disabled={isCompiling || !config.icpPrompt.trim()}>
            {isCompiling ? "Compiling engine..." : "Compile GTM engine"}
          </Button>
          {result?.success && (
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="outline" size="sm" icon="Download" onClick={downloadWorkflow} disabled={!result?.success} style={{ flex: 1 }}>
                Download JSON
              </Button>
              <Button variant="accent" size="sm" icon="Play" onClick={() => setIsDeployModalOpen(true)} disabled={!result?.success} style={{ flex: 1 }}>
                Deploy to n8n
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Canvas */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--surface-deep)", minWidth: 0 }}>
        <div
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid var(--border-deep)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-caption)", color: "var(--ink-300)" }}>
              prospect-pal-engine.json
            </span>
            <Badge tone="deep" mono>{result?.success ? `${result.metadata?.nodeCount || 9}-node workflow ready` : "9-node graph connected"}</Badge>
          </div>
          {result?.trace && (
            <Badge tone="deep" mono shape="rounded">
              {result.trace.skill} &middot; {result.trace.executionTimeMs}ms
            </Badge>
          )}
        </div>

        <div style={{ flex: 1, overflow: "auto", position: "relative", display: "flex", flexDirection: "column" }}>
          {result?.success ? (
            <div style={{ flex: 1, background: "#ffffff" }}>
              <WorkflowCanvas
                nodes={generatedNodes}
                connections={generatedConnections}
                selectedNodeId={null}
                onNodeSelect={() => {}}
              />
            </div>
          ) : (
            <div style={{ padding: "22px 20px" }}>
              <PipelineRail nodes={NINE_NODES} activeIndex={activeNode} onSelect={setActiveNode} onDeep />
              
              <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
                <div
                  style={{
                    background: "var(--surface-deep-raised)",
                    border: "1px solid var(--border-deep)",
                    borderRadius: "var(--radius-xl)",
                    padding: "18px 20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "var(--text-eyebrow)",
                      fontWeight: "var(--weight-semibold)",
                      textTransform: "uppercase",
                      letterSpacing: "var(--tracking-eyebrow)",
                      color: "var(--champagne-200)",
                      marginBottom: 6,
                    }}
                  >
                    Node {String(activeNode + 1).padStart(2, "0")} specification
                  </div>
                  <div style={{ fontSize: "var(--text-h3)", fontWeight: "var(--weight-semibold)", color: "var(--paper-0)", marginBottom: 6 }}>
                    {NINE_NODES[activeNode].title}
                  </div>
                  <p style={{ margin: 0, fontSize: "var(--text-body-sm)", color: "var(--ink-300)", lineHeight: "var(--leading-relaxed)" }}>
                    {NINE_NODES[activeNode].subtitle}. Bound to{" "}
                    <span style={{ fontFamily: "var(--font-data)", color: "var(--ink-100)" }}>
                      {NINE_NODES[activeNode].binding}
                    </span>
                    . Secrets stay as ENV references; nothing is written to Prospect PAL.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-deep)",
                      borderRadius: "var(--radius-lg)",
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "var(--text-micro)",
                        color: "var(--ink-400)",
                        textTransform: "uppercase",
                        letterSpacing: "var(--tracking-eyebrow)",
                        fontWeight: "var(--weight-semibold)",
                        marginBottom: 8,
                      }}
                    >
                      Requires connection
                    </div>
                    {[`ENV:${config.leadSource.toUpperCase()}_API_KEY`, `ENV:${config.sequencer.toUpperCase()}_API_KEY`].map((k) => (
                      <div
                        key={k}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          fontFamily: "var(--font-data)",
                          fontSize: "var(--text-micro)",
                          color: "var(--ink-200)",
                          marginBottom: 5,
                        }}
                      >
                        <Icon name="KeyRound" size={12} color="var(--champagne-300)" />
                        {k}
                      </div>
                    ))}
                  </div>

                  {/* Execution Trace */}
                  {result?.trace && (
                    <div
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border-deep)",
                        borderRadius: "var(--radius-lg)",
                        padding: "12px 14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "var(--text-micro)",
                      color: "var(--ink-400)",
                      textTransform: "uppercase",
                      letterSpacing: "var(--tracking-eyebrow)",
                      fontWeight: "var(--weight-semibold)",
                      marginBottom: 8,
                    }}
                  >
                    Execution trace
                  </div>
                  <div style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-micro)", color: "var(--ink-200)" }}>
                    <div>Phase: {result.trace.phase}</div>
                    <div>Skill: {result.trace.skill}</div>
                    <div>Priority: {result.trace.priority?.toFixed(2)}</div>
                    <div>Time: {result.trace.executionTimeMs}ms</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        workflowJson={result?.workflow}
        onDeploySuccess={(res) => {
          setIsDeployModalOpen(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `deploy-${Date.now()}`,
              role: "assistant",
              parts: [{ type: "text", text: `🚀 Successfully pushed workflow to n8n!\n\nOpen your instance to activate the newly deployed workflow.` }],
            } as unknown as UIMessage,
          ]);
        }}
      />

      <style jsx>{`
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
