import React from "react";

export function TypingDots({ label = "Compiling" }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "var(--space-4)",
      padding: "8px 14px", borderRadius: "var(--radius-lg)",
      background: "var(--surface-sunken)", border: "1px solid var(--border-hairline)",
      fontFamily: "var(--font-body)", fontSize: "var(--text-caption)", color: "var(--text-secondary)",
    }}>
      <span style={{ display: "inline-flex", gap: 3 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: 5, height: 5, borderRadius: "50%", background: "var(--cobalt-400)",
            animation: "pp-typing 1.4s var(--ease-standard) infinite",
            animationDelay: i * 0.2 + "s",
          }} />
        ))}
      </span>
      {label}
    </div>
  );
}
