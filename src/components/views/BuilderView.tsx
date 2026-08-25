"use client";

import { useState } from "react";
import N8nCanvas from "@/components/N8nCanvas";
import type { N8nNode } from "@/lib/workflow-generator";

interface BuilderViewProps {
  onOutputReady: (output: Record<string, unknown>) => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const PREVIEW_NODES: N8nNode[] = [
  { id: "1", label: "Trigger Ingest", type: "n8n-nodes-base.scheduleTrigger", category: "trigger", icon: "⚡", color: "#10B981", subtitle: "Schedule / Webhook" },
  { id: "2", label: "Data Normalizer", type: "n8n-nodes-base.code", category: "logic", icon: "🧹", color: "#3B82F6", subtitle: "Domain Sanitizer" },
  { id: "3", label: "CRM Dedupe Shield", type: "n8n-nodes-base.hubspot", category: "crm", icon: "🛡️", color: "#F97316", subtitle: "HubSpot / Salesforce" },
  { id: "4", label: "Contact Reveal", type: "n8n-nodes-base.httpRequest", category: "enrichment", icon: "🔍", color: "#8B5CF6", subtitle: "Apollo / Clay" },
  { id: "5", label: "AI PAS Copywriter", type: "langchain.agent", category: "ai", icon: "🤖", color: "#EC4899", subtitle: "GPT-4o / Claude" },
  { id: "6", label: "Approval Switch", type: "n8n-nodes-base.if", category: "logic", icon: "⚖️", color: "#6B7280", subtitle: "Slack Review Gate" },
  { id: "7", label: "CRM Upsert", type: "n8n-nodes-base.hubspot", category: "crm", icon: "💾", color: "#F97316", subtitle: "Create Contact" },
  { id: "8", label: "Sequencer Enroll", type: "n8n-nodes-base.httpRequest", category: "sequencer", icon: "📬", color: "#10B981", subtitle: "Smartlead / Instantly" },
  { id: "9", label: "Slack Notification", type: "n8n-nodes-base.slack", category: "logic", icon: "💬", color: "#8B5CF6", subtitle: "Review Alert" },
];

const PREVIEW_CONNECTIONS: [string, string][] = [
  ["1", "2"],
  ["2", "3"],
  ["3", "4"],
  ["4", "5"],
  ["5", "6"],
  ["6", "7"],
  ["7", "8"],
  ["6", "9"],
];

export default function BuilderView({ onOutputReady }: BuilderViewProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "configurator">("chat");
  const [isCompiling, setIsCompiling] = useState(false);

  // Stack Configurator State
  const [triggerType, setTriggerType] = useState<"schedule" | "spreadsheet" | "webhook">("schedule");
  const [crm, setCrm] = useState("hubspot");
  const [enrichment, setEnrichment] = useState("apollo");
  const [sequencer, setSequencer] = useState("smartlead");
  const [icpText, setIcpText] = useState("");
  const [valuePropText, setValuePropText] = useState("");

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro-1",
      role: "assistant",
      content:
        "👋 Hi! I am your Master GTM Automation Architect & n8n Engineer.\n\nTell me about your outbound pipeline: What is your target ICP (job titles, industry), what tools are in your stack (CRM, Apollo/Clay, Smartlead), and how should leads be ingested (Spreadsheet, Daily CRM cron, or Webhook)?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: `user_${Date.now()}`, role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })) }),
      });

      if (!res.ok) throw new Error("Chat request failed");
      const text = await res.text();
      setMessages([...updatedMessages, { id: `bot_${Date.now()}`, role: "assistant", content: text }]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content: "I received your input! When you are ready, click '⚡ Compile GTM Engine from Chat' below.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const compileFromChat = async () => {
    setIsCompiling(true);
    try {
      const intakeData = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intakeData }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Compilation failed");
      onOutputReady(data);
    } catch (err) {
      alert(`Compilation failed: ${err instanceof Error ? err.message : "Error"}`);
    } finally {
      setIsCompiling(false);
    }
  };

  const compileFromConfigurator = async () => {
    setIsCompiling(true);
    try {
      const intakeData = `
Trigger Type: ${triggerType}
CRM: ${crm}
Data Enrichment: ${enrichment}
Sequencer: ${sequencer}
Target ICP: ${icpText || "VP of Sales, Head of RevOps at B2B SaaS companies"}
Value Proposition: ${valuePropText || "AI-powered outbound automation engine"}
      `.trim();

      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intakeData }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Compilation failed");
      onOutputReady(data);
    } catch (err) {
      alert(`Compilation failed: ${err instanceof Error ? err.message : "Error"}`);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", background: "#fcfbfa" }}>
      {/* Left Configuration / Chat Pane */}
      <div style={{ width: 440, flexShrink: 0, borderRight: "1px solid #eceae4", display: "flex", flexDirection: "column", background: "white" }}>
        {/* Mode Switcher */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f4f3ef", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#111" }}>PAE Workflow Compiler</div>
            <div style={{ fontSize: 11, color: "#6B7280" }}>PAL Intake Gate & 5-Pillar Architecture</div>
          </div>
          <div style={{ display: "flex", background: "#f4f3ef", padding: 3, borderRadius: 8 }}>
            <button
              onClick={() => setActiveTab("chat")}
              style={{
                padding: "5px 10px",
                fontSize: 11,
                fontWeight: 700,
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "inherit",
                background: activeTab === "chat" ? "white" : "transparent",
                color: activeTab === "chat" ? "#1c5a1c" : "#6B7280",
                boxShadow: activeTab === "chat" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              }}
            >
              💬 AI Intake Chat
            </button>
            <button
              onClick={() => setActiveTab("configurator")}
              style={{
                padding: "5px 10px",
                fontSize: 11,
                fontWeight: 700,
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "inherit",
                background: activeTab === "configurator" ? "white" : "transparent",
                color: activeTab === "configurator" ? "#1c5a1c" : "#6B7280",
                boxShadow: activeTab === "configurator" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              }}
            >
              ⚙️ Visual Form
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "chat" ? (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            {/* Message Thread */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.map((m) => (
                <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "10px 14px",
                      borderRadius: 12,
                      fontSize: 13,
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                      background: m.role === "user" ? "#1c5a1c" : "#f4f3ef",
                      color: m.role === "user" ? "white" : "#111",
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ padding: "8px 14px", borderRadius: 10, background: "#f4f3ef", color: "#666", fontSize: 12 }}>
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input & Action */}
            <div style={{ padding: "14px 18px", borderTop: "1px solid #f4f3ef", background: "white" }}>
              <form onSubmit={sendMessage} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. Target VP of Sales, use HubSpot & Apollo..."
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1.5px solid #eceae4",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  style={{
                    padding: "0 16px",
                    borderRadius: 8,
                    background: "#1c5a1c",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 13,
                    border: "none",
                    cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  Send
                </button>
              </form>
              <button
                onClick={compileFromChat}
                disabled={isCompiling || messages.length <= 1}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 8,
                  background: "#2d762d",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 13,
                  border: "none",
                  cursor: isCompiling || messages.length <= 1 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  boxShadow: "0 2px 6px rgba(28,90,28,0.25)",
                }}
              >
                {isCompiling ? "Compiling Master Package..." : "⚡ Compile GTM Engine from Chat"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Trigger Type Selection */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                1. Ingestion Trigger Pattern:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {[
                  { id: "schedule", label: "Daily Cron", icon: "⏰" },
                  { id: "spreadsheet", label: "Spreadsheet", icon: "📄" },
                  { id: "webhook", label: "Webhook", icon: "⚡" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTriggerType(t.id as "schedule" | "spreadsheet" | "webhook")}
                    style={{
                      padding: "8px 4px",
                      borderRadius: 8,
                      border: `1.5px solid ${triggerType === t.id ? "#1c5a1c" : "#eceae4"}`,
                      background: triggerType === t.id ? "#f0f9f0" : "white",
                      color: triggerType === t.id ? "#1c5a1c" : "#4B5563",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <div>{t.icon}</div>
                    <div>{t.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stack Selection */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                2. CRM Shield System:
              </label>
              <select
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #eceae4", fontSize: 13 }}
              >
                <option value="hubspot">HubSpot CRM (OAuth2)</option>
                <option value="salesforce">Salesforce CRM</option>
                <option value="attio">Attio CRM</option>
                <option value="pipedrive">Pipedrive</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                3. Contact Reveal & Enrichment:
              </label>
              <select
                value={enrichment}
                onChange={(e) => setEnrichment(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #eceae4", fontSize: 13 }}
              >
                <option value="apollo">Apollo.io (250M+ Verified Contacts)</option>
                <option value="clay">Clay.com (Waterfall Enrichment)</option>
                <option value="zoominfo">ZoomInfo</option>
                <option value="amplemarket">Amplemarket Leads</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                4. Outreach Sequencer:
              </label>
              <select
                value={sequencer}
                onChange={(e) => setSequencer(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #eceae4", fontSize: 13 }}
              >
                <option value="smartlead">Smartlead.ai</option>
                <option value="instantly">Instantly.ai</option>
                <option value="hubspot_sales">HubSpot Sales Hub</option>
                <option value="lemlist">Lemlist</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                5. Target ICP & Titles:
              </label>
              <textarea
                value={icpText}
                onChange={(e) => setIcpText(e.target.value)}
                placeholder="e.g. VP of Sales, Head of Revenue Operations at US B2B SaaS companies with 50-500 employees..."
                style={{ width: "100%", minHeight: 70, padding: 10, borderRadius: 8, border: "1.5px solid #eceae4", fontSize: 12 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                6. Core Offer / Value Prop:
              </label>
              <textarea
                value={valuePropText}
                onChange={(e) => setValuePropText(e.target.value)}
                placeholder="e.g. Automated sales pipeline infrastructure that cuts manual prospecting time by 80%..."
                style={{ width: "100%", minHeight: 60, padding: 10, borderRadius: 8, border: "1.5px solid #eceae4", fontSize: 12 }}
              />
            </div>

            <button
              onClick={compileFromConfigurator}
              disabled={isCompiling}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: 8,
                background: "#1c5a1c",
                color: "white",
                fontWeight: 700,
                fontSize: 13,
                border: "none",
                cursor: isCompiling ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px rgba(28,90,28,0.3)",
              }}
            >
              {isCompiling ? "Compiling Master Package..." : "⚡ Generate & Compile Engine"}
            </button>
          </div>
        )}
      </div>

      {/* Right Canvas Pane */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#111118", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", background: "#16161e", borderBottom: "1px solid #2a2a35", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#888", fontFamily: "monospace" }}>9-Node Production Graph Architecture</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#4ADE80", background: "#4ADE8022", padding: "2px 8px", borderRadius: 100 }}>
              ✓ 5-Pillars Connected
            </span>
          </div>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>
            Trigger: {triggerType.toUpperCase()}
          </span>
        </div>

        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <N8nCanvas
            nodes={PREVIEW_NODES}
            connections={PREVIEW_CONNECTIONS}
            activeNodeId={null}
            isBuilding={false}
          />
        </div>
      </div>
    </div>
  );
}
