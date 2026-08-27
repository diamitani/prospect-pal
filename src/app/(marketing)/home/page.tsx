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

const AGENT_TOOLS = [
  {
    name: "n8n Engineer",
    capability: "workflow-compile",
    description: "Master at n8n workflows. Nodes, ELT, connectors, platform docs. HubSpot, Clay, Amplemarket, Apollo.",
    icon: "Workflow" as const,
  },
  {
    name: "Make & Gumloop Engineer",
    capability: "workflow-compile",
    description: "Same compile skill, specialized for Make and Gumloop.",
    icon: "Layers" as const,
  },
  {
    name: "n8n Execution Agent",
    capability: "run-triage",
    description: "Analyzes workflows by execution run and ID. Scans failures and suggests fixes.",
    icon: "Search" as const,
  },
  {
    name: "Daily Execution Report",
    capability: "reporting",
    description: "Daily update of runs: nodes processed, data packs, leads processed, emails, open/reply rates.",
    icon: "Mail" as const,
  },
  {
    name: "Prospect Automation Workflow",
    capability: "base-graph",
    description: "Foundational flow that connects each part from structure and campaign setup. Multiple guides to select.",
    icon: "Database" as const,
  },
  {
    name: "Custom Build Prompt",
    capability: "system-skill",
    description: "Generates a custom n8n, Make, or Gumloop prospect workflow from your inputs and the template.",
    icon: "Sparkles" as const,
  },
];

const DELIVERABLES = [
  {
    file: "workflow.json",
    badge: "Import ready",
    label: "Production workflow",
    description: "Customized n8n, Make, or Gumloop JSON from your inputs and the campaign template.",
  },
  {
    file: "BUILD_PROMPT.md",
    badge: "Essential skill",
    label: "Custom build prompt",
    description: "System instructions to generate or edit the prospect automation workflow with the automation engineer.",
  },
  {
    file: "skill-package/",
    badge: "DIY",
    label: "Agent skill package",
    description: "Agent directory, sub-agents, SKILL.md files, and templates for your own coding harness.",
  },
  {
    file: "daily-report",
    badge: "Reporting",
    label: "Daily execution report",
    description: "Nodes processed, data packs stored or deleted, leads processed, leads emailed, open/reply rates.",
  },
  {
    file: "execution-agent",
    badge: "Ops",
    label: "Execution analysis",
    description: "Reads workflow runs by ID, scans failures, and suggests fixes.",
  },
  {
    file: "credentials",
    badge: "Security",
    label: "Your keys, your instance",
    description: "Connectors listed so you configure credentials locally. No keys exposed to Prospect PAL.",
  },
];

