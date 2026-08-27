"use client";

import { useState } from "react";
import { Button, Badge, Card, Icon, StatTile } from "@/components/ds";
import {
  Users,
  Search,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Mail,
  ChevronRight,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Building2,
  Briefcase,
  Zap,
} from "lucide-react";

interface Prospect {
  id: string;
  name: string;
  title: string;
  company: string;
  domain: string;
  location: string;
  matchScore: number;
  status: "verified" | "researched" | "drafted" | "sent" | "replied";
  trigger: string;
  email: string;
  painPoint: string;
  subject: string;
  pasDraft: string;
  techStack: string[];
}

const INITIAL_PROSPECTS: Prospect[] = [
  {
    id: "p-1",
    name: "Marcus Vance",
    title: "VP of Revenue Operations",
    company: "NexusFlow Data",
    domain: "nexusflow.io",
    location: "Austin, TX",
    matchScore: 98,
    status: "replied",
    trigger: "Hiring Head of Outbound & RevOps Engineer",
    email: "marcus.v@nexusflow.io",
    painPoint: "Manual CRM deduplication and slow lead enrichment bottlenecking SDR ramp time.",
    subject: "NexusFlow's RevOps headcount vs. automated outbound",
    pasDraft:
      "Hi Marcus — saw NexusFlow is scaling the RevOps team in Austin to unclog outbound pipeline. Most high-growth data teams lose 20+ hours weekly manually syncing enrichment tools back into HubSpot. We compiled a standalone SDR harness that dedupes, researches, and drafts verified PAS emails before touching your rep's inbox.",
    techStack: ["HubSpot", "Apollo", "n8n self-hosted", "Postgres"],
  },
  {
    id: "p-2",
    name: "Elena Rostova",
    title: "Head of Growth",
    company: "HyperScale AI",
    domain: "hyperscale.ai",
    location: "San Francisco, CA",
    matchScore: 95,
    status: "drafted",
    trigger: "Series B $28M announcement · Scaling enterprise outbound",
    email: "elena@hyperscale.ai",
    painPoint: "Generic cold email deliverability dropping below 45% with domain burn risk.",
    subject: "3-sentence PAS framework for HyperScale's Series B push",
    pasDraft:
      "Hi Elena — congrats on HyperScale's Series B round. Scaling outbound to enterprise buyers usually means sacrificing deep account personalization for raw volume. Our autonomous SDR conducts 4-point company research to craft hyper-specific 3-sentence hooks without burning domain reputation.",
    techStack: ["Salesforce", "Clay", "Smartlead", "Anthropic Claude"],
  },
  {
    id: "p-3",
    name: "Devon Chen",
    title: "Co-Founder & CEO",
    company: "CloudPulse Systems",
    domain: "cloudpulse.tech",
    location: "New York, NY",
    matchScore: 92,
    status: "sent",
    trigger: "New product launch · Infrastructure monitoring 2.0",
    email: "devon@cloudpulse.tech",
    painPoint: "Founder-led sales consuming 60% of weekly capacity with no full-time SDR.",
    subject: "Automating CloudPulse founder outbound without extra tools",
    pasDraft:
      "Hi Devon — saw CloudPulse's 2.0 launch on ProductHunt this morning. As a founder, running outbound manually while shipping code pulls you away from core product roadmap. Prospect PAL operates as your autonomous SDR — uncovering target VP Eng profiles and queuing pre-vetted sequences on autopilot.",
    techStack: ["Attio", "Instantly", "Firecrawl"],
  },
  {
    id: "p-4",
    name: "Sarah Jenkins",
    title: "Director of Sales Development",
    company: "FinMatrix Corp",
    domain: "finmatrix.com",
    location: "Chicago, IL",
    matchScore: 89,
    status: "researched",
    trigger: "Hiring 6 enterprise SDRs · Expanding US Midwest territory",
    email: "sjenkins@finmatrix.com",
    painPoint: "Long SDR onboarding curves and inconsistent messaging across new reps.",
    subject: "Standardizing FinMatrix outbound copy across 6 new SDRs",
    pasDraft:
      "Hi Sarah — noticed FinMatrix is hiring 6 SDRs for the Midwest expansion. Keeping messaging consistent across a growing SDR floor while maintaining bespoke company research is brutal. Our SDR agent standardizes problem-agitate-solve templates with real-time intent triggers.",
    techStack: ["Salesforce", "ZoomInfo", "Outreach"],
  },
  {
    id: "p-5",
    name: "Liam O'Connor",
    title: "VP of Business Development",
    company: "AeroVelo Logistics",
    domain: "aerovelo.co",
    location: "Boston, MA",
    matchScore: 87,
    status: "verified",
    trigger: "Supply chain automation expansion · Keynote speaker at Manifest",
    email: "liam@aerovelo.co",
    painPoint: "Legacy freight brokers ignoring generic email sequences.",
    subject: "Targeting freight directors after Manifest 2026",
    pasDraft:
      "Hi Liam — caught your keynote on freight visibility at Manifest. Reaching logistics leaders requires immediate relevance to port congestion data rather than generic feature pitches. Our autonomous agent synthesizes industry trade news directly into first-touch outreach.",
    techStack: ["HubSpot", "Apollo", "Google Workspace"],
  },
];

