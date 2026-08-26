import React from "react";

export function Textarea({ value, onChange, placeholder, rows = 3, disabled = false, style }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <textarea
      value={value} placeholder={placeholder} rows={rows} disabled={disabled}
      onChange={(e) => onChange && onChange(e.target.value)}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{
        width: "100%", boxSizing: "border-box", padding: "10px 12px", resize: "vertical",
        fontFamily: "var(--font-body)", fontSize: "var(--text-body-sm)",
        lineHeight: "var(--leading-normal)", color: "var(--text-primary)",
        background: "var(--surface-card)",
        border: "var(--border-width-emphasis) solid " + (focus ? "var(--border-focus)" : "var(--border-hairline)"),
        borderRadius: "var(--radius-md)", outline: "none",
        boxShadow: focus ? "var(--focus-ring)" : "none",
        transition: "var(--transition-control)", ...style,
      }}
    />
  );
}
