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
  PricingCard,
  PipelineRail,
  PipelineNode,
} from "@/components/ds";

const PIPELINE_NODES: PipelineNode[] = [
  {
    title: "Trigger & Cron",
    subtitle: "Lead ingest",
    icon: "Zap",
    stage: "trigger",
    binding: "n8n-nodes-base.cron",
    tooltip: "Dynamic trigger: scheduled pulls, CRM webhooks, or direct prompt ingestion for continuous prospect discovery without manual imports.",
  },
  {
    title: "Data Normalizer",
    subtitle: "Schema clean",
    icon: "FileCode",
    stage: "logic",
    binding: "n8n-nodes-base.set",
    tooltip: "Standardizes messy input schemas, sanitizes company URLs, formats domains, and validates required variables for downstream agents.",
  },
  {
    title: "CRM Dedupe Shield",
    subtitle: "Deal safety",
    icon: "ShieldCheck",
    stage: "shield",
    binding: "n8n-nodes-base.hubspot",
    tooltip: "Checks contacts against Twenty CRM, HubSpot, and Salesforce in real-time. Automatically excludes existing accounts, open deals, and opt-outs.",
  },
  {
    title: "Contact Reveal",
    subtitle: "Data adapter",
    icon: "Search",
    stage: "data",
    binding: "n8n-nodes-base.apollo",
    tooltip: "Surfaces verified work emails and direct phones matching target ICP personas (VP RevOps, Head of Growth, CTO) via Apollo, Clay, and ZoomInfo.",
  },
  {
    title: "Company Intel",
    subtitle: "Deep research",
    icon: "Globe",
    stage: "ai",
    binding: "n8n-nodes-base.openai",
    tooltip: "Autonomous AI agent analyzes company filings, tech stacks, open job postings, and recent PR to identify specific buying triggers.",
  },
  {
    title: "PAS Copywriter",
    subtitle: "Hyper-personal",
    icon: "Sparkles",
    stage: "ai",
    binding: "n8n-nodes-base.openai",
    tooltip: "Drafts high-converting Problem-Agitate-Solution cold copy personalized to individual pain points with zero generic AI tropes.",
  },
  {
    title: "CRM Contact Sync",
    subtitle: "Auto upsert",
    icon: "Database",
    stage: "shield",
    binding: "n8n-nodes-base.hubspot",
    tooltip: "Creates or updates records in Twenty CRM or HubSpot with full enrichment attributes, research summaries, and message drafts.",
  },
  {
    title: "Sequence Enrollment",
    subtitle: "Smart send",
    icon: "Send",
    stage: "sequence",
    binding: "n8n-nodes-base.smartlead",
    tooltip: "Enrolls contacts into Smartlead, Instantly, or native sequences with scheduled intervals, mailbox warm-up safety, and reply tracking.",
  },
];

const ECOSYSTEM_STACK = [
  { name: "Twenty CRM", category: "Open Source CRM", badge: "Live Sync", icon: "Database" as const },
  { name: "HubSpot", category: "CRM & Sequences", badge: "Native", icon: "Layers" as const },
  { name: "n8n", category: "Self-Hosted & Cloud", badge: "Engine", icon: "Workflow" as const },
  { name: "Apollo.io", category: "275M+ Contacts", badge: "Adapter", icon: "Search" as const },
  { name: "Clay", category: "Data Enrichment", badge: "Waterfall", icon: "Sparkles" as const },
  { name: "Smartlead", category: "Cold Outreach", badge: "Sequencer", icon: "Send" as const },
  { name: "AWS Bedrock", category: "Claude & Titan", badge: "BYOK AI", icon: "Cpu" as const },
  { name: "OpenAI", category: "GPT-4o & Embeddings", badge: "BYOK AI", icon: "Zap" as const },
];

const BENTO_FEATURES = [
  {
    title: "Zero-Knowledge BYOK Security",
    category: "Architecture",
    desc: "Your API keys and credentials live entirely in your private environment or self-hosted instance. Prospect PAL never stores keys or sends emails on your behalf.",
    icon: "Lock" as const,
    stat: "100%",
    statLabel: "Local key isolation",
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    title: "CRM Dedupe & Deal Protection",
    category: "Safety Shield",
    desc: "Active shields query Twenty CRM, HubSpot, and Salesforce before outreach to prevent reaching existing clients or live pipeline deals.",
    icon: "ShieldCheck" as const,
    stat: "0",
    statLabel: "Double-touch incidents",
    colSpan: "col-span-1",
  },
  {
    title: "Autonomous 9-Node Compilation",
    category: "Compiler Engine",
    desc: "Compile production-grade workflow JSON from natural language prompts. Validated against real node schemas for n8n, Make, and Gumloop.",
    icon: "Workflow" as const,
    stat: "3 sec",
    statLabel: "Prompt-to-JSON",
    colSpan: "col-span-1",
  },
  {
    title: "Real-Time Execution Diagnostics",
    category: "Ops & Telemetry",
    desc: "Execution agents scan workflow runs by ID, detect node failure points, diagnose API rate limits, and provide automatic repair instructions.",
    icon: "Activity" as const,
    stat: "99.9%",
    statLabel: "Execution reliability",
    colSpan: "col-span-1 md:col-span-2",
  },
];

