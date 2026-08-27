"use client";

import { useState } from "react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanInitial?: string;
  onSuccess: (plan: string) => void;
}

const PLANS = [
  {
    id: "diy",
    name: "Agent Package (Blueprints & Docs)",
    price: "$19.99",
    billing: "one-time download",
    badge: "Blueprints",
    description: "Skills, instructions (to combine input with template to design new automation), agent scaffolding (to integrate with your own tech stack), PRD, tech stack, overview, and PAS templates.",
    features: [
      "Canonical 9-Node Workflow JSON",
      "Agent Scaffolding (soul.md & manifest)",
      "Full PRD, Tech Stack & Architecture Specs",
      "3-Sentence PAS Email Copy Library",
      ".env.template & Credential Checklist",
      "Instant Access to Blueprints Vault",
    ],
    highlight: false,
    cta: "Purchase Agent Package ($19.99)",
  },
  {
    id: "pro",
    name: "Custom Template Agent",
    price: "$99",
    billing: "per month, cancel anytime",
    badge: "Most Popular",
    description: "Designs specific campaigns for you based on your inputs. Multi-campaign studio, live interactive workflow canvas (n8n, Make, Gumloop), agent chat UI, and 1-click instance deployment.",
    features: [
      "Unlimited AI Campaign Compilations",
      "Live Interactive Visual 9-Node Canvas",
      "Multi-Platform (n8n, Make.com, Gumloop)",
      "Direct Public API & Webhook Deploy",
      "Multi-Agent Swarm Chat Harness",
      "Tech-Signal Lead Discovery Engine",
      "Bring Your Own Keys (BYOK Zero-Storage)",
    ],
    highlight: true,
    cta: "Start Pro Subscription ($99/mo)",
  },
  {
    id: "core",
    name: "Core Agent (Autonomous SDR)",
    price: "$199",
    billing: "per month, cancel anytime",
    badge: "No Automations Needed",
    description: "Turns into a full autonomous SDR. Outreach, deep AI research, PAS copywriting, and pipeline reporting all in one dashboard. No external automation platforms necessary.",
    features: [
      "Built-in Autonomous SDR Agent",
      "No n8n / Make / Gumloop Setup Required",
      "Automated 4-Layer Company Research",
      "Personalized 3-Sentence PAS Drafts",
      "Native Sequence Dispatch & Tracking",
      "Direct CRM Sync (HubSpot, Salesforce)",
      "Executive Outbound Performance Analytics",
    ],
    highlight: false,
    cta: "Activate Core SDR Agent ($199/mo)",
  },
];

export default function CheckoutModal({ isOpen, onClose, selectedPlanInitial = "pro", onSuccess }: CheckoutModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(selectedPlanInitial);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"select" | "pay" | "confirmed">("select");

  if (!isOpen) return null;

  const currentPlanObj = PLANS.find((p) => p.id === selectedPlan) || PLANS[1];

  const handleProceedToPayment = () => {
    setStep("pay");
  };

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate instant secure processing
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("confirmed");
      setTimeout(() => {
        onSuccess(selectedPlan);
      }, 1200);
    }, 1000);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(6px)",
      padding: 20,
    }}>
      <div style={{
        background: "#ffffff",
        borderRadius: 20,
        width: "100%",
        maxWidth: 820,
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.3)",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 28px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>⚡</span>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>
                {step === "select" && "Select Your Automation Engine Package"}
                {step === "pay" && "Complete Payment & Workspace Setup"}
                {step === "confirmed" && "Order Confirmed! Launching Workspace..."}
              </h2>
            </div>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>
              {step === "select" && "Choose how you want to build and deploy your outbound pipeline."}
              {step === "pay" && `Reviewing ${currentPlanObj.name} (${currentPlanObj.price}).`}
              {step === "confirmed" && "Your engine harness is initializing. Directing you to the intake wizard."}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f3f4f6",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 16,
              color: "#4B5563",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: "28px" }}>
          {step === "select" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
                {PLANS.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      style={{
                        borderRadius: 16,
                        padding: "20px 18px",
                        border: isSelected ? "2px solid #2A41C9" : "1.5px solid #e5e7eb",
                        background: isSelected ? "#EEF2FF" : "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {plan.highlight && (
                        <span style={{
                          position: "absolute",
                          top: -10,
                          right: 14,
                          background: "#2A41C9",
                          color: "white",
                          fontSize: 10,
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: 999,
                        }}>
                          {plan.badge}
                        </span>
                      )}
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                        {plan.name}
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: "#2A41C9", marginBottom: 2 }}>
                        {plan.price}
                      </div>
                      <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>
                        {plan.billing}
                      </div>
                      <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.4, margin: "0 0 16px", flex: 1 }}>
                        {plan.description}
                      </p>
                      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
                        {plan.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} style={{ fontSize: 11, color: "#374151", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: "#2A41C9", fontWeight: 700 }}>✓</span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid #f3f4f6", paddingTop: 20 }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 10,
                    border: "1px solid #d1d5db",
                    background: "white",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToPayment}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 10,
                    border: "none",
                    background: "#2A41C9",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "white",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(42,65,201,0.3)",
                  }}
                >
                  Continue with {currentPlanObj.name} →
                </button>
              </div>
            </div>
          )}

          {step === "pay" && (
            <form onSubmit={handleSimulatePayment} style={{ maxWidth: 560, margin: "0 auto" }}>
              <div style={{ background: "#f9fafb", padding: 18, borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{currentPlanObj.name}</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#2A41C9" }}>{currentPlanObj.price}</span>
                </div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{currentPlanObj.billing}</div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                  Full Name / Company
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera (Acme Corp)"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1.5px solid #d1d5db",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                  Work Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@acmecorp.com"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1.5px solid #d1d5db",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                  Payment Method (Mock Test Card)
                </label>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1.5px solid #d1d5db",
                  background: "#ffffff",
                  gap: 10,
                }}>
                  <span style={{ fontSize: 16 }}>💳</span>
                  <span style={{ fontSize: 13, color: "#374151", fontFamily: "monospace" }}>4242 •••• •••• 4242</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, background: "#e5e7eb", padding: "2px 6px", borderRadius: 4, color: "#4b5563" }}>
                    Mock Stripe Active
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f3f4f6", paddingTop: 18 }}>
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    background: "white",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ← Back to Plans
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: "11px 26px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2A41C9",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "white",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: "0 2px 8px rgba(42,65,201,0.3)",
                  }}
                >
                  {isSubmitting ? "Processing Payment..." : `Confirm & Authorize ${currentPlanObj.price}`}
                </button>
              </div>
            </form>
          )}

          {step === "confirmed" && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{
                width: 64,
                height: 64,
                background: "#EEF2FF",
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                color: "#2A41C9",
                marginBottom: 16,
              }}>
                ✓
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>
                Payment Successful!
              </h3>
              <p style={{ fontSize: 14, color: "#6B7280", maxWidth: 420, margin: "0 auto 20px" }}>
                Your workspace and 5-Pillar n8n engine harness have been provisioned. Redirecting to your onboarding wizard...
              </p>
              <div style={{ fontSize: 12, color: "#2A41C9", fontWeight: 700 }}>
                ⚡ Initializing Canvas...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
