"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckoutModal from "@/components/CheckoutModal";
import {
  Logo,
  Button,
  Badge,
  Icon,
  StatTile,
  SectionHeading,
  IntegrationCard,
  DeliverableCard,
  LeadSignalCard,
  PricingCard,
  PipelineRail,
  PipelineNode,
  WorkflowDiagram,
} from "@/components/ds";

const NINE_NODES: PipelineNode[] = [
  { title: "Intake & cron", subtitle: "Trigger source", icon: "Zap", stage: "trigger", binding: "n8n-nodes-base.cron" },
  { title: "Data normalizer", subtitle: "Schema transform", icon: "FileBraces", stage: "logic", binding: "n8n-nodes-base.set" },
  { title: "CRM dedupe shield", subtitle: "Deal protection", icon: "ShieldCheck", stage: "shield", binding: "n8n-nodes-base.hubspot" },
  { title: "Data tool adapter", subtitle: "Contact reveal", icon: "Search", stage: "data", binding: "n8n-nodes-base.apollo" },
  { title: "AI research & PAS", subtitle: "Email copy", icon: "Sparkles", stage: "ai", binding: "n8n-nodes-base.openai" },
  { title: "Approval switch", subtitle: "Human gate", icon: "Scale", stage: "logic", binding: "n8n-nodes-base.switch" },
  { title: "CRM contact create", subtitle: "Lead sync", icon: "Database", stage: "shield", binding: "n8n-nodes-base.hubspot" },
  { title: "Sequence enrollment", subtitle: "Outreach start", icon: "Send", stage: "sequence", binding: "n8n-nodes-base.smartlead" },
  { title: "Review alert", subtitle: "Slack notify", icon: "Bell", stage: "logic", binding: "n8n-nodes-base.slack" },
];

const INTEGRATIONS = [
  { name: "HubSpot", capability: "crm-read-write", description: "Dedupe shield and contact upsert", icon: "Database" as const, connected: true },
  { name: "Salesforce", capability: "crm-read-write", description: "Enterprise pipeline protection", icon: "Cloud" as const },
  { name: "Apollo.io", capability: "contact-enrichment", description: "Verified decision-maker reveal", icon: "Search" as const, connected: true },
  { name: "Clay", capability: "contact-enrichment", description: "Waterfall company enrichment", icon: "Layers" as const },
  { name: "Smartlead", capability: "sequencer", description: "Multi-inbox warmup and sending", icon: "Send" as const },
  { name: "Instantly", capability: "sequencer", description: "High-volume cold sequencing", icon: "Mail" as const },
  { name: "Anthropic Claude", capability: "llm-inference", description: "Research and PAS copywriting", icon: "Sparkles" as const, connected: true },
  { name: "Slack", capability: "approval-gate", description: "One-click human review", icon: "MessageSquare" as const },
  { name: "n8n", capability: "deploy-target", description: "Your own cloud or self-hosted instance", icon: "Workflow" as const },
];

const DELIVERABLES = [
  { file: "workflow.n8n.json", badge: "Import ready", label: "Production workflow", description: "Nine wired nodes with error catchers, expressions and sub-workflow hooks." },
  { file: "BUILD_PROMPT.md", badge: "Documentation", label: "Deploy checklist", description: "Every credential and ENV var still to wire, in the order you'll need them." },
  { file: ".env.template", badge: "Security", label: "Zero hard-coded secrets", description: "Providers referenced by ENV name only — no key ever leaves your browser." },
  { file: "email-framework.md", badge: "Copywriting", label: "3-sentence PAS scripts", description: "Problem-agitate-solve templates with dynamic variable mappings." },
  { file: "PRD.md", badge: "Strategy", label: "Pipeline specification", description: "ICP matrix, data dictionary, bounce guardrails and compliance rules." },
  { file: "ack.json", badge: "API contract", label: "Compile receipt", description: "Run status, resolved bindings and every requires_connection flag." },
];

