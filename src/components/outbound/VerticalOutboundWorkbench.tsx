"use client";

import { useState, useCallback } from "react";
import { Badge, Button, Icon } from "@/components/ds";
import { DEMO_API_KEY } from "@/lib/mcp/constants";

interface StepResult {
  status: "idle" | "running" | "done" | "bypassed" | "pending_approval" | "sent" | "error";
  data?: Record<string, unknown>;
}

const PRESETS = [
  {
    id: "saas-revops",
    label: "Series A-B SaaS hiring RevOps",
    icp: "Series A-B B2B SaaS (50-300 employees) scaling outbound and hiring RevOps or GTM Engineers",
    persona: "VP RevOps, Head of Growth",
    product: "SalesGency Prospect Automation Engine (ROSTR + PAL + n8n + MCP)",
    valueProp:
      "Deploy a custom 1-ICP-to-full-outbound revenue engine inside your CRM and n8n stack in 30 days, saving 20+ hrs/rep/wk with 3.4x higher reply rates.",
    method: "enrichment_platform" as const,
  },
  {
    id: "fintech-migration",
    label: "Fintech migrating CRM / Cloud",
    icp: "Mid-market Fintech & DevTools raising $10M+ with active HubSpot or Salesforce pipeline expansion",
    persona: "CRO, VP Sales, Director of Revenue Operations",
    product: "Autonomous Outbound & CRM Hygiene Multi-Agent Suite",
    valueProp:
      "Eliminate CRM deal collisions with an automated deduplication shield while AI agents research induced/deduced signals and enroll verified decision-makers.",
    method: "search_syntax_mx" as const,
  },
  {
    id: "pre-acquired-csv",
    label: "Pre-acquired CSV list (Bypass Steps 1-2)",
    icp: "Pre-purchased conference & intent lead list of B2B software leaders",
    persona: "VP Sales, Founder",
    product: "SalesGency Modular CRM Token Copywriter",
    valueProp:
      "Bypass list building and run deep induced/deduced signal research plus modular CRM body tokens directly into your active sequencer.",
    method: "pre_acquired_list" as const,
  },
];

