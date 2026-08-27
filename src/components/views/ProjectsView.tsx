"use client";

import { useState } from "react";
import { Button, Badge, Card, Icon } from "@/components/ds";
import {
  Download,
  Copy,
  Check,
  Package,
  FileCode,
  FileText,
  Terminal,
} from "lucide-react";

interface BlueprintItem {
  id: string;
  filename: string;
  category: "workflow" | "agent" | "docs" | "templates";
  badge: string;
  title: string;
  description: string;
  size: string;
  content: string;
}

const BLUEPRINT_VAULT: BlueprintItem[] = [
  {
    id: "b-1",
    filename: "workflow.n8n.json",
    category: "workflow",
    badge: "Production JSON",
    title: "Canonical 9-Node Outbound Engine",
    description: "Nine wired nodes with error catchers, dynamic expression bindings, and sub-workflow hooks.",
    size: "91.5 KB",
    content: `{
  "name": "Prospect Automation Engine — Canonical 9-Node",
  "nodes": [
    {
      "parameters": { "rule": { "interval": [{ "field": "days", "daysInterval": 1 }] } },
      "id": "node-01-cron",
      "name": "Intake & Cron Trigger",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": { "jsCode": "// Sanitize email and normalize company domain\\nreturn items.map(item => ({\\n  json: {\\n    ...item.json,\\n    domain: item.json.domain?.toLowerCase().trim(),\\n    email: item.json.email?.toLowerCase().trim()\\n  }\\n}));" },
      "id": "node-02-normalizer",
      "name": "Data Normalizer",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": { "resource": "contact", "operation": "get", "email": "={{ $json.email }}" },
      "id": "node-03-crm-shield",
      "name": "CRM Deduplication Shield",
      "type": "n8n-nodes-base.hubspot",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": { "url": "https://api.apollo.io/v1/people/match", "authentication": "genericCredentialType" },
      "id": "node-04-enrichment",
      "name": "Data Tool Adapter (Apollo/Clay)",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [900, 300]
    },
    {
      "parameters": { "prompt": "Synthesize company pain point and draft 3-sentence PAS email." },
      "id": "node-05-ai-pas",
      "name": "AI Research & PAS Copywriter",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [1120, 300]
    },
    {
      "parameters": { "conditions": { "boolean": [{ "value1": "={{ $json.requires_human_approval }}", "value2": true }] } },
      "id": "node-06-approval",
      "name": "Approval Switch Gate",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3,
      "position": [1340, 300]
    },
    {
      "parameters": { "resource": "contact", "operation": "upsert" },
      "id": "node-07-crm-upsert",
      "name": "CRM Contact Creation",
      "type": "n8n-nodes-base.hubspot",
      "typeVersion": 1,
      "position": [1560, 220]
    },
    {
      "parameters": { "url": "https://server.smartlead.ai/api/v1/campaigns/add-lead" },
      "id": "node-08-sequence",
      "name": "Sequence Enrollment",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [1780, 220]
    },
    {
      "parameters": { "channel": "#sales-approvals", "text": "New lead ready for manual approval: {{$json.name}}" },
      "id": "node-09-slack-alert",
      "name": "Review Alert Channel",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [1560, 420]
    }
  ]
}`,
  },
  {
    id: "b-2",
    filename: "soul.md",
    category: "agent",
    badge: "Agent Soul",
    title: "Prospect PAL Agent Scaffolding",
    description: "Operational identity, PAL doctrine, denied tools, and memory architecture for coding agents.",
    size: "2.8 KB",
    content: `# Agent Soul — Prospect Automation Engine (PAE)

## Identity
You are the Prospect PAL Engine Architect. You compile and execute GTM outbound systems that bridge CRM data, AI research, and multi-channel sequencers with zero hardcoded secrets.

## Mission
Turn high-level ICP definitions and tool selections into deterministic, verifiable automations. Never skip deduplication. Always embed human review gates unless explicitly overridden.

## Doctrine
1. PAL: Parse → Ambiguity Scan → Latent Intent → Expand → Compile.
2. Zero Secrets in Output: Reference credentials strictly via ENV:NAME or native instance OAuth.
3. Node Purity: Never invent non-existent n8n node parameters or invalid endpoints.`,
  },
  {
    id: "b-3",
    filename: "BUILD_PROMPT.md",
    category: "docs",
    badge: "Deploy Checklist",
    title: "Step-by-Step Deployment Runbook",
    description: "Exact order of wiring credentials, ENV variables, and webhook callbacks on your self-hosted or cloud instance.",
    size: "4.5 KB",
    content: `# PAE Deployment Checklist & Credential Guide

### Step 1: Environment Variables Setup
Add the following to your instance .env or container secrets:
- \`HUBSPOT_OAUTH_TOKEN\` or native OAuth App Credentials
- \`APOLLO_API_KEY\` (Scoped: People Match & Search)
- \`ANTHROPIC_API_KEY\` or \`OPENAI_API_KEY\`
- \`SMARTLEAD_API_KEY\`
- \`SLACK_WEBHOOK_URL\`

### Step 2: Import Workflow JSON
1. Open your n8n / Make canvas.
2. Select Import from File -> choose \`workflow.n8n.json\`.
3. Activate the workflow and trigger test lead payload.`,
  },
  {
    id: "b-4",
    filename: "email-framework.md",
    category: "templates",
    badge: "Copywriting",
    title: "3-Sentence PAS Email Formula Suite",
    description: "Battle-tested Problem-Agitate-Solve cold outreach scripts with high reply benchmarks.",
    size: "3.2 KB",
    content: `# 3-Sentence PAS (Problem-Agitate-Solve) Framework

### Template 1: Tech-Signal & Scaling Bottleneck
- **Problem:** "Saw {{company}} is rapidly scaling {{department}} following {{funding_or_trigger}}."
- **Agitate:** "Most growth teams at this stage lose 15+ hours weekly struggling with {{specific_pain_point}}."
- **Solve:** "We built {{product}} to automate {{outcome}} without needing additional headcount — worth a quick 3-minute glance?"

### Template 2: Founder-to-Founder Low-Friction Hook
- **Problem:** "Noticed your recent launch of {{feature}} on {{channel}}."
- **Agitate:** "Running outbound manually while shipping code pulls leadership away from core product roadmap."
- **Solve:** "We automated the entire lead research and verified sequence loop — open to seeing the workflow diagram?"`,
  },
  {
    id: "b-5",
    filename: "manifest.json",
    category: "agent",
    badge: "Agent Config",
    title: "Agent Capabilities Manifest",
    description: "Standardized tool definition and MCP integration schema for Cursor, Claude, and Windsurf.",
    size: "1.9 KB",
    content: `{
  "$schema": "https://agentpal.io/schemas/v1/manifest.json",
  "name": "prospect-pal-agent",
  "version": "1.0.0",
  "capabilities": [
    "crm-read-write",
    "contact-enrichment",
    "llm-inference",
    "sequencer-enrollment",
    "slack-approval-gate"
  ],
  "runtime": "node20",
  "tools": [
    { "name": "n8n_compile", "description": "Compiles 9-node JSON from ICP parameters" },
    { "name": "research_dossier", "description": "Fetches company intelligence and hiring intent" }
  ]
}`,
  },
  {
    id: "b-6",
    filename: ".env.template",
    category: "docs",
    badge: "Security",
    title: "Zero-Storage ENV Variable Map",
    description: "Template for environment variable configuration with zero hard-coded keys.",
    size: "1.1 KB",
    content: `# Prospect PAL — Environment Variables Template
# Copy this file to .env on your instance and populate values

# CRM Connection
HUBSPOT_API_KEY=
SALESFORCE_INSTANCE_URL=

# Data Enrichment
APOLLO_API_KEY=
CLAY_API_KEY=

# LLM Providers
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Outreach Sequencers
SMARTLEAD_API_KEY=
INSTANTLY_API_KEY=

# Review Alerts
SLACK_WEBHOOK_URL=`,
  },
];

