---
artifact_type: frontend_ui_spec
project_id: prospect-pal
version: v2.4.0
status: approved
owner: design/eng
reviewers: [eng, design]
well_architected_review: pass
upstream: [01-intent-spec@v2, 07-design-system@v2, 08-prd@v2]
confidence: 0.98
---

# Frontend UI Specification: Prospect PAL (Makro Design Architecture)

## 1. Executive Summary & Design System Alignment
This document defines the production frontend UI specification for **Prospect PAL**, redesigning the marketing and landing surface based on the **Makro Framer design architecture** (`https://makro.framer.website/`). 

Prospect PAL translates Makro's ultra-clean, architectural SaaS layout—characterized by crisp light surfaces (`#F7F8FA` / `#EBEFF5`), deep charcoal typography (`#14142D`), high-density bento card grids, subtle 1px borders, and tactile micro-interactions—into an autonomous GTM and outbound agent experience.

---

## 2. Core Visual Language & Design Tokens

### 2.1 Palette & Surface Structure
- **Page Foundation:** Clean pale ice-tint canvas (`#F5F7FA` to `#EBEFF5`), avoiding muddy dark gradients or generic AI purple slop.
- **Surface Cards:** Pure elevated white (`#FFFFFF`) with 1px hairline borders (`rgba(20, 20, 45, 0.08)`) and soft ambient shadows (`0 2px 12px rgba(16, 27, 45, 0.04)`).
- **Typography:**
  - **Headlines:** Display Sans (`Inter Display` / `Geist Sans`), tight tracking (`-0.03em`), bold structural weights (700/800).
  - **Technical Metrics & Badges:** Monospace (`Geist Mono` / `Fragment Mono`), uppercase tracking (`+0.06em`).
  - **Body Copy:** Sans (`Inter` / `Geist`), relaxed line height (`1.6`), high legibility muted slate (`#4A5872` / `#58718A`).
- **Accents:**
  - **Brand Onyx:** `#14142D` / `#1B1C22` (primary buttons, active states).
  - **Electric Cobalt:** `#2563EB` / `#3A56E4` (pipeline flow lines, agent pulses).
  - **Soft Lavender / Iris:** `#C0ADFF` / `#6366F1` (AI pill accents, highlights).
  - **Verified Emerald:** `#10B981` / `#D1FAE5` (live CRM shield & 0 collision indicators).
  - **Warm Champagne / Gold:** `#D9B968` / `#F5EACC` (premium tier highlights).

---

## 3. Page Structure & Component Hierarchy

### 3.1 Top Announcement Bar
- **Copy:** `v2.4 Release · Twenty CRM & n8n Cloud Integration Live. Compile verified outbound flows in seconds.`
- **Design:** Subtly textured dark header with an uppercase pill badge (`v2.4 Release`) and jump anchor to the interactive pipeline.

### 3.2 Floating Sticky Navbar
- **Left:** Prospect PAL Logo (geometric node glyph + crisp typography) + `v2.4` version badge.
- **Center Links:** `Platform`, `5-Pillar Pipeline`, `Agent Swarm`, `Bento Features`, `Live Playground`, `Pricing`, `Docs`.
- **Right:** `Log in` text link + High-contrast Onyx pill button `Deploy Outbound Agent`.

### 3.3 Hero Section
- **Badge:** `AI-Powered GTM & Outbound Agent` with pulsing status beacon.
- **Headline (H1):** `Know your pipeline. Run outbound with AI.`
- **Subcopy:** `Turn any ICP brief into a 5-pillar, zero-collision outbound engine in 3 seconds. Verified leads, deep company research, personalized PAS copy, and live CRM shields.`
- **CTAs:**
  - Primary: `Deploy Outbound Agent` (Onyx pill with arrow icon).
  - Secondary: `Explore 9-Node Pipeline` (1px bordered white pill with playback icon).
- **Trust Ticker:** `Trusted by modern revenue teams, founders, and growth agencies` + SVG logos: Twenty CRM, HubSpot, n8n, Apollo.io, Smartlead, Clay, AWS Bedrock, OpenAI.
- **Central Interactive UI Canvas:**
  - Browser mockup showing Prospect PAL's live execution canvas with pulsing nodes and active telemetry:
    - `+38.4%` Positive Reply Rate
    - `0` CRM Collisions
    - `94.8%` Email Deliverability
  - 3 floating contextual status cards mimicking Makro's widget system:
    1. *CRM Dedupe Shield: 100% active deals protected, 0 double-touches.*
    2. *Waterfall Reveal: 275M+ verified work emails via tiered fallback.*
    3. *AI PAS Copywriter: 3-sentence zero-slop email draft generated.*

