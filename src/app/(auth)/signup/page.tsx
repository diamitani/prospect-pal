"use client";

import type { CSSProperties, FormEvent } from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: 24,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          maxWidth: 400,
          border: "1px solid #e5e5e0",
          borderRadius: 16,
          padding: 28,
        }}
      >
        <h1 style={{ fontSize: 22, margin: "0 0 6px" }}>
          Prospect Pal{" "}
          <span style={{ color: "#6B7280", fontWeight: 500, fontSize: 14 }}>
            by Salesgency
          </span>
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px" }}>
          Invite-only internal GTM app. Your email must be on the allowlist.
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
        <label style={{ fontSize: 12, fontWeight: 600 }}>Full name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />
        <label style={{ fontSize: 12, fontWeight: 600 }}>Work email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <label style={{ fontSize: 12, fontWeight: 600 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 8,
            padding: "12px 16px",
            background: "#2A41C9",
            color: "white",
            border: 0,
            borderRadius: 10,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {loading ? "Creating…" : "Create workspace"}
        </button>
        <p style={{ fontSize: 12, color: "#6B7280", marginTop: 16 }}>
          Already invited?{" "}
          <Link href="/login" style={{ color: "#2A41C9" }}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #e5e5e0",
  margin: "4px 0 12px",
  fontSize: 14,
  boxSizing: "border-box",
};
