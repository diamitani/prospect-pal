"use client";

import Link from "next/link";
import {
  Logo,
  Button,
  Badge,
  Icon,
  SectionHeading,
} from "@/components/ds";

const COMPILE_STEPS = [
  {
    step: "01",
    title: "Gather User Input",
    action: "Collect instruction pack",
    runtime: "ICP, persona, product, company, tools",
    details: "Company background, product/offer, ICP criteria (firmographics, signals, disqualifiers), persona titles and departments, and stack bindings.",
  },
  {
    step: "02",
    title: "Create Trigger Node",
    action: "Schedule search OR CSV webhook",
    runtime: "CRM stage filter to exclude deals/opps",
    details: "Daily ICP search via data tool, or webhook endpoint for CSV uploads. Filters out companies already in active deals or opportunities.",
  },
  {
    step: "03",
    title: "Configure Data Node",
    action: "Company enrich + people search",
    runtime: "HTTP/connector → contact table",
    details: "Map company to data tool API. Filter by departments, titles, and signals. Cap contacts per company (default: 3).",
  },
  {
    step: "04",
    title: "Configure CRM Node",
    action: "Batch create-or-update contacts",
    runtime: "Match on email or domain",
    details: "Never duplicate existing records. Attach source, persona, and campaign tags. Create company first, then contacts.",
  },
  {
    step: "05",
    title: "Configure Research",
    action: "AI + web search",
    runtime: "→ pain_hypothesis, value_prop",
    details: "Compile system prompt from intake. Gather live company intel. Draft value proposition and talking points.",
  },
  {
    step: "06",
    title: "Configure Messaging",
    action: "AI → emails 1-7 + LinkedIn",
    runtime: "PAS framework",
    details: "Problem-Agitate-Solve templates. Subject + body per email. Connection note, DM, and InMail variants.",
  },
  {
    step: "07",
    title: "Configure Sequence",
    action: "Enroll/add-to-list/mailbox send",
    runtime: "Map contact + copy to outreach",
    details: "Connect to rep's mailbox. Route through approval gate or direct enroll based on policy.",
  },
];

const NINE_NODES = [
  { id: "01", name: "Intake & Cron", binding: "n8n-nodes-base.cron", description: "Schedule trigger (daily ICP search) OR webhook (CSV upload)" },
  { id: "02", name: "Normalizer", binding: "n8n-nodes-base.set", description: "Schema transform, field mapping, validation" },
  { id: "03", name: "CRM Dedupe", binding: "n8n-nodes-base.hubspot", description: "Check existing contacts/deals, skip if already in pipeline" },
  { id: "04", name: "Data Adapter", binding: "n8n-nodes-base.httpRequest", description: "HTTP Request to data tool for company enrich + people search" },
  { id: "05", name: "Research + PAS", binding: "n8n-nodes-base.openai", description: "AI node: company research → pain hypothesis → value prop" },
  { id: "06", name: "Approval Switch", binding: "n8n-nodes-base.switch", description: "Route to human approval or auto-proceed based on policy" },
  { id: "07", name: "CRM Upsert", binding: "n8n-nodes-base.hubspot", description: "Create or update contact + company in CRM" },
  { id: "08", name: "Sequence Enroll", binding: "n8n-nodes-base.httpRequest", description: "Add to outreach sequence or direct mailbox send" },
  { id: "09", name: "Review Alert", binding: "n8n-nodes-base.slack", description: "Slack/email notification of enrolled prospects" },
];

const TOOL_REGISTRY = {
  crms: ["HubSpot", "Salesforce", "Zoho", "Pipedrive", "Attio"],
  llms: ["Anthropic Claude", "OpenAI", "Azure OpenAI", "AWS Bedrock", "OpenRouter", "Google Gemini"],
  data: ["Clay", "Apollo", "ZoomInfo", "Amplemarket", "Reply.io"],
  outreach: ["HubSpot Sales", "Salesforce", "Amplemarket", "Instantly", "Smartlead", "Zoho", "Resend", "Gmail"],
};

const OUTPUT_FILES = [
  { file: "workflow.json", description: "Importable n8n workflow with all 9 nodes wired" },
  { file: "ai/research.system_prompt.md", description: "AI system prompt for research node" },
  { file: "ai/email.system_prompt.md", description: "AI system prompt for email generation" },
  { file: "CREDENTIALS.md", description: "Setup instructions for each credential (no secrets)" },
  { file: "TEST.md", description: "QA checklist to validate before going live" },
  { file: "ack.json", description: "Compile receipt with status, bindings, and requires_connection[]" },
];

