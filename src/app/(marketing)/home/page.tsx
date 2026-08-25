"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckoutModal from "@/components/CheckoutModal";

const INTEGRATIONS = [
  { name: "Apollo.io", icon: "🏺", desc: "Contact reveal & 250M+ verified leads" },
  { name: "Clay.com", icon: "🧱", desc: "Waterfall enrichment & company data" },
  { name: "HubSpot", icon: "🔶", desc: "CRM deduplication & deal shield" },
  { name: "Smartlead", icon: "📬", desc: "Multi-inbox email warmup & sending" },
  { name: "Instantly.ai", icon: "⚡", desc: "High-volume cold outreach sequencing" },
  { name: "Salesforce", icon: "☁️", desc: "Enterprise pipeline protection" },
  { name: "Slack", icon: "💬", desc: "1-Click human review approval gate" },
  { name: "Amplemarket", icon: "📡", desc: "Buying intent trigger stream" },
  { name: "Clearbit", icon: "🔍", desc: "Domain & firmographic scoring" },
  { name: "Lemlist", icon: "✉️", desc: "Multi-channel multichannel cadences" },
  { name: "Attio", icon: "✨", desc: "Modern real-time CRM of record" },
  { name: "n8n Self-Hosted", icon: "⚙️", desc: "Native workflow engine orchestration" },
];

const FIVE_PILLARS = [
  { step: "01", title: "Trigger Ingest", subtitle: "Cron / Webhook / CSV", desc: "Daily scheduled cron, CSV lead import, or real-time website intent webhook triggers the pipeline.", color: "#10B981" },
  { step: "02", title: "CRM Dedupe Shield", subtitle: "Zero Deal Collisions", desc: "Checks HubSpot, Salesforce, or Attio in real time. Halts if active deals or customer tags exist.", color: "#F97316" },
  { step: "03", title: "Data & Contact Reveal", subtitle: "Apollo / Clay Waterfall", desc: "Pulls verified decision-maker emails matching exact boolean ICP titles and company size criteria.", color: "#3B82F6" },
  { step: "04", title: "AI PAS Copywriting", subtitle: "3-Sentence Problem-Agitate-Solve", desc: "LLM analyzes specific company signals and drafts concise, high-converting PAS email copy with zero fluff.", color: "#8B5CF6" },
  { step: "05", title: "Sequencer Enrollment", subtitle: "Smartlead / Instantly Auto-Sync", desc: "Auto-enrolls verified leads into warm sequencers, with optional 1-click Slack human approval gates.", color: "#06B6D4" },
];

const OUTPUT_DELIVERABLES = [
  { file: ".n8n.json", label: "Production n8n Workflow", badge: "Import Ready", desc: "Complete 9-node JSON graph with error catchers, expressions, and sub-workflow hooks." },
  { file: "BUILD_PROMPT.md", label: "Architecture & Deploy Guide", badge: "Documentation", desc: "Step-by-step deploy instructions, node credential checklist, and production scaling limits." },
  { file: ".env.template", label: "Zero-Hardcoded Secrets", badge: "Security", desc: "Pre-configured environment variables for Apollo, HubSpot, Smartlead, OpenAI, and Slack." },
  { file: "email-framework.md", label: "3-Sentence PAS Scripts", badge: "Copywriting", desc: "A/B tested Problem-Agitate-Solve cold email templates with dynamic variable mappings." },
  { file: "PRD.md", label: "GTM Pipeline Specification", badge: "Strategy", desc: "Complete ICP matrix, data dictionary, bounce-rate guardrails, and compliance rules." },
  { file: "Ack JSON Contract", label: "Connector Status Receipt", badge: "API Contract", desc: "Structured system verification receipt ready for Composio and n8n instance bridges." },
];

