import React from "react";
import { IconButton } from "../core/IconButton.jsx";

export function Modal({ open = true, title, eyebrow, onClose, footer, width = 620, tone = "paper", children }) {
  if (!open) return null;
  const deep = tone === "deep";
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999, padding: "var(--space-10)",
      background: "rgba(11,15,22,0.55)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "pp-fade-up var(--duration-base) var(--ease-entrance)",
    }}>
      <div style={{
        width: "100%", maxWidth: width, borderRadius: "var(--radius-xl)",
        background: deep ? "var(--surface-deep)" : "var(--surface-card)",
        border: "1px solid " + (deep ? "var(--border-deep)" : "var(--border-hairline)"),
        boxShadow: "var(--shadow-overlay)", overflow: "hidden",
      }}>
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          gap: "var(--space-8)", padding: "20px 22px 16px",
          borderBottom: "1px solid " + (deep ? "var(--border-deep)" : "var(--border-hairline)"),
        }}>
          <div>
            {eyebrow ? (
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-eyebrow)",
                fontWeight: "var(--weight-semibold)", textTransform: "uppercase",
                letterSpacing: "var(--tracking-eyebrow)", color: deep ? "var(--champagne-200)" : "var(--text-brand)",
                marginBottom: 5,
              }}>{eyebrow}</div>
            ) : null}
            <div style={{
              fontFamily: "var(--font-display)", fontSize: "var(--text-h3)",
              fontWeight: "var(--weight-bold)", letterSpacing: "var(--tracking-heading)",
              color: deep ? "var(--paper-0)" : "var(--text-primary)",
            }}>{title}</div>
          </div>
          <IconButton icon="x" label="Close" onClick={onClose} variant={deep ? "deep" : "ghost"} />
        </div>
        <div style={{ padding: "20px 22px", color: deep ? "var(--ink-200)" : "var(--text-primary)" }}>{children}</div>
        {footer ? (
          <div style={{
            padding: "14px 22px", display: "flex", justifyContent: "flex-end", gap: "var(--space-6)",
            borderTop: "1px solid " + (deep ? "var(--border-deep)" : "var(--border-hairline)"),
            background: deep ? "transparent" : "var(--surface-sunken)",
          }}>{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
