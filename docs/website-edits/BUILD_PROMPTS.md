# Prospect Pal Build Prompts

Individual prompts for Claude Code or Gemini to execute each phase.

---

## PROMPT 1: Remove Script Studio

```
Remove the Script Studio feature entirely from Prospect Pal.

Files to modify:
1. src/app/dashboard/page.tsx - Remove ScriptsStudioView import and render block
2. src/components/Sidebar.tsx - Remove { id: "scripts", label: "Scripts Studio", icon: "✍️" } from NAV array
3. src/components/TopBar.tsx - Remove scripts: entry from VIEW_META
4. src/components/views/DashboardHome.tsx - Remove quick action card with id: "scripts"
5. src/types/app.ts - Remove "scripts" from View type union
6. src/app/(marketing)/home/page.tsx - Remove "A/B Testing PAS Scripts Studio" from features
7. src/components/CheckoutModal.tsx - Remove script studio from features list

File to delete:
- src/components/views/ScriptsStudioView.tsx

After changes, verify the app compiles and the sidebar no longer shows Scripts Studio.
```

---

## PROMPT 2: Fix "Launch PAL Agent" Button

```
Fix the broken "Launch PAL Agent" button in the Intake Wizard.

Problem: In src/components/views/WizardView.tsx, the handleSubmit function only passes name and description to /api/projects, ignoring all wizard state (leadSource, enrichment, crm, sequencer, approvalGate).

Fix required:
1. Update handleSubmit to pass full wizard state including icpConfig and toolStack
2. Update src/app/api/projects/route.ts to accept and store the expanded payload
3. Update src/lib/dynamodb.ts createProject function if needed

After fix, verify that completing the wizard creates a project with all configuration data stored.
```

---

## PROMPT 3: Adopt New Design System

```
Replace the green branding with the navy/cobalt/champagne design system.

New color tokens:
- Primary action: #2A41C9 (cobalt-600) replaces #1c5a1c
- Accent: #3A56E4 (cobalt-500) replaces #16a34a  
- Light backgrounds: #EEF2FF (cobalt-50) replaces #dcfce7
- Premium accent: #C79E3E (champagne-400)
- Deep surfaces: #101B2D (ink-800)

Files to update (14 total):
1. tailwind.config.ts - Replace brand color palette with cobalt scale
2. src/app/globals.css - Update CSS variables
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

Find/replace patterns:
- #16a34a → #2A41C9
- #22c55e → #3A56E4
- #4ade80 → #5B77F5
- #166534 → #2033A2
- #dcfce7 → #EEF2FF
- brand-700 → cobalt-700 (in class names)
```

---

## PROMPT 4: TypeForm-Style Intake Wizard

```
Redesign the Intake Wizard as a TypeForm-style conversational flow.

Requirements:
1. Full viewport width (remove max-w-2xl constraint)
2. One question per screen with smooth animated transitions
3. Each Q&A saved to database with versioning via webhook
4. 10 new steps:
   - Company Name
   - Campaign Title
   - Campaign ICP (research target companies)
   - Campaign User Persona (enrich target contacts)
   - Company Product (what we're selling)
   - Company Background (company overview)
   - Target Signals (buyer indicators)
   - Generate (AI creates email script + overview)
   - Tools Selection (data enrichment, CRM, outreach)
   - Automation Platform (n8n, make.com, custom MCPs)

Implementation:
1. Install framer-motion for transitions
2. Create new wizard state interface with all 10 fields
3. Create components: ConversationalWizard.tsx, WizardQuestion.tsx, WizardProgress.tsx
4. Create API endpoint: POST /api/wizard/response for saving each response
5. Add DynamoDB operations for WizardResponses table
6. For integrations, show common presets plus custom entry option
```

---

## PROMPT 5: Rename Outputs to Campaigns

```
Rename "Outputs & Deploy" section to "Campaigns" with a card grid layout.

Changes:
1. src/components/Sidebar.tsx - Update nav item label to "Campaigns" and icon to "◫"
2. src/components/TopBar.tsx - Update VIEW_META title and crumb
3. Redesign src/components/views/OutputsView.tsx:
   - Change from 6 tabs to card grid layout
   - Add search bar at top
   - Each campaign card shows: name, status, date, quick actions
   - Click card to see detail view (JSON, guides, outputs)
   - Show empty state with helpful message when no campaigns
   - Keep download/deploy functionality in campaign detail

Fetch campaigns from /api/projects and display as cards.
```

---

## PROMPT 6: n8n-Style Campaign Editor Canvas

```
Create an n8n-style white canvas editor for editing existing campaigns.

Important distinction:
- Intake Wizard = CREATE new campaigns (conversational)
- Campaign Editor = EDIT existing campaigns (canvas)

Implementation:
1. Install React Flow: npm install reactflow
2. Create component structure:
   - src/components/campaign-editor/CampaignEditorView.tsx
   - src/components/campaign-editor/EditorCanvas.tsx
   - src/components/campaign-editor/NodePalette.tsx
   - src/components/campaign-editor/PropertyPanel.tsx
   - src/components/campaign-editor/EditorToolbar.tsx

3. Node types: Trigger, CRM, Enrichment, AI, Logic, Sequencer

4. Canvas features:
   - White background (n8n style)
   - Drag nodes from palette
   - Connect with bezier curves
   - Click node to edit properties
   - Save changes to DynamoDB
   - Generate updated n8n JSON

5. Integrate with existing campaign data
```

---

## PROMPT 7: Multi-Site Architecture

```
Separate Marketing Site from Dashboard.

New route structure:

Marketing (public):
- src/app/(marketing)/home/page.tsx - Landing
- src/app/(marketing)/pricing/page.tsx - Pricing
- src/app/(marketing)/templates/page.tsx - Download packages
- src/app/(marketing)/contact/page.tsx - Contact/book call
- src/app/(marketing)/layout.tsx - No sidebar

Dashboard (authenticated):
- src/app/(dashboard)/layout.tsx - With sidebar
- src/app/(dashboard)/campaigns/page.tsx
- src/app/(dashboard)/wizard/page.tsx
- src/app/(dashboard)/settings/page.tsx

Marketing content:
- Info about process, outputs, packages
- Subscribe to dashboard
- Download template + build script + skills
- Contact for custom development

Add middleware for route protection.
Add floating chatbot component for in-app help.
```

---

## Execution Order

1. Phase 1A: Remove Script Studio
2. Phase 1B: Fix Launch PAL Agent
3. Phase 2: Design System
4. Phase 4: Campaigns View
5. Phase 3: TypeForm Wizard
6. Phase 5: Campaign Editor
7. Phase 7: Multi-Site
