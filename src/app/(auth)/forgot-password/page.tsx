"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        }
      );
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={wrap}>
      <form onSubmit={onSubmit} style={card}>
        <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Reset your password</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px" }}>
          Enter your email and we&apos;ll send a reset link. The link returns you
          to this app via /auth/callback.
        </p>
        {sent ? (
          <div
            style={{
              background: "#ECFDF5",
              color: "#065F46",
              padding: 12,
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            If an account exists for that email, a reset link is on its way.
            Check your inbox (and spam).
          </div>
        ) : (
          <>
            {error && (
              <div
                style={{
                  background: "#FEF2F2",
                  color: "#991B1B",
                  padding: 10,
                  borderRadius: 8,
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                {error}
              </div>
            )}
            <label style={{ fontSize: 12, fontWeight: 600 }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={btn}>
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </>
        )}
        <p style={{ fontSize: 12, color: "#6B7280", marginTop: 16 }}>
          <Link href="/login" style={{ color: "#2A41C9" }}>
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

const wrap: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "white",
  fontFamily: "'Inter', system-ui, sans-serif",
  padding: 24,
};
const card: CSSProperties = {
  width: "100%",
  maxWidth: 400,
  border: "1px solid #e5e5e0",
  borderRadius: 16,
  padding: 28,
};
const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #e5e5e0",
  margin: "4px 0 12px",
  fontSize: 14,
  boxSizing: "border-box",
};
const btn: CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  background: "#2A41C9",
  color: "white",
  border: 0,
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
};
