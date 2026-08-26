const { StatTile, Card, Button, PipelineRail, Badge } = window.ProspectPALDesignSystem_b8251d;

const ACTIONS = [
  { id: "builder", icon: "workflow", title: "Workflow Builder", desc: "Chat or form intake, compiled to a 9-node graph", primary: true },
  { id: "wizard", icon: "wand-sparkles", title: "Intake Wizard", desc: "Eight gated steps: trigger, CRM, outreach, approval" },
  { id: "outputs", icon: "package", title: "Outputs & Deploy", desc: "Ack JSON, workflow.json, BUILD_PROMPT.md" },
  { id: "signals", icon: "radio", title: "Tech Signals", desc: "Companies running n8n and hiring GTM engineers" },
];

function DashboardScreen({ onView }) {
  const { Icon } = window.ProspectPALDesignSystem_b8251d;
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px 40px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", fontWeight: 700, letterSpacing: "var(--tracking-display)" }}>Good afternoon, Alex</h1>
          <Badge tone="premium" icon="key-round">BYOK workspace</Badge>
        </div>
        <p style={{ margin: "0 0 24px", fontSize: "var(--text-body-sm)", color: "var(--text-secondary)" }}>
          Your last compile is approved and waiting to deploy to <span style={{ fontFamily: "var(--font-data)" }}>acme.n8n.cloud</span>.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 26 }}>
          <StatTile value="9-node" label="Canonical graph" />
          <StatTile value="100" unit="% guard" label="Dedupe accuracy" tone="verified" />
          <StatTile value="4" unit="engines" label="Compiled this month" tone="brand" />
          <StatTile value="2" unit="pending" label="Connections needed" tone="premium" />
        </div>

        <div style={{ fontSize: "var(--text-eyebrow)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "var(--tracking-eyebrow)", color: "var(--text-muted)", marginBottom: 10 }}>Workspace</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 26 }}>
          {ACTIONS.map((a) => (
            <Card key={a.id} interactive pad={20} onClick={() => onView(a.id)}
              tone={a.primary ? "accent" : "paper"}
              style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{
                width: 38, height: 38, borderRadius: "var(--radius-md)", flexShrink: 0,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: a.primary ? "var(--cobalt-600)" : "var(--surface-sunken)",
                color: a.primary ? "var(--paper-0)" : "var(--ink-600)",
              }}><Icon name={a.icon} size={19} /></span>
              <span>
                <span style={{ display: "block", fontSize: "var(--text-h4)", fontWeight: 600, marginBottom: 3 }}>{a.title}</span>
                <span style={{ display: "block", fontSize: "var(--text-caption)", color: "var(--text-secondary)", lineHeight: "var(--leading-normal)" }}>{a.desc}</span>
              </span>
            </Card>
          ))}
        </div>

        <Card pad={22}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: "var(--text-h3)", fontWeight: 600, letterSpacing: "var(--tracking-heading)" }}>The canonical 9-node architecture</div>
              <div style={{ fontSize: "var(--text-caption)", color: "var(--text-secondary)", marginTop: 3 }}>Every compiled engine specialises this graph — only the bindings change.</div>
            </div>
            <Button variant="primary" icon="workflow" onClick={() => onView("builder")}>Open builder</Button>
          </div>
          <PipelineRail nodes={window.NINE_NODES.slice(0, 5)} activeIndex={-1} onDeep={false} />
        </Card>
      </div>
    </div>
  );
}
Object.assign(window, { DashboardScreen });
