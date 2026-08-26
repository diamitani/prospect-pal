"use client";

import { CSSProperties, ReactNode } from "react";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  onDeep?: boolean;
  action?: ReactNode;
  style?: CSSProperties;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  onDeep = false,
  action,
  style,
}: SectionHeadingProps) {
  const centred = align === "center";

  return (
    <div
      style={{
        display: "flex",
        alignItems: centred ? "center" : "flex-end",
        justifyContent: centred ? "center" : "space-between",
        flexDirection: centred ? "column" : "row",
        gap: "var(--space-8)",
        textAlign: centred ? "center" : "left",
        ...style,
      }}
    >
      <div style={{ maxWidth: centred ? 680 : undefined }}>
        {eyebrow && (
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-eyebrow)",
              fontWeight: "var(--weight-semibold)",
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-eyebrow)",
              color: onDeep ? "var(--champagne-200)" : "var(--text-brand)",
              marginBottom: "var(--space-4)",
            }}
          >
            {eyebrow}
          </div>
        )}
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display-2)",
            fontWeight: "var(--weight-bold)",
            letterSpacing: "var(--tracking-display)",
            lineHeight: "var(--leading-snug)",
            color: onDeep ? "var(--paper-0)" : "var(--text-primary)",
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              margin: "var(--space-6) 0 0",
              fontSize: "var(--text-body)",
              lineHeight: "var(--leading-relaxed)",
              color: onDeep ? "var(--ink-300)" : "var(--text-secondary)",
              maxWidth: 640,
              marginInline: centred ? "auto" : undefined,
            }}
          >
            {description}
          </p>
        )}
      </div>
      {action && !centred && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}
