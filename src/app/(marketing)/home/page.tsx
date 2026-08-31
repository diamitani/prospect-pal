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

      {/* Hero Section - Premium Split-Screen Layout */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {/* Background Grid Pattern */}
        <div className="tastyskill-grid" style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
          backgroundSize: "40px 40px",
          zIndex: 0
        }} />

        {/* Animated Gradient Orb */}
        <div className="tastyskill-orb" style={{
          position: "absolute", top: "10%", right: "10%",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.15), transparent 60%)",
          borderRadius: "50%",
          zIndex: 1
        }} />

        <div style={{
          display: "flex", alignItems: "center", gap: "64px",
          maxWidth: "var(--layout-max)", width: "100%",
          padding: "0 32px", position: "relative", zIndex: 2
        }}>
          {/* Left Column - Headlines & Copy */}
          <div style={{ flex: 1, maxWidth: "600px" }}>
            <Badge tone="brand" icon="ShieldCheck" style={{ marginBottom: 24, display: "inline-flex" }}>
              BYOK · your instance
            </Badge>

            <h1
              style={{
                margin: "0 0 24px",
                fontFamily: "var(--font-display)",
                fontWeight: "var(--weight-bold)",
                fontSize: "clamp(48px, 6vw, 88px)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Prospect Automation
              <br />
              <span style={{ color: "#2563EB" }}>Engine</span>
            </h1>

            <p
              style={{
                margin: "0 0 32px",
                fontSize: 22,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                maxWidth: "480px",
              }}
            >
              Your custom AI agents compile <strong>n8n</strong>, <strong>Make</strong>, or <strong>Gumloop</strong> workflows from prompts. BYOK—your platform,
              your credentials, your instances.
            </p>

            <div style={{ display: "flex", gap: 16 }}>
              <Link href="/checkout?plan=pro" className="focus-outline">
                <Button variant="brand" size="lg">
                  Get started
                </Button>
              </Link>
              <Link href="#how" className="focus-outline">
                <Button variant="secondary" size="lg" icon="ArrowRight">
                  See demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - PipelineRail Diagram */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "var(--shadow-xl)",
              position: "relative",
              margin: "0 auto"
            }}>
              <h3 style={{
                margin: "0 0 24px",
                fontSize: "20px",
                fontWeight: "var(--weight-semibold)",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px", height: "32px",
                  background: "#2563EB",
                  borderRadius: "8px",
                  color: "white"
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                  </svg>
                </span>
                9-Node Workflow Pipeline
              </h3>

              <PipelineRail
                nodes={PIPELINE_NODES}
                interactive={true}
                style={{
                  background: "var(--surface-card)",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "none"
                }}
                onNodeSelect={(index) => setActiveNodeIndex(index)}
              />

              <div style={{
                marginTop: "24px",
                paddingTop: "24px",
                borderTop: "1px solid var(--border-color)"
              }}>
                {activeNodeIndex !== null && PIPELINE_NODES[activeNodeIndex] && (
                  <div style={{ animation: "fadeIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
                    <h4 style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: "var(--weight-semibold)", color: "#2563EB" }}>
                      {PIPELINE_NODES[activeNodeIndex].title}
                    </h4>
                    <p style={{ margin: 0, fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {PIPELINE_NODES[activeNodeIndex].tooltip}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`\n          @media (max-width: 960px) {\n            section > div {\n              flex-direction: column !important;\n              gap: 48px !important;\n              text-align: center !important;\n            }\n            h1 {\n              font-size: clamp(36px, 10vw, 56px) !important;\n            }\n          }\n        `}</style>
      </section>