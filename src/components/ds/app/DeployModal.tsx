import { useState } from "react";
import { Button, Card, Icon } from "@/components/ds";

interface DeployModalProps {
  workflowJson: any;
  isOpen: boolean;
  onClose: () => void;
  onDeploySuccess: (result: any) => void;
}

export function DeployModal({ workflowJson, isOpen, onClose, onDeploySuccess }: DeployModalProps) {
  const [instanceUrl, setInstanceUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDeploy = async () => {
    if (!instanceUrl) {
      setError("Please provide an n8n instance URL");
      return;
    }

    setIsDeploying(true);
    setError(null);

    try {
      const res = await fetch("/api/n8n/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instanceUrl,
          apiKey,
          workflowJson,
          workflowName: "Prospect PAL Output",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to deploy workflow");
      }

      onDeploySuccess(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div style={{ width: 440 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: "var(--text-h3)" }}>Deploy to n8n</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>
              &times;
            </button>
          </div>
          
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: 24 }}>
            Instantly push this automation to your n8n workspace.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", marginBottom: 8 }}>
                Instance URL
              </label>
              <input
                type="url"
                value={instanceUrl}
                onChange={(e) => setInstanceUrl(e.target.value)}
                placeholder="https://n8n.yourcompany.com"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-base)",
                  fontSize: "var(--text-sm)",
                  fontFamily: "inherit",
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", marginBottom: 8 }}>
                API Key (Optional)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="n8n_api_key_..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-base)",
                  fontSize: "var(--text-sm)",
                  fontFamily: "inherit",
                }}
              />
              <p style={{ fontSize: "var(--text-micro)", color: "var(--text-muted)", marginTop: 4 }}>
                Requires Workflows:write scope in n8n. If left blank, prepares a sync payload instead.
              </p>
            </div>
          </div>

          {error && (
            <div style={{ marginTop: 16, padding: 12, backgroundColor: "var(--color-danger-subtle)", color: "var(--color-danger)", borderRadius: "var(--radius-sm)", fontSize: "var(--text-sm)" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Button variant="outline" onClick={onClose} disabled={isDeploying}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDeploy} disabled={isDeploying}>
              {isDeploying ? "Deploying..." : "Push to n8n"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
