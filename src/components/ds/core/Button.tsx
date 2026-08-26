"use client";

import { CSSProperties, ReactNode, useState, ButtonHTMLAttributes } from "react";
import { Icon, IconProps } from "./Icon";

type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "inverse";
type ButtonSize = "sm" | "md" | "lg";

const SIZES: Record<ButtonSize, { padding: string; fontSize: string; radius: string; icon: number }> = {
  sm: { padding: "6px 12px", fontSize: "var(--text-caption)", radius: "var(--radius-sm)", icon: 14 },
  md: { padding: "9px 16px", fontSize: "var(--text-body-sm)", radius: "var(--radius-md)", icon: 16 },
  lg: { padding: "15px 28px", fontSize: "var(--text-body)", radius: "var(--radius-lg)", icon: 18 },
};

const VARIANTS: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: "var(--action-primary)",
    color: "var(--text-inverse)",
    border: "1px solid var(--action-primary)",
    boxShadow: "var(--shadow-action)",
  },
  accent: {
    background: "var(--action-accent)",
    color: "var(--text-inverse)",
    border: "1px solid var(--action-accent)",
    boxShadow: "var(--shadow-action-accent)",
  },
  outline: {
    background: "var(--surface-card)",
    color: "var(--ink-700)",
    border: "var(--border-width-emphasis) solid var(--border-strong)",
    boxShadow: "var(--shadow-hairline)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid transparent",
    boxShadow: "none",
  },
  inverse: {
    background: "var(--paper-0)",
    color: "var(--ink-800)",
    border: "1px solid var(--paper-0)",
    boxShadow: "none",
  },
};

const HOVER_STYLES: Record<ButtonVariant, CSSProperties> = {
  primary: { background: "var(--action-primary-hover)" },
  accent: { background: "var(--action-accent-hover)" },
  outline: { borderColor: "var(--cobalt-300)", color: "var(--text-brand)", background: "var(--surface-brand-tint)" },
  ghost: { background: "var(--surface-sunken)", color: "var(--text-primary)" },
  inverse: { background: "var(--paper-100)" },
};

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconProps["name"];
  iconRight?: IconProps["name"];
  fullWidth?: boolean;
  style?: CSSProperties;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  style,
  ...rest
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);

  const s = SIZES[size];
  const v = VARIANTS[variant];
  const hoverStyle = disabled ? {} : hover ? HOVER_STYLES[variant] : {};

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
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-3)",
        fontFamily: "var(--font-body)",
        fontWeight: "var(--weight-semibold)",
        letterSpacing: "-0.005em",
        whiteSpace: "nowrap",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: s.padding,
        fontSize: s.fontSize,
        borderRadius: s.radius,
        width: fullWidth ? "100%" : undefined,
        transition: "var(--transition-control)",
        opacity: disabled ? 0.4 : 1,
        transform: press ? "var(--press-scale)" : hover && !disabled ? "var(--lift-hover)" : "none",
        ...v,
        ...hoverStyle,
        ...style,
      }}
      {...rest}
    >
      {icon && <Icon name={icon} size={s.icon} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.icon} />}
    </button>
  );
}
