"use client";

import { View } from "@/types/app";

interface TopBarProps { userName: string; projectName: string | null; view: View; }

const VIEW_META: Record<View, { title: string; crumb: string }> = {
  home:     { title: "Dashboard",        crumb: "Welcome back" },
  builder:  { title: "Workflow Builder", crumb: "Tools → ICP → Generate" },
  wizard:   { title: "Intake Wizard",    crumb: "Step-by-step pipeline onboarding" },
  outputs:  { title: "Outputs & Deploy", crumb: "Download your workflow package" },
  scripts:  { title: "Scripts Studio",   crumb: "A/B testing 3-sentence PAS email lab" },
  signals:  { title: "Tech Signals",     crumb: "n8n stack detection & hiring leads" },
  analyst:  { title: "Execution Analyst",crumb: "Diagnose and repair n8n failures" },
  academy:  { title: "Sales Academy",    crumb: "Unleash Your Sales Greatness Suite" },
  projects: { title: "My Campaigns",     crumb: "All generated workflows" },
  settings: { title: "Integrations & Keys", crumb: "Connect your tools & self-hosted n8n" },
};

export default function TopBar({ userName, projectName, view }: TopBarProps) {
  const meta = VIEW_META[view];

  return (
    <header style={{
      background: "white",
      borderBottom: "1px solid #eceae4",
      padding: "0 28px",
      height: 52,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0,
    }}>
      {/* Left: breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#111" }}>{meta.title}</span>
        {projectName && view === "builder" && (
          <>
            <span style={{ color: "#D1D5DB", fontSize: 12 }}>·</span>
            <span style={{ fontSize: 12, color: "#9CA3AF", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {projectName}
            </span>
          </>
        )}
      </div>

      {/* Right: status + help */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "4px 10px", background: "#f0f9f0",
          border: "1px solid #bce3bc", borderRadius: 100,
          fontSize: 11, fontWeight: 700, color: "#2d762d",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: "#4ADE80",
            animation: "pulse 2s ease-in-out infinite", display: "inline-block",
          }} />
          AI Ready
        </div>

        <button style={{
          width: 28, height: 28, borderRadius: "50%",
          border: "1px solid #eceae4", background: "#fafaf8",
          cursor: "pointer", fontSize: 12, color: "#6B7280", fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "inherit",
        }}>?</button>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }`}</style>
    </header>
  );
}
