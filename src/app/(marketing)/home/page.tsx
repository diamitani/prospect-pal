"use client";

import { useState } from "react";
import Link from "next/link";
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
  NodeCard,
} from "@/components/ds";

const PIPELINE_NODES: PipelineNode[] = [
  {
    title: "Intake & cron",
    subtitle: "Trigger source",
    icon: "Zap",
    stage: "trigger",
    binding: "n8n-nodes-base.cron",
    tooltip: "Choose how leads enter: webhook from your LLM chat that sends data from prompts or file uploads, a scheduled pull from your CRM to enrich existing companies, or a daily trigger that finds new leads from your ICP and dedupes against your contact list.",
  },
  {
    title: "Data normalizer",
    subtitle: "Schema transform",
    icon: "FileBraces",
    stage: "logic",
    binding: "n8n-nodes-base.set",
    tooltip: "Cleans up messy data from different sources. Standardizes company names, fixes formatting, and makes sure every lead has the fields your workflow needs before moving forward.",
  },
  {
    title: "CRM dedupe shield",
    subtitle: "Deal protection",
    icon: "ShieldCheck",
    stage: "shield",
    binding: "n8n-nodes-base.hubspot",
    tooltip: "Protects your existing deals. Checks every lead against your CRM to make sure you're not reaching out to companies already in your pipeline or past customers. Prevents embarrassing double-touches.",
  },
  {
    title: "Data tool adapter",
    subtitle: "Contact reveal",
    icon: "Search",
    stage: "data",
    binding: "n8n-nodes-base.apollo",
    tooltip: "Finds the right people at target companies. Uses Apollo, Clay, or ZoomInfo to pull verified emails for your target personas (VP Engineering, Head of Sales, etc.) and enriches company data.",
  },
  {
    title: "AI research",
    subtitle: "Company intel",
    icon: "Search",
    stage: "ai",
    binding: "n8n-nodes-base.openai",
    tooltip: "Researches each company using AI. Reads their website, recent news, and LinkedIn to find pain points, tech stack, and triggers that match your solution.",
  },
  {
    title: "Email copywriter",
    subtitle: "Personalized copy",
    icon: "Sparkles",
    stage: "ai",
    binding: "n8n-nodes-base.openai",
    tooltip: "Writes personalized emails using the research. Creates Problem-Agitate-Solution copy tailored to each prospect's specific situation and pain points.",
  },
  {
    title: "CRM contact create",
    subtitle: "Lead sync",
    icon: "Database",
    stage: "shield",
    binding: "n8n-nodes-base.hubspot",
    tooltip: "Adds approved leads to your CRM as contacts. Creates or updates records with all the enriched data, research notes, and email copy so your sales team has full context when they follow up.",
  },
  {
    title: "Sequence enrollment",
    subtitle: "Outreach start",
    icon: "Send",
    stage: "sequence",
    binding: "n8n-nodes-base.smartlead",
    tooltip: "Enrolls contacts into your email sequence. Connects to Smartlead, Instantly, or HubSpot Sequences to start sending the personalized emails on your schedule (immediate, next day, custom timing).",
  },
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
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);

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
          <Link href="/checkout?plan=pro">
            <Button variant="accent" size="md">
              Get started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: "80px 32px 0", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 840, margin: "0 auto 64px" }}>
          <Badge tone="brand" icon="ShieldCheck" style={{ marginBottom: 20 }}>
            BYOK · your instance
          </Badge>

          <h1
            style={{
              margin: "0 0 24px",
              fontFamily: "var(--font-display)",
              fontWeight: "var(--weight-bold)",
              fontSize: 68,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--text-primary)",
            }}
          >
            Your agent copilot for{" "}
            <span style={{ color: "var(--cobalt-600)" }}>outbound sales</span>
          </h1>

          <p
            style={{
              margin: "0 auto 40px",
              fontSize: 21,
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              maxWidth: 680,
            }}
          >
            Build automation workflows in n8n, Make, or Gumloop. Tailored to your stack, product, and ICP. Deploy from
            your instance.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center", marginBottom: 48 }}>
            <Link href="/checkout?plan=pro">
              <Button variant="accent" size="lg">
                Build your first workflow
              </Button>
            </Link>
          </div>

          {/* Hero Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            <StatTile value="Your instance" label="Deploy, don't rent" tone="brand" />
            <StatTile value="100% BYOK" label="Keys stay local" tone="verified" />
            <StatTile value="Unlimited" label="Campaigns" />
            <StatTile value="Deterministic" label="Template-driven" />
          </div>
        </div>

        {/* Architecture Diagram - 9-Node Workflow */}
        <div
          style={{
            background: "var(--surface-card)",
            borderRadius: "var(--radius-2xl)",
            border: "1px solid var(--border-hairline)",
            boxShadow: "var(--shadow-card)",
            padding: "40px 32px",
            marginTop: 64,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 32,
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "var(--text-body-lg)",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                8-Node Pipeline Architecture
              </h3>
              <p
                style={{
                  fontSize: "var(--text-body-sm)",
                  color: "var(--text-secondary)",
                  margin: "6px 0 0",
                }}
              >
                Click any node to see details
              </p>
            </div>
            <Badge tone="verified">Graph compiled</Badge>
          </div>

          {/* Selected Node Details Panel - Prominent at top */}
          <div
            style={{
              padding: "20px 24px",
              borderRadius: "var(--radius-xl)",
              background: "var(--cobalt-50)",
              border: "2px solid var(--cobalt-200)",
              marginBottom: 28,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: "var(--text-h3)",
                      fontWeight: 700,
                      color: "var(--cobalt-600)",
                    }}
                  >
                    {String(activeNodeIndex + 1).padStart(2, "0")}
                  </span>
                  <h4
                    style={{
                      fontSize: "var(--text-body-lg)",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {PIPELINE_NODES[activeNodeIndex].title}
                  </h4>
                  <span
                    style={{
                      fontSize: "var(--text-caption)",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    {PIPELINE_NODES[activeNodeIndex].subtitle}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--text-secondary)",
                    lineHeight: "var(--leading-relaxed)",
                    margin: 0,
                  }}
                >
                  {PIPELINE_NODES[activeNodeIndex].tooltip}
                </p>
              </div>
              <Link href="/checkout?plan=pro">
                <Button variant="primary" icon="Settings2" size="sm">
                  Configure
                </Button>
              </Link>
            </div>
          </div>

          {/* 4+3 Grid Architecture */}
          <div style={{ position: "relative" }}>
            {/* Row 1: 4 nodes - Intake & Process */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr",
                alignItems: "center",
                gap: 0,
                marginBottom: 20,
              }}
            >
              <NodeCard
                step={1}
                title={PIPELINE_NODES[0].title}
                subtitle={PIPELINE_NODES[0].subtitle}
                icon={PIPELINE_NODES[0].icon}
                stage={PIPELINE_NODES[0].stage}
                selected={activeNodeIndex === 0}
                onDeep={false}
                onClick={() => setActiveNodeIndex(0)}
                style={{ minWidth: "auto" }}
              />
              <div style={{ padding: "0 8px", color: "var(--text-muted)" }}>
                <Icon name="ArrowRight" size={18} />
              </div>
              <NodeCard
                step={2}
                title={PIPELINE_NODES[1].title}
                subtitle={PIPELINE_NODES[1].subtitle}
                icon={PIPELINE_NODES[1].icon}
                stage={PIPELINE_NODES[1].stage}
                selected={activeNodeIndex === 1}
                onDeep={false}
                onClick={() => setActiveNodeIndex(1)}
                style={{ minWidth: "auto" }}
              />
              <div style={{ padding: "0 8px", color: "var(--text-muted)" }}>
                <Icon name="ArrowRight" size={18} />
              </div>
              <NodeCard
                step={3}
                title={PIPELINE_NODES[2].title}
                subtitle={PIPELINE_NODES[2].subtitle}
                icon={PIPELINE_NODES[2].icon}
                stage={PIPELINE_NODES[2].stage}
                selected={activeNodeIndex === 2}
                onDeep={false}
                onClick={() => setActiveNodeIndex(2)}
                style={{ minWidth: "auto" }}
              />
              <div style={{ padding: "0 8px", color: "var(--text-muted)" }}>
                <Icon name="ArrowRight" size={18} />
              </div>
              <NodeCard
                step={4}
                title={PIPELINE_NODES[3].title}
                subtitle={PIPELINE_NODES[3].subtitle}
                icon={PIPELINE_NODES[3].icon}
                stage={PIPELINE_NODES[3].stage}
                selected={activeNodeIndex === 3}
                onDeep={false}
                onClick={() => setActiveNodeIndex(3)}
                style={{ minWidth: "auto" }}
              />
            </div>

            {/* Vertical connector */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: "calc(12.5% - 10px)",
                marginBottom: 20,
              }}
            >
              <Icon name="ArrowDown" size={20} color="var(--text-muted)" />
            </div>

            {/* Row 2: 4 nodes - AI & Output (reversed for snake flow: 08 ← 07 ← 06 ← 05) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr",
                alignItems: "center",
                gap: 0,
              }}
            >
              <NodeCard
                step={8}
                title={PIPELINE_NODES[7].title}
                subtitle={PIPELINE_NODES[7].subtitle}
                icon={PIPELINE_NODES[7].icon}
                stage={PIPELINE_NODES[7].stage}
                selected={activeNodeIndex === 7}
                onDeep={false}
                onClick={() => setActiveNodeIndex(7)}
                style={{ minWidth: "auto" }}
              />
              <div style={{ padding: "0 8px", color: "var(--text-muted)" }}>
                <Icon name="ArrowLeft" size={18} />
              </div>
              <NodeCard
                step={7}
                title={PIPELINE_NODES[6].title}
                subtitle={PIPELINE_NODES[6].subtitle}
                icon={PIPELINE_NODES[6].icon}
                stage={PIPELINE_NODES[6].stage}
                selected={activeNodeIndex === 6}
                onDeep={false}
                onClick={() => setActiveNodeIndex(6)}
                style={{ minWidth: "auto" }}
              />
              <div style={{ padding: "0 8px", color: "var(--text-muted)" }}>
                <Icon name="ArrowLeft" size={18} />
              </div>
              <NodeCard
                step={6}
                title={PIPELINE_NODES[5].title}
                subtitle={PIPELINE_NODES[5].subtitle}
                icon={PIPELINE_NODES[5].icon}
                stage={PIPELINE_NODES[5].stage}
                selected={activeNodeIndex === 5}
                onDeep={false}
                onClick={() => setActiveNodeIndex(5)}
                style={{ minWidth: "auto" }}
              />
              <div style={{ padding: "0 8px", color: "var(--text-muted)" }}>
                <Icon name="ArrowLeft" size={18} />
              </div>
              <NodeCard
                step={5}
                title={PIPELINE_NODES[4].title}
                subtitle={PIPELINE_NODES[4].subtitle}
                icon={PIPELINE_NODES[4].icon}
                stage={PIPELINE_NODES[4].stage}
                selected={activeNodeIndex === 4}
                onDeep={false}
                onClick={() => setActiveNodeIndex(4)}
                style={{ minWidth: "auto" }}
              />
            </div>
          </div>

          {/* See the workflow link */}
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link
              href="/templates"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "var(--cobalt-600)",
                fontSize: "var(--text-body-sm)",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              <Icon name="FileBraces" size={18} />
              See the workflow template
              <Icon name="ArrowRight" size={16} />
            </Link>
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
            price="$19.99"
            note="One-time · Configure your keys"
            description="Agent directory files, sub-agents, SKILL.md files, and templates. Upload into your own coding harness and deploy."
            features={[
              "Agent directory + sub-agents",
              "SKILL.md files and templates",
              "Prospect automation workflow guides",
              "Custom build prompt",
              "You configure keys",
            ]}
            cta={
              <Link href="/packages">
                <Button variant="outline" fullWidth>
                  View package — $19.99
                </Button>
              </Link>
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
              <Link href="/checkout?plan=pro">
                <Button variant="accent" fullWidth>
                  Start Team
                </Button>
              </Link>
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
              <Link href="/checkout?plan=core">
                <Button variant="outline" fullWidth>
                  Request Elite
                </Button>
              </Link>
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
          <Link href="/checkout?plan=pro">
            <Button variant="accent" size="lg">
              Build your first workflow
            </Button>
          </Link>
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
              <Link href="/checkout?plan=pro">
                <Button variant="inverse" iconRight="ArrowUpRight">
                  Access live signals
                </Button>
              </Link>
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

    </>
  );
}
