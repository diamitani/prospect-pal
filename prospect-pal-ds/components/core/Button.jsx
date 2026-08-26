import React from "react";
import { Icon } from "./Icon.jsx";

const SIZES = {
  sm: { padding: "6px 12px", fontSize: "var(--text-caption)", radius: "var(--radius-sm)", icon: 14 },
  md: { padding: "9px 16px", fontSize: "var(--text-body-sm)", radius: "var(--radius-md)", icon: 16 },
  lg: { padding: "15px 28px", fontSize: "var(--text-body)", radius: "var(--radius-lg)", icon: 18 },
};

const VARIANTS = {
  primary: {
    background: "var(--action-primary)", color: "var(--text-inverse)",
    border: "1px solid var(--action-primary)", boxShadow: "var(--shadow-action)",
  },
  accent: {
    background: "var(--action-accent)", color: "var(--text-inverse)",
    border: "1px solid var(--action-accent)", boxShadow: "var(--shadow-action-accent)",
  },
  outline: {
    background: "var(--surface-card)", color: "var(--ink-700)",
    border: "var(--border-width-emphasis) solid var(--border-strong)", boxShadow: "var(--shadow-hairline)",
  },
  ghost: {
    background: "transparent", color: "var(--text-secondary)",
    border: "1px solid transparent", boxShadow: "none",
  },
  inverse: {
    background: "var(--paper-0)", color: "var(--ink-800)",
    border: "1px solid var(--paper-0)", boxShadow: "none",
  },
};

export function Button({
  children, variant = "primary", size = "md", icon, iconRight,
  disabled = false, fullWidth = false, onClick, type = "button", style,
}) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const hoverStyle = disabled ? null : hover ? {
    primary: { background: "var(--action-primary-hover)" },
    accent: { background: "var(--action-accent-hover)" },
    outline: { borderColor: "var(--cobalt-300)", color: "var(--text-brand)", background: "var(--surface-brand-tint)" },
    ghost: { background: "var(--surface-sunken)", color: "var(--text-primary)" },
    inverse: { background: "var(--paper-100)" },
  }[variant] : null;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--space-3)",
        fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)",
        letterSpacing: "-0.005em", whiteSpace: "nowrap", cursor: disabled ? "not-allowed" : "pointer",
        padding: s.padding, fontSize: s.fontSize, borderRadius: s.radius,
        width: fullWidth ? "100%" : undefined,
        transition: "var(--transition-control)",
        opacity: disabled ? 0.4 : 1,
        transform: press ? "var(--press-scale)" : hover && !disabled ? "var(--lift-hover)" : "none",
        ...v, ...hoverStyle, ...style,
      }}
    >
      {icon ? <Icon name={icon} size={s.icon} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={s.icon} /> : null}
    </button>
  );
}
