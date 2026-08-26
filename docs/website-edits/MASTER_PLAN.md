# Prospect Pal Website Edit Plan

**Date:** 2026-08-25  
**Live Site:** https://prospect-pal-two.vercel.app  
**Source:** User notes + codebase analysis

---

## Context

Prospect Pal is an AI-powered outbound automation platform that compiles plain-English ICP descriptions into production n8n workflows. This plan addresses significant UX improvements: a conversational wizard, n8n-style campaign editor, design system overhaul (remove green branding), and multi-site architecture.

**Key Discovery:** A complete design system exists (navy/cobalt/champagne palette) ready to replace the current green branding.

---

## Phase Overview

| Phase | Description | Complexity | Est. Time |
|-------|-------------|------------|-----------|
| 1A | Remove Script Studio | Low | 2 hours |
| 1B | Fix "Launch PAL Agent" bug | Low | 1 hour |
| 2 | Design System Adoption | Medium | 2 days |
| 3 | TypeForm-Style Intake Wizard | High | 4-5 days |
| 4 | Campaigns View (Rename Outputs) | Medium | 2 days |
| 5 | n8n-Style Campaign Editor Canvas | High | 5-7 days |
| 6 | Integrations Expansion | Medium | 2-3 days |
| 7 | Multi-Site Architecture | Medium | 3-4 days |

---

## Phase 1A: Remove Script Studio

**Files to modify:**
- `src/app/dashboard/page.tsx` - Remove import + render
- `src/components/Sidebar.tsx` - Remove nav item
- `src/components/TopBar.tsx` - Remove from VIEW_META
- `src/components/views/DashboardHome.tsx` - Remove quick action card
- `src/types/app.ts` - Remove from View union
- `src/app/(marketing)/home/page.tsx` - Remove feature mention
- `src/components/CheckoutModal.tsx` - Remove feature mention

**File to delete:**
- `src/components/views/ScriptsStudioView.tsx`

---

## Phase 1B: Fix "Launch PAL Agent" Button

**Problem:** `WizardView.tsx:81-99` - handleSubmit only passes name and description, ignoring all wizard data (leadSource, enrichment, crm, sequencer, approvalGate).

**Fix:** Pass full wizard state to `/api/projects` and update the API route.

---

## Phase 2: Design System Adoption

Replace green branding with navy/cobalt/champagne palette.

**Color Mapping:**
- Green primary `#1c5a1c` → Cobalt `#2A41C9`
- Green accent `#16a34a` → Cobalt `#3A56E4`
- Green light `#dcfce7` → Cobalt tint `#EEF2FF`

**14 files with hardcoded green:**
1. tailwind.config.ts
2. src/app/globals.css
3. src/components/Sidebar.tsx
4. src/components/TopBar.tsx
5. src/components/views/DashboardHome.tsx
6. src/components/views/BuilderView.tsx
7. src/components/views/WizardView.tsx
8. src/components/views/OutputsView.tsx
9. src/components/views/SignalsLeadFinderView.tsx
10. src/components/views/AnalystView.tsx
11. src/components/views/SettingsView.tsx
12. src/components/views/AcademyView.tsx
13. src/app/(marketing)/home/page.tsx
14. src/components/CheckoutModal.tsx

---

## Phase 3: TypeForm-Style Intake Wizard

**New 10-step flow:**
1. Company Name
2. Campaign Title
3. Campaign ICP (research target companies)
4. Campaign User Persona (enrich target contacts)
5. Company Product (what we're selling)
6. Company Background (company overview)
7. Target Signals (buyer indicators)
8. Generate (AI creates email script + overview)
9. Tools Selection (data enrichment, CRM, outreach)
10. Automation Platform (n8n, make.com, custom MCPs)

**Requirements:**
- Full viewport width (wider layout)
- One question per screen, animated transitions
- Each Q&A saved to database via webhook with versioning
- Composio-style search for integrations

---

## Phase 4: Campaigns View

**Changes:**
- Rename "Outputs & Deploy" → "Campaigns"
- Card grid layout with search
- Empty state when no campaigns
- Click card for detail view (outputs, edit option)

---

## Phase 5: Campaign Editor Canvas

**Technology:** React Flow for interactive node editing

**Distinction:**
- Intake Wizard = CREATE new campaigns (conversational)
- Campaign Editor = EDIT existing campaigns (canvas)

**Features:**
- White background (n8n style)
- Draggable, connectable nodes
- Node palette sidebar
- Property panel for editing
- Save changes to database

---

## Phase 6: Integrations Expansion

- Search Composio.dev for integrations
- Allow custom entry with smart doc finding
- Show common presets for quick selection

**Categories:**
- Data Enrichment: Apollo, Clay, Clearbit, Hunter
- CRM: HubSpot, Salesforce, Attio, Pipedrive
- Outreach: Smartlead, Instantly, Lemlist, Amplemarket
- Automation: n8n, Make.com, custom MCPs

---

## Phase 7: Multi-Site Architecture

**Structure:**
- Marketing Site (public): Info, pricing, templates, contact
- Dashboard (authenticated): Campaigns, wizard, editor, settings

---

## Agents (Backend)

1. Configure Tools Agent - Create MCP scripts
2. Write Copy Agent - Emails, DMs
3. Generate Workflow Agent - Compile n8n JSON
4. Edit Workflow Agent - User modifications

---

## Outputs

- n8n JSON
- n8n build prompts
- n8n engineer skill
- n8n execution analyst skill
