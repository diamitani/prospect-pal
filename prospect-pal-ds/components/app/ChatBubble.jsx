import React from "react";

export function ChatBubble({ role = "assistant", children, style }) {
  const user = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: user ? "flex-end" : "flex-start", ...style }}>
      <div style={{
        maxWidth: user ? "82%" : "88%", padding: "10px 14px",
        fontFamily: "var(--font-body)", fontSize: "var(--text-body-sm)",
        lineHeight: "var(--leading-normal)", whiteSpace: "pre-wrap",
        borderRadius: "var(--radius-lg)",
        borderBottomRightRadius: user ? "var(--radius-xs)" : undefined,
        borderBottomLeftRadius: user ? undefined : "var(--radius-xs)",
        background: user ? "var(--ink-800)" : "var(--surface-card)",
        color: user ? "var(--paper-0)" : "var(--text-primary)",
        border: user ? "none" : "1px solid var(--border-hairline)",
        boxShadow: user ? "none" : "var(--shadow-hairline)",
      }}>{children}</div>
    </div>
  );
}
