"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Zap,
  Database,
  Search,
  FileCode,
  Send,
  Cpu,
  Lock,
  Activity,
  Workflow,
  ArrowRight,
  Copy,
  Play,
  AlertCircle,
  Globe,
  CheckCircle2,
} from "lucide-react";

// ── Types ──
interface PipelineNode {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  stage: "trigger" | "shield" | "data" | "ai" | "sequence" | "ops";
  icon: typeof Zap;
  binding: string;
  badge: string;
  description: string;
  outputPreview: string;
}

interface BentoItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  stat: string;
  statLabel: string;
  icon: typeof Zap;
  colSpan: string;
  badge?: string;
}

// ── 9-Node Pipeline Definitions ──
const PIPELINE_NODES: PipelineNode[] = [
  {
    id: "01-trigger",
    step: 1,
    title: "Trigger & Cron Ingest",
    subtitle: "Automated Lead Capture",
    stage: "trigger",
    icon: Zap,
    binding: "n8n-nodes-base.cron",
    badge: "Ingest",
    description: "Scheduled crons, CRM webhooks, or natural language prompts discover new prospects continuously without manual CSV exports.",
    outputPreview: "{\n  \"source\": \"apollo_search\",\n  \"batch_id\": \"b_99182\",\n  \"discovered\": 150,\n  \"status\": \"READY_FOR_CLEAN\"\n}",
  },
  {
    id: "02-normalizer",
    step: 2,
    title: "Data Normalizer",
    subtitle: "Schema Sanitization",
    stage: "trigger",
    icon: FileCode,
    binding: "n8n-nodes-base.set",
    badge: "Clean",
    description: "Sanitizes messy input schemas, extracts clean root domains, standardizes job titles, and strips invalid characters.",
    outputPreview: "{\n  \"domain\": \"datadog.com\",\n  \"normalized_title\": \"VP Engineering\",\n  \"clean_name\": \"Sarah Jenkins\",\n  \"valid\": true\n}",
  },
  {
    id: "03-crm-shield",
    step: 3,
    title: "CRM Dedupe Shield",
    subtitle: "Deal Collision Defense",
    stage: "shield",
    icon: ShieldCheck,
    binding: "n8n-nodes-base.hubspot",
    badge: "Zero-Collision",
    description: "Active shields query Twenty CRM, HubSpot, and Salesforce in real-time. Automatically drops active opportunities, open accounts, and opt-outs.",
    outputPreview: "{\n  \"crm_check\": \"TWENTY_CRM\",\n  \"existing_account\": false,\n  \"open_opportunity\": false,\n  \"opted_out\": false,\n  \"decision\": \"PROCEED\"\n}",
  },
  {
    id: "04-waterfall",
    step: 4,
    title: "Waterfall Contact Reveal",
    subtitle: "Multi-Source Enrichment",
    stage: "data",
    icon: Search,
    binding: "n8n-nodes-base.apollo",
    badge: "94.8% Match",
    description: "Cascades through Apollo, Clay, Prospeo, and Dropcontact to find verified work emails and direct dials with live SMTP bounce checks.",
    outputPreview: "{\n  \"provider\": \"apollo_clay_waterfall\",\n  \"email\": \"s.jenkins@datadog.com\",\n  \"smtp_check\": \"VALID_DELIVERABLE\",\n  \"confidence\": 0.98\n}",
  },
  {
    id: "05-research",
    step: 5,
    title: "Deep Account Research",
    subtitle: "Company Telemetry",
    stage: "ai",
    icon: Globe,
    binding: "n8n-nodes-base.openai",
    badge: "Telemetry",
    description: "Autonomous agents scrape latest 10-K filings, open engineering job postings, tech stacks, and PR to extract specific buying triggers.",
    outputPreview: "{\n  \"trigger\": \"Hiring 14 DevOps engineers for Kubernetes migration\",\n  \"tech_stack\": [\"AWS\", \"Kubernetes\", \"Terraform\"],\n  \"pain_point\": \"CI/CD pipeline bottleneck\"\n}",
  },
  {
    id: "06-pas-copy",
    step: 6,
    title: "PAS AI Copywriter",
    subtitle: "3-Sentence Precision",
    stage: "ai",
    icon: Sparkles,
    binding: "n8n-nodes-base.openai",
    badge: "Zero-Slop",
    description: "Generates high-converting Problem-Agitate-Solution cold copy tailored to individual pain points with zero generic AI clichés.",
    outputPreview: "{\n  \"hook\": \"Saw Datadog is scaling to 14 Kubernetes clusters this quarter.\",\n  \"agitate\": \"Most teams lose 20+ dev hours weekly on manual drift checks.\",\n  \"solution\": \"Our engine auto-syncs configs in 3s without agent rebuilds.\"\n}",
  },
  {
    id: "07-crm-upsert",
    step: 7,
    title: "CRM Contact Sync",
    subtitle: "Two-Way Enrichment",
    stage: "shield",
    icon: Database,
    binding: "n8n-nodes-base.hubspot",
    badge: "Auto-Sync",
    description: "Creates or updates records in Twenty CRM or HubSpot with full enrichment dossiers, research summaries, and personalized email drafts.",
    outputPreview: "{\n  \"upserted_id\": \"crm_rec_88319\",\n  \"synced_to\": \"Twenty CRM\",\n  \"fields_written\": 18,\n  \"stage\": \"Outbound_Ready\"\n}",
  },
  {
    id: "08-sequencer",
    step: 8,
    title: "Sequence Enrollment",
    subtitle: "Smart Mailbox Send",
    stage: "sequence",
    icon: Send,
    binding: "n8n-nodes-base.smartlead",
    badge: "Warm-Send",
    description: "Enrolls contacts into Smartlead, Instantly, or native sequences with scheduled intervals, mailbox warm-up safety, and reply tracking.",
    outputPreview: "{\n  \"sequencer\": \"Smartlead\",\n  \"campaign\": \"DevOps_Q4_Outbound\",\n  \"scheduled_for\": \"09:14 AM EST\",\n  \"mailbox_health\": \"99.4%\"\n}",
  },
  {
    id: "09-triage",
    step: 9,
    title: "Review & Error Triage",
    subtitle: "Self-Healing Alerts",
    stage: "ops",
    icon: Activity,
    binding: "n8n-nodes-base.slack",
    badge: "Telemetry",
    description: "Slack/Discord notifications for human approval gates, real-time rate-limit warnings, and automated self-healing error triage.",
    outputPreview: "{\n  \"alert\": \"SLACK_WEBHOOK\",\n  \"status\": \"ENROLLED_SUCCESS\",\n  \"retry_count\": 0,\n  \"execution_time_ms\": 2840\n}",
  },
];

// ── Bento Features ──
const BENTO_FEATURES: BentoItem[] = [
  {
    id: "bento-swarm",
    title: "Autonomous 4-Agent Swarm",
    category: "Architecture",
    desc: "GTM Architect, CRM Dedupe Shield, PAS Copywriter, and Execution Analyst coordinate in a shared runtime to handle strategy, safety, copy, and ops.",
    icon: Cpu,
    stat: "4 Agents",
    statLabel: "Continuous orchestration",
    colSpan: "col-span-1 md:col-span-2",
    badge: "ROSTR v2",
  },
  {
    id: "bento-dedupe",
    title: "CRM Dedupe & Deal Shield",
    category: "Safety Shield",
    desc: "Active shields query Twenty CRM, HubSpot, and Salesforce before outreach to prevent pitching existing clients or live pipeline deals.",
    icon: ShieldCheck,
    stat: "0",
    statLabel: "Collision incidents",
    colSpan: "col-span-1",
    badge: "Zero-Collision",
  },
  {
    id: "bento-compiler",
    title: "Prompt-to-n8n Compiler",
    category: "Workflow Engine",
    desc: "Compile production-grade workflow JSON from plain English prompts. Validated against real node schemas for n8n, Make, and Gumloop.",
    icon: Workflow,
    stat: "3 sec",
    statLabel: "Prompt-to-JSON",
    colSpan: "col-span-1",
    badge: "Compiler",
  },
  {
    id: "bento-byok",
    title: "Zero-Knowledge BYOK Security",
    category: "Privacy & Vault",
    desc: "Your API keys and credentials live entirely in your private instance or local environment. Prospect PAL never stores keys or sends emails on your behalf.",
    icon: Lock,
    stat: "100%",
    statLabel: "Local key isolation",
    colSpan: "col-span-1 md:col-span-2",
    badge: "100% BYOK",
  },
  {
    id: "bento-waterfall",
    title: "Waterfall Contact Cascade",
    category: "Data Integrity",
    desc: "Cascades through Apollo, Clay, Prospeo, and Dropcontact. Every email undergoes live MX and SMTP bounce checks before enrollment.",
    icon: Search,
    stat: "94.8%",
    statLabel: "Verified deliverability",
    colSpan: "col-span-1",
    badge: "Waterfall",
  },
  {
    id: "bento-telemetry",
    title: "Real-Time Telemetry & Healing",
    category: "Ops & Observability",
    desc: "Execution agents scan workflow runs by ID, detect node failure points, diagnose API rate limits, and provide automatic repair instructions.",
    icon: Activity,
    stat: "99.9%",
    statLabel: "Execution reliability",
    colSpan: "col-span-1 md:col-span-2",
    badge: "Self-Healing",
  },
];

