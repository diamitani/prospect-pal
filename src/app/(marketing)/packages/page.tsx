"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Logo,
  Button,
  Badge,
  Icon,
  SectionHeading,
} from "@/components/ds";
import {
  ROSTR_AGENTS,
  ROSTR_RUNTIME_MODULES,
} from "@/lib/rostr/agents-registry";
import { DEMO_API_KEY } from "@/lib/mcp/auth";

const PACKAGE_STRUCTURE_FILES = [
  {
    file: "agent.json",
    label: "Canonical manifest",
    description:
      "Strict schema-validated manifest declaring pricing, required scopes, MCP tools, diamond approval gates, and runtime entrypoints.",
  },
  {
    file: "soul.md",
    label: "Identity & guardrails",
    description:
      "Core operating principles, forbidden actions, zero-hallucination constraints, and tone enforcement for the agent.",
  },
  {
    file: "SKILL.md",
    label: "PAL execution playbook",
    description:
      "Step-by-step Parse -> Ambiguity Scan -> Latent Intent -> Expand -> Compile instructions for autonomous harnesses.",
  },
  {
    file: "tools.json",
    label: "JSON-Schema tool contracts",
    description:
      "Complete input/output JSON Schemas for every step tool, including approval gate flags and error codes.",
  },
  {
    file: "workflow.n8n.json",
    label: "Importable n8n graph",
    description:
      "Production 7-node / 9-node n8n workflow JSON wired with Schedule/Webhook triggers, CRM dedupe, and approval switches.",
  },
  {
    file: "eval.json",
    label: "Deterministic test suite",
    description:
      "Golden test cases verifying schema conformance, secret-leak prevention, and human-in-the-loop gate locking.",
  },
];

const HARNESS_SNIPPETS: Record<
  "claude" | "cursor" | "vercel" | "cloudflare",
  { label: string; filename: string; code: string }
> = {
  claude: {
    label: "Claude Code / Desktop",
    filename: "claude_desktop_config.json",
    code: `{
  "mcpServers": {
    "salesgency-outbound": {
      "type": "http",
      "url": "https://prospectpal.io/api/mcp",
      "headers": {
        "Authorization": "Bearer ${DEMO_API_KEY}"
      }
    }
  }
}`,
  },
  cursor: {
    label: "Cursor / Antigravity",
    filename: ".cursor/mcp.json",
    code: `{
  "mcpServers": {
    "salesgency-rostr": {
      "url": "https://prospectpal.io/api/mcp",
      "headers": {
        "Authorization": "Bearer ${DEMO_API_KEY}"
      }
    }
  }
}`,
  },
  vercel: {
    label: "Vercel AI SDK",
    filename: "outbound-agent.ts",
    code: `import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

// Call the SalesGency MCP endpoint from your Vercel AI route
const mcpResponse = await fetch("https://prospectpal.io/api/mcp", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${DEMO_API_KEY}",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "identify_signals",
      arguments: {
        icp: "Series A-C B2B SaaS scaling outbound",
        triggers: ["Hiring SDRs", "New VP Sales"]
      }
    }
  })
});`,
  },
  cloudflare: {
    label: "Cloudflare Workers MCP",
    filename: "wrangler.jsonc",
    code: `{
  "name": "salesgency-mcp-edge-worker",
  "main": "src/worker.ts",
  "compatibility_date": "2026-03-01",
  "vars": {
    "UPSTREAM_MCP_URL": "https://prospectpal.io/api/mcp",
    "ROSTR_SUITE": "salesgency-rostr-suite-2026.04"
  }
}`,
  },
};

