"use client";

import { useState } from "react";

interface OutputsViewProps {
  palOutput: Record<string, unknown> | null;
  projectId: string | null;
}

type Tab = "n8n" | "guide" | "prd" | "email" | "env" | "ack";

interface PushResult {
  success: boolean;
  workflowId?: string;
  workflowUrl?: string;
  nodeCount?: number;
  name?: string;
  message?: string;
  error?: string;
}

export default function OutputsView({ palOutput, projectId }: OutputsViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("n8n");
  const [copied, setCopied] = useState<string | null>(null);
  const [pushing, setPushing] = useState(false);
  const [pushResult, setPushResult] = useState<PushResult | null>(null);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [n8nUrl, setN8nUrl] = useState(
    typeof window !== "undefined" ? localStorage.getItem("ppal_n8n_url") || "" : ""
  );
  const [n8nApiKey, setN8nApiKey] = useState(
    typeof window !== "undefined" ? localStorage.getItem("ppal_n8n_key") || "" : ""
  );

  const tabs: { id: Tab; label: string; icon: string; desc: string }[] = [
    { id: "n8n", label: "n8n Workflow JSON", icon: "⚡", desc: "Production 9-node JSON" },
    { id: "guide", label: "Deploy Guide (BUILD_PROMPT.md)", icon: "📖", desc: "Setup & Credential Checklist" },
    { id: "prd", label: "GTM PRD & Architecture", icon: "📋", desc: "5-Pillar Spec & ICP Matrix" },
    { id: "email", label: "PAS Copywriting Framework", icon: "✉️", desc: "3-Sentence Cold Email Copy" },
    { id: "env", label: ".env Template", icon: "🔐", desc: "Environment Variables" },
    { id: "ack", label: "PAL Ack Contract", icon: "📜", desc: "Binding & Security Receipt" },
  ];

  const getContent = (tab: Tab): string => {
    if (!palOutput) return "";
    switch (tab) {
      case "n8n":
        return (
          (palOutput.n8nJson as string) ||
          (palOutput.n8nWorkflowJson as string) ||
          "// No workflow generated yet"
        );
      case "guide":
        return (
          (palOutput.buildPrompt as string) ||
          (palOutput.deployGuide as string) ||
          "# Deploy Guide\n\nNo deploy guide generated yet"
        );
      case "prd":
        return (
          (palOutput.prdOverview as string) ||
          "# Product Requirements Document\n\nNo PRD generated yet"
        );
      case "email":
        return (
          (palOutput.emailTemplate as string) ||
          (palOutput.emailFramework as string) ||
          "No email framework generated yet"
        );
      case "env":
        return (
          (palOutput.envTemplate as string) ||
          "# .env.template\n# Add your API keys below\n"
        );
      case "ack":
        return palOutput.ackJson
          ? JSON.stringify(palOutput.ackJson, null, 2)
          : "// Ack JSON will appear here after compilation";
    }
  };

  const copy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const download = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPackage = () => {
    if (!palOutput) return;
    const files = [
      { name: "prospect-pal-workflow.n8n.json", content: getContent("n8n"), type: "application/json" },
      { name: "BUILD_PROMPT.md", content: getContent("guide"), type: "text/markdown" },
      { name: "PRD.md", content: getContent("prd"), type: "text/markdown" },
      { name: "email-framework.md", content: getContent("email"), type: "text/markdown" },
      { name: ".env.template", content: getContent("env"), type: "text/plain" },
      { name: "ack-contract.json", content: getContent("ack"), type: "application/json" },
    ];
    files.forEach((f) => download(f.content, f.name, f.type));
  };

  const pushToN8n = async () => {
    if (!n8nUrl || !n8nApiKey) {
      setDeployModalOpen(true);
      return;
    }
    const workflowJson = getContent("n8n");
    if (!workflowJson || workflowJson.startsWith("//")) {
      alert("Generate a workflow first.");
      return;
    }
    setPushing(true);
    setPushResult(null);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("ppal_n8n_url", n8nUrl);
        localStorage.setItem("ppal_n8n_key", n8nApiKey);
      }
      const res = await fetch("/api/n8n/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          n8nUrl,
          n8nApiKey,
          workflowJson,
          workflowName: "Prospect PAL - Outbound Engine",
        }),
      });
      const data = (await res.json()) as PushResult;
      setPushResult(data);
      setDeployModalOpen(false);
    } catch {
      setPushResult({ success: false, error: "Network error — please try again" });
    } finally {
      setPushing(false);
    }
  };

  if (!palOutput) {
    return (
      <div style={{ padding: 48, maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
        <div style={{ background: "white", border: "1px solid #eceae4", borderRadius: 20, padding: 56, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>📦</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111", margin: "0 0 8px" }}>No Generated Outputs Yet</h2>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px", lineHeight: 1.6 }}>
            Use the <strong>Build Workflow</strong> tab to describe your ICP and stack. The Master Agent will compile your production n8n package.
          </p>
        </div>
      </div>
    );
  }

  const content = getContent(activeTab);
  const ack = palOutput.ackJson as Record<string, unknown> | undefined;

  return (
    <div style={{ padding: "28px 36px", maxWidth: 1100, margin: "0 auto", overflowY: "auto", height: "100%" }}>
      {/* Header Banner */}
      <div style={{ background: "white", border: "1px solid #eceae4", borderRadius: 16, padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>⚡</span>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: "#111", margin: 0 }}>
                Prospect Automation Engine — Production Deliverable Package
              </h1>
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4, marginLeft: 32 }}>
              Status: <span style={{ color: "#1c5a1c", fontWeight: 700 }}>✓ Approved & Compiled</span> · Trigger: <span style={{ fontWeight: 600, color: "#111" }}>{String(palOutput.triggerType || "schedule").toUpperCase()}</span> · Project: {projectId || "PAE-001"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={downloadPackage}
              style={{
                padding: "9px 16px",
                fontSize: 13,
                fontWeight: 700,
                color: "#1c5a1c",
                background: "#f0f9f0",
                border: "1.5px solid #bce3bc",
                borderRadius: 9,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              ↓ Download Full Package (.zip/files)
            </button>
            <button
              onClick={() => setDeployModalOpen(true)}
              style={{
                padding: "9px 18px",
                fontSize: 13,
                fontWeight: 700,
                color: "white",
                background: "#1c5a1c",
                border: "none",
                borderRadius: 9,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 2px 8px rgba(28,90,28,0.3)",
              }}
            >
              <span>⚡</span> Connect & Deploy to n8n
            </button>
          </div>
        </div>

        {/* Resolved Bindings Badges */}
        {ack && Array.isArray(ack.resolved_bindings) && (
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #f4f3ef", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(ack.resolved_bindings as { capability: string; concreteBinding: string; authMode: string }[]).map((b, i) => (
              <span key={i} style={{ fontSize: 11, background: "#f4f3ef", padding: "4px 10px", borderRadius: 100, color: "#374151" }}>
                <strong>{b.capability}:</strong> {b.concreteBinding} ({b.authMode})
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "inherit",
              border: activeTab === tab.id ? "1.5px solid #1c5a1c" : "1.5px solid #eceae4",
              background: activeTab === tab.id ? "#1c5a1c" : "white",
              color: activeTab === tab.id ? "white" : "#4B5563",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Card */}
      <div style={{ background: "white", border: "1px solid #eceae4", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "#f9f9f8", borderBottom: "1px solid #eceae4" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#4B5563" }}>
            {tabs.find((t) => t.id === activeTab)?.desc}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => copy(content, activeTab)}
              style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#374151", background: "white", border: "1px solid #eceae4", borderRadius: 7, cursor: "pointer" }}
            >
              {copied === activeTab ? "✓ Copied" : "Copy"}
            </button>
            <button
              onClick={() =>
                download(
                  content,
                  activeTab === "n8n"
                    ? "prospect-pal-workflow.n8n.json"
                    : activeTab === "env"
                    ? ".env.template"
                    : activeTab === "ack"
                    ? "ack-contract.json"
                    : `${activeTab}.md`,
                  activeTab === "n8n" || activeTab === "ack" ? "application/json" : "text/markdown"
                )
              }
              style={{ padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "white", background: "#1c5a1c", border: "none", borderRadius: 7, cursor: "pointer" }}
            >
              ↓ Download
            </button>
          </div>
        </div>

        <div style={{ maxHeight: 520, overflowY: "auto" }}>
          <pre style={{
            margin: 0,
            padding: 20,
            background: "#111827",
            color: activeTab === "n8n" || activeTab === "ack" ? "#7C9EF8" : "#E5E7EB",
            fontSize: 12,
            lineHeight: 1.6,
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}>
            {content}
          </pre>
        </div>
      </div>

      {/* Deploy Success/Error Message */}
      {pushResult && (
        <div style={{
          padding: 16,
          borderRadius: 12,
          marginBottom: 20,
          background: pushResult.success ? "#f0f9f0" : "#fef2f2",
          border: `1px solid ${pushResult.success ? "#bce3bc" : "#fca5a5"}`,
        }}>
          {pushResult.success ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 800, color: "#1c5a1c", fontSize: 14 }}>✓ Deployed to n8n Instance!</div>
                <div style={{ fontSize: 12, color: "#2d762d", marginTop: 2 }}>{pushResult.name} · {pushResult.nodeCount} nodes created</div>
              </div>
              {pushResult.workflowUrl && (
                <a
                  href={pushResult.workflowUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: "8px 16px", borderRadius: 8, background: "#1c5a1c", color: "white", fontWeight: 700, fontSize: 12, textDecoration: "none" }}
                >
                  Open in n8n Canvas →
                </a>
              )}
            </div>
          ) : (
            <div style={{ color: "#dc2626", fontSize: 13, fontWeight: 600 }}>✗ Deploy Failed: {pushResult.error}</div>
          )}
        </div>
      )}

      {/* Deploy Modal */}
      {deployModalOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 500, width: "90%", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111" }}>Deploy to Your n8n Instance</h3>
              <button onClick={() => setDeployModalOpen(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
            </div>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px", lineHeight: 1.5 }}>
              Enter your n8n instance URL and API Key to push this 9-node engine directly to your workspace. Credentials are never stored on server storage.
            </p>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4 }}>n8n Instance URL:</label>
              <input
                type="text"
                value={n8nUrl}
                onChange={(e) => setN8nUrl(e.target.value)}
                placeholder="https://your-n8n.app.n8n.cloud"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #eceae4", fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4 }}>n8n API Key (X-N8N-API-KEY):</label>
              <input
                type="password"
                value={n8nApiKey}
                onChange={(e) => setN8nApiKey(e.target.value)}
                placeholder="n8n_api_..."
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #eceae4", fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setDeployModalOpen(false)} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid #eceae4", background: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button
                onClick={pushToN8n}
                disabled={pushing || !n8nUrl || !n8nApiKey}
                style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#1c5a1c", color: "white", fontSize: 13, fontWeight: 700, cursor: pushing ? "not-allowed" : "pointer" }}
              >
                {pushing ? "Pushing..." : "Push to n8n"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
