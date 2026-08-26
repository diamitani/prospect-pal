const { StepIndicator, ToolOptionCard, Button, Card, Badge, Label, Input, Icon } = window.ProspectPALDesignSystem_b8251d;

const STEPS = ["Trigger", "CRM", "Outreach", "Deploy target", "Data tool", "LLM", "Approval", "Review"];
const OPTIONS = {
  0: [["upload", "Spreadsheet upload", "CSV of accounts or contacts", ""], ["database", "CRM import", "Daily cron over your CRM", "cron"], ["webhook", "Live data-tool search", "Search on intent signals", "webhook"]],
  1: [["database", "HubSpot", "Dedupe + contact upsert", "OAuth2"], ["cloud", "Salesforce", "Enterprise pipeline guard", "OAuth2"], ["sparkle", "Attio", "Real-time CRM of record", "API key"]],
  2: [["send", "Smartlead", "Multi-inbox warmup + sending", "API key"], ["mail", "Instantly", "High-volume cold sequencing", "API key"], ["inbox", "HubSpot Sales", "Native sequence enrolment", "OAuth2"]],
};

function WizardScreen({ onFinish }) {
  const [step, setStep] = React.useState(1);
  const [picked, setPicked] = React.useState({ 0: 1, 1: 0, 2: 0 });
  const opts = OPTIONS[step] || OPTIONS[0];
  const hardGate = step !== 0;

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "26px 32px 40px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <StepIndicator steps={STEPS} current={step} onStep={setStep} />
        <div style={{ marginTop: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", fontWeight: 700, letterSpacing: "var(--tracking-display)" }}>
              {step === 0 ? "How should leads enter the system?" : step === 1 ? "Which platform holds your contact data today?" : "Which platform should send the messages?"}
            </h1>
            <p style={{ margin: "8px 0 0", fontSize: "var(--text-body-sm)", color: "var(--text-secondary)", maxWidth: 560, lineHeight: "var(--leading-relaxed)" }}>
              We only ask which provider — never a key. Credentials are exchanged later, in your browser, directly with the provider.
            </p>
          </div>
          <Badge tone={hardGate ? "attention" : "neutral"} icon={hardGate ? "lock" : "circle-dashed"}>{hardGate ? "Hard gate" : "Optional"}</Badge>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
          {opts.map(([icon, title, caption, meta], i) => (
            <ToolOptionCard key={title} icon={icon} title={title} caption={caption} meta={meta}
              selected={picked[step] === i} onClick={() => setPicked({ ...picked, [step]: i })} />
          ))}
        </div>

        {step === 1 ? (
          <Card pad={18} tone="sunken" style={{ marginTop: 16 }}>
            <Label hint="never stored">Instance the workflow deploys to</Label>
            <Input icon="link" mono value="https://acme.n8n.cloud" />
            <div style={{ display: "flex", gap: 7, alignItems: "flex-start", marginTop: 10, fontSize: "var(--text-caption)", color: "var(--text-secondary)", lineHeight: "var(--leading-normal)" }}>
              <Icon name="shield-check" size={14} color="var(--signal-verified)" />
              <span>The compiled workflow lives entirely on your instance. Prospect PAL keeps no credentials after the deploy call.</span>
            </div>
          </Card>
        ) : null}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <Button variant="ghost" icon="arrow-left" onClick={() => setStep(Math.max(0, step - 1))}>Back</Button>
          {step < 2
            ? <Button variant="primary" iconRight="arrow-right" onClick={() => setStep(step + 1)}>Continue</Button>
            : <Button variant="accent" iconRight="arrow-right" onClick={onFinish}>Review intake JSON</Button>}
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { WizardScreen });
