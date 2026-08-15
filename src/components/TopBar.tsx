"use client";

import { View } from "@/types/app";

interface TopBarProps { userName: string; projectName: string | null; view: View; }

const VIEW_META: Record<View, { title: string; desc: string }> = {
  home:     { title: "",                   desc: "" },
  builder:  { title: "Workflow Builder",   desc: "Configure your tools, define your ICP, generate your n8n workflow" },
  outputs:  { title: "Outputs",            desc: "Download your workflow package" },
  projects: { title: "My Campaigns",       desc: "All your generated workflows" },
  settings: { title: "Integrations",       desc: "Connect your tools via Composio" },
};

export default function TopBar({ userName, projectName, view }: TopBarProps) {
  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  return (
    <header style={{
      background: "white",
      borderBottom: "1px solid #eceae4",
      padding: "12px 28px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0,
    }}>
      <div>
        {view === "home" ? (
          <>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#111", letterSpacing: "-0.3px" }}>
              {greeting}, {userName}
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
              Build your outbound automation workflow
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>
              {VIEW_META[view].title}
            </div>
            {projectName && (
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{projectName}</div>
            )}
          </>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* AI status */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 10px", background: "#f0f9f0",
          border: "1px solid #bce3bc", borderRadius: 8,
          fontSize: 11, fontWeight: 700, color: "#2d762d",
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", background: "#4ADE80",
            animation: "pulse 2s ease-in-out infinite", display: "inline-block",
          }} />
          AI Ready
        </div>

        <button style={{
          width: 32, height: 32, borderRadius: 8,
          border: "1px solid #eceae4", background: "white",
          cursor: "pointer", fontSize: 14, color: "#6B7280",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>?</button>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }`}</style>
    </header>
  );
}
