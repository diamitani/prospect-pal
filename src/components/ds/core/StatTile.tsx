"use client";

import { CSSProperties } from "react";

type StatTone = "neutral" | "verified" | "brand" | "premium";

const TONE_COLORS: Record<StatTone, { value: string; label: string }> = {
  neutral: { value: "var(--text-primary)", label: "var(--text-muted)" },
  verified: { value: "var(--signal-verified)", label: "var(--text-muted)" },
  brand: { value: "var(--cobalt-600)", label: "var(--text-muted)" },
  premium: { value: "var(--champagne-400)", label: "var(--text-muted)" },
};

export interface StatTileProps {
  value: string | number;
  unit?: string;
  label: string;
  tone?: StatTone;
  style?: CSSProperties;
}

export function StatTile({
  value,
  unit,
  label,
  tone = "neutral",
  style,
}: StatTileProps) {
  const colors = TONE_COLORS[tone];

  return (
    <div
      style={{
        padding: "var(--space-8) var(--space-6)",
        background: "var(--surface-sunken)",
        borderRadius: "var(--radius-lg)",
        textAlign: "center",
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-h2)",
          fontWeight: "var(--weight-bold)",
          letterSpacing: "var(--tracking-display)",
          color: colors.value,
          lineHeight: 1.1,
        }}
      >
        {value}
        {unit && (
          <span
            style={{
              fontSize: "var(--text-body-sm)",
              fontWeight: "var(--weight-medium)",
              marginLeft: "var(--space-2)",
            }}
          >
            {unit}
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: "var(--text-caption)",
          color: colors.label,
          marginTop: "var(--space-2)",
          fontWeight: "var(--weight-medium)",
        }}
      >
        {label}
      </div>
    </div>
  );
}
