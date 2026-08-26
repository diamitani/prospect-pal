"use client";

import { CSSProperties } from "react";
import { Icon } from "../core/Icon";

export interface LeadSignalCardProps {
  company: string;
  round?: string;
  stack?: string[];
  trigger?: string;
  contact: string;
  verified?: boolean;
  style?: CSSProperties;
}

export function LeadSignalCard({
  company,
  round,
  stack = [],
  trigger,
  contact,
  verified = true,
  style,
}: LeadSignalCardProps) {
  return (
    <div
      style={{
        padding: "18px 20px",
        borderRadius: "var(--radius-xl)",
        background: "var(--surface-deep-raised)",
        border: "1px solid var(--border-deep)",
        boxShadow: "var(--shadow-inset-deep)",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: "var(--space-6)",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-h3)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--paper-0)",
            letterSpacing: "var(--tracking-heading)",
          }}
        >
          {company}
        </span>
        {round && (
          <span
            style={{
              fontSize: "var(--text-micro)",
              fontWeight: "var(--weight-semibold)",
              color: "var(--champagne-200)",
              background: "rgba(199,158,62,0.14)",
              border: "1px solid rgba(199,158,62,0.28)",
              padding: "2px 9px",
              borderRadius: "var(--radius-pill)",
            }}
          >
            {round}
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          marginBottom: "var(--space-6)",
        }}
      >
        {stack.map((s) => (
          <span
            key={s}
            style={{
              fontFamily: "var(--font-data)",
              fontSize: "var(--text-micro)",
              color: "var(--ink-200)",
              background: "rgba(255,255,255,0.06)",
              padding: "2px 7px",
              borderRadius: "var(--radius-xs)",
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {trigger && (
        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            alignItems: "flex-start",
            fontSize: "var(--text-caption)",
            color: "var(--ink-200)",
            marginBottom: "var(--space-8)",
          }}
        >
          <Icon name="Radio" size={14} color="var(--champagne-300)" />
          <span>{trigger}</span>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "var(--space-6)",
          borderTop: "1px solid var(--border-deep)",
          fontSize: "var(--text-caption)",
          color: "var(--ink-300)",
        }}
      >
        <span>{contact}</span>
        {verified && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              color: "var(--paper-0)",
              fontWeight: "var(--weight-semibold)",
            }}
          >
            <Icon name="CircleCheck" size={13} color="#5BD1AE" /> Verified
          </span>
        )}
      </div>
    </div>
  );
}
