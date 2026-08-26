import React from "react";

export function DeliverableCard({ file, label, description, badge }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column", padding: "22px",
        borderRadius: "var(--radius-xl)", background: "var(--surface-card)",
        border: "1px solid var(--border-hairline)",
        boxShadow: hover ? "var(--shadow-card-hover)" : "var(--shadow-card)",
        transform: hover ? "var(--lift-hover)" : "none",
        transition: "var(--transition-surface)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: "var(--space-8)" }}>
        <span style={{
          fontFamily: "var(--font-data)", fontSize: "var(--text-caption)",
          fontWeight: "var(--weight-medium)", color: "var(--cobalt-700)",
          background: "var(--cobalt-50)", padding: "3px 8px", borderRadius: "var(--radius-xs)",
        }}>{file}</span>
        {badge ? (
          <span style={{
            fontSize: "var(--text-micro)", fontWeight: "var(--weight-semibold)",
            color: "var(--text-muted)", background: "var(--surface-sunken)",
            padding: "2px 8px", borderRadius: "var(--radius-pill)",
          }}>{badge}</span>
        ) : null}
      </div>
      <div style={{ fontSize: "var(--text-h3)", fontWeight: "var(--weight-semibold)", letterSpacing: "var(--tracking-heading)", marginBottom: 6 }}>{label}</div>
      <p style={{ margin: 0, fontSize: "var(--text-body-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>{description}</p>
    </div>
  );
}
