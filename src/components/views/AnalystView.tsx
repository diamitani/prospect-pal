"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Card, Badge, Icon, StatTile } from "@/components/ds";
import { DEMO_API_KEY } from "@/lib/mcp/auth";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ExecutionRecord {
  execution_id: string;
  workflow_id: string;
  workflow_name: string;
  status: string;
  mode: string;
  started_at: string;
  duration_ms: number;
  stop_node: string;
  error_message: string | null;
  error_category: string | null;
  verdict: string;
  remediation?: string;
}

interface AnalystSnapshot {
  answer: string;
  instanceUrl?: string;
  summary?: {
    totalExecutions: number;
    successes: number;
    errors: number;
    successRatePct: number;
  };
  stalledWorkflows?: Array<{
    id: string;
    name: string;
    active: boolean;
    lastRunHoursAgo: number;
  }>;
  executions?: ExecutionRecord[];
  diagnosis?: ExecutionRecord;
}

interface CampaignMetrics {
  name: string;
  status: "active" | "paused" | "completed";
  prospectsReached: number;
  emailsSent: number;
  opens: number;
  replies: number;
  meetings: number;
  startDate: string;
}

const MOCK_CAMPAIGNS: CampaignMetrics[] = [
  {
    name: "VP Engineering Outreach",
    status: "active",
    prospectsReached: 247,
    emailsSent: 1482,
    opens: 891,
    replies: 37,
    meetings: 8,
    startDate: "2026-08-01",
  },
  {
    name: "Series A SaaS Founders",
    status: "active",
    prospectsReached: 156,
    emailsSent: 936,
    opens: 562,
    replies: 22,
    meetings: 5,
    startDate: "2026-08-10",
  },
  {
    name: "DevOps Leaders Q3",
    status: "completed",
    prospectsReached: 412,
    emailsSent: 2472,
    opens: 1483,
    replies: 61,
    meetings: 14,
    startDate: "2026-07-01",
  },
];

const PRESET_QUERIES = [
  "snapshot",
  "why did execution 1003 fail",
  "why did execution 2002 fail",
  "which active workflows are stalled",
];

function calculateRate(numerator: number, denominator: number): string {
  if (denominator === 0) return "0%";
  return ((numerator / denominator) * 100).toFixed(1) + "%";
}

