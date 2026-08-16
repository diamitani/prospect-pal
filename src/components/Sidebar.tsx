"use client";

import { View } from "@/types/app";

interface SidebarProps {
  currentView:  View;
  onViewChange: (view: View) => void;
  projectName:  string | null;
}

const NAV = [
  { id: "home"     as View, label: "Home",          icon: "⊞" },
  { id: "builder"  as View, label: "Build Workflow", icon: "⚡", highlight: true },
  { id: "outputs"  as View, label: "Outputs",        icon: "↓" },
  { id: "projects" as View, label: "My Campaigns",   icon: "◫" },
  { id: "settings" as View, label: "Integrations",   icon: "◎" },
];

export default function Sidebar({ currentView, onViewChange, projectName }: SidebarProps) {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <aside style={{
      width: 228, flexShrink: 0,
      background: "#111827",
      display: "flex", flexDirection: "column",
      height: "100vh",
      borderRight: "none",
    }}>
      {/* Brand */}
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid #1F2937" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: "#1c5a1c",
            border: "2px solid rgba(74,222,128,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 800, fontSize: 13, flexShrink: 0,
          }}>P</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, color: "white", letterSpacing: "-0.3px" }}>Prospect PAL</div>
            <div style={{ fontSize: 10, color: "#4B5563", marginTop: 1 }}>Workflow Builder</div>
          </div>
        </div>
      </div>

      {/* Build CTA */}
      <div style={{ padding: "12px 12px 8px" }}>
        <button
          onClick={() => onViewChange("builder")}
          style={{
            width: "100%", padding: "10px", fontSize: 13, fontWeight: 700,
            color: "white", background: "#1c5a1c", border: "none",
            borderRadius: 8, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            fontFamily: "inherit",
            boxShadow: "0 2px 8px rgba(28,90,28,0.4)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#2d762d"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#1c5a1c"}
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
                padding: "9px 12px", borderRadius: 8, border: "none",
                cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                marginBottom: 2,
                background: active ? "#1F2937" : "transparent",
                color: active ? "white" : "#6B7280",
                fontWeight: active ? 600 : 400, fontSize: 13,
                transition: "all 0.15s",
                borderLeft: active ? "2px solid #4ADE80" : "2px solid transparent",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#1F2937"; e.currentTarget.style.color = active ? "white" : "#9CA3AF"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = active ? "white" : "#6B7280"; }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{item.icon}</span>
              {item.label}
              {active && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />}
            </button>
          );
        })}
      </nav>

      {/* Active workflow chip */}
      {projectName && (
        <div style={{ padding: "0 12px 10px" }}>
          <div style={{ fontSize: 10, color: "#374151", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>Active</div>
          <div style={{
            fontSize: 11, padding: "7px 10px",
            background: "#1F2937", borderRadius: 6, color: "#9CA3AF",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            border: "1px solid #2a3441",
          }}>{projectName}</div>
        </div>
      )}

      {/* User */}
      <div style={{ padding: "12px 14px", borderTop: "1px solid #1F2937" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "#1c5a1c", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 12, flexShrink: 0,
            border: "2px solid rgba(74,222,128,0.2)",
          }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "white" }}>Alex</div>
            <div style={{ fontSize: 10, color: "#4ADE80", fontWeight: 600 }}>Pro Plan</div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#374151", fontSize: 14, padding: 4, borderRadius: 6,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#9CA3AF"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#374151"}
          >⊙</button>
        </div>
      </div>
    </aside>
  );
}
