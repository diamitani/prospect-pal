"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      // Await full body — browser commits Set-Cookie when body is read
      const data = await res.json() as { error?: string; user?: unknown };
      if (!res.ok) {
        setError(data.error || "Sign up failed — please try again");
        setLoading(false);
        return;
      }
      // Cookie is now stored — navigate
      window.location.replace("/dashboard");
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
    transition: "border-color 0.15s",
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
        <div style={{ position: "absolute", bottom: -60, left: -40, width: 240, height: 240, borderRadius: "50%", background: "#3A56E4", opacity: 0.2 }} />

        <Link href="/home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", position: "relative", zIndex: 1 }}>
          <div style={{ width: 32, height: 32, background: "#2A41C9", border: "2px solid #B8C6FE44", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 14 }}>P</div>
          <span style={{ fontWeight: 800, fontSize: 16, color: "white" }}>Prospect PAL</span>
        </Link>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#B8C6FE", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Free to start</div>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: "white", letterSpacing: "-1px", lineHeight: 1.2, margin: "0 0 20px" }}>
            Build your first outbound automation in 5 minutes.
          </h2>
          <p style={{ fontSize: 14, color: "#9CA3CB", lineHeight: 1.65, margin: "0 0 32px" }}>
            No code. No consultants. Describe your ICP and get a production-ready n8n workflow.
          </p>

          {[
            "Live n8n node canvas as you build",
            "AI-written email templates included",
            "Apollo, Clay, HubSpot, Smartlead + 9 more",
            "Download-ready workflow JSON",
            "Runs on autopilot every morning",
          ].map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#2A41C9", border: "1px solid #B8C6FE44", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#B8C6FE", fontSize: 11, fontWeight: 800 }}>✓</span>
              </div>
              <span style={{ fontSize: 13, color: "#DBE3FF" }}>{f}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, color: "#2033A2", position: "relative", zIndex: 1 }}>
          🔒 AWS Cognito · TLS 1.3 · No credit card required
        </div>
      </div>

      {/* ── RIGHT: Form ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "white" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111", letterSpacing: "-0.5px", margin: "0 0 6px" }}>Create your workspace</h1>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Free forever · No credit card needed</p>
          </div>

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Full name</label>
              <input
                type="text" required value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson" style={inp}
                onFocus={(e) => e.target.style.borderColor = "#2A41C9"}
                onBlur={(e)  => e.target.style.borderColor = "#e5e5e0"}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Work email</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com" style={inp}
                onFocus={(e) => e.target.style.borderColor = "#2A41C9"}
                onBlur={(e)  => e.target.style.borderColor = "#e5e5e0"}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</label>
              <input
                type="password" required value={password} minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8+ characters" style={inp}
                onFocus={(e) => e.target.style.borderColor = "#2A41C9"}
                onBlur={(e)  => e.target.style.borderColor = "#e5e5e0"}
              />
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
              {loading ? <><Spinner />Creating workspace...</> : "Create free workspace →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#6B7280", marginTop: 20 }}>
            Already have an account?{" "}
            <Link href="/login?from=/dashboard" style={{ color: "#2A41C9", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          </p>
          <p style={{ textAlign: "center", fontSize: 11, color: "#D1D5DB", marginTop: 10 }}>
            By signing up you agree to our Terms &amp; Privacy Policy.
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
