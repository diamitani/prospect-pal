# Complete Sitemap Specification — Prospect PAL v2.0
**Document Type:** Sitemap & Route Contract  
**Project:** Prospect PAL Full-Stack GTM Automation Engine  
**Version:** v2.0.0-PROD  
**Status:** Approved  

---

## 1. Route Table

| Path | Description & Purpose | Auth Requirement | Robots / SEO Index | Layout & Components |
| :--- | :--- | :--- | :--- | :--- |
| **`/`** | Pure White Premium Hero, Interactive Canvas Demo, Social Proof, Live Outbound ROI Calculator | Public | `index, follow` | Marketing Landing Layout |
| **`/solutions/[segment]`** | Role-specific solutions (Founders, RevOps, Agencies) | Public | `index, follow` | Solutions Detail Template |
| **`/pricing`** | 3-Tier Pricing (Free Trial, $99/mo Pro BYOK, $999 Enterprise) + FAQ | Public | `index, follow` | Pricing Matrix Layout |
| **`/academy`** | Sales 101, Cold Outreach Mastery, Objection Handling Guides | Public | `index, follow` | Academy Resource Template |
| **`/login`** | Supabase Auth Email + Google/GitHub OAuth | Public (redirect if session) | `noindex, follow` | Centered Glass Card |
| **`/signup`** | Account creation & workspace onboarding | Public (redirect if session) | `noindex, follow` | Multi-step Onboarding Modal |
| **`/app`** | Workspace redirector | Authenticated | `noindex, nofollow` | App Shell |
| **`/app/[workspace]`** | Command Center & Dashboard Overview | Authenticated (Member) | `noindex, nofollow` | Dashboard Overview Layout |
| **`/app/[workspace]/builder`** | 5-Pillar Outbound Builder & Live Interactive Canvas | Authenticated (Member) | `noindex, nofollow` | Split Chat / Canvas Studio |
| **`/app/[workspace]/campaigns`** | Campaign Repository & Execution Status | Authenticated (Member) | `noindex, nofollow` | Table & Card Grid View |
| **`/app/[workspace]/scripts`** | PAS Copywriting Lab & Variant Generator | Authenticated (Member) | `noindex, nofollow` | Multi-Tab Script Editor |
| **`/app/[workspace]/signals`** | Live Hiring & Tech Stack Intent Scanner | Authenticated (Member) | `noindex, nofollow` | Search & Filter Matrix |
| **`/app/[workspace]/analyst`** | n8n Execution Run Telemetry & Error Triage | Authenticated (Member) | `noindex, nofollow` | Log Viewer & Diagnostic Tree |
| **`/app/[workspace]/settings`** | Workspace, BYOK Keys, Members, Billing | Authenticated (Admin/Owner)| `noindex, nofollow` | Settings Navigation Shell |
| **`/checkout`** | Stripe Hosted Checkout Session Gateway | Authenticated | `noindex, nofollow` | Stripe Checkout Redirect |
| **`/checkout/success`** | Verification of webhook status & plan unlock | Authenticated | `noindex, nofollow` | Success Confetti & Onboard CTA |
| **`/api/chat`** | Streaming Chat API with Vercel AI SDK Core | Authenticated | `noindex, nofollow` | Edge Stream Route Handler |
| **`/api/compile`** | 5-Pillar n8n JSON Graph Compiler | Authenticated | `noindex, nofollow` | REST POST Route Handler |
| **`/api/webhooks/stripe`** | Stripe Webhook Listener & Signature Verifier | Public (Signed) | `noindex, nofollow` | Webhook Consumer Route |