export default function CoreSdrView() {
  const [prospects, setProspects] = useState<Prospect[]>(INITIAL_PROSPECTS);
  const [selectedProspect, setSelectedProspect] = useState<Prospect>(INITIAL_PROSPECTS[0]);
  const [isAgentRunning, setIsAgentRunning] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "researched" | "drafted" | "sent" | "replied">("all");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProspects = prospects.filter((p) => {
    const matchesTab = activeTab === "all" ? true : p.status === activeTab;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSendDraft = (id: string) => {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "sent" } : p))
    );
    if (selectedProspect.id === id) {
      setSelectedProspect((prev) => ({ ...prev, status: "sent" }));
    }
  };

  const handleRegenerateHook = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const updatedCopy = `Hi ${selectedProspect.name.split(" ")[0]} — noticed ${selectedProspect.company}'s recent initiative on ${selectedProspect.trigger.toLowerCase()}. Most leaders in your position face ${selectedProspect.painPoint.toLowerCase()} We've built an autonomous pipeline engine that runs this entire research and personalization loop automatically.`;
      setSelectedProspect((prev) => ({ ...prev, pasDraft: updatedCopy }));
      setIsRegenerating(false);
    }, 800);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--surface-page)" }}>
      {/* Top Banner: Core Agent Mode */}
      <div
        style={{
          padding: "12px 24px",
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
              width: 32,
              height: 32,
              borderRadius: "var(--radius-md)",
              background: "var(--champagne-300)",
              color: "var(--ink-900)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            <Sparkles size={18} strokeWidth={2} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 700, color: "var(--paper-0)" }}>
                Core Autonomous SDR
              </span>
              <Badge tone="premium">No external automation tools needed</Badge>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  fontFamily: "var(--font-data)",
                  color: isAgentRunning ? "var(--signal-verified)" : "var(--ink-300)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: isAgentRunning ? "var(--signal-verified)" : "var(--ink-400)",
                  }}
                />
                {isAgentRunning ? "AGENT ACTIVE (AUTONOMOUS DISPATCH)" : "AGENT PAUSED"}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "var(--ink-300)" }}>
              Direct lead discovery, 4-layer AI research, PAS copywriting, and sequence delivery in one workspace.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button
            variant="inverse"
            size="sm"
            icon={isAgentRunning ? "Pause" : "Play"}
            onClick={() => setIsAgentRunning(!isAgentRunning)}
          >
            {isAgentRunning ? "Pause SDR" : "Resume SDR"}
          </Button>
          <Button variant="accent" size="sm" icon="Plus">
            Define Target ICP
          </Button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Column: Metrics + Prospect Table */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", padding: 24, borderRight: "1px solid var(--border-hairline)" }}>
          {/* Metrics Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <StatTile value="142" label="Leads Discovered" tone="brand" />
            <StatTile value="98%" label="Avg ICP Match" tone="verified" />
            <StatTile value="64" label="PAS Emails Queued" tone="premium" />
            <StatTile value="18.4%" label="Verified Reply Rate" tone="verified" />
          </div>

          {/* Filter Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 6, background: "var(--surface-sunken)", padding: 4, borderRadius: "var(--radius-lg)" }}>
              {(["all", "researched", "drafted", "sent", "replied"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: activeTab === tab ? "var(--surface-card)" : "transparent",
                    color: activeTab === tab ? "var(--cobalt-600)" : "var(--text-secondary)",
                    fontWeight: activeTab === tab ? 700 : 500,
                    fontSize: 12,
                    cursor: "pointer",
                    textTransform: "capitalize",
                    boxShadow: activeTab === tab ? "var(--shadow-card)" : "none",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ position: "relative", minWidth: 240 }}>
              <Search
                size={14}
                style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
              />
              <input
                type="text"
                placeholder="Search leads, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 12px 6px 30px",
                  fontSize: 12,
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-hairline)",
                  background: "var(--surface-card)",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Prospects Table */}
          <div
            style={{
              background: "var(--surface-card)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-hairline)",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--surface-sunken)", borderBottom: "1px solid var(--border-hairline)" }}>
                  <th style={{ padding: "10px 14px", fontWeight: 600, color: "var(--text-secondary)" }}>Prospect & Role</th>
                  <th style={{ padding: "10px 14px", fontWeight: 600, color: "var(--text-secondary)" }}>Company</th>
                  <th style={{ padding: "10px 14px", fontWeight: 600, color: "var(--text-secondary)" }}>Match</th>
                  <th style={{ padding: "10px 14px", fontWeight: 600, color: "var(--text-secondary)" }}>Status</th>
                  <th style={{ padding: "10px 14px", fontWeight: 600, color: "var(--text-secondary)" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProspects.map((p) => {
                  const isSelected = selectedProspect.id === p.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProspect(p)}
                      style={{
                        borderBottom: "1px solid var(--border-hairline)",
                        cursor: "pointer",
                        background: isSelected ? "var(--cobalt-50)" : "transparent",
                        transition: "var(--transition-control)",
                      }}
                    >
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{p.title}</div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{p.company}</div>
                        <div style={{ fontSize: 11, fontFamily: "var(--font-data)", color: "var(--text-muted)" }}>{p.domain}</div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-data)",
                            fontSize: 12,
                            fontWeight: 700,
                            color: p.matchScore >= 90 ? "var(--signal-verified)" : "var(--signal-warning)",
                          }}
                        >
                          {p.matchScore}%
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <Badge
                          tone={
                            p.status === "replied"
                              ? "premium"
                              : p.status === "sent"
                              ? "verified"
                              : p.status === "drafted"
                              ? "brand"
                              : "neutral"
                          }
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        {p.status === "drafted" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendDraft(p.id);
                            }}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "var(--radius-sm)",
                              border: "none",
                              background: "var(--action-accent)",
                              color: "white",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Send size={12} /> Send
                          </button>
                        ) : (
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Inspected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AI Deep Research & PAS Studio Drawer */}
        <div
          style={{
            width: 440,
            background: "var(--surface-sunken)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            padding: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-data)",
                  color: "var(--cobalt-600)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                AUTONOMOUS SDR DOSSIER
              </div>
              <h3 style={{ margin: "2px 0 0", fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
                {selectedProspect.name}
              </h3>
            </div>
            <Badge tone="verified">ICP Match {selectedProspect.matchScore}%</Badge>
          </div>

          {/* Account Meta Tile */}
          <div
            style={{
              padding: 14,
              background: "var(--surface-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-hairline)",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Building2 size={16} color="var(--cobalt-600)" />
              <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>{selectedProspect.company}</strong>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>· {selectedProspect.location}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>
              <Briefcase size={14} />
              <span>{selectedProspect.title}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-secondary)" }}>
              <Mail size={14} />
              <span style={{ fontFamily: "var(--font-data)" }}>{selectedProspect.email}</span>
            </div>
          </div>

          {/* 4-Layer Synthesized Intelligence */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>
              AI Research Synthesis
            </div>
            <div
              style={{
                padding: 14,
                background: "var(--surface-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-hairline)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--cobalt-600)", marginBottom: 2 }}>
                  ⚡ TIMELY TRIGGER
                </div>
                <div style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.4 }}>
                  {selectedProspect.trigger}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--signal-warning)", marginBottom: 2 }}>
                  🎯 CORE PAIN POINT HYPOTHESIS
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  {selectedProspect.painPoint}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-500)", marginBottom: 4 }}>
                  🛠️ DETECTED TECH STACK
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedProspect.techStack.map((tool) => (
                    <span
                      key={tool}
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-data)",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-pill)",
                        background: "var(--surface-sunken)",
                        border: "1px solid var(--border-hairline)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PAS Copywriting Studio */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                3-Sentence PAS Email Draft
              </div>
              <button
                onClick={handleRegenerateHook}
                disabled={isRegenerating}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 11,
                  color: "var(--cobalt-600)",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <RefreshCw size={12} className={isRegenerating ? "spin" : ""} /> Regenerate hook
              </button>
            </div>

            <div
              style={{
                padding: 14,
                background: "var(--surface-card)",
                borderRadius: "var(--radius-lg)",
                border: "1.5px solid var(--border-strong)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div>
                <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Subject: </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                  {selectedProspect.subject}
                </span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-primary)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedProspect.pasDraft}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
              <Button
                variant="accent"
                fullWidth
                icon="Send"
                onClick={() => handleSendDraft(selectedProspect.id)}
                disabled={selectedProspect.status === "sent" || selectedProspect.status === "replied"}
              >
                {selectedProspect.status === "sent"
                  ? "Dispatched"
                  : selectedProspect.status === "replied"
                  ? "Conversation Active"
                  : "Approve & Send"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
