import React from "react";
import { Icon } from "../core/Icon.jsx";

export function NavItem({ label, icon, active = false, onClick, badge }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: "var(--space-5)",
        padding: "8px 12px", marginBottom: 2, borderRadius: "var(--radius-sm)",
        border: "none", cursor: "pointer", textAlign: "left",
        fontFamily: "var(--font-body)", fontSize: "var(--text-body-sm)",
        fontWeight: active ? "var(--weight-semibold)" : "var(--weight-medium)",
        background: active ? "rgba(255,255,255,0.08)" : hover ? "rgba(255,255,255,0.04)" : "transparent",
        color: active ? "var(--paper-0)" : "var(--ink-300)",
        boxShadow: active ? "inset 2px 0 0 var(--champagne-300)" : "none",
        transition: "var(--transition-control)",
      }}
    >
      <Icon name={icon} size={16} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge ? (
        <span style={{
          fontFamily: "var(--font-data)", fontSize: "var(--text-micro)",
          color: "var(--champagne-200)", background: "rgba(199,158,62,0.14)",
          padding: "1px 6px", borderRadius: "var(--radius-xs)",
        }}>{badge}</span>
      ) : null}
    </button>
  );
}
