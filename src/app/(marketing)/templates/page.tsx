"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo, Button, Badge, Icon, SectionHeading } from "@/components/ds";
import { WorkflowDiagram } from "@/components/ds/marketing/WorkflowDiagram";

const TEMPLATE_NODES = [
  { id: 1, title: "Schedule Trigger", subtitle: "Daily cron", color: "#FF9500", icon: "Clock" as const },
  { id: 2, title: "Set Date Range", subtitle: "Yesterday filter", color: "#6B7280", icon: "Braces" as const },
  { id: 3, title: "Get HubSpot Companies", subtitle: "Intent signals", color: "#FF7A59", icon: "Database" as const },
  { id: 4, title: "Split Each Company", subtitle: "Loop", color: "#FF9500", icon: "GitBranch" as const },
  { id: 5, title: "Amplemarket API", subtitle: "Contact search", color: "#8B5CF6", icon: "Globe" as const },
  { id: 6, title: "Split Contacts", subtitle: "Loop", color: "#FF9500", icon: "GitBranch" as const },
  { id: 7, title: "Normalize Data", subtitle: "Schema transform", color: "#6B7280", icon: "Braces" as const },
  { id: 8, title: "AI Email Agent", subtitle: "Claude/GPT", color: "#10B981", icon: "Sparkles" as const },
  { id: 9, title: "Create HubSpot Contact", subtitle: "CRM sync", color: "#FF7A59", icon: "Database" as const },
  { id: 10, title: "Smartlead Enroll", subtitle: "Sequence start", color: "#3B82F6", icon: "Send" as const },
];

const NODE_EXPLANATIONS = [
  {
    name: "Schedule Trigger",
    type: "n8n-nodes-base.scheduleTrigger",
    description: "Runs the workflow on a schedule. Default is daily at 2 AM. Can be changed to hourly, weekly, or custom cron expressions.",
    color: "#FF9500",
  },
  {
    name: "HubSpot Companies",
    type: "n8n-nodes-base.httpRequest",
    description: "Queries your HubSpot CRM for companies with recent intent signals (website visits, form fills, email opens). Filters by date range and properties.",
    color: "#FF7A59",
  },
  {
    name: "Data Enrichment API",
    type: "n8n-nodes-base.httpRequest",
    description: "Calls Apollo, Amplemarket, or Clay to find contacts at target companies. Returns verified emails, LinkedIn profiles, and job titles.",
    color: "#8B5CF6",
  },
  {
    name: "AI Email Agent",
    type: "@n8n/n8n-nodes-langchain.agent",
    description: "Uses Claude or GPT to research each company and write personalized emails. Follows your PAS framework and brand voice guidelines.",
    color: "#10B981",
  },
  {
    name: "CRM Contact Create",
    type: "n8n-nodes-base.hubspot",
    description: "Creates or updates contacts in HubSpot with all enriched data, research notes, and generated email copy for your team's reference.",
    color: "#FF7A59",
  },
  {
    name: "Sequence Enrollment",
    type: "n8n-nodes-base.httpRequest",
    description: "Enrolls contacts into your email sequence (Smartlead, Instantly, or HubSpot Sequences). Personalized copy is ready to send.",
    color: "#3B82F6",
  },
];

const SAMPLE_JSON = `{
  "name": "Prospect Automation Engine",
  "nodes": [
    {
      "type": "n8n-nodes-base.scheduleTrigger",
      "name": "Daily Trigger",
      "parameters": {
        "rule": { "interval": [{ "triggerAtHour": 2 }] }
      }
    },
    {
      "type": "n8n-nodes-base.httpRequest",
      "name": "Get HubSpot Companies",
      "parameters": {
        "url": "https://api.hubapi.com/crm/v3/objects/companies/search",
        "method": "POST"
      }
    },
    {
      "type": "@n8n/n8n-nodes-langchain.agent",
      "name": "AI Email Agent",
      "parameters": {
        "model": "claude-3-5-sonnet",
        "systemMessage": "You are a sales email expert..."
      }
    }
  ],
  "connections": { ... }
}`;