export default function AnalystView() {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [n8nUrl, setN8nUrl] = useState("https://atlas-hxm.app.n8n.cloud");
  const [question, setQuestion] = useState("snapshot");
  const [loadingTelemetry, setLoadingTelemetry] = useState(false);
  const [telemetry, setTelemetry] = useState<AnalystSnapshot | null>(null);

  const runAnalystQuery = useCallback(
    async (q: string) => {
      setLoadingTelemetry(true);
      try {
        const res = await fetch("/api/mcp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${DEMO_API_KEY}`,
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: Date.now(),
            method: "tools/call",
            params: {
              name: "n8n_inspect_executions",
              arguments: {
                question: q,
                n8nInstanceUrl: n8nUrl,
              },
            },
          }),
        });
        const data = await res.json();
        const text = data?.result?.content?.[0]?.text;
        if (text) {
          setTelemetry(JSON.parse(text));
        }
      } catch (err) {
        console.error("Failed to query n8n execution analyst:", err);
      } finally {
        setLoadingTelemetry(false);
      }
    },
    [n8nUrl]
  );

  useEffect(() => {
    void runAnalystQuery("snapshot");
  }, [runAnalystQuery]);

  const totalProspects = MOCK_CAMPAIGNS.reduce(
    (sum, c) => sum + c.prospectsReached,
    0
  );
  const totalEmails = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.emailsSent, 0);
  const totalReplies = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.replies, 0);
  const totalMeetings = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.meetings, 0);

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "26px 32px 48px",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-h1)",
                fontWeight: "var(--weight-bold)",
                letterSpacing: "var(--tracking-display)",
              }}
            >
              n8n Execution Analyst &amp; Campaign Telemetry
            </h1>
            <Badge tone="brand">n8n-execution-analyst.skill</Badge>
            <Badge tone="verified">Read-Only X-N8N-API-KEY</Badge>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "var(--text-body-sm)",
              color: "var(--text-secondary)",
            }}
          >
            Monitors every workflow execution in your n8n instance, diagnoses
            exact stop-nodes (429 rate limit, 401 auth, timeout), flags active
            workflows stalled &gt;26h, and answers plain-English queries citing
            real execution IDs.
          </p>
        </div>

        {/* Grounded n8n Execution Analyst Console */}
        <div
          style={{
            marginBottom: 32,
            borderRadius: "var(--radius-xl)",
            background: "var(--surface-card)",
            border: "1px solid var(--border-hairline)",
            boxShadow: "var(--shadow-card)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 22px",
              background: "var(--surface-deep)",
              color: "var(--paper-0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="Terminal" size={16} color="var(--champagne-300)" />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                Live n8n Execution Telemetry Query (`n8n_inspect_executions`)
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: 11,
                  color: "var(--ink-300)",
                }}
              >
                Instance:
              </span>
              <input
                value={n8nUrl}
                onChange={(e) => setN8nUrl(e.target.value)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--border-deep)",
                  background: "rgba(255,255,255,0.06)",
                  color: "var(--champagne-300)",
                  fontFamily: "var(--font-data)",
                  fontSize: 11,
                  width: 240,
                }}
              />
            </div>
          </div>

          <div style={{ padding: 22 }}>
            {/* Query bar */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a grounded question (e.g. 'why did execution 1003 fail')"
                style={{
                  flex: 1,
                  minWidth: 260,
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-default)",
                  background: "var(--surface-page)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--text-primary)",
                }}
              />
              <Button
                variant="accent"
                size="md"
                icon="Search"
                onClick={() => void runAnalystQuery(question)}
              >
                {loadingTelemetry ? "Querying n8n..." : "Ask Analyst"}
              </Button>
            </div>

            {/* Preset query pills */}
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              {PRESET_QUERIES.map((pq) => (
                <button
                  key={pq}
                  onClick={() => {
                    setQuestion(pq);
                    void runAnalystQuery(pq);
                  }}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: "1px solid var(--border-hairline)",
                    background:
                      question === pq
                        ? "var(--cobalt-50)"
                        : "var(--surface-sunken)",
                    color:
                      question === pq
                        ? "var(--cobalt-600)"
                        : "var(--text-secondary)",
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  {pq}
                </button>
              ))}
            </div>

            {/* Grounded Answer Box */}
            {telemetry && (
              <div
                style={{
                  padding: 16,
                  borderRadius: "var(--radius-md)",
                  background: "var(--cobalt-50)",
                  border: "1px solid var(--cobalt-100)",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--cobalt-600)",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  GROUNDED TELEMETRY VERDICT (ZERO FABRICATION)
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-primary)",
                    lineHeight: 1.55,
                  }}
                >
                  {telemetry.answer}
                </div>
              </div>
            )}

            {/* Execution Table if present */}
            {telemetry?.executions && telemetry.executions.length > 0 && (
              <div style={{ display: "grid", gap: 8 }}>
                {telemetry.executions.map((ex) => (
                  <div
                    key={ex.execution_id}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--surface-sunken)",
                      border:
                        ex.status === "error"
                          ? "1px solid rgba(209, 52, 56, 0.35)"
                          : "1px solid var(--border-hairline)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
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
                        <code
                          style={{
                            fontFamily: "var(--font-data)",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--cobalt-600)",
                          }}
                        >
                          exec #{ex.execution_id}
                        </code>
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: "var(--text-primary)",
                          }}
                        >
                          {ex.workflow_name}
                        </span>
                        <Badge
                          tone={ex.status === "error" ? "danger" : "verified"}
                        >
                          {ex.status}
                        </Badge>
                        {ex.error_category && (
                          <code
                            style={{
                              fontFamily: "var(--font-data)",
                              fontSize: 10,
                              padding: "2px 6px",
                              borderRadius: 4,
                              background: "var(--signal-bad-bg)",
                              color: "var(--signal-bad)",
                            }}
                          >
                            {ex.error_category}
                          </code>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {ex.verdict}{" "}
                        {ex.error_message ? `- ${ex.error_message}` : ""}
                      </div>
                      {ex.remediation && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--cobalt-600)",
                            marginTop: 4,
                            fontWeight: 500,
                          }}
                        >
                          Fix (n8n-engineer): {ex.remediation}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-data)",
                        fontSize: 11,
                        color: "var(--text-muted)",
                      }}
                    >
                      {ex.duration_ms}ms
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overview Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <StatTile
            value={totalProspects.toLocaleString()}
            label="Prospects reached"
          />
          <StatTile
            value={totalEmails.toLocaleString()}
            label="Emails sent"
            tone="brand"
          />
          <StatTile
            value={totalReplies.toLocaleString()}
            label="Total replies"
            tone="verified"
          />
          <StatTile
            value={totalMeetings.toLocaleString()}
            label="Meetings booked"
            tone="premium"
          />
        </div>

        {/* Performance Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <Card padding="md">
            <div
              style={{
                fontSize: "var(--text-caption)",
                color: "var(--text-muted)",
                marginBottom: 4,
              }}
            >
              Open rate
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontSize: "var(--text-h2)",
                  fontWeight: "var(--weight-bold)",
                  color: "var(--text-primary)",
                }}
              >
                {calculateRate(
                  MOCK_CAMPAIGNS.reduce((s, c) => s + c.opens, 0),
                  totalEmails
                )}
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  fontSize: "var(--text-caption)",
                  color: "var(--signal-verified)",
                }}
              >
                <TrendingUp size={12} /> +2.3%
              </span>
            </div>
          </Card>
          <Card padding="md">
            <div
              style={{
                fontSize: "var(--text-caption)",
                color: "var(--text-muted)",
                marginBottom: 4,
              }}
            >
              Reply rate
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontSize: "var(--text-h2)",
                  fontWeight: "var(--weight-bold)",
                  color: "var(--text-primary)",
                }}
              >
                {calculateRate(totalReplies, totalEmails)}
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  fontSize: "var(--text-caption)",
                  color: "var(--signal-verified)",
                }}
              >
                <TrendingUp size={12} /> +0.8%
              </span>
            </div>
          </Card>
          <Card padding="md">
            <div
              style={{
                fontSize: "var(--text-caption)",
                color: "var(--text-muted)",
                marginBottom: 4,
              }}
            >
              Meeting conversion
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontSize: "var(--text-h2)",
                  fontWeight: "var(--weight-bold)",
                  color: "var(--text-primary)",
                }}
              >
                {calculateRate(totalMeetings, totalReplies)}
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  fontSize: "var(--text-caption)",
                  color: "var(--signal-attention)",
                }}
              >
                <TrendingDown size={12} /> -1.2%
              </span>
            </div>
          </Card>
        </div>

        {/* Campaign List */}
        <div
          style={{
            fontSize: "var(--text-eyebrow)",
            fontWeight: "var(--weight-semibold)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-eyebrow)",
            color: "var(--text-muted)",
            marginBottom: 12,
          }}
        >
          Active campaigns
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MOCK_CAMPAIGNS.map((campaign) => (
            <div
              key={campaign.name}
              onClick={() => setSelectedCampaign(campaign.name)}
              style={{
                padding: "var(--space-9)",
                borderRadius: "var(--radius-xl)",
                cursor: "pointer",
                border:
                  selectedCampaign === campaign.name
                    ? "1.5px solid var(--cobalt-500)"
                    : "1px solid var(--border-hairline)",
                background:
                  selectedCampaign === campaign.name
                    ? "var(--cobalt-50)"
                    : "var(--surface-card)",
                boxShadow: "var(--shadow-card)",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "var(--text-h4)",
                        fontWeight: "var(--weight-semibold)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {campaign.name}
                    </span>
                    <Badge
                      tone={
                        campaign.status === "active"
                          ? "verified"
                          : campaign.status === "paused"
                          ? "attention"
                          : "neutral"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-caption)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Started{" "}
                    {new Date(campaign.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 24,
                    textAlign: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "var(--text-h4)",
                        fontWeight: "var(--weight-bold)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {campaign.prospectsReached}
                    </div>
                    <div
                      style={{
                        fontSize: "var(--text-micro)",
                        color: "var(--text-muted)",
                      }}
                    >
                      Prospects
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "var(--text-h4)",
                        fontWeight: "var(--weight-bold)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {campaign.emailsSent}
                    </div>
                    <div
                      style={{
                        fontSize: "var(--text-micro)",
                        color: "var(--text-muted)",
                      }}
                    >
                      Emails
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "var(--text-h4)",
                        fontWeight: "var(--weight-bold)",
                        color: "var(--signal-verified)",
                      }}
                    >
                      {campaign.replies}
                    </div>
                    <div
                      style={{
                        fontSize: "var(--text-micro)",
                        color: "var(--text-muted)",
                      }}
                    >
                      Replies
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "var(--text-h4)",
                        fontWeight: "var(--weight-bold)",
                        color: "var(--champagne-500)",
                      }}
                    >
                      {campaign.meetings}
                    </div>
                    <div
                      style={{
                        fontSize: "var(--text-micro)",
                        color: "var(--text-muted)",
                      }}
                    >
                      Meetings
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
