# Website Edits - User Notes (Reformatted)

**Date:** 2026-08-25 5:12pm  
**Site:** https://prospect-pal-two.vercel.app

---

## UX Changes

### Intake Wizard
- More conversational, step-by-step (TypeForm style)
- Wider layout
- Each Q&A saved to database with versioning via webhook
- Launch PAL Agent button currently broken - needs fix

### Workflow Builder vs Intake Wizard
- **Intake Wizard:** Conversational form to CREATE campaigns
- **Workflow Builder/Editor:** n8n-style canvas to EDIT existing campaigns
- Canvas should be white, replicate n8n design style

### Outputs & Deploy → Campaigns
- Rename section to "Campaigns"
- Card grid layout with search
- Click to see storage/outputs
- Show empty state even with no outputs

---

## Design

- Remove green branding entirely
- Need complete design system for Prospect Pal
- Use provided navy/cobalt/champagne palette

---

## Features to Remove

- Script Studio (delete entirely)

---

## Integrations

- Search Composio.io for available integrations
- Allow custom entry with smart documentation finding
- Show most common integrations for quick selection

---

## New Wizard Flow (10 Steps)

1. **Company Name**
2. **Campaign Title**
3. **Campaign ICP** - research target companies
4. **Campaign User Persona** - enrich target contacts
5. **Company Product** - what we're selling
6. **Company Background** - company overview
7. **Target Signals** - buyer indicators (research)
8. **Generate** - custom email script + company/product/campaign overview

### Tools Selection
9. **Tools**
   - Data enrichment (generate leads)
   - CRM (update contacts)
   - Outbound outreach (create sequences)

10. **Automation Platform**
    - n8n (primary)
    - Make.com
    - Custom MCPs

---

## Process Flow

1. System takes user inputs → webhook to n8n
2. Configure tools (create MCP scripts and integrations)
3. Company ingestion (CRM, spreadsheet, direct search webhook)
4. Contact search (persona, titles, filters, technology)
5. CRM push (add new contacts)
6. Outreach tool (build sequences)
7. Write copy (technical messaging, emails, DMs)
8. Generate workflow (n8n JSON from data inputs)

---

## Dashboard Structure

- **New Campaigns** - Intake Wizard
- **Campaign Workspace** - Edit, outputs, etc.

---

## Agents

| Agent | Purpose |
|-------|---------|
| Configure Tools | Create MCP scripts and integrations |
| Write Copy | Technical messaging, emails, DMs |
| Generate Workflow | Build n8n JSON from inputs |
| Edit Workflow | Apply user changes |

### Agent Requirements

- **Configure Tools:** Needs tool list and documentation
- **Write Copy:** Needs company value prop and user persona
- **Generate Workflow:** Needs user data + workflow template

---

## Outputs

- n8n JSON
- n8n build prompts (inputs + template combined)
- n8n engineer skill (self-build with keys)
- n8n execution analyst skill (fix failed workflows)

---

## Multi-Site Architecture

### Marketing Site (Public)
- Process info, outputs, packages
- Subscribe to dashboard
- Download template + build script + skills (package)
- Contact for custom development (book paid audit call)

### Dashboard (Authenticated)
- Campaign creation and management
- Workflow editing
- Outputs and deployment
