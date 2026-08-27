# Sitemap — Prospect PAL

**Artifact:** 05-sitemap  
**Version:** v1.0.0  
**Status:** approved  
**Framework:** DDC / ROSTR

---

## Marketing Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Landing | Hero + AIDA + pricing |
| `/home` | Landing (alias) | Redirect to `/` |
| `/pricing` | Pricing | Plan comparison |
| `/how-it-works` | Process | DDC 9-stage explainer |

---

## Auth Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/login` | Login | Email + password |
| `/signup` | Signup | New user registration |
| `/auth/callback` | OAuth callback | Supabase auth redirect |
| `/auth/forgot-password` | Reset | Password recovery |

---

## Dashboard Routes (Protected)

| Route | Page | Purpose |
|-------|------|---------|
| `/dashboard` | Home | Project list + quick stats |
| `/dashboard/[projectId]` | Project detail | Campaign config + workflow canvas |
| `/dashboard/chat` | Engineer chat | PAE conversation interface |
| `/dashboard/wizard` | Campaign wizard | 10-gate intake flow |
| `/dashboard/outputs` | Output viewer | Workflow JSON + prompts |
| `/dashboard/analyst` | Analyst view | Campaign performance |
| `/dashboard/builder` | Builder canvas | Node configuration |
| `/dashboard/settings` | Settings | Account + billing |

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/session` | GET | Current user session |
| `/api/projects` | GET/POST | List/create projects |
| `/api/projects/[id]` | GET/PUT/DELETE | Project CRUD |
| `/api/projects/[id]/compile` | POST | Generate workflow |
| `/api/projects/[id]/chat` | POST | PAE conversation |
| `/api/stripe/checkout` | POST | Create checkout session |
| `/api/stripe/portal` | POST | Customer portal redirect |
| `/api/stripe/webhook` | POST | Stripe webhook handler |

---

## Static Assets

| Path | Type | Purpose |
|------|------|---------|
| `/og.png` | Image | Open Graph default |
| `/favicon.ico` | Icon | Browser tab |
| `/apple-touch-icon.png` | Icon | iOS bookmark |
| `/logo.svg` | Image | Navbar logo |

---

## URL Conventions

- **Kebab-case** for all routes: `/how-it-works`, not `/howItWorks`
- **No trailing slashes**: `/dashboard`, not `/dashboard/`
- **Query params** for filters: `/dashboard?status=active`
- **Fragments** for sections: `/home#pricing`

---

## Protected Route Middleware

All `/dashboard/*` routes require:
1. Valid Supabase session
2. Active subscription (Pro plan) OR
3. One-time DIY purchase for `/dashboard/outputs` only

Redirect unauthorized users to `/login?redirect=/intended/path`.

---

## SEO Metadata

| Route | Title | Description |
|-------|-------|-------------|
| `/` | Prospect PAL — Build Custom n8n Prospecting Workflows | Automate your GTM engine with AI-powered prospect research and personalized outreach. |
| `/dashboard` | Dashboard — Prospect PAL | Manage your campaigns and workflows. |
| `/login` | Login — Prospect PAL | Sign in to your account. |

---

*Sitemap v1.0.0 — supersede with ADR.*