const HARD_GATES = [
  { gate: "Company background", example: "What does the company do?" },
  { gate: "Product / offer / proof", example: "What are they selling? Any banned claims?" },
  { gate: "ICP", example: "Firmographics, signals, disqualifiers" },
  { gate: "Persona", example: "Job titles, departments" },
  { gate: "Data tool", example: "Apollo, Clay, ZoomInfo, Amplemarket" },
  { gate: "LLM provider", example: "Anthropic, OpenAI, Azure, Bedrock" },
  { gate: "Trigger type", example: "search (daily) or csv (webhook)" },
  { gate: "Approval policy", example: "auto-send, human approval, draft-only" },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Navigation */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          height: 66,
          padding: "0 32px",
          background: "rgba(251,250,248,0.86)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border-hairline)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Logo size={34} />
          </Link>
          <Badge tone="brand">Documentation</Badge>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Link href="/home" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none" }}>
            Home
          </Link>
          <Link href="/login">
            <Button variant="outline" size="md">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="accent" size="md" icon="Zap">Get started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "64px 32px 48px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <Badge tone="deep" icon="BookOpen" style={{ marginBottom: 20 }}>Technical documentation</Badge>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-display-1)",
          fontWeight: "var(--weight-bold)",
          letterSpacing: "var(--tracking-display)",
          lineHeight: "var(--leading-tight)",
          marginBottom: 16,
        }}>
          How the PAE Compiles Workflows
        </h1>
        <p style={{
          fontSize: 19,
          lineHeight: "var(--leading-relaxed)",
          color: "var(--text-secondary)",
          maxWidth: 720,
        }}>
          The Prospect Automation Engineer (PAE) transforms your business context into a production-ready n8n workflow.
          Two compilers work together: the prompt compiler generates AI instructions, the graph compiler produces workflow JSON.
        </p>
      </section>

      {/* Two Compilers */}
      <section style={{ padding: "48px 32px", background: "var(--surface-sunken)", borderTop: "1px solid var(--border-hairline)", borderBottom: "1px solid var(--border-hairline)" }}>
        <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
          <SectionHeading
            eyebrow="Architecture"
            title="Two Compilers"
            description="Separate concerns for maximum flexibility. Change your AI provider without rewiring the graph."
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 36 }}>
            <div style={{ padding: 28, background: "var(--surface-card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-hairline)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "var(--radius-lg)", background: "var(--cobalt-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="Sparkles" size={24} color="var(--cobalt-600)" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-body-lg)", fontWeight: 600, margin: 0 }}>Prompt Compiler</h3>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>AI instruction generation</span>
                </div>
              </div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--text-primary)" }}>Input:</strong> Company, product, ICP, persona<br />
                <strong style={{ color: "var(--text-primary)" }}>Output:</strong> AI system prompts for research and email nodes
              </div>
            </div>
            <div style={{ padding: 28, background: "var(--surface-card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-hairline)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "var(--radius-lg)", background: "var(--signal-info-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="Workflow" size={24} color="var(--signal-info)" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-body-lg)", fontWeight: 600, margin: 0 }}>Graph Compiler</h3>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>n8n workflow generation</span>
                </div>
              </div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--text-primary)" }}>Input:</strong> Trigger, CRM, data tool, sequencer, LLM<br />
                <strong style={{ color: "var(--text-primary)" }}>Output:</strong> n8n workflow.json + credential setup
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hard Gates */}
      <section style={{ padding: "64px 32px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <SectionHeading
          eyebrow="Requirements"
          title="8 Hard Gates"
          description="These fields must be collected before compile. The system will not generate a workflow until all gates are satisfied."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 36 }}>
          {HARD_GATES.map((item, i) => (
            <div key={item.gate} style={{
              padding: "20px 18px",
              background: "var(--surface-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-hairline)",
            }}>
              <div style={{ fontFamily: "var(--font-data)", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 1, marginBottom: 8 }}>
                GATE {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 4, fontSize: 14 }}>{item.gate}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.example}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 7-Step Compile Process */}
      <section style={{ padding: "64px 32px", background: "var(--surface-sunken)", borderTop: "1px solid var(--border-hairline)", borderBottom: "1px solid var(--border-hairline)" }}>
        <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
          <SectionHeading
            eyebrow="Compile procedure"
            title="7-Step Process"
            description="From user input to running workflow. Each step maps to specific n8n nodes."
          />
          <div style={{ marginTop: 36 }}>
            {COMPILE_STEPS.map((step, i) => (
              <div key={step.step} style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: 24,
                padding: "28px 0",
                borderBottom: i < COMPILE_STEPS.length - 1 ? "1px solid var(--border-hairline)" : "none",
              }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: "var(--radius-lg)",
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-hairline)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-data)",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--cobalt-600)",
                }}>
                  {step.step}
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-body-lg)", fontWeight: 600, margin: "0 0 6px", color: "var(--text-primary)" }}>
                    {step.title}
                  </h3>
                  <div style={{ fontSize: 14, color: "var(--cobalt-600)", fontWeight: 500, marginBottom: 8 }}>
                    {step.action} <span style={{ color: "var(--text-muted)" }}>→</span> {step.runtime}
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                    {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9-Node Pipeline */}
      <section style={{ padding: "64px 32px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <SectionHeading
          eyebrow="Pipeline architecture"
          title="9-Node Capability Path"
          description="Every compiled workflow follows this node order. Nodes can be skipped based on configuration, but the order is fixed."
        />

        {/* Pipeline Visual */}
        <div style={{
          marginTop: 36,
          padding: 32,
          background: "var(--surface-deep)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-deep)",
        }}>
          <pre style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--ink-200)",
            lineHeight: 2,
            margin: 0,
            textAlign: "center",
          }}>
{`01 Intake & Cron    →  02 Normalizer     →  03 CRM Dedupe
        ↓                     ↓                    ↓
04 Data Adapter     →  05 Research+PAS   →  06 Approval
        ↓                     ↓                    ↓
07 CRM Upsert       →  08 Enroll         →  09 Review Alert`}
          </pre>
        </div>

        {/* Node Details */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 28 }}>
          {NINE_NODES.map((node) => (
            <div key={node.id} style={{
              padding: "18px 16px",
              background: "var(--surface-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-hairline)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: "var(--cobalt-100)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-data)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--cobalt-600)",
                }}>
                  {node.id}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{node.name}</div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>
                {node.binding}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {node.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Tools */}
      <section style={{ padding: "64px 32px", background: "var(--surface-sunken)", borderTop: "1px solid var(--border-hairline)", borderBottom: "1px solid var(--border-hairline)" }}>
        <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
          <SectionHeading
            eyebrow="Integrations"
            title="Supported Tools Registry"
            description="These tools are supported out of the box. Most use HTTP Request nodes with credential placeholders."
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 36 }}>
            {[
              { label: "CRMs", items: TOOL_REGISTRY.crms, color: "#FF7A59" },
              { label: "LLM Providers", items: TOOL_REGISTRY.llms, color: "#8B5CF6" },
              { label: "Data Tools", items: TOOL_REGISTRY.data, color: "#3B82F6" },
              { label: "Outreach", items: TOOL_REGISTRY.outreach, color: "#10B981" },
            ].map((category) => (
              <div key={category.label} style={{
                padding: 24,
                background: "var(--surface-card)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-hairline)",
              }}>
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  color: category.color,
                  marginBottom: 14,
                  fontFamily: "var(--font-data)",
                }}>
                  {category.label.toUpperCase()}
                </div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {category.items.map((item) => (
                    <li key={item} style={{ fontSize: 14, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: category.color, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Output Files */}
      <section style={{ padding: "64px 32px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <SectionHeading
          eyebrow="Compile output"
          title="What You Get"
          description="Each compile produces these files. Review them before importing to n8n."
        />
        <div style={{ marginTop: 36, background: "var(--surface-deep)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-deep)", overflow: "hidden" }}>
          {OUTPUT_FILES.map((file, i) => (
            <div key={file.file} style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 24px",
              borderBottom: i < OUTPUT_FILES.length - 1 ? "1px solid var(--border-deep)" : "none",
            }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--champagne-300)",
                minWidth: 240,
              }}>
                {file.file}
              </div>
              <div style={{ fontSize: 14, color: "var(--ink-300)" }}>
                {file.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Test */}
      <section style={{ padding: "64px 32px", background: "var(--surface-sunken)", borderTop: "1px solid var(--border-hairline)" }}>
        <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
          <SectionHeading
            eyebrow="QA checklist"
            title="Quick Test Before Going Live"
            description="Run through this checklist after importing your workflow."
          />
          <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {[
              "Import workflow.json to n8n",
              "Create credentials per CREDENTIALS.md",
              "Set trigger to manual for testing",
              "Run with a single test lead",
              "Verify CRM dedupe logic fires",
              "Verify AI nodes return valid JSON",
              "Verify approval gate routes correctly",
              "Check sequence enrollment (draft mode)",
              "Review Slack/email notifications",
              "Switch trigger to schedule when ready",
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 18px",
                background: "var(--surface-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-hairline)",
              }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  border: "2px solid var(--border-deep)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--text-muted)" }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 14, color: "var(--text-primary)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "64px 32px", textAlign: "center", background: "var(--surface-deep)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display-2)",
            fontWeight: "var(--weight-bold)",
            letterSpacing: "var(--tracking-display)",
            color: "var(--paper-0)",
            marginBottom: 16,
          }}>
            Ready to compile your engine?
          </h2>
          <p style={{ fontSize: "var(--text-body)", color: "var(--ink-300)", marginBottom: 28, lineHeight: "var(--leading-relaxed)" }}>
            Answer the 8 hard gates and we generate your custom workflow in seconds.
          </p>
          <Link href="/signup">
            <Button variant="accent" size="lg" icon="Zap">
              Start building
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "40px 32px",
        borderTop: "1px solid var(--border-hairline)",
        background: "var(--surface-sunken)",
      }}>
        <div style={{
          maxWidth: "var(--layout-max)",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Logo size={26} />
          <div style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>
            2026 Prospect PAL. GTM automation, compiled and handed over.
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            {["Home", "Documentation", "Pricing"].map((link) => (
              <Link key={link} href={link === "Home" ? "/home" : link === "Documentation" ? "/how-it-works" : "/home#pricing"} style={{ fontSize: "var(--text-caption)", color: "var(--text-secondary)", textDecoration: "none" }}>
                {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
