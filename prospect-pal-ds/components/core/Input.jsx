import React from "react";
import { Icon } from "./Icon.jsx";

export function Input({
  value, onChange, placeholder, type = "text", icon, mono = false,
  disabled = false, invalid = false, fullWidth = true, onSubmitKey, style,
}) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ position: "relative", width: fullWidth ? "100%" : undefined }}>
      {icon ? (
        <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "inline-flex" }}>
          <Icon name={icon} size={15} />
        </span>
      ) : null}
      <input
        type={type} value={value} placeholder={placeholder} disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && onSubmitKey) onSubmitKey(); }}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          padding: icon ? "9px 12px 9px 32px" : "9px 12px",
          fontFamily: mono ? "var(--font-data)" : "var(--font-body)",
          fontSize: "var(--text-body-sm)", color: "var(--text-primary)",
          background: disabled ? "var(--surface-sunken)" : "var(--surface-card)",
          border: "var(--border-width-emphasis) solid " + (invalid ? "var(--signal-blocked)" : focus ? "var(--border-focus)" : "var(--border-hairline)"),
          borderRadius: "var(--radius-md)", outline: "none",
          boxShadow: focus ? "var(--focus-ring)" : "none",
          transition: "var(--transition-control)", ...style,
        }}
      />
    </div>
  );
}