const LEADS = [
  { company: "NexusFlow Data", round: "Series A · $12M", stack: ["n8n self-hosted", "HubSpot", "Apollo"], trigger: "Hiring GTM Automation Engineer", contact: "Marcus Vance, VP RevOps" },
  { company: "HyperScale AI", round: "Series B · $28M", stack: ["n8n cloud", "Salesforce", "Clay", "Smartlead"], trigger: "Hiring Head of Outbound Growth", contact: "Elena Rostova, Head of Growth" },
  { company: "CloudPulse Systems", round: "Seed · $4.5M", stack: ["n8n self-hosted", "Attio", "Instantly"], trigger: "Hiring Founding GTM Specialist", contact: "Devon Chen, Co-founder" },
];

export default function HomePage() {
  const router = useRouter();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [activeNodeIndex, setActiveNodeIndex] = useState(2);

  const handleOpenCheckout = (planId: string) => {
    setSelectedPlan(planId);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* Sticky Navigation */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <Link href="/home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Logo size={34} />
          </Link>
          <Badge tone="brand">Automation agent</Badge>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {["Product", "How it works", "Pricing", "Security"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              style={{
                fontSize: "var(--text-body-sm)",
                fontWeight: 500,
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              {item}
            </a>
          ))}
          <Link href="/login">
            <Button variant="outline" size="md">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="accent" size="md" icon="Zap">
              Build my engine
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: "64px 32px 0", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          {/* Left: Text Content */}
          <div>
            <Badge tone="brand" icon="Workflow" style={{ marginBottom: 22 }}>
              GTM automation agent
            </Badge>

            <h1
              style={{
                margin: "0 0 18px",
                fontFamily: "var(--font-display)",
                fontWeight: "var(--weight-bold)",
                fontSize: "var(--text-display-1)",
                letterSpacing: "var(--tracking-display)",
                lineHeight: "var(--leading-tight)",
              }}
            >
              Automate your GTM engine.
            </h1>

            <p
              style={{
                margin: "0 0 30px",
                fontSize: 19,
                lineHeight: "var(--leading-relaxed)",
                color: "var(--text-secondary)",
              }}
            >
              Generate leads. Connect to CRM. Research prospects. Craft messaging. Enroll in sequences.
              One platform that builds your complete outbound automation.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
              <Link href="/signup">
                <Button variant="accent" size="lg" icon="Zap">
                  Build my engine — $99/mo
                </Button>
              </Link>
              <Button variant="outline" size="lg" icon="Play">
                See a compile, 2 min
              </Button>
            </div>

            {/* Value Props - Compact */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { icon: "Users" as const, label: "Generate leads" },
                { icon: "Database" as const, label: "Connect to CRM" },
                { icon: "Sparkles" as const, label: "AI copywriting" },
                { icon: "Send" as const, label: "Auto sequences" },
              ].map((prop) => (
                <div
                  key={prop.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Icon name={prop.icon} size={16} color="var(--cobalt-500)" />
                  <span
                    style={{
                      fontSize: "var(--text-body-sm)",
                      color: "var(--text-secondary)",
                      fontWeight: 500,
                    }}
                  >
                    {prop.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Video Overview */}
          <div
            style={{
              background: "var(--surface-deep)",
              borderRadius: "var(--radius-2xl)",
              border: "1px solid var(--border-deep)",
              overflow: "hidden",
              aspectRatio: "16/10",
              position: "relative",
            }}
          >
            {/* Video Header */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                padding: "12px 16px",
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 2,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27ca40" }} />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    color: "var(--ink-300)",
                    marginLeft: 8,
                  }}
                >
                  prospect-pal-overview.mp4
                </span>
              </div>
              <Badge tone="deep">2:14</Badge>
            </div>

            {/* Video Placeholder */}
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, var(--ink-800) 0%, var(--ink-900) 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "var(--cobalt-600)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(42, 65, 201, 0.4)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(42, 65, 201, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(42, 65, 201, 0.4)";
                }}
              >
                <Icon name="Play" size={32} color="white" style={{ marginLeft: 4 }} />
              </div>
              <span
                style={{
                  fontSize: "var(--text-body-sm)",
                  color: "var(--ink-300)",
                  fontWeight: 500,
                }}
              >
                Watch how it works
              </span>
            </div>
          </div>
        </div>

        {/* Live Canvas */}
        <div
          style={{
            background: "var(--surface-deep)",
            borderRadius: "var(--radius-2xl)",
            border: "1px solid var(--border-deep)",
            boxShadow: "var(--shadow-overlay)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 18px",
              borderBottom: "1px solid var(--border-deep)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontSize: "var(--text-caption)",
                color: "var(--ink-300)",
              }}
            >
              workflow.n8n.json · 9 nodes · approved
            </span>
            <Badge tone="verified">Graph compiled</Badge>
          </div>

          <div style={{ padding: "22px 20px" }}>
            <PipelineRail
              nodes={NINE_NODES}
              activeIndex={activeNodeIndex}
              onSelect={setActiveNodeIndex}
            />

            <div
              style={{
                marginTop: 18,
                padding: "16px 18px",
                borderRadius: "var(--radius-lg)",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border-deep)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ maxWidth: 640 }}>
                <div
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: "var(--text-micro)",
                    color: "var(--champagne-200)",
                    marginBottom: 5,
                  }}
                >
                  NODE {String(activeNodeIndex + 1).padStart(2, "0")} · {NINE_NODES[activeNodeIndex].binding}
                </div>
                <div
                  style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--ink-200)",
                    lineHeight: "var(--leading-relaxed)",
                  }}
                >
                  <strong style={{ color: "var(--paper-0)", fontWeight: 600 }}>
                    {NINE_NODES[activeNodeIndex].title}
                  </strong>{" "}
                  — {NINE_NODES[activeNodeIndex].subtitle}.
                </div>
              </div>
              <Button variant="inverse" icon="Settings2" onClick={() => handleOpenCheckout("pro")}>
                Configure this node
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section
        id="product"
        style={{
          padding: "72px 32px",
          background: "var(--surface-sunken)",
          borderTop: "1px solid var(--border-hairline)",
          borderBottom: "1px solid var(--border-hairline)",
          marginTop: 72,
        }}
      >
        <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
          <SectionHeading
            eyebrow="Your GTM stack"
            title="Connect your tools, we wire the automation"
            description="CRM, data enrichment, sequence automation. Pick your providers and we resolve each to a production-ready n8n node."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
              marginTop: 36,
            }}
          >
            {INTEGRATIONS.map((tool) => (
              <IntegrationCard key={tool.name} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* n8n Workflow Visual Section */}
      <section style={{ padding: "72px 32px 0", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <SectionHeading
          eyebrow="Under the hood"
          title="The automation engine"
          description="A production-ready n8n workflow with connected nodes that runs your prospecting on autopilot. Each node handles one step of the pipeline."
        />
        <div style={{ marginTop: 36 }}>
          <WorkflowDiagram />
        </div>
      </section>

      {/* 7-Step Compile Process */}
      <section style={{ padding: "72px 32px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <SectionHeading
          eyebrow="PAE compile process"
          title="7 Steps to a Working Engine"
          description="From user input to running workflow. Two compilers — prompt compiler for AI nodes, graph compiler for n8n JSON."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginTop: 40,
          }}
        >
          {[
            {
              step: "01",
              icon: "ClipboardList" as const,
              title: "Gather User Input",
              description: "Company, product, ICP criteria, persona titles, and stack bindings (CRM, data tool, LLM, outreach).",
              color: "var(--signal-warning)",
            },
            {
              step: "02",
              icon: "Zap" as const,
              title: "Create Trigger Node",
              description: "Daily schedule search or CSV webhook. CRM stage filter excludes existing deals.",
              color: "var(--cobalt-500)",
            },
            {
              step: "03",
              icon: "Search" as const,
              title: "Configure Data Node",
              description: "Company enrich + people search via HTTP. Filter by departments, titles, and signals.",
              color: "var(--signal-info)",
            },
            {
              step: "04",
              icon: "Database" as const,
              title: "Configure CRM Node",
              description: "Batch create-or-update contacts. Match on email or domain, never duplicate.",
              color: "var(--champagne-500)",
            },
            {
              step: "05",
              icon: "Sparkles" as const,
              title: "Configure Research",
              description: "AI + web search generates pain-point hypothesis and value proposition.",
              color: "var(--signal-verified)",
            },
            {
              step: "06",
              icon: "Mail" as const,
              title: "Configure Messaging",
              description: "AI drafts emails 1–7 plus LinkedIn copy using PAS framework.",
              color: "var(--signal-active)",
            },
            {
              step: "07",
              icon: "Send" as const,
              title: "Configure Sequence",
              description: "Enroll in sequence or mailbox send. Map contact + email to outreach tool.",
              color: "#10B981",
            },
          ].map((item, index) => (
            <div
              key={item.step}
              style={{
                padding: "24px 20px",
                background: "var(--surface-card)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-hairline)",
                position: "relative",
                gridColumn: index === 6 ? "2 / 4" : undefined,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  fontFamily: "var(--font-data)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: 1,
                }}
              >
                {item.step}
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-lg)",
                  background: `${item.color}15`,
                  border: `1.5px solid ${item.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <Icon name={item.icon} size={20} color={item.color} />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-body-sm)",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 6,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: "var(--leading-relaxed)",
                  margin: 0,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Overview */}
      <section
        style={{
          padding: "56px 32px",
          background: "var(--surface-sunken)",
          borderTop: "1px solid var(--border-hairline)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
          <SectionHeading
            eyebrow="Architecture"
            title="Four-layer data flow"
            description="Modular components that snap together. Swap providers without rewiring the whole engine."
          />
          <div
            style={{
              marginTop: 36,
              background: "var(--surface-deep)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-deep)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
              }}
            >
              {[
                {
                  layer: "INPUT LAYER",
                  items: ["CSV uploads", "Webhooks", "RB2B / Clearbit", "Cron batches"],
                  color: "#FF9500",
                },
                {
                  layer: "ENRICHMENT ADAPTER",
                  items: ["Apollo.io", "Clay", "ZoomInfo", "Clearbit"],
                  color: "#8B5CF6",
                },
                {
                  layer: "AI REASONING NODE",
                  items: ["Claude Sonnet", "Research synthesis", "PAS copywriting", "Pain point ID"],
                  color: "#3B82F6",
                },
                {
                  layer: "OUTPUT DISPATCH",
                  items: ["HubSpot", "Salesforce", "Smartlead", "Instantly"],
                  color: "#10B981",
                },
              ].map((col, i) => (
                <div
                  key={col.layer}
                  style={{
                    padding: "24px 20px",
                    borderRight: i < 3 ? "1px solid var(--border-deep)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1.2,
                      color: col.color,
                      marginBottom: 14,
                      fontFamily: "var(--font-data)",
                    }}
                  >
                    {col.layer}
                  </div>
                  <ul
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {col.items.map((item) => (
                      <li
                        key={item}
                        style={{
                          fontSize: 13,
                          color: "var(--ink-200)",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: col.color,
                            flexShrink: 0,
                          }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: "80px 32px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <SectionHeading
          eyebrow="Simple setup"
          title="How it works"
          description="Upload your company data (product, messaging, ICP, user persona), GTM tools (CRM, data enrichment, sequence automation) and n8n instance (OAuth connection via Composio) — we generate a custom prospect automation engine based on your campaign details."
        />

        {/* Target Audiences */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginTop: 40,
            marginBottom: 56,
          }}
        >
          {[
            {
              icon: "Rocket" as const,
              title: "Startups",
              description: "Creating GTM outreach from scratch? Build a scalable prospecting engine that grows with your pipeline.",
            },
            {
              icon: "User" as const,
              title: "Solopreneurs",
              description: "Looking for new clients? Automate the research and outreach you do not have time to do manually.",
            },
            {
              icon: "UsersRound" as const,
              title: "Sales teams",
              description: "Restructuring your approach? Add SDR support with AI-powered research and personalized sequences.",
            },
          ].map((audience) => (
            <div
              key={audience.title}
              style={{
                padding: "28px 24px",
                background: "var(--surface-card)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-hairline)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--radius-lg)",
                  background: "var(--champagne-100)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Icon name={audience.icon} size={24} color="var(--champagne-600)" />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-body-lg)",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 8,
                }}
              >
                {audience.title}
              </h3>
              <p
                style={{
                  fontSize: "var(--text-body-sm)",
                  color: "var(--text-secondary)",
                  lineHeight: "var(--leading-relaxed)",
                  margin: 0,
                }}
              >
                {audience.description}
              </p>
            </div>
          ))}
        </div>

        {/* Deliverables */}
        <SectionHeading
          eyebrow="Production artifacts"
          title="What a compile hands you"
          description="Six files, versioned per run. Read them before anything touches your CRM."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginTop: 36,
          }}
        >
          {DELIVERABLES.map((d) => (
            <DeliverableCard key={d.file} {...d} />
          ))}
        </div>
      </section>

      {/* Signals Section */}
      <section id="signals" style={{ padding: "80px 32px", background: "var(--surface-deep)" }}>
        <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
          <SectionHeading
            align="left"
            onDeep
            eyebrow="Tech stack intelligence"
            title="Leads that already run n8n"
            description="Stack detection plus hiring intent, so your first line writes itself."
            action={
              <Button variant="inverse" iconRight="ArrowUpRight" onClick={() => handleOpenCheckout("pro")}>
                Access live signals
              </Button>
            }
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              marginTop: 34,
            }}
          >
            {LEADS.map((l) => (
              <LeadSignalCard key={l.company} {...l} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: "84px 32px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <SectionHeading
          eyebrow="Transparent plans"
          title="Compile once. Run it forever."
          description="Bring your own keys. No per-lead markup, no vendor lock-in."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginTop: 40,
            alignItems: "start",
          }}
        >
          <PricingCard
            name="DIY build package"
            price="$19.99"
            note="One-time download"
            description="For engineers who want the prompts, the blueprint and the JSON, and will wire it themselves."
            features={[
              "Canonical 9-node workflow JSON",
              "Full prompt suite & variable schema",
              "Self-hosted Docker guide",
              "PAS email template suite",
              ".env.template & credential map",
            ]}
            cta={
              <Button variant="outline" fullWidth onClick={() => handleOpenCheckout("diy")}>
                Get the package
              </Button>
            }
          />
          <PricingCard
            featured
            name="Pro unlimited engine"
            price="$99"
            cadence="/ month"
            note="Cancel anytime · BYOK"
            description="The full architect: unlimited compiles, live node canvas, execution triage and signal leads."
            features={[
              "Unlimited campaign compiles",
              "Live 9-node canvas",
              "Connect & deploy to your n8n",
              "Execution error triage",
              "A/B PAS scripts studio",
              "Slack one-click approval gates",
            ]}
            cta={
              <Button variant="accent" fullWidth icon="Zap" onClick={() => handleOpenCheckout("pro")}>
                Start Pro
              </Button>
            }
          />
          <PricingCard
            tone="sunken"
            name="Custom architecture"
            price="$999+"
            note="White-glove engagement"
            description="Custom waterfalls, sub-workflows, CRM cleansing and private infrastructure, built with you."
            features={[
              "Dedicated GTM systems engineer",
              "Custom Clay & Apollo waterfalls",
              "Legacy CRM dedupe audit",
              "Custom sub-workflows & webhooks",
              "Private support channel",
            ]}
            cta={
              <Button variant="outline" fullWidth onClick={() => handleOpenCheckout("custom")}>
                Request a build
              </Button>
            }
          />
        </div>

        {/* Security note */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: "var(--text-caption)",
              color: "var(--text-secondary)",
            }}
          >
            <Icon name="ShieldCheck" size={15} color="var(--signal-verified)" />
            We never store an API key, and we never send an email on your behalf during setup.
          </span>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        style={{
          padding: "64px 32px",
          background: "var(--surface-deep)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display-2)",
              fontWeight: "var(--weight-bold)",
              letterSpacing: "var(--tracking-display)",
              color: "var(--paper-0)",
              marginBottom: 16,
            }}
          >
            Automate your GTM engine today.
          </h2>
          <p
            style={{
              fontSize: "var(--text-body)",
              color: "var(--ink-300)",
              marginBottom: 28,
              lineHeight: "var(--leading-relaxed)",
            }}
          >
            Upload your company data. Connect your tools. Deploy a custom prospect automation engine in minutes.
          </p>
          <Link href="/signup">
            <Button variant="accent" size="lg" icon="Zap">
              Build my engine — $99/mo
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "40px 32px",
          borderTop: "1px solid var(--border-hairline)",
          background: "var(--surface-sunken)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--layout-max)",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <Logo size={26} />
          <div style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>
            2026 Prospect PAL. GTM automation, compiled and handed over.
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            {["Product", "Security", "Docs"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: "var(--text-caption)",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        selectedPlanInitial={selectedPlan}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={() => {
          setIsCheckoutOpen(false);
          router.push("/dashboard");
        }}
      />
    </>
  );
}
