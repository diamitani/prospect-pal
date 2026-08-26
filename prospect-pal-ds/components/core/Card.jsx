import React from "react";

export function Card({ children, tone = "paper", pad = 20, interactive = false, radius = "var(--radius-lg)", onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const tones = {
    paper:  { background: "var(--surface-card)", border: "1px solid var(--border-hairline)", color: "var(--text-primary)" },
    sunken: { background: "var(--surface-sunken)", border: "1px solid var(--border-hairline)", color: "var(--text-primary)" },
    deep:   { background: "var(--surface-deep-raised)", border: "1px solid var(--border-deep)", color: "var(--paper-0)" },
    accent: { background: "var(--surface-brand-tint)", border: "1px solid var(--cobalt-100)", color: "var(--text-primary)" },
  };
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: radius, padding: pad, boxShadow: "var(--shadow-card)",
        transition: "var(--transition-surface)",
        cursor: interactive ? "pointer" : undefined,
        ...tones[tone],
        ...(interactive && hover ? { boxShadow: "var(--shadow-card-hover)", transform: "var(--lift-hover)" } : null),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
