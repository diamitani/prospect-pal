"use client";

import { View } from "@/types/app";
import { Button, Card, Badge, Icon, StatTile } from "@/components/ds";
import { VerticalOutboundWorkbench } from "@/components/outbound/VerticalOutboundWorkbench";
import { Settings, ArrowRight, Package, MessageSquare } from "lucide-react";

interface DashboardHomeProps {
  userName: string;
  onNavigate: (view: View) => void;
  onNewProject: () => void;
}

const quickActions = [
  {
    id: "studio",
    icon: MessageSquare,
    title: "PAL Compiler Studio",
    description:
      "Compile custom 9-node n8n workflows and AI system prompts from your campaign intake.",
    primary: true,
    view: "studio" as View,
  },
  {
    id: "blueprints",
    icon: Package,
    title: "ROSTR Agent Blueprints",
    description:
      "Inspect and download prospect-automation-engine, inbound-responder, and crm-hygiene kits.",
    primary: false,
    view: "blueprints" as View,
  },
  {
    id: "settings",
    icon: Settings,
    title: "MCP & Stack Credentials",
    description:
      "Manage Bearer sg_live_ API keys, approval secrets, and CRM/sequencer bindings.",
    primary: false,
    view: "settings" as View,
  },
];

function getGreeting(name: string) {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  return `Good ${part}, ${name}`;
}

export default function DashboardHome({
  userName,
  onNavigate,
}: DashboardHomeProps) {
  return (
    <div
      style={{
        overflowY: "auto",
        height: "100%",
        padding: "var(--space-10) var(--space-12) var(--space-16)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Greeting */}
      <div style={{ marginBottom: "var(--space-8)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
            marginBottom: "var(--space-2)",
            flexWrap: "wrap",
          }}
        >
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
          <Badge tone="brand">ROSTR Engine Online</Badge>
          <Badge tone="verified">Streamable HTTP MCP Active</Badge>
        </div>
        <p
          style={{
            fontSize: "var(--text-body-sm)",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          1 ICP or buying signal to a full outbound workflow. Run the 6-step
          pipeline below or open the PAL Compiler Studio.
        </p>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--space-5)",
          marginBottom: "var(--space-8)",
        }}
      >
        <StatTile value="3" label="Licensed ROSTR Agents" tone="brand" />
        <StatTile value="6" label="Active MCP Step Tools" tone="verified" />
        <StatTile value="Locked" label="Step 06 Approval Gate" />
        <StatTile value="A + B" label="Delivery Frameworks" tone="premium" />
      </div>

      {/* Embedded Vertical 1-ICP-to-Full-Outbound Workbench */}
      <div style={{ marginBottom: "var(--space-10)" }}>
        <VerticalOutboundWorkbench />
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
            marginBottom: "var(--space-5)",
          }}
        >
          Workspace Modules
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
                  padding: "var(--space-8)",
                  borderRadius: "var(--radius-xl)",
                  cursor: "pointer",
                  background: a.primary
                    ? "var(--action-accent)"
                    : "var(--surface-card)",
                  boxShadow: a.primary
                    ? "var(--shadow-action-accent)"
                    : "var(--shadow-card)",
                  border: a.primary
                    ? "none"
                    : "1px solid var(--border-hairline)",
                  fontFamily: "inherit",
                  transition: "var(--transition-surface)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--space-5)",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-lg)",
                    background: a.primary
                      ? "rgba(255,255,255,0.2)"
                      : "var(--surface-sunken)",
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
                      color: a.primary
                        ? "rgba(255,255,255,0.85)"
                        : "var(--text-secondary)",
                      lineHeight: "var(--leading-relaxed)",
                    }}
                  >
                    {a.description}
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  strokeWidth={1.75}
                  color={
                    a.primary ? "rgba(255,255,255,0.6)" : "var(--text-muted)"
                  }
                  style={{ marginTop: "var(--space-2)" }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Getting Started Guide */}
      <Card padding="lg">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "var(--space-8)",
          }}
        >
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
              External Harness Integration
            </div>
            <h3
              style={{
                fontSize: "var(--text-h3)",
                fontWeight: "var(--weight-semibold)",
                color: "var(--text-primary)",
                margin: "0 0 var(--space-3)",
              }}
            >
              Connect Claude Code, Cursor, or Cloudflare Workers
            </h3>
            <p
              style={{
                fontSize: "var(--text-body-sm)",
                color: "var(--text-secondary)",
                margin: "0 0 var(--space-6)",
                maxWidth: 540,
              }}
            >
              Your workspace exposes a Streamable HTTP MCP endpoint at{" "}
              <code>POST /api/mcp</code> and downloadable ROSTR Agent Kits at{" "}
              <code>GET /api/rostr/agents</code>.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="accent"
                icon="Sparkles"
                onClick={() => onNavigate("studio")}
              >
                Open PAL Studio
              </Button>
              <Button
                variant="outline"
                icon="Package"
                onClick={() => onNavigate("blueprints")}
              >
                Browse Blueprints
              </Button>
            </div>
          </div>
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: "var(--radius-xl)",
              background: "var(--surface-brand-tint)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="Workflow" size={44} color="var(--cobalt-500)" />
          </div>
        </div>
      </Card>
    </div>
  );
}
