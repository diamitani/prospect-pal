const { LeadSignalCard, Select, Label, Button, Badge, Icon, Card } = window.ProspectPALDesignSystem_b8251d;

const LEADS = [
  { company: "NexusFlow Data", domain: "nexusflow.io · Data infra · 84 emp", round: "Series A · $12M",
    stack: ["n8n self-hosted", "HubSpot", "Apollo"], trigger: "Hiring GTM Automation Engineer — job posted 6 days ago",
    contact: "Marcus Vance, VP RevOps" },
  { company: "HyperScale AI", domain: "hyperscale.ai · AI tooling · 210 emp", round: "Series B · $28M",
    stack: ["n8n cloud", "Salesforce", "Clay", "Smartlead"], trigger: "Hiring Head of Outbound Growth — 2 open roles",
    contact: "Elena Rostova, Head of Growth" },
  { company: "CloudPulse Systems", domain: "cloudpulse.dev · DevOps · 31 emp", round: "Seed · $4.5M",
    stack: ["n8n self-hosted", "Attio", "Instantly"], trigger: "Hiring Founding GTM Specialist — posted this week",
    contact: "Devon Chen, Co-founder" },
  { company: "Lattice Freight", domain: "latticefreight.com · Logistics · 140 emp", round: "Series A · $9M",
    stack: ["n8n cloud", "HubSpot", "Lemlist"], trigger: "Hiring RevOps Manager — replacing manual prospecting",
    contact: "Priya Raman, Director of Revenue" },
  { company: "Northgate Health", domain: "northgate.health · Health SaaS · 320 emp", round: "Series C · $55M",
    stack: ["n8n self-hosted", "Salesforce", "ZoomInfo"], trigger: "Hiring Automation Engineer, GTM — team of 3",
    contact: "Tom Werner, VP Revenue Ops" },
  { company: "Silverline Labs", domain: "silverline.dev · Dev tools · 22 emp", round: "Pre-seed · $1.8M",
    stack: ["n8n self-hosted", "Attio", "Apollo"], trigger: "Founder running outbound solo — n8n detected 3 weeks ago",
    contact: "Ana Duarte, Co-founder & CEO" },
];

function SignalsScreen() {
  const [copied, setCopied] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "18px 32px", background: "var(--surface-card)", borderBottom: "1px solid var(--border-hairline)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
              <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", fontWeight: 700, letterSpacing: "var(--tracking-heading)" }}>
                n8n tech signals & GTM hiring leads
              </h1>
              <Badge tone="verified" icon="check">{LEADS.length} matches</Badge>
            </div>
            <p style={{ margin: 0, fontSize: "var(--text-caption)", color: "var(--text-secondary)" }}>
              Companies running n8n in their stack and actively recruiting GTM automation talent.
            </p>
          </div>
          <Button variant="outline" icon="refresh-cw">Refresh stream</Button>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <div style={{ width: 220 }}><Label>Technology signal</Label>
            <Select value="n8n" options={[{ value: "n8n", label: "n8n (self-hosted / cloud)" }, { value: "hubspot", label: "HubSpot CRM" }, { value: "apollo", label: "Apollo.io" }, { value: "all", label: "All stack signals" }]} /></div>
          <div style={{ width: 220 }}><Label>Hiring trigger</Label>
            <Select value="all" options={[{ value: "all", label: "All GTM roles" }, { value: "gtm", label: "GTM Automation Engineer" }, { value: "revops", label: "RevOps Manager" }, { value: "growth", label: "Head of Growth / Outbound" }]} /></div>
          <div style={{ width: 200 }}><Label>Funding event</Label>
            <Select value="all" options={[{ value: "all", label: "All stages" }, { value: "seed", label: "Seed" }, { value: "a", label: "Series A" }, { value: "b", label: "Series B" }]} /></div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "22px 32px 36px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {LEADS.map((l) => (
            <div key={l.company} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <LeadSignalCard company={l.company} round={l.round} stack={l.stack} trigger={l.trigger} contact={l.contact} />
              <Card pad={12} tone="sunken" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-micro)", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.domain}</span>
                <Button variant="ghost" size="sm" icon={copied === l.company ? "check" : "copy"} onClick={() => { setCopied(l.company); setTimeout(() => setCopied(null), 1600); }}>
                  {copied === l.company ? "Copied" : "Copy email"}
                </Button>
              </Card>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 22, fontSize: "var(--text-caption)", color: "var(--text-secondary)" }}>
          <Icon name="shield-check" size={15} color="var(--signal-verified)" />
          Contact emails are revealed through your own enrichment credentials — Prospect PAL never resells lead data.
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { SignalsScreen });
