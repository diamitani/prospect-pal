"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) {
        setError(
          err.message === "Auth session missing!"
            ? "This reset link is invalid or expired. Request a new one."
            : err.message
        );
        setLoading(false);
        return;
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password");
      setLoading(false);
    }
  }

  return (
    <div style={wrap}>
      <form onSubmit={onSubmit} style={card}>
        <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Choose a new password</h1>
        {done ? (
          <p style={{ fontSize: 13, color: "#065F46" }}>
            Password updated.{" "}
            <Link href="/login" style={{ color: "#2A41C9" }}>
              Sign in
            </Link>
          </p>
        ) : (
          <>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px" }}>
              Open this page from the email reset link so your session is set.
            </p>
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
            <label style={{ fontSize: 12, fontWeight: 600 }}>New password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <label style={{ fontSize: 12, fontWeight: 600 }}>Confirm</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={btn}>
              {loading ? "Saving…" : "Update password"}
            </button>
          </>
        )}
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
