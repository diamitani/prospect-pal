repo: diamitani/prospect-pal
branch: main
path: src

## Last sync
date: 2026-08-25T22:34:36Z

### Updated in this project
- Rebranded off the green palette to Prospect Navy / Signal Cobalt / Champagne on warm paper.
- Replaced the emoji icon set with Lucide 0.544 behind a single `Icon` primitive.
- Rebuilt the landing page and workspace shell as UI kits on the new tokens.
- Kept the repo's layout metrics verbatim (236px sidebar, 52px top bar, 440px intake pane).

## Screen map
| Screen | Built from |
|---|---|
| ui_kits/marketing/index.html | src/app/(marketing)/home/page.tsx, src/components/CheckoutModal.tsx |
| ui_kits/app/AppShell.jsx | src/components/Sidebar.tsx, src/components/TopBar.tsx |
| ui_kits/app/DashboardScreen.jsx | src/components/views/DashboardHome.tsx |
| ui_kits/app/BuilderScreen.jsx | src/components/views/BuilderView.tsx, src/components/N8nCanvas.tsx |
| ui_kits/app/WizardScreen.jsx | src/components/views/WizardView.tsx, PAE-Builder-PRD-and-Specs.md §8 |
| ui_kits/app/SignalsScreen.jsx | src/components/views/SignalsLeadFinderView.tsx |
| ui_kits/app/SettingsScreen.jsx | src/components/views/SettingsView.tsx |
| ui_kits/app/OutputsScreen.jsx | src/components/views/OutputsView.tsx, PAE-Builder-PRD-and-Specs.md §10 |
| tokens/*.css | src/app/globals.css, tailwind.config.ts (structure only; values rebranded) |