const FAQ = [
  {
    q: "How do I use the MCP server in my own AI harness?",
    a: "Point Claude Code, Cursor, Antigravity, or your Vercel AI SDK / Cloudflare Worker client to POST /api/mcp with your Bearer sg_live_... API key. All 6 outbound tools (identify_signals through enroll_outreach) are immediately callable via JSON-RPC 2.0.",
  },
  {
    q: "How does the human approval gate protect outbound sends?",
    a: "Calling enroll_outreach with an unapproved payload never dispatches emails. It creates a locked approval record (status: pending) and returns an approval_id. Only a human operator or your backend with the HMAC secret can POST /api/approvals/:id to unlock it.",
  },
  {
    q: "What is inside each downloadable ROSTR Agent Kit?",
    a: "Every kit follows the standardized agents/<slug>/ specification: agent.json, soul.md, SKILL.md, tools.json, workflow.n8n.json, prompt.md, eval.json, and README.md. Zero plaintext secrets are ever included.",
  },
  {
    q: "Can I use Delivery Framework B (Modular Body Token) with HubSpot or Smartlead?",
    a: "Yes. Set framework='B' in write_email and the engine outputs only the 2-3 sentence middle paragraph ({{email_body_token}}) so your CRM or sequencer retains full control of the greeting and signature.",
  },
  {
    q: "What is the difference between the $19.99 Agent Kit and Pro ($49/mo)?",
    a: "The $19.99 DIY kit gives you the complete downloadable ROSTR agent package and n8n JSON forever. Pro ($49/mo) includes hosted Streamable HTTP MCP access, all 3 ROSTR agents, and the interactive vertical workbench.",
  },
];

