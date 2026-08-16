"use client";

import { View } from "@/types/app";

interface DashboardHomeProps {
  userName: string;
  onNavigate: (view: View) => void;
  onNewProject: () => void;
}

const quickActions = [
  {
    id: "builder",
    icon: "⚡",
    title: "Build New Workflow",
    description: "Describe your ICP → pick tools → generate n8n workflow live",
    primary: true,
    view: "builder" as View,
  },
  {
    id: "outputs",
    icon: "↓",
    title: "Download Outputs",
    description: "Get your n8n JSON, deploy guide & email template",
    primary: false,
    view: "outputs" as View,
  },
  {
    id: "projects",
    icon: "◫",
    title: "My Campaigns",
    description: "View all your generated workflows",
    primary: false,
    view: "projects" as View,
  },
  {
    id: "settings",
    icon: "◎",
    title: "Connect Tools",
    description: "Add Apollo, HubSpot, Smartlead credentials",
    primary: false,
    view: "settings" as View,
  },
];

const pipeline = [
  { num: 1, name: "Extract",    desc: "Parse your ICP",        icon: "📝" },
  { num: 2, name: "Categorize", desc: "Classify persona",       icon: "🎯" },
  { num: 3, name: "Enhance",    desc: "Add pain points",        icon: "⚡" },
  { num: 4, name: "Instruct",   desc: "Write AI prompt",        icon: "🤖" },
  { num: 5, name: "Compile",    desc: "Generate n8n workflow",  icon: "🏗️" },
];

const stats = [
  { label: "Leads/Day",    value: "25–50", unit: "auto",   accent: "#1c5a1c" },
  { label: "Speed to Lead",value: "15",    unit: "min",    accent: "#2563EB" },
  { label: "Bounce Rate",  value: "<2",    unit: "%",      accent: "#059669" },
  { label: "Time Saved",   value: "10+",   unit: "hrs/wk", accent: "#7C3AED" },
];

function getGreeting(name: string) {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  return `Good ${part}, ${name}!`;
}

export default function DashboardHome({ userName, onNavigate }: DashboardHomeProps) {
  return (
    <div style={{
      overflowY: "auto", height: "100%",
      padding: "32px 32px 48px",
      maxWidth: 1020, margin: "0 auto",
    }}>

      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontSize: 26, fontWeight: 900, color: "#111", letterSpacing: "-0.6px",
          margin: "0 0 4px",
        }}>{getGreeting(userName)}</h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
          Ready to build your next outbound workflow? It takes 5 minutes.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: "white", border: "1px solid #eceae4",
            borderRadius: 14, padding: "16px 20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px", color: s.accent, lineHeight: 1.1 }}>
              {s.value}<span style={{ fontSize: 13, fontWeight: 600, marginLeft: 3, color: s.accent + "bb" }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Quick Actions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {quickActions.map((a) => (
            <button
              key={a.id}
              onClick={() => onNavigate(a.view)}
              style={{
                textAlign: "left", padding: "18px 18px 16px",
                borderRadius: 14, cursor: "pointer", border: "none",
                background: a.primary ? "#1c5a1c" : "white",
                boxShadow: a.primary
                  ? "0 4px 20px rgba(28,90,28,0.28)"
                  : "0 1px 3px rgba(0,0,0,0.05)",
                border: a.primary ? "none" : "1px solid #eceae4",
                fontFamily: "inherit",
                transition: "transform 0.18s, box-shadow 0.18s",
              } as React.CSSProperties}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = a.primary ? "0 8px 28px rgba(28,90,28,0.32)" : "0 4px 20px rgba(0,0,0,0.09)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = a.primary ? "0 4px 20px rgba(28,90,28,0.28)" : "0 1px 3px rgba(0,0,0,0.05)"; }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, marginBottom: 12,
                background: a.primary ? "rgba(255,255,255,0.15)" : "#f4f3ef",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>{a.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: a.primary ? "white" : "#111", marginBottom: 4 }}>{a.title}</div>
              <div style={{ fontSize: 11, color: a.primary ? "rgba(255,255,255,0.65)" : "#9CA3AF", lineHeight: 1.5 }}>{a.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 5-Stage Pipeline */}
      <div style={{
        background: "white", border: "1px solid #eceae4",
        borderRadius: 16, padding: "22px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#111", marginBottom: 2 }}>How the PAL Pipeline Works</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>5 AI stages turn your ICP into a complete automation</div>
          </div>
          <button
            onClick={() => onNavigate("builder")}
            style={{
              padding: "8px 16px", fontSize: 12, fontWeight: 700,
              color: "white", background: "#1c5a1c", border: "none",
              borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
            }}
          >Start Building →</button>
        </div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          {pipeline.map((stage, i) => (
            <div key={stage.num} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{
                flex: 1, background: "#fafaf8", border: "1px solid #eceae4",
                borderRadius: 12, padding: "14px 10px", textAlign: "center",
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{stage.icon}</div>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "#1c5a1c", color: "white",
                  fontSize: 10, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 6px",
                }}>{stage.num}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#111" }}>{stage.name}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2, lineHeight: 1.3 }}>{stage.desc}</div>
              </div>
              {i < pipeline.length - 1 && (
                <div style={{ width: 20, textAlign: "center", color: "#D1D5DB", fontSize: 14, flexShrink: 0 }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0f2d0f 0%, #1c5a1c 100%)",
        borderRadius: 16, padding: "24px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 4 }}>
            Ready to automate your outbound?
          </div>
          <div style={{ fontSize: 13, color: "#9fce9f", lineHeight: 1.6 }}>
            Describe your ICP → pick your tools → get a production n8n workflow in under 5 minutes.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => onNavigate("builder")}
            style={{
              padding: "10px 20px", fontSize: 13, fontWeight: 700,
              color: "#1c5a1c", background: "white", border: "none",
              borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >⚡ Build Workflow</button>
        </div>
      </div>

    </div>
  );
}