export function VerticalOutboundWorkbench() {
  const [icp, setIcp] = useState(PRESETS[0].icp);
  const [persona, setPersona] = useState(PRESETS[0].persona);
  const [product, setProduct] = useState(PRESETS[0].product);
  const [valueProp, setValueProp] = useState(PRESETS[0].valueProp);

  const [workflowOrigin, setWorkflowOrigin] = useState<
    "static_icp" | "search_or_prompt" | "another_workflow"
  >("search_or_prompt");
  const [listSource, setListSource] = useState<"spreadsheet" | "crm" | "webhook">("crm");
  const [contactMethod, setContactMethod] = useState<
    "search_syntax_mx" | "enrichment_platform" | "pre_acquired_list"
  >("enrichment_platform");
  const [enrichmentProvider, setEnrichmentProvider] = useState<
    "clay" | "apollo" | "zoominfo"
  >("clay");
  const [emailFormat, setEmailFormat] = useState<"full_email" | "body_only">("full_email");
  const [outreachRoute, setOutreachRoute] = useState<"sequencer" | "mailbox_direct">(
    "sequencer"
  );
  const [sequencerId, setSequencerId] = useState("smartlead_prod_campaign");

  const [running, setRunning] = useState(false);
  const [approving, setApproving] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [n8nActionLoading, setN8nActionLoading] = useState<string | null>(null);
  const [n8nPanelResult, setN8nPanelResult] = useState<Record<string, unknown> | null>(null);
  const [activeExtensionTab, setActiveExtensionTab] = useState<
    "n8n_engineer" | "n8n_analyst" | "composio"
  >("n8n_engineer");

  const [steps, setSteps] = useState<Record<number, StepResult>>({
    1: {
      status: "done",
      data: {
        icp: PRESETS[0].icp,
        workflowOrigin: "search_or_prompt",
        sources: [
          "Series A-B funding announcements",
          "GTM & RevOps job postings",
          "CRM & n8n stack detection",
        ],
        searchParameters: [
          'site:linkedin.com/jobs "Series A-B B2B SaaS" ("RevOps" OR "Outbound" OR "n8n")',
          '"B2B SaaS" AND ("Series A" OR "Series B" OR "HubSpot")',
        ],
      },
    },
    2: {
      status: "done",
      data: {
        source: "crm",
        crmDedupeShield: "active (excluded 2 existing customers and 1 open opportunity)",
        companies: [
          {
            name: "NexusFlow Data",
            domain: "nexusflow.io",
            signals: ["Series A ($12M)", "Hiring GTM Automation Engineer", "Runs HubSpot + n8n"],
          },
          {
            name: "HyperScale AI",
            domain: "hyperscale.ai",
            signals: ["Series B ($28M)", "Hiring Head of Outbound Growth", "Runs Salesforce + Clay"],
          },
        ],
      },
    },
    3: {
      status: "done",
      data: {
        method: "enrichment_platform",
        enrichmentProvider: "clay",
        mxVerification: "passed (100% valid MX records)",
        contacts: [
          {
            name: "Marcus Vance",
            firstName: "Marcus",
            title: "VP RevOps",
            company: "NexusFlow Data",
            domain: "nexusflow.io",
            email: "marcus.vance@nexusflow.io",
            syntaxPattern: "{first}.{last}@nexusflow.io",
            mxVerified: true,
          },
          {
            name: "Elena Rostova",
            firstName: "Elena",
            title: "Head of Growth",
            company: "HyperScale AI",
            domain: "hyperscale.ai",
            email: "elena.rostova@hyperscale.ai",
            syntaxPattern: "{first}.{last}@hyperscale.ai",
            mxVerified: true,
          },
        ],
      },
    },
    4: {
      status: "done",
      data: {
        companyOverview:
          "NexusFlow Data (nexusflow.io) is scaling its B2B data infrastructure revenue motion after a $12M Series A.",
        prospectOverview:
          "Marcus Vance, VP RevOps, owns outbound pipeline efficiency, CRM hygiene, and rep productivity.",
        signalInduced:
          "Explicit event: Posted GTM Automation Engineer role 6 days ago and expanded HubSpot seat count.",
        signalDeduced:
          "Implicit bottleneck: Reps are spending 20+ hrs/week manually stitching Clay enrichment, HubSpot deduplication, and cold copy.",
        products: PRESETS[0].product,
        valueProposition: PRESETS[0].valueProp,
      },
    },
    5: {
      status: "done",
      data: {
        framework: "Delivery Framework A: Full-Body",
        subject: "NexusFlow outbound architecture / quick question",
        body: "Hi Marcus,\n\nSaw the signal on your end (Explicit event: Posted GTM Automation Engineer role 6 days ago and expanded HubSpot seat count). Typically at this stage, reps risk spending 20+ hours per week manually stitching enrichment, CRM deduplication, and personalized copy across disconnected tools.\n\nDeploy a custom 1-ICP-to-full-outbound revenue engine inside your CRM and n8n stack in 30 days, saving 20+ hrs/rep/wk with 3.4x higher reply rates. Open to a 15-minute architecture walkthrough this week?\n\nBest,\nPatrick Diamitani\nFounder, SalesGency",
        crmTokenPreview:
          "Hi Marcus,\n\n{{email_body_token}}\n\nBest,\nPatrick Diamitani\nFounder, SalesGency",
      },
    },
    6: {
      status: "pending_approval",
      data: {
        status: "pending_approval",
        approvalId: "apr_demo_9f21c",
        contactsStaged: 2,
        route: "sequencer",
        next: 'Human approval required before live enrollment. Click "Approve & Enroll" to authorize.',
      },
    },
  });

  const callMcpTool = async (name: string, args: Record<string, unknown>) => {
    const res = await fetch("/api/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${DEMO_API_KEY}`,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: { name, arguments: args },
      }),
    });
    const json = await res.json();
    const text = json?.result?.content?.[0]?.text;
    const isError = Boolean(json?.result?.isError);
    let parsed: Record<string, unknown> = {};
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = { message: text };
    }
    return { isError, data: parsed };
  };

  const runFullVerticalPipeline = useCallback(async () => {
    setRunning(true);
    const personasList = persona
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const bypass = contactMethod === "pre_acquired_list";

      if (bypass) {
        setSteps((prev) => ({
          ...prev,
          1: {
            status: "bypassed",
            data: { note: "Bypassed Step 01 (Pre-acquired lead list selected)" },
          },
          2: {
            status: "bypassed",
            data: { note: "Bypassed Step 02 (Pre-acquired lead list selected)" },
          },
        }));
      } else {
        setSteps((prev) => ({ ...prev, 1: { status: "running" } }));
        const s1 = await callMcpTool("identify_signals", {
          icp,
          workflowOrigin,
          signalSources: ["Funding rounds", "GTM & RevOps hiring", "Tech stack changes"],
        });
        setSteps((prev) => ({
          ...prev,
          1: { status: s1.isError ? "error" : "done", data: s1.data },
        }));

        setSteps((prev) => ({ ...prev, 2: { status: "running" } }));
        const s2 = await callMcpTool("build_company_list", {
          source: listSource,
        });
        setSteps((prev) => ({
          ...prev,
          2: { status: s2.isError ? "error" : "done", data: s2.data },
        }));
      }

      setSteps((prev) => ({ ...prev, 3: { status: "running" } }));
      const s3 = await callMcpTool("find_contacts", {
        method: contactMethod,
        personas: personasList.length ? personasList : ["VP RevOps", "Head of Growth"],
        enrichmentProvider,
        ...(bypass
          ? {
              preAcquiredContacts: [
                {
                  name: "Marcus Vance",
                  title: personasList[0] || "VP RevOps",
                  email: "marcus.vance@nexusflow.io",
                  company: "NexusFlow Data",
                },
              ],
            }
          : {}),
      });
      setSteps((prev) => ({
        ...prev,
        3: { status: s3.isError ? "error" : "done", data: s3.data },
      }));

      setSteps((prev) => ({ ...prev, 4: { status: "running" } }));
      const s4 = await callMcpTool("research_prospect", {
        company: "NexusFlow Data",
        domain: "nexusflow.io",
        prospect: {
          name: "Marcus Vance",
          title: personasList[0] || "VP RevOps",
        },
        yourProducts: product,
        valueProposition: valueProp,
        knownSignals: [
          `Matches ICP: ${icp.slice(0, 80)}`,
          "Hiring GTM Automation & RevOps talent",
        ],
      });
      setSteps((prev) => ({
        ...prev,
        4: { status: s4.isError ? "error" : "done", data: s4.data },
      }));

      setSteps((prev) => ({ ...prev, 5: { status: "running" } }));
      const s5 = await callMcpTool("write_email", {
        brief: s4.data,
        format: emailFormat,
        firstName: "Marcus",
        tone: "direct, executive, zero fluff",
      });
      setSteps((prev) => ({
        ...prev,
        5: { status: s5.isError ? "error" : "done", data: s5.data },
      }));

      setSteps((prev) => ({ ...prev, 6: { status: "running" } }));
      const s6 = await callMcpTool("enroll_outreach", {
        route: outreachRoute,
        sequencerId: outreachRoute === "sequencer" ? sequencerId : undefined,
        contacts: [
          {
            email: "marcus.vance@nexusflow.io",
            firstName: "Marcus",
            subject: String(s5.data?.subject || "Outbound architecture"),
            body: String(s5.data?.body || "Hello Marcus"),
          },
        ],
      });
      setSteps((prev) => ({
        ...prev,
        6: {
          status:
            s6.data?.status === "pending_approval"
              ? "pending_approval"
              : s6.isError
                ? "error"
                : "done",
          data: s6.data,
        },
      }));
    } finally {
      setRunning(false);
    }
  }, [
    icp,
    persona,
    product,
    valueProp,
    workflowOrigin,
    listSource,
    contactMethod,
    enrichmentProvider,
    emailFormat,
    outreachRoute,
    sequencerId,
  ]);

  const handleToggleEmailFormat = async (nextFormat: "full_email" | "body_only") => {
    setEmailFormat(nextFormat);
    const brief = steps[4]?.data || {};
    const s5 = await callMcpTool("write_email", {
      brief,
      format: nextFormat,
      firstName: "Marcus",
      tone: "direct, executive, zero fluff",
    });
    setSteps((prev) => ({
      ...prev,
      5: { status: "done", data: s5.data },
    }));
  };

  const handleApproveAndSend = async () => {
    setApproving(true);
    try {
      let currentApprovalId = String(steps[6]?.data?.approvalId || "");
      // If using initial seeded state id, create a live approval in store first
      if (!currentApprovalId || currentApprovalId === "apr_demo_9f21c") {
        const staged = await callMcpTool("enroll_outreach", {
          route: outreachRoute,
          sequencerId: outreachRoute === "sequencer" ? sequencerId : undefined,
          contacts: [
            {
              email: "marcus.vance@nexusflow.io",
              firstName: "Marcus",
              subject: String(steps[5]?.data?.subject || "Outbound architecture"),
              body: String(steps[5]?.data?.body || "Hello Marcus"),
            },
          ],
        });
        currentApprovalId = String(staged.data?.approvalId || "");
      }

      if (!currentApprovalId) return;

      await fetch(`/api/approvals/${currentApprovalId}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-approval-secret": "salesgency-operator-approval-secret-2026",
        },
        body: JSON.stringify({ decision: "approved" }),
      });

      const executed = await callMcpTool("enroll_outreach", {
        route: outreachRoute,
        approvalId: currentApprovalId,
      });

      setSteps((prev) => ({
        ...prev,
        6: {
          status: executed.data?.status === "sent" ? "sent" : "done",
          data: executed.data,
        },
      }));
    } finally {
      setApproving(false);
    }
  };

  const handleRunExtensionTool = async (
    tab: "n8n_engineer" | "n8n_analyst" | "composio"
  ) => {
    setActiveExtensionTab(tab);
    setN8nActionLoading(tab);
    try {
      if (tab === "n8n_engineer") {
        const res = await callMcpTool("n8n_architect_and_deploy", {
          intent: `${icp} -> ${enrichmentProvider} enrich -> CRM dedupe -> ${outreachRoute}`,
          surface: "mcp_server_trigger",
          integrations: ["HubSpot", enrichmentProvider, "Smartlead", "Slack"],
          deployMode: "spec_and_json",
        });
        setN8nPanelResult(res.data);
      } else if (tab === "n8n_analyst") {
        const res = await callMcpTool("n8n_inspect_executions", {
          question: "snapshot",
        });
        setN8nPanelResult(res.data);
      } else {
        const res = await callMcpTool("composio_connect_integration", {
          appId: "hubspot",
          mode: "status",
        });
        setN8nPanelResult(res.data);
      }
    } finally {
      setN8nActionLoading(null);
    }
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const selectPreset = (p: (typeof PRESETS)[number]) => {
    setIcp(p.icp);
    setPersona(p.persona);
    setProduct(p.product);
    setValueProp(p.valueProp);
    setContactMethod(p.method);
  };

  return (
    <div
      style={{
        background: "var(--surface-deep)",
        borderRadius: "var(--radius-2xl)",
        border: "1px solid var(--border-deep)",
        boxShadow: "var(--shadow-overlay)",
        overflow: "hidden",
        color: "var(--paper-0)",
      }}
    >
      {/* Top Engine Bar */}
      <div
        style={{
          padding: "14px 22px",
          borderBottom: "1px solid var(--border-deep)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#10B981",
              boxShadow: "0 0 10px rgba(16,185,129,0.7)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-data)",
              fontSize: "var(--text-caption)",
              color: "var(--paper-0)",
              fontWeight: 600,
            }}
          >
            ROSTR + PAL Vertical Outbound Engine
          </span>
          <Badge tone="deep" mono shape="rounded">
            POST /api/mcp
          </Badge>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--font-data)",
              fontSize: "var(--text-micro)",
              color: "var(--champagne-200)",
            }}
          >
            6 MCP tools · Human-gated send · 100% BYOK
          </span>
        </div>
      </div>

      {/* Main Vertical App Grid */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12"
        style={{ minHeight: 620 }}
      >
        {/* Left Column: 1 ICP / Signal Input & GTM Stack Controls (5 cols on lg) */}
        <div
          className="lg:col-span-5"
          style={{
            padding: "24px",
            borderRight: "1px solid var(--border-deep)",
            background: "rgba(255,255,255,0.015)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-data)",
                fontSize: "var(--text-micro)",
                color: "var(--champagne-300)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
              }}
            >
              Input · 1 ICP or Buying Signal
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: "var(--text-h3)",
                fontWeight: 700,
                color: "var(--paper-0)",
              }}
            >
              Configure your vertical outbound stack
            </h3>
          </div>

          {/* Preset Signal Pills */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "var(--text-micro)",
                fontWeight: 600,
                color: "var(--ink-300)",
                marginBottom: 8,
              }}
            >
              Load signal preset
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {PRESETS.map((p) => {
                const active = icp === p.icp;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPreset(p)}
                    style={{
                      padding: "5px 10px",
                      fontSize: "var(--text-micro)",
                      fontWeight: 600,
                      borderRadius: "var(--radius-sm)",
                      border: `1px solid ${
                        active ? "var(--cobalt-400)" : "var(--border-deep)"
                      }`,
                      background: active
                        ? "rgba(58,86,228,0.25)"
                        : "rgba(255,255,255,0.04)",
                      color: active ? "var(--paper-0)" : "var(--ink-200)",
                      cursor: "pointer",
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ICP / Signal Input */}
          <div>
            <label
              htmlFor="icp-signal-input"
              style={{
                display: "block",
                fontSize: "var(--text-caption)",
                fontWeight: 600,
                color: "var(--ink-200)",
                marginBottom: 6,
              }}
            >
              01. ICP & Trigger Signal
            </label>
            <textarea
              id="icp-signal-input"
              rows={2}
              value={icp}
              onChange={(e) => setIcp(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                background: "var(--ink-900)",
                border: "1px solid var(--border-deep)",
                color: "var(--paper-0)",
                fontSize: "var(--text-body-sm)",
                fontFamily: "var(--font-body)",
                lineHeight: 1.45,
              }}
            />
          </div>

          {/* Decision-Maker Personas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="persona-input"
                style={{
                  display: "block",
                  fontSize: "var(--text-caption)",
                  fontWeight: 600,
                  color: "var(--ink-200)",
                  marginBottom: 6,
                }}
              >
                Decision-Maker Titles
              </label>
              <input
                id="persona-input"
                type="text"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 11px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--ink-900)",
                  border: "1px solid var(--border-deep)",
                  color: "var(--paper-0)",
                  fontSize: "var(--text-caption)",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="origin-select"
                style={{
                  display: "block",
                  fontSize: "var(--text-caption)",
                  fontWeight: 600,
                  color: "var(--ink-200)",
                  marginBottom: 6,
                }}
              >
                Workflow Origin
              </label>
              <select
                id="origin-select"
                value={workflowOrigin}
                onChange={(e) =>
                  setWorkflowOrigin(
                    e.target.value as
                      | "static_icp"
                      | "search_or_prompt"
                      | "another_workflow"
                  )
                }
                style={{
                  width: "100%",
                  padding: "8px 11px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--ink-900)",
                  border: "1px solid var(--border-deep)",
                  color: "var(--paper-0)",
                  fontSize: "var(--text-caption)",
                }}
              >
                <option value="search_or_prompt">Active Web / AI Search</option>
                <option value="static_icp">Static ICP Filter</option>
                <option value="another_workflow">Secondary Automation Webhook</option>
              </select>
            </div>
          </div>

          {/* Stack Selectors: Target List + Contact Sourcing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="source-select"
                style={{
                  display: "block",
                  fontSize: "var(--text-caption)",
                  fontWeight: 600,
                  color: "var(--ink-200)",
                  marginBottom: 6,
                }}
              >
                02. Account Source & Shield
              </label>
              <select
                id="source-select"
                value={listSource}
                onChange={(e) =>
                  setListSource(
                    e.target.value as "spreadsheet" | "crm" | "webhook"
                  )
                }
                style={{
                  width: "100%",
                  padding: "8px 11px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--ink-900)",
                  border: "1px solid var(--border-deep)",
                  color: "var(--paper-0)",
                  fontSize: "var(--text-caption)",
                }}
              >
                <option value="crm">CRM Extraction (HubSpot / Salesforce)</option>
                <option value="webhook">Dynamic Intent Webhook (RB2B)</option>
                <option value="spreadsheet">Spreadsheet Repository (CSV / Sheets)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sourcing-select"
                style={{
                  display: "block",
                  fontSize: "var(--text-caption)",
                  fontWeight: 600,
                  color: "var(--ink-200)",
                  marginBottom: 6,
                }}
              >
                03. Contact Sourcing Mode
              </label>
              <select
                id="sourcing-select"
                value={contactMethod}
                onChange={(e) =>
                  setContactMethod(
                    e.target.value as
                      | "search_syntax_mx"
                      | "enrichment_platform"
                      | "pre_acquired_list"
                  )
                }
                style={{
                  width: "100%",
                  padding: "8px 11px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--ink-900)",
                  border: "1px solid var(--border-deep)",
                  color: "var(--paper-0)",
                  fontSize: "var(--text-caption)",
                }}
              >
                <option value="enrichment_platform">
                  Enrichment Platform (Clay / Apollo / ZoomInfo)
                </option>
                <option value="search_syntax_mx">
                  Public Search + Syntax + MX Verification
                </option>
                <option value="pre_acquired_list">
                  Pre-Acquired List (Bypass Steps 1 & 2)
                </option>
              </select>
            </div>
          </div>

          {/* Enrichment + Outreach Route */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="provider-select"
                style={{
                  display: "block",
                  fontSize: "var(--text-caption)",
                  fontWeight: 600,
                  color: "var(--ink-200)",
                  marginBottom: 6,
                }}
              >
                Data Adapter Provider
              </label>
              <select
                id="provider-select"
                value={enrichmentProvider}
                onChange={(e) =>
                  setEnrichmentProvider(
                    e.target.value as "clay" | "apollo" | "zoominfo"
                  )
                }
                style={{
                  width: "100%",
                  padding: "8px 11px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--ink-900)",
                  border: "1px solid var(--border-deep)",
                  color: "var(--paper-0)",
                  fontSize: "var(--text-caption)",
                }}
              >
                <option value="clay">Clay Waterfall</option>
                <option value="apollo">Apollo.io API</option>
                <option value="zoominfo">ZoomInfo Enrich</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="route-select"
                style={{
                  display: "block",
                  fontSize: "var(--text-caption)",
                  fontWeight: 600,
                  color: "var(--ink-200)",
                  marginBottom: 6,
                }}
              >
                06. Delivery Infrastructure
              </label>
              <select
                id="route-select"
                value={outreachRoute}
                onChange={(e) =>
                  setOutreachRoute(
                    e.target.value as "sequencer" | "mailbox_direct"
                  )
                }
                style={{
                  width: "100%",
                  padding: "8px 11px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--ink-900)",
                  border: "1px solid var(--border-deep)",
                  color: "var(--paper-0)",
                  fontSize: "var(--text-caption)",
                }}
              >
                <option value="sequencer">
                  Sequencer API (Smartlead / Outreach / HubSpot)
                </option>
                <option value="mailbox_direct">
                  Direct Mailbox Connection (SMTP Node)
                </option>
              </select>
            </div>
          </div>

          {/* Value Proposition */}
          <div>
            <label
              htmlFor="value-prop-input"
              style={{
                display: "block",
                fontSize: "var(--text-caption)",
                fontWeight: 600,
                color: "var(--ink-200)",
                marginBottom: 6,
              }}
            >
              04. Offer & Value Proposition Narrative
            </label>
            <textarea
              id="value-prop-input"
              rows={2}
              value={valueProp}
              onChange={(e) => setValueProp(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "var(--radius-md)",
                background: "var(--ink-900)",
                border: "1px solid var(--border-deep)",
                color: "var(--paper-0)",
                fontSize: "var(--text-caption)",
                lineHeight: 1.45,
              }}
            />
          </div>

          {/* Execute Button */}
          <div style={{ marginTop: "auto", paddingTop: 6 }}>
            <Button
              variant="accent"
              size="lg"
              fullWidth
              icon="Zap"
              disabled={running}
              onClick={runFullVerticalPipeline}
            >
              {running
                ? "Executing 6-Step Outbound Flow..."
                : "Compile & Run 6-Step Outbound Flow"}
            </Button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid var(--border-deep)",
                fontSize: "var(--text-micro)",
                color: "var(--ink-300)",
              }}
            >
              <span>MCP Streamable HTTP Ready</span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    "mcp-curl",
                    `curl -X POST https://prospect.salesgency.com/api/mcp -H "Authorization: Bearer ${DEMO_API_KEY}" -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`
                  )
                }
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--champagne-200)",
                  fontFamily: "var(--font-data)",
                  fontSize: "var(--text-micro)",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {copiedKey === "mcp-curl" ? "Copied cURL" : "Copy MCP cURL"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Vertical 6-Step Outbound Stream (7 cols on lg) */}
        <div
          className="lg:col-span-7"
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            maxHeight: 760,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "var(--text-micro)",
                  color: "var(--champagne-200)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Live Vertical Pipeline Execution
              </span>
              <h4
                style={{
                  margin: "2px 0 0",
                  fontSize: "var(--text-body)",
                  fontWeight: 600,
                  color: "var(--paper-0)",
                }}
              >
                Phase 1 (Targeting) → Phase 2 (Intelligence) → Phase 3 (Execution)
              </h4>
            </div>
            <Badge tone="verified" icon="ShieldCheck">
              CRM Dedupe Active
            </Badge>
          </div>

          {/* STEP 01 & 02: PHASE 1 */}
          <div
            style={{
              padding: "16px 18px",
              borderRadius: "var(--radius-lg)",
              background: "var(--surface-deep-raised)",
              border: "1px solid var(--border-deep)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: "var(--text-micro)",
                    fontWeight: 700,
                    color: "var(--cobalt-300)",
                    background: "rgba(58,86,228,0.2)",
                    padding: "2px 7px",
                    borderRadius: "var(--radius-xs)",
                  }}
                >
                  STEP 01 + 02
                </span>
                <span style={{ fontWeight: 600, fontSize: "var(--text-body-sm)" }}>
                  Phase 1: Signals, ICP & Target Account Isolation
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "var(--text-micro)",
                  color:
                    steps[1]?.status === "bypassed"
                      ? "var(--champagne-300)"
                      : "#5BD1AE",
                }}
              >
                {steps[1]?.status === "bypassed"
                  ? "BYPASSED (PRE-ACQUIRED LIST)"
                  : "identify_signals + build_company_list"}
              </span>
            </div>

            {steps[1]?.status === "bypassed" ? (
              <div
                style={{
                  fontSize: "var(--text-caption)",
                  color: "var(--ink-300)",
                }}
              >
                Pre-acquired lead database selected. Bypassed Steps 01 and 02 and proceeded directly to contact verification and deep research.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(0,0,0,0.22)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: "var(--text-micro)",
                      color: "var(--ink-300)",
                      marginBottom: 4,
                    }}
                  >
                    01 Signals & Origin ({String(steps[1]?.data?.workflowOrigin || workflowOrigin)})
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-caption)",
                      color: "var(--ink-100)",
                      lineHeight: 1.45,
                    }}
                  >
                    {icp}
                  </div>
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(0,0,0,0.22)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: "var(--text-micro)",
                      color: "#5BD1AE",
                      marginBottom: 4,
                    }}
                  >
                    02 Target Accounts · Node 03 CRM Dedupe Shield
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-caption)",
                      color: "var(--ink-100)",
                    }}
                  >
                    NexusFlow Data (`nexusflow.io`), HyperScale AI (`hyperscale.ai`)
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-micro)",
                      color: "var(--ink-300)",
                      marginTop: 2,
                    }}
                  >
                    Excluded active customers and open deals in CRM
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 03: CONTACT SOURCING */}
          <div
            style={{
              padding: "16px 18px",
              borderRadius: "var(--radius-lg)",
              background: "var(--surface-deep-raised)",
              border: "1px solid var(--border-deep)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: "var(--text-micro)",
                    fontWeight: 700,
                    color: "var(--cobalt-300)",
                    background: "rgba(58,86,228,0.2)",
                    padding: "2px 7px",
                    borderRadius: "var(--radius-xs)",
                  }}
                >
                  STEP 03
                </span>
                <span style={{ fontWeight: 600, fontSize: "var(--text-body-sm)" }}>
                  Phase 2A: Contact Information & MX Verification
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "var(--text-micro)",
                  color: "#5BD1AE",
                }}
              >
                find_contacts · MX Verified
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                background: "rgba(0,0,0,0.22)",
                border: "1px solid rgba(255,255,255,0.06)",
                fontSize: "var(--text-caption)",
              }}
            >
              <div>
                <strong style={{ color: "var(--paper-0)" }}>
                  Marcus Vance
                </strong>{" "}
                · {persona.split(",")[0] || "VP RevOps"} at NexusFlow Data
                <div
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: "var(--text-micro)",
                    color: "var(--ink-300)",
                    marginTop: 2,
                  }}
                >
                  marcus.vance@nexusflow.io · syntax:{" "}
                  <code>{"{first}.{last}@nexusflow.io"}</code>
                </div>
              </div>
              <Badge tone="verified" icon="CircleCheck">
                MX Record Valid
              </Badge>
            </div>
          </div>

          {/* STEP 04: DEEP RESEARCH (4-PART BRIEF) */}
          <div
            style={{
              padding: "16px 18px",
              borderRadius: "var(--radius-lg)",
              background: "var(--surface-deep-raised)",
              border: "1px solid var(--border-deep)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: "var(--text-micro)",
                    fontWeight: 700,
                    color: "var(--champagne-200)",
                    background: "rgba(199,158,62,0.2)",
                    padding: "2px 7px",
                    borderRadius: "var(--radius-xs)",
                  }}
                >
                  STEP 04
                </span>
                <span style={{ fontWeight: 600, fontSize: "var(--text-body-sm)" }}>
                  Phase 2B: Deep Research (Induced & Deduced Signals)
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "var(--text-micro)",
                  color: "var(--champagne-200)",
                }}
              >
                research_prospect
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(0,0,0,0.22)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: "var(--text-micro)",
                    color: "var(--champagne-300)",
                    marginBottom: 3,
                  }}
                >
                  Induced Signal (Explicit Event)
                </div>
                <div
                  style={{
                    fontSize: "var(--text-caption)",
                    color: "var(--ink-100)",
                    lineHeight: 1.45,
                  }}
                >
                  {String(
                    steps[4]?.data?.signalInduced ||
                      "Posted GTM Automation Engineer role and expanded HubSpot CRM seats."
                  )}
                </div>
              </div>

              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(0,0,0,0.22)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: "var(--text-micro)",
                    color: "var(--cobalt-300)",
                    marginBottom: 3,
                  }}
                >
                  Deduced Signal (Implicit Bottleneck)
                </div>
                <div
                  style={{
                    fontSize: "var(--text-caption)",
                    color: "var(--ink-100)",
                    lineHeight: 1.45,
                  }}
                >
                  {String(
                    steps[4]?.data?.signalDeduced ||
                      "Reps lose 20+ hrs/wk stitching enrichment, CRM checks, and copywriting."
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 05: PERSONALIZED EMAIL COPY (FRAMEWORK A vs B) */}
          <div
            style={{
              padding: "16px 18px",
              borderRadius: "var(--radius-lg)",
              background: "var(--surface-deep-raised)",
              border: "1px solid var(--border-deep)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: "var(--text-micro)",
                    fontWeight: 700,
                    color: "var(--cobalt-300)",
                    background: "rgba(58,86,228,0.2)",
                    padding: "2px 7px",
                    borderRadius: "var(--radius-xs)",
                  }}
                >
                  STEP 05
                </span>
                <span style={{ fontWeight: 600, fontSize: "var(--text-body-sm)" }}>
                  Phase 3A: Personalized Email Copy (`write_email`)
                </span>
              </div>

              {/* Delivery Framework Switcher */}
              <div
                style={{
                  display: "inline-flex",
                  background: "var(--ink-900)",
                  padding: 3,
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-deep)",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleToggleEmailFormat("full_email")}
                  style={{
                    padding: "4px 10px",
                    fontSize: "var(--text-micro)",
                    fontWeight: 600,
                    borderRadius: "var(--radius-xs)",
                    border: "none",
                    cursor: "pointer",
                    background:
                      emailFormat === "full_email"
                        ? "var(--cobalt-600)"
                        : "transparent",
                    color:
                      emailFormat === "full_email"
                        ? "var(--paper-0)"
                        : "var(--ink-300)",
                  }}
                >
                  Framework A: Full-Body
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleEmailFormat("body_only")}
                  style={{
                    padding: "4px 10px",
                    fontSize: "var(--text-micro)",
                    fontWeight: 600,
                    borderRadius: "var(--radius-xs)",
                    border: "none",
                    cursor: "pointer",
                    background:
                      emailFormat === "body_only"
                        ? "var(--cobalt-600)"
                        : "transparent",
                    color:
                      emailFormat === "body_only"
                        ? "var(--paper-0)"
                        : "var(--ink-300)",
                  }}
                >
                  Framework B: Modular Body Token
                </button>
              </div>
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                background: "var(--ink-900)",
                border: "1px solid var(--border-deep)",
                fontFamily: "var(--font-data)",
                fontSize: "var(--text-caption)",
                color: "var(--ink-100)",
                whiteSpace: "pre-wrap",
                lineHeight: 1.55,
              }}
            >
              {emailFormat === "body_only" ? (
                <>
                  <div
                    style={{
                      fontSize: "var(--text-micro)",
                      color: "var(--champagne-200)",
                      marginBottom: 6,
                    }}
                  >
                    CRM Sequence Token: Hi [Name], {"{{email_body_token}}"}, Best, [Sig]
                  </div>
                  {String(steps[5]?.data?.body || "")}
                </>
              ) : (
                String(steps[5]?.data?.body || "")
              )}
            </div>
          </div>

          {/* STEP 06: CONNECT & ENROLL (HUMAN APPROVAL GATE) */}
          <div
            style={{
              padding: "16px 18px",
              borderRadius: "var(--radius-lg)",
              background:
                steps[6]?.status === "sent"
                  ? "rgba(14, 124, 102, 0.16)"
                  : "rgba(199, 158, 62, 0.12)",
              border: `1px solid ${
                steps[6]?.status === "sent"
                  ? "rgba(91, 209, 174, 0.4)"
                  : "rgba(217, 185, 104, 0.4)"
              }`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: "var(--text-micro)",
                      fontWeight: 700,
                      color:
                        steps[6]?.status === "sent"
                          ? "#5BD1AE"
                          : "var(--champagne-200)",
                    }}
                  >
                    STEP 06 · HUMAN APPROVAL GATE
                  </span>
                  <Badge
                    tone={steps[6]?.status === "sent" ? "verified" : "premium"}
                    mono
                  >
                    {steps[6]?.status === "sent"
                      ? "status: sent"
                      : `approvalId: ${String(
                          steps[6]?.data?.approvalId || "apr_demo_9f21c"
                        )}`}
                  </Badge>
                </div>
                <div
                  style={{
                    fontSize: "var(--text-caption)",
                    color: "var(--ink-100)",
                  }}
                >
                  {steps[6]?.status === "sent"
                    ? `Approved and enrolled into ${
                        outreachRoute === "sequencer"
                          ? `Sequencer (${sequencerId})`
                          : "Direct SMTP Mailbox"
                      }. Exact approved payload locked and executed once.`
                    : "enroll_outreach never sends on the first call. The AI client cannot approve itself; operator sign-off is required."}
                </div>
              </div>

              {steps[6]?.status !== "sent" ? (
                <Button
                  variant="inverse"
                  size="sm"
                  icon="Check"
                  disabled={approving}
                  onClick={handleApproveAndSend}
                >
                  {approving ? "Approving..." : "Approve & Enroll (1-Click)"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  icon="RefreshCw"
                  onClick={runFullVerticalPipeline}
                >
                  Reset Gate
                </Button>
              )}
            </div>
          </div>

          {/* STEP 07-09: N8N ENGINEER, EXECUTION ANALYST & COMPOSIO STACK BRIDGE */}
          <div
            style={{
              padding: "16px 18px",
              borderRadius: "var(--radius-lg)",
              background: "var(--ink-900)",
              border: "1px solid var(--border-deep)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: n8nPanelResult ? 12 : 0,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: "var(--text-micro)",
                    fontWeight: 700,
                    color: "var(--champagne-300)",
                    marginBottom: 4,
                  }}
                >
                  N8N INSTANCE CONTROL PLANE &amp; COMPOSIO STACK BRIDGE
                </div>
                <div
                  style={{
                    fontSize: "var(--text-caption)",
                    color: "var(--ink-200)",
                  }}
                >
                  Use your n8n instance via <code>X-N8N-API-KEY</code> (
                  <code>n8n-engineer</code> + <code>n8n-execution-analyst</code>
                  ) or connect tools via Composio OAuth &amp; MCP.
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => void handleRunExtensionTool("n8n_engineer")}
                  style={{
                    padding: "6px 11px",
                    borderRadius: 6,
                    border: "1px solid var(--border-deep)",
                    background:
                      activeExtensionTab === "n8n_engineer" && n8nPanelResult
                        ? "var(--cobalt-600)"
                        : "rgba(255,255,255,0.06)",
                    color: "var(--paper-0)",
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {n8nActionLoading === "n8n_engineer"
                    ? "Compiling..."
                    : "1. n8n Engineer (MCP Trigger JSON)"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleRunExtensionTool("n8n_analyst")}
                  style={{
                    padding: "6px 11px",
                    borderRadius: 6,
                    border: "1px solid var(--border-deep)",
                    background:
                      activeExtensionTab === "n8n_analyst" && n8nPanelResult
                        ? "var(--cobalt-600)"
                        : "rgba(255,255,255,0.06)",
                    color: "var(--paper-0)",
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {n8nActionLoading === "n8n_analyst"
                    ? "Inspecting..."
                    : "2. n8n Execution Analyst (Telemetry)"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleRunExtensionTool("composio")}
                  style={{
                    padding: "6px 11px",
                    borderRadius: 6,
                    border: "1px solid var(--border-deep)",
                    background:
                      activeExtensionTab === "composio" && n8nPanelResult
                        ? "var(--cobalt-600)"
                        : "rgba(255,255,255,0.06)",
                    color: "var(--paper-0)",
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {n8nActionLoading === "composio"
                    ? "Checking..."
                    : "3. Composio & MCP Stack Auth"}
                </button>
              </div>
            </div>

            {n8nPanelResult && (
              <pre
                style={{
                  margin: 0,
                  padding: 12,
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid var(--border-deep)",
                  fontFamily: "var(--font-data)",
                  fontSize: 11,
                  lineHeight: 1.5,
                  color: "var(--ink-100)",
                  maxHeight: 220,
                  overflowY: "auto",
                }}
              >
                <code>{JSON.stringify(n8nPanelResult, null, 2)}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

