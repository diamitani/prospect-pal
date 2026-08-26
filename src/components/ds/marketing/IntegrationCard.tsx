"use client";

import { useState, CSSProperties } from "react";
import { Icon, IconProps } from "../core/Icon";

export interface IntegrationCardProps {
  name: string;
  description: string;
  icon?: IconProps["name"];
  capability?: string;
  connected?: boolean;
  style?: CSSProperties;
}

export function IntegrationCard({
  name,
  description,
  icon = "Plug",
  capability,
  connected = false,
  style,
}: IntegrationCardProps) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-7)",
        padding: "16px 18px",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface-card)",
        border: "1px solid var(--border-hairline)",
        boxShadow: hover ? "var(--shadow-card-hover)" : "var(--shadow-hairline)",
        transform: hover ? "var(--lift-hover)" : "none",
        transition: "var(--transition-surface)",
        ...style,
      }}
    >
      <span
        style={{
          width: 38,
          height: 38,
          borderRadius: "var(--radius-md)",
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--surface-sunken)",
          color: "var(--ink-600)",
        }}
      >
        <Icon name={icon} size={19} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
          <span
            style={{
              fontSize: "var(--text-h4)",
              fontWeight: "var(--weight-semibold)",
              color: "var(--text-primary)",
            }}
          >
            {name}
          </span>
          {connected && <Icon name="CircleCheck" size={14} color="var(--signal-verified)" />}
        </div>
        {capability && (
          <div
            style={{
              fontFamily: "var(--font-data)",
              fontSize: "var(--text-micro)",
              color: "var(--text-muted)",
              marginBottom: 4,
            }}
          >
            {capability}
          </div>
        )}
        <div
          style={{
            fontSize: "var(--text-caption)",
            color: "var(--text-secondary)",
            lineHeight: "var(--leading-normal)",
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}