export default function BlueprintsView() {
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintItem>(BLUEPRINT_VAULT[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredVault = BLUEPRINT_VAULT.filter((b) =>
    activeCategory === "all" ? true : b.category === activeCategory
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--surface-page)" }}>
      {/* Top Banner: $19.99 Package Vault Header */}
      <div
        style={{
          padding: "16px 24px",
          background: "var(--surface-deep)",
          borderBottom: "1px solid var(--border-deep)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "var(--action-accent)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Package size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "var(--text-body)", fontWeight: 700, color: "var(--paper-0)" }}>
                Agent Package & Blueprints Vault
              </span>
              <Badge tone="brand">$19.99 Package Included</Badge>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "var(--ink-300)" }}>
              Complete production prompt engineering suite, canonical 9-node JSON blueprints, agent scaffolding, and PRDs.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button
            variant="inverse"
            size="sm"
            icon="Download"
            onClick={() => handleDownloadFile("prospect-pal-full-package.json", JSON.stringify(BLUEPRINT_VAULT, null, 2))}
          >
            Download Complete Package (6 Files)
          </Button>
        </div>
      </div>

      {/* Main Vault Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left List of Files */}
        <div style={{ width: 400, borderRight: "1px solid var(--border-hairline)", display: "flex", flexDirection: "column", overflowY: "auto", padding: 20 }}>
          {/* Category Filter */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {["all", "workflow", "agent", "docs", "templates"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: activeCategory === cat ? "var(--surface-deep)" : "var(--surface-sunken)",
                  color: activeCategory === cat ? "var(--paper-0)" : "var(--text-secondary)",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredVault.map((item) => {
              const isSelected = selectedBlueprint.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedBlueprint(item)}
                  style={{
                    padding: 14,
                    borderRadius: "var(--radius-lg)",
                    border: isSelected ? "1.5px solid var(--cobalt-600)" : "1px solid var(--border-hairline)",
                    background: isSelected ? "var(--cobalt-50)" : "var(--surface-card)",
                    cursor: "pointer",
                    transition: "var(--transition-control)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                      {item.filename}
                    </span>
                    <Badge tone={item.category === "workflow" ? "verified" : item.category === "agent" ? "premium" : "neutral"}>
                      {item.badge}
                    </Badge>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Code / Doc Viewer */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: "var(--font-data)", color: "var(--cobalt-600)", fontWeight: 700 }}>
                FILE PREVIEW · {selectedBlueprint.size}
              </div>
              <h2 style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>
                {selectedBlueprint.filename}
              </h2>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => handleCopy(selectedBlueprint.id, selectedBlueprint.content)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-hairline)",
                  background: "var(--surface-card)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {copiedId === selectedBlueprint.id ? <Check size={14} color="var(--signal-verified)" /> : <Copy size={14} />}
                {copiedId === selectedBlueprint.id ? "Copied" : "Copy to Clipboard"}
              </button>
              <Button
                variant="accent"
                size="sm"
                icon="Download"
                onClick={() => handleDownloadFile(selectedBlueprint.filename, selectedBlueprint.content)}
              >
                Download File
              </Button>
            </div>
          </div>

          {/* Code Container */}
          <div
            style={{
              flex: 1,
              background: "var(--surface-deep)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-deep)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                background: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid var(--border-deep)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 12,
                fontFamily: "var(--font-data)",
                color: "var(--ink-300)",
              }}
            >
              <span>{selectedBlueprint.filename}</span>
              <span>UTF-8 · LF</span>
            </div>
            <pre
              style={{
                flex: 1,
                margin: 0,
                padding: 20,
                overflowY: "auto",
                fontFamily: "var(--font-data)",
                fontSize: 12,
                color: "var(--ink-100)",
                lineHeight: 1.6,
                background: "transparent",
              }}
            >
              <code>{selectedBlueprint.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
