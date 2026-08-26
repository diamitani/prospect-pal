const { Card, Badge, Button, Input, Label, StatusPill, Icon, IntegrationCard } = window.ProspectPALDesignSystem_b8251d;

const APPS = [
  { name: "Apollo", icon: "search", capability: "contact-enrichment", description: "Lead discovery & contact search", connected: true },
  { name: "HubSpot", icon: "database", capability: "crm-read-write", description: "CRM sync & deduplication", connected: true },
  { name: "Salesforce", icon: "cloud", capability: "crm-read-write", description: "Enterprise CRM integration" },
  { name: "Slack", icon: "message-square", capability: "approval-gate", description: "Approval gate & daily summaries", connected: true },
  { name: "Gmail", icon: "mail", capability: "sequencer", description: "Email sending fallback" },
  { name: "LinkedIn", icon: "linkedin", capability: "lead-source", description: "Professional network prospecting" },
];

function SettingsScreen() {
  const [saved, setSaved] = React.useState(false);
  const [tested, setTested] = React.useState(false);
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px 40px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 4px", fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", fontWeight: 700, letterSpacing: "var(--tracking-display)" }}>Integrations & keys</h1>
        <p style={{ margin: "0 0 22px", fontSize: "var(--text-body-sm)", color: "var(--text-secondary)" }}>Connect your tools over OAuth — no API keys to copy-paste.</p>

        <Card tone="accent" pad={16} style={{ marginBottom: 26, display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="link-2" size={18} color="var(--cobalt-700)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "var(--text-h4)", fontWeight: 600 }}>OAuth broker active</div>
            <div style={{ fontSize: "var(--text-caption)", color: "var(--text-secondary)", marginTop: 2 }}>
              Connections are OAuth-managed. Credentials are never stored on Prospect PAL servers.
            </div>
          </div>
          <StatusPill label="Active" tone="brand" />
        </Card>

        <div style={{ fontSize: "var(--text-eyebrow)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "var(--tracking-eyebrow)", color: "var(--text-muted)", marginBottom: 12 }}>Tool connections</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 30 }}>
          {APPS.map((a) => (
            <div key={a.name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <IntegrationCard {...a} />
              <Button variant={a.connected ? "ghost" : "outline"} size="sm" fullWidth icon={a.connected ? "check" : "plug"} disabled={a.connected}>
                {a.connected ? "Connected" : "Connect " + a.name}
              </Button>
            </div>
          ))}
        </div>

        <div style={{ fontSize: "var(--text-eyebrow)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "var(--tracking-eyebrow)", color: "var(--text-muted)", marginBottom: 12 }}>n8n instance — push workflows directly</div>
        <Card pad={22} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span style={{ width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--surface-sunken)", color: "var(--ink-600)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="workflow" size={19} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "var(--text-h4)", fontWeight: 600 }}>n8n workspace</div>
              <div style={{ fontSize: "var(--text-caption)", color: "var(--text-secondary)" }}>After a compile, push the workflow straight into your canvas.</div>
            </div>
            {tested ? <Badge tone="verified" icon="check">12 workflows</Badge> : null}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <Label>Instance URL</Label>
              <Input icon="link" mono value="https://acme.app.n8n.cloud" />
              <div style={{ fontSize: "var(--text-micro)", color: "var(--text-muted)", marginTop: 5, fontFamily: "var(--font-data)" }}>self-hosted: http://localhost:5678 · cloud: https://name.app.n8n.cloud</div>
            </div>
            <div>
              <Label hint="browser only, never our storage">API key</Label>
              <Input icon="key-round" mono type="password" value="••••••••••••••••" />
              <div style={{ fontSize: "var(--text-micro)", color: "var(--text-muted)", marginTop: 5 }}>In n8n: Settings → API → Create API key</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="outline" icon="activity" onClick={() => setTested(true)}>Test connection</Button>
              <Button variant="primary" icon={saved ? "check" : "save"} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800); }}>{saved ? "Saved" : "Save"}</Button>
            </div>
          </div>
        </Card>

        <Card tone="sunken" pad={16} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon name="lock" size={15} color="var(--text-muted)" />
          <p style={{ margin: 0, fontSize: "var(--text-caption)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
            <strong style={{ fontWeight: 600, color: "var(--ink-700)" }}>Security.</strong> OAuth tokens are held by the broker, never on Prospect PAL servers. Your n8n API key lives in your browser only and is sent directly to your instance.
          </p>
        </Card>
      </div>
    </div>
  );
}
Object.assign(window, { SettingsScreen });
