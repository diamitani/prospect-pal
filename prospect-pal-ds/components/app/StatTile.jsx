import React from "react";

export function StatTile({ value, unit, label, tone = "ink" }) {
  const colors = { ink: "var(--text-primary)", brand: "var(--cobalt-600)", verified: "var(--signal-verified)", premium: "var(--champagne-500)" };
  return (
    <div style={{
      background: "var(--surface-card)", border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-lg)", padding: "16px 20px", boxShadow: "var(--shadow-hairline)",
    }}>
      <div style={{
        fontFamily: "var(--font-display)", fontSize: "var(--text-h2)",
        fontWeight: "var(--weight-bold)", letterSpacing: "var(--tracking-heading)",
        color: colors[tone] || colors.ink, lineHeight: 1.1,
      }}>
        {value}
        {unit ? <span style={{ fontSize: "var(--text-caption)", fontWeight: "var(--weight-medium)", color: "var(--text-muted)", marginLeft: 5 }}>{unit}</span> : null}
      </div>
      <div style={{
        fontFamily: "var(--font-body)", fontSize: "var(--text-micro)",
        fontWeight: "var(--weight-semibold)", color: "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: "var(--tracking-eyebrow)", marginTop: 5,
      }}>{label}</div>
    </div>
  );
}
