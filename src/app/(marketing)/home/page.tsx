"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Logo,
  Button,
  Badge,
  Icon,
  StatTile,
  PricingCard,
  PipelineRail,
  PipelineNode,
} from "@/components/ds";
import { VerticalOutboundWorkbench } from "@/components/outbound/VerticalOutboundWorkbench";
import {
  ARCHITECTURE_BLUEPRINT_NODES,
  C4_SYSTEM_CONTEXT_LINKS,
  ROSTR_AGENTS,
  ROSTR_RUNTIME_MODULES,
  SIX_STEP_AUTOMATION_FLOW,
} from "@/lib/rostr/agents-registry";
import { DEMO_API_KEY } from "@/lib/mcp/auth";

const PIPELINE_NODES: PipelineNode[] = ARCHITECTURE_BLUEPRINT_NODES.map((n, idx) => ({
  step: idx + 1,
  title: n.node.replace(/^\d+\s+/, ""),
  subtitle: n.platforms,
  icon: n.icon,
  stage: n.stage,
  binding: n.binding,
  tooltip: n.function,
}));

const HARNESS_SNIPPETS: Record<
  string,
  { label: string; filename: string; code: string; caption: string }
> = {
  cursor: {
    label: "Claude Code & Cursor",
    filename: ".mcp.json",
    caption:
      "Connect Claude Code, Cursor, or Windsurf directly to the Streamable HTTP MCP endpoint. Every step enforces license and human approval checks.",
    code: `{
  "mcpServers": {
    "salesgency-outbound": {
      "url": "https://prospect.salesgency.com/api/mcp",
      "headers": {
        "Authorization": "Bearer ${DEMO_API_KEY}"
      }
    }
  }
}`,
  },
  antigravity: {
    label: "Antigravity & ROSTR Harness",
    filename: "agents/prospect-automation-engine/manifest.json",
    caption:
      "Drop the ROSTR agent manifest and skill pack into your agent directory. Tools with external side effects are gated by human approval.",
    code: `{
  "name": "Prospect Automation Engine",
  "slug": "prospect-automation-engine",
  "version": "1.0.0",
  "runtime": "rostr-v1",
  "mcpEndpoint": "https://prospect.salesgency.com/api/mcp",
  "skill": "skills/prospect-automation-engine-skill.md",
  "tools": [
    "scrape_buying_signals",
    "dedupe_crm_contact",
    "generate_pas_outreach",
    "enroll_in_sequencer"
  ],
  "humanApprovalGates": ["enroll_in_sequencer"]
}`,
  },
  vercel: {
    label: "Vercel AI SDK",
    filename: "lib/outbound-agent.ts",
    caption:
      "Call the 6-step SalesGency MCP tools inside any Next.js route or Vercel AI SDK streamText / generateText call.",
    code: `import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const mcpResponse = await fetch("https://prospect.salesgency.com/api/mcp", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${DEMO_API_KEY}"
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "research_prospect",
      arguments: {
        company: "NexusFlow Data",
        prospect: { name: "Marcus Vance", title: "VP RevOps" },
        yourProducts: "SalesGency Prospect Automation Engine",
        valueProposition: "1 ICP to full outbound workflow in 30 days"
      }
    }
  })
});`,
  },
  cloudflare: {
    label: "Cloudflare Workers OAuth",
    filename: "worker-mcp-oauth.ts",
    caption:
      "Wrap the stateless MCP server with Cloudflare workers-oauth-provider for web-based Claude and ChatGPT OAuth 2.1 connectors.",
    code: `import OAuthProvider from "@cloudflare/workers-oauth-provider";

export default new OAuthProvider({
  apiRoute: "/api/mcp",
  apiHandler: {
    async fetch(request: Request, env: Env) {
      return fetch("https://prospect.salesgency.com/api/mcp", {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": \`Bearer \${env.SALESGENCY_MASTER_KEY}\`
        },
        body: request.body
      });
    }
  },
  authorizeEndpoint: "/oauth/authorize",
  tokenEndpoint: "/oauth/token"
});`,
  },
};

