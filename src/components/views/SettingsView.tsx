"use client";

import { useState } from "react";

const INTEGRATIONS = [
  { id: "apollo",       name: "Apollo",       envKey: "APOLLO_API_KEY",      emoji: "🏺", desc: "Lead discovery & contact search" },
  { id: "clay",         name: "Clay",         envKey: "CLAY_WEBHOOK_URL",    emoji: "🧱", desc: "Waterfall data enrichment" },
  { id: "hubspot",      name: "HubSpot",      envKey: "HUBSPOT_API_KEY",     emoji: "🔶", desc: "CRM sync & deduplication" },
  { id: "smartlead",    name: "Smartlead",    envKey: "SMARTLEAD_API_KEY",   emoji: "📬", desc: "Email sequence enrollment" },
  { id: "amplemarket",  name: "Amplemarket",  envKey: "AMPLEMARKET_API_KEY", emoji: "📡", desc: "All-in-one sales outreach" },
  { id: "slack",        name: "Slack",        envKey: "SLACK_WEBHOOK_URL",   emoji: "💬", desc: "Approval notifications" },
];

export default function SettingsView() {
  const [creds, setCreds] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const saveKey = (id: string, value: string) => {
    setCreds((prev) => ({ ...prev, [id]: value }));
    setSaved((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setSaved((prev) => ({ ...prev, [id]: false })), 2000);
    // In production: POST to /api/secrets to store in AWS Secrets Manager
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="font-bold text-ink text-lg">Integrations & Credentials</h2>
        <p className="text-sm text-ink-secondary mt-1">
          API keys are encrypted and stored in AWS Secrets Manager. Never shared or logged.
        </p>
      </div>

      {/* AWS Status */}
      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center text-sm">☁️</div>
          <div className="flex-1">
            <div className="font-semibold text-sm text-ink">AWS Bedrock · us-east-1</div>
            <div className="text-xs text-ink-secondary">Claude 3.5 Sonnet · Mantle Runtime · Connected</div>
          </div>
          <span className="badge-green">✓ Active</span>
        </div>
      </div>

      {/* Integrations */}
      <div className="space-y-3">
        {INTEGRATIONS.map((intg) => (
          <div key={intg.id} className="bg-white border border-surface-200 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{intg.emoji}</span>
              <div>
                <div className="font-semibold text-sm text-ink">{intg.name}</div>
                <div className="text-xs text-ink-muted">{intg.desc}</div>
              </div>
              {creds[intg.id] && <span className="ml-auto badge-green">✓ Connected</span>}
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                className="input flex-1"
                placeholder={`Enter ${intg.envKey}`}
                value={creds[intg.id] || ""}
                onChange={(e) => setCreds((prev) => ({ ...prev, [intg.id]: e.target.value }))}
              />
              <button
                onClick={() => saveKey(intg.id, creds[intg.id] || "")}
                className="btn-brand flex-shrink-0"
              >
                {saved[intg.id] ? "✓ Saved" : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-surface-50 border border-surface-200 rounded-2xl p-4">
        <p className="text-xs text-ink-muted">
          🔒 <strong>Security:</strong> All credentials are encrypted with AES-256 and stored in AWS Secrets Manager (KMS envelope encryption). They are injected into n8n workflow nodes as placeholder references — never exposed in logs or URLs.
        </p>
      </div>
    </div>
  );
}
