"use client";

import { useState, useEffect } from "react";
import type { ScriptTheme } from "@/app/api/scripts/generate/route";

export default function ScriptsStudioView() {
  const [themes, setThemes] = useState<ScriptTheme[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState<string>("theme-1");
  const [activeVariant, setActiveVariant] = useState<"A" | "B">("A");
  const [icpInput, setIcpInput] = useState("VP of Sales, Head of RevOps at B2B SaaS companies (50-250 employees)");
  const [valuePropInput, setValuePropInput] = useState("Autonomous outbound pipeline using n8n + AI PAS copywriting");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchScripts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/scripts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icp: icpInput, valueProp: valuePropInput }),
      });
      const data = await res.json();
      if (data.themes) {
        setThemes(data.themes);
        if (!selectedThemeId && data.themes.length > 0) {
          setSelectedThemeId(data.themes[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to generate scripts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  const currentTheme = themes.find((t) => t.id === selectedThemeId) || themes[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div style={{ display: "flex", height: "100%", background: "#fcfbfa", overflow: "hidden" }}>
      {/* Left Settings & Angle Selector */}
      <div style={{ width: 400, flexShrink: 0, borderRight: "1px solid #eceae4", background: "#ffffff", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f4f3ef" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>✍️</span>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>
              PAS Scripts Studio
            </h2>
          </div>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
            A/B testing copy lab powered by 3-Sentence Problem-Agitate-Solve framework.
          </p>
        </div>

        {/* Form Inputs */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f4f3ef", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#4B5563", marginBottom: 4, textTransform: "uppercase" }}>
              Target ICP & Persona:
            </label>
            <textarea
              value={icpInput}
              onChange={(e) => setIcpInput(e.target.value)}
              rows={2}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1.5px solid #eceae4",
                fontSize: 12,
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#4B5563", marginBottom: 4, textTransform: "uppercase" }}>
              Core Value Proposition / Offer:
            </label>
            <textarea
              value={valuePropInput}
              onChange={(e) => setValuePropInput(e.target.value)}
              rows={2}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1.5px solid #eceae4",
                fontSize: 12,
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          <button
            onClick={fetchScripts}
            disabled={isLoading}
            style={{
              padding: "10px",
              borderRadius: 8,
              border: "none",
              background: "#1c5a1c",
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              boxShadow: "0 2px 6px rgba(28,90,28,0.25)",
            }}
          >
            {isLoading ? "Generating Angle Matrix..." : "⚡ Refresh Script Themes"}
          </button>
        </div>

        {/* Theme List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, paddingLeft: 8 }}>
            Available Outbound Angles
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {themes.map((theme) => {
              const isSelected = selectedThemeId === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: `1.5px solid ${isSelected ? "#1c5a1c" : "#eceae4"}`,
                    background: isSelected ? "#f0f9f0" : "white",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? "#1c5a1c" : "#111827" }}>
                      {theme.theme}
                    </span>
                    <span style={{ fontSize: 10, background: isSelected ? "#dcf0dc" : "#f4f3ef", color: isSelected ? "#1c5a1c" : "#6B7280", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
                      {theme.projectedReplyRate.split(" ")[0]}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: "#6B7280", margin: 0, lineHeight: 1.4 }}>
                    {theme.angle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Script Editor & Preview */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#fafaf8" }}>
        {currentTheme ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", padding: "28px 36px" }}>
            {/* Header with A/B Toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>
                    {currentTheme.theme}
                  </h1>
                  <span style={{ background: "#e0f2fe", color: "#0369a1", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>
                    Target: {currentTheme.targetPersona}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>
                  Expected Conversion: <strong>{currentTheme.projectedReplyRate}</strong>
                </p>
              </div>

              {/* Variant Switcher */}
              <div style={{ display: "flex", background: "#eceae4", padding: 3, borderRadius: 8 }}>
                <button
                  onClick={() => setActiveVariant("A")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    border: "none",
                    background: activeVariant === "A" ? "white" : "transparent",
                    color: activeVariant === "A" ? "#1c5a1c" : "#6B7280",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    boxShadow: activeVariant === "A" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  Variant A (Problem First)
                </button>
                <button
                  onClick={() => setActiveVariant("B")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    border: "none",
                    background: activeVariant === "B" ? "white" : "transparent",
                    color: activeVariant === "B" ? "#1c5a1c" : "#6B7280",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    boxShadow: activeVariant === "B" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  Variant B (Agitation Hook)
                </button>
              </div>
            </div>

            {/* Subject Line Card */}
            <div style={{ background: "white", borderRadius: 14, border: "1px solid #eceae4", padding: "18px 20px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Subject Line ({activeVariant === "A" ? "Variant A" : "Variant B"})
                </span>
                <button
                  onClick={() => handleCopy(activeVariant === "A" ? currentTheme.subjectA : currentTheme.subjectB, "subject")}
                  style={{ background: "#f4f3ef", border: "none", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#374151", cursor: "pointer" }}
                >
                  {copiedField === "subject" ? "Copied! ✓" : "Copy Subject"}
                </button>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", fontFamily: "monospace" }}>
                {activeVariant === "A" ? currentTheme.subjectA : currentTheme.subjectB}
              </div>
            </div>

            {/* 3-Sentence PAS Breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div style={{ background: "white", borderRadius: 12, border: "1px solid #eceae4", padding: "16px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#dc2626", textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <span>●</span> Sentence 1 (Problem)
                </div>
                <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5, margin: 0 }}>
                  {currentTheme.sentence1_problem}
                </p>
              </div>

              <div style={{ background: "white", borderRadius: 12, border: "1px solid #eceae4", padding: "16px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#f59e0b", textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <span>●</span> Sentence 2 (Agitate)
                </div>
                <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5, margin: 0 }}>
                  {currentTheme.sentence2_agitate}
                </p>
              </div>

              <div style={{ background: "white", borderRadius: 12, border: "1px solid #eceae4", padding: "16px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#16a34a", textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <span>●</span> Sentence 3 (Solve / CTA)
                </div>
                <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5, margin: 0 }}>
                  {currentTheme.sentence3_solve}
                </p>
              </div>
            </div>

            {/* Full Email Body Preview */}
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #eceae4", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "1px solid #f4f3ef", paddingBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Complete Email Template</span>
                  <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 8 }}>Ready for Smartlead / Instantly</span>
                </div>
                <button
                  onClick={() => handleCopy(activeVariant === "A" ? currentTheme.fullBodyA : currentTheme.fullBodyB, "body")}
                  style={{
                    background: "#1c5a1c",
                    color: "white",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(28,90,28,0.2)",
                  }}
                >
                  {copiedField === "body" ? "Copied to Clipboard! ✓" : "Copy Template"}
                </button>
              </div>

              <pre style={{
                margin: 0,
                fontFamily: "inherit",
                fontSize: 13,
                lineHeight: 1.7,
                color: "#1f2937",
                whiteSpace: "pre-wrap",
              }}>
                {activeVariant === "A" ? currentTheme.fullBodyA : currentTheme.fullBodyB}
              </pre>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, color: "#9CA3AF" }}>
            Loading script themes...
          </div>
        )}
      </div>
    </div>
  );
}
