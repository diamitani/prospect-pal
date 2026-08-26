const { SectionHeading, IntegrationCard, DeliverableCard, LeadSignalCard, PricingCard, Button, Badge, Icon } = window.ProspectPALDesignSystem_b8251d;

const TOOLS = [
  { name: "HubSpot", capability: "crm-read-write", description: "Dedupe shield and contact upsert", icon: "database", connected: true },
  { name: "Salesforce", capability: "crm-read-write", description: "Enterprise pipeline protection", icon: "cloud" },
  { name: "Apollo.io", capability: "contact-enrichment", description: "Verified decision-maker reveal", icon: "search", connected: true },
  { name: "Clay", capability: "contact-enrichment", description: "Waterfall company enrichment", icon: "layers" },
  { name: "Smartlead", capability: "sequencer", description: "Multi-inbox warmup and sending", icon: "send" },
  { name: "Instantly", capability: "sequencer", description: "High-volume cold sequencing", icon: "mail" },
  { name: "Anthropic Claude", capability: "llm-inference", description: "Research and PAS copywriting", icon: "sparkles", connected: true },
  { name: "Slack", capability: "approval-gate", description: "One-click human review", icon: "message-square" },
  { name: "n8n", capability: "deploy-target", description: "Your own cloud or self-hosted instance", icon: "workflow" },
];

const DELIVERABLES = [
  { file: "workflow.n8n.json", badge: "Import ready", label: "Production workflow", description: "Nine wired nodes with error catchers, expressions and sub-workflow hooks." },
  { file: "BUILD_PROMPT.md", badge: "Documentation", label: "Deploy checklist", description: "Every credential and ENV var still to wire, in the order you'll need them." },
  { file: ".env.template", badge: "Security", label: "Zero hard-coded secrets", description: "Providers referenced by ENV name only — no key ever leaves your browser." },
  { file: "email-framework.md", badge: "Copywriting", label: "3-sentence PAS scripts", description: "Problem-agitate-solve templates with dynamic variable mappings." },
  { file: "PRD.md", badge: "Strategy", label: "Pipeline specification", description: "ICP matrix, data dictionary, bounce guardrails and compliance rules." },
  { file: "ack.json", badge: "API contract", label: "Compile receipt", description: "Run status, resolved bindings and every requires_connection flag." },
];

function Integrations() {
  return (
    <section id="architecture" style={{ padding: "72px 32px", background: "var(--surface-sunken)", borderTop: "1px solid var(--border-hairline)", borderBottom: "1px solid var(--border-hairline)", marginTop: 72 }}>
      <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <SectionHeading eyebrow="Resolved bindings" title="Every capability maps to a real node" description="You pick the provider. The compiler resolves the capability to a concrete n8n node and tells you exactly which credentials remain." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 36 }}>
          {TOOLS.map((t) => <IntegrationCard key={t.name} {...t} />)}
        </div>
      </div>
    </section>
  );
}

function Deliverables() {
  return (
    <section id="deliverables" style={{ padding: "80px 32px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
      <SectionHeading eyebrow="Production artifacts" title="What a compile hands you" description="Six files, versioned per run. Read them before anything touches your CRM." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 36 }}>
        {DELIVERABLES.map((d) => <DeliverableCard key={d.file} {...d} />)}
      </div>
    </section>
  );
}

function Signals() {
  const leads = [
    { company: "NexusFlow Data", round: "Series A · $12M", stack: ["n8n self-hosted", "HubSpot", "Apollo"], trigger: "Hiring GTM Automation Engineer", contact: "Marcus Vance, VP RevOps" },
    { company: "HyperScale AI", round: "Series B · $28M", stack: ["n8n cloud", "Salesforce", "Clay", "Smartlead"], trigger: "Hiring Head of Outbound Growth", contact: "Elena Rostova, Head of Growth" },
    { company: "CloudPulse Systems", round: "Seed · $4.5M", stack: ["n8n self-hosted", "Attio", "Instantly"], trigger: "Hiring Founding GTM Specialist", contact: "Devon Chen, Co-founder" },
  ];
  return (
    <section id="signals" style={{ padding: "80px 32px", background: "var(--surface-deep)" }}>
      <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <SectionHeading align="left" onDeep eyebrow="Tech stack intelligence" title="Leads that already run n8n" description="Stack detection plus hiring intent, so your first line writes itself."
          action={<Button variant="inverse" iconRight="arrow-up-right">Access live signals</Button>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 34 }}>
          {leads.map((l) => <LeadSignalCard key={l.company} {...l} />)}
        </div>
      </div>
    </section>
  );
}

function Pricing({ onCheckout }) {
  return (
    <section id="pricing" style={{ padding: "84px 32px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
      <SectionHeading eyebrow="Transparent plans" title="Compile once. Run it forever." description="Bring your own keys. No per-lead markup, no vendor lock-in." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 40, alignItems: "start" }}>
        <PricingCard name="DIY build package" price="$19.99" note="One-time download"
          description="For engineers who want the prompts, the blueprint and the JSON, and will wire it themselves."
          features={["Canonical 9-node workflow JSON", "Full prompt suite & variable schema", "Self-hosted Docker guide", "PAS email template suite", ".env.template & credential map"]}
          cta={<Button variant="outline" fullWidth onClick={onCheckout}>Get the package</Button>} />
        <PricingCard featured name="Pro unlimited engine" price="$99" cadence="/ month" note="Cancel anytime · BYOK"
          description="The full architect: unlimited compiles, live node canvas, execution triage and signal leads."
          features={["Unlimited campaign compiles", "Live 9-node canvas", "Connect & deploy to your n8n", "Execution error triage", "A/B PAS scripts studio", "Slack one-click approval gates"]}
          cta={<Button variant="accent" fullWidth icon="zap" onClick={onCheckout}>Start Pro</Button>} />
        <PricingCard tone="sunken" name="Custom architecture" price="$999+" note="White-glove engagement"
          description="Custom waterfalls, sub-workflows, CRM cleansing and private infrastructure, built with you."
          features={["Dedicated GTM systems engineer", "Custom Clay & Apollo waterfalls", "Legacy CRM dedupe audit", "Custom sub-workflows & webhooks", "Private support channel"]}
          cta={<Button variant="outline" fullWidth onClick={onCheckout}>Request a build</Button>} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "var(--text-caption)", color: "var(--text-secondary)" }}>
          <Icon name="shield-check" size={15} color="var(--signal-verified)" />
          We never store an API key, and we never send an email on your behalf during setup.
        </span>
      </div>
    </section>
  );
}
Object.assign(window, { Integrations, Deliverables, Signals, Pricing });
