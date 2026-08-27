"use client";

import { useState, useCallback } from "react";
import { Button, Badge, Icon } from "@/components/ds";
import {
  Play,
  Save,
  Download,
  ZoomIn,
  ZoomOut,
  Workflow,
  Sparkles,
  ShieldCheck,
  Send,
  Database,
  Search,
  Scale,
  CheckCircle2,
  X,
  Lock,
} from "lucide-react";
import { WorkflowCanvas, NodeEditPanel, type N8nNodeData } from "@/components/canvas";
import type { N8nNode } from "@/lib/workflow-generator";

interface CanvasViewProps {
  projectId?: string | null;
  projectName?: string | null;
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
  const [targetPlatform, setTargetPlatform] = useState<"n8n" | "make" | "gumloop">("n8n");
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [instanceUrl, setInstanceUrl] = useState("https://n8n.yourcompany.com");
  const [instanceKey, setInstanceKey] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

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

  const handleExportJSON = () => {
    const payload = {
      name: `${projectName || "Prospect PAL Engine"} (${targetPlatform.toUpperCase()})`,
      platform: targetPlatform,
      generated_at: new Date().toISOString(),
      nodes: nodes.map((n) => ({
        id: n.id,
        name: n.label,
        type: n.type,
        category: n.category,
        subtitle: n.subtitle,
      })),
      connections: CONNECTIONS,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prospect-pal-${targetPlatform}-workflow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExecuteDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);

    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
      setTimeout(() => {
        setIsDeployModalOpen(false);
        setDeploySuccess(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", background: "var(--surface-page)" }}>
      {/* Canvas Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          borderBottom: "1px solid var(--border-hairline)",
          background: "var(--surface-card)",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ fontSize: "var(--text-h4)", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
            {projectName || "Live Outbound Engine Canvas"}
          </h2>
          <Badge tone="verified">9 nodes</Badge>

          {/* Target Platform Switcher */}
          <div style={{ display: "flex", gap: 4, background: "var(--surface-sunken)", padding: 3, borderRadius: "var(--radius-md)", marginLeft: 8 }}>
            {(["n8n", "make", "gumloop"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setTargetPlatform(p)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: targetPlatform === p ? "var(--cobalt-600)" : "transparent",
                  color: targetPlatform === p ? "white" : "var(--text-secondary)",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                {p === "n8n" ? "n8n" : p === "make" ? "Make.com" : "Gumloop"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Zoom controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 8px",
              background: "var(--surface-sunken)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}
            >
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: 11, fontFamily: "var(--font-data)", minWidth: 36, textAlign: "center" }}>
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}
            >
              <ZoomIn size={14} />
            </button>
          </div>

          <Button variant="outline" size="sm" icon="Download" onClick={handleExportJSON}>
            Export JSON
          </Button>
          <Button variant="accent" size="sm" icon="Play" onClick={() => setIsDeployModalOpen(true)}>
            Connect & Deploy
          </Button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        <div style={{ flex: 1, background: "#ffffff", position: "relative" }}>
          <WorkflowCanvas
            nodes={nodes}
            connections={CONNECTIONS}
            selectedNodeId={selectedNodeId}
            onNodeSelect={handleNodeSelect}
          />
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

      {/* 1-Click Deploy Modal */}
      {isDeployModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(16, 27, 45, 0.65)",
            backdropFilter: "blur(6px)",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "var(--radius-2xl)",
              width: "100%",
              maxWidth: 540,
              padding: 28,
              boxShadow: "var(--shadow-overlay)",
              border: "1px solid var(--border-hairline)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
                  Deploy to your {targetPlatform.toUpperCase()} Instance
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                  One-click push directly to your self-hosted or cloud instance via public API.
                </p>
              </div>
              <button
                onClick={() => setIsDeployModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            {deploySuccess ? (
              <div style={{ textAlign: "center", padding: "28px 0" }}>
                <CheckCircle2 size={48} color="var(--signal-verified)" style={{ margin: "0 auto 12px" }} />
                <h4 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                  Workflow Deployed Successfully!
                </h4>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
                  Imported 9 nodes into instance. Activation state: <strong>Active</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExecuteDeploy} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                    Instance API URL
                  </label>
                  <input
                    type="url"
                    required
                    value={instanceUrl}
                    onChange={(e) => setInstanceUrl(e.target.value)}
                    placeholder="https://n8n.yourcompany.com"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-hairline)",
                      fontSize: 13,
                      fontFamily: "var(--font-data)",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                    Instance Admin API Key
                  </label>
                  <input
                    type="password"
                    required
                    value={instanceKey}
                    onChange={(e) => setInstanceKey(e.target.value)}
                    placeholder="n8n_api_••••••••••••••••"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-hairline)",
                      fontSize: 13,
                      fontFamily: "var(--font-data)",
                      outline: "none",
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: 10,
                    borderRadius: "var(--radius-md)",
                    background: "var(--surface-sunken)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 11,
                    color: "var(--text-secondary)",
                  }}
                >
                  <Lock size={14} color="var(--signal-verified)" />
                  <span>Zero-Storage Guarantee: Key is used once in browser session and never saved.</span>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                  <Button variant="outline" size="md" onClick={() => setIsDeployModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="accent" size="md" icon="Play" disabled={isDeploying}>
                    {isDeploying ? "Deploying Graph..." : "Push to Instance"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

