import React from "react";
import { Icon } from "../core/Icon.jsx";

export function ToolOptionCard({ icon, title, caption, selected = false, onClick, meta }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "flex-start", gap: "var(--space-6)", width: "100%",
        textAlign: "left", padding: "13px 14px", cursor: "pointer",
        borderRadius: "var(--radius-md)", fontFamily: "var(--font-body)",
        border: "var(--border-width-emphasis) solid " + (selected ? "var(--cobalt-500)" : hover ? "var(--border-strong)" : "var(--border-hairline)"),
        background: selected ? "var(--surface-brand-tint)" : "var(--surface-card)",
        boxShadow: selected ? "var(--focus-ring)" : "none",
        transition: "var(--transition-control)",
      }}
    >
      <span style={{
        width: 32, height: 32, borderRadius: "var(--radius-sm)", flexShrink: 0,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: selected ? "var(--cobalt-100)" : "var(--surface-sunken)",
        color: selected ? "var(--cobalt-700)" : "var(--ink-500)",
      }}><Icon name={icon} size={17} /></span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "var(--text-h4)", fontWeight: "var(--weight-semibold)", color: "var(--text-primary)" }}>{title}</span>
          {meta ? <span style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-micro)", color: "var(--text-muted)" }}>{meta}</span> : null}
        </span>
        {caption ? <span style={{ display: "block", fontSize: "var(--text-caption)", color: "var(--text-secondary)", lineHeight: "var(--leading-normal)", marginTop: 2 }}>{caption}</span> : null}
      </span>
      {selected ? <Icon name="circle-check" size={16} color="var(--cobalt-600)" /> : null}
    </button>
  );
}