export default function PackagesPage() {
  const [selectedSlug, setSelectedSlug] = useState<string>(ROSTR_AGENTS[0].slug);
  const [activeHarness, setActiveHarness] = useState<
    "claude" | "cursor" | "vercel" | "cloudflare"
  >("claude");
  const [copiedHarness, setCopiedHarness] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const activeAgent =
    ROSTR_AGENTS.find((a) => a.slug === selectedSlug) ?? ROSTR_AGENTS[0];

  const handleCopyHarness = () => {
    navigator.clipboard.writeText(HARNESS_SNIPPETS[activeHarness].code);
    setCopiedHarness(true);
    setTimeout(() => setCopiedHarness(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      {/* Top Navigation (<= 80px single-line) */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          height: 68,
          padding: "0 32px",
          background: "rgba(251,250,248,0.88)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border-hairline)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
            <Logo size={32} />
          </Link>
          <Badge tone="brand">Agent Marketplace &amp; MCP</Badge>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link
            href="/home#workbench"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            Vertical Workbench
          </Link>
          <Link
            href="/how-it-works"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            Architecture
          </Link>
          <Link
            href="/templates"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            Templates
          </Link>
          <Link
            href="/home#pricing"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            Pricing
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/checkout?plan=diy">
            <Button variant="accent" size="sm" icon="Download">
              Buy Full Suite ($19.99)
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          padding: "64px 32px 48px",
          maxWidth: "var(--layout-max)",
          margin: "0 auto",
        }}
      >
        <div style={{ maxWidth: 820 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 12px",
              borderRadius: 999,
              background: "var(--cobalt-50)",
              border: "1px solid var(--cobalt-100)",
              color: "var(--cobalt-600)",
              fontFamily: "var(--font-data)",
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 18,
            }}
          >
            <Icon name="Package" size={13} color="var(--cobalt-600)" />
            ROSTR MULTI-AGENT REGISTRY v2026.04 - 24/24 TESTS PASSING
          </div>

          <h1
            style={{
              margin: "0 0 16px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(34px, 4.2vw, 52px)",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: "var(--text-primary)",
            }}
          >
            App Store &amp; MCP Marketplace for Autonomous Outbound.
          </h1>

          <p
            style={{
              margin: "0 0 28px",
              fontSize: 17,
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              maxWidth: 700,
            }}
          >
            Download self-contained ROSTR Agent Kits (`agent.json`, `soul.md`,
            `SKILL.md`, `tools.json`, `workflow.n8n.json`) or connect your AI
            harness directly to our Streamable HTTP MCP layer (`/api/mcp`).
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/checkout?plan=diy">
              <Button variant="accent" size="lg" icon="Download">
                Buy Agent Blueprints ($19.99)
              </Button>
            </Link>
            <a
              href={`/api/rostr/agents?slug=${selectedSlug}&download=1`}
              style={{ textDecoration: "none" }}
            >
              <Button variant="outline" size="lg" icon="FileCode">
                Download {selectedSlug}.kit.json
              </Button>
            </a>
            <Link href="/home#workbench">
              <Button variant="ghost" size="lg" icon="Terminal">
                Test in Live Workbench
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3 ROSTR Agents + Inspector */}
      <section
        style={{
          padding: "32px 32px 72px",
          maxWidth: "var(--layout-max)",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 18,
            marginBottom: 28,
          }}
        >
          {ROSTR_AGENTS.map((agent) => {
            const isSelected = agent.slug === selectedSlug;
            return (
              <div
                key={agent.slug}
                onClick={() => setSelectedSlug(agent.slug)}
                style={{
                  padding: 24,
                  borderRadius: "var(--radius-xl)",
                  background: isSelected
                    ? "var(--surface-deep)"
                    : "var(--surface-card)",
                  color: isSelected ? "var(--paper-0)" : "var(--text-primary)",
                  border: isSelected
                    ? "2px solid var(--cobalt-500)"
                    : "1px solid var(--border-hairline)",
                  boxShadow: isSelected
                    ? "var(--shadow-floating)"
                    : "var(--shadow-card)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.15s ease",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-data)",
                        fontSize: 11,
                        fontWeight: 700,
                        color: isSelected
                          ? "var(--champagne-300)"
                          : "var(--cobalt-600)",
                      }}
                    >
                      v{agent.version} - {agent.nodeCount}-NODE PIPELINE
                    </span>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 999,
                        fontSize: 10,
                        fontFamily: "var(--font-data)",
                        fontWeight: 700,
                        background: isSelected
                          ? "rgba(255,255,255,0.12)"
                          : "var(--cobalt-50)",
                        color: isSelected
                          ? "var(--paper-0)"
                          : "var(--cobalt-600)",
                      }}
                    >
                      {agent.pricing.oneTime}
                    </span>
                  </div>

                  <h2
                    style={{
                      margin: "0 0 6px",
                      fontFamily: "var(--font-display)",
                      fontSize: 19,
                      fontWeight: 700,
                      color: isSelected
                        ? "var(--paper-0)"
                        : "var(--text-primary)",
                    }}
                  >
                    {agent.name}
                  </h2>

                  <div
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: 11,
                      color: isSelected
                        ? "var(--ink-300)"
                        : "var(--text-muted)",
                      marginBottom: 12,
                    }}
                  >
                    agents/{agent.slug}/
                  </div>

                  <p
                    style={{
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: isSelected
                        ? "var(--ink-200)"
                        : "var(--text-secondary)",
                      marginBottom: 16,
                    }}
                  >
                    {agent.summary}
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      paddingTop: 12,
                      borderTop: isSelected
                        ? "1px solid var(--border-deep)"
                        : "1px solid var(--border-hairline)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-data)",
                        fontSize: 11,
                        color:
                          agent.approvalGates.length > 0
                            ? isSelected
                              ? "var(--champagne-300)"
                              : "var(--signal-warn)"
                            : isSelected
                            ? "var(--ink-300)"
                            : "var(--signal-good)",
                      }}
                    >
                      {agent.approvalGates.length > 0
                        ? `Gate: ${agent.approvalGates.join(", ")}`
                        : "Autonomous SLA Execution"}
                    </span>
                    <a
                      href={`/api/rostr/agents?slug=${agent.slug}&download=1`}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontFamily: "var(--font-data)",
                        fontSize: 11,
                        fontWeight: 600,
                        color: isSelected
                          ? "var(--champagne-300)"
                          : "var(--cobalt-600)",
                        textDecoration: "none",
                      }}
                    >
                      Download JSON -&gt;
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Agent Deep-Dive Inspector */}
        <div
          style={{
            borderRadius: "var(--radius-xl)",
            background: "var(--surface-card)",
            border: "1px solid var(--border-hairline)",
            boxShadow: "var(--shadow-card)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "18px 24px",
              background: "var(--surface-sunken)",
              borderBottom: "1px solid var(--border-hairline)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Badge tone="brand">Package Inspector</Badge>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {activeAgent.name}
              </span>
              <code
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: 12,
                  color: "var(--cobalt-600)",
                  background: "var(--cobalt-50)",
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                agents/{activeAgent.slug}/agent.json
              </code>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <a
                href={`/api/rostr/agents?slug=${activeAgent.slug}&download=1`}
                style={{ textDecoration: "none" }}
              >
                <Button variant="primary" size="sm" icon="Download">
                  Download {activeAgent.slug}.kit.json
                </Button>
              </a>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 0,
            }}
          >
            {/* Tool Pipeline Table */}
            <div
              style={{
                padding: 24,
                borderRight: "1px solid var(--border-hairline)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                MCP Tool Pipeline ({activeAgent.tools.length} Tools)
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {activeAgent.tools.map((tool, index) => (
                  <div
                    key={tool.name}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--surface-sunken)",
                      border: tool.requiresApproval
                        ? "1px solid rgba(196, 127, 10, 0.35)"
                        : "1px solid var(--border-hairline)",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-data)",
                            fontSize: 10,
                            fontWeight: 700,
                            color: "var(--text-muted)",
                          }}
                        >
                          0{index + 1}
                        </span>
                        <code
                          style={{
                            fontFamily: "var(--font-data)",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "var(--cobalt-600)",
                          }}
                        >
                          {tool.name}
                        </code>
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                          }}
                        >
                          ({tool.phase})
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-secondary)",
                          lineHeight: 1.45,
                        }}
                      >
                        {tool.description}
                      </div>
                    </div>

                    {tool.requiresApproval && (
                      <span
                        style={{
                          flexShrink: 0,
                          padding: "3px 8px",
                          borderRadius: 999,
                          background: "var(--signal-warn-bg)",
                          color: "var(--signal-warn)",
                          fontFamily: "var(--font-data)",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        HUMAN GATE
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Scopes, Files & Pricing Metadata */}
            <div style={{ padding: 24, display: "grid", gap: 20 }}>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Required Environment Scopes (Zero Plaintext Keys)
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {activeAgent.requiredScopes.map((scope) => (
                    <code
                      key={scope}
                      style={{
                        fontFamily: "var(--font-data)",
                        fontSize: 11,
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "var(--surface-deep)",
                        color: "var(--champagne-300)",
                      }}
                    >
                      {scope}
                    </code>
                  ))}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Included Package Files (`agents/{activeAgent.slug}/`)
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {activeAgent.files.map((f) => (
                    <div
                      key={f}
                      style={{
                        padding: "7px 10px",
                        borderRadius: 6,
                        background: "var(--surface-sunken)",
                        border: "1px solid var(--border-hairline)",
                        fontFamily: "var(--font-data)",
                        fontSize: 11,
                        color: "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Icon
                        name="FileText"
                        size={13}
                        color="var(--cobalt-600)"
                      />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: "var(--radius-md)",
                  background: "var(--cobalt-50)",
                  border: "1px solid var(--cobalt-100)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--cobalt-600)",
                    marginBottom: 6,
                  }}
                >
                  LICENSE &amp; ENTITLEMENT TIERS
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  <strong>{activeAgent.pricing.oneTime}</strong> DIY Blueprint
                  Download | <strong>{activeAgent.pricing.pro}</strong> Pro
                  Hosted MCP | <strong>{activeAgent.pricing.agency}</strong>{" "}
                  Multi-Tenant Agency
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect Your Harness (MCP Layer) */}
      <section
        style={{
          padding: "72px 32px",
          background: "var(--surface-sunken)",
          borderTop: "1px solid var(--border-hairline)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
          <SectionHeading
            title="Layer Into Any AI Harness via Streamable HTTP MCP"
            description="Mount the 6-step SalesGency outbound engine inside Claude Code, Cursor, Antigravity, Vercel AI SDK, or Cloudflare Workers."
          />

          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "1fr 1.25fr",
              gap: 24,
              alignItems: "start",
            }}
          >
            {/* Left column: Protocol guarantees */}
            <div style={{ display: "grid", gap: 14 }}>
              {[
                {
                  title: "Bearer API Key + Per-Agent License Check",
                  desc: "Every tools/call verifies SHA-256 hashed sg_live_ keys and active ROSTR agent entitlements before running.",
                },
                {
                  title: "Human Approval Gate on Step 06",
                  desc: "enroll_outreach never sends on first call. It creates a locked approval_id that requires a separate human POST /api/approvals/:id.",
                },
                {
                  title: "Dual Delivery Frameworks (A & B)",
                  desc: "Call write_email with framework='A' for full-body copy or framework='B' for modular {{email_body_token}} CRM injection.",
                },
                {
                  title: "Runtime Verification & Packaging",
                  desc: "Validated by the 5 ROSTR runtime modules (validator.js, registry.js, entitlements.js, runtime.js, package-rostr-agents.js).",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: "16px 18px",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--surface-card)",
                    border: "1px solid var(--border-hairline)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Right column: Code switcher */}
            <div
              style={{
                borderRadius: "var(--radius-xl)",
                background: "var(--surface-deep)",
                border: "1px solid var(--border-deep)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border-deep)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(
                    Object.keys(HARNESS_SNIPPETS) as Array<
                      keyof typeof HARNESS_SNIPPETS
                    >
                  ).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveHarness(key)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: 6,
                        border: "none",
                        background:
                          activeHarness === key
                            ? "var(--cobalt-600)"
                            : "rgba(255,255,255,0.07)",
                        color:
                          activeHarness === key
                            ? "white"
                            : "var(--ink-300)",
                        fontFamily: "var(--font-data)",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {HARNESS_SNIPPETS[key].label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopyHarness}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 6,
                    border: "1px solid var(--border-deep)",
                    background: "rgba(255,255,255,0.05)",
                    color: "var(--champagne-300)",
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  {copiedHarness ? "Copied!" : "Copy Config"}
                </button>
              </div>

              <div
                style={{
                  padding: "8px 16px",
                  background: "rgba(0,0,0,0.22)",
                  fontFamily: "var(--font-data)",
                  fontSize: 11,
                  color: "var(--ink-300)",
                }}
              >
                {HARNESS_SNIPPETS[activeHarness].filename}
              </div>

              <pre
                style={{
                  margin: 0,
                  padding: 20,
                  fontFamily: "var(--font-data)",
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: "var(--paper-0)",
                  overflowX: "auto",
                }}
              >
                <code>{HARNESS_SNIPPETS[activeHarness].code}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside Each Package */}
      <section
        style={{
          padding: "72px 32px",
          maxWidth: "var(--layout-max)",
          margin: "0 auto",
        }}
      >
        <SectionHeading
          eyebrow="Standardized Specification"
          title="Inside Every ROSTR Agent Package"
          description="Every downloadable package conforms to the strict ROSTR 8-file directory layout and passes automated schema and secret-leak checks."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginTop: 32,
          }}
        >
          {PACKAGE_STRUCTURE_FILES.map((item) => (
            <div
              key={item.file}
              style={{
                padding: 22,
                background: "var(--surface-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-hairline)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <Icon name="FileText" size={17} color="var(--cobalt-600)" />
                <code
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: 12,
                    color: "var(--cobalt-600)",
                    background: "var(--cobalt-50)",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {item.file}
                </code>
              </div>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: "0 0 6px",
                }}
              >
                {item.label}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Runtime Modules Bar */}
        <div
          style={{
            marginTop: 24,
            padding: 20,
            borderRadius: "var(--radius-lg)",
            background: "var(--surface-sunken)",
            border: "1px solid var(--border-hairline)",
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 12,
          }}
        >
          {ROSTR_RUNTIME_MODULES.map((mod) => (
            <div key={mod.path}>
              <div
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--cobalt-600)",
                  marginBottom: 4,
                }}
              >
                {mod.path}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  lineHeight: 1.4,
                }}
              >
                {mod.responsibility}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{
          padding: "56px 32px 72px",
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        <SectionHeading title="Frequently Asked Questions" />

        <div style={{ marginTop: 28 }}>
          {FAQ.map((item, idx) => (
            <div
              key={idx}
              style={{
                borderBottom: "1px solid var(--border-hairline)",
                paddingBottom: 16,
                marginBottom: 16,
              }}
            >
              <button
                onClick={() =>
                  setExpandedFaq(expandedFaq === idx ? null : idx)
                }
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {item.q}
                </span>
                <Icon
                  name={expandedFaq === idx ? "ChevronUp" : "ChevronDown"}
                  size={18}
                  color="var(--text-muted)"
                />
              </button>
              {expandedFaq === idx && (
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    marginTop: 10,
                    marginBottom: 0,
                  }}
                >
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "32px",
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
          }}
        >
          <Logo size={26} />
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            2026 SalesGency x Diamitani Industries. ROSTR Multi-Agent System
            &amp; MCP Kit.
          </div>
          <Link
            href="/home#pricing"
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            View all plans
          </Link>
        </div>
      </footer>
    </div>
  );
}
