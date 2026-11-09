"use client";

import Link from "next/link";
import {
  Logo,
  Button,
  Badge,
  Icon,
  SectionHeading,
} from "@/components/ds";
import {
  SIX_STEP_AUTOMATION_FLOW,
  ARCHITECTURE_BLUEPRINT_NODES,
  ROSTR_AGENTS,
  ROSTR_RUNTIME_MODULES,
} from "@/lib/rostr/agents-registry";

const TEST_SUITE_GROUPS = [
  {
    suite: "Manifest & Schema Validation",
    stats: "6/6 Passed",
    checks: [
      "Validates all 3 agent manifests (prospect-automation-engine, inbound-responder, crm-hygiene)",
      "Rejects missing required fields and invalid semver versions",
      "Blocks plaintext API keys or raw credentials in any manifest or workflow",
      "Enforces approvalGates subset against tools with requiresApproval=true",
    ],
  },
  {
    suite: "Agent Registry & Discovery",
    stats: "5/5 Passed",
    checks: [
      "Discovers and indexes all 3 agents from disk and memory",
      "Returns public catalog summary with pricing, tools, and node counts",
      "Loads full agent bundle including agent.json, soul.md, SKILL.md, tools.json, workflow.n8n.json",
    ],
  },
  {
    suite: "Licensing & Entitlements",
    stats: "5/5 Passed",
    checks: [
      "Verifies HMAC-SHA256 signed license tokens and expiration timestamps",
      "Rejects tampered signatures and expired tokens",
      "Checks per-agent entitlement for one-time, pro, and agency tiers",
    ],
  },
  {
    suite: "Streamable HTTP MCP & Approval Gates",
    stats: "13/13 Passed",
    checks: [
      "Executes all 6 outbound step tools over JSON-RPC 2.0",
      "Blocks unapproved enroll_outreach calls with status=requires_approval",
      "Prevents AI clients from self-approving without human HMAC secret",
      "Dispatches exact approved payload once and rejects replay attempts",
    ],
  },
];

