"use client";

import { useState } from "react";
import { Button, Badge, Card, Icon } from "@/components/ds";
import { Search, Download, Upload, MoreVertical } from "lucide-react";

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: "lead-gen" | "enrichment" | "outreach" | "crm";
  isActive: boolean;
  nodesCount: number;
}

const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "1",
    name: "Apollo Lead Search",
    description: "Search Apollo for leads matching your ICP criteria",
    category: "lead-gen",
    isActive: true,
    nodesCount: 5,
  },
  {
    id: "2",
    name: "Clay Enrichment Waterfall",
    description: "Enrich contacts with company and person data",
    category: "enrichment",
    isActive: true,
    nodesCount: 8,
  },
  {
    id: "3",
    name: "HubSpot CRM Sync",
    description: "Dedupe and sync contacts to HubSpot",
    category: "crm",
    isActive: true,
    nodesCount: 6,
  },
  {
    id: "4",
    name: "Smartlead Sequence",
    description: "Enroll leads into multi-step email sequences",
    category: "outreach",
    isActive: false,
    nodesCount: 4,
  },
  {
    id: "5",
    name: "AI PAS Copywriter",
    description: "Generate personalized Problem-Agitate-Solve emails",
    category: "outreach",
    isActive: true,
    nodesCount: 3,
  },
  {
    id: "6",
    name: "Slack Approval Gate",
    description: "Get human approval before sending outreach",
    category: "outreach",
    isActive: true,
    nodesCount: 2,
  },
];

const CATEGORY_LABELS: Record<WorkflowTemplate["category"], string> = {
  "lead-gen": "Lead Generation",
  "enrichment": "Enrichment",
  "outreach": "Outreach",
  "crm": "CRM",
};

export default function WorkflowsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filteredWorkflows = WORKFLOW_TEMPLATES.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || w.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
            Workflows
          </h1>
          <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-secondary)", marginTop: 4 }}>
            Workflow templates and activated skills for your automation engine
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-4)" }}>
          <Button variant="outline" icon="Upload">
            Import
          </Button>
          <Button variant="accent" icon="Plus">
            New workflow
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-4)",
          marginBottom: "var(--space-8)",
        }}
      >
        <div style={{ flex: 1, maxWidth: 400, position: "relative" }}>
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
            placeholder="Search workflows..."
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

        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {[null, "lead-gen", "enrichment", "outreach", "crm"].map((cat) => (
            <button
              key={cat || "all"}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: "var(--space-3) var(--space-5)",
                fontSize: "var(--text-caption)",
                fontWeight: "var(--weight-medium)",
                border: "1px solid var(--border-hairline)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                background: filterCategory === cat ? "var(--surface-brand-tint)" : "var(--surface-card)",
                color: filterCategory === cat ? "var(--text-brand)" : "var(--text-secondary)",
                borderColor: filterCategory === cat ? "var(--cobalt-200)" : "var(--border-hairline)",
              }}
            >
              {cat ? CATEGORY_LABELS[cat as WorkflowTemplate["category"]] : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "var(--space-6)",
        }}
      >
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} padding="md" elevated>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
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
                <Icon name="Workflow" size={20} color="var(--cobalt-400)" />
              </div>
              <Badge tone={workflow.isActive ? "verified" : "neutral"}>
                {workflow.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <h3
              style={{
                fontSize: "var(--text-h4)",
                fontWeight: "var(--weight-semibold)",
                color: "var(--text-primary)",
                margin: "0 0 var(--space-2)",
              }}
            >
              {workflow.name}
            </h3>

            <p
              style={{
                fontSize: "var(--text-body-sm)",
                color: "var(--text-secondary)",
                margin: "0 0 var(--space-6)",
                lineHeight: "var(--leading-relaxed)",
              }}
            >
              {workflow.description}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "var(--space-4)",
                borderTop: "1px solid var(--border-hairline)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                <Badge tone="neutral" shape="rounded">
                  {CATEGORY_LABELS[workflow.category]}
                </Badge>
                <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>
                  {workflow.nodesCount} nodes
                </span>
              </div>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "var(--space-2)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-muted)",
                }}
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
