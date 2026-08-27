"use client";

import { useState } from "react";
import { Button, Card, Badge, Icon, StatTile } from "@/components/ds";
import { TrendingUp, TrendingDown, Mail, Users, MessageSquare, Calendar } from "lucide-react";

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

function calculateRate(numerator: number, denominator: number): string {
  if (denominator === 0) return "0%";
  return ((numerator / denominator) * 100).toFixed(1) + "%";
}

export default function AnalystView() {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const totalProspects = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.prospectsReached, 0);
  const totalEmails = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.emailsSent, 0);
  const totalReplies = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.replies, 0);
  const totalMeetings = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.meetings, 0);

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "26px 32px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-h1)",
                fontWeight: "var(--weight-bold)",
                letterSpacing: "var(--tracking-display)",
              }}
            >
              Campaign analyst
            </h1>
            <Badge tone="premium" icon="Sparkles">Core tier</Badge>
          </div>
          <p style={{ margin: 0, fontSize: "var(--text-body-sm)", color: "var(--text-secondary)" }}>
            Track performance across all campaigns. Monitor opens, replies, and meeting conversions.
          </p>
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
          <StatTile value={totalProspects.toLocaleString()} label="Prospects reached" />
          <StatTile value={totalEmails.toLocaleString()} label="Emails sent" tone="brand" />
          <StatTile value={totalReplies.toLocaleString()} label="Total replies" tone="verified" />
          <StatTile value={totalMeetings.toLocaleString()} label="Meetings booked" tone="premium" />
        </div>

        {/* Performance Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
          <Card padding="md">
            <div style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", marginBottom: 4 }}>Open rate</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-bold)", color: "var(--text-primary)" }}>
                {calculateRate(MOCK_CAMPAIGNS.reduce((s, c) => s + c.opens, 0), totalEmails)}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: "var(--text-caption)", color: "var(--signal-verified)" }}>
                <TrendingUp size={12} /> +2.3%
              </span>
            </div>
          </Card>
          <Card padding="md">
            <div style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", marginBottom: 4 }}>Reply rate</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-bold)", color: "var(--text-primary)" }}>
                {calculateRate(totalReplies, totalEmails)}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: "var(--text-caption)", color: "var(--signal-verified)" }}>
                <TrendingUp size={12} /> +0.8%
              </span>
            </div>
          </Card>
          <Card padding="md">
            <div style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", marginBottom: 4 }}>Meeting conversion</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: "var(--text-h2)", fontWeight: "var(--weight-bold)", color: "var(--text-primary)" }}>
                {calculateRate(totalMeetings, totalReplies)}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: "var(--text-caption)", color: "var(--signal-attention)" }}>
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
                border: selectedCampaign === campaign.name ? "1.5px solid var(--cobalt-500)" : "1px solid var(--border-hairline)",
                background: selectedCampaign === campaign.name ? "var(--cobalt-50)" : "var(--surface-card)",
                boxShadow: "var(--shadow-card)",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: "var(--text-h4)", fontWeight: "var(--weight-semibold)", color: "var(--text-primary)" }}>
                      {campaign.name}
                    </span>
                    <Badge tone={campaign.status === "active" ? "verified" : campaign.status === "paused" ? "attention" : "neutral"}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div style={{ fontSize: "var(--text-caption)", color: "var(--text-secondary)" }}>
                    Started {new Date(campaign.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: "var(--text-h4)", fontWeight: "var(--weight-bold)", color: "var(--text-primary)" }}>
                      {campaign.prospectsReached}
                    </div>
                    <div style={{ fontSize: "var(--text-micro)", color: "var(--text-muted)" }}>Prospects</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "var(--text-h4)", fontWeight: "var(--weight-bold)", color: "var(--text-primary)" }}>
                      {campaign.emailsSent}
                    </div>
                    <div style={{ fontSize: "var(--text-micro)", color: "var(--text-muted)" }}>Emails</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "var(--text-h4)", fontWeight: "var(--weight-bold)", color: "var(--signal-verified)" }}>
                      {campaign.replies}
                    </div>
                    <div style={{ fontSize: "var(--text-micro)", color: "var(--text-muted)" }}>Replies</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "var(--text-h4)", fontWeight: "var(--weight-bold)", color: "var(--champagne-500)" }}>
                      {campaign.meetings}
                    </div>
                    <div style={{ fontSize: "var(--text-micro)", color: "var(--text-muted)" }}>Meetings</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upgrade CTA for non-Core users */}
        <div style={{ marginTop: 28, padding: "var(--space-10)", borderRadius: "var(--radius-xl)", background: "var(--surface-sunken)", border: "1px solid var(--border-hairline)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ fontSize: "var(--text-h3)", fontWeight: "var(--weight-semibold)", color: "var(--text-primary)", marginBottom: 4 }}>
                Unlock advanced analytics
              </div>
              <p style={{ margin: 0, fontSize: "var(--text-body-sm)", color: "var(--text-secondary)", maxWidth: 500 }}>
                Upgrade to Core SDR Agent for real-time performance tracking, A/B test analysis, and AI-powered optimization recommendations.
              </p>
            </div>
            <Button variant="accent" icon="Sparkles">
              Upgrade to Core
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
