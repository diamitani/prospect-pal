"use client";

import { useState } from "react";
import { Button, Badge, Icon, PipelineRail, PipelineNode } from "@/components/ds";
import { Play, Save, Download, Settings2, ZoomIn, ZoomOut } from "lucide-react";

interface CanvasViewProps {
  projectId: string | null;
  projectName: string | null;
}

const NINE_NODES: PipelineNode[] = [
  { title: "Intake & cron", subtitle: "Trigger source", icon: "Zap", stage: "trigger", binding: "n8n-nodes-base.cron" },
  { title: "Data normalizer", subtitle: "Schema transform", icon: "FileBraces", stage: "logic", binding: "n8n-nodes-base.set" },
  { title: "CRM dedupe shield", subtitle: "Deal protection", icon: "ShieldCheck", stage: "shield", binding: "n8n-nodes-base.hubspot" },
  { title: "Data tool adapter", subtitle: "Contact reveal", icon: "Search", stage: "data", binding: "n8n-nodes-base.apollo" },
  { title: "AI research & PAS", subtitle: "Email copy", icon: "Sparkles", stage: "ai", binding: "n8n-nodes-base.openai" },
  { title: "Approval switch", subtitle: "Human gate", icon: "Scale", stage: "logic", binding: "n8n-nodes-base.switch" },
  { title: "CRM contact create", subtitle: "Lead sync", icon: "Database", stage: "shield", binding: "n8n-nodes-base.hubspot" },
  { title: "Sequence enrollment", subtitle: "Outreach start", icon: "Send", stage: "sequence", binding: "n8n-nodes-base.smartlead" },
  { title: "Review alert", subtitle: "Slack notify", icon: "Bell", stage: "logic", binding: "n8n-nodes-base.slack" },
];

export default function CanvasView({ projectId, projectName }: CanvasViewProps) {
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [zoom, setZoom] = useState(100);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Canvas Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--space-4) var(--space-6)",
          borderBottom: "1px solid var(--border-hairline)",
          background: "var(--surface-card)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <h2 style={{ fontSize: "var(--text-h4)", fontWeight: "var(--weight-semibold)", margin: 0 }}>
            {projectName || "Workflow Canvas"}
          </h2>
          <Badge tone="verified">9 nodes</Badge>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-2)",
              background: "var(--surface-sunken)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "var(--space-2)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-secondary)",
              }}
            >
              <ZoomOut size={16} />
            </button>
            <span style={{ fontSize: "var(--text-caption)", fontWeight: "var(--weight-medium)", minWidth: 40, textAlign: "center" }}>
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "var(--space-2)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-secondary)",
              }}
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <Button variant="outline" size="sm" icon="Save">
            Save
          </Button>
          <Button variant="outline" size="sm" icon="Download">
            Export JSON
          </Button>
          <Button variant="accent" size="sm" icon="Play">
            Deploy
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        style={{
          flex: 1,
          background: "var(--surface-deep)",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Pipeline Rail */}
        <div style={{ padding: "var(--space-10)" }}>
          <PipelineRail
            nodes={NINE_NODES}
            activeIndex={activeNodeIndex}
            onSelect={setActiveNodeIndex}
          />
        </div>

        {/* Node Detail Panel */}
        <div
          style={{
            margin: "0 var(--space-10) var(--space-10)",
            padding: "var(--space-8)",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-deep)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-8)" }}>
            <div>
              <div
                style={{
                  fontSize: "var(--text-eyebrow)",
                  fontWeight: "var(--weight-semibold)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-eyebrow)",
                  color: "var(--champagne-200)",
                  marginBottom: "var(--space-3)",
                }}
              >
                Node {String(activeNodeIndex + 1).padStart(2, "0")}
              </div>
              <h3
                style={{
                  fontSize: "var(--text-h2)",
                  fontWeight: "var(--weight-bold)",
                  color: "var(--paper-0)",
                  margin: "0 0 var(--space-3)",
                }}
              >
                {NINE_NODES[activeNodeIndex].title}
              </h3>
              <p
                style={{
                  fontSize: "var(--text-body)",
                  color: "var(--ink-300)",
                  margin: "0 0 var(--space-6)",
                }}
              >
                {NINE_NODES[activeNodeIndex].subtitle}
              </p>

              <div
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "var(--text-caption)",
                  color: "var(--ink-400)",
                  padding: "var(--space-3) var(--space-4)",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "var(--radius-sm)",
                  display: "inline-block",
                }}
              >
                {NINE_NODES[activeNodeIndex].binding}
              </div>
            </div>

            <Button variant="inverse" icon="Settings2">
              Configure
            </Button>
          </div>
        </div>

        {/* Empty state for no project */}
        {!projectId && (
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-16)",
              color: "var(--ink-300)",
            }}
          >
            <Icon name="Workflow" size={48} color="var(--ink-500)" />
            <h3
              style={{
                fontSize: "var(--text-h3)",
                fontWeight: "var(--weight-semibold)",
                color: "var(--paper-0)",
                marginTop: "var(--space-6)",
                marginBottom: "var(--space-3)",
              }}
            >
              No campaign selected
            </h3>
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--ink-400)" }}>
              Select a campaign from the Campaigns view to edit its workflow
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