export default function HomePage() {
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const [activeHarness, setActiveHarness] = useState<string>("cursor");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const selectedNode =
    ARCHITECTURE_BLUEPRINT_NODES[activeNodeIndex] ||
    ARCHITECTURE_BLUEPRINT_NODES[0];
  const currentSnippet = HARNESS_SNIPPETS[activeHarness] || HARNESS_SNIPPETS.cursor;

  const copySnippet = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 1800);
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--surface-page)",
        color: "var(--text-primary)",
        overflowX: "hidden",
      }}
    >
      {/* Sticky Single-Line Navigation (<= 80px height) */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: "68px",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: "rgba(251, 250, 248, 0.90)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            height: "100%",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/home"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Logo size={30} />
            </Link>
            <Badge tone="brand">SalesGency × Diamitani</Badge>
          </div>

          <nav
            className="hidden lg:flex"
            style={{ alignItems: "center", gap: 24 }}
          >
            {[
              { label: "Vertical App", href: "#vertical-app" },
              { label: "6-Step Flow", href: "#flow" },
              { label: "Architecture", href: "#architecture" },
              { label: "MCP & Marketplace", href: "#marketplace" },
              { label: "Templates", href: "/templates" },
              { label: "Pricing", href: "#pricing" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  fontSize: "13.5px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <Button variant="outline" size="sm">
                Open workspace
              </Button>
            </Link>
            <Link href="/wizard" style={{ textDecoration: "none" }}>
              <Button variant="accent" size="sm" iconRight="ArrowRight">
                Compile outbound engine
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO + VERTICAL APP WORKBENCH */}
      <section
        id="vertical-app"
        style={{
          padding: "56px 24px 72px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Asymmetric Top Hero Header (4 elements max: Eyebrow, Headline, Subtext, CTAs) */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
          style={{ marginBottom: "36px" }}
        >
          <div className="lg:col-span-8">
            <div style={{ marginBottom: "16px" }}>
              <Badge tone="brand" icon="Zap">
                SALESGENCY × DIAMITANI INDUSTRIES · ROSTR + PAL + MCP
              </Badge>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 4.8vw, 58px)",
                fontWeight: 800,
                lineHeight: 1.06,
                letterSpacing: "-0.035em",
                color: "var(--ink-900)",
                margin: 0,
              }}
            >
              One ICP or buying signal to a{" "}
              <span style={{ color: "var(--cobalt-600)" }}>
                full outbound workflow.
              </span>
            </h1>
          </div>

          <div
            className="lg:col-span-4"
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.55,
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              Autonomous ROSTR agents find target accounts, extract decision-makers, write PAS emails, and sync to your CRM and sequencer.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/wizard" style={{ textDecoration: "none" }}>
                <Button variant="accent" size="md" iconRight="ArrowRight">
                  Compile outbound engine
                </Button>
              </Link>
              <Link href="/packages" style={{ textDecoration: "none" }}>
                <Button variant="outline" size="md" icon="Package">
                  Download agent kits
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Interactive Vertical Outbound Workbench */}
        <VerticalOutboundWorkbench />

        {/* Proof Metrics Bar (From Page 1 of the SalesGency PDF) */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          style={{ marginTop: "24px" }}
        >
          <StatTile
            value="3.4x"
            label="Higher reply rate across personalized PAS cadences"
            tone="brand"
          />
          <StatTile
            value="20+ hrs"
            label="Saved per rep / week on research and CRM upkeep"
            tone="verified"
          />
          <StatTile
            value="100%"
            label="Native CRM sync with active deal deduplication"
            tone="neutral"
          />
          <StatTile
            value="6 MCP"
            unit="tools"
            label="Streamable HTTP API for Claude, Cursor & n8n"
            tone="premium"
          />
        </div>
      </section>

      {/* SECTION 2: THE 6-STEP AUTOMATION FLOW (3 PHASES FROM PDF) */}
      <section
        id="flow"
        style={{
          padding: "88px 24px",
          background: "var(--surface-sunken)",
          borderTop: "1px solid var(--border-hairline)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ maxWidth: "720px", marginBottom: "48px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.6vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                color: "var(--ink-900)",
                margin: "0 0 12px",
              }}
            >
              The 6-step autonomous outbound flow
            </h2>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.6,
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              Everything in the ecosystem, whether an AI agent, data scraper, or CRM integration, is a connector designed to execute these six structured steps.
            </p>
          </div>

          {/* 3 Phases Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                phaseTitle: "Phase 1: Identification & Targeting",
                phaseSub: "Isolate high-intent accounts before spending enrichment credits",
                steps: SIX_STEP_AUTOMATION_FLOW.slice(0, 2),
              },
              {
                phaseTitle: "Phase 2: Sourcing & Intelligence",
                phaseSub: "Verify decision-maker deliverability and uncover induced + deduced signals",
                steps: SIX_STEP_AUTOMATION_FLOW.slice(2, 4),
              },
              {
                phaseTitle: "Phase 3: Messaging & Execution",
                phaseSub: "Generate Full-Body or Modular CRM Token copy behind a human approval gate",
                steps: SIX_STEP_AUTOMATION_FLOW.slice(4, 6),
              },
            ].map((phaseGroup, pIdx) => (
              <div
                key={phaseGroup.phaseTitle}
                style={{
                  background: pIdx === 2 ? "var(--surface-deep)" : "var(--surface-card)",
                  color: pIdx === 2 ? "var(--paper-0)" : "var(--text-primary)",
                  borderRadius: "var(--radius-xl)",
                  border: `1px solid ${
                    pIdx === 2 ? "var(--border-deep)" : "var(--border-hairline)"
                  }`,
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div
                  style={{
                    paddingBottom: "16px",
                    borderBottom: `1px solid ${
                      pIdx === 2 ? "var(--border-deep)" : "var(--border-hairline)"
                    }`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "17px",
                      fontWeight: 700,
                      color: pIdx === 2 ? "var(--paper-0)" : "var(--ink-900)",
                      marginBottom: 4,
                    }}
                  >
                    {phaseGroup.phaseTitle}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: pIdx === 2 ? "var(--ink-300)" : "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {phaseGroup.phaseSub}
                  </p>
                </div>

                {phaseGroup.steps.map((st) => (
                  <div
                    key={st.step}
                    style={{
                      padding: "16px",
                      borderRadius: "var(--radius-lg)",
                      background:
                        pIdx === 2
                          ? "rgba(255,255,255,0.04)"
                          : "var(--surface-sunken)",
                      border: `1px solid ${
                        pIdx === 2
                          ? "rgba(255,255,255,0.08)"
                          : "var(--border-hairline)"
                      }`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-data)",
                          fontSize: "12px",
                          fontWeight: 700,
                          color:
                            pIdx === 2
                              ? "var(--champagne-200)"
                              : "var(--cobalt-600)",
                        }}
                      >
                        {st.step} · {st.title}
                      </span>
                      <code
                        style={{
                          fontFamily: "var(--font-data)",
                          fontSize: "11px",
                          color:
                            pIdx === 2 ? "var(--ink-200)" : "var(--text-muted)",
                          background:
                            pIdx === 2
                              ? "rgba(0,0,0,0.3)"
                              : "var(--surface-card)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {st.mcpTool}
                      </code>
                    </div>

                    <p
                      style={{
                        margin: "0 0 12px",
                        fontSize: "13px",
                        lineHeight: 1.55,
                        color:
                          pIdx === 2
                            ? "var(--ink-200)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {st.summary}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {st.bullets.map((b) => (
                        <div
                          key={b}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            fontSize: "12px",
                            lineHeight: 1.45,
                            color:
                              pIdx === 2
                                ? "var(--ink-100)"
                                : "var(--ink-700)",
                          }}
                        >
                          <Icon
                            name="Check"
                            size={13}
                            color={
                              pIdx === 2
                                ? "var(--champagne-300)"
                                : "var(--cobalt-600)"
                            }
                            style={{ marginTop: 2 }}
                          />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: ARCHITECTURE BLUEPRINT (7-NODE PRODUCTION PIPELINE + ROSTR C4) */}
      <section
        id="architecture"
        style={{
          padding: "88px 24px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div style={{ maxWidth: "720px", marginBottom: "40px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3.6vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "var(--ink-900)",
              margin: "0 0 12px",
            }}
          >
            Production architecture blueprint
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            How the workflow nodes, CRM deduplication shield, PAL prompt compiler, and ROSTR entitlement engine connect in a live production environment.
          </p>
        </div>

        {/* Interactive Pipeline Rail Card */}
        <div
          style={{
            background: "var(--surface-deep)",
            borderRadius: "var(--radius-2xl)",
            border: "1px solid var(--border-deep)",
            padding: "24px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: "18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "var(--text-caption)",
                  color: "var(--ink-200)",
                }}
              >
                prospect-automation-engine.n8n.json
              </span>
              <Badge tone="verified" icon="Check">
                24/24 Automated Tests Passing
              </Badge>
            </div>
            <Link href="/templates" style={{ textDecoration: "none" }}>
              <Button variant="inverse" size="sm" iconRight="ArrowUpRight">
                Inspect full workflow JSON
              </Button>
            </Link>
          </div>

          <PipelineRail
            nodes={PIPELINE_NODES}
            activeIndex={activeNodeIndex}
            onSelect={setActiveNodeIndex}
            onDeep
          />

          <div
            style={{
              marginTop: "18px",
              padding: "16px 20px",
              borderRadius: "var(--radius-lg)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-deep)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "var(--text-micro)",
                  color: "var(--champagne-200)",
                  marginBottom: 4,
                }}
              >
                {selectedNode.node} · {selectedNode.binding}
              </div>
              <div
                style={{
                  fontSize: "var(--text-body-sm)",
                  color: "var(--paper-0)",
                  fontWeight: 600,
                }}
              >
                {selectedNode.function}
              </div>
              <div
                style={{
                  fontSize: "var(--text-caption)",
                  color: "var(--ink-300)",
                  marginTop: 2,
                }}
              >
                Platform bindings: {selectedNode.platforms}
              </div>
            </div>

            <Badge tone="deep" mono>
              {selectedNode.node.includes("06")
                ? "Human-in-the-loop Gate"
                : "Automated Node"}
            </Badge>
          </div>
        </div>

        {/* 2-Column Architecture Grid: C4 System Context + ROSTR Runtime Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            style={{
              background: "var(--surface-card)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-hairline)",
              padding: "26px",
              boxShadow: "var(--shadow-hairline)",
            }}
          >
            <h3
              style={{
                margin: "0 0 6px",
                fontSize: "var(--text-h3)",
                fontWeight: 700,
              }}
            >
              System Context (C4 Level 1 & 2)
            </h3>
            <p
              style={{
                margin: "0 0 18px",
                fontSize: "var(--text-caption)",
                color: "var(--text-secondary)",
              }}
            >
              Vercel serverless runtime, encrypted file vault, and Supabase RLS database connected to five external systems.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {C4_SYSTEM_CONTEXT_LINKS.map((item) => (
                <div
                  key={item.link}
                  style={{
                    padding: "11px 14px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--surface-sunken)",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--ink-900)",
                      }}
                    >
                      {item.link}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        marginTop: 2,
                      }}
                    >
                      {item.flows}
                    </div>
                  </div>
                  <Badge tone="brand" mono shape="rounded">
                    {item.protocol}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "var(--surface-card)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-hairline)",
              padding: "26px",
              boxShadow: "var(--shadow-hairline)",
            }}
          >
            <h3
              style={{
                margin: "0 0 6px",
                fontSize: "var(--text-h3)",
                fontWeight: 700,
              }}
            >
              ROSTR Runtime & Packaging Engine
            </h3>
            <p
              style={{
                margin: "0 0 18px",
                fontSize: "var(--text-caption)",
                color: "var(--text-secondary)",
              }}
            >
              Five modules take each agent folder from validated manifest to licensed, human-gated execution and a downloadable archive.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ROSTR_RUNTIME_MODULES.map((mod) => (
                <div
                  key={mod.module}
                  style={{
                    padding: "11px 14px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--surface-sunken)",
                  }}
                >
                  <code
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--cobalt-700)",
                    }}
                  >
                    {mod.module}
                  </code>
                  <div
                    style={{
                      fontSize: "12.5px",
                      color: "var(--text-secondary)",
                      marginTop: 3,
                      lineHeight: 1.45,
                    }}
                  >
                    {mod.purpose}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: MCP LAYER, HARNESS INTEGRATION & AGENT MARKETPLACE (Eyebrow #2) */}
      <section
        id="marketplace"
        style={{
          padding: "88px 24px",
          background: "var(--surface-deep)",
          color: "var(--paper-0)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ maxWidth: "740px", marginBottom: "44px" }}>
            <div
              style={{
                fontFamily: "var(--font-data)",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--champagne-200)",
                marginBottom: "12px",
              }}
            >
              MCP & AGENT MARKETPLACE
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.6vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                color: "var(--paper-0)",
                margin: "0 0 12px",
              }}
            >
              Use in your own agent harness or download from the marketplace
            </h2>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.6,
                color: "var(--ink-300)",
                margin: 0,
              }}
            >
              Connect Claude Code, Cursor, Antigravity, Vercel AI SDK, or Cloudflare Workers to our Streamable HTTP MCP server, or download standalone ROSTR agent kits.
            </p>
          </div>

          {/* Harness Integration Code Switcher */}
          <div
            style={{
              background: "var(--surface-deep-raised)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-deep)",
              overflow: "hidden",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                padding: "12px 20px",
                borderBottom: "1px solid var(--border-deep)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {Object.entries(HARNESS_SNIPPETS).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveHarness(key)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12px",
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      background:
                        activeHarness === key
                          ? "var(--cobalt-600)"
                          : "rgba(255,255,255,0.05)",
                      color:
                        activeHarness === key
                          ? "var(--paper-0)"
                          : "var(--ink-200)",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <Button
                variant="inverse"
                size="sm"
                icon={copiedSnippet ? "Check" : "Copy"}
                onClick={copySnippet}
              >
                {copiedSnippet ? "Copied config" : `Copy ${currentSnippet.filename}`}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div
                className="lg:col-span-5"
                style={{
                  padding: "24px",
                  borderRight: "1px solid var(--border-deep)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: "12px",
                      color: "var(--champagne-200)",
                      marginBottom: 8,
                    }}
                  >
                    {currentSnippet.filename}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      lineHeight: 1.6,
                      color: "var(--ink-200)",
                    }}
                  >
                    {currentSnippet.caption}
                  </p>
                </div>

                <div
                  style={{
                    padding: "14px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(0,0,0,0.25)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    fontSize: "12px",
                    color: "var(--ink-200)",
                  }}
                >
                  <strong style={{ color: "var(--paper-0)", display: "block", marginBottom: 4 }}>
                    Human-Approval Safety Contract
                  </strong>
                  When an MCP client invokes <code>enroll_outreach</code>, the server returns <code>pending_approval</code> and an <code>approvalId</code>. Only your operator dashboard or Slack webhook can approve the send.
                </div>
              </div>

              <div className="lg:col-span-7" style={{ padding: "20px 24px", background: "#080C12" }}>
                <pre
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-data)",
                    fontSize: "12.5px",
                    lineHeight: 1.6,
                    color: "var(--ink-100)",
                    overflowX: "auto",
                  }}
                >
                  <code>{currentSnippet.code}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* 3 Shipping ROSTR Agent Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {ROSTR_AGENTS.map((agent) => (
              <div
                key={agent.slug}
                style={{
                  background: "var(--surface-deep-raised)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--border-deep)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 18,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <Badge tone="deep" mono>
                      {agent.category}
                    </Badge>
                    {agent.humanApprovalGate ? (
                      <Badge tone="premium" icon="Lock">
                        Gate: {agent.humanApprovalGate}
                      </Badge>
                    ) : (
                      <Badge tone="verified">Auto-proceed</Badge>
                    )}
                  </div>

                  <h3
                    style={{
                      margin: "0 0 8px",
                      fontSize: "19px",
                      fontWeight: 700,
                      color: "var(--paper-0)",
                    }}
                  >
                    {agent.name}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 16px",
                      fontSize: "13.5px",
                      lineHeight: 1.55,
                      color: "var(--ink-200)",
                    }}
                  >
                    {agent.description}
                  </p>

                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      background: "#080C12",
                      border: "1px solid rgba(255,255,255,0.06)",
                      fontFamily: "var(--font-data)",
                      fontSize: "11px",
                      lineHeight: 1.6,
                      color: "var(--ink-200)",
                      marginBottom: 14,
                    }}
                  >
                    {agent.directoryTree.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <a
                    href={`/api/rostr/agents?slug=${agent.slug}&download=1`}
                    style={{ textDecoration: "none", flex: 1 }}
                  >
                    <Button variant="inverse" size="sm" fullWidth icon="Download">
                      Download Kit ({agent.price})
                    </Button>
                  </a>
                  <Link href="/packages" style={{ textDecoration: "none" }}>
                    <Button variant="outline" size="sm">
                      Specs
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY HIGH-GROWTH TEAMS CHOOSE SALESGENCY (FROM PAGE 7 OF PDF) */}
      <section
        id="why"
        style={{
          padding: "88px 24px",
          background: "var(--surface-sunken)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ maxWidth: "700px", marginBottom: "44px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.6vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                color: "var(--ink-900)",
                margin: "0 0 12px",
              }}
            >
              Why high-growth teams choose SalesGency
            </h2>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.6,
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              We do not sell bloated software subscriptions. We build and deploy custom revenue engines for your team inside the tools you already own.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "Zap" as const,
                title: "Live in 30 Days",
                body: "We do not do 6-month consulting roadmaps. We audit your funnel, design the architecture, and deploy functioning AI engines in weeks.",
              },
              {
                icon: "KeyRound" as const,
                title: "You Own the Engine",
                body: "Built directly on top of your CRM and data tools. No vendor lock-in; you own the workflows, prompts, MCP servers, and data pipelines.",
              },
              {
                icon: "Send" as const,
                title: "Built for Reps",
                body: "Emails send directly from your reps' inboxes or sequencers with high deliverability. Reps only step in to handle warm replies and run demos.",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: "var(--surface-card)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--border-hairline)",
                  padding: "28px 26px",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-md)",
                    background: "var(--cobalt-50)",
                    color: "var(--cobalt-600)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon name={card.icon} size={20} />
                </div>
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--ink-900)",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "var(--text-secondary)",
                  }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: TRANSPARENT PRICING */}
      <section
        id="pricing"
        style={{
          padding: "88px 24px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div style={{ maxWidth: "680px", marginBottom: "44px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3.6vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "var(--ink-900)",
              margin: "0 0 12px",
            }}
          >
            Own your outbound engine forever
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            Bring your own keys. Zero per-lead surcharges. Deploy via MCP, n8n, Vercel AI Stack, or Cloudflare.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <PricingCard
            name="ROSTR Agent & MCP Kit"
            price="$19.99"
            note="One-time download · Full source"
            description="Standalone ROSTR agent packages, 6-tool Streamable HTTP MCP server, Supabase migration, and n8n workflow JSON for your own harness."
            features={[
              "Prospect Automation Engine + MCP Kit (.zip)",
              "6 MCP tools with human approval gate",
              "Canonical 7-node and 9-node n8n JSON",
              "Delivery Framework A & B prompt templates",
              "Works in Claude Code, Cursor & Antigravity",
            ]}
            cta={
              <Link href="/packages" style={{ textDecoration: "none" }}>
                <Button variant="outline" fullWidth>
                  Download agent kits
                </Button>
              </Link>
            }
          />

          <PricingCard
            featured
            name="Vertical Outbound Platform"
            price="$99"
            cadence="/ month"
            note="Cancel anytime · 100% BYOK"
            description="Full interactive vertical outbound studio, hosted MCP endpoint, PAL workflow compiler, and unlimited campaign builds."
            features={[
              "1 ICP / Signal to full 6-step outbound flow",
              "Hosted Streamable HTTP MCP key (sg_live_...)",
              "HubSpot, Salesforce, Clay & Apollo adapters",
              "1-click Slack & dashboard approval gate",
              "All 3 ROSTR agents (Outbound, Inbound, Hygiene)",
              "Direct push to your n8n or Cloudflare instance",
            ]}
            cta={
              <Link href="/checkout?plan=pro" style={{ textDecoration: "none" }}>
                <Button variant="accent" fullWidth iconRight="ArrowRight">
                  Compile outbound engine
                </Button>
              </Link>
            }
          />

          <PricingCard
            tone="sunken"
            name="Custom Revenue Engine"
            price="Custom"
            note="Live in 30 days · White-glove build"
            description="We audit your funnel, design the architecture, and deploy functioning AI outbound engines inside your CRM and sequencer."
            features={[
              "Complete 30-day SalesGency architecture build",
              "Custom Clay, ZoomInfo & Apollo waterfalls",
              "CRM deduplication shield & historical cleanup",
              "Dedicated Slack approval & rep inbox routing",
              "Full handover of prompts, workflows & keys",
            ]}
            cta={
              <Link href="/checkout?plan=core" style={{ textDecoration: "none" }}>
                <Button variant="outline" fullWidth>
                  Book architecture audit
                </Button>
              </Link>
            }
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "var(--surface-deep)",
          borderTop: "1px solid var(--border-deep)",
          padding: "48px 24px",
          color: "var(--ink-300)",
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
            <Logo size={26} onDeep />
            <span>
              SalesGency × Diamitani Industries · Built by Patrick Diamitani
            </span>
          </div>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { label: "Vertical App", href: "#vertical-app" },
              { label: "6-Step Flow", href: "#flow" },
              { label: "Architecture", href: "/how-it-works" },
              { label: "Agent Marketplace", href: "/packages" },
              { label: "Workflow JSON", href: "/templates" },
              { label: "MCP Discovery API", href: "/api/mcp" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: "var(--ink-300)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
