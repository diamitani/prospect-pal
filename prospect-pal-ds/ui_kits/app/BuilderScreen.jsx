const { Button, Input, Select, Textarea, Label, ChatBubble, TypingDots, PipelineRail, NodeCard, StatusPill, Badge, Icon } = window.ProspectPALDesignSystem_b8251d;

function BuilderScreen({ onCompiled }) {
  const [tab, setTab] = React.useState("chat");
  const [msgs, setMsgs] = React.useState([
    { role: "assistant", text: "I'm your GTM automation architect. Tell me who you sell to, which tools hold your data, and how leads should enter the system." },
  ]);
  const [draft, setDraft] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const [active, setActive] = React.useState(2);
  const [crm, setCrm] = React.useState("hubspot");
  const [compiling, setCompiling] = React.useState(false);

  const send = () => {
    if (!draft.trim()) return;
    const next = [...msgs, { role: "user", text: draft.trim() }];
    setMsgs(next); setDraft(""); setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMsgs([...next, { role: "assistant", text: "Understood. I've bound CRM dedupe to HubSpot (OAuth2) and enrichment to Apollo (API key). Two credentials still need connecting — compile when you're ready." }]);
    }, 1100);
  };

  const compile = () => { setCompiling(true); setTimeout(() => { setCompiling(false); onCompiled(); }, 1200); };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <div style={{ width: "var(--layout-pane)", flexShrink: 0, background: "var(--surface-card)", borderRight: "1px solid var(--border-hairline)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-hairline)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "var(--text-h4)", fontWeight: 700 }}>PAE workflow compiler</div>
            <div style={{ fontSize: "var(--text-micro)", color: "var(--text-muted)" }}>PAL intake gate · 9-node reference pattern</div>
          </div>
          <div style={{ display: "flex", background: "var(--surface-sunken)", padding: 3, borderRadius: "var(--radius-sm)" }}>
            {[["chat", "Chat"], ["form", "Form"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} style={{
                padding: "4px 11px", fontSize: "var(--text-micro)", fontWeight: 600, cursor: "pointer",
                border: "none", borderRadius: "var(--radius-xs)", fontFamily: "inherit",
                background: tab === id ? "var(--surface-card)" : "transparent",
                color: tab === id ? "var(--text-brand)" : "var(--text-muted)",
                boxShadow: tab === id ? "var(--shadow-hairline)" : "none",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {tab === "chat" ? (
          <React.Fragment>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              {msgs.map((m, i) => <ChatBubble key={i} role={m.role}>{m.text}</ChatBubble>)}
              {thinking ? <TypingDots label="Resolving tool bindings" /> : null}
            </div>
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-hairline)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <Input value={draft} onChange={setDraft} onSubmitKey={send} placeholder="e.g. VP Sales at Series A SaaS, HubSpot + Apollo…" />
                <Button variant="primary" onClick={send} icon="arrow-up">Send</Button>
              </div>
              <Button variant="accent" fullWidth icon="zap" onClick={compile} disabled={compiling}>
                {compiling ? "Compiling engine…" : "Compile GTM engine"}
              </Button>
            </div>
          </React.Fragment>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div><Label step={1} hint="no gate">Ingestion trigger</Label>
              <Select value="schedule" options={[{ value: "schedule", label: "Daily cron (schedule trigger)" }, { value: "csv", label: "Spreadsheet upload" }, { value: "webhook", label: "Live intent webhook" }]} /></div>
            <div><Label step={2} hint="hard gate">CRM shield</Label>
              <Select value={crm} onChange={setCrm} options={[{ value: "hubspot", label: "HubSpot CRM (OAuth2)" }, { value: "salesforce", label: "Salesforce (OAuth2)" }, { value: "attio", label: "Attio (API key)" }]} /></div>
            <div><Label step={3} hint="hard gate">Data & enrichment</Label>
              <Select value="apollo" options={[{ value: "apollo", label: "Apollo.io (API key)" }, { value: "clay", label: "Clay waterfall (API key)" }]} /></div>
            <div><Label step={4} hint="hard gate">Deploy target</Label>
              <Input icon="link" mono value="https://acme.n8n.cloud" /></div>
            <div><Label step={5}>Target ICP & titles</Label>
              <Textarea rows={3} placeholder="VP of Sales, Head of RevOps at US B2B SaaS, 50–500 employees…" /></div>
            <Button variant="accent" fullWidth icon="zap" onClick={compile}>Generate & compile engine</Button>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--surface-deep)", minWidth: 0 }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border-deep)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-caption)", color: "var(--ink-300)" }}>prospect-pal-engine.json</span>
            <StatusPill label="9-node graph connected" onDeep />
          </div>
          <Badge tone="deep" mono shape="square">trigger: SCHEDULE</Badge>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "22px 20px" }}>
          <PipelineRail nodes={window.NINE_NODES} activeIndex={active} onSelect={setActive} />
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
            <div style={{ background: "var(--surface-deep-raised)", border: "1px solid var(--border-deep)", borderRadius: "var(--radius-xl)", padding: "18px 20px" }}>
              <div style={{ fontSize: "var(--text-eyebrow)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "var(--tracking-eyebrow)", color: "var(--champagne-200)", marginBottom: 6 }}>
                Node {String(active + 1).padStart(2, "0")} specification
              </div>
              <div style={{ fontSize: "var(--text-h3)", fontWeight: 600, color: "var(--paper-0)", marginBottom: 6 }}>{window.NINE_NODES[active].title}</div>
              <p style={{ margin: 0, fontSize: "var(--text-body-sm)", color: "var(--ink-300)", lineHeight: "var(--leading-relaxed)" }}>
                {window.NINE_NODES[active].subtitle}. Bound to <span style={{ fontFamily: "var(--font-data)", color: "var(--ink-100)" }}>{window.NINE_NODES[active].binding}</span>. Secrets stay as ENV references; nothing is written to Prospect PAL.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <NodeCard step={6} stage="logic" icon="scale" title="Approval switch" subtitle="Always present — no silent sends" />
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-deep)", borderRadius: "var(--radius-lg)", padding: "12px 14px" }}>
                <div style={{ fontSize: "var(--text-micro)", color: "var(--ink-400)", textTransform: "uppercase", letterSpacing: "var(--tracking-eyebrow)", fontWeight: 600, marginBottom: 8 }}>Requires connection</div>
                {["ENV:CLAY_API_KEY", "ENV:SMARTLEAD_API_KEY"].map((k) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--font-data)", fontSize: "var(--text-micro)", color: "var(--ink-200)", marginBottom: 5 }}>
                    <Icon name="key-round" size={12} color="var(--champagne-300)" />{k}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { BuilderScreen });
