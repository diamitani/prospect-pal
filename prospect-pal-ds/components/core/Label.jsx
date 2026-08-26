import React from "react";

export function Label({ children, htmlFor, step, hint }) {
  return (
    <label htmlFor={htmlFor} style={{
      display: "flex", alignItems: "baseline", gap: "var(--space-3)",
      fontFamily: "var(--font-body)", fontSize: "var(--text-body-sm)",
      fontWeight: "var(--weight-semibold)", color: "var(--ink-600)", marginBottom: "var(--space-3)",
    }}>
      {step != null ? (
        <span style={{
          fontFamily: "var(--font-data)", fontSize: "var(--text-micro)",
          color: "var(--text-muted)", fontWeight: "var(--weight-medium)",
        }}>{String(step).padStart(2, "0")}</span>
      ) : null}
      <span>{children}</span>
      {hint ? <span style={{ fontWeight: "var(--weight-regular)", fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>{hint}</span> : null}
    </label>
  );
}
