"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Logo,
  Button,
  Badge,
  Icon,
  SectionHeading,
} from "@/components/ds";

const PACKAGE_FILES = [
  {
    file: "workflow.n8n.json",
    label: "Production workflow template",
    description: "The canonical 9-node n8n workflow JSON. Import directly into your n8n instance and configure credentials.",
  },
  {
    file: "BUILD_PROMPT.md",
    label: "Custom build prompt",
    description: "System instructions for your AI to generate or customize the prospect automation workflow based on your inputs.",
  },
  {
    file: "soul.md",
    label: "Agent personality & behavior",
    description: "Defines how the agent thinks, communicates, and makes decisions. Customize for your brand voice.",
  },
  {
    file: "email-framework.md",
    label: "PAS email templates",
    description: "Problem-Agitate-Solution copy framework with 3-sentence email templates for cold outreach.",
  },
  {
    file: "manifest.json",
    label: "Configuration schema",
    description: "Structured configuration for campaign settings, ICP definitions, and tool integrations.",
  },
  {
    file: ".env.template",
    label: "Environment setup",
    description: "Template for API keys and credentials. Fill in your own keys — nothing is stored or transmitted.",
  },
];

const FAQ = [
  {
    q: "What do I need to use this package?",
    a: "An n8n instance (cloud or self-hosted), API keys for your data tools (Apollo, Clay, etc.), and your CRM credentials. The package includes setup instructions.",
  },
  {
    q: "Is this a one-time purchase?",
    a: "Yes. Pay once, download the files, and they're yours forever. No subscription, no recurring fees.",
  },
  {
    q: "Can I customize the workflow?",
    a: "Absolutely. The JSON is fully editable in n8n. The BUILD_PROMPT.md helps you use AI to customize it further for your specific needs.",
  },
  {
    q: "Do you store my API keys?",
    a: "No. You configure credentials locally in your own n8n instance. We never see or store your keys.",
  },
  {
    q: "What's the difference from the Team plan?",
    a: "The DIY package gives you the raw files to configure yourself. Team ($99/mo) includes the visual canvas, AI campaign compiler, and multi-platform support with a managed experience.",
  },
];

export default function PackagesPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <>
      {/* Navigation */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          height: 66,
          padding: "0 32px",
          background: "rgba(251,250,248,0.86)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border-hairline)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Logo size={34} />
          </Link>
          <Badge tone="brand">Blueprints</Badge>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Link
            href="/home"
            style={{
              fontSize: "var(--text-body-sm)",
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            Back to home
          </Link>
          <Link href="/login">
            <Button variant="outline" size="md">
              Sign in
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "80px 32px 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Badge tone="verified" icon="ShieldCheck" style={{ marginBottom: 20 }}>
            One-time purchase
          </Badge>

          <h1
            style={{
              margin: "0 0 20px",
              fontFamily: "var(--font-display)",
              fontWeight: "var(--weight-bold)",
              fontSize: 52,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: "var(--text-primary)",
            }}
          >
            Agent Blueprints Package
          </h1>

          <p
            style={{
              margin: "0 auto 32px",
              fontSize: 19,
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              maxWidth: 600,
            }}
          >
            Everything you need to build and customize your outbound automation. Download, configure your keys, and deploy to your n8n instance.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 40 }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 48,
                fontWeight: "var(--weight-bold)",
                color: "var(--cobalt-600)",
              }}
            >
              $19.99
            </span>
            <span style={{ fontSize: "var(--text-body)", color: "var(--text-muted)" }}>
              one-time
            </span>
          </div>

          <Link href="/checkout?plan=diy">
            <Button variant="accent" size="lg">
              Buy and download
            </Button>
          </Link>
        </div>
      </section>

      {/* What's Included */}
      <section
        style={{
          padding: "60px 32px",
          background: "var(--surface-sunken)",
          borderTop: "1px solid var(--border-hairline)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionHeading
            eyebrow="What's included"
            title="6 production-ready files"
            description="Download everything you need to build your outbound pipeline."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
              marginTop: 36,
            }}
          >
            {PACKAGE_FILES.map((item) => (
              <div
                key={item.file}
                style={{
                  padding: "20px 22px",
                  background: "var(--surface-card)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Icon name="FileText" size={18} color="var(--cobalt-500)" />
                  <code
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: "var(--text-caption)",
                      color: "var(--cobalt-600)",
                      background: "var(--cobalt-50)",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    {item.file}
                  </code>
                </div>
                <h3
                  style={{
                    fontSize: "var(--text-body)",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 6,
                  }}
                >
                  {item.label}
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--text-secondary)",
                    lineHeight: "var(--leading-relaxed)",
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "60px 32px", maxWidth: 700, margin: "0 auto" }}>
        <SectionHeading
          eyebrow="Questions"
          title="Frequently asked"
        />

        <div style={{ marginTop: 32 }}>
          {FAQ.map((item, idx) => (
            <div
              key={idx}
              style={{
                borderBottom: "1px solid var(--border-hairline)",
                paddingBottom: 16,
                marginBottom: 16,
              }}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-body)",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {item.q}
                </span>
                <Icon
                  name={expandedFaq === idx ? "ChevronUp" : "ChevronDown"}
                  size={18}
                  color="var(--text-muted)"
                />
              </button>
              {expandedFaq === idx && (
                <p
                  style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--text-secondary)",
                    lineHeight: "var(--leading-relaxed)",
                    marginTop: 12,
                    marginBottom: 0,
                  }}
                >
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          padding: "48px 32px",
          background: "var(--surface-sunken)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h2)",
              fontWeight: "var(--weight-bold)",
              color: "var(--text-primary)",
              marginBottom: 12,
            }}
          >
            Ready to build?
          </h2>
          <p
            style={{
              fontSize: "var(--text-body-sm)",
              color: "var(--text-secondary)",
              marginBottom: 24,
            }}
          >
            Get the complete blueprint package and start automating your outbound today.
          </p>
          <Link href="/checkout?plan=diy">
            <Button variant="accent" size="lg">
              Buy for $19.99
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "32px 32px",
          borderTop: "1px solid var(--border-hairline)",
          background: "var(--surface-page)",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Logo size={24} />
          <div style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>
            © 2026 Prospect PAL
          </div>
          <Link
            href="/home#pricing"
            style={{
              fontSize: "var(--text-caption)",
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            View all plans
          </Link>
        </div>
      </footer>
    </>
  );
}
