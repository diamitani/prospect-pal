"use client";

import { useState } from "react";
import { Button, Icon, Badge } from "@/components/ds";

interface PipelineNode {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  stage: "trigger" | "data" | "ai" | "crm" | "sequence" | "notify";
  binding?: string;
  configured: boolean;
}

interface CanvasPanelProps {
  stack: {
    trigger: string;
    dataSource: string;
    enrichment: string;
    crm: string;
    sequencer: string;
    llm: string;
  };
  icp: string;
  workflowJson: any;
  onNodeClick: (nodeId: string) => void;
  onDownload: () => void;
  onDeploy: () => void;
  isCompiled: boolean;
}

const STAGE_COLORS: Record<string, string> = {
  trigger: "#6366f1",
  data: "#8b5cf6",
  ai: "#ec4899",
  crm: "#14b8a6",
  sequence: "#f59e0b",
  notify: "#64748b",
};

function getNodesFromStack(stack: CanvasPanelProps["stack"]): PipelineNode[] {
  return [
    {
      id: "trigger",
      title: stack.trigger === "cron" ? "Daily Cron" : stack.trigger === "webhook" ? "Webhook" : "Manual Trigger",
      subtitle: "Starts the pipeline",
      icon: "Clock",
      stage: "trigger",
      binding: "n8n-nodes-base.scheduleTrigger",
      configured: true,
    },
    {
      id: "normalize",
      title: "Normalizer",
      subtitle: "Schema transform",
      icon: "FileJson",
      stage: "data",
      binding: "n8n-nodes-base.set",
      configured: true,
    },
    {
      id: "dedupe",
      title: `${stack.crm.charAt(0).toUpperCase() + stack.crm.slice(1)} Dedupe`,
      subtitle: "Skip existing contacts",
      icon: "ShieldCheck",
      stage: "crm",
      binding: `n8n-nodes-base.${stack.crm}`,
      configured: !!stack.crm,
    },
    {
      id: "enrich",
      title: `${stack.dataSource.charAt(0).toUpperCase() + stack.dataSource.slice(1)} Enrich`,
      subtitle: "Contact data",
      icon: "Search",
      stage: "data",
      binding: `n8n-nodes-base.${stack.dataSource}`,
      configured: !!stack.dataSource,
    },
    {
      id: "ai",
      title: `${stack.llm === "anthropic" ? "Claude" : stack.llm === "openai" ? "GPT-4" : "AI"} Research`,
      subtitle: "ICP fit + email copy",
      icon: "Sparkles",
      stage: "ai",
      binding: stack.llm === "anthropic" ? "n8n-nodes-base.anthropic" : "n8n-nodes-base.openai",
      configured: !!stack.llm,
    },
    {
      id: "gate",
      title: "Approval Gate",
      subtitle: "Human review",
      icon: "Scale",
      stage: "notify",
      binding: "n8n-nodes-base.switch",
      configured: true,
    },
    {
      id: "crm-create",
      title: `Create ${stack.crm.charAt(0).toUpperCase() + stack.crm.slice(1)} Contact`,
      subtitle: "Sync to CRM",
      icon: "UserPlus",
      stage: "crm",
      binding: `n8n-nodes-base.${stack.crm}`,
      configured: !!stack.crm,
    },
    {
      id: "sequence",
      title: `${stack.sequencer.charAt(0).toUpperCase() + stack.sequencer.slice(1)} Enroll`,
      subtitle: "Start outreach",
      icon: "Send",
      stage: "sequence",
      binding: `n8n-nodes-base.${stack.sequencer}`,
      configured: !!stack.sequencer,
    },
    {
      id: "notify",
      title: "Slack Alert",
      subtitle: "Team notification",
      icon: "Bell",
      stage: "notify",
      binding: "n8n-nodes-base.slack",
      configured: true,
    },
  ];
}

export default function CanvasPanel({
  stack,
  icp,
  workflowJson,
  onNodeClick,
  onDownload,
  onDeploy,
  isCompiled,
}: CanvasPanelProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const nodes = getNodesFromStack(stack);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--surface-page)" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Pipeline Canvas</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>
            {isCompiled ? "Workflow compiled • Ready to deploy" : "Click nodes to customize"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isCompiled && (
            <>
              <Button variant="outline" size="sm" icon="Download" onClick={onDownload}>
                JSON
              </Button>
              <Button variant="accent" size="sm" icon="Rocket" onClick={onDeploy}>
                Deploy
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
        {/* 3x3 Grid Layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px 24px",
          maxWidth: 600,
          margin: "0 auto",
        }}>
          {nodes.map((node, i) => (
            <div key={node.id} style={{ position: "relative" }}>
              {/* Connection line to next node */}
              {i < nodes.length - 1 && i % 3 !== 2 && (
                <div style={{
                  position: "absolute",
                  right: -24,
                  top: "50%",
                  width: 24,
                  height: 2,
                  background: "var(--border-default)",
                }} />
              )}
              {/* Connection line to row below */}
              {i % 3 === 2 && i < nodes.length - 1 && (
                <div style={{
                  position: "absolute",
                  left: "50%",
                  bottom: -16,
                  width: 2,
                  height: 16,
                  background: "var(--border-default)",
                }} />
              )}

              <button
                onClick={() => onNodeClick(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: hoveredNode === node.id ? "var(--surface-hover)" : "var(--surface-raised)",
                  border: `2px solid ${hoveredNode === node.id ? STAGE_COLORS[node.stage] : "var(--border-default)"}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: STAGE_COLORS[node.stage],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Icon name={node.icon as any} size={16} style={{ color: "white" }} />
                  </div>
                  {node.configured && (
                    <Badge tone="verified">Ready</Badge>
                  )}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{node.title}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{node.subtitle}</div>
              </button>
            </div>
          ))}
        </div>

        {/* ICP Summary */}
        {icp && (
          <div style={{ marginTop: 32, padding: 16, background: "var(--surface-raised)", borderRadius: 12, border: "1px solid var(--border-default)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icon name="Target" size={16} style={{ color: "var(--accent-primary)" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>ICP Profile</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>{icp}</p>
          </div>
        )}

        {/* Compiled Workflow Preview */}
        {isCompiled && workflowJson && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Icon name="Check" size={16} style={{ color: "var(--status-success)" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--status-success)" }}>Workflow Compiled</span>
            </div>
            <details style={{ background: "var(--surface-raised)", borderRadius: 8, border: "1px solid var(--border-default)" }}>
              <summary style={{ padding: "10px 14px", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>
                View JSON ({workflowJson.nodes?.length || 0} nodes)
              </summary>
              <pre style={{ padding: "12px 14px", fontSize: 11, overflow: "auto", maxHeight: 200, margin: 0, background: "var(--surface-default)", borderTop: "1px solid var(--border-default)" }}>
                {JSON.stringify(workflowJson, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
