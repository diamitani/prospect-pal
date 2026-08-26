"use client";

import { CSSProperties, ReactNode } from "react";
import { Icon } from "../core/Icon";

export interface PricingCardProps {
  name: string;
  price: string;
  cadence?: string;
  note?: string;
  description?: string;
  features?: string[];
  cta?: ReactNode;
  featured?: boolean;
  tone?: "paper" | "sunken";
  style?: CSSProperties;
}

export function PricingCard({
  name,
  price,
  cadence,
  note,
  description,
  features = [],
  cta,
  featured = false,
  tone = "paper",
  style,
}: PricingCardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "28px 26px",
        borderRadius: "var(--radius-2xl)",
        background: tone === "sunken" ? "var(--surface-sunken)" : "var(--surface-card)",
        border: featured
          ? "var(--border-width-emphasis) solid var(--cobalt-500)"
          : "1px solid var(--border-hairline)",
        boxShadow: featured ? "var(--shadow-raised)" : "var(--shadow-hairline)",
        position: "relative",
        ...style,
      }}
    >
      {featured && (
        <span
          style={{
            position: "absolute",
            top: -11,
            left: 26,
            background: "var(--cobalt-600)",
            color: "var(--paper-0)",
            fontSize: "var(--text-micro)",
            fontWeight: "var(--weight-semibold)",
            padding: "3px 11px",
            borderRadius: "var(--radius-pill)",
            letterSpacing: "0.04em",
          }}
        >
          Most teams start here
        </span>
      )}

      <div
        style={{
          fontSize: "var(--text-eyebrow)",
          fontWeight: "var(--weight-semibold)",
          textTransform: "uppercase",
          letterSpacing: "var(--tracking-eyebrow)",
          color: featured ? "var(--text-brand)" : "var(--text-muted)",
          marginBottom: "var(--space-6)",
        }}
      >
        {name}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h1)",
            fontWeight: "var(--weight-bold)",
            letterSpacing: "var(--tracking-display)",
          }}
        >
          {price}
        </span>
        {cadence && (
          <span
            style={{
              fontSize: "var(--text-body-sm)",
              color: "var(--text-muted)",
            }}
          >
            {cadence}
          </span>
        )}
      </div>

      {note && (
        <div
          style={{
            fontSize: "var(--text-caption)",
            color: "var(--text-muted)",
            marginTop: 4,
          }}
        >
          {note}
        </div>
      )}

      {description && (
        <p
          style={{
            margin: "var(--space-8) 0 var(--space-9)",
            fontSize: "var(--text-body-sm)",
            color: "var(--text-secondary)",
            lineHeight: "var(--leading-relaxed)",
          }}
        >
          {description}
        </p>
      )}

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 var(--space-10)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-5)",
          flex: 1,
        }}
      >
        {features.map((t) => (
          <li
            key={t}
            style={{
              display: "flex",
              gap: "var(--space-5)",
              fontSize: "var(--text-body-sm)",
              color: "var(--ink-700)",
              lineHeight: "var(--leading-normal)",
            }}
          >
            <Icon name="Check" size={15} color="var(--signal-verified)" />
            <span>{t}</span>
          </li>
        ))}
      </ul>

      {cta}
    </div>
  );
}
