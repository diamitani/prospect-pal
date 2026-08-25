"use client";

import { View } from "@/types/app";

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  projectName: string | null;
}

const NAV = [
  { id: "home" as View, label: "Home", icon: "⊞" },
  { id: "builder" as View, label: "Workflow Builder", icon: "⚡", highlight: true },
  { id: "wizard" as View, label: "Intake Wizard", icon: "🪄" },
  { id: "outputs" as View, label: "Outputs & Deploy", icon: "↓" },
  { id: "scripts" as View, label: "Scripts Studio", icon: "✍️" },
  { id: "signals" as View, label: "Tech Signals Leads", icon: "📡" },
  { id: "analyst" as View, label: "Execution Analyst", icon: "🔬" },
  { id: "academy" as View, label: "Sales Academy", icon: "🎓" },
  { id: "projects" as View, label: "My Campaigns", icon: "◫" },
  { id: "settings" as View, label: "Integrations & Keys", icon: "◎" },
];

export default function Sidebar({ currentView, onViewChange, projectName }: SidebarProps) {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/home";
  };

  return (
    <aside style={{
      width: 236, flexShrink: 0,
      background: "#0f172a",
      display: "flex", flexDirection: "column",
      height: "100vh",
      borderRight: "1px solid #1e293b",
    }}>
      {/* Brand */}
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: "#16a34a",
            border: "2px solid rgba(74,222,128,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 900, fontSize: 14, flexShrink: 0,
          }}>P</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, color: "white", letterSpacing: "-0.3px" }}>Prospect PAL</div>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>5-Pillar Engine Architect</div>
          </div>
        </div>
      </div>

      {/* Build CTA */}
      <div style={{ padding: "12px 12px 6px" }}>
        <button
          onClick={() => onViewChange("builder")}
          style={{
            width: "100%", padding: "10px", fontSize: 13, fontWeight: 700,
            color: "white", background: "#16a34a", border: "none",
            borderRadius: 8, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            fontFamily: "inherit",
            boxShadow: "0 2px 8px rgba(22,163,74,0.4)",
            transition: "background 0.15s",
          }}
        >
          <span style={{ fontSize: 15 }}>⚡</span> Build Workflow
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "4px 8px", overflowY: "auto" }}>
        {NAV.map((item) => {
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", borderRadius: 8, border: "none",
                cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                marginBottom: 2,
                background: active ? "#1e293b" : "transparent",
                color: active ? "#ffffff" : "#94a3b8",
                fontWeight: active ? 700 : 500, fontSize: 12.5,
                transition: "all 0.15s",
                borderLeft: active ? "3px solid #22c55e" : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />}
            </button>
          );
        })}
      </nav>

      {/* Active workflow chip */}
      {projectName && (
        <div style={{ padding: "0 12px 10px" }}>
          <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Active Engine</div>
          <div style={{
            fontSize: 11, padding: "6px 10px",
            background: "#1e293b", borderRadius: 6, color: "#cbd5e1",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            border: "1px solid #334155",
          }}>{projectName}</div>
        </div>
      )}

      {/* User */}
      <div style={{ padding: "12px 14px", borderTop: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "#16a34a", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 12, flexShrink: 0,
          }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "white" }}>Alex Rivera</div>
            <div style={{ fontSize: 10, color: "#4ade80", fontWeight: 600 }}>Pro Plan (BYOK)</div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#64748b", fontSize: 14, padding: 4, borderRadius: 6,
            }}
          >
            ⊙
          </button>
        </div>
      </div>
    </aside>
  );
}
