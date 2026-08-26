import React from "react";
import { Icon } from "../core/Icon.jsx";

export function IntegrationCard({ name, description, icon = "plug", capability, connected = false }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "flex-start", gap: "var(--space-7)",
        padding: "16px 18px", borderRadius: "var(--radius-lg)",
        background: "var(--surface-card)", border: "1px solid var(--border-hairline)",
        boxShadow: hover ? "var(--shadow-card-hover)" : "var(--shadow-hairline)",
        transform: hover ? "var(--lift-hover)" : "none",
        transition: "var(--transition-surface)",
      }}
    >
      <span style={{
        width: 38, height: 38, borderRadius: "var(--radius-md)", flexShrink: 0,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: "var(--surface-sunken)", color: "var(--ink-600)",
      }}><Icon name={icon} size={19} /></span>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
          <span style={{ fontSize: "var(--text-h4)", fontWeight: "var(--weight-semibold)", color: "var(--text-primary)" }}>{name}</span>
          {connected ? <Icon name="circle-check" size={14} color="var(--signal-verified)" /> : null}
        </div>
        {capability ? (
          <div style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-micro)", color: "var(--text-muted)", marginBottom: 4 }}>{capability}</div>
        ) : null}
        <div style={{ fontSize: "var(--text-caption)", color: "var(--text-secondary)", lineHeight: "var(--leading-normal)" }}>{description}</div>
      </div>
    </div>
  );
}
