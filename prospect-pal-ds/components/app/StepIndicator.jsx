import React from "react";
import { Icon } from "../core/Icon.jsx";

export function StepIndicator({ steps = [], current = 0, onStep }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
      {steps.map((label, i) => {
        const done = i < current, active = i === current;
        return (
          <React.Fragment key={label}>
            <button
              onClick={() => onStep && onStep(i)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "var(--space-3)",
                padding: "5px 10px", borderRadius: "var(--radius-pill)", cursor: "pointer",
                fontFamily: "var(--font-body)", fontSize: "var(--text-micro)",
                fontWeight: active ? "var(--weight-semibold)" : "var(--weight-medium)",
                background: active ? "var(--ink-800)" : done ? "var(--signal-verified-bg)" : "var(--surface-sunken)",
                color: active ? "var(--paper-0)" : done ? "var(--signal-verified)" : "var(--text-muted)",
                border: "1px solid " + (active ? "var(--ink-800)" : "transparent"),
                transition: "var(--transition-control)",
              }}
            >
              {done ? <Icon name="check" size={12} /> : (
                <span style={{ fontFamily: "var(--font-data)", opacity: 0.8 }}>{String(i + 1).padStart(2, "0")}</span>
              )}
              {label}
            </button>
            {i < steps.length - 1 ? <span style={{ width: 10, height: 1, background: "var(--border-strong)" }} /> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}