export default function HowItWorksPage() {
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
          <Badge tone="brand">Architecture Brief</Badge>
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
            href="/packages"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            MCP &amp; Marketplace
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
          <Link href="/home#workbench">
            <Button variant="accent" size="sm" icon="Zap">
              Run 1-ICP Pipeline
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
          <Icon name="BookOpen" size={13} color="var(--cobalt-600)" />
          TECHNICAL ARCHITECTURE BRIEF - SALESGENCY X DIAMITANI INDUSTRIES
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(34px, 4.2vw, 52px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            margin: "0 0 16px",
            color: "var(--text-primary)",
          }}
        >
          From 1 Buying Signal to a Production Outbound Engine.
        </h1>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            maxWidth: 740,
            margin: 0,
          }}
        >
          We do not force you to abandon your existing GTM stack. SalesGency
          layers a 6-step autonomous pipeline, 7-node n8n orchestration blueprint,
          and Streamable HTTP MCP server directly over your CRM, data providers,
          and email sequencers.
        </p>
      </section>

      {/* Section 1: The 6-Step Automation Flow (3 Phases) */}
      <section
        style={{
          padding: "56px 32px 72px",
          background: "var(--surface-sunken)",
          borderTop: "1px solid var(--border-hairline)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
          <SectionHeading
            eyebrow="Phase 1 to Phase 3"
            title="The 6-Step Automation Flow"
            description="Every step maps 1:1 to a callable MCP tool (/api/mcp) and a modular n8n sub-workflow."
          />

          <div
            style={{
              marginTop: 36,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 18,
            }}
          >
            {SIX_STEP_AUTOMATION_FLOW.map((s) => (
              <div
                key={s.step}
                style={{
                  padding: 24,
                  background: "var(--surface-card)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--border-hairline)",
                  boxShadow: "var(--shadow-card)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
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
                        color: "var(--cobalt-600)",
                        background: "var(--cobalt-50)",
                        padding: "3px 8px",
                        borderRadius: 6,
                      }}
                    >
                      STEP {s.step}
                    </span>
                    <code
                      style={{
                        fontFamily: "var(--font-data)",
                        fontSize: 11,
                        color: "var(--text-muted)",
                      }}
                    >
                      {s.mcpTool}
                    </code>
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    {s.phase}
                  </div>

                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontFamily: "var(--font-display)",
                      fontSize: 19,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {s.title}
                  </h3>

                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--cobalt-600)",
                      marginBottom: 10,
                    }}
                  >
                    {s.subtitle}
                  </div>

                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      lineHeight: 1.55,
                      marginBottom: 16,
                    }}
                  >
                    {s.description}
                  </p>
                </div>

                <div
                  style={{
                    paddingTop: 12,
                    borderTop: "1px solid var(--border-hairline)",
                    display: "grid",
                    gap: 6,
                  }}
                >
                  {s.highlights.map((h) => (
                    <div
                      key={h}
                      style={{
                        fontSize: 12,
                        color: "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Icon
                        name="Check"
                        size={13}
                        color="var(--signal-good)"
                      />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Deep Dive - Induced vs Deduced Signals & Delivery Frameworks A/B */}
      <section
        style={{
          padding: "72px 32px",
          maxWidth: "var(--layout-max)",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          {/* Step 4 Deep Dive */}
          <div
            style={{
              padding: 28,
              borderRadius: "var(--radius-xl)",
              background: "var(--surface-card)",
              border: "1px solid var(--border-hairline)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-data)",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--cobalt-600)",
                marginBottom: 8,
              }}
            >
              STEP 04 DEEP RESEARCH (`research_prospect`)
            </div>
            <h3
              style={{
                margin: "0 0 12px",
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Induced Facts vs. Deduced Pain Signals
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: 18,
              }}
            >
              Our research engine separates verifiable facts from strategic
              inferences so copywriters and AI agents never fabricate claims.
            </p>
            <div style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  padding: 14,
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface-sunken)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--signal-good)",
                    marginBottom: 4,
                  }}
                >
                  INDUCED SIGNALS (DIRECT OBSERVATIONS)
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Explicit facts scraped from press releases, job boards, and
                  LinkedIn posts (e.g., &quot;3 open SDR roles posted in the last 14
                  days&quot;).
                </div>
              </div>
              <div
                style={{
                  padding: 14,
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface-sunken)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--cobalt-600)",
                    marginBottom: 4,
                  }}
                >
                  DEDUCED SIGNALS (AI STRATEGIC INFERENCES)
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Operational bottlenecks inferred from the induced facts (e.g.,
                  &quot;Manual list-building is creating a 60+ min/day research
                  bottleneck per rep&quot;).
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 Deep Dive */}
          <div
            style={{
              padding: 28,
              borderRadius: "var(--radius-xl)",
              background: "var(--surface-card)",
              border: "1px solid var(--border-hairline)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-data)",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--cobalt-600)",
                marginBottom: 8,
              }}
            >
              STEP 05 PERSONALIZATION (`write_email`)
            </div>
            <h3
              style={{
                margin: "0 0 12px",
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Two Flexible Delivery Frameworks
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: 18,
              }}
            >
              Choose between generating the complete email or generating a
              drop-in middle token for existing CRM sequences.
            </p>
            <div style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  padding: 14,
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface-sunken)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 4,
                  }}
                >
                  FRAMEWORK A: FULL-BODY GENERATION
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Generates the complete email from greeting (`Hi First_Name,`)
                  to sign-off. Ideal for standalone autonomous campaigns.
                </div>
              </div>
              <div
                style={{
                  padding: 14,
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
                    marginBottom: 4,
                  }}
                >
                  FRAMEWORK B: MODULAR BODY ONLY (`{"{{email_body_token}}"}`)
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Outputs only the 2-3 sentence personalized middle paragraph.
                  Injected directly into `Hi [Name], {"{{email_body_token}}"} Best,
                  [Signature]`.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: 7-Node Production Architecture Blueprint & C4 Architecture */}
      <section
        style={{
          padding: "72px 32px",
          background: "var(--surface-deep)",
          color: "var(--paper-0)",
        }}
      >
        <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                fontFamily: "var(--font-data)",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--champagne-300)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              System Architecture Blueprint
            </div>
            <h2
              style={{
                margin: "0 0 10px",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(26px, 3vw, 36px)",
                fontWeight: 700,
              }}
            >
              7-Node Production Workflow &amp; ROSTR Runtime
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                color: "var(--ink-300)",
                maxWidth: 680,
              }}
            >
              Built for resilience, zero duplicate outreach, and strict
              human-in-the-loop safety gates.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 10,
              marginBottom: 32,
            }}
          >
            {ARCHITECTURE_BLUEPRINT_NODES.map((node) => (
              <div
                key={node.id}
                style={{
                  padding: 16,
                  borderRadius: "var(--radius-lg)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border-deep)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--champagne-300)",
                    marginBottom: 6,
                  }}
                >
                  NODE {node.id}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--paper-0)",
                    marginBottom: 6,
                  }}
                >
                  {node.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink-300)",
                    lineHeight: 1.45,
                  }}
                >
                  {node.caption}
                </div>
              </div>
            ))}
          </div>

          {/* Runtime Modules */}
          <div
            style={{
              padding: 24,
              borderRadius: "var(--radius-xl)",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border-deep)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-data)",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--champagne-300)",
                marginBottom: 14,
              }}
            >
              ROSTR RUNTIME &amp; PACKAGING ENGINE MODULES
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 14,
              }}
            >
              {ROSTR_RUNTIME_MODULES.map((m) => (
                <div key={m.path}>
                  <code
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: 11,
                      color: "var(--paper-0)",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {m.path}
                  </code>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--ink-300)",
                      lineHeight: 1.45,
                    }}
                  >
                    {m.responsibility}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Verification & Test Suite */}
      <section
        style={{
          padding: "72px 32px",
          maxWidth: "var(--layout-max)",
          margin: "0 auto",
        }}
      >
        <SectionHeading
          eyebrow="Production Readiness"
          title="Automated Verification & Security Guarantees"
          description="Every ROSTR agent package and MCP tool call is verified against deterministic schema, entitlement, and approval-gate test suites."
        />

        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 18,
          }}
        >
          {TEST_SUITE_GROUPS.map((group) => (
            <div
              key={group.suite}
              style={{
                padding: 24,
                borderRadius: "var(--radius-xl)",
                background: "var(--surface-card)",
                border: "1px solid var(--border-hairline)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {group.suite}
                </h3>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: "var(--signal-good-bg)",
                    color: "var(--signal-good)",
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {group.stats}
                </span>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                {group.checks.map((c) => (
                  <div
                    key={c}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    <Icon
                      name="Check"
                      size={14}
                      color="var(--signal-good)"
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "56px 32px",
          textAlign: "center",
          background: "var(--surface-sunken)",
          borderTop: "1px solid var(--border-hairline)",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 30,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 12,
            }}
          >
            Test the 6-Step Engine Live
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "var(--text-secondary)",
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            Run 1 ICP or buying signal through our vertical workbench or
            download the ROSTR Agent Kits for your own stack.
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: 12 }}
          >
            <Link href="/home#workbench">
              <Button variant="accent" size="lg" icon="Zap">
                Launch Vertical Workbench
              </Button>
            </Link>
            <Link href="/packages">
              <Button variant="outline" size="lg" icon="Package">
                Browse Agent Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "32px",
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
          }}
        >
          <Logo size={26} />
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            2026 SalesGency x Diamitani Industries. Prospect Automation Engine.
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <Link
              href="/home"
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              Home
            </Link>
            <Link
              href="/packages"
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              Marketplace
            </Link>
            <Link
              href="/home#pricing"
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
