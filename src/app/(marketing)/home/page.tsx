import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Prospect PAL — Build Your Outbound Automation in 5 Minutes",
  description: "Describe your ICP, choose your tools, and get a production-ready n8n workflow with AI-written emails. No code. No consultants.",
};

const INTEGRATIONS = [
  { name: "Apollo", emoji: "🏺" }, { name: "Clay", emoji: "🧱" },
  { name: "HubSpot", emoji: "🔶" }, { name: "Smartlead", emoji: "📬" },
  { name: "Salesforce", emoji: "☁️" }, { name: "LinkedIn", emoji: "💼" },
  { name: "Clearbit", emoji: "🔍" }, { name: "Slack", emoji: "💬" },
  { name: "Hunter", emoji: "🎯" }, { name: "Instantly", emoji: "⚡" },
  { name: "Lemlist", emoji: "✉️" }, { name: "Amplemarket", emoji: "📡" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Choose your tools", desc: "Pick your lead source (Apollo, LinkedIn, CSV), CRM (HubSpot, Salesforce), enrichment, and email sequencer. One click per category." },
  { step: "02", title: "Describe your ICP", desc: "Write a plain-English description of your ideal customer. Titles, company size, industry, pain points. No forms. No templates. Just your words." },
  { step: "03", title: "Watch it build live", desc: "Your workflow nodes appear one by one on a live canvas. You can see every step — trigger, enrich, research, write, send — as it's generated." },
  { step: "04", title: "Download and deploy", desc: "Import the n8n JSON directly. Connect your API keys. Activate. Your outbound machine runs on autopilot every day at 7AM." },
];

const FEATURES = [
  { icon: "⚡", title: "Live workflow canvas", desc: "Watch n8n nodes appear in real time as your workflow builds. See connections form between Apollo → Clay → AI → Smartlead." },
  { icon: "🤖", title: "AI email writer built in", desc: "Each workflow includes a PAS framework email template with variables. {{first_name}}, {{company}}, {{trigger_event}} ready to go." },
  { icon: "🔀", title: "Human approval gate", desc: "Optionally route every AI-written email through a Slack message for human review before it sends. One-click approve or reject." },
  { icon: "📦", title: "Full output package", desc: "Get the n8n JSON, step-by-step deploy guide, email template, and build prompts to customize later. Everything you need in one download." },
  { icon: "🔌", title: "12+ native integrations", desc: "Apollo, Clay, HubSpot, Salesforce, Smartlead, Instantly, Lemlist, Hunter, Clearbit, LinkedIn, Slack, Amplemarket." },
  { icon: "🔒", title: "Secure by default", desc: "All credentials stored in AWS Secrets Manager. Per-user workspaces. AWS Cognito auth. Your data never touches our servers." },
];

const TESTIMONIALS = [
  {
    quote: "We went from manually researching 10 leads a day to 50 qualified, enriched contacts hitting Smartlead every morning. Set it up in 20 minutes.",
    author: "Sarah K.", role: "Head of Revenue, Series A SaaS", avatar: "SK",
  },
  {
    quote: "The AI email writer actually sounds like me. I copied the PAS template, tweaked one line, and our reply rate jumped from 2% to 6.4% in two weeks.",
    author: "Marcus T.", role: "Founder, B2B consulting firm", avatar: "MT",
  },
  {
    quote: "I don't know n8n at all. I described my ICP, clicked generate, imported the JSON, added my API keys. Done. Ran its first campaign the next morning.",
    author: "Priya L.", role: "SDR Manager, fintech startup", avatar: "PL",
  },
];

const PRICING = [
  {
    name: "Free", price: "$0", period: "forever", highlight: false,
    features: ["3 workflow builds/mo", "n8n JSON export", "Email template", "Deploy guide", "Community support"],
    cta: "Start for free",
  },
  {
    name: "Pro", price: "$49", period: "/ month", highlight: true,
    features: ["Unlimited builds", "All integrations", "AI email writer", "Slack approval gate", "Workspace history", "Email support"],
    cta: "Start Pro free trial",
  },
  {
    name: "Agency", price: "$149", period: "/ month", highlight: false,
    features: ["Everything in Pro", "5 client workspaces", "White-label exports", "Priority support", "Onboarding call"],
    cta: "Talk to us",
  },
];

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#ffffff", color: "#111", overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #f0f0ec",
        padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, background: "#1c5a1c", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 13,
          }}>P</div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px" }}>Prospect PAL</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href="#how-it-works" style={{ fontSize: 13, color: "#6B7280", textDecoration: "none", padding: "6px 12px" }}>How it works</a>
          <a href="#features" style={{ fontSize: 13, color: "#6B7280", textDecoration: "none", padding: "6px 12px" }}>Features</a>
          <a href="#pricing" style={{ fontSize: 13, color: "#6B7280", textDecoration: "none", padding: "6px 12px" }}>Pricing</a>
          <Link href="/login" style={{
            fontSize: 13, fontWeight: 600, color: "#4B5563",
            textDecoration: "none", padding: "7px 14px",
            border: "1px solid #e5e5e0", borderRadius: 8, background: "white",
          }}>Sign in</Link>
          <Link href="/signup" style={{
            fontSize: 13, fontWeight: 700, color: "white",
            background: "#1c5a1c", textDecoration: "none",
            padding: "8px 16px", borderRadius: 8,
            boxShadow: "0 2px 8px rgba(28,90,28,0.25)", cursor: "pointer",
          }}>Get started free →</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: "100px 40px 80px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#f0f9f0", border: "1px solid #bce3bc", borderRadius: 100, marginBottom: 28 }}>
          <span style={{ width: 7, height: 7, background: "#4ADE80", borderRadius: "50%", display: "inline-block" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1c5a1c" }}>Now with live n8n canvas</span>
        </div>

        <h1 style={{
          fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 900,
          letterSpacing: "-2px", lineHeight: 1.05,
          color: "#0a0a0a", margin: "0 0 24px",
        }}>
          Your outbound automation,<br />
          <span style={{ color: "#1c5a1c" }}>built in 5 minutes.</span>
        </h1>

        <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#6B7280", maxWidth: 600, margin: "0 auto 36px", lineHeight: 1.65 }}>
          Describe your ICP, choose your tools, and watch a production-ready n8n workflow
          build itself — node by node — with AI-written emails included.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 28px", fontSize: 15, fontWeight: 700,
            color: "white", background: "#1c5a1c", textDecoration: "none",
            borderRadius: 12, boxShadow: "0 4px 20px rgba(28,90,28,0.3)",
            transition: "transform 0.2s", cursor: "pointer",
          }}>⚡ Build your first workflow — free</Link>
          <a href="#how-it-works" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 24px", fontSize: 15, fontWeight: 600,
            color: "#4B5563", background: "white", textDecoration: "none",
            borderRadius: 12, border: "1.5px solid #e5e5e0",
          }}>See how it works ↓</a>
        </div>

        {/* Social proof numbers */}
        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
          {[["25–50", "leads/day, automated"],["<2%", "bounce rate"],["15 min", "speed to lead"],["10+ hrs", "saved per week"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#111", letterSpacing: "-1px" }}>{val}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CANVAS PREVIEW ── */}
      <section style={{ padding: "0 40px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          background: "#111118", borderRadius: 20,
          border: "1px solid #2a2a35",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.2)",
        }}>
          {/* Fake browser bar */}
          <div style={{ padding: "12px 16px", background: "#16161e", borderBottom: "1px solid #2a2a35", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
            <div style={{ flex: 1, margin: "0 12px", padding: "4px 12px", background: "#0d0d14", borderRadius: 6, fontSize: 11, color: "#555", fontFamily: "monospace" }}>
              app.prospectpal.io/builder
            </div>
          </div>

          {/* Node canvas visualization */}
          <div style={{ padding: "32px 24px", position: "relative", minHeight: 280, overflowX: "auto" }}>
            {/* Dot grid */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "radial-gradient(circle, #ffffff08 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />

            {/* Nodes row */}
            <div style={{ display: "flex", alignItems: "center", gap: 0, position: "relative", zIndex: 1, overflowX: "auto" }}>
              {[
                { label: "Schedule Trigger", icon: "⏰", color: "#F59E0B", bg: "#1c1428" },
                { label: "Apollo Search", icon: "🏺", color: "#3B82F6", bg: "#0f1929" },
                { label: "HubSpot Check", icon: "🔶", color: "#FF7A59", bg: "#1a0e0a" },
                { label: "Clay Enrich", icon: "🧱", color: "#8B5CF6", bg: "#160d21" },
                { label: "AI Research", icon: "🤖", color: "#7C3AED", bg: "#14102a" },
                { label: "AI Email", icon: "✍️", color: "#7C3AED", bg: "#14102a" },
                { label: "Smartlead", icon: "📬", color: "#06B6D4", bg: "#041520" },
                { label: "Slack Alert", icon: "💬", color: "#4ADE80", bg: "#0a1f0f" },
              ].map((node, i, arr) => (
                <div key={node.label} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    background: node.bg, border: `1.5px solid ${node.color}88`,
                    borderRadius: 10, padding: "10px 14px",
                    display: "flex", alignItems: "center", gap: 8,
                    minWidth: 130,
                    boxShadow: `0 0 16px ${node.color}11`,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `${node.color}22`, display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: 16,
                    }}>{node.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#ddd" }}>{node.label}</div>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80", marginTop: 4 }} />
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width: 28, height: 2, background: `${node.color}44`, position: "relative", flexShrink: 0 }}>
                      <div style={{ position: "absolute", right: -4, top: -3, width: 8, height: 8, borderRight: `2px solid ${node.color}66`, borderTop: `2px solid ${node.color}66`, transform: "rotate(45deg)" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Code preview strip */}
            <div style={{ marginTop: 20, borderTop: "1px solid #2a2a35", paddingTop: 16 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                {["n8n JSON", "Deploy Guide", "Email Template"].map((t, i) => (
                  <span key={t} style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 6, fontFamily: "monospace",
                    background: i === 0 ? "#2a2a35" : "transparent",
                    color: i === 0 ? "#e0e0e0" : "#555",
                    border: "1px solid #2a2a35",
                  }}>{t}</span>
                ))}
              </div>
              <pre style={{ margin: 0, fontSize: 11, color: "#6b8aad", fontFamily: "monospace", lineHeight: 1.6 }}>
{`{
  "nodes": [
    { "name": "Apollo Lead Search", "type": "n8n-nodes-base.httpRequest", "position": [300, 200] },
    { "name": "Clay Enrichment",    "type": "n8n-nodes-base.httpRequest", "position": [560, 200] },
    { "name": "AI Email Writer",     "type": "n8n-nodes-base.httpRequest", "position": [820, 200] }
  ],
  "connections": { "Apollo Lead Search": { "main": [[{ "node": "Clay Enrichment", "type": "main" }]] } }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section style={{ padding: "40px 40px 80px", borderTop: "1px solid #f0f0ec", borderBottom: "1px solid #f0f0ec", background: "#fafaf8" }}>
        <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>
          Connects to your entire stack
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, maxWidth: 800, margin: "0 auto" }}>
          {INTEGRATIONS.map((t) => (
            <div key={t.name} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
              background: "white", border: "1px solid #eceae4", borderRadius: 100,
              fontSize: 13, fontWeight: 600, color: "#4B5563",
            }}>
              <span>{t.emoji}</span>{t.name}
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: "100px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#1c5a1c", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>How it works</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-1px", color: "#111", margin: 0 }}>
            From ICP description to live campaign<br />in under 5 minutes
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} style={{
              background: "white", border: "1px solid #eceae4",
              borderRadius: 16, padding: "28px 24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <div style={{
                width: 40, height: 40, background: "#f0f9f0",
                border: "2px solid #bce3bc", borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: "#1c5a1c", marginBottom: 16,
              }}>{item.step}</div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111", margin: "0 0 10px", letterSpacing: "-0.3px" }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "80px 40px", background: "#fafaf8", borderTop: "1px solid #f0f0ec", borderBottom: "1px solid #f0f0ec" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#1c5a1c", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Features</p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, letterSpacing: "-1px", margin: 0 }}>Everything you need. Nothing you don't.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                background: "white", border: "1px solid #eceae4",
                borderRadius: 14, padding: "24px",
                display: "flex", gap: 16, alignItems: "flex-start",
              }}>
                <div style={{
                  width: 40, height: 40, background: "#f4f3ef", borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "100px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#1c5a1c", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Results</p>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, letterSpacing: "-1px", margin: 0 }}>Real teams. Real pipelines.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.author} style={{
              background: "white", border: "1px solid #eceae4",
              borderRadius: 16, padding: "28px 24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 24, color: "#bce3bc", marginBottom: 16, lineHeight: 1 }}>"</div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>{t.quote}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "#1c5a1c", color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800,
                }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{t.author}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "80px 40px 100px", background: "#fafaf8", borderTop: "1px solid #f0f0ec" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#1c5a1c", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Pricing</p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, letterSpacing: "-1px", margin: "0 0 12px" }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: 15, color: "#6B7280" }}>Start free. No credit card required.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {PRICING.map((plan) => (
              <div key={plan.name} style={{
                background: plan.highlight ? "#1c5a1c" : "white",
                border: plan.highlight ? "none" : "1px solid #eceae4",
                borderRadius: 20, padding: "32px 28px",
                boxShadow: plan.highlight ? "0 20px 60px rgba(28,90,28,0.3)" : "0 1px 4px rgba(0,0,0,0.04)",
                position: "relative",
              }}>
                {plan.highlight && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: "#4ADE80", color: "#111", fontSize: 11, fontWeight: 800,
                    padding: "4px 14px", borderRadius: 100,
                  }}>Most popular</div>
                )}
                <div style={{ fontSize: 16, fontWeight: 800, color: plan.highlight ? "white" : "#111", marginBottom: 8 }}>{plan.name}</div>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: plan.highlight ? "white" : "#111", letterSpacing: "-1px" }}>{plan.price}</span>
                  <span style={{ fontSize: 13, color: plan.highlight ? "#9fce9f" : "#9CA3AF", marginLeft: 4 }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: plan.highlight ? "#dcf0dc" : "#4B5563" }}>
                      <span style={{ color: plan.highlight ? "#4ADE80" : "#1c5a1c", fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" style={{
                  display: "block", textAlign: "center", padding: "11px",
                  fontSize: 13, fontWeight: 700, borderRadius: 10, textDecoration: "none",
                  background: plan.highlight ? "white" : "#1c5a1c",
                  color: plan.highlight ? "#1c5a1c" : "white",
                  transition: "all 0.2s", cursor: "pointer",
                }}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "100px 40px", background: "#0f2d0f" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: "white", letterSpacing: "-1.5px", margin: "0 0 20px", lineHeight: 1.1 }}>
            Your SDR team doesn't need to<br />research leads manually anymore.
          </h2>
          <p style={{ fontSize: 16, color: "#9fce9f", marginBottom: 36, lineHeight: 1.65 }}>
            Build your first automated outbound workflow in the next 5 minutes.
            No code. No consultants. Just results.
          </p>
          <Link href="/signup" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "16px 36px", fontSize: 16, fontWeight: 800,
            color: "#1c5a1c", background: "white", textDecoration: "none",
            borderRadius: 12, boxShadow: "0 4px 20px rgba(255,255,255,0.15)", cursor: "pointer",
          }}>⚡ Build for free — no card needed</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "40px", borderTop: "1px solid #1a3d1a", background: "#0f2d0f" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 26, height: 26, background: "#1c5a1c", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 12 }}>P</div>
            <span style={{ fontWeight: 700, color: "#9fce9f", fontSize: 14 }}>Prospect PAL</span>
          </div>
          <div style={{ fontSize: 12, color: "#4a7a4a" }}>
            © 2025 Prospect PAL · Built on AWS · Secured by Cognito
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Docs"].map((l) => (
              <a key={l} href="#" style={{ fontSize: 12, color: "#4a7a4a", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
