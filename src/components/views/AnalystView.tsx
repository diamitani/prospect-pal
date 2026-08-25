"use client";

import { useState } from "react";

interface AnalysisResult {
  failingNode: string;
  nodeType: string;
  errorCode: string;
  rootCauseSummary: string;
  severity: "critical" | "high" | "medium" | "low";
  remediationSteps: string[];
  suggestedFix: string;
}

export default function AnalystView() {
  const [activeMode, setActiveMode] = useState<"paste" | "live">("paste");
  const [pastedLog, setPastedLog] = useState("");
  const [workflowId, setWorkflowId] = useState("");
  const [executionId, setExecutionId] = useState("");
  const [n8nUrl, setN8nUrl] = useState(
    typeof window !== "undefined" ? localStorage.getItem("ppal_n8n_url") || "" : ""
  );
  const [n8nApiKey, setN8nApiKey] = useState(
    typeof window !== "undefined" ? localStorage.getItem("ppal_n8n_key") || "" : ""
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const payload =
        activeMode === "paste"
          ? { pastedLog }
          : { workflowId, executionId, n8nUrl, n8nApiKey };

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data.analysis);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error analyzing workflow");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: "28px 36px", maxWidth: 1100, margin: "0 auto", overflowY: "auto", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🔬</span>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: 0 }}>
              n8n Execution Analyst & Debugger
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0 34px" }}>
            Instantly diagnose silent failures, per-node errors, rate limits, and payload mismatches across your n8n pipelines.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #eceae4", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 18, borderBottom: "1px solid #f4f3ef", paddingBottom: 14 }}>
          <button
            onClick={() => setActiveMode("paste")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "inherit",
              background: activeMode === "paste" ? "#1c5a1c" : "#f4f3ef",
              color: activeMode === "paste" ? "white" : "#4B5563",
            }}
          >
            📋 Paste Execution Log / Error JSON
          </button>
          <button
            onClick={() => setActiveMode("live")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "inherit",
              background: activeMode === "live" ? "#1c5a1c" : "#f4f3ef",
              color: activeMode === "live" ? "white" : "#4B5563",
            }}
          >
            ⚡ Connect Live n8n Instance API
          </button>
        </div>

        {activeMode === "paste" ? (
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
              Execution Error Log or Node Output JSON:
            </label>
            <textarea
              value={pastedLog}
              onChange={(e) => setPastedLog(e.target.value)}
              placeholder="Paste raw error message, runData JSON, or execution traceback from n8n here..."
              style={{
                width: "100%",
                minHeight: 180,
                padding: 14,
                borderRadius: 10,
                border: "1.5px solid #eceae4",
                fontSize: 12,
                fontFamily: "monospace",
                outline: "none",
                boxSizing: "border-box",
                lineHeight: 1.5,
              }}
            />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                n8n Instance URL:
              </label>
              <input
                type="text"
                value={n8nUrl}
                onChange={(e) => setN8nUrl(e.target.value)}
                placeholder="https://your-instance.app.n8n.cloud"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #eceae4", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                n8n API Key (X-N8N-API-KEY):
              </label>
              <input
                type="password"
                value={n8nApiKey}
                onChange={(e) => setN8nApiKey(e.target.value)}
                placeholder="n8n_api_..."
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #eceae4", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                Workflow ID:
              </label>
              <input
                type="text"
                value={workflowId}
                onChange={(e) => setWorkflowId(e.target.value)}
                placeholder="e.g. eceGV7Ka0Ut57rBf"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #eceae4", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                Execution ID (Optional):
              </label>
              <input
                type="text"
                value={executionId}
                onChange={(e) => setExecutionId(e.target.value)}
                placeholder="Latest error if blank"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #eceae4", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>
        )}

        <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing || (activeMode === "paste" && !pastedLog.trim())}
            style={{
              padding: "11px 24px",
              borderRadius: 10,
              background: isAnalyzing ? "#2d762d" : "#1c5a1c",
              color: "white",
              fontWeight: 700,
              fontSize: 13,
              border: "none",
              cursor: isAnalyzing ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 2px 8px rgba(28,90,28,0.3)",
            }}
          >
            {isAnalyzing ? "Analyzing Execution Logs..." : "🔬 Run Diagnostics & Root Cause"}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", fontSize: 13 }}>
            ✗ {error}
          </div>
        )}
      </div>

      {/* Analysis Results Card */}
      {analysis && (
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #eceae4", padding: 28, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                padding: "4px 12px",
                borderRadius: 100,
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                background:
                  analysis.severity === "critical" ? "#fee2e2" :
                  analysis.severity === "high" ? "#ffedd5" : "#fef9c3",
                color:
                  analysis.severity === "critical" ? "#dc2626" :
                  analysis.severity === "high" ? "#ea580c" : "#ca8a04",
              }}>
                {analysis.severity} Severity
              </div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#111", margin: 0 }}>
                Diagnostic Report: {analysis.failingNode}
              </h2>
            </div>
            <span style={{ fontSize: 12, fontFamily: "monospace", color: "#6B7280", background: "#f4f3ef", padding: "4px 10px", borderRadius: 6 }}>
              Code: {analysis.errorCode} · {analysis.nodeType}
            </span>
          </div>

          {/* Root Cause */}
          <div style={{ background: "#f9f9f8", border: "1px solid #eceae4", borderRadius: 12, padding: 18, marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#111", marginBottom: 6 }}>
              💡 Root Cause Summary:
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "#374151", margin: 0 }}>
              {analysis.rootCauseSummary}
            </p>
          </div>

          {/* Remediation Steps */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 10 }}>
              🛠️ Step-by-Step Remediation Checklist:
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {analysis.remediationSteps.map((step, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#4B5563", background: "#fdfdfd", padding: "8px 12px", borderRadius: 8, border: "1px solid #f4f3ef" }}>
                  <span style={{ fontWeight: 800, color: "#1c5a1c", flexShrink: 0 }}>{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Fix */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
                🧩 Recommended Fix / Code Patch:
              </div>
              <button
                onClick={() => copyText(analysis.suggestedFix)}
                style={{ fontSize: 12, fontWeight: 600, color: copied ? "#1c5a1c" : "#6B7280", background: "none", border: "none", cursor: "pointer" }}
              >
                {copied ? "✓ Copied" : "Copy Fix"}
              </button>
            </div>
            <pre style={{
              margin: 0,
              padding: 16,
              background: "#111827",
              color: "#4ADE80",
              borderRadius: 10,
              fontSize: 12,
              fontFamily: "monospace",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {analysis.suggestedFix}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