export default function LandingPage() {
  const router = useRouter();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"json" | "guide" | "email">("json");
  const [activePillarIndex, setActivePillarIndex] = useState(0);

  const handleOpenCheckout = (planId: string) => {
    setSelectedPlan(planId);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setIsCheckoutOpen(false);
    router.push("/dashboard");
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: "#ffffff", color: "#111827", minHeight: "100vh", overflowX: "hidden" }}>
      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div style={{
        background: "#0f172a",
        color: "#f8fafc",
        padding: "10px 24px",
        fontSize: "12px",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        borderBottom: "1px solid #1e293b",
      }}>
        <span style={{ background: "#22c55e", color: "#052e16", fontWeight: 800, padding: "2px 8px", borderRadius: "999px", fontSize: "10px" }}>
          NEW
        </span>
        <span>
          <strong>n8n Tech Signals Live:</strong> Discover 1,400+ companies using n8n and hiring GTM automation engineers.
        </span>
        <button
          onClick={() => handleOpenCheckout("pro")}
          style={{ background: "transparent", border: "none", color: "#4ade80", fontWeight: 700, cursor: "pointer", textDecoration: "underline", fontSize: "12px" }}
        >
          Explore Signal Leads →
        </button>
      </div>

      {/* ── STICKY NAV ── */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #f1f5f9",
        padding: "0 36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 68,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 900,
            fontSize: 16,
            boxShadow: "0 2px 10px rgba(22, 101, 52, 0.25)",
          }}>
            P
          </div>
          <div>
            <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: "-0.5px", color: "#0f172a" }}>Prospect PAL</span>
            <span style={{ fontSize: 10, color: "#16a34a", fontWeight: 700, marginLeft: 6, background: "#dcfce7", padding: "2px 6px", borderRadius: 4 }}>
              AUTOMATION AGENT
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <a href="#how-it-works" style={{ fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Architecture</a>
          <a href="#deliverables" style={{ fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Deliverables</a>
          <a href="#signals" style={{ fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Tech Signals</a>
          <a href="#pricing" style={{ fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Pricing</a>
          
          <Link
            href="/dashboard"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              transition: "all 0.15s ease",
            }}
          >
            Dashboard
          </Link>

          <button
            onClick={() => handleOpenCheckout("pro")}
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "white",
              background: "#16a34a",
              border: "none",
              padding: "9px 18px",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(22, 163, 74, 0.3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>⚡ Build Engine</span>
            <span>→</span>
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section style={{ padding: "80px 32px 60px", maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
        {/* Pill Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 14px",
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 999,
          marginBottom: 28,
        }}>
          <span style={{ width: 8, height: 8, background: "#16a34a", borderRadius: "50%", display: "inline-block" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#166534" }}>
            The Autonomous 5-Pillar Outbound Revenue Engine
          </span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: "clamp(38px, 6vw, 68px)",
          fontWeight: 900,
          letterSpacing: "-2px",
          lineHeight: 1.08,
          color: "#0f172a",
          margin: "0 0 24px",
        }}>
          Launch production n8n outbound<br />
          <span style={{
            background: "linear-gradient(135deg, #16a34a 0%, #0d9488 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            automated in 5 minutes.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: "clamp(16px, 2vw, 20px)",
          color: "#475569",
          maxWidth: 720,
          margin: "0 auto 36px",
          lineHeight: 1.6,
        }}>
          Define your ICP, connect your tools (Apollo, HubSpot, Smartlead), and watch our Autonomous GTM Architect compile a self-hosted 9-node n8n engine with AI 3-sentence PAS email scripts.
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
          <button
            onClick={() => handleOpenCheckout("pro")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "15px 32px",
              fontSize: 15,
              fontWeight: 700,
              color: "white",
              background: "#16a34a",
              border: "none",
              borderRadius: 12,
              boxShadow: "0 8px 24px -4px rgba(22, 163, 74, 0.4)",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
          >
            ⚡ Start Outbound Engine ($99/mo)
          </button>

          <button
            onClick={() => setIsVideoModalOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "15px 26px",
              fontSize: 15,
              fontWeight: 600,
              color: "#334155",
              background: "#ffffff",
              border: "1.5px solid #e2e8f0",
              borderRadius: 12,
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <span>▶</span> Watch 2-Min System Demo
          </button>

          <button
            onClick={() => handleOpenCheckout("diy")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "15px 22px",
              fontSize: 14,
              fontWeight: 700,
              color: "#0f172a",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <span>📦</span> DIY Prompt Package ($19.99)
          </button>
        </div>

        {/* Stats Strip */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          maxWidth: 900,
          margin: "0 auto",
          padding: "24px",
          background: "#f8fafc",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
        }}>
          {[
            { val: "9-Node Graph", label: "Canonical GTM Architecture" },
            { val: "0% Deal Collisions", label: "Strict CRM Dedupe Shield" },
            { val: "8.5% Reply Rate", label: "3-Sentence PAS Email Copy" },
            { val: "100% BYOK", label: "Zero Vendor Lock-in & Self-Hosted" },
          ].map((item, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>{item.val}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: 500 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE N8N CANVAS DEMONSTRATION ── */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{
          background: "#0f172a",
          borderRadius: 24,
          border: "1px solid #1e293b",
          overflow: "hidden",
          boxShadow: "0 30px 80px -20px rgba(15, 23, 42, 0.4)",
        }}>
          {/* Top Canvas Bar */}
          <div style={{
            padding: "14px 20px",
            background: "#1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #334155",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ef4444" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#eab308" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace", marginLeft: 12 }}>
                n8n-workflow-canvas://prospect-pal-engine.json
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "#4ade80", background: "rgba(74, 222, 128, 0.15)", padding: "3px 10px", borderRadius: 999, fontWeight: 700 }}>
                ● 5-Pillar Engine Active
              </span>
              <button
                onClick={() => router.push("/dashboard")}
                style={{
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  padding: "4px 12px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Open in Workspace ↗
              </button>
            </div>
          </div>

          {/* Interactive Pipeline Node Display */}
          <div style={{ padding: "32px 24px", overflowX: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 960 }}>
              {FIVE_PILLARS.map((pillar, idx) => {
                const isActive = activePillarIndex === idx;
                return (
                  <div key={pillar.step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <div
                      onClick={() => setActivePillarIndex(idx)}
                      style={{
                        flex: 1,
                        background: isActive ? "#1e293b" : "#141e33",
                        border: `1.5px solid ${isActive ? pillar.color : "#334155"}`,
                        borderRadius: 14,
                        padding: "16px 14px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: isActive ? `0 0 20px ${pillar.color}22` : "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: pillar.color }}>PILLAR {pillar.step}</span>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: pillar.color }} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#ffffff", marginBottom: 4 }}>
                        {pillar.title}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4 }}>
                        {pillar.subtitle}
                      </div>
                    </div>
                    {idx < FIVE_PILLARS.length - 1 && (
                      <div style={{ padding: "0 6px", color: "#475569", fontSize: 16, fontWeight: 700 }}>
                        →
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Pillar Detail Card */}
            <div style={{
              marginTop: 24,
              background: "#141e33",
              border: "1px solid #334155",
              borderRadius: 14,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: FIVE_PILLARS[activePillarIndex].color, marginBottom: 4 }}>
                  DETAILED SPECIFICATION: PILLAR {FIVE_PILLARS[activePillarIndex].step} — {FIVE_PILLARS[activePillarIndex].title.toUpperCase()}
                </div>
                <div style={{ fontSize: 14, color: "#e2e8f0", maxWidth: 680 }}>
                  {FIVE_PILLARS[activePillarIndex].desc}
                </div>
              </div>
              <button
                onClick={() => handleOpenCheckout("pro")}
                style={{
                  background: FIVE_PILLARS[activePillarIndex].color,
                  color: "#0f172a",
                  fontWeight: 800,
                  fontSize: 12,
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Configure This Node in Engine →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ECOSYSTEM ── */}
      <section style={{ padding: "60px 32px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Native Tool Integrations
            </p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#0f172a", margin: 0 }}>
              Directly connects to your existing revenue stack
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {INTEGRATIONS.map((tool) => (
              <div
                key={tool.name}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}>
                  {tool.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{tool.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>{tool.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MASTER DELIVERABLES SHOWCASE ── */}
      <section id="deliverables" style={{ padding: "80px 32px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Production Artifacts
          </span>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, color: "#0f172a", margin: "8px 0 12px" }}>
            What you get when you compile an engine
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", maxWidth: 600, margin: "0 auto" }}>
            Every build produces 6 production-grade deliverables ready for instant deployment into your self-hosted n8n instance or cloud workspace.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {OUTPUT_DELIVERABLES.map((item) => (
            <div
              key={item.file}
              style={{
                background: "#ffffff",
                border: "1.5px solid #e2e8f0",
                borderRadius: 16,
                padding: "24px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", padding: "3px 8px", borderRadius: 6 }}>
                  {item.file}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: 999 }}>
                  {item.badge}
                </span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
                {item.label}
              </div>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, margin: 0, flex: 1 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TECH SIGNALS & GTM HIRING INTENT ── */}
      <section id="signals" style={{ padding: "80px 32px", background: "#0f172a", color: "white" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                Real-Time Tech Stack Intelligence
              </div>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900, color: "#ffffff", margin: 0 }}>
                Find leads that already use n8n & are hiring GTM engineers
              </h2>
            </div>
            <button
              onClick={() => handleOpenCheckout("pro")}
              style={{
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Access Live Lead Signals ↗
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            {[
              {
                company: "NexusFlow Data",
                round: "Series A ($12M)",
                tech: "n8n (Self-Hosted), HubSpot, Apollo",
                role: "Hiring GTM Automation Engineer",
                dm: "Marcus Vance, VP RevOps",
              },
              {
                company: "HyperScale AI",
                round: "Series B ($28M)",
                tech: "n8n (Cloud), Salesforce, Clay, Smartlead",
                role: "Hiring Head of Outbound Growth",
                dm: "Elena Rostova, Head of Growth",
              },
              {
                company: "CloudPulse Systems",
                round: "Seed ($4.5M)",
                tech: "n8n (Self-Hosted), Attio, Instantly",
                role: "Hiring Founding GTM Specialist",
                dm: "Devon Chen, Co-Founder & CEO",
              },
            ].map((lead, i) => (
              <div
                key={i}
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: 16,
                  padding: "20px 22px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#ffffff" }}>{lead.company}</span>
                  <span style={{ fontSize: 11, background: "rgba(74, 222, 128, 0.15)", color: "#4ade80", padding: "2px 8px", borderRadius: 999, fontWeight: 700 }}>
                    {lead.round}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>
                  <strong>Tech Stack:</strong> {lead.tech}
                </div>
                <div style={{ fontSize: 12, color: "#fcd34d", marginBottom: 12 }}>
                  <strong>Trigger:</strong> {lead.role}
                </div>
                <div style={{ borderTop: "1px solid #334155", paddingTop: 10, fontSize: 12, color: "#cbd5e1", display: "flex", justifyContent: "space-between" }}>
                  <span>{lead.dm}</span>
                  <span style={{ color: "#4ade80", fontWeight: 700 }}>Verified Contact ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" style={{ padding: "90px 32px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Transparent Plans
          </span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: "#0f172a", margin: "8px 0 12px" }}>
            Deploy once. Run unlimited automated campaigns.
          </h2>
          <p style={{ fontSize: 15, color: "#64748b" }}>
            Bring your own API keys (BYOK). No hidden per-lead markups.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {/* TIER 1: DIY Build Package */}
          <div style={{
            background: "#ffffff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 20,
            padding: "32px 28px",
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
              DIY Build Package
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#0f172a", marginBottom: 4 }}>
              $19.99
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>
              One-time download & prompt suite
            </div>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, marginBottom: 20 }}>
              For engineers and tinkerers who want the exact prompts, blueprints, and .n8n.json templates to set it up themselves.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Canonical 9-Node n8n Workflow JSON",
                "Full Prompt Suite & Variable Schema",
                "Self-Hosted Docker & Railway Guide",
                "3-Sentence PAS Email Template Suite",
                ".env.template & Credential Map",
              ].map((feat, i) => (
                <li key={i} style={{ fontSize: 13, color: "#334155", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span> {feat}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleOpenCheckout("diy")}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "1.5px solid #0f172a",
                background: "white",
                color: "#0f172a",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Get DIY Package ($19.99)
            </button>
          </div>

          {/* TIER 2: Pro Growth Engine (BYOK) */}
          <div style={{
            background: "#ffffff",
            border: "2px solid #16a34a",
            borderRadius: 20,
            padding: "32px 28px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            boxShadow: "0 20px 40px -10px rgba(22, 163, 74, 0.2)",
          }}>
            <div style={{
              position: "absolute",
              top: -12,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#16a34a",
              color: "white",
              fontSize: 11,
              fontWeight: 800,
              padding: "4px 14px",
              borderRadius: 999,
            }}>
              MOST POPULAR (BYOK)
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#16a34a", textTransform: "uppercase", marginBottom: 8 }}>
              Pro Unlimited Engine
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#0f172a", marginBottom: 4 }}>
              $99 <span style={{ fontSize: 16, color: "#64748b", fontWeight: 500 }}>/ mo</span>
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>
              Unlimited campaigns, cancel anytime
            </div>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, marginBottom: 20 }}>
              Full access to the Autonomous GTM Architect, live canvas sync, Composio n8n connectors, and Execution Run Analyst.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Unlimited AI Campaign & Engine Compiles",
                "Live Interactive n8n Canvas Visualizer",
                "Composio & Self-Hosted n8n Bridge",
                "Automated Execution Error Triage & Analyst",
                "A/B Testing PAS Scripts Studio",
                "Real-Time Tech Signal Lead Finder",
                "Slack 1-Click Human Approval Gates",
              ].map((feat, i) => (
                <li key={i} style={{ fontSize: 13, color: "#0f172a", display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
                  <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span> {feat}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleOpenCheckout("pro")}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: "#16a34a",
                color: "white",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
              }}
            >
              Start Unlimited Pro ($99/mo) →
            </button>
          </div>

          {/* TIER 3: Custom Enterprise GTM */}
          <div style={{
            background: "#f8fafc",
            border: "1.5px solid #e2e8f0",
            borderRadius: 20,
            padding: "32px 28px",
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
              Custom Architecture
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#0f172a", marginBottom: 4 }}>
              $999 – $9,999+
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>
              White-glove enterprise migration
            </div>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, marginBottom: 20 }}>
              Custom data waterfalls, complex sub-workflows, CRM data cleansing, and private infrastructure setup by senior GTM engineers.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Dedicated GTM Systems Engineer",
                "Custom Clay & Apollo Waterfall Setup",
                "Legacy CRM Cleanse & Deduplication Audit",
                "Custom n8n Sub-Workflows & Webhook Routes",
                "Private Slack Channel Architecture Support",
              ].map((feat, i) => (
                <li key={i} style={{ fontSize: 13, color: "#334155", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span> {feat}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleOpenCheckout("custom")}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "1.5px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Request Custom Build →
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "48px 32px", borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, background: "#16a34a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 13 }}>
              P
            </div>
            <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 15 }}>Prospect PAL</span>
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            © 2025 Prospect PAL · Master Autonomous GTM Architect & n8n Systems Engineer
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/dashboard" style={{ fontSize: 12, color: "#475569", textDecoration: "none", fontWeight: 600 }}>Dashboard</Link>
            <a href="#how-it-works" style={{ fontSize: 12, color: "#475569", textDecoration: "none" }}>Architecture</a>
            <a href="#pricing" style={{ fontSize: 12, color: "#475569", textDecoration: "none" }}>Pricing</a>
          </div>
        </div>
      </footer>

      {/* ── CHECKOUT MODAL ── */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        selectedPlanInitial={selectedPlan}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />

      {/* ── VIDEO / DEMO TOUR MODAL ── */}
      {isVideoModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}>
          <div style={{
            background: "#0f172a",
            borderRadius: 20,
            maxWidth: 780,
            width: "100%",
            padding: "24px",
            border: "1px solid #334155",
            color: "white",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                ⚡ How the 5-Pillar Prospect Automation Engine Operates
              </h3>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: 18, cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <div style={{ background: "#1e293b", borderRadius: 12, padding: "24px", minHeight: 280, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Interactive Architecture Walkthrough</div>
              <p style={{ fontSize: 13, color: "#94a3b8", maxWidth: 520, margin: "0 auto 20px" }}>
                Watch how incoming triggers flow into CRM dedupe gates, trigger Apollo & Clay waterfalls, generate 3-sentence PAS copy via GPT-4o / Claude, and enroll verified prospects into Smartlead.
              </p>
              <div>
                <button
                  onClick={() => {
                    setIsVideoModalOpen(false);
                    handleOpenCheckout("pro");
                  }}
                  style={{
                    background: "#16a34a",
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Launch Live Builder Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
