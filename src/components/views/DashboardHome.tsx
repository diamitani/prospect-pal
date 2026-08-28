"use client";

import { View } from "@/types/app";
import { Button, Card, Badge, Icon, StatTile } from "@/components/ds";
import { Target, Workflow, PenTool, Settings, ArrowRight, Sparkles, Package, BarChart3, MessageSquare } from "lucide-react";

interface DashboardHomeProps {
  userName: string;
  onNavigate: (view: View) => void;
  onNewProject: () => void;
}

const quickActions = [
  {
    id: "studio",
    icon: MessageSquare,
    title: "Studio",
    description: "Chat-first workflow builder. Pick a template or describe your stack.",
    primary: true,
    view: "studio" as View,
  },
  {
    id: "blueprints",
    icon: Package,
    title: "Templates",
    description: "Pre-built workflows for common stacks. Download and customize.",
    primary: false,
    view: "blueprints" as View,
  },
  {
    id: "settings",
    icon: Settings,
    title: "Settings",
    description: "API keys, integrations, and account preferences.",
    primary: false,
    view: "settings" as View,
  },
];

function getGreeting(name: string) {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  return `Good ${part}, ${name}`;
}

export default function DashboardHome({ userName, onNavigate }: DashboardHomeProps) {
  return (
    <div
      style={{
        overflowY: "auto",
        height: "100%",
        padding: "var(--space-12) var(--space-14) var(--space-16)",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      {/* Greeting */}
      <div style={{ marginBottom: "var(--space-10)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-2)" }}>
          <h1
            style={{
              fontSize: "var(--text-h1)",
              fontWeight: "var(--weight-bold)",
              color: "var(--text-primary)",
              letterSpacing: "var(--tracking-heading)",
              margin: 0,
            }}
          >
            {getGreeting(userName)}
          </h1>
          <Badge tone="brand">Workspace ready</Badge>
        </div>
        <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-secondary)", margin: 0 }}>
          Your GTM automation engine is ready. Create campaigns, manage workflows, and track performance.
        </p>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--space-6)",
          marginBottom: "var(--space-10)",
        }}
      >
        <StatTile value="0" label="Active campaigns" tone="brand" />
        <StatTile value="0" label="Leads generated" tone="verified" />
        <StatTile value="0" label="Emails sent" />
        <StatTile value="0" label="Replies received" tone="premium" />
      </div>

      {/* Quick Actions Grid */}
      <div style={{ marginBottom: "var(--space-10)" }}>
        <div
          style={{
            fontSize: "var(--text-eyebrow)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--text-muted)",
            letterSpacing: "var(--tracking-eyebrow)",
            textTransform: "uppercase",
            marginBottom: "var(--space-6)",
          }}
        >
          Quick actions
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          {quickActions.map((a) => {
            const IconComponent = a.icon;
            return (
              <button
                key={a.id}
                onClick={() => onNavigate(a.view)}
                style={{
                  textAlign: "left",
                  padding: "var(--space-9)",
                  borderRadius: "var(--radius-xl)",
                  cursor: "pointer",
                  background: a.primary ? "var(--action-accent)" : "var(--surface-card)",
                  boxShadow: a.primary ? "var(--shadow-action-accent)" : "var(--shadow-card)",
                  border: a.primary ? "none" : "1px solid var(--border-hairline)",
                  fontFamily: "inherit",
                  transition: "var(--transition-surface)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--space-6)",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-lg)",
                    background: a.primary ? "rgba(255,255,255,0.2)" : "var(--surface-sunken)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconComponent
                    size={22}
                    strokeWidth={1.75}
                    color={a.primary ? "white" : "var(--cobalt-600)"}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "var(--text-h4)",
                      fontWeight: "var(--weight-semibold)",
                      color: a.primary ? "white" : "var(--text-primary)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {a.title}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-body-sm)",
                      color: a.primary ? "rgba(255,255,255,0.85)" : "var(--text-secondary)",
                      lineHeight: "var(--leading-relaxed)",
                    }}
                  >
                    {a.description}
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  strokeWidth={1.75}
                  color={a.primary ? "rgba(255,255,255,0.6)" : "var(--text-muted)"}
                  style={{ marginTop: "var(--space-2)" }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Getting Started Guide */}
      <Card padding="lg">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-8)" }}>
          <div>
            <div
              style={{
                fontSize: "var(--text-eyebrow)",
                fontWeight: "var(--weight-semibold)",
                color: "var(--text-brand)",
                letterSpacing: "var(--tracking-eyebrow)",
                textTransform: "uppercase",
                marginBottom: "var(--space-3)",
              }}
            >
              Getting started
            </div>
            <h3
              style={{
                fontSize: "var(--text-h3)",
                fontWeight: "var(--weight-semibold)",
                color: "var(--text-primary)",
                margin: "0 0 var(--space-3)",
              }}
            >
              Set up your GTM automation engine
            </h3>
            <p
              style={{
                fontSize: "var(--text-body-sm)",
                color: "var(--text-secondary)",
                margin: "0 0 var(--space-6)",
                maxWidth: 500,
              }}
            >
              Upload your company data, connect your GTM tools via Composio, and we&apos;ll generate a custom
              prospect automation engine based on your campaign details.
            </p>
            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
              <Button variant="accent" icon="Sparkles" onClick={() => onNavigate("studio")}>
                Open Studio
              </Button>
              <Button variant="outline" icon="Package" onClick={() => onNavigate("blueprints")}>
                Browse Templates
              </Button>
            </div>
          </div>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "var(--radius-xl)",
              background: "var(--surface-brand-tint)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="Workflow" size={48} color="var(--cobalt-500)" />
          </div>
        </div>
      </Card>
    </div>
  );
}