// ── Interactive Playground Presets ──
interface PlaygroundPreset {
  name: string;
  tag: string;
  company: string;
  offer: string;
  icp: string;
  persona: string;
  tools: string;
  pasOutput: {
    hook: string;
    agitate: string;
    solution: string;
  };
  metrics: {
    discovered: number;
    shielded: number;
    verified: number;
    estimatedReplyRate: string;
  };
}

const PLAYGROUND_PRESETS: PlaygroundPreset[] = [
  {
    name: "DevOps & Cloud SaaS",
    tag: "B2B Infrastructure",
    company: "CloudVortex (Series A)",
    offer: "Kubernetes auto-cost optimization platform, 35% cloud bill reduction.",
    icp: "50-500 employees, Series A-C, running AWS & Kubernetes.",
    persona: "VP Engineering, Head of Infrastructure, DevOps Lead.",
    tools: "Twenty CRM + Apollo.io + Smartlead",
    pasOutput: {
      hook: "Saw your team is scaling clusters across multi-region EKS on AWS.",
      agitate: "Most engineering leads we speak with waste 15+ hours weekly debugging node auto-scaling drift.",
      solution: "We cut idle Kubernetes spend by 35% with zero agent downtime. Open to seeing the 2-minute benchmark?",
    },
    metrics: {
      discovered: 120,
      shielded: 18,
      verified: 98,
      estimatedReplyRate: "8.4%",
    },
  },
  {
    name: "B2B FinTech & Payments",
    tag: "FinTech & AI",
    company: "PayFlow AI",
    offer: "Real-time ledger reconciliation engine eliminating month-end closing delays.",
    icp: "Fintechs & high-volume marketplaces doing $10M+ GMV on Stripe.",
    persona: "VP Finance, CFO, Head of Accounting.",
    tools: "HubSpot + Clay + Instantly",
    pasOutput: {
      hook: "Noticed PayFlow is expanding payment rails across Europe and North America.",
      agitate: "Cross-border settlement discrepancies usually force finance teams into 40-hour spreadsheet reconciliations.",
      solution: "Our engine reconciles multi-entity Stripe payouts automatically in real time. Would a 1-page sample ledger help?",
    },
    metrics: {
      discovered: 85,
      shielded: 12,
      verified: 71,
      estimatedReplyRate: "7.9%",
    },
  },
  {
    name: "Healthcare & Clinical AI",
    tag: "HealthTech Compliance",
    company: "ClinicaSync",
    offer: "HIPAA-compliant patient intake & chart automation for regional clinics.",
    icp: "10-100 provider healthcare practices and ambulatory clinics.",
    persona: "Chief Medical Officer, Clinical Director, Practice Manager.",
    tools: "Twenty CRM + Prospeo + Smartlead",
    pasOutput: {
      hook: "Saw your practice added 3 new outpatient clinics across the tri-state area.",
      agitate: "Clinicians still lose 2 hours every evening manually inputting EHR intake notes.",
      solution: "ClinicaSync automates chart intake in under 30 seconds with 100% HIPAA compliance. Open to a brief workflow look?",
    },
    metrics: {
      discovered: 64,
      shielded: 9,
      verified: 53,
      estimatedReplyRate: "9.2%",
    },
  },
];

// ── Customer Spotlight Stories ──
const TESTIMONIALS = [
  {
    name: "Alex Morgan",
    role: "Founder & CEO",
    company: "Atlas Labs",
    metric: "$180k ARR Added",
    subMetric: "In 45 Days · 0 Collisions",
    useCase: "B2B SaaS · DevOps Tools",
    quote: "We replaced a $90k/yr SDR overhead and 6 disparate SaaS tools in our first week. The CRM Dedupe Shield prevented 40+ embarrassing active-deal collisions, and our reply rate tripled.",
  },
  {
    name: "Daniel Reed",
    role: "Head of Growth",
    company: "Northway Studio",
    metric: "0 Lead Collisions",
    subMetric: "Across 45,000 Enrolled Prospects",
    useCase: "GTM Agency · 14 Clients",
    quote: "We manage outbound for 14 enterprise clients from one Prospect PAL instance. Building client-specific n8n workflows used to take 3 days each. Now it takes 5 minutes, and our clients' CRM data is pristine.",
  },
  {
    name: "Emily Carter",
    role: "VP of Sales",
    company: "Brightline Tech",
    metric: "8.4% Positive Reply",
    subMetric: "Up from 1.8% Generic AI",
    useCase: "Enterprise HR Tech",
    quote: "The 3-sentence PAS framework is the secret weapon. No generic AI fluff, just pure pain points grounded in actual company research. We booked 22 qualified enterprise demos in month one.",
  },
  {
    name: "Lucas Meyer",
    role: "Managing Director",
    company: "Kinetic Agency",
    metric: "12 Client Campaigns",
    subMetric: "100% BYOK · $0 Per-Lead Fees",
    useCase: "Outbound Growth Agency",
    quote: "Zero per-lead surcharges. We plug in our clients' Apollo and Smartlead keys and own the workflows outright. It is the cleanest, most defensible GTM architecture on the market.",
  },
];

// ── FAQ Items ──
const FAQS = [
  {
    category: "General",
    q: "What makes Prospect PAL fundamentally different from Apollo, Clay, or Smartlead?",
    a: "Those platforms are siloed point-solutions. You still have to manually link them with brittle Zapier zaps, write your own AI prompts, and risk emailing existing CRM clients. Prospect PAL is the autonomous orchestrator: it plans, shields, enriches, writes 3-sentence PAS emails, and compiles verified production n8n workflows in 3 seconds.",
  },
  {
    category: "Engine & AI",
    q: "How does the AI copywriter avoid sounding like generic AI slop?",
    a: "Prospect PAL enforces the strict 3-sentence Problem-Agitate-Solution (PAS) architecture. It first scrapes company telemetry (10-Ks, open engineering roles, tech stacks) to identify actual friction, then articulates the pain in 3 tight, crisp sentences. Banned are clichés like 'I hope this email finds you well' or 'In today's fast-paced world'.",
  },
  {
    category: "CRM & Integrations",
    q: "How does the Zero-Collision CRM Dedupe Shield work?",
    a: "Before any contact is enriched or enrolled, Node 03 executes a real-time query against Twenty CRM, HubSpot, or Salesforce. If the domain has an open deal, an assigned rep, or an opt-out tag, the prospect is instantly dropped from the queue. Your active sales pipeline is 100% protected.",
  },
  {
    category: "Security & BYOK",
    q: "What does Zero-Knowledge Bring-Your-Own-Key (BYOK) mean for my data?",
    a: "Your API keys (OpenAI, Claude, Apollo, Smartlead, HubSpot) are configured directly in your self-hosted instance or private environment. Prospect PAL never stores your customer data or API keys on external servers. You own the workflows, the data, and the execution logs permanently.",
  },
  {
    category: "General",
    q: "Do I need to be an n8n expert or coder to use this?",
    a: "No. You answer a few simple campaign questions in natural language, or use our interactive copilot. The engine compiles the ready-to-run 9-node JSON workflow and provides 1-click deployment to self-hosted n8n, n8n Cloud, or Make.",
  },
  {
    category: "Engine & AI",
    q: "Can I customize the workflow nodes after compilation?",
    a: "Yes! Because Prospect PAL outputs standard n8n JSON, you can open it in any n8n canvas, edit nodes, add custom Python/JS code, plug in internal databases, or add custom approval channels.",
  },
];

