#!/usr/bin/env python3
"""
Transform the hero section of page.tsx to tastyskill.dev premium split-screen layout
"""

import re
import sys

# Read the file
with open('src/app/(marketing)/home/page.tsx', 'r') as f:
    content = f.read()

# Find hero section - look for the exact pattern
hero_start = content.find('      {/* Hero Section */}')
if hero_start == -1:
    print("ERROR: Hero section marker not found")
    sys.exit(1)

# Find end of hero section (next section or comment)
# Look for the pattern: newline + whitespace + {/* or next section
next_pattern = content.find('\\n      {/*', hero_start + 50)
if next_pattern == -1:
    next_pattern = len(content)

print(f"Found hero at position {hero_start}-{next_pattern}")

# New hero section - exact tastyskill.dev implementation
new_hero = '''      {/* Hero Section - Premium Split-Screen Layout */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {/* Background Grid Pattern */}
        <div className="tastyskill-grid" style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
          backgroundSize: "40px 40px",
          zIndex: 0
        }} />

        {/* Animated Gradient Orb */}
        <div className="tastyskill-orb" style={{
          position: "absolute", top: "10%", right: "10%",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.15), transparent 60%)",
          borderRadius: "50%",
          zIndex: 1
        }} />

        <div style={{
          display: "flex", alignItems: "center", gap: "64px",
          maxWidth: "var(--layout-max)", width: "100%",
          padding: "0 32px", position: "relative", zIndex: 2
        }}>
          {/* Left Column - Headlines & Copy */}
          <div style={{ flex: 1, maxWidth: "600px" }}>
            <Badge tone="brand" icon="ShieldCheck" style={{ marginBottom: 24, display: "inline-flex" }}>
              BYOK · your instance
            </Badge>

            <h1
              style={{
                margin: "0 0 24px",
                fontFamily: "var(--font-display)",
                fontWeight: "var(--weight-bold)",
                fontSize: "clamp(48px, 6vw, 88px)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Prospect Automation
              <br />
              <span style={{ color: "#2563EB" }}>Engine</span>
            </h1>

            <p
              style={{
                margin: "0 0 32px",
                fontSize: 22,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                maxWidth: "480px",
              }}
            >
              Your custom AI agents compile <strong>n8n</strong>, <strong>Make</strong>, or <strong>Gumloop</strong> workflows from prompts. BYOK—your platform,
              your credentials, your instances.
            </p>

            <div style={{ display: "flex", gap: 16 }}>
              <Link href="/checkout?plan=pro" className="focus-outline">
                <Button variant="brand" size="lg">
                  Get started
                </Button>
              </Link>
              <Link href="#how" className="focus-outline">
                <Button variant="secondary" size="lg" icon="ArrowRight">
                  See demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - PipelineRail Diagram */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "var(--shadow-xl)",
              position: "relative",
              margin: "0 auto"
            }}>
              <h3 style={{
                margin: "0 0 24px",
                fontSize: "20px",
                fontWeight: "var(--weight-semibold)",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px", height: "32px",
                  background: "#2563EB",
                  borderRadius: "8px",
                  color: "white"
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                  </svg>
                </span>
                9-Node Workflow Pipeline
              </h3>

              <PipelineRail
                nodes={PIPELINE_NODES}
                interactive={true}
                style={{
                  background: "var(--surface-card)",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "none"
                }}
                onNodeSelect={(index) => setActiveNodeIndex(index)}
              />

              <div style={{
                marginTop: "24px",
                paddingTop: "24px",
                borderTop: "1px solid var(--border-color)"
              }}>
                {activeNodeIndex !== null && PIPELINE_NODES[activeNodeIndex] && (
                  <div style={{ animation: "fadeIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
                    <h4 style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: "var(--weight-semibold)", color: "#2563EB" }}>
                      {PIPELINE_NODES[activeNodeIndex].title}
                    </h4>
                    <p style={{ margin: 0, fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {PIPELINE_NODES[activeNodeIndex].tooltip}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`\\n          @media (max-width: 960px) {\\n            section > div {\\n              flex-direction: column !important;\\n              gap: 48px !important;\\n              text-align: center !important;\\n            }\\n            h1 {\\n              font-size: clamp(36px, 10vw, 56px) !important;\\n            }\\n          }\\n        `}</style>
      </section>'''

# Create new content
before_hero = content[:hero_start]
after_hero = content[next_pattern:]
new_content = before_hero + new_hero + after_hero

# Write back
with open('src/app/(marketing)/home/page.tsx', 'w') as f:
    f.write(new_content)

print("✅ Hero section transformed successfully")
print(f"File size: {len(new_content)} characters")
