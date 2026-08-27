"use client";

import { View } from "@/types/app";
import { HelpCircle } from "lucide-react";

interface TopBarProps {
  userName: string;
  projectName: string | null;
  view: View;
}

const VIEW_META: Record<View, { title: string; crumb: string }> = {
  home: { title: "Dashboard", crumb: "Welcome back" },
  wizard: { title: "Campaign Wizard", crumb: "Configure your prospect automation" },
  builder: { title: "Workflow Builder", crumb: "Build your GTM automation workflow" },
  outputs: { title: "Outputs & Deploy", crumb: "Download or deploy your workflow" },
  analyst: { title: "Campaign Analyst", crumb: "Track performance and optimize" },
  settings: { title: "Settings", crumb: "API keys and configuration" },
};

export default function TopBar({ userName, projectName, view }: TopBarProps) {
  const meta = VIEW_META[view];

  return (
    <header
      style={{
        background: "var(--surface-card)",
        borderBottom: "1px solid var(--border-hairline)",
        padding: "0 var(--space-10)",
        height: "var(--layout-topbar)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      {/* Left: breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
        <span
          style={{
            fontSize: "var(--text-body-sm)",
            fontWeight: "var(--weight-bold)",
            color: "var(--text-primary)",
          }}
        >
          {meta.title}
        </span>
        {projectName && view === "builder" && (
          <>
            <span style={{ color: "var(--text-subtle)", fontSize: "var(--text-caption)" }}>·</span>
            <span
              style={{
                fontSize: "var(--text-caption)",
                color: "var(--text-muted)",
                maxWidth: 220,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {projectName}
            </span>
          </>
        )}
      </div>

      {/* Right: status + help */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-2) var(--space-5)",
            background: "var(--cobalt-50)",
            border: "1px solid var(--cobalt-200)",
            borderRadius: "var(--radius-pill)",
            fontSize: "var(--text-micro)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--cobalt-700)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--cobalt-500)",
              animation: "pp-pulse 2s ease-in-out infinite",
              display: "inline-block",
            }}
          />
          AI Ready
        </div>

        <button
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "1px solid var(--border-hairline)",
            background: "var(--surface-sunken)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
          title="Help"
        >
          <HelpCircle size={14} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}
