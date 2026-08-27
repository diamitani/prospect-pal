"use client";

import { useState, CSSProperties } from "react";
import { Icon, IconProps } from "../core/Icon";

type NodeStage = "trigger" | "shield" | "data" | "ai" | "sequence" | "logic";

const STAGE_COLORS: Record<NodeStage, string> = {
  trigger: "var(--stage-trigger)",
  shield: "var(--stage-shield)",
  data: "var(--stage-data)",
  ai: "var(--stage-ai)",
  sequence: "var(--stage-sequence)",
  logic: "var(--stage-logic)",
};

export interface NodeCardProps {
  step: number;
  title: string;
  subtitle?: string;
  tooltip?: string;
  icon: IconProps["name"];
  stage?: NodeStage;
  binding?: string;
  selected?: boolean;
  onDeep?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function NodeCard({
  step,
  title,
  subtitle,
  icon,
  stage = "logic",
  binding,
  selected = false,
  onDeep = true,
  onClick,
  style,
}: NodeCardProps) {
  const [hover, setHover] = useState(false);
  const c = STAGE_COLORS[stage];
  const bg = onDeep
    ? selected
      ? "var(--surface-deep-raised)"
      : "rgba(255,255,255,0.03)"
    : selected
      ? "var(--surface-brand-tint)"
      : "var(--surface-card)";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        minWidth: 158,
        padding: "13px 14px",
        cursor: onClick ? "pointer" : "default",
        borderRadius: "var(--radius-lg)",
        background: bg,
        border: `var(--border-width-emphasis) solid ${selected ? c : onDeep ? "var(--border-deep)" : "var(--border-hairline)"}`,
        boxShadow: selected
          ? `0 0 22px ${onDeep ? "rgba(255,255,255,0.06)" : "rgba(16,27,45,0.10)"}`
          : "none",
        transform: hover && onClick && !selected ? "translateY(-1px)" : "none",
        transition: "var(--transition-control)",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 9,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-data)",
            fontSize: "var(--text-micro)",
            fontWeight: "var(--weight-semibold)",
            color: c,
            letterSpacing: "var(--tracking-mono)",
          }}
        >
          {String(step).padStart(2, "0")}
        </span>
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: "var(--radius-xs)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: onDeep ? "rgba(255,255,255,0.06)" : "var(--surface-sunken)",
            color: c,
          }}
        >
          <Icon name={icon} size={14} />
        </span>
      </div>

      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-body-sm)",
          fontWeight: "var(--weight-semibold)",
          marginBottom: 3,
          color: onDeep ? "var(--paper-0)" : "var(--text-primary)",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "var(--text-micro)",
          color: onDeep ? "var(--ink-300)" : "var(--text-secondary)",
          lineHeight: "var(--leading-snug)",
        }}
      >
        {subtitle}
      </div>

      {binding && (
        <div
          style={{
            marginTop: 9,
            paddingTop: 8,
            borderTop: `1px solid ${onDeep ? "var(--border-deep)" : "var(--border-hairline)"}`,
            fontFamily: "var(--font-data)",
            fontSize: "var(--text-micro)",
            color: onDeep ? "var(--ink-400)" : "var(--text-muted)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {binding}
        </div>
      )}
    </div>
  );
}
