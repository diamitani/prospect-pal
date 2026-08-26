"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ds";

type Step = 1 | 2 | 3;

interface OnboardingData {
  company?: string;
  role?: string;
  tools: {
    crm?: string;
    enrichment?: string;
    sequencer?: string;
  };
  campaignIntent?: string;
}

const TOOL_OPTIONS = {
  crm: [
    { value: "salesforce", label: "Salesforce", icon: "☁️" },
    { value: "hubspot", label: "HubSpot", icon: "🧲" },
    { value: "pipedrive", label: "Pipedrive", icon: "🔶" },
    { value: "apollo", label: "Apollo", icon: "🚀" },
    { value: "other", label: "Other", icon: "➕" },
  ],
  enrichment: [
    { value: "apollo", label: "Apollo", icon: "🚀" },
    { value: "clay", label: "Clay", icon: "🧱" },
    { value: "clearbit", label: "Clearbit", icon: "🔍" },
    { value: "zoominfo", label: "ZoomInfo", icon: "📊" },
    { value: "other", label: "Other", icon: "➕" },
  ],
  sequencer: [
    { value: "apollo", label: "Apollo", icon: "🚀" },
    { value: "lemlist", label: "Lemlist", icon: "📧" },
    { value: "instantly", label: "Instantly", icon: "⚡" },
    { value: "smartlead", label: "Smartlead", icon: "🎯" },
    { value: "other", label: "Other", icon: "➕" },
  ],
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<OnboardingData>({ tools: {} });
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Save onboarding data to API
      const res = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to save onboarding data');
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding save failed:', error);
      // Still redirect to dashboard even if save fails
      router.push('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface-base)' }}>
      {/* Header */}
      <nav style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-hairline)' }}>
        <Logo size={32} />
      </nav>

      {/* Content */}
      <main style={{ flex: 1, padding: '48px 32px', maxWidth: 640, margin: '0 auto', width: '100%' }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: s <= step ? 'var(--cobalt-500)' : 'var(--surface-deep)',
                }}
              />
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
            Step {step} of 3
          </div>
        </div>

        {/* Step 1: Profile */}
        {step === 1 && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: 'var(--text-primary)' }}>
              Tell us about your company
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
              Help us customize your automation engine
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                  Company name
                </label>
                <input
                  type="text"
                  value={data.company || ''}
                  onChange={(e) => setData({ ...data, company: e.target.value })}
                  placeholder="Acme Corp"
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid var(--border-hairline)',
                    background: 'var(--surface-base)',
                    color: 'var(--text-primary)',
                    fontSize: 14,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                  Your role
                </label>
                <select
                  value={data.role || ''}
                  onChange={(e) => setData({ ...data, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid var(--border-hairline)',
                    background: 'var(--surface-base)',
                    color: 'var(--text-primary)',
                    fontSize: 14,
                  }}
                >
                  <option value="">Select your role</option>
                  <option value="founder">Founder / CEO</option>
                  <option value="sales">Sales / Business Development</option>
                  <option value="marketing">Marketing</option>
                  <option value="revops">Revenue Operations</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                onClick={() => setStep(2)}
                style={{
                  marginTop: 12,
                  padding: '12px 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--action-accent)',
                  color: 'var(--text-inverse)',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Tools */}
        {step === 2 && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: 'var(--text-primary)' }}>
              Select your GTM tools
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
              We'll configure integrations for your stack
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* CRM */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 10, color: 'var(--text-primary)' }}>
                  CRM
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                  {TOOL_OPTIONS.crm.map((tool) => (
                    <button
                      key={tool.value}
                      onClick={() => setData({ ...data, tools: { ...data.tools, crm: tool.value } })}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: data.tools.crm === tool.value ? '2px solid var(--cobalt-500)' : '1px solid var(--border-hairline)',
                        background: data.tools.crm === tool.value ? 'var(--cobalt-50)' : 'var(--surface-base)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: 14,
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{tool.icon}</div>
                      <div style={{ fontWeight: 600 }}>{tool.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enrichment */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 10, color: 'var(--text-primary)' }}>
                  Enrichment
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                  {TOOL_OPTIONS.enrichment.map((tool) => (
                    <button
                      key={tool.value}
                      onClick={() => setData({ ...data, tools: { ...data.tools, enrichment: tool.value } })}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: data.tools.enrichment === tool.value ? '2px solid var(--cobalt-500)' : '1px solid var(--border-hairline)',
                        background: data.tools.enrichment === tool.value ? 'var(--cobalt-50)' : 'var(--surface-base)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: 14,
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{tool.icon}</div>
                      <div style={{ fontWeight: 600 }}>{tool.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sequencer */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 10, color: 'var(--text-primary)' }}>
                  Sequencer
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                  {TOOL_OPTIONS.sequencer.map((tool) => (
                    <button
                      key={tool.value}
                      onClick={() => setData({ ...data, tools: { ...data.tools, sequencer: tool.value } })}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: data.tools.sequencer === tool.value ? '2px solid var(--cobalt-500)' : '1px solid var(--border-hairline)',
                        background: data.tools.sequencer === tool.value ? 'var(--cobalt-50)' : 'var(--surface-base)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: 14,
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{tool.icon}</div>
                      <div style={{ fontWeight: 600 }}>{tool.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    borderRadius: 8,
                    border: '1px solid var(--border-hairline)',
                    background: 'var(--surface-base)',
                    color: 'var(--text-primary)',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'var(--action-accent)',
                    color: 'var(--text-inverse)',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Campaign Intent */}
        {step === 3 && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: 'var(--text-primary)' }}>
              Describe your ideal prospect
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
              This helps our AI architect design your first automation (optional for now)
            </p>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                Campaign goal
              </label>
              <textarea
                value={data.campaignIntent || ''}
                onChange={(e) => setData({ ...data, campaignIntent: e.target.value })}
                placeholder="e.g., VP of Sales at B2B SaaS companies using n8n who are hiring automation engineers..."
                rows={6}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid var(--border-hairline)',
                  background: 'var(--surface-base)',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
              <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                You can always add this later in the dashboard
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: 8,
                  border: '1px solid var(--border-hairline)',
                  background: 'var(--surface-base)',
                  color: 'var(--text-primary)',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleComplete}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: loading ? 'var(--surface-muted)' : 'var(--action-accent)',
                  color: 'var(--text-inverse)',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Setting up...' : 'Complete Setup →'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
