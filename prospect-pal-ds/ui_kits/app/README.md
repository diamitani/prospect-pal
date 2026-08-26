# UI kit — Prospect PAL workspace

A click-through recreation of the authenticated product, rebranded onto the navy / cobalt / champagne system.

**Screens** — `index.html` boots the shell; nav switches views.
- `DashboardScreen.jsx` — greeting, stat row, workspace cards, the 9-node architecture card
- `BuilderScreen.jsx` — split pane: chat/form intake on paper, node canvas on navy
- `WizardScreen.jsx` — PAL intake gate, one question per step, hard-gate flagging
- `OutputsScreen.jsx` — ack JSON, requires-connection list, deliverables
- `SignalsScreen.jsx` — filter bar plus detected-signal lead grid with copy-email actions
- `SettingsScreen.jsx` — OAuth tool connections and the n8n instance form
- `AppShell.jsx` — navy sidebar + paper top bar; `data.jsx` holds the 9-node table and nav

**Interactions that work:** nav, chat send (canned agent reply), compile → outputs, node selection on the canvas, wizard steps, deploy modal.

**Source of truth:** `diamitani/prospect-pal` → `src/components/Sidebar.tsx`, `TopBar.tsx`, `views/DashboardHome.tsx`, `views/BuilderView.tsx`, `views/WizardView.tsx`, `views/OutputsView.tsx`, `views/SignalsLeadFinderView.tsx`, `views/SettingsView.tsx`. Layout metrics (236px sidebar, 52px top bar, 440px intake pane) are carried over verbatim; colour, type and iconography are the new brand.
