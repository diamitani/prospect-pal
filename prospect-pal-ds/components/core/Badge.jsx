import React from "react";
import { Icon } from "./Icon.jsx";

const TONES = {
  neutral:   { background: "var(--surface-sunken)", color: "var(--ink-600)", border: "var(--border-hairline)" },
  brand:     { background: "var(--cobalt-50)", color: "var(--cobalt-700)", border: "var(--cobalt-100)" },
  premium:   { background: "var(--champagne-50)", color: "var(--champagne-500)", border: "var(--champagne-100)" },
  verified:  { background: "var(--signal-verified-bg)", color: "var(--signal-verified)", border: "transparent" },
  attention: { background: "var(--signal-attention-bg)", color: "var(--signal-attention)", border: "transparent" },
  blocked:   { background: "var(--signal-blocked-bg)", color: "var(--signal-blocked)", border: "transparent" },
  deep:      { background: "rgba(255,255,255,0.08)", color: "var(--ink-100)", border: "rgba(255,255,255,0.14)" },
};

export function Badge({ children, tone = "neutral", icon, mono = false, shape = "pill", style }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
      padding: mono ? "3px 8px" : "3px 9px",
      borderRadius: shape === "pill" ? "var(--radius-pill)" : "var(--radius-xs)",
      fontFamily: mono ? "var(--font-data)" : "var(--font-body)",
      fontSize: "var(--text-micro)", fontWeight: "var(--weight-semibold)",
      letterSpacing: mono ? "var(--tracking-mono)" : "0.01em",
      background: t.background, color: t.color, border: "1px solid " + t.border,
      whiteSpace: "nowrap", ...style,
    }}>
      {icon ? <Icon name={icon} size={12} /> : null}
      {children}
    </span>
  );
}