const LEADS = [
  {
    company: "NexusFlow Data",
    round: "Series A · $12M",
    stack: ["n8n self-hosted", "HubSpot", "Apollo"],
    trigger: "Hiring GTM Automation Engineer",
    contact: "Marcus Vance, VP RevOps",
  },
  {
    company: "HyperScale AI",
    round: "Series B · $28M",
    stack: ["n8n cloud", "Salesforce", "Clay", "Smartlead"],
    trigger: "Hiring Head of Outbound Growth",
    contact: "Elena Rostova, Head of Growth",
  },
  {
    company: "CloudPulse Systems",
    round: "Seed · $4.5M",
    stack: ["n8n self-hosted", "Attio", "Instantly"],
    trigger: "Hiring Founding GTM Specialist",
    contact: "Devon Chen, Co-founder",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("builder");
  const [activeNodeIndex, setActiveNodeIndex] = useState(2);

  const handleOpenCheckout = (planId: string) => {
    setSelectedPlan(planId);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* Announcement Strip */}
      <div
        style={{
          padding: "10px 32px",
          background: "var(--surface-deep)",
          borderBottom: "1px solid var(--border-deep)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <Badge tone="brand">New</Badge>
        <span style={{ fontSize: "var(--text-caption)", color: "var(--ink-200)" }}>
          <strong style={{ color: "var(--paper-0)" }}>Agent copilot for outbound.</strong> Compile a workflow that runs on
          your n8n, Make, or Gumloop instance.
        </span>
        <a
          href="#process"
          style={{
            fontSize: "var(--text-caption)",
            color: "var(--champagne-300)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          See how it works →
        </a>
      </div>

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
          <Badge tone="brand">Agent copilot</Badge>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {[
            { label: "How it works", href: "#process" },
            { label: "Tools", href: "#tools" },
            { label: "Deliverables", href: "#deliverables" },
            { label: "Pricing", href: "#pricing" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                fontSize: "var(--text-body-sm)",
                fontWeight: 500,
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              {item.label}
            </a>
          ))}
          <Link href="/login">
            <Button variant="outline" size="md">
              Sign in
            </Button>
          </Link>
          <Button variant="accent" size="md" onClick={() => handleOpenCheckout("builder")}>
            Get Prospect PAL
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: "64px 32px 0", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Badge tone="brand" icon="ShieldCheck" style={{ marginBottom: 22 }}>
            BYOK · your instance
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
            Prospect PAL<br />
            <span style={{ color: "var(--cobalt-600)" }}>
              Your agent copilot for building outbound sales motions.
            </span>
          </h1>

          <p
            style={{
              margin: "0 auto 30px",
              fontSize: 19,
              lineHeight: "var(--leading-relaxed)",
              color: "var(--text-secondary)",
              maxWidth: 660,
            }}
          >
            Prospect PAL enables sales teams to book more qualified meetings. We provide an agent copilot tailored to your
            tech stack, product, and ICP, and equip it with skills, sub-agents, and a harness to build an outbound
            automation workflow in n8n, Make, Gumloop, or a custom AI solution that deploys from your instance.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 36 }}>
            <Button variant="accent" size="lg" onClick={() => handleOpenCheckout("builder")}>
              Get Prospect PAL — $99/mo
            </Button>
            <Button variant="outline" size="lg" icon="Play">
              See a compile, 2 min
            </Button>
          </div>

          {/* Hero Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            <StatTile value="Your instance" label="Deploy, don't rent" tone="brand" />
            <StatTile value="100% BYOK" label="Keys stay in your workspace" tone="verified" />
            <StatTile value="Unlimited" label="Campaigns on Team" />
            <StatTile value="Deterministic" label="Templates + your data" />
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
            marginTop: 64,
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
              workflow.json · compiled · approved
            </span>
            <Badge tone="verified">Graph compiled</Badge>
          </div>

          <div style={{ padding: "22px 20px" }}>
            <PipelineRail nodes={NINE_NODES} activeIndex={activeNodeIndex} onSelect={setActiveNodeIndex} />

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
              <Button variant="inverse" icon="Settings2" onClick={() => handleOpenCheckout("builder")}>
                Configure this node
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - NEW */}
      <section id="process" style={{ padding: "80px 32px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <SectionHeading
          eyebrow="Process"
          title="Three inputs. One workflow you own."
          description="The agent compiles your stack, knowledge, and tools into a customized JSON file. Upload it to your workspace and add credentials."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            marginTop: 40,
          }}
        >
          {[
            {
              num: "01",
              title: "Choose your automation platform",
              body: "n8n, Make, Gumloop, or a custom AI solution. We load the language, setup, and documentation for that platform so the agent builds against your stack.",
            },
            {
              num: "02",
              title: "Add your knowledge base",
              body: "Files about your company, ICP, and value proposition. Product pricing and sales cycle are appreciated, not required. Messaging scripts help the agent keep or update your copy. Need help? The agent form walks you through building it out.",
            },
            {
              num: "03",
              title: "Identify your tools",
              body: "List the integrations you have in your automation service, or want in custom tools. Configure them in your credential settings. Keys never leave your instance.",
            },
          ].map((step) => (
            <div
              key={step.num}
              style={{
                padding: "28px 24px",
                background: "var(--surface-card)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-hairline)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "var(--text-h2)",
                  fontWeight: 700,
                  color: "var(--cobalt-500)",
                  marginBottom: 14,
                }}
              >
                {step.num}
              </div>
              <h3
                style={{
                  fontSize: "var(--text-body-lg)",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 10,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "var(--text-body-sm)",
                  color: "var(--text-secondary)",
                  lineHeight: "var(--leading-relaxed)",
                  margin: 0,
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: 24,
            fontSize: "var(--text-caption)",
            color: "var(--text-secondary)",
            textAlign: "center",
          }}
        >
          Prefer hands-off? Connect your account and our AI generates the workflow directly on your platform.
        </p>
      </section>

      {/* Deliverables */}
      <section id="deliverables" style={{ padding: "80px 32px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <SectionHeading
          eyebrow="Production artifacts"
          title="What a compile hands you"
          description="A customized JSON file tailored to your data and workflow templates. Upload to your workspace, add credentials, and run."
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

      {/* Agent Tools - REWRITE */}
      <section
        id="tools"
        style={{
          padding: "72px 32px",
          background: "var(--surface-sunken)",
          borderTop: "1px solid var(--border-hairline)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
          <SectionHeading
            eyebrow="The tools we use"
            title="A harness, not a black box"
            description="Skills and sub-agents that compile a customizable outreach workflow with a deterministic process."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
              marginTop: 36,
            }}
          >
            {AGENT_TOOLS.map((tool) => (
              <IntegrationCard key={tool.name} {...tool} />
            ))}
          </div>
          <p
            style={{
              marginTop: 24,
              fontSize: "var(--text-caption)",
              color: "var(--text-secondary)",
              textAlign: "center",
            }}
          >
            Common connectors: HubSpot, Clay, Amplemarket, Apollo, and the tools already in your automation workspace.
          </p>
        </div>
      </section>

      {/* Pricing Section - REWRITE */}
      <section id="pricing" style={{ padding: "84px 32px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <SectionHeading
          eyebrow="Plans"
          title="Bring your own key. Automate campaigns."
          description="Master agent, canvas, and workspace. No per-lead markup. You own the workflow."
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
            name="DIY skill package"
            price="Download"
            note="Configure your keys"
            description="Agent directory files, sub-agents, SKILL.md files, and templates. Upload into your own coding harness and deploy."
            features={[
              "Agent directory + sub-agents",
              "SKILL.md files and templates",
              "Prospect automation workflow guides",
              "Custom build prompt",
              "You configure keys",
            ]}
            cta={
              <Button variant="outline" fullWidth onClick={() => handleOpenCheckout("package")}>
                Download the package
              </Button>
            }
          />
          <PricingCard
            featured
            name="Team"
            price="$99"
            cadence="/ month"
            note="Cancel anytime · BYOK"
            description="For sales teams, small business owners, and startups. Unlimited sales campaigns with the master agent, canvas, and workspace."
            features={[
              "Agent copilot tailored to stack, product, and ICP",
              "Skills, sub-agents, and harness",
              "Custom JSON from your inputs",
              "Connect and generate on your platform",
              "Daily execution reporting",
              "Unlimited campaigns",
            ]}
            cta={
              <Button variant="accent" fullWidth onClick={() => handleOpenCheckout("builder")}>
                Start Team
              </Button>
            }
          />
          <PricingCard
            tone="sunken"
            name="Elite"
            price="Custom"
            note="White-glove · prompt-to-setup"
            description="For companies that want a customized agent platform or deeper integration with automation tools. Includes setting up the workflow directly from the prompt."
            features={[
              "Everything in Team",
              "Workflow set up from the prompt",
              "Deeper automation-tool integration",
              "Customized agent platform",
              "Dedicated setup",
            ]}
            cta={
              <Button variant="outline" fullWidth onClick={() => handleOpenCheckout("core")}>
                Request Elite
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

      {/* Close - NEW */}
      <section
        id="get-started"
        style={{
          padding: "64px 32px",
          background: "var(--surface-sunken)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div
            style={{
              fontSize: "var(--text-eyebrow)",
              fontWeight: "var(--weight-semibold)",
              color: "var(--text-brand)",
              letterSpacing: "var(--tracking-eyebrow)",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Ready?
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display-2)",
              fontWeight: "var(--weight-bold)",
              letterSpacing: "var(--tracking-display)",
              color: "var(--text-primary)",
              marginBottom: 16,
            }}
          >
            Build your sales motion with an agent copilot
          </h2>
          <p
            style={{
              fontSize: "var(--text-body)",
              color: "var(--text-secondary)",
              marginBottom: 28,
              lineHeight: "var(--leading-relaxed)",
            }}
          >
            Research your leads, generate new ones, send personalized messages, and get accurate reporting.
          </p>
          <Button variant="accent" size="lg" onClick={() => handleOpenCheckout("builder")}>
            Get your Prospect PAL today
          </Button>
        </div>
      </section>

      {/* Signals Section - PARKED */}
      <section id="signals" style={{ padding: "80px 32px", background: "var(--surface-deep)", display: "none" }}>
        <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
          <SectionHeading
            align="left"
            onDeep
            eyebrow="Tech stack intelligence"
            title="Leads that already run n8n"
            description="Stack detection plus hiring intent, so your first line writes itself."
            action={
              <Button variant="inverse" iconRight="ArrowUpRight" onClick={() => handleOpenCheckout("builder")}>
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

      {/* Footer */}
      <footer
        style={{
          padding: "40px 32px",
          borderTop: "1px solid var(--border-hairline)",
          background: "var(--surface-page)",
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
            © 2026 Prospect PAL · GTM automation, compiled and handed over.
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            {[
              { label: "Architecture", href: "#tools" },
              { label: "Security", href: "#" },
              { label: "Docs", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontSize: "var(--text-caption)",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                }}
              >
                {link.label}
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
