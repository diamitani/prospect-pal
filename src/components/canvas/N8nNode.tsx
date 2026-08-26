"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

export interface N8nNodeData {
  label: string;
  subtitle: string;
  icon: string;
  category: string;
  type: string;
  config?: Record<string, unknown>;
  [key: string]: unknown;
}

const CATEGORY_COLORS: Record<string, string> = {
  trigger: "#FF9500",
  api: "#3B82F6",
  crm: "#FF7A59",
  enrichment: "#8B5CF6",
  ai: "#7C3AED",
  logic: "#6B7280",
  messaging: "#4ADE80",
  sequencer: "#06B6D4",
  output: "#10B981",
};

interface N8nNodeProps {
  data: N8nNodeData;
  selected?: boolean;
}

function N8nNodeComponent({ data, selected }: N8nNodeProps) {
  const nodeData = data;
  const accentColor = CATEGORY_COLORS[nodeData.category] || "#6B7280";

  return (
    <div
      style={{
        background: "#ffffff",
        border: `1.5px solid ${selected ? "#2A41C9" : "#e5e7eb"}`,
        borderRadius: 12,
        minWidth: 220,
        padding: 0,
        boxShadow: selected
          ? "0 0 0 2px rgba(42, 65, 201, 0.2), 0 4px 16px rgba(0,0,0,0.12)"
          : "0 2px 8px rgba(0,0,0,0.08)",
        transition: "all 0.15s ease",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 10,
          height: 10,
          background: "#e5e7eb",
          border: "2px solid #ffffff",
          left: -5,
        }}
      />

      <div style={{ display: "flex", alignItems: "stretch" }}>
        <div
          style={{
            width: 4,
            background: accentColor,
            flexShrink: 0,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", flex: 1 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `${accentColor}15`,
              border: `1px solid ${accentColor}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {nodeData.icon}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#111827",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {nodeData.label}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#6B7280",
                marginTop: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {nodeData.subtitle}
            </div>
          </div>

          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: accentColor,
              opacity: 0.6,
              flexShrink: 0,
            }}
          />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 10,
          height: 10,
          background: accentColor,
          border: "2px solid #ffffff",
          right: -5,
        }}
      />
    </div>
  );
}

export default memo(N8nNodeComponent);
