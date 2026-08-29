"use client";

import { useState } from "react";
import { Button, Badge, Card, Icon } from "@/components/ds";
import {
  Target,
  Radio,
  MessageSquare,
  ShieldCheck,
  BarChart3,
  Layers,
  Copy,
  ExternalLink,
} from "lucide-react";

interface WorkflowTemplate {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: typeof Target;
  nodeCount: number;
  dialects: ("n8n" | "make" | "gumloop")[];
  category: "outbound" | "signals" | "replies" | "maintenance" | "analytics" | "enrichment";
}

const TEMPLATES: WorkflowTemplate[] = [
  {
    id: "t-1",
    slug: "outbound-engine",
    name: "Outbound engine",
    description: "The canonical prospect automation engine. Research, draft, approve, send, report.",
    icon: Target,
    nodeCount: 9,
    dialects: ["n8n", "make", "gumloop"],
    category: "outbound",
  },
  {
    id: "t-2",
    slug: "signal-watcher",
    name: "Signal watcher",
    description: "Watches funding and hiring feeds, drops matches into your CRM with the trigger quoted.",
    icon: Radio,
    nodeCount: 6,
    dialects: ["n8n", "make"],
    category: "signals",
  },
  {
    id: "t-3",
    slug: "reply-triage",
    name: "Reply triage",
    description: "Classifies replies, drafts the follow-up, books the meeting, silences the rest.",
    icon: MessageSquare,
    nodeCount: 7,
    dialects: ["n8n", "gumloop"],
    category: "replies",
  },
  {
    id: "t-4",
    slug: "crm-hygiene",
    name: "CRM hygiene",
    description: "Nightly dedupe, bounce quarantine and stage correction across your contact table.",
    icon: ShieldCheck,
    nodeCount: 5,
    dialects: ["n8n"],
    category: "maintenance",
  },
  {
    id: "t-5",
    slug: "execution-analyst",
    name: "Execution analyst",
    description: "Queries your instance at 06:00 and mails the failing node with a suggested patch.",
    icon: BarChart3,
    nodeCount: 4,
    dialects: ["n8n"],
    category: "analytics",
  },
  {
    id: "t-6",
    slug: "list-enrichment",
    name: "List enrichment",
    description: "Upload a CSV, waterfall it through your data tools, write back what verified.",
    icon: Layers,
    nodeCount: 6,
    dialects: ["n8n", "make", "gumloop"],
    category: "enrichment",
  },
];

interface TemplatesViewProps {
  onUseTemplate?: (templateSlug: string) => void;
}

export default function TemplatesView({ onUseTemplate }: TemplatesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTemplates = TEMPLATES.filter((t) =>
    selectedCategory === "all" ? true : t.category === selectedCategory
  );

  const handleUseTemplate = (template: WorkflowTemplate) => {
    if (onUseTemplate) {
      onUseTemplate(template.slug);
    }
  };

  return (
    <div style={{ flex: 1, overflow: "auto", background: "var(--surface-page)" }}>
      <div style={{ padding: "28px 40px 48px", width: "100%", boxSizing: "border-box" }}>
        {/* Header */}
        <div style={{ maxWidth: 600, marginBottom: 20 }}>
          <h1
            style={{
              fontSize: "var(--text-h2)",
              fontWeight: "var(--weight-bold)",
              letterSpacing: "var(--tracking-heading)",
              margin: "0 0 6px",
              color: "var(--text-primary)",
            }}
          >
            Templates
          </h1>
          <p
            style={{
              fontSize: "var(--text-body-sm)",
              color: "var(--text-secondary)",
              margin: 0,
              lineHeight: "var(--leading-relaxed)",
            }}
          >
            Proven engines. Duplicate one, rebind it to your stack, export in the dialect your instance speaks.
          </p>
        </div>

        {/* Category filters */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {["all", "outbound", "signals", "replies", "maintenance", "analytics", "enrichment"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: selectedCategory === cat ? "var(--surface-deep)" : "var(--surface-sunken)",
                color: selectedCategory === cat ? "var(--paper-0)" : "var(--text-secondary)",
                fontSize: "var(--text-caption)",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "var(--transition-control)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
          }}
        >
          {filteredTemplates.map((template) => {
            const IconComponent = template.icon;
            return (
              <div
                key={template.id}
                style={{
                  padding: 20,
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-hairline)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-card)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {/* Top row: icon + node count */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "var(--radius-md)",
                      background: "var(--surface-sunken)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--cobalt-600)",
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent size={17} strokeWidth={1.75} />
                  </span>
                  <Badge tone="neutral" mono>
                    {template.nodeCount} nodes
                  </Badge>
                </div>

                {/* Title + description */}
                <div>
                  <div
                    style={{
                      fontSize: "var(--text-h4)",
                      fontWeight: 600,
                      marginBottom: 4,
                      color: "var(--text-primary)",
                    }}
                  >
                    {template.name}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-body-sm)",
                      color: "var(--text-secondary)",
                      lineHeight: "var(--leading-relaxed)",
                    }}
                  >
                    {template.description}
                  </div>
                </div>

                {/* Dialect badges */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "auto" }}>
                  {template.dialects.map((dialect) => (
                    <span
                      key={dialect}
                      style={{
                        fontFamily: "var(--font-data)",
                        fontSize: "var(--text-micro)",
                        padding: "3px 8px",
                        borderRadius: "var(--radius-pill)",
                        background: "var(--surface-sunken)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {dialect}
                    </span>
                  ))}
                </div>

                {/* Action button */}
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  icon="CopyPlus"
                  onClick={() => handleUseTemplate(template)}
                >
                  Use this template
                </Button>
              </div>
            );
          })}
        </div>

        {/* Export info */}
        <div
          style={{
            marginTop: 24,
            padding: "16px 20px",
            background: "var(--surface-sunken)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-hairline)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-md)",
                background: "var(--surface-card)",
                border: "1px solid var(--border-hairline)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
              }}
            >
              <ExternalLink size={16} />
            </span>
            <div>
              <div style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, color: "var(--text-primary)" }}>
                Export to your instance
              </div>
              <div style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>
                n8n cloud · n8n self-hosted · Make.com · Gumloop
              </div>
            </div>
          </div>
          <Badge tone="verified" icon="ShieldCheck">
            We only ask which provider — never a key
          </Badge>
        </div>
      </div>
    </div>
  );
}