### 3.4 Manifesto Reveal Section
- **Large Typographic Statement:** `Prospect PAL is an autonomous outbound engineering platform for founders and modern revenue teams that replaces brittle 8-tool stacks with self-healing, zero-collision GTM agent pipelines.`
- **Interactive 4-Pill Stage Selector:**
  - `1. Ingest & Cron` — Automated lead discovery
  - `2. CRM Dedupe Shield` — Zero-collision guarantee
  - `3. Deep PAS Research` — Hyper-personalized 3-sentence copy
  - `4. Sequence Enrollment` — Mailbox safety & smart send

### 3.5 4-Stage Deep-Dive Spotlight Cards
Four Makro-style split cards showcasing the core engine:
1. **Real-Time CRM Dedupe Shield:**
   - *Headline:* `See where your pipeline is heading before an SDR burns a deal.`
   - *Capabilities:* Real-time checks against Twenty CRM, HubSpot, and Salesforce. Automatic exclusion of active opportunities and opt-outs.
2. **Waterfall Reveal & Tiered Verification:**
   - *Headline:* `Surfaces verified work emails without data waste.`
   - *Capabilities:* Apollo → Clay → Prospeo → Dropcontact fallback cascade with live SMTP bounce checks.
3. **Problem-Agitate-Solution AI Copywriter:**
   - *Headline:* `No more generic AI spam. Real research, 3 sentences.`
   - *Capabilities:* Company filings, open job postings, and tech stack telemetry converted into bespoke PAS messaging.
4. **Self-Healing Execution & Error Triage:**
   - *Headline:* `Execution diagnostics that never fail silently.`
   - *Capabilities:* Real-time runData telemetry, node failure detection, and automatic repair scripts.

### 3.6 Bento Grid ("Tidy Build, Unlimited Power")
High-density grid of 6 tactile cards:
1. **Autonomous Agent Swarm** (GTM Architect, Dedupe Shield, PAS Copywriter, Execution Analyst).
2. **Two-Way CRM Synchronization** (Twenty CRM, HubSpot, Salesforce).
3. **Live Telemetry & Diagnostics** (99.9% uptime, auto-retry circuit breakers).
4. **Waterfall Enrichment Cascade** (275M+ verified records).
5. **Zero-Knowledge BYOK Security** (Keys remain in private customer environment).
6. **3-Second Prompt-to-Workflow Compilation** (Natural language to n8n/Make JSON).

### 3.7 Interactive Live Agent Simulator (Playground)
- Users can test Prospect PAL's multi-agent workflow generator right on the landing page!
- Select pre-built ICP briefs (`B2B DevOps Tools`, `Fintech Series A`, `Healthcare AI`) or type their own custom ICP.
- Displays live step-by-step agent planning:
  - Step 1: ICP Parsing & Persona definition.
  - Step 2: CRM Dedupe rules generated.
  - Step 3: Waterfall enrichment providers configured.
  - Step 4: 3-sentence PAS email draft rendered.
  - Step 5: Production n8n JSON output ready for 1-click copy or download.

### 3.8 Customer Spotlight & Verified Metrics
- **Atlas Labs:** Replaced $90k/yr SDR overhead; +$180k ARR added in 45 days.
- **Northway Studio:** 0 lead collisions across 45,000 enrolled prospects.
- **Brightline Tech:** Reply rate jumped from 1.8% to 8.4%.
- **Kinetic Agency:** Scaling 12 client campaigns from a single self-hosted instance.

### 3.9 Interactive Pricing Matrix
- **Billing Switch:** Monthly / Annual (20% discount badge).
- **Tiers:**
  - **DIY Skill Package:** `$19.99` one-time (agent directory, SKILL.md specs, prompt harnesses, n8n templates).
  - **Team Edition (Most Popular):** `$79/mo` billed annually or `$99/mo` monthly (unlimited campaigns, live Twenty CRM sync, execution triage).
  - **Scale & Agency:** `$199/mo` (unlimited workspaces, multi-tenant client portals, custom MCP connectors).
  - **Enterprise Tier:** Custom VPC / private cloud deployment banner.

### 3.10 Interactive FAQ Accordion
- Categorized FAQ tabs (`General`, `Engine & AI`, `CRM & Integrations`, `Security & BYOK`).
- Accessible, keyboard-navigable expand/collapse questions.

### 3.11 High-Impact Final CTA & Architectural Footer
- H1: `Ready to take control of your pipeline?`
- CTA buttons + live status beacon (`All systems operational · v2.4 Release`).
- Clean multi-column footer with product navigation, legal links, and system uptime.

---

## 4. Accessibility & Responsive Verification
- **Contrast:** Minimum 4.5:1 text-to-background contrast (WCAG 2.2 AA).
- **Keyboard Navigation:** Tab-focusable buttons, accordion triggers, and interactive playground pills with visible focus rings.
- **Mobile Responsiveness:** Fluid breakpoints (375px mobile, 768px tablet, 1024px desktop, 1440px wide).