export default function HomePage() {
  // State
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(2); // Start on CRM Dedupe Shield
  const [activePlaygroundIndex, setActivePlaygroundIndex] = useState<number>(0);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [billingPeriod, setBillingPeriod] = useState<"annual" | "monthly">("annual");
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>("All");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const selectedNode = PIPELINE_NODES[activeNodeIndex];
  const selectedPreset = PLAYGROUND_PRESETS[activePlaygroundIndex];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(selectedNode.outputPreview);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const filteredFaqs =
    activeFaqCategory === "All"
      ? FAQS
      : FAQS.filter((f) => f.category === activeFaqCategory);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA", color: "#14142D", overflowX: "hidden" }}>

      {/* ─────────────────────────────────────────────────────────────
          1. TOP ANNOUNCEMENT BAR
          ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(90deg, #101B2D 0%, #1B2942 50%, #101B2D 100%)",
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
            letterSpacing: "0.06em",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          v2.4 Release
        </span>
        <span>
          <strong>Twenty CRM & n8n Cloud Integration Live.</strong> Compile verified outbound flows in seconds.
        </span>
        <a
          href="#pipeline"
          style={{
            color: "#D9B968",
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: "13px",
          }}
        >
          Explore Pipeline <ChevronRight size={14} />
        </a>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING STICKY NAVBAR (Makro Glassmorphic Pill)
          ───────────────────────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 16,
          zIndex: 50,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.82)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(20, 20, 45, 0.08)",
            boxShadow: "0 4px 20px rgba(16, 27, 45, 0.04)",
            borderRadius: "100px",
            padding: "10px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand Lockup */}
          <Link
            href="/home"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#14142D",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "#14142D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 2px 8px rgba(20, 20, 45, 0.2)",
              }}
            >
              <Workflow size={17} strokeWidth={2.2} />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
              <span
                style={{
                  fontFamily: "var(--font-sans, system-ui)",
                  fontWeight: 800,
                  fontSize: 17,
                  letterSpacing: "-0.02em",
                  color: "#14142D",
                }}
              >
                Prospect
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans, system-ui)",
                  fontWeight: 800,
                  fontSize: 17,
                  letterSpacing: "-0.02em",
                  color: "#2563EB",
                }}
              >
                PAL
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: 6,
                  background: "#EBEFF5",
                  color: "#58718A",
                  marginLeft: 4,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                v2.4
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
            }}
            className="hidden md:flex"
          >
            <a
              href="#pipeline"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#58718A",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
            >
              5-Pillar Pipeline
            </a>
            <a
              href="#manifesto"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#58718A",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
            >
              Architecture
            </a>
            <a
              href="#bento"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#58718A",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
            >
              Bento Features
            </a>
            <a
              href="#playground"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#58718A",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
            >
              Live Copilot
            </a>
            <a
              href="#pricing"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#58718A",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
            >
              Pricing
            </a>
            <a
              href="#faq"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#58718A",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
            >
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/login"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#58718A",
                textDecoration: "none",
                padding: "8px 12px",
              }}
            >
              Log in
            </Link>
            <Link
              href="/wizard"
              style={{
                background: "#14142D",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 600,
                padding: "9px 18px",
                borderRadius: "100px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 2px 8px rgba(20, 20, 45, 0.18)",
                transition: "transform 0.15s, background 0.15s",
              }}
            >
              Deploy Agent <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. HERO SECTION (Makro Style: Big Type + UI Frame + Micro-Widgets)
          ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "72px 24px 80px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Micro-Pill Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#FFFFFF",
            border: "1px solid rgba(20, 20, 45, 0.1)",
            padding: "6px 14px",
            borderRadius: "100px",
            fontSize: 12,
            fontWeight: 600,
            color: "#35363B",
            boxShadow: "0 1px 3px rgba(16, 27, 45, 0.04)",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#10B981",
              boxShadow: "0 0 8px #10B981",
              display: "inline-block",
            }}
          />
          <span style={{ fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 11 }}>
            AI-Powered Outbound Automation
          </span>
        </div>

        {/* Makro Huge Display Headline */}
        <h1
          style={{
            fontFamily: "var(--font-sans, system-ui)",
            fontSize: "clamp(38px, 5.5vw, 68px)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.035em",
            color: "#14142D",
            margin: "0 0 20px",
            maxWidth: "960px",
          }}
        >
          Know your pipeline. <br />
          <span style={{ color: "#2563EB" }}>Run outbound with AI.</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(16px, 1.8vw, 19px)",
            lineHeight: 1.6,
            color: "#58718A",
            maxWidth: "680px",
            margin: "0 0 36px",
          }}
        >
          Turn any ICP brief into a 5-pillar, zero-collision outbound engine in 3 seconds. Verified leads, deep company research, personalized PAS copy, and live CRM shields.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            flexWrap: "wrap",
            marginBottom: 48,
          }}
        >
          <Link
            href="/wizard"
            style={{
              background: "#14142D",
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 600,
              padding: "14px 28px",
              borderRadius: "100px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 14px rgba(20, 20, 45, 0.22)",
            }}
          >
            Deploy Outbound Agent <ArrowRight size={16} />
          </Link>
          <a
            href="#pipeline"
            style={{
              background: "#FFFFFF",
              color: "#14142D",
              border: "1px solid rgba(20, 20, 45, 0.14)",
              fontSize: 15,
              fontWeight: 600,
              padding: "14px 24px",
              borderRadius: "100px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 1px 3px rgba(16, 27, 45, 0.04)",
            }}
          >
            <Play size={15} fill="#14142D" /> Explore 9-Node Pipeline
          </a>
        </div>

        {/* Social Proof Bar */}
        <div style={{ marginBottom: 54 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#7E8B9B",
              marginBottom: 16,
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            Trusted by modern revenue teams, founders, and growth agencies
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(16px, 3vw, 36px)",
              flexWrap: "wrap",
              opacity: 0.8,
            }}
          >
            {[
              { name: "Twenty CRM", tag: "Native Sync" },
              { name: "HubSpot", tag: "CRM Shield" },
              { name: "n8n Cloud", tag: "Engine" },
              { name: "Apollo.io", tag: "275M Contacts" },
              { name: "Smartlead", tag: "Sequencer" },
              { name: "Clay", tag: "Waterfall" },
              { name: "Anthropic Claude", tag: "BYOK AI" },
            ].map((stack) => (
              <div
                key={stack.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: "rgba(255, 255, 255, 0.6)",
                  border: "1px solid rgba(20, 20, 45, 0.06)",
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563EB" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#14142D" }}>{stack.name}</span>
                <span style={{ fontSize: 11, color: "#7E8B9B", fontFamily: "var(--font-mono, monospace)" }}>
                  {stack.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTRAL INTERACTIVE CANVAS MOCKUP ── */}
        <div
          style={{
            width: "100%",
            position: "relative",
            maxWidth: "1140px",
            marginTop: 8,
          }}
        >
          {/* Main Browser Window */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              border: "1px solid rgba(20, 20, 45, 0.12)",
              boxShadow: "0 24px 60px -12px rgba(16, 27, 45, 0.12), 0 8px 24px -4px rgba(16, 27, 45, 0.06)",
              overflow: "hidden",
              textAlign: "left",
            }}
          >
            {/* Window Top Bar */}
            <div
              style={{
                background: "#F5F7FA",
                borderBottom: "1px solid rgba(20, 20, 45, 0.08)",
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444", display: "inline-block" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B", display: "inline-block" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
                <span
                  style={{
                    marginLeft: 12,
                    fontSize: 12,
                    fontFamily: "var(--font-mono, monospace)",
                    color: "#58718A",
                    background: "#FFFFFF",
                    padding: "3px 12px",
                    borderRadius: "6px",
                    border: "1px solid rgba(20, 20, 45, 0.06)",
                  }}
                >
                  prospect-pal.engine/live-pipeline/v2.4
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#10B981",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                  RUNNING · 0 ERRORS
                </span>
                <span style={{ fontSize: 11, color: "#7E8B9B", fontFamily: "var(--font-mono, monospace)" }}>
                  LATENCY: 2.8s
                </span>
              </div>
            </div>

            {/* Dashboard Telemetry Bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 1,
                background: "rgba(20, 20, 45, 0.08)",
                borderBottom: "1px solid rgba(20, 20, 45, 0.08)",
              }}
            >
              <div style={{ background: "#FFFFFF", padding: "16px 20px" }}>
                <div style={{ fontSize: 11, color: "#7E8B9B", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono, monospace)" }}>
                  Verified Reply Rate
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#14142D", marginTop: 4, display: "flex", alignItems: "baseline", gap: 6 }}>
                  38.4%
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#10B981" }}>+14.2% vs generic</span>
                </div>
              </div>
              <div style={{ background: "#FFFFFF", padding: "16px 20px" }}>
                <div style={{ fontSize: 11, color: "#7E8B9B", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono, monospace)" }}>
                  CRM Shield Status
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#10B981", marginTop: 4, display: "flex", alignItems: "baseline", gap: 6 }}>
                  0 Collisions
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#58718A" }}>Twenty & HubSpot</span>
                </div>
              </div>
              <div style={{ background: "#FFFFFF", padding: "16px 20px" }}>
                <div style={{ fontSize: 11, color: "#7E8B9B", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono, monospace)" }}>
                  Waterfall Deliverability
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#2563EB", marginTop: 4, display: "flex", alignItems: "baseline", gap: 6 }}>
                  94.8%
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#58718A" }}>SMTP verified</span>
                </div>
              </div>
              <div style={{ background: "#FFFFFF", padding: "16px 20px" }}>
                <div style={{ fontSize: 11, color: "#7E8B9B", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono, monospace)" }}>
                  Compilation Speed
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#14142D", marginTop: 4, display: "flex", alignItems: "baseline", gap: 6 }}>
                  3.2 sec
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#10B981" }}>n8n JSON ready</span>
                </div>
              </div>
            </div>

            {/* Interactive Pipeline Canvas Preview */}
            <div style={{ padding: "28px 24px", background: "#FAFBFD" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#14142D", margin: "0 0 4px" }}>
                    Active 9-Node Production Pipeline
                  </h3>
                  <p style={{ fontSize: 13, color: "#58718A", margin: 0 }}>
                    Click any node to inspect live logic, JSON bindings, and telemetry output.
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#2563EB",
                    background: "rgba(37, 99, 235, 0.08)",
                    padding: "4px 10px",
                    borderRadius: "100px",
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  Node {selectedNode.step} of 9 Selected
                </span>
              </div>

              {/* Node Horizontal Scroll / Track */}
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  gap: 10,
                  overflowX: "auto",
                  paddingBottom: 12,
                  scrollbarWidth: "thin",
                }}
              >
                {PIPELINE_NODES.map((node, idx) => {
                  const isSelected = idx === activeNodeIndex;
                  const IconComponent = node.icon;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setActiveNodeIndex(idx)}
                      style={{
                        flexShrink: 0,
                        width: 170,
                        padding: "14px 12px",
                        borderRadius: "12px",
                        textAlign: "left",
                        cursor: "pointer",
                        background: "#FFFFFF",
                        border: isSelected ? "2px solid #2563EB" : "1px solid rgba(20, 20, 45, 0.1)",
                        boxShadow: isSelected
                          ? "0 4px 14px rgba(37, 99, 235, 0.15)"
                          : "0 1px 3px rgba(16, 27, 45, 0.03)",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: isSelected ? "#2563EB" : "#EBEFF5",
                            color: isSelected ? "#FFFFFF" : "#14142D",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconComponent size={15} />
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: isSelected ? "#2563EB" : "#7E8B9B",
                            fontFamily: "var(--font-mono, monospace)",
                          }}
                        >
                          0{node.step}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#14142D", marginBottom: 2 }}>
                        {node.title.split(" ")[0]}
                      </div>
                      <div style={{ fontSize: 11, color: "#58718A" }}>
                        {node.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Node Telemetry Inspector */}
              <div
                style={{
                  marginTop: 16,
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid rgba(20, 20, 45, 0.1)",
                  padding: "18px 20px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 20,
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span
                      style={{
                        background: "#EBEFF5",
                        color: "#2563EB",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontFamily: "var(--font-mono, monospace)",
                      }}
                    >
                      STAGE 0{selectedNode.step} · {selectedNode.badge}
                    </span>
                    <span style={{ fontSize: 12, color: "#7E8B9B", fontFamily: "var(--font-mono, monospace)" }}>
                      {selectedNode.binding}
                    </span>
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 700, color: "#14142D", margin: "0 0 6px" }}>
                    {selectedNode.title}
                  </h4>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "#58718A", margin: 0 }}>
                    {selectedNode.description}
                  </p>
                </div>

                <div
                  style={{
                    background: "#0E1526",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    color: "#D1E2FF",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: 12,
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: 6 }}>
                    <span style={{ color: "#7E8B9B", fontSize: 11 }}>OUTPUT TELEMETRY</span>
                    <button
                      onClick={handleCopyJson}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: copiedSnippet ? "#10B981" : "#8DA2FB",
                        fontSize: 11,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {copiedSnippet ? <Check size={12} /> : <Copy size={12} />}
                      {copiedSnippet ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre style={{ margin: 0, overflowX: "auto", maxHeight: 110 }}>
                    {selectedNode.outputPreview}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2 Floating Status Widgets ── */}
          <div
            style={{
              position: "absolute",
              top: -24,
              left: -20,
              background: "#FFFFFF",
              borderRadius: "14px",
              padding: "12px 18px",
              boxShadow: "0 10px 30px rgba(16, 27, 45, 0.12)",
              border: "1px solid rgba(20, 20, 45, 0.08)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              maxWidth: 290,
              textAlign: "left",
            }}
            className="hidden lg:flex"
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(16, 185, 129, 0.12)",
                color: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#14142D" }}>
                CRM Dedupe Shield
              </div>
              <div style={{ fontSize: 11, color: "#58718A" }}>
                100% active deals protected · 0 collisions
              </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: -24,
              background: "#FFFFFF",
              borderRadius: "14px",
              padding: "12px 18px",
              boxShadow: "0 10px 30px rgba(16, 27, 45, 0.12)",
              border: "1px solid rgba(20, 20, 45, 0.08)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              maxWidth: 310,
              textAlign: "left",
            }}
            className="hidden lg:flex"
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(37, 99, 235, 0.1)",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#14142D" }}>
                PAS AI Copywriter
              </div>
              <div style={{ fontSize: 11, color: "#58718A" }}>
                3-sentence letters · zero generic AI slop
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. MANIFESTO STATEMENT SECTION
          ───────────────────────────────────────────────────────────── */}
      <section
        id="manifesto"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid rgba(20, 20, 45, 0.08)",
          borderBottom: "1px solid rgba(20, 20, 45, 0.08)",
          padding: "96px 24px",
        }}
      >
        <div style={{ maxWidth: "1080px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#2563EB",
              fontFamily: "var(--font-mono, monospace)",
              marginBottom: 20,
            }}
          >
            THE GTM AUTOMATION MANIFESTO
          </div>

          <h2
            style={{
              fontFamily: "var(--font-sans, system-ui)",
              fontSize: "clamp(26px, 4vw, 44px)",
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: "-0.025em",
              color: "#14142D",
              margin: "0 auto 40px",
              maxWidth: "960px",
            }}
          >
            Prospect PAL is an autonomous outbound engineering platform for founders and modern revenue teams that replaces brittle 8-tool stacks with self-healing, zero-collision GTM agent pipelines.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginTop: 32,
              textAlign: "left",
            }}
          >
            {[
              {
                title: "1. Ingest & Cron",
                sub: "Automated Lead Capture",
                desc: "Discover decision-makers matching exact hiring, tech, and funding signals.",
                color: "#2563EB",
              },
              {
                title: "2. CRM Dedupe Shield",
                sub: "Zero-Collision Guarantee",
                desc: "Real-time check across Twenty CRM, HubSpot, and Salesforce before outreach.",
                color: "#10B981",
              },
              {
                title: "3. Deep PAS Research",
                sub: "3-Sentence Precision",
                desc: "Hyper-personalized Problem-Agitate-Solution letters tailored to individual pain points.",
                color: "#6366F1",
              },
              {
                title: "4. Sequence Send",
                sub: "Smart Mailbox Safety",
                desc: "Automatic enrollment into Smartlead/Instantly with reply tracking & self-healing.",
                color: "#D97706",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                style={{
                  background: "#F6F8FA",
                  borderRadius: "14px",
                  padding: "20px 18px",
                  border: "1px solid rgba(20, 20, 45, 0.08)",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: pillar.color, fontFamily: "var(--font-mono, monospace)", marginBottom: 4 }}>
                  {pillar.sub}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#14142D", marginBottom: 6 }}>
                  {pillar.title}
                </div>
                <div style={{ fontSize: 13, color: "#58718A", lineHeight: 1.5 }}>
                  {pillar.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. 4 CORE SPOTLIGHT CARDS
          ───────────────────────────────────────────────────────────── */}
      <section
        id="pipeline"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "96px 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#2563EB",
              fontFamily: "var(--font-mono, monospace)",
              marginBottom: 12,
            }}
          >
            ARCHITECTURE IN DEPTH
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#14142D",
              margin: "0 0 16px",
            }}
          >
            Engineered for pipeline clarity.
          </h2>
          <p style={{ fontSize: 16, color: "#58718A", maxWidth: "600px", margin: "0 auto" }}>
            Every step is designed to replace manual SDR drudgery while keeping your domain reputation and CRM clean.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

          {/* Card 1: CRM Dedupe Shield */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              border: "1px solid rgba(20, 20, 45, 0.1)",
              boxShadow: "0 4px 20px rgba(16, 27, 45, 0.04)",
              padding: "48px 40px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 40,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#10B981",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontFamily: "var(--font-mono, monospace)",
                  marginBottom: 8,
                }}
              >
                DEAL SAFETY & PIPELINE SHIELD
              </div>
              <h3 style={{ fontSize: 28, fontWeight: 800, color: "#14142D", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
                See where your pipeline is heading before an SDR burns a deal.
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "#58718A", marginBottom: 24 }}>
                Active shields query Twenty CRM, HubSpot, and Salesforce in real-time. If an account has an active proposal, an assigned executive owner, or an opt-out tag, the prospect is automatically dropped before enrollment.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "No double-touch incidents on existing customer accounts",
                  "Automatic sync with Twenty CRM and HubSpot deal stages",
                  "Prevents SDR collisions across overlapping territories",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#35363B" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(16, 185, 129, 0.12)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={12} strokeWidth={2.5} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Panel */}
            <div
              style={{
                background: "#F5F7FA",
                borderRadius: "16px",
                border: "1px solid rgba(20, 20, 45, 0.08)",
                padding: "24px",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "#14142D", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>REAL-TIME SHIELD INSPECTION</span>
                <span style={{ color: "#10B981", fontFamily: "var(--font-mono, monospace)", fontSize: 11 }}>ACTIVE · 100% SHIELDED</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { name: "Acme Corp (Sarah Jenkins)", status: "PASSED", note: "No active deal · Cold ICP match", bg: "rgba(16, 185, 129, 0.1)", text: "#10B981" },
                  { name: "GlobalTech (Mark Alvarez)", status: "SHIELDED", note: "Stage: Proposal Sent ($45k ARR)", bg: "rgba(239, 68, 68, 0.1)", text: "#EF4444" },
                  { name: "CloudBase (Elena Rostova)", status: "PASSED", note: "Twenty CRM clean · Tier 1 target", bg: "rgba(16, 185, 129, 0.1)", text: "#10B981" },
                  { name: "Nexus AI (David Chen)", status: "EXCLUDED", note: "Opted-out 45 days ago", bg: "rgba(245, 158, 11, 0.1)", text: "#D97706" },
                ].map((lead) => (
                  <div
                    key={lead.name}
                    style={{
                      background: "#FFFFFF",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      border: "1px solid rgba(20, 20, 45, 0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#14142D" }}>{lead.name}</div>
                      <div style={{ fontSize: 11, color: "#7E8B9B" }}>{lead.note}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: lead.bg, color: lead.text, fontFamily: "var(--font-mono, monospace)" }}>
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Waterfall Contact Reveal */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              border: "1px solid rgba(20, 20, 45, 0.1)",
              boxShadow: "0 4px 20px rgba(16, 27, 45, 0.04)",
              padding: "48px 40px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 40,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#2563EB",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontFamily: "var(--font-mono, monospace)",
                  marginBottom: 8,
                }}
              >
                DATA REVEAL & VERIFICATION
              </div>
              <h3 style={{ fontSize: 28, fontWeight: 800, color: "#14142D", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
                Surfaces verified work emails without data waste.
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "#58718A", marginBottom: 24 }}>
                Stop paying for bad data or bouncing on single-provider lookups. Prospect PAL executes a tiered waterfall across Apollo, Clay, Prospeo, and Dropcontact, then validates SMTP handshakes live.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "94.8% average deliverability across verified work emails",
                  "Multi-source fallback cascade preserves API credit spend",
                  "Direct MX and mailbox ping checks prevent spam-trap hits",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#35363B" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(37, 99, 235, 0.1)", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={12} strokeWidth={2.5} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Panel */}
            <div
              style={{
                background: "#0E1526",
                borderRadius: "16px",
                padding: "24px",
                color: "#E2E8F0",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "#8DA2FB", marginBottom: 14 }}>
                // WATERFALL ENRICHMENT CASCADE
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
                <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "10px 12px", borderRadius: 8, borderLeft: "3px solid #2563EB" }}>
                  <div style={{ color: "#93C5FD" }}>STEP 1: Apollo Search API</div>
                  <div style={{ color: "#64748B", fontSize: 11 }}>Found 14 candidates · Matched persona VP Engineering</div>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "10px 12px", borderRadius: 8, borderLeft: "3px solid #6366F1" }}>
                  <div style={{ color: "#C0ADFF" }}>STEP 2: Clay Waterfall Enrichment</div>
                  <div style={{ color: "#64748B", fontSize: 11 }}>Primary reveal verified via Dropcontact fallback</div>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "10px 12px", borderRadius: 8, borderLeft: "3px solid #10B981" }}>
                  <div style={{ color: "#86EFAC" }}>STEP 3: Live SMTP & MX Verification</div>
                  <div style={{ color: "#10B981", fontSize: 11 }}>250 OK: Mailbox active · Deliverability Score 98%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: PAS AI Copywriter */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              border: "1px solid rgba(20, 20, 45, 0.1)",
              boxShadow: "0 4px 20px rgba(16, 27, 45, 0.04)",
              padding: "48px 40px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 40,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#6366F1",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontFamily: "var(--font-mono, monospace)",
                  marginBottom: 8,
                }}
              >
                HYPER-PERSONALIZED COPY
              </div>
              <h3 style={{ fontSize: 28, fontWeight: 800, color: "#14142D", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
                No more generic AI spam. Real research, 3 sentences.
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "#58718A", marginBottom: 24 }}>
                Recipients delete 5-paragraph AI templates instantly. Prospect PAL analyzes public filings, GitHub commits, and tech stacks to draft tight, respectful 3-sentence Problem-Agitate-Solution notes that actually earn responses.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Problem: Cites concrete company initiatives or hiring bottlenecks",
                  "Agitate: Highlights the immediate cost of inaction",
                  "Solution: Low-friction ask with zero pushy sales tropes",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#35363B" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(99, 102, 241, 0.12)", color: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={12} strokeWidth={2.5} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertCircle size={14} /> GENERIC AI OUTBOUND SLOP (1.8% REPLY)
                </div>
                <p style={{ fontSize: 12, color: "#991B1B", lineHeight: 1.5, margin: 0 }}>
                  &ldquo;I hope this email finds you well! In today&apos;s fast-paced digital world, companies like yours must leverage cutting-edge AI synergy to revolutionize their workflow... Do you have 30 minutes on Tuesday?&rdquo;
                </p>
              </div>

              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle2 size={14} /> PROSPECT PAL 3-SENTENCE PAS (8.4% REPLY)
                </div>
                <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                  &ldquo;Saw Datadog is expanding from 4 to 14 Kubernetes clusters on AWS this quarter. Most engineering teams lose 20+ dev hours weekly wrestling with node auto-scaling drift. We cut idle cluster spend by 35% with zero agent rebuilds—open to a 2-minute benchmark?&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Self-Healing Execution & Error Triage */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              border: "1px solid rgba(20, 20, 45, 0.1)",
              boxShadow: "0 4px 20px rgba(16, 27, 45, 0.04)",
              padding: "48px 40px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 40,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#D97706",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontFamily: "var(--font-mono, monospace)",
                  marginBottom: 8,
                }}
              >
                OPS & TELEMETRY
              </div>
              <h3 style={{ fontSize: 28, fontWeight: 800, color: "#14142D", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
                Execution diagnostics that never fail silently.
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "#58718A", marginBottom: 24 }}>
                Workflows break when APIs change, rate limits trigger, or credentials expire. Prospect PAL&apos;s Execution Analyst agent parses runData telemetry in real time, diagnoses root causes, and deploys automatic circuit-breaker retries.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Automatic exponential backoff on 429 rate limit errors",
                  "Slack & Discord alerts for Human-in-the-Loop approval gates",
                  "One-click post-mortem analysis and auto-repair generation",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#35363B" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(217, 119, 6, 0.12)", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={12} strokeWidth={2.5} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Panel */}
            <div
              style={{
                background: "#0B0F16",
                borderRadius: "16px",
                padding: "20px",
                color: "#94A3B8",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: 8 }}>
                <span style={{ color: "#E2E8F0" }}>EXECUTION ANALYST TELEMETRY</span>
                <span style={{ color: "#10B981" }}>HEALED: 0 FAILURES</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ color: "#64748B" }}>[10:14:22] Run 88319 started for batch 120</div>
                <div style={{ color: "#FBBF24" }}>[10:14:23] WARN: Apollo API 429 RateLimit detected</div>
                <div style={{ color: "#60A5FA" }}>[10:14:23] ACTION: Backoff scheduled (wait 1200ms)</div>
                <div style={{ color: "#34D399" }}>[10:14:25] RETRY: Node 04 resolved successfully (200 OK)</div>
                <div style={{ color: "#34D399" }}>[10:14:28] ENROLLED: 98 verified prospects sent to Smartlead</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. BENTO GRID
          ───────────────────────────────────────────────────────────── */}
      <section
        id="bento"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid rgba(20, 20, 45, 0.08)",
          borderBottom: "1px solid rgba(20, 20, 45, 0.08)",
          padding: "96px 24px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#2563EB",
                fontFamily: "var(--font-mono, monospace)",
                marginBottom: 12,
              }}
            >
              MODULAR CAPABILITIES
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#14142D",
                margin: "0 0 16px",
              }}
            >
              Tidy build, unlimited power.
            </h2>
            <p style={{ fontSize: 16, color: "#58718A", maxWidth: "600px", margin: "0 auto" }}>
              Every component works independently or unifies into a full-stack outbound engine.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {BENTO_FEATURES.map((feat) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={feat.id}
                  style={{
                    background: "#F5F7FA",
                    borderRadius: "18px",
                    border: "1px solid rgba(20, 20, 45, 0.08)",
                    padding: "32px 28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 9,
                          background: "#FFFFFF",
                          color: "#2563EB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 6px rgba(16, 27, 45, 0.05)",
                        }}
                      >
                        <IconComp size={19} />
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#58718A",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          fontFamily: "var(--font-mono, monospace)",
                          background: "#FFFFFF",
                          padding: "3px 8px",
                          borderRadius: 6,
                          border: "1px solid rgba(20, 20, 45, 0.06)",
                        }}
                      >
                        {feat.category}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 19, fontWeight: 700, color: "#14142D", margin: "0 0 10px" }}>
                      {feat.title}
                    </h3>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "#58718A", margin: 0 }}>
                      {feat.desc}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: 28,
                      paddingTop: 18,
                      borderTop: "1px solid rgba(20, 20, 45, 0.08)",
                      display: "flex",
                      alignItems: "baseline",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: "#14142D",
                        fontFamily: "var(--font-sans, system-ui)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {feat.stat}
                    </span>
                    <span style={{ fontSize: 12, color: "#7E8B9B", fontFamily: "var(--font-mono, monospace)" }}>
                      {feat.statLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. INTERACTIVE LIVE AGENT SIMULATOR
          ───────────────────────────────────────────────────────────── */}
      <section
        id="playground"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "96px 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 54 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#2563EB",
              fontFamily: "var(--font-mono, monospace)",
              marginBottom: 12,
            }}
          >
            INTERACTIVE AGENT COPILOT
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#14142D",
              margin: "0 0 16px",
            }}
          >
            Watch the Agent compile in real time.
          </h2>
          <p style={{ fontSize: 16, color: "#58718A", maxWidth: "600px", margin: "0 auto" }}>
            Select an ICP below or enter your offer to see how Prospect PAL synthesizes personas, rules, and copy in 3 seconds.
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          {PLAYGROUND_PRESETS.map((preset, idx) => {
            const isSelected = idx === activePlaygroundIndex;
            return (
              <button
                key={preset.name}
                onClick={() => setActivePlaygroundIndex(idx)}
                style={{
                  background: isSelected ? "#14142D" : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#58718A",
                  border: isSelected ? "1px solid #14142D" : "1px solid rgba(20, 20, 45, 0.12)",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "9px 18px",
                  borderRadius: "100px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: isSelected ? "0 4px 12px rgba(20, 20, 45, 0.15)" : "0 1px 3px rgba(16, 27, 45, 0.04)",
                }}
              >
                <span>{preset.name}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: isSelected ? "rgba(255, 255, 255, 0.2)" : "#EBEFF5",
                    color: isSelected ? "#FFFFFF" : "#58718A",
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  {preset.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Playground Interactive Card */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            border: "1px solid rgba(20, 20, 45, 0.1)",
            boxShadow: "0 16px 48px -8px rgba(16, 27, 45, 0.08)",
            padding: "36px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 36,
          }}
        >
          {/* Left: Input Brief & Persona Extraction */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#14142D", fontFamily: "var(--font-mono, monospace)" }}>
                CAMPAIGN INPUT BRIEF
              </span>
            </div>

            <div style={{ background: "#F5F7FA", borderRadius: 12, padding: "16px", marginBottom: 18, border: "1px solid rgba(20, 20, 45, 0.06)" }}>
              <div style={{ fontSize: 11, color: "#7E8B9B", textTransform: "uppercase", marginBottom: 4, fontFamily: "var(--font-mono, monospace)" }}>
                Target ICP & Offer
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#14142D", marginBottom: 6 }}>
                {selectedPreset.company} · {selectedPreset.offer}
              </div>
              <div style={{ fontSize: 12, color: "#58718A" }}>
                <strong>Criteria:</strong> {selectedPreset.icp}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#FFFFFF", border: "1px solid rgba(20, 20, 45, 0.08)", borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: "#58718A" }}>Extracted Persona</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#14142D" }}>{selectedPreset.persona}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#FFFFFF", border: "1px solid rgba(20, 20, 45, 0.08)", borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: "#58718A" }}>Adapter Stack</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", fontFamily: "var(--font-mono, monospace)" }}>
                  {selectedPreset.tools}
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "#F5F7FA", padding: "12px", borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#7E8B9B" }}>Discovered / Shielded</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#14142D", marginTop: 2 }}>
                  {selectedPreset.metrics.discovered} / <span style={{ color: "#EF4444" }}>-{selectedPreset.metrics.shielded}</span>
                </div>
              </div>
              <div style={{ background: "#F5F7FA", padding: "12px", borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#7E8B9B" }}>Est. Reply Rate</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#10B981", marginTop: 2 }}>
                  {selectedPreset.metrics.estimatedReplyRate}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Real-time PAS Copy & Workflow Compilation */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#14142D", fontFamily: "var(--font-mono, monospace)" }}>
                  GENERATED 3-SENTENCE PAS OUTBOUND
                </span>
              </div>
              <span style={{ fontSize: 11, color: "#10B981", fontWeight: 700, fontFamily: "var(--font-mono, monospace)" }}>
                COMPILED IN 3.2s
              </span>
            </div>

            <div
              style={{
                background: "#FAFBFD",
                borderRadius: 12,
                border: "1px solid rgba(20, 20, 45, 0.08)",
                padding: "20px",
                marginBottom: 16,
              }}
            >
              <div style={{ borderBottom: "1px solid rgba(20, 20, 45, 0.06)", paddingBottom: 10, marginBottom: 12, fontSize: 12, color: "#58718A" }}>
                <div><strong>Subject:</strong> Quick question regarding {selectedPreset.persona.split(",")[0]} at {"{{company}}"}</div>
                <div><strong>To:</strong> {"{{first_name}}"} &lt;{"{{email}}"}&gt;</div>
              </div>

              <div style={{ fontSize: 14, lineHeight: 1.6, color: "#14142D" }}>
                <p style={{ margin: "0 0 10px" }}>Hi {"{{first_name}}"},</p>
                <p style={{ margin: "0 0 10px", color: "#1E293B" }}>
                  <span style={{ background: "rgba(37, 99, 235, 0.08)", padding: "1px 4px", borderRadius: 4 }}>
                    {selectedPreset.pasOutput.hook}
                  </span>{" "}
                  <span style={{ background: "rgba(239, 68, 68, 0.08)", padding: "1px 4px", borderRadius: 4 }}>
                    {selectedPreset.pasOutput.agitate}
                  </span>{" "}
                  <span style={{ background: "rgba(16, 185, 129, 0.08)", padding: "1px 4px", borderRadius: 4 }}>
                    {selectedPreset.pasOutput.solution}
                  </span>
                </p>
                <p style={{ margin: 0, color: "#58718A" }}>Best,<br />Alex</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link
                href="/wizard"
                style={{
                  background: "#14142D",
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "10px 18px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Compile My Own Workflow <ArrowRight size={14} />
              </Link>
              <span style={{ fontSize: 12, color: "#7E8B9B" }}>
                Generates validated n8n JSON & CRM shields.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. CUSTOMER SPOTLIGHT
          ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid rgba(20, 20, 45, 0.08)",
          borderBottom: "1px solid rgba(20, 20, 45, 0.08)",
          padding: "96px 24px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#2563EB",
                fontFamily: "var(--font-mono, monospace)",
                marginBottom: 12,
              }}
            >
              CUSTOMER SPOTLIGHT
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#14142D",
                margin: "0 0 16px",
              }}
            >
              Proven on real revenue pipelines.
            </h2>
            <p style={{ fontSize: 16, color: "#58718A", maxWidth: "600px", margin: "0 auto" }}>
              See how modern teams replaced SDR tool sprawl and booked real calls.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                style={{
                  background: "#F5F7FA",
                  borderRadius: "16px",
                  border: "1px solid rgba(20, 20, 45, 0.08)",
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "#2563EB" }}>
                      {t.metric}
                    </span>
                    <span style={{ fontSize: 11, color: "#7E8B9B", fontFamily: "var(--font-mono, monospace)" }}>
                      {t.useCase}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "#35363B", margin: "0 0 20px" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div style={{ paddingTop: 14, borderTop: "1px solid rgba(20, 20, 45, 0.08)", display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#14142D",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#14142D" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#58718A" }}>
                      {t.role} · {t.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. INTERACTIVE PRICING MATRIX
          ───────────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "96px 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#2563EB",
              fontFamily: "var(--font-mono, monospace)",
              marginBottom: 12,
            }}
          >
            TRANSPARENT PRICING
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#14142D",
              margin: "0 0 16px",
            }}
          >
            Own your workflows forever. Zero per-lead surcharges.
          </h2>
          <p style={{ fontSize: 16, color: "#58718A", maxWidth: "600px", margin: "0 auto 28px" }}>
            Bring your own API keys. No hidden fees or contact markup. Cancel or downgrade anytime.
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#EBEFF5",
              padding: "4px",
              borderRadius: "100px",
              border: "1px solid rgba(20, 20, 45, 0.08)",
            }}
          >
            <button
              onClick={() => setBillingPeriod("monthly")}
              style={{
                background: billingPeriod === "monthly" ? "#FFFFFF" : "transparent",
                color: billingPeriod === "monthly" ? "#14142D" : "#58718A",
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 18px",
                borderRadius: "100px",
                cursor: "pointer",
                boxShadow: billingPeriod === "monthly" ? "0 2px 6px rgba(16, 27, 45, 0.08)" : "none",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              style={{
                background: billingPeriod === "annual" ? "#FFFFFF" : "transparent",
                color: billingPeriod === "annual" ? "#14142D" : "#58718A",
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 18px",
                borderRadius: "100px",
                cursor: "pointer",
                boxShadow: billingPeriod === "annual" ? "0 2px 6px rgba(16, 27, 45, 0.08)" : "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>Annual</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: "rgba(37, 99, 235, 0.1)",
                  color: "#2563EB",
                  padding: "2px 6px",
                  borderRadius: 100,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          {/* Tier 1: DIY Package */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              border: "1px solid rgba(20, 20, 45, 0.1)",
              padding: "36px 30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#58718A", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono, monospace)" }}>
                DIY SKILL PACKAGE
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "14px 0 6px" }}>
                <span style={{ fontSize: 44, fontWeight: 800, color: "#14142D", letterSpacing: "-0.03em" }}>
                  $19.99
                </span>
                <span style={{ fontSize: 13, color: "#7E8B9B" }}>one-time payment</span>
              </div>
              <p style={{ fontSize: 14, color: "#58718A", lineHeight: 1.5, margin: "0 0 24px" }}>
                For technical operators and solo builders running local coding agents or standalone n8n workflows.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid rgba(20, 20, 45, 0.08)", paddingTop: 20 }}>
                {[
                  "Full Agent Skill Package (.agents/skills)",
                  "5 production n8n JSON templates",
                  "3-sentence PAS prompt catalog",
                  "Zero cloud runtime dependencies",
                  "Runs locally in Cursor, Claude Code, or Antigravity",
                ].map((feat) => (
                  <div key={feat} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#35363B" }}>
                    <Check size={14} color="#10B981" strokeWidth={2.5} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <Link
                href="/packages"
                style={{
                  background: "#F5F7FA",
                  color: "#14142D",
                  border: "1px solid rgba(20, 20, 45, 0.12)",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "12px 20px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                Get DIY Package — $19.99
              </Link>
            </div>
          </div>

          {/* Tier 2: Team Pro (Featured) */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              border: "2px solid #2563EB",
              padding: "36px 30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 12px 36px rgba(37, 99, 235, 0.12)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -13,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#2563EB",
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 12px",
                borderRadius: "100px",
                fontFamily: "var(--font-mono, monospace)",
                letterSpacing: "0.06em",
              }}
            >
              MOST POPULAR
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono, monospace)" }}>
                TEAM PRO EDITION
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "14px 0 6px" }}>
                <span style={{ fontSize: 44, fontWeight: 800, color: "#14142D", letterSpacing: "-0.03em" }}>
                  {billingPeriod === "annual" ? "$79" : "$99"}
                </span>
                <span style={{ fontSize: 13, color: "#7E8B9B" }}>/ month</span>
              </div>
              <p style={{ fontSize: 14, color: "#58718A", lineHeight: 1.5, margin: "0 0 24px" }}>
                For scaling revenue teams & active campaigns. Unlimited campaign generation with master compiler and live execution triage.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid rgba(20, 20, 45, 0.08)", paddingTop: 20 }}>
                {[
                  "Unlimited 9-node campaign generation",
                  "Twenty CRM, HubSpot & Salesforce sync",
                  "Execution Analyst real-time run telemetry",
                  "Waterfall data adapter (Apollo + Clay)",
                  "Smartlead & Instantly sequence enrollment",
                  "100% BYOK key isolation guarantee",
                ].map((feat) => (
                  <div key={feat} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#14142D", fontWeight: 500 }}>
                    <Check size={14} color="#2563EB" strokeWidth={2.5} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <Link
                href="/checkout?plan=pro"
                style={{
                  background: "#2563EB",
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "13px 20px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  width: "100%",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                }}
              >
                Start Team Plan <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Tier 3: Scale & Agency */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              border: "1px solid rgba(20, 20, 45, 0.1)",
              padding: "36px 30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#58718A", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono, monospace)" }}>
                SCALE & AGENCY
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "14px 0 6px" }}>
                <span style={{ fontSize: 44, fontWeight: 800, color: "#14142D", letterSpacing: "-0.03em" }}>
                  {billingPeriod === "annual" ? "$159" : "$199"}
                </span>
                <span style={{ fontSize: 13, color: "#7E8B9B" }}>/ month</span>
              </div>
              <p style={{ fontSize: 14, color: "#58718A", lineHeight: 1.5, margin: "0 0 24px" }}>
                For GTM consultancies and agencies managing outbound across multiple client workspaces.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid rgba(20, 20, 45, 0.08)", paddingTop: 20 }}>
                {[
                  "Everything in Team Pro",
                  "Multi-tenant client workspace sandboxes",
                  "Custom MCP tool connectors & webhooks",
                  "White-label client execution reports",
                  "Priority engineer-led architecture review",
                  "Dedicated Slack channel with team",
                ].map((feat) => (
                  <div key={feat} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#35363B" }}>
                    <Check size={14} color="#10B981" strokeWidth={2.5} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <Link
                href="/checkout?plan=agency"
                style={{
                  background: "#14142D",
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "12px 20px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                Start Agency Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. FAQ ACCORDION
          ───────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid rgba(20, 20, 45, 0.08)",
          borderBottom: "1px solid rgba(20, 20, 45, 0.08)",
          padding: "96px 24px",
        }}
      >
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#2563EB",
                fontFamily: "var(--font-mono, monospace)",
                marginBottom: 12,
              }}
            >
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#14142D",
                margin: "0 0 16px",
              }}
            >
              We have the answers.
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 36,
            }}
          >
            {["All", "General", "Engine & AI", "CRM & Integrations", "Security & BYOK"].map((cat) => {
              const isSelected = activeFaqCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFaqCategory(cat)}
                  style={{
                    background: isSelected ? "#14142D" : "#F5F7FA",
                    color: isSelected ? "#FFFFFF" : "#58718A",
                    border: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "6px 14px",
                    borderRadius: "100px",
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredFaqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div
                  key={faq.q}
                  style={{
                    background: "#F5F7FA",
                    borderRadius: "14px",
                    border: "1px solid rgba(20, 20, 45, 0.08)",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    style={{
                      width: "100%",
                      padding: "20px 24px",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#14142D",
                    }}
                  >
                    <span>{faq.q}</span>
                    <span
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                        color: "#58718A",
                      }}
                    >
                      <ChevronDown size={18} />
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 24px 22px", fontSize: 14, lineHeight: 1.6, color: "#58718A" }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. FINAL HIGH-IMPACT CTA
          ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "96px 24px 120px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #101B2D 0%, #1A2840 50%, #0B0F16 100%)",
            borderRadius: "28px",
            padding: "clamp(48px, 6vw, 84px) 32px",
            color: "#FFFFFF",
            boxShadow: "0 24px 64px -16px rgba(16, 27, 45, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#8DA2FB",
              fontFamily: "var(--font-mono, monospace)",
              marginBottom: 16,
            }}
          >
            READY TO SCALE OUTBOUND SAFELY?
          </div>
          <h2
            style={{
              fontFamily: "var(--font-sans, system-ui)",
              fontSize: "clamp(32px, 4.5vw, 54px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              margin: "0 auto 20px",
              maxWidth: "760px",
            }}
          >
            Ready to take control of your pipeline?
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1.6vw, 18px)",
              lineHeight: 1.6,
              color: "#C4CBD8",
              maxWidth: "600px",
              margin: "0 auto 40px",
            }}
          >
            Prospect PAL keeps your ICP targeting, copy, and CRM sync crystal clear. Deploy in 3 minutes.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/wizard"
              style={{
                background: "#2563EB",
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: "100px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 16px rgba(37, 99, 235, 0.4)",
              }}
            >
              Deploy Outbound Agent <ArrowRight size={16} />
            </Link>
            <Link
              href="/packages"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                fontSize: 15,
                fontWeight: 600,
                padding: "14px 24px",
                borderRadius: "100px",
                textDecoration: "none",
              }}
            >
              Get DIY Package ($19.99)
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. ARCHITECTURAL FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid rgba(20, 20, 45, 0.08)",
          padding: "72px 24px 40px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 40,
            marginBottom: 60,
          }}
        >
          {/* Col 1: Brand Info */}
          <div style={{ gridColumn: "span 2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "#14142D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                }}
              >
                <Workflow size={15} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#14142D" }}>
                Prospect <span style={{ color: "#2563EB" }}>PAL</span>
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "#58718A", maxWidth: "300px", margin: "0 0 20px" }}>
              Autonomous GTM & Outbound Agent Engine. Turning ICP briefs into production-grade, zero-collision outbound pipelines.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#F5F7FA",
                border: "1px solid rgba(20, 20, 45, 0.08)",
                padding: "4px 10px",
                borderRadius: "100px",
                fontSize: 11,
                fontFamily: "var(--font-mono, monospace)",
                color: "#10B981",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
              All Systems Operational · v2.4
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#14142D", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, fontFamily: "var(--font-mono, monospace)" }}>
              Platform
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
              <a href="#pipeline" style={{ color: "#58718A", textDecoration: "none" }}>5-Pillar Pipeline</a>
              <a href="#manifesto" style={{ color: "#58718A", textDecoration: "none" }}>CRM Dedupe Shield</a>
              <a href="#playground" style={{ color: "#58718A", textDecoration: "none" }}>Live Copilot</a>
              <a href="#bento" style={{ color: "#58718A", textDecoration: "none" }}>Bento Features</a>
              <Link href="/templates" style={{ color: "#58718A", textDecoration: "none" }}>Workflow Templates</Link>
            </div>
          </div>

          {/* Col 3: Integrations */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#14142D", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, fontFamily: "var(--font-mono, monospace)" }}>
              Integrations
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
              <span style={{ color: "#58718A" }}>Twenty CRM</span>
              <span style={{ color: "#58718A" }}>HubSpot CRM</span>
              <span style={{ color: "#58718A" }}>n8n Self-Hosted & Cloud</span>
              <span style={{ color: "#58718A" }}>Apollo.io Adapter</span>
              <span style={{ color: "#58718A" }}>Smartlead & Instantly</span>
            </div>
          </div>

          {/* Col 4: Legal & Trust */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#14142D", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, fontFamily: "var(--font-mono, monospace)" }}>
              Security & Legal
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
              <span style={{ color: "#58718A" }}>100% BYOK Isolation</span>
              <span style={{ color: "#58718A" }}>Zero Data Storage</span>
              <span style={{ color: "#58718A" }}>Terms of Service</span>
              <span style={{ color: "#58718A" }}>Privacy Policy</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            borderTop: "1px solid rgba(20, 20, 45, 0.08)",
            paddingTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 12,
            color: "#7E8B9B",
          }}
        >
          <div>© 2026 Prospect PAL LLC. All rights reserved.</div>
          <div style={{ display: "flex", gap: 20 }}>
            <span>Built with Site Empire OS</span>
            <span>WCAG 2.2 AA Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
