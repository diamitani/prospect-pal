import React from "react";
import { Icon } from "./Icon.jsx";

export function IconButton({ icon, label, size = 28, variant = "outline", onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const base = variant === "outline"
    ? { background: "var(--paper-50)", border: "1px solid var(--border-hairline)", color: "var(--text-secondary)" }
    : variant === "deep"
    ? { background: "var(--surface-deep-raised)", border: "1px solid var(--border-deep)", color: "var(--ink-200)" }
    : { background: "transparent", border: "1px solid transparent", color: "var(--text-muted)" };
  return (
    <button
      onClick={onClick} aria-label={label} title={label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: size, height: size, borderRadius: "var(--radius-sm)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "var(--transition-control)",
        ...base,
        ...(hover ? { color: "var(--text-primary)", borderColor: "var(--border-strong)" } : null),
        ...style,
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.5)} />
    </button>
  );
}