export default function TemplatesPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SAMPLE_JSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([SAMPLE_JSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prospect-automation-template.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      {/* Header */}
      <header
        style={{
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-hairline)",
          background: "var(--surface-card)",
        }}
      >
        <Link href="/home" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={28} />
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Prospect PAL</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/home#process" style={{ fontSize: "var(--text-body-sm)", color: "var(--text-secondary)" }}>
            How it works
          </Link>
          <Link href="/home#pricing" style={{ fontSize: "var(--text-body-sm)", color: "var(--text-secondary)" }}>
            Pricing
          </Link>
          <Button variant="primary" size="sm">
            Get started
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: "64px 32px 48px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Badge tone="brand" style={{ marginBottom: 16 }}>Reference Template</Badge>
          <h1
            style={{
              fontSize: "var(--text-h1)",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 16,
            }}
          >
            n8n Workflow Template
          </h1>
          <p
            style={{
              fontSize: "var(--text-body-lg)",
              color: "var(--text-secondary)",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            See exactly what you get: a production-ready n8n workflow that connects your CRM,
            data tools, and AI to automate prospect outreach.
          </p>
        </div>
      </section>

      {/* Visual Workflow */}
      <section style={{ padding: "0 32px 64px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "var(--text-body-lg)",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 20,
          }}
        >
          Visual Workflow
        </h2>
        <WorkflowDiagram nodes={TEMPLATE_NODES} title="prospect-automation-template.json" />
      </section>

      {/* Node Explanations */}
      <section style={{ padding: "64px 32px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <SectionHeading
          eyebrow="Node breakdown"
          title="What each node does"
          description="The workflow is modular. Swap any node for your preferred tool."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
            marginTop: 32,
          }}
        >
          {NODE_EXPLANATIONS.map((node) => (
            <div
              key={node.name}
              style={{
                padding: 24,
                background: "var(--surface-card)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-hairline)",
                borderLeft: `4px solid ${node.color}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: node.color,
                  }}
                />
                <h3 style={{ fontSize: "var(--text-body)", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
                  {node.name}
                </h3>
              </div>
              <p
                style={{
                  fontSize: "var(--text-caption)",
                  fontFamily: "var(--font-data)",
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                {node.type}
              </p>
              <p
                style={{
                  fontSize: "var(--text-body-sm)",
                  color: "var(--text-secondary)",
                  lineHeight: "var(--leading-relaxed)",
                  margin: 0,
                }}
              >
                {node.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* JSON Viewer */}
      <section style={{ padding: "64px 32px", maxWidth: "var(--layout-max)", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: "var(--text-body-lg)", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
              JSON Preview
            </h2>
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-secondary)", margin: "6px 0 0" }}>
              Simplified view of the workflow structure
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="outline" size="sm" icon={copied ? "Check" : "Copy"} onClick={handleCopy}>
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" icon="Download" onClick={handleDownload}>
              Download
            </Button>
          </div>
        </div>
        <div
          style={{
            background: "#0d0d0d",
            borderRadius: "var(--radius-xl)",
            border: "1px solid #2a2a2a",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid #2a2a2a",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#27ca40" }} />
            </div>
            <span style={{ marginLeft: 10, fontFamily: "var(--font-mono)", fontSize: 12, color: "#808080" }}>
              prospect-automation-template.json
            </span>
          </div>
          <pre
            style={{
              padding: 24,
              margin: 0,
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              lineHeight: 1.6,
              color: "#e0e0e0",
              overflowX: "auto",
            }}
          >
            <code>{SAMPLE_JSON}</code>
          </pre>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "64px 32px",
          maxWidth: 700,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "var(--text-h2)",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 16,
          }}
        >
          Ready to customize?
        </h2>
        <p
          style={{
            fontSize: "var(--text-body)",
            color: "var(--text-secondary)",
            marginBottom: 32,
          }}
        >
          Get a workflow tailored to your CRM, data tools, and outreach platform.
          The agent builds it for you based on your inputs.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <Link href="/home#pricing">
            <Button variant="primary" size="lg">
              Build your workflow
            </Button>
          </Link>
          <Link href="/packages">
            <Button variant="outline" size="lg">
              Download blueprints
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "32px",
          borderTop: "1px solid var(--border-hairline)",
          textAlign: "center",
          fontSize: "var(--text-caption)",
          color: "var(--text-muted)",
        }}
      >
        <Link href="/home" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Icon name="ArrowLeft" size={14} />
          Back to home
        </Link>
      </footer>
    </div>
  );
}
