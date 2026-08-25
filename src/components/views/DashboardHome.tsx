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
    title: "Workflow Builder",
    description: "Interactive 5-Pillar 9-node live n8n compiler",
    primary: true,
    view: "builder" as View,
  },
  {
    id: "wizard",
    icon: "🪄",
    title: "Intake Wizard",
    description: "Step-by-step onboarding & CRM stack setup",
    primary: false,
    view: "wizard" as View,
  },
  {
    id: "scripts",
    icon: "✍️",
    title: "Scripts Studio",
    description: "A/B testing 3-sentence PAS cold email lab",
    primary: false,
    view: "scripts" as View,
  },
  {
    id: "signals",
    icon: "📡",
    title: "Tech Signals Leads",
    description: "Find companies with n8n hiring GTM engineers",
    primary: false,
    view: "signals" as View,
  },
  {
    id: "outputs",
    icon: "↓",
    title: "Deploy & Outputs",
    description: "Download .n8n.json, .env, and deploy guide",
    primary: false,
    view: "outputs" as View,
  },
  {
    id: "analyst",
    icon: "🔬",
    title: "Execution Analyst",
    description: "Diagnose n8n run errors and health telemetry",
    primary: false,
    view: "analyst" as View,
  },
];

const pipeline = [
  { num: 1, name: "Trigger Ingest",    desc: "Daily cron / webhook / CSV", icon: "⚡" },
  { num: 2, name: "CRM Shield",        desc: "Check active deals in HubSpot", icon: "🛡️" },
  { num: 3, name: "Contact Reveal",    desc: "Apollo & Clay waterfall",      icon: "🔍" },
  { num: 4, name: "AI PAS Copy",       desc: "3-Sentence problem-agitate",    icon: "✍️" },
  { num: 5, name: "Sequencer Sync",    desc: "Smartlead / Instantly queue",   icon: "📬" },
];

const stats = [
  { label: "Pipeline Status", value: "Active", unit: "5-Pillar", accent: "#16a34a" },
  { label: "Dedupe Accuracy", value: "100", unit: "% Guard", accent: "#2563EB" },
  { label: "Target Reply Rate", value: "8.5", unit: "% Avg", accent: "#7C3AED" },
  { label: "Execution Health", value: "99.8", unit: "% Uptime", accent: "#059669" },
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
      padding: "32px 36px 48px",
      maxWidth: 1100, margin: "0 auto",
    }}>

      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h1 style={{
            fontSize: 24, fontWeight: 900, color: "#111827", letterSpacing: "-0.5px", margin: 0,
          }}>{getGreeting(userName)}</h1>
          <span style={{ background: "#dcfce7", color: "#166534", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 999 }}>
            BYOK WORKSPACE READY
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
          Your autonomous GTM pipeline harness is synchronized with your self-hosted n8n environment.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: "#ffffff", border: "1px solid #e5e7eb",
            borderRadius: 14, padding: "16px 20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px", color: s.accent, lineHeight: 1.1 }}>
              {s.value}<span style={{ fontSize: 12, fontWeight: 600, marginLeft: 4, color: "#6B7280" }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
          Workspace Command Center
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
          {quickActions.map((a) => (
            <button
              key={a.id}
              onClick={() => onNavigate(a.view)}
              style={{
                textAlign: "left", padding: "20px",
                borderRadius: 14, cursor: "pointer",
                background: a.primary ? "#16a34a" : "#ffffff",
                boxShadow: a.primary
                  ? "0 4px 16px rgba(22,163,74,0.3)"
                  : "0 1px 3px rgba(0,0,0,0.04)",
                border: a.primary ? "none" : "1px solid #e5e7eb",
                fontFamily: "inherit",
                transition: "transform 0.15s, box-shadow 0.15s",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: a.primary ? "rgba(255,255,255,0.2)" : "#f3f4f6",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0,
              }}>{a.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: a.primary ? "white" : "#111827", marginBottom: 3 }}>
                  {a.title}
                </div>
                <div style={{ fontSize: 12, color: a.primary ? "rgba(255,255,255,0.85)" : "#6B7280", lineHeight: 1.4 }}>
                  {a.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5-Stage Pipeline */}
      <div style={{
        background: "white", border: "1px solid #e5e7eb",
        borderRadius: 16, padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)", marginBottom: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", marginBottom: 2 }}>
              The 5-Pillar Autonomous Revenue Architecture
            </div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>
              Standard 9-node production graph powering cold outbound campaigns
            </div>
          </div>
          <button
            onClick={() => onNavigate("builder")}
            style={{
              padding: "8px 16px", fontSize: 12, fontWeight: 700,
              color: "white", background: "#16a34a", border: "none",
              borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Launch Builder Canvas →
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0, overflowX: "auto" }}>
          {pipeline.map((stage, i) => (
            <div key={stage.num} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 150 }}>
              <div style={{
                flex: 1, background: "#f9fafb", border: "1px solid #e5e7eb",
                borderRadius: 12, padding: "14px 10px", textAlign: "center",
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{stage.icon}</div>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "#16a34a", color: "white",
                  fontSize: 10, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 6px",
                }}>{stage.num}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>{stage.name}</div>
                <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2, lineHeight: 1.3 }}>{stage.desc}</div>
              </div>
              {i < pipeline.length - 1 && (
                <div style={{ width: 20, textAlign: "center", color: "#9ca3af", fontSize: 14, flexShrink: 0 }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
