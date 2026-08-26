const { Button, Badge, StatTile, PipelineRail, StatusPill, Icon } = window.ProspectPALDesignSystem_b8251d;

function Hero({ onCheckout, onDemo }) {
  const [active, setActive] = React.useState(2);
  return (
    <section style={{ padding: "64px 32px 0", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
      <div style={{ textAlign: "center" }}>
        <Badge tone="brand" icon="shield-check" style={{ marginBottom: 22 }}>Approval-gated by default</Badge>
        <h1 style={{
          margin: "0 0 18px", fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "var(--text-display-1)", letterSpacing: "var(--tracking-display)",
          lineHeight: "var(--leading-tight)", textWrap: "balance",
        }}>
          Answer eight questions.<br />
          <span style={{ color: "var(--cobalt-600)" }}>Get a workflow you own.</span>
        </h1>
        <p style={{
          margin: "0 auto 30px", maxWidth: 660, fontSize: 19,
          lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)", textWrap: "pretty",
        }}>
          Prospect PAL gates your intake, resolves every tool to a concrete n8n node, and compiles a nine-node outbound engine that deploys to <em style={{ fontStyle: "normal", color: "var(--text-primary)", fontWeight: 500 }}>your</em> instance. Nothing sends without a human approval switch.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
          <Button variant="accent" size="lg" icon="zap" onClick={onCheckout}>Build my engine — $99/mo</Button>
          <Button variant="outline" size="lg" icon="play" onClick={onDemo}>See a compile, 2 min</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 44 }}>
          <StatTile value="9-node" label="Canonical graph" />
          <StatTile value="0" unit="deal collisions" label="CRM dedupe shield" tone="verified" />
          <StatTile value="3" unit="sentences" label="PAS email framework" tone="brand" />
          <StatTile value="100" unit="% BYOK" label="Your keys, your instance" tone="premium" />
        </div>
      </div>

      <div style={{
        background: "var(--surface-deep)", borderRadius: "var(--radius-2xl)",
        border: "1px solid var(--border-deep)", boxShadow: "var(--shadow-overlay)", overflow: "hidden",
      }}>
        <div style={{
          padding: "12px 18px", borderBottom: "1px solid var(--border-deep)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-caption)", color: "var(--ink-300)" }}>workflow.n8n.json · 9 nodes · approved</span>
          <StatusPill label="Graph compiled" onDeep />
        </div>
        <div style={{ padding: "22px 20px" }}>
          <PipelineRail nodes={window.NINE_NODES} activeIndex={active} onSelect={setActive} />
          <div style={{
            marginTop: 18, padding: "16px 18px", borderRadius: "var(--radius-lg)",
            background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-deep)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap",
          }}>
            <div style={{ maxWidth: 640 }}>
              <div style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-micro)", color: "var(--champagne-200)", marginBottom: 5 }}>
                NODE {String(active + 1).padStart(2, "0")} · {window.NINE_NODES[active].binding}
              </div>
              <div style={{ fontSize: "var(--text-body-sm)", color: "var(--ink-200)", lineHeight: "var(--leading-relaxed)" }}>
                <strong style={{ color: "var(--paper-0)", fontWeight: 600 }}>{window.NINE_NODES[active].title}</strong> — {window.NINE_NODES[active].subtitle}.
              </div>
            </div>
            <Button variant="inverse" icon="settings-2" onClick={onCheckout}>Configure this node</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Hero });