export default function HomePage() {
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const selectedNode = PIPELINE_NODES[activeNodeIndex] || PIPELINE_NODES[0];

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)", color: "var(--text-primary)", overflowX: "hidden" }}>
      
      {/* ── Top Announcement Banner ── */}
      <div
        style={{
          background: "linear-gradient(90deg, #0B0F16 0%, #101B2D 50%, #0B0F16 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          fontSize: "13px",
          color: "#E2E6EE",
        }}
      >
        <span
          style={{
            background: "rgba(58, 86, 228, 0.25)",
            border: "1px solid rgba(141, 162, 251, 0.4)",
            color: "#8DA2FB",
            fontSize: "11px",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "100px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          v2.4 Release
        </span>
        <span>
          <strong>Twenty CRM & n8n Cloud Integration Live.</strong> Compile verified outbound flows in seconds.
        </span>
        <a
          href="#process"
          style={{
            color: "#D9B968",
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Explore architecture →
        </a>
      </div>

      {/* ── Floating Minimalist Navigation ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(251, 250, 248, 0.88)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            height: "70px",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link href="/home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <Logo size={32} />
            </Link>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--cobalt-600)",
                background: "var(--cobalt-50)",
                border: "1px solid var(--cobalt-200)",
                padding: "3px 9px",
                borderRadius: "100px",
                letterSpacing: "0.02em",
              }}
            >
              BYOK Engine
            </span>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 28 }} className="hidden md:flex">
            {[
              { label: "Pipeline", href: "#pipeline" },
              { label: "Integrations", href: "#integrations" },
              { label: "How It Works", href: "#process" },
              { label: "Capabilities", href: "#capabilities" },
              { label: "Pricing", href: "#pricing" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
                className="hover:text-[#0B0F16]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/checkout?plan=pro" style={{ textDecoration: "none" }}>
              <Button variant="accent" size="sm" iconRight="ArrowRight">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── SaaS Minimal Hero Section ── */}
      <section
        id="pipeline"
        style={{
          position: "relative",
          padding: "72px 24px 84px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Subtle Ambient Radial Lighting */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "450px",
            background: "radial-gradient(ellipse at center, rgba(58, 86, 228, 0.12), transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "860px", margin: "0 auto 56px" }}>
          
          {/* Eyebrow Pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: "100px", background: "var(--surface-card)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-hairline)", marginBottom: "24px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink-700)", letterSpacing: "0.02em" }}>
              Autonomous Outbound GTM Architecture
            </span>
          </div>

          {/* Display Headline */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(38px, 5.5vw, 64px)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
              color: "var(--ink-900)",
              margin: "0 0 20px",
            }}
          >
            The GTM Automation Engine for{" "}
            <span style={{ color: "var(--cobalt-600)", display: "inline-block" }}>
              Modern Outbound
            </span>
          </h1>

          {/* Subheadline (Restrained, max 20 words) */}
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 19px)",
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              maxWidth: "640px",
              margin: "0 auto 36px",
            }}
          >
            Your custom AI agents compile, test, and sync 9-node production workflows directly to your <strong>n8n</strong>, <strong>Make</strong>, or <strong>Twenty CRM</strong> instance.
          </p>

          {/* Dual CTAs */}
          <div style={{ display: "flex", gap: 14, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/checkout?plan=pro" style={{ textDecoration: "none" }}>
              <Button variant="accent" size="lg" iconRight="ArrowRight">
                Build your workflow
              </Button>
            </Link>
            <Link href="#how" style={{ textDecoration: "none" }}>
              <Button variant="outline" size="lg" icon="Workflow">
                View workflow template
              </Button>
            </Link>
          </div>

          {/* Security Note */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 22, fontSize: "12px", color: "var(--text-muted)" }}>
            <Icon name="ShieldCheck" size={14} color="var(--signal-verified)" />
            <span>100% BYOK · Zero credential exposure · Instant JSON export</span>
          </div>
        </div>

        {/* ── Interactive Hero Canvas: 9-Node Pipeline Preview ── */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            background: "var(--surface-card)",
            borderRadius: "24px",
            border: "1px solid var(--border-strong)",
            boxShadow: "0 24px 60px -12px rgba(11, 15, 22, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
          }}
        >
          {/* Mock Window Chrome */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 24px",
              background: "var(--surface-sunken)",
              borderBottom: "1px solid var(--border-hairline)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F56" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#27C93F" }} />
              <span style={{ marginLeft: 12, fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-mono, monospace)" }}>
                prospect-engine-pipeline.json
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#059669",
                  background: "rgba(16, 185, 129, 0.12)",
                  padding: "3px 10px",
                  borderRadius: "100px",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                Compiler Ready
              </span>
            </div>
          </div>

          {/* Interactive Pipeline Rail */}
          <div style={{ padding: "28px 24px 18px" }}>
            <PipelineRail
              nodes={PIPELINE_NODES}
              activeIndex={activeNodeIndex}
              onSelect={(index: number) => setActiveNodeIndex(index)}
              onDeep={false}
            />
          </div>

          {/* Active Node Detail Inspector Panel */}
          <div
            style={{
              padding: "20px 28px",
              background: "linear-gradient(180deg, var(--surface-sunken) 0%, var(--surface-card) 100%)",
              borderTop: "1px solid var(--border-hairline)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "var(--cobalt-500)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(58, 86, 228, 0.25)",
                }}
              >
                <Icon name={selectedNode.icon} size={20} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink-900)" }}>
                    Step 0{activeNodeIndex + 1}: {selectedNode.title}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: "var(--font-mono, monospace)",
                      color: "var(--cobalt-600)",
                      background: "var(--cobalt-50)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {selectedNode.binding}
                  </span>
                </div>
                <p style={{ margin: "3px 0 0", fontSize: "13px", color: "var(--text-secondary)", maxWidth: "680px", lineHeight: 1.5 }}>
                  {selectedNode.tooltip}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/templates" style={{ textDecoration: "none" }}>
                <Button variant="outline" size="sm" iconRight="ArrowUpRight">
                  Inspect JSON
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ecosystem Integrations Strip ── */}
      <section
        id="integrations"
        style={{
          borderTop: "1px solid var(--border-hairline)",
          borderBottom: "1px solid var(--border-hairline)",
          background: "var(--surface-sunken)",
          padding: "48px 24px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--text-muted)",
              margin: "0 0 28px",
            }}
          >
            Connects seamlessly with your self-hosted & cloud stack
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "16px",
              alignItems: "center",
            }}
          >
            {ECOSYSTEM_STACK.map((tool) => (
              <div
                key={tool.name}
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-hairline)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                className="hover:-translate-y-0.5 hover:shadow-sm"
              >
                <Icon name={tool.icon} size={20} color="var(--cobalt-600)" style={{ marginBottom: 8 }} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink-900)" }}>{tool.name}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: 2 }}>{tool.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3-Step Compilation Process ── */}
      <section
        id="process"
        style={{
          padding: "96px 24px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <SectionHeading
          eyebrow="Workflow Compiler"
          title="Three simple inputs. One production pipeline you own."
          description="The master agent transforms your ICP criteria, CRM schema, and messaging strategy into standard JSON ready for one-click import."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            marginTop: "48px",
          }}
        >
          {[
            {
              num: "01",
              title: "Connect Your Stack",
              badge: "Twenty CRM · HubSpot · n8n",
              desc: "Choose whether you run on Twenty CRM, HubSpot, or Salesforce, and specify your execution environment (n8n Cloud, Docker self-hosted, Make, or Gumloop).",
            },
            {
              num: "02",
              title: "Define ICP & Strategy",
              badge: "Personas · Pain Points · Triggers",
              desc: "Provide target personas, buyer signals, and value props. The system compiles dedicated AI research and Problem-Agitate-Solution copy templates.",
            },
            {
              num: "03",
              title: "Deploy & Execute Locally",
              badge: "100% BYOK · Zero Lock-In",
              desc: "Receive production workflow JSON. Import directly into your automation engine, configure API keys locally, and run without per-lead markups.",
            },
          ].map((step) => (
            <div
              key={step.num}
              style={{
                background: "var(--surface-card)",
                borderRadius: "20px",
                border: "1px solid var(--border-strong)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "var(--cobalt-500)",
                  lineHeight: 1,
                  marginBottom: "16px",
                }}
              >
                {step.num}
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink-900)", margin: "0 0 8px" }}>
                {step.title}
              </h3>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--cobalt-600)", background: "var(--cobalt-50)", padding: "3px 8px", borderRadius: "6px", width: "fit-content", marginBottom: "14px" }}>
                {step.badge}
              </div>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--text-secondary)", margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bento Grid Capabilities ── */}
      <section
        id="capabilities"
        style={{
          background: "var(--surface-sunken)",
          padding: "96px 24px",
          borderTop: "1px solid var(--border-hairline)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <SectionHeading
            eyebrow="Architectural Integrity"
            title="Engineered for high-volume, precision outbound."
            description="Eliminate deal collisions, automate research, and keep your credentials securely on your own servers."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
              marginTop: "48px",
            }}
          >
            {BENTO_FEATURES.map((feat) => (
              <div
                key={feat.title}
                style={{
                  background: "var(--surface-card)",
                  borderRadius: "20px",
                  border: "1px solid var(--border-hairline)",
                  padding: "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: "var(--cobalt-50)",
                        color: "var(--cobalt-600)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name={feat.icon} size={18} />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {feat.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink-900)", margin: "0 0 10px" }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--text-secondary)", margin: 0 }}>
                    {feat.desc}
                  </p>
                </div>

                <div style={{ marginTop: "28px", paddingTop: "18px", borderTop: "1px solid var(--border-hairline)", display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--cobalt-600)", fontFamily: "var(--font-display)" }}>
                    {feat.stat}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {feat.statLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Matrix ── */}
      <section
        id="pricing"
        style={{
          padding: "96px 24px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <SectionHeading
          eyebrow="Transparent Pricing"
          title="Bring your own keys. Own your workflows forever."
          description="Zero per-lead surcharges. Full access to the master agent compiler, skills, and export templates."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            marginTop: "48px",
            alignItems: "stretch",
          }}
        >
          <PricingCard
            name="DIY Skill Package"
            price="$19.99"
            note="One-time payment · Local setup"
            description="Agent directory, sub-agents, SKILL.md specs, and prompt templates to run inside your own coding harness."
            features={[
              "Full agent skill package & templates",
              "9-node prospect workflow guides",
              "Custom build prompt generator",
              "Zero runtime dependencies",
              "Configure keys locally",
            ]}
            cta={
              <Link href="/packages" style={{ textDecoration: "none" }}>
                <Button variant="outline" fullWidth>
                  Get DIY Package — $19.99
                </Button>
              </Link>
            }
          />

          <PricingCard
            featured
            name="Team Edition"
            price="$99"
            cadence="/ month"
            note="Cancel anytime · 100% BYOK"
            description="For growth teams and agencies scaling outbound. Unlimited campaign generation with master compiler and live execution reporting."
            features={[
              "Agent copilot tailored to stack & ICP",
              "Twenty CRM, HubSpot & Salesforce sync",
              "Continuous daily execution triage",
              "Multi-platform JSON generator",
              "Daily execution & reply reports",
              "Unlimited custom campaigns",
            ]}
            cta={
              <Link href="/checkout?plan=pro" style={{ textDecoration: "none" }}>
                <Button variant="accent" fullWidth iconRight="ArrowRight">
                  Start Team Plan
                </Button>
              </Link>
            }
          />

          <PricingCard
            tone="sunken"
            name="Enterprise Custom"
            price="Custom"
            note="White-glove architecture"
            description="For organizations requiring customized agent platform harnesses, private VPC deployment, and hands-on GTM engineering."
            features={[
              "Everything in Team Edition",
              "Dedicated GTM automation setup",
              "Custom connector development",
              "Private VPC / Air-gapped deployment",
              "Priority engineering SLAs",
            ]}
            cta={
              <Link href="/checkout?plan=core" style={{ textDecoration: "none" }}>
                <Button variant="outline" fullWidth>
                  Contact Enterprise
                </Button>
              </Link>
            }
          />
        </div>
      </section>

      {/* ── Closing Magnetic CTA ── */}
      <section
        style={{
          background: "linear-gradient(180deg, var(--surface-sunken) 0%, #0B0F16 100%)",
          color: "#FFFFFF",
          padding: "96px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#8DA2FB",
              marginBottom: "16px",
            }}
          >
            Ready to Automate?
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4.5vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              margin: "0 0 18px",
            }}
          >
            Build your high-converting sales motion in minutes
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#98A2B3",
              lineHeight: 1.6,
              margin: "0 auto 36px",
              maxWidth: "520px",
            }}
          >
            Research target accounts, filter out existing pipeline, write bespoke emails, and sync automatically to your CRM.
          </p>

          <Link href="/checkout?plan=pro" style={{ textDecoration: "none" }}>
            <Button variant="accent" size="lg" iconRight="ArrowRight">
              Build your first workflow
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Minimalist SaaS Footer ── */}
      <footer
        style={{
          background: "#0B0F16",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "48px 24px",
          color: "#98A2B3",
          fontSize: "13px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Logo size={24} />
            <span>© 2026 Prospect PAL. Sovereign GTM automation engine.</span>
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "Pipeline", href: "#pipeline" },
              { label: "Integrations", href: "#integrations" },
              { label: "Pricing", href: "#pricing" },
              { label: "Templates", href: "/templates" },
              { label: "Security", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  color: "#98A2B3",
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
                className="hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
