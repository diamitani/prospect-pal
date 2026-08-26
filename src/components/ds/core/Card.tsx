"use client";

import { CSSProperties, ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
  elevated?: boolean;
  style?: CSSProperties;
  className?: string;
}

const PADDING_MAP = {
  sm: "var(--space-8)",
  md: "var(--space-9)",
  lg: "var(--space-10)",
};

export function Card({
  children,
  padding = "md",
  elevated = false,
  style,
  className,
}: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-hairline)",
        padding: PADDING_MAP[padding],
        boxShadow: elevated ? "var(--shadow-card)" : "var(--shadow-hairline)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
