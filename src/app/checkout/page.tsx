"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/ds/brand/Logo";

const PLANS = {
  diy: {
    id: "diy",
    name: "Agent Blueprints Package",
    price: "$19.99",
    priceNote: "one-time",
    description: "Download the complete blueprint package and deploy to your own n8n instance.",
    features: [
      "Canonical 9-Node Workflow JSON",
      "Agent Scaffolding (soul.md & manifest)",
      "Full PRD, Tech Stack & Architecture Specs",
      "3-Sentence PAS Email Copy Library",
      ".env.template & Credential Checklist",
      "Instant download access",
    ],
  },
  pro: {
    id: "pro",
    name: "Custom Template Agent",
    price: "$99",
    priceNote: "per month",
    description: "AI-powered campaign builder with visual canvas and multi-platform support.",
    features: [
      "Unlimited AI Campaign Compilations",
      "Live Interactive Visual 9-Node Canvas",
      "Multi-Platform (n8n, Make.com, Gumloop)",
      "Direct Public API & Webhook Deploy",
      "Multi-Agent Swarm Chat Harness",
      "Tech-Signal Lead Discovery Engine",
      "Bring Your Own Keys (BYOK)",
    ],
  },
  core: {
    id: "core",
    name: "Core Autonomous SDR",
    price: "$199",
    priceNote: "per month",
    description: "Fully autonomous SDR agent. No external automation platforms required.",
    features: [
      "Built-in Autonomous SDR Agent",
      "No n8n / Make / Gumloop Setup Required",
      "Automated 4-Layer Company Research",
      "Personalized 3-Sentence PAS Drafts",
      "Native Sequence Dispatch & Tracking",
      "Direct CRM Sync (HubSpot, Salesforce)",
      "Executive Outbound Performance Analytics",
    ],
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") || "pro";
  const plan = PLANS[planParam as keyof typeof PLANS] || PLANS.pro;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setEmail(data.user.email || "");
          setName(data.user.name || "");
        }
      })
      .catch(() => {});
  }, []);

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, email, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Checkout failed. Please try again.");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  };

  const inp = {
    width: "100%",
    padding: "12px 14px",
    fontSize: 14,
    border: "1.5px solid #e5e5e0",
    borderRadius: 10,
    outline: "none",
    fontFamily: "inherit",
    color: "#111",
    boxSizing: "border-box" as const,
    background: "white",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Left: Plan Details */}
      <div
        style={{
          width: 520,
          flexShrink: 0,
          background: "#0f172a",
          display: "flex",
          flexDirection: "column",
          padding: "48px",
          position: "relative",
          overflow: "hidden",
        }}
        className="checkout-left-panel"
      >
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "#2A41C9", opacity: 0.3 }} />
        <div style={{ position: "absolute", bottom: -60, left: -40, width: 240, height: 240, borderRadius: "50%", background: "#3A56E4", opacity: 0.2 }} />

        <Link href="/home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", position: "relative", zIndex: 1 }}>
          <Logo variant="lockup" size={32} onDeep={true} />
        </Link>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#B8C6FE", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            You're getting
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "white", letterSpacing: "-0.5px", lineHeight: 1.2, margin: "0 0 8px" }}>
            {plan.name}
          </h2>
          <p style={{ fontSize: 14, color: "#9CA3CB", lineHeight: 1.6, margin: "0 0 28px" }}>
            {plan.description}
          </p>

          <div style={{ marginBottom: 28 }}>
            {plan.features.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#2A41C9", border: "1px solid #B8C6FE44", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#B8C6FE", fontSize: 11, fontWeight: 800 }}>✓</span>
                </div>
                <span style={{ fontSize: 13, color: "#DBE3FF" }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Trust Signals */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>🔒</span>
              <span style={{ fontSize: 12, color: "#9CA3CB" }}>Secure checkout powered by Stripe</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>🛡️</span>
              <span style={{ fontSize: 12, color: "#9CA3CB" }}>Your API keys stay local — we never store them</span>
            </div>
            {plan.id !== "diy" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>↩️</span>
                <span style={{ fontSize: 12, color: "#9CA3CB" }}>Cancel anytime, no questions asked</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ fontSize: 11, color: "#2033A2", position: "relative", zIndex: 1 }}>
          Questions? Email support@prospectpal.ai
        </div>
      </div>

      {/* Right: Checkout Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "#fafafa" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Order Summary */}
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e5e0", padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
              Order Summary
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{plan.name}</span>
              <span style={{ fontSize: 11, background: "#EEF2FF", color: "#2A41C9", padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>
                {plan.id === "diy" ? "One-time" : "Monthly"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>Total due today</span>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: "#111" }}>{plan.price}</span>
                <span style={{ fontSize: 13, color: "#6B7280", marginLeft: 4 }}>{plan.priceNote}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e5e0", padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111", margin: "0 0 4px" }}>Complete your purchase</h2>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px" }}>Enter your details to continue to payment</p>

            <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Full name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  style={inp}
                  onFocus={(e) => (e.target.style.borderColor = "#2A41C9")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e5e0")}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Work email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  style={inp}
                  onFocus={(e) => (e.target.style.borderColor = "#2A41C9")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e5e0")}
                />
              </div>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "white",
                  background: "#2A41C9",
                  border: "none",
                  borderRadius: 10,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: loading ? 0.8 : 1,
                  fontFamily: "inherit",
                  marginTop: 6,
                  boxShadow: "0 2px 8px rgba(42,65,201,0.25)",
                }}
              >
                {loading ? (
                  <>
                    <Spinner />
                    Processing...
                  </>
                ) : (
                  <>Continue to payment →</>
                )}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 16 }}>
              By completing this purchase you agree to our Terms of Service.
            </p>
          </div>

          {/* Switch Plan */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link href="/home#pricing" style={{ fontSize: 13, color: "#6B7280", textDecoration: "none" }}>
              ← View all plans
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) { .checkout-left-panel { display: none !important; } }
      `}</style>
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 16,
        height: 16,
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "white",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        display: "inline-block",
      }}
    />
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
