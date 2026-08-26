"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AppStatus {
  appId:     string;
  connected: boolean;
  accountId: string | null;
}

interface N8nTestResult {
  connected:     boolean;
  workflowCount?: number;
  error?:        string;
}

const APPS = [
  { id: "apollo",     name: "Apollo",     emoji: "🏺", desc: "Lead discovery & contact search",   category: "Lead Source",    color: "#3B82F6" },
  { id: "hubspot",    name: "HubSpot",    emoji: "🔶", desc: "CRM sync & deduplication",          category: "CRM",            color: "#FF7A59" },
  { id: "salesforce", name: "Salesforce", emoji: "☁️", desc: "Enterprise CRM integration",        category: "CRM",            color: "#00A1E0" },
  { id: "slack",      name: "Slack",      emoji: "💬", desc: "Approval gate & daily summaries",   category: "Notifications",  color: "#4ADE80" },
  { id: "gmail",      name: "Gmail",      emoji: "📧", desc: "Email sending fallback",            category: "Sequencer",      color: "#EA4335" },
  { id: "linkedin",   name: "LinkedIn",   emoji: "💼", desc: "Professional network prospecting",  category: "Lead Source",    color: "#0077B5" },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function SettingsView() {
  const [statuses,       setStatuses]       = useState<AppStatus[]>([]);
  const [composioReady,  setComposioReady]  = useState<boolean | null>(null); // null = loading
  const [connecting,     setConnecting]     = useState<string | null>(null);  // appId being connected

  // n8n instance state
  const [n8nUrl,         setN8nUrl]         = useState("");
  const [n8nApiKey,      setN8nApiKey]      = useState("");
  const [n8nTest,        setN8nTest]        = useState<N8nTestResult | null>(null);
  const [n8nTesting,     setN8nTesting]     = useState(false);
  const [n8nSaved,       setN8nSaved]       = useState(false);

  // ── Load connection statuses ────────────────────────────────────────────────
  const loadStatuses = useCallback(async () => {
    try {
      const res  = await fetch("/api/composio/status");
      const data = await res.json() as { configured: boolean; statuses: AppStatus[] };
      setComposioReady(data.configured);
      setStatuses(data.statuses || []);
    } catch {
      setComposioReady(false);
      setStatuses(APPS.map((a) => ({ appId: a.id, connected: false, accountId: null })));
    }
  }, []);

  useEffect(() => {
    loadStatuses();
    // Load saved n8n config from localStorage
    setN8nUrl(localStorage.getItem("ppal_n8n_url") || "");
    setN8nApiKey(localStorage.getItem("ppal_n8n_key") || "");
  }, [loadStatuses]);

  // ── Listen for OAuth popup callback ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "composio_callback") {
        setConnecting(null);
        if (e.data.success) loadStatuses(); // refresh statuses
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [loadStatuses]);

  // ── Connect via Composio OAuth ─────────────────────────────────────────────
  const connectApp = async (appId: string) => {
    setConnecting(appId);
    try {
      const res  = await fetch("/api/composio/connect", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ appId }),
      });
      const data = await res.json() as { redirectUrl?: string; error?: string };
      if (data.error) { alert(data.error); setConnecting(null); return; }
      if (data.redirectUrl) {
        // Open OAuth flow in a popup
        const w = 600, h = 700;
        const left = window.screen.width  / 2 - w / 2;
        const top  = window.screen.height / 2 - h / 2;
        window.open(
          data.redirectUrl,
          `composio_oauth_${appId}`,
          `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`
        );
      }
    } catch {
      alert("Connection failed — please try again");
      setConnecting(null);
    }
  };

  // ── Test n8n connection ─────────────────────────────────────────────────────
  const testN8n = async () => {
    if (!n8nUrl || !n8nApiKey) return;
    setN8nTesting(true); setN8nTest(null);
    try {
      const params = new URLSearchParams({ url: n8nUrl, key: n8nApiKey });
      const res    = await fetch(`/api/n8n/push?${params}`);
      const data   = await res.json() as N8nTestResult;
      setN8nTest(data);
    } catch {
      setN8nTest({ connected: false, error: "Network error" });
    } finally {
      setN8nTesting(false);
    }
  };

  const saveN8nConfig = () => {
    localStorage.setItem("ppal_n8n_url", n8nUrl);
    localStorage.setItem("ppal_n8n_key", n8nApiKey);
    setN8nSaved(true);
    setTimeout(() => setN8nSaved(false), 2000);
  };

  const statusFor = (id: string) => statuses.find((s) => s.appId === id);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ overflowY: "auto", height: "100%", padding: "32px", maxWidth: 860, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#111", letterSpacing: "-0.4px", margin: "0 0 4px" }}>
          Integrations
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
          Connect your tools via Composio OAuth — no API keys to copy-paste.
        </p>
      </div>

      {/* Composio status banner */}
      <div style={{
        background: composioReady ? "#f0f9f0" : "#fffbeb",
        border: `1px solid ${composioReady ? "#bce3bc" : "#fde68a"}`,
        borderRadius: 12, padding: "14px 18px", marginBottom: 28,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ fontSize: 20 }}>{composioReady ? "🔗" : composioReady === null ? "⏳" : "⚙️"}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
            {composioReady === null ? "Checking Composio..." :
             composioReady ? "Composio OAuth Active" :
             "Composio Not Configured"}
          </div>
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
            {composioReady
              ? "OAuth-managed connections — your credentials are never stored on our servers"
              : "Add COMPOSIO_API_KEY to your environment to enable one-click OAuth connections"}
          </div>
        </div>
        {composioReady && (
          <span style={{
            fontSize: 11, fontWeight: 700, color: "#2033A2",
            background: "#dcf0dc", padding: "3px 10px", borderRadius: 100,
          }}>● Active</span>
        )}
      </div>

      {/* Tool Integrations */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
          Tool Connections
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {APPS.map((app) => {
            const status   = statusFor(app.id);
            const isConnected  = status?.connected ?? false;
            const isConnecting = connecting === app.id;

            return (
              <div key={app.id} style={{
                background: "white", border: `1px solid ${isConnected ? "#bce3bc" : "#eceae4"}`,
                borderRadius: 14, padding: "18px 20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "border-color 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: app.color + "18",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                    }}>{app.emoji}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{app.name}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{app.category}</div>
                    </div>
                  </div>
                  {isConnected && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: "#2033A2",
                      background: "#f0f9f0", padding: "3px 10px", borderRadius: 100,
                      border: "1px solid #bce3bc",
                    }}>✓ Connected</span>
                  )}
                </div>

                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 14 }}>{app.desc}</div>

                <button
                  onClick={() => isConnected ? null : connectApp(app.id)}
                  disabled={isConnecting || !composioReady || isConnected}
                  style={{
                    width: "100%", padding: "9px", fontSize: 13, fontWeight: 700,
                    borderRadius: 8, border: "none", cursor: (isConnecting || isConnected) ? "default" : "pointer",
                    background: isConnected ? "#f4f3ef" : isConnecting ? "#2A41C9" : "#2033A2",
                    color: isConnected ? "#9CA3AF" : "white",
                    fontFamily: "inherit",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    transition: "background 0.2s",
                  }}
                >
                  {isConnecting
                    ? <><Spinner /> Connecting...</>
                    : isConnected
                    ? "✓ Connected"
                    : composioReady
                    ? `Connect ${app.name} →`
                    : "Set up Composio first"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* n8n Instance Config */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
          n8n Instance — Push Workflows Directly
        </div>
        <div style={{
          background: "white", border: "1px solid #eceae4",
          borderRadius: 14, padding: "22px 24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#ff6d5a18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⚡</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>n8n Workspace</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>After building a workflow, push it directly into your n8n canvas</div>
            </div>
            {n8nTest?.connected && (
              <span style={{
                marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#2033A2",
                background: "#f0f9f0", padding: "3px 10px", borderRadius: 100, border: "1px solid #bce3bc",
              }}>✓ {n8nTest.workflowCount} workflows</span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                n8n Instance URL
              </label>
              <input
                type="url"
                value={n8nUrl}
                onChange={(e) => setN8nUrl(e.target.value)}
                placeholder="https://myinstance.app.n8n.cloud"
                style={{
                  width: "100%", padding: "10px 14px", fontSize: 13,
                  border: "1.5px solid #e5e5e0", borderRadius: 8,
                  outline: "none", fontFamily: "monospace", color: "#111",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "#2033A2"}
                onBlur={(e)  => e.target.style.borderColor = "#e5e5e0"}
              />
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                Self-hosted: http://localhost:5678 · Cloud: https://yourname.app.n8n.cloud
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                n8n API Key
              </label>
              <input
                type="password"
                value={n8nApiKey}
                onChange={(e) => setN8nApiKey(e.target.value)}
                placeholder="n8n_api_..."
                style={{
                  width: "100%", padding: "10px 14px", fontSize: 13,
                  border: "1.5px solid #e5e5e0", borderRadius: 8,
                  outline: "none", fontFamily: "monospace", color: "#111",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "#2033A2"}
                onBlur={(e)  => e.target.style.borderColor = "#e5e5e0"}
              />
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                In n8n: Settings → API → Create API key
              </div>
            </div>

            {n8nTest && !n8nTest.connected && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#dc2626" }}>
                ✗ {n8nTest.error || "Connection failed"}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button
                onClick={testN8n}
                disabled={n8nTesting || !n8nUrl || !n8nApiKey}
                style={{
                  padding: "9px 18px", fontSize: 13, fontWeight: 600,
                  color: "#2033A2", background: "white",
                  border: "1.5px solid #2033A2", borderRadius: 8,
                  cursor: (!n8nUrl || !n8nApiKey || n8nTesting) ? "not-allowed" : "pointer",
                  fontFamily: "inherit", opacity: (!n8nUrl || !n8nApiKey) ? 0.4 : 1,
                }}
              >
                {n8nTesting ? "Testing..." : "Test Connection"}
              </button>
              <button
                onClick={saveN8nConfig}
                disabled={!n8nUrl || !n8nApiKey}
                style={{
                  padding: "9px 18px", fontSize: 13, fontWeight: 700,
                  color: "white", background: n8nSaved ? "#2A41C9" : "#2033A2",
                  border: "none", borderRadius: 8,
                  cursor: (!n8nUrl || !n8nApiKey) ? "not-allowed" : "pointer",
                  fontFamily: "inherit", opacity: (!n8nUrl || !n8nApiKey) ? 0.4 : 1,
                }}
              >
                {n8nSaved ? "✓ Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Security note */}
      <div style={{
        background: "#fafaf8", border: "1px solid #eceae4",
        borderRadius: 12, padding: "14px 18px",
      }}>
        <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
          🔒 <strong style={{ color: "#6B7280" }}>Security:</strong> OAuth tokens are managed by Composio and never stored on Prospect PAL servers.
          Your n8n API key is stored only in your browser (localStorage) and sent directly to your instance.
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span style={{
      width: 13, height: 13,
      border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white",
      borderRadius: "50%", display: "inline-block",
      animation: "spin 0.7s linear infinite",
    }} />
  );
}
