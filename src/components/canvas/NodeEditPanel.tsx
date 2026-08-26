"use client";

import type { N8nNodeData } from "./N8nNode";

interface NodeEditPanelProps {
  node: {
    id: string;
    data: N8nNodeData;
  };
  onClose: () => void;
  onUpdate: (nodeId: string, data: Partial<N8nNodeData>) => void;
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

const CATEGORY_LABELS: Record<string, string> = {
  trigger: "Trigger",
  api: "API Integration",
  crm: "CRM",
  enrichment: "Enrichment",
  ai: "AI / LLM",
  logic: "Logic",
  messaging: "Messaging",
  sequencer: "Sequencer",
  output: "Output",
};

export default function NodeEditPanel({ node, onClose, onUpdate }: NodeEditPanelProps) {
  const accentColor = CATEGORY_COLORS[node.data.category] || "#6B7280";

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(node.id, { label: e.target.value });
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(node.id, { subtitle: e.target.value });
  };

  return (
    <div
      style={{
        width: 380,
        height: "100%",
        background: "#ffffff",
        borderLeft: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `${accentColor}15`,
              border: `1px solid ${accentColor}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            {node.data.icon}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>
              {node.data.label}
            </div>
            <div style={{ fontSize: 11, color: "#6B7280" }}>
              {CATEGORY_LABELS[node.data.category] || node.data.category}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            cursor: "pointer",
            fontSize: 16,
            color: "#6B7280",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "#374151",
              marginBottom: 6,
            }}
          >
            Node Label
          </label>
          <input
            type="text"
            value={node.data.label}
            onChange={handleLabelChange}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1.5px solid #e5e7eb",
              fontSize: 13,
              fontFamily: "inherit",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "#374151",
              marginBottom: 6,
            }}
          >
            Description
          </label>
          <input
            type="text"
            value={node.data.subtitle}
            onChange={handleSubtitleChange}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1.5px solid #e5e7eb",
              fontSize: 13,
              fontFamily: "inherit",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "#374151",
              marginBottom: 6,
            }}
          >
            Node Type
          </label>
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              fontSize: 12,
              fontFamily: "monospace",
              color: "#6B7280",
            }}
          >
            {node.data.type}
          </div>
        </div>

        <div
          style={{
            padding: 16,
            background: `${accentColor}08`,
            border: `1px solid ${accentColor}20`,
            borderRadius: 10,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: accentColor,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            Configuration
          </div>
          <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
            {node.data.category === "trigger" && (
              <>
                <div style={{ marginBottom: 8 }}>
                  <strong>Schedule:</strong> Daily at 7:00 AM UTC
                </div>
                <div>
                  <strong>Timezone:</strong> America/New_York
                </div>
              </>
            )}
            {node.data.category === "api" && (
              <>
                <div style={{ marginBottom: 8 }}>
                  <strong>Endpoint:</strong> Configured via credentials
                </div>
                <div>
                  <strong>Rate Limit:</strong> 25 requests/day
                </div>
              </>
            )}
            {node.data.category === "crm" && (
              <>
                <div style={{ marginBottom: 8 }}>
                  <strong>Action:</strong> Check/Create Contact
                </div>
                <div>
                  <strong>Dedupe:</strong> By email address
                </div>
              </>
            )}
            {node.data.category === "enrichment" && (
              <>
                <div style={{ marginBottom: 8 }}>
                  <strong>Fields:</strong> Email, LinkedIn, Company
                </div>
                <div>
                  <strong>Waterfall:</strong> Enabled
                </div>
              </>
            )}
            {node.data.category === "ai" && (
              <>
                <div style={{ marginBottom: 8 }}>
                  <strong>Model:</strong> GPT-4o / Claude 3.5
                </div>
                <div>
                  <strong>Framework:</strong> PAS (Problem-Agitate-Solve)
                </div>
              </>
            )}
            {node.data.category === "logic" && (
              <>
                <div style={{ marginBottom: 8 }}>
                  <strong>Condition:</strong> Confidence {">"} 0.85
                </div>
                <div>
                  <strong>Routes:</strong> Approve / Review
                </div>
              </>
            )}
            {node.data.category === "messaging" && (
              <>
                <div style={{ marginBottom: 8 }}>
                  <strong>Channel:</strong> #sales-pipeline
                </div>
                <div>
                  <strong>Format:</strong> Rich message with buttons
                </div>
              </>
            )}
            {node.data.category === "sequencer" && (
              <>
                <div style={{ marginBottom: 8 }}>
                  <strong>Campaign:</strong> Auto-assigned
                </div>
                <div>
                  <strong>Sequence:</strong> 3-touch follow-up
                </div>
              </>
            )}
            {!["trigger", "api", "crm", "enrichment", "ai", "logic", "messaging", "sequencer"].includes(node.data.category) && (
              <div>Node configuration will appear here when connected.</div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: 10,
        }}
      >
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: 8,
            border: "1.5px solid #e5e7eb",
            background: "#ffffff",
            color: "#374151",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: 8,
            border: "none",
            background: "#2A41C9",
            color: "#ffffff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
