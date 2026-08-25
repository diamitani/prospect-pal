"use client";

import { useState, useEffect } from "react";
import type { SignalLead } from "@/app/api/signals/search/route";

export default function SignalsLeadFinderView() {
  const [leads, setLeads] = useState<SignalLead[]>([]);
  const [signalFilter, setSignalFilter] = useState("n8n");
  const [roleFilter, setRoleFilter] = useState("all");
  const [fundingFilter, setFundingFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/signals/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signalFilter, roleFilter, fundingFilter }),
      });
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Failed to load signal leads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [signalFilter, roleFilter, fundingFilter]);

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fafaf8", overflow: "hidden" }}>
      {/* Top Filter Bar */}
      <div style={{ padding: "20px 32px", background: "#ffffff", borderBottom: "1px solid #eceae4" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>📡</span>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>
                n8n Tech Signals & GTM Hiring Leads
              </h1>
              <span style={{ fontSize: 11, background: "#dcfce7", color: "#166534", fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>
                {leads.length} Matches Found
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#6B7280", margin: "4px 0 0" }}>
              Filter companies currently running n8n in their stack and actively recruiting GTM automation talent.
            </p>
          </div>

          <button
            onClick={fetchLeads}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "#ffffff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>🔄</span> Refresh Stream
          </button>
        </div>

        {/* Filter Controls */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 4, textTransform: "uppercase" }}>
              Technology Signal:
            </label>
            <select
              value={signalFilter}
              onChange={(e) => setSignalFilter(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 12, background: "white" }}
            >
              <option value="n8n">n8n (Self-Hosted / Cloud)</option>
              <option value="hubspot">HubSpot CRM</option>
              <option value="apollo">Apollo.io</option>
              <option value="all">All Stack Signals</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 4, textTransform: "uppercase" }}>
              Hiring Job Trigger:
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 12, background: "white" }}
            >
              <option value="all">All GTM Roles</option>
              <option value="GTM">GTM Automation Engineer</option>
              <option value="RevOps">RevOps Manager</option>
              <option value="Growth">Head of Growth / Outbound</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 4, textTransform: "uppercase" }}>
              Funding Event:
            </label>
            <select
              value={fundingFilter}
              onChange={(e) => setFundingFilter(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 12, background: "white" }}
            >
              <option value="all">All Stages</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Seed">Seed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Leads List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6B7280" }}>
            Scanning tech signatures and live hiring databases...
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 16 }}>
            {leads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: "20px 22px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}>
                      {lead.logo}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>{lead.companyName}</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>{lead.domain} · {lead.industry} ({lead.headcount} emp)</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, background: "#f0fdf4", color: "#166534", padding: "3px 8px", borderRadius: 999, fontWeight: 700 }}>
                    {lead.fundingRound} ({lead.fundingAmount})
                  </span>
                </div>

                {/* Tech Signals Badges */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 4 }}>
                    VERIFIED TECH STACK SIGNATURE:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {lead.techSignals.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 6,
                          background: tech.includes("n8n") ? "#fef3c7" : "#f3f4f6",
                          color: tech.includes("n8n") ? "#92400e" : "#374151",
                          border: tech.includes("n8n") ? "1px solid #fde68a" : "1px solid #e5e7eb",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Detected Hiring Trigger */}
                <div style={{ background: "#f9fafb", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#b45309", marginBottom: 2 }}>
                    🎯 Trigger: {lead.openRoles.join(", ")}
                  </div>
                  <div style={{ fontSize: 11, color: "#4B5563" }}>
                    {lead.detectedTrigger}
                  </div>
                </div>

                {/* Decision Maker Footer */}
                <div style={{
                  marginTop: "auto",
                  borderTop: "1px solid #f3f4f6",
                  paddingTop: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>
                      {lead.keyDecisionMaker.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>
                      {lead.keyDecisionMaker.title}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyEmail(lead.keyDecisionMaker.verifiedEmail, lead.id)}
                    style={{
                      background: "#16a34a",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {copiedEmailId === lead.id ? "Email Copied! ✓" : "Copy Verified Email"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
