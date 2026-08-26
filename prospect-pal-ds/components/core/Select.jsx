import React from "react";
import { Icon } from "./Icon.jsx";

export function Select({ value, onChange, options = [], disabled = false, style }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <select
        value={value} disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{
          width: "100%", boxSizing: "border-box", appearance: "none",
          padding: "9px 34px 9px 12px",
          fontFamily: "var(--font-body)", fontSize: "var(--text-body-sm)",
          color: "var(--text-primary)", background: "var(--surface-card)",
          border: "var(--border-width-emphasis) solid var(--border-hairline)",
          borderRadius: "var(--radius-md)", outline: "none", cursor: "pointer",
          transition: "var(--transition-control)", ...style,
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none", display: "inline-flex" }}>
        <Icon name="chevron-down" size={15} />
      </span>
    </div>
  );
}
