const { Card, Badge, Button, DeliverableCard, StatusPill, Icon, IntegrationCard } = window.ProspectPALDesignSystem_b8251d;

const ACK = `{
  "artifact_type": "pae-compile-ack",
  "run_id": "pae_9f21c",
  "status": "approved",
  "resolved_bindings": [
    { "capability": "crm-read-write",
      "concrete_binding": "n8n-nodes-base.hubspot",
      "auth_mode": "OAuth2", "already_connected": true },
    { "capability": "contact-enrichment",
      "concrete_binding": "httpRequest → apollo.io",
      "auth_mode": "API key", "already_connected": false }
  ],
  "workflow": { "node_count": 9 },
  "requires_connection": ["ENV:CLAY_API_KEY", "ENV:SMARTLEAD_API_KEY"],
  "next_actions": ["review_workflow", "edit_intake", "connect_and_deploy"]
}`;

function OutputsScreen({ onDeploy }) {
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "26px 32px 40px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
              <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", fontWeight: 700, letterSpacing: "var(--tracking-display)" }}>Compile approved</h1>
              <StatusPill label="9 nodes · quality checks passed" />
            </div>
            <p style={{ margin: 0, fontSize: "var(--text-body-sm)", color: "var(--text-secondary)" }}>Two credentials still need connecting. You can deploy now and wire them in n8n, or connect first.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="outline" icon="download">Download JSON</Button>
            <Button variant="accent" icon="rocket" onClick={onDeploy}>Connect & deploy</Button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16, marginBottom: 18 }}>
          <Card pad={0} style={{ overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-hairline)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-caption)", color: "var(--text-brand)" }}>ack.json</span>
              <Badge tone="verified" icon="check">approved</Badge>
            </div>
            <pre style={{ margin: 0, padding: "14px 16px", fontFamily: "var(--font-data)", fontSize: 11.5, lineHeight: 1.65, color: "var(--ink-700)", background: "var(--surface-sunken)", overflowX: "auto" }}>{ACK}</pre>
          </Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Card pad={18}>
              <div style={{ fontSize: "var(--text-eyebrow)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "var(--tracking-eyebrow)", color: "var(--text-muted)", marginBottom: 10 }}>Requires connection</div>
              {["ENV:CLAY_API_KEY", "ENV:SMARTLEAD_API_KEY"].map((k) => (
                <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-hairline)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-data)", fontSize: "var(--text-caption)", color: "var(--ink-700)" }}>
                    <Icon name="key-round" size={13} color="var(--signal-attention)" />{k}
                  </span>
                  <Button variant="ghost" size="sm" iconRight="arrow-up-right">Connect</Button>
                </div>
              ))}
            </Card>
            <IntegrationCard name="HubSpot" capability="crm-read-write" description="OAuth2 connected · dedupe + upsert" connected />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <DeliverableCard file="workflow.n8n.json" badge="Import ready" label="Production workflow" description="Nine wired nodes with error catchers and expressions." />
          <DeliverableCard file="BUILD_PROMPT.md" badge="Documentation" label="Deploy checklist" description="Every ENV var and OAuth flow still to wire, in order." />
          <DeliverableCard file="email-framework.md" badge="Copywriting" label="3-sentence PAS scripts" description="Problem-agitate-solve templates with variable maps." />
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { OutputsScreen });
