"use client";

import { CSSProperties } from "react";

export interface LogoProps {
  variant?: "lockup" | "mark";
  size?: number;
  onDeep?: boolean;
  tagline?: string;
  style?: CSSProperties;
}

export function Logo({
  variant = "lockup",
  size = 32,
  onDeep = false,
  tagline,
  style,
}: LogoProps) {
  const ink = onDeep ? "var(--paper-0)" : "var(--ink-800)";
  const markBg = onDeep ? "var(--paper-0)" : "var(--ink-800)";
  const nodeFill = onDeep ? "var(--ink-800)" : "var(--paper-50)";
  const accent = "var(--champagne-300)";

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ flexShrink: 0, display: "block" }}
    >
      <rect width="48" height="48" rx="13" fill={markBg} />
      <path
        d="M14 32.5 L24 24 L34 15.5"
        stroke={accent}
        strokeWidth="2.2"
        strokeLinecap="square"
        fill="none"
      />
      <circle cx="14" cy="32.5" r="3.4" fill={nodeFill} />
      <circle cx="24" cy="24" r="3.4" fill={nodeFill} />
      <circle cx="34" cy="15.5" r="4.6" fill={accent} />
    </svg>
  );

  if (variant === "mark") return <span style={style}>{mark}</span>;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(size * 0.34),
        ...style,
      }}
    >
      {mark}
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: "var(--weight-bold)",
            fontSize: Math.round(size * 0.52),
            letterSpacing: "var(--tracking-heading)",
            color: ink,
            whiteSpace: "nowrap",
          }}
        >
          Prospect{" "}
          <span
            style={{
              color: onDeep ? "var(--champagne-200)" : "var(--cobalt-600)",
              letterSpacing: "0.02em",
            }}
          >
            PAL
          </span>
        </span>
        {tagline && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: Math.round(size * 0.3),
              color: onDeep ? "var(--ink-300)" : "var(--text-muted)",
              fontWeight: "var(--weight-medium)",
              marginTop: 2,
            }}
          >
            {tagline}
          </span>
        )}
      </span>
    </span>
  );
}
