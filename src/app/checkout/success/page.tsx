"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ds/brand/Logo";

const PLAN_NAMES: Record<string, string> = {
  diy: "Agent Blueprints Package",
  pro: "Custom Template Agent",
  core: "Core Autonomous SDR",
};

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "pro";
  const planName = PLAN_NAMES[plan] || "Prospect PAL";

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "20px 32px", borderBottom: "1px solid #e5e5e0", background: "white" }}>
        <Link href="/home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Logo size={28} />
        </Link>
      </div>

      {/* Success Content */}
      <div style={{ maxWidth: 560, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        {/* Checkmark */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2A41C9, #3A56E4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
            boxShadow: "0 8px 24px rgba(42,65,201,0.25)",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#111", letterSpacing: "-0.5px", margin: "0 0 12px" }}>
          Payment successful!
        </h1>

        <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.6, margin: "0 0 32px" }}>
          Welcome to <strong>{planName}</strong>. Your account has been upgraded and you're ready to start building.
        </p>

        {/* Order Summary Card */}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            border: "1px solid #e5e5e0",
            padding: 24,
            textAlign: "left",
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
            Order Confirmation
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
            <span style={{ fontSize: 14, color: "#374151" }}>Plan</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{planName}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12 }}>
            <span style={{ fontSize: 14, color: "#374151" }}>Status</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#059669",
                background: "#D1FAE5",
                padding: "4px 10px",
                borderRadius: 4,
              }}
            >
              Active
            </span>
          </div>
        </div>

        {/* Next Steps */}
        <div style={{ background: "#EEF2FF", borderRadius: 12, padding: 20, marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#2A41C9", marginBottom: 12 }}>Next steps</div>
          <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
            {plan === "diy" ? (
              <>Head to your dashboard to access and download your blueprint files.</>
            ) : (
              <>Complete the onboarding wizard to configure your first campaign.</>
            )}
          </div>
        </div>

        {/* CTA */}
        <Link
          href={plan === "diy" ? "/dashboard" : "/onboarding"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 28px",
            fontSize: 15,
            fontWeight: 700,
            color: "white",
            background: "#2A41C9",
            borderRadius: 10,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(42,65,201,0.25)",
          }}
        >
          {plan === "diy" ? "Go to Dashboard" : "Start Onboarding"} →
        </Link>

        <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 20 }}>
          A receipt has been sent to your email address.
        </p>
      </div>
    </div>
  );
}
