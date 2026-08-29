"use client";

import { useState, useCallback } from "react";
import ChatPanel from "@/components/studio/ChatPanel";
import CanvasPanel from "@/components/studio/CanvasPanel";
import { DEFAULT_STACK } from "@/components/studio/templates";
import { Button, Icon } from "@/components/ds";

interface StudioViewProps {
  onComplete?: () => void;
}

export default function StudioView({ onComplete }: StudioViewProps) {
  const [stack, setStack] = useState(DEFAULT_STACK);
  const [icp, setIcp] = useState("");
  const [company, setCompany] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [workflowJson, setWorkflowJson] = useState<any>(null);
  const [showNodeConfig, setShowNodeConfig] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const handleCompile = useCallback(async () => {
    // Check for API key
    if (!apiKey && !process.env.NEXT_PUBLIC_DEFAULT_LLM_KEY) {
      setShowApiKeyModal(true);
      return;
    }

    setIsCompiling(true);
    try {
      const response = await fetch("/api/orchestrate/unified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: {
            icpPrompt: icp || `Build a lead automation workflow for: ${company}`,
            leadSource: stack.dataSource as any,
            enrichment: [stack.enrichment] as any,
            crm: stack.crm as any,
            sequencer: stack.sequencer as any,
            approvalGate: true,
            slackAlerts: true,
          },
          apiKey: apiKey || undefined,
        }),
      });

      const result = await response.json();
      if (result.workflow) {
        setWorkflowJson(result.workflow);
      } else if (result.byok) {
        // API key required - show modal
        setShowApiKeyModal(true);
      } else if (result.error) {
        console.error("Compile error:", result.error);
        alert(`Compile failed: ${result.message || result.error}`);
      }
    } catch (err) {
      console.error("Compile error:", err);
      alert("Failed to compile workflow. Please try again.");
    } finally {
      setIsCompiling(false);
    }
  }, [stack, icp, company, apiKey]);

  const handleDownload = useCallback(() => {
    if (!workflowJson) return;
    const blob = new Blob([JSON.stringify(workflowJson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prospect-pal-workflow.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [workflowJson]);

  const handleDeploy = useCallback(() => {
    // TODO: Implement direct n8n deploy
    alert("Deploy to n8n coming soon! For now, download the JSON and import it manually.");
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    setShowNodeConfig(nodeId);
  }, []);

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Chat Panel - Left */}
      <div style={{ width: 400, flexShrink: 0, borderRight: "1px solid var(--border-default)", overflow: "hidden" }}>
        <ChatPanel
          onStackChange={setStack}
          onIcpChange={setIcp}
          onCompanyChange={setCompany}
          onCompile={handleCompile}
          isCompiling={isCompiling}
        />
      </div>

      {/* Canvas Panel - Right */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <CanvasPanel
          stack={stack}
          icp={icp}
          workflowJson={workflowJson}
          onNodeClick={handleNodeClick}
          onDownload={handleDownload}
          onDeploy={handleDeploy}
          isCompiled={!!workflowJson}
        />
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowApiKeyModal(false)}
        >
          <div
            style={{
              background: "var(--surface-raised)",
              borderRadius: 16,
              padding: 24,
              width: 400,
              maxWidth: "90vw",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>
              API Key Required
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.5 }}>
              Enter your Anthropic or OpenRouter API key to compile workflows. Your key stays in your browser.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-... or sk-or-..."
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: 14,
                border: "1px solid var(--border-default)",
                borderRadius: 8,
                marginBottom: 16,
                background: "var(--surface-default)",
                color: "var(--text-primary)",
              }}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button variant="outline" onClick={() => setShowApiKeyModal(false)}>
                Cancel
              </Button>
              <Button
                variant="accent"
                onClick={() => {
                  setShowApiKeyModal(false);
                  handleCompile();
                }}
                disabled={!apiKey}
              >
                Save & Compile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Node Config Modal */}
      {showNodeConfig && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowNodeConfig(null)}
        >
          <div
            style={{
              background: "var(--surface-raised)",
              borderRadius: 16,
              padding: 24,
              width: 480,
              maxWidth: "90vw",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                Configure Node
              </h3>
              <button
                onClick={() => setShowNodeConfig(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
              >
                <Icon name="X" size={20} style={{ color: "var(--text-muted)" }} />
              </button>
            </div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 16px" }}>
              Node configuration coming soon. For now, customize in n8n after importing.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="primary" onClick={() => setShowNodeConfig(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
