"use client";

import { useState, useCallback } from "react";
import { Button, Badge, Icon } from "@/components/ds";
import { Play, Save, Download, ZoomIn, ZoomOut } from "lucide-react";
import { WorkflowCanvas, NodeEditPanel, type N8nNodeData } from "@/components/canvas";
import type { N8nNode } from "@/lib/workflow-generator";

interface CanvasViewProps {
  projectId: string | null;
  projectName: string | null;
}

const NINE_NODES: N8nNode[] = [
  { id: "1", label: "Intake & Cron", type: "n8n-nodes-base.cron", category: "trigger", icon: "⏰", color: "#FF9500", subtitle: "Trigger source" },
  { id: "2", label: "Data Normalizer", type: "n8n-nodes-base.set", category: "logic", icon: "🧹", color: "#6B7280", subtitle: "Schema transform" },
  { id: "3", label: "CRM Dedupe Shield", type: "n8n-nodes-base.hubspot", category: "crm", icon: "🛡️", color: "#FF7A59", subtitle: "Deal protection" },
  { id: "4", label: "Contact Reveal", type: "n8n-nodes-base.apollo", category: "enrichment", icon: "🔍", color: "#8B5CF6", subtitle: "Data enrichment" },
  { id: "5", label: "AI Research & PAS", type: "n8n-nodes-base.openai", category: "ai", icon: "🤖", color: "#7C3AED", subtitle: "Email copy" },
  { id: "6", label: "Approval Switch", type: "n8n-nodes-base.switch", category: "logic", icon: "⚖️", color: "#6B7280", subtitle: "Human gate" },
  { id: "7", label: "CRM Contact Create", type: "n8n-nodes-base.hubspot", category: "crm", icon: "💾", color: "#FF7A59", subtitle: "Lead sync" },
  { id: "8", label: "Sequence Enrollment", type: "n8n-nodes-base.smartlead", category: "sequencer", icon: "📬", color: "#06B6D4", subtitle: "Outreach start" },
  { id: "9", label: "Review Alert", type: "n8n-nodes-base.slack", category: "messaging", icon: "💬", color: "#4ADE80", subtitle: "Slack notify" },
];

const CONNECTIONS: [string, string][] = [
  ["1", "2"], ["2", "3"], ["3", "4"], ["4", "5"], ["5", "6"], ["6", "7"], ["7", "8"], ["6", "9"],
];

export default function CanvasView({ projectId, projectName }: CanvasViewProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<N8nNode[]>(NINE_NODES);
  const [zoom, setZoom] = useState(100);

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;

  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, data: Partial<N8nNodeData>) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId
          ? { ...node, label: data.label ?? node.label, subtitle: data.subtitle ?? node.subtitle }
          : node
      )
    );
  }, []);

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

      {/* Canvas Area - White n8n-style */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Main Canvas */}
        <div style={{ flex: 1, background: "#ffffff", position: "relative" }}>
          {projectId ? (
            <WorkflowCanvas
              nodes={nodes}
              connections={CONNECTIONS}
              selectedNodeId={selectedNodeId}
              onNodeSelect={handleNodeSelect}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                background: "#fafafa",
              }}
            >
              <Icon name="Workflow" size={48} color="var(--text-muted)" />
              <h3
                style={{
                  fontSize: "var(--text-h3)",
                  fontWeight: "var(--weight-semibold)",
                  color: "var(--text-primary)",
                  marginTop: "var(--space-6)",
                  marginBottom: "var(--space-3)",
                }}
              >
                No campaign selected
              </h3>
              <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }}>
                Select a campaign from the Campaigns view to edit its workflow
              </p>
            </div>
          )}
        </div>

        {/* Node Edit Panel */}
        {selectedNode && (
          <NodeEditPanel
            node={{
              id: selectedNode.id,
              data: {
                label: selectedNode.label,
                subtitle: selectedNode.subtitle,
                icon: selectedNode.icon,
                category: selectedNode.category,
                type: selectedNode.type,
                config: selectedNode.config,
              },
            }}
            onClose={() => setSelectedNodeId(null)}
            onUpdate={handleNodeUpdate}
          />
        )}
      </div>
    </div>
  );
}
