"use client";

import { View } from "@/types/app";

interface SidebarProps {
  currentView:  View;
  onViewChange: (view: View) => void;
  projectName:  string | null;
}

const NAV = [
  { id: "home"     as View, label: "Home",           icon: "⊞" },
  { id: "builder"  as View, label: "Build Workflow",  icon: "⚡", highlight: true },
  { id: "outputs"  as View, label: "Outputs",         icon: "↓" },
  { id: "projects" as View, label: "My Campaigns",    icon: "◫" },
  { id: "settings" as View, label: "Integrations",    icon: "◎" },
];

export default function Sidebar({ currentView, onViewChange, projectName }: SidebarProps) {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: "white",
      borderRight: "1px solid #eceae4",
      display: "flex", flexDirection: "column",
      height: "100vh",
    }}>
      {/* Brand */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #f4f3ef" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: "#1c5a1c",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 800, fontSize: 13, flexShrink: 0,
          }}>P</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, color: "#111", letterSpacing: "-0.3px" }}>Prospect PAL</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Workflow Builder</div>
          </div>
        </div>
      </div>

      {/* Build CTA */}
      <div style={{ padding: "12px 14px" }}>
        <button
          onClick={() => onViewChange("builder")}
          style={{
            width: "100%", padding: "10px", fontSize: 13, fontWeight: 700,
            color: "white", background: "#1c5a1c", border: "none",
            borderRadius: 10, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            fontFamily: "inherit",
            boxShadow: "0 2px 8px rgba(28,90,28,0.25)",
          }}
        >
          <span style={{ fontSize: 16 }}>⚡</span> Build Workflow
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "4px 10px", overflowY: "auto" }}>
        {NAV.map((item) => {
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10, border: "none",
                cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                marginBottom: 2,
                background: active ? "#f4f3ef" : "transparent",
                color: active ? "#111" : "#6B7280",
                fontWeight: active ? 700 : 500, fontSize: 13,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Current workflow */}
      {projectName && (
        <div style={{ padding: "0 14px 12px" }}>
          <div style={{
            fontSize: 11, color: "#9CA3AF", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6,
          }}>Active</div>
          <div style={{
            fontSize: 12, padding: "8px 10px",
            background: "#f4f3ef", borderRadius: 8, color: "#111",
            fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{projectName}</div>
        </div>
      )}

      {/* User */}
      <div style={{ padding: "12px 14px", borderTop: "1px solid #f4f3ef" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "#dcf0dc", color: "#1c5a1c",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 12, flexShrink: 0,
          }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>Alex</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>Pro Plan</div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#9CA3AF", fontSize: 14, padding: 4, borderRadius: 6,
            }}
          >⊙</button>
        </div>
      </div>
    </aside>
  );
}
