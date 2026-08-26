import React from "react";

export function StatusPill({ label, tone = "verified", pulse = true, onDeep = false, style }) {
  const map = {
    verified:  { fg: "var(--signal-verified)", bg: "var(--signal-verified-bg)", dot: "var(--signal-verified)" },
    attention: { fg: "var(--signal-attention)", bg: "var(--signal-attention-bg)", dot: "var(--signal-attention)" },
    blocked:   { fg: "var(--signal-blocked)", bg: "var(--signal-blocked-bg)", dot: "var(--signal-blocked)" },
    brand:     { fg: "var(--cobalt-700)", bg: "var(--cobalt-50)", dot: "var(--cobalt-500)" },
  };
  const t = map[tone] || map.verified;
  const fg = onDeep ? "var(--ink-100)" : t.fg;
  const bg = onDeep ? "rgba(255,255,255,0.08)" : t.bg;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "var(--space-3)",
      padding: "4px 11px", borderRadius: "var(--radius-pill)",
      background: bg, color: fg,
      border: "1px solid " + (onDeep ? "rgba(255,255,255,0.14)" : "transparent"),
      fontFamily: "var(--font-body)", fontSize: "var(--text-micro)",
      fontWeight: "var(--weight-semibold)", whiteSpace: "nowrap", ...style,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", background: t.dot, flexShrink: 0,
        animation: pulse ? "pp-pulse var(--duration-ambient) var(--ease-standard) infinite" : "none",
      }} />
      {label}
    </span>
  );
}
