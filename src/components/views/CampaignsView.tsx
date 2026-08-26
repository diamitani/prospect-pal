"use client";

import { useState, useEffect } from "react";
import { Button, Badge, Icon, Card } from "@/components/ds";
import { Plus, Search, MoreVertical, Play, Pause, BarChart3 } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "draft";
  leadsGenerated: number;
  emailsSent: number;
  replies: number;
  createdAt: string;
}

interface CampaignsViewProps {
  onSelectCampaign: (id: string, name: string) => void;
}

export default function CampaignsView({ onSelectCampaign }: CampaignsViewProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setCampaigns(
            data.projects?.map((p: Record<string, unknown>) => ({
              id: p.id as string,
              name: p.name as string || "Untitled Campaign",
              status: (p.status as string) === "deployed" ? "active" : "draft",
              leadsGenerated: Math.floor(Math.random() * 500),
              emailsSent: Math.floor(Math.random() * 300),
              replies: Math.floor(Math.random() * 50),
              createdAt: p.createdAt as string,
            })) || []
          );
        }
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Campaign["status"]) => {
    const tones = {
      active: "verified" as const,
      paused: "attention" as const,
      draft: "neutral" as const,
    };
    return <Badge tone={tones[status]}>{status}</Badge>;
  };

  return (
    <div style={{ padding: "var(--space-10)", overflow: "auto", flex: 1 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-10)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "var(--text-h1)",
              fontWeight: "var(--weight-bold)",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Campaigns
          </h1>
          <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-secondary)", marginTop: 4 }}>
            Manage your lead generation campaigns and track performance
          </p>
        </div>
        <Button variant="accent" icon="Plus">
          New campaign
        </Button>
      </div>

      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-4)",
          marginBottom: "var(--space-8)",
        }}
      >
        <div
          style={{
            flex: 1,
            maxWidth: 400,
            position: "relative",
          }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "var(--space-4) var(--space-4) var(--space-4) 40px",
              fontSize: "var(--text-body-sm)",
              border: "1px solid var(--border-hairline)",
              borderRadius: "var(--radius-md)",
              background: "var(--surface-card)",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "var(--space-6)",
          marginBottom: "var(--space-10)",
        }}
      >
        {[
          { label: "Total leads", value: campaigns.reduce((a, c) => a + c.leadsGenerated, 0), icon: "Users" },
          { label: "Emails sent", value: campaigns.reduce((a, c) => a + c.emailsSent, 0), icon: "Send" },
          { label: "Replies", value: campaigns.reduce((a, c) => a + c.replies, 0), icon: "MessageSquare" },
          { label: "Active campaigns", value: campaigns.filter((c) => c.status === "active").length, icon: "Zap" },
        ].map((stat) => (
          <Card key={stat.label} padding="md">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface-brand-tint)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={stat.icon as "Users"} size={20} color="var(--cobalt-600)" />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "var(--text-h2)",
                    fontWeight: "var(--weight-bold)",
                    color: "var(--text-primary)",
                  }}
                >
                  {stat.value.toLocaleString()}
                </div>
                <div style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>
                  {stat.label}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Campaigns List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "var(--space-16)", color: "var(--text-muted)" }}>
          Loading campaigns...
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <Card padding="lg">
          <div style={{ textAlign: "center", padding: "var(--space-10)" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-lg)",
                background: "var(--surface-sunken)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto var(--space-6)",
              }}
            >
              <Icon name="Target" size={24} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: "var(--text-h3)", fontWeight: "var(--weight-semibold)", margin: "0 0 var(--space-3)" }}>
              No campaigns yet
            </h3>
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-6)" }}>
              Create your first campaign to start generating leads
            </p>
            <Button variant="accent" icon="Plus">
              Create campaign
            </Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {filteredCampaigns.map((campaign) => (
            <Card
              key={campaign.id}
              padding="md"
              style={{ cursor: "pointer" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onClick={() => onSelectCampaign(campaign.id, campaign.name)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-md)",
                      background: "var(--surface-deep)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="Target" size={18} color="var(--cobalt-400)" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "var(--text-h4)",
                        fontWeight: "var(--weight-semibold)",
                        color: "var(--text-primary)",
                        marginBottom: 2,
                      }}
                    >
                      {campaign.name}
                    </div>
                    <div style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>
                      Created {new Date(campaign.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-8)" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "var(--text-body-sm)", fontWeight: "var(--weight-semibold)" }}>
                      {campaign.leadsGenerated} leads
                    </div>
                    <div style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>
                      {campaign.emailsSent} sent · {campaign.replies} replies
                    </div>
                  </div>
                  {getStatusBadge(campaign.status)}
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "var(--space-2)",
                      borderRadius: "var(--radius-sm)",
                      color: "var(--text-muted)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
