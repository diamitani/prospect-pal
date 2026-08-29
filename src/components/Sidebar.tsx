"use client";

import { View } from "@/types/app";
import { Logo } from "@/components/ds";
import {
  LayoutDashboard,
  Wand2,
  Workflow,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Sparkles,
  MessageSquare,
  Layers,
  Wrench,
  Bot,
  Stethoscope,
} from "lucide-react";

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  projectName: string | null;
  userName: string;
  userEmail: string;
}

interface NavItem {
  id: View;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  section?: string;
}

const NAV: NavItem[] = [
  // Build
  { id: "home", label: "Dashboard", icon: LayoutDashboard, section: "Build" },
  { id: "studio", label: "Studio", icon: MessageSquare },
  { id: "templates", label: "Templates", icon: Layers },
  // Engineer
  { id: "analyst", label: "Analyzer", icon: Stethoscope, section: "Engineer" },
  // Agents
  { id: "blueprints", label: "Agent Package", icon: Package, section: "Agents" },
  { id: "core-sdr", label: "Core SDR", icon: Bot, badge: "beta" },
  // Account
  { id: "settings", label: "Settings", icon: Settings, section: "Account" },
];

export default function Sidebar({ currentView, onViewChange, projectName, userName, userEmail }: SidebarProps) {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/home";
  };

  // Get user initial from name
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside
      style={{
        width: "var(--layout-app-sidebar, 236px)",
        flexShrink: 0,
        background: "var(--surface-deep)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        borderRight: "1px solid var(--border-deep)",
      }}
    >
      {/* Brand */}
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid var(--border-deep)" }}>
        <Logo size={32} onDeep />
      </div>

      {/* New Campaign CTA */}
      <div style={{ padding: "12px 12px 6px" }}>
        <button
          onClick={() => onViewChange("studio")}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "var(--text-body-sm)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--text-inverse)",
            background: "var(--action-accent)",
            border: "none",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontFamily: "inherit",
            boxShadow: "var(--shadow-action-accent)",
            transition: "var(--transition-control)",
          }}
        >
          <Plus size={16} strokeWidth={2} />
          New campaign
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "4px 8px", overflowY: "auto" }}>
        {NAV.map((item, index) => {
          const active = currentView === item.id;
          const IconComponent = item.icon;
          const showSection = item.section && (index === 0 || NAV[index - 1].section !== item.section);
          return (
            <div key={item.id}>
              {showSection && (
                <div
                  style={{
                    fontSize: "var(--text-micro)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "var(--tracking-eyebrow)",
                    color: "var(--ink-400)",
                    padding: index === 0 ? "6px 12px 6px" : "14px 12px 6px",
                  }}
                >
                  {item.section}
                </div>
              )}
              <button
                onClick={() => onViewChange(item.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  marginBottom: 2,
                  background: active ? "var(--surface-deep-raised)" : "transparent",
                  color: active ? "var(--paper-0)" : "var(--ink-300)",
                  fontWeight: active ? "var(--weight-semibold)" : "var(--weight-medium)",
                  fontSize: "var(--text-body-sm)",
                  transition: "var(--transition-control)",
                  borderLeft: active ? "3px solid var(--cobalt-400)" : "3px solid transparent",
                }}
              >
                <IconComponent size={16} strokeWidth={1.75} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "var(--font-data)",
                      padding: "2px 6px",
                      borderRadius: "var(--radius-pill)",
                      background: item.badge === "beta" ? "rgba(217,185,104,0.18)" : "rgba(42,65,201,0.2)",
                      color: item.badge === "beta" ? "var(--champagne-300)" : "var(--cobalt-300)",
                      fontWeight: 700,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {active && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--cobalt-400)",
                      marginLeft: 4,
                    }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Active campaign chip */}
      {projectName && (
        <div style={{ padding: "0 12px 10px" }}>
          <div
            style={{
              fontSize: "var(--text-micro)",
              color: "var(--ink-400)",
              fontWeight: "var(--weight-semibold)",
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-eyebrow)",
              marginBottom: 4,
            }}
          >
            Active campaign
          </div>
          <div
            style={{
              fontSize: "var(--text-micro)",
              padding: "6px 10px",
              background: "var(--surface-deep-raised)",
              borderRadius: "var(--radius-sm)",
              color: "var(--ink-200)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              border: "1px solid var(--border-deep)",
            }}
          >
            {projectName}
          </div>
        </div>
      )}

      {/* User */}
      <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border-deep)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "var(--action-accent)",
              color: "var(--text-inverse)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "var(--weight-bold)",
              fontSize: "var(--text-caption)",
              flexShrink: 0,
            }}
          >
            {userInitial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "var(--text-caption)", fontWeight: "var(--weight-semibold)", color: "var(--paper-0)" }}>
              {userName}
            </div>
            <div style={{ fontSize: "var(--text-micro)", color: "var(--champagne-300)", fontWeight: "var(--weight-semibold)" }}>
              Pro Plan
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink-400)",
              padding: 4,
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogOut size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
}
