"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ds/brand/Logo";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get("from") || "/dashboard";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pass redirectTo so server can echo it back
        body: JSON.stringify({ email, password, redirectTo }),
      });
      // IMPORTANT: await .json() fully before navigating.
      // The browser commits Set-Cookie headers when the response body is read.
      const data = await res.json() as { error?: string; redirectTo?: string };
      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }
      // Cookie is now stored — navigate
      window.location.replace(data.redirectTo || redirectTo);
    } catch {
      setError("Connection error — please try again");
      setLoading(false);
    }
  };

  const inp = {
    width: "100%", padding: "11px 14px", fontSize: 14,
    border: "1.5px solid #e5e5e0", borderRadius: 10,
    outline: "none", fontFamily: "inherit", color: "#111",
    boxSizing: "border-box" as const, background: "white",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── LEFT: Brand panel ── */}
      <div style={{
        width: 480, flexShrink: 0, background: "#0f172a",
        display: "flex", flexDirection: "column", padding: "48px",
        position: "relative", overflow: "hidden",
      }} className="auth-left-panel">
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "#2A41C9", opacity: 0.3 }} />
        <div style={{ position: "absolute", bottom: -100, left: -60, width: 280, height: 280, borderRadius: "50%", background: "#3A56E4", opacity: 0.2 }} />

        <Link href="/home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", position: "relative", zIndex: 1 }}>
          <Logo variant="lockup" size={32} onDeep={true} />
        </Link>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#B8C6FE", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Outbound Automation</div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "white", letterSpacing: "-1px", lineHeight: 1.15, margin: "0 0 20px" }}>
            Your pipeline,<br />on autopilot.
          </h2>
          <p style={{ fontSize: 15, color: "#9CA3CB", lineHeight: 1.65, margin: 0 }}>
            Describe your ICP, choose your tools, and get a production-ready n8n workflow with AI-written emails — in 5 minutes.
          </p>

          <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
            {[["25–50", "leads/day"], ["<2%", "bounce rate"], ["5 min", "to build"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>{v}</div>
                <div style={{ fontSize: 11, color: "#4a7a4a", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 20px" }}>
            <p style={{ fontSize: 13, color: "#DBE3FF", fontStyle: "italic", lineHeight: 1.6, margin: "0 0 12px" }}>
              "Set it up in 20 minutes. 50 qualified leads hitting Smartlead every morning."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2A41C9", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>SK</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "white" }}>Sarah K.</div>
                <div style={{ fontSize: 11, color: "#4a7a4a" }}>Head of Revenue, Series A SaaS</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: "#2033A2", position: "relative", zIndex: 1 }}>
          🔒 Supabase Auth · TLS 1.3 · Encrypted
        </div>
      </div>

      {/* ── RIGHT: Form ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "white" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111", letterSpacing: "-0.5px", margin: "0 0 6px" }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Sign in to your Prospect PAL workspace</p>
          </div>

          <OAuthButtons redirectTo={redirectTo} />

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 16px" }}>
            <div style={{ flex: 1, height: 1, background: "#f0f0ec" }} />
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: "#f0f0ec" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" style={inp}
                onFocus={(e) => e.target.style.borderColor = "#2A41C9"}
                onBlur={(e)  => e.target.style.borderColor = "#e5e5e0"} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: 12, color: "#2A41C9", textDecoration: "none" }}>Forgot password?</Link>
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inp}
                onFocus={(e) => e.target.style.borderColor = "#2A41C9"}
                onBlur={(e)  => e.target.style.borderColor = "#e5e5e0"} />
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px", fontSize: 14, fontWeight: 700,
              color: "white", background: "#2A41C9", border: "none", borderRadius: 10,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              opacity: loading ? 0.8 : 1, fontFamily: "inherit", marginTop: 4,
              boxShadow: "0 2px 8px rgba(42,65,201,0.25)",
            }}>
              {loading ? <><Spinner />Signing in...</> : "Sign in →"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#f0f0ec" }} />
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>New here?</span>
            <div style={{ flex: 1, height: 1, background: "#f0f0ec" }} />
          </div>

          <Link href="/checkout?plan=pro" style={{
            display: "block", textAlign: "center", padding: "12px",
            fontSize: 14, fontWeight: 700, color: "#2A41C9",
            border: "1.5px solid #2A41C9", borderRadius: 10,
            textDecoration: "none", transition: "all 0.2s",
          }}>Create workspace →</Link>

          <p style={{ textAlign: "center", fontSize: 11, color: "#D1D5DB", marginTop: 20 }}>
            🔒 Secured with Supabase Auth · Encrypted at rest
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .auth-left-panel { display: none !important; } }
      `}</style>
    </div>
  );
}

function Spinner() {
  return <span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "white" }} />}>
      <LoginForm />
    </Suspense>
  );
}
