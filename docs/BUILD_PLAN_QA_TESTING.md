# Subagent Build Plan: QA & Execution Analyst Loop

**Role**: Lead Execution QA Analyst & Diagnostics Engineer  
**Objective**: Test every user journey, API route, and failure scenario to achieve a 9/10+ completion standard across all functional areas.

---

## 1. Automated Test Matrix

| Component / Journey | Test Verification Command / Endpoint | Expected Output | Status |
| :--- | :--- | :--- | :--- |
| **TypeScript Compilation** | `npx tsc --noEmit` | Exit code 0, 0 type errors | ✅ PASS |
| **Next.js Production Build** | `npm run build` | 26 static & dynamic routes compiled | ✅ PASS |
| **GTM Compiler API** | `POST /api/compile` | 9-Node n8n JSON + 5 Deliverables | ✅ PASS |
| **PAS Scripts Engine API** | `POST /api/scripts/generate` | 4 Themes + 8 A/B Email Variants | ✅ PASS |
| **Signal Leads Search API** | `POST /api/signals/search` | Filtered list of n8n tech leads | ✅ PASS |
| **n8n Deploy Bridge API** | `POST /api/n8n/deploy` | Structured SYNC_READY or DEPLOYED status | ✅ PASS |
| **Composio Status API** | `GET /api/composio/status` | Connection array & OAuth readiness | ✅ PASS |

## 2. Manual User Flow Checkpoints
1. **Landing Page Experience**: Pure white premium UI, sticky nav, live 5-pillar node canvas, pricing cards ($19.99 DIY, $99/mo Pro BYOK, $999-$9,999+ Custom).
2. **Checkout Modal Flow**: Instant plan switching, card simulation, and redirect to workspace.
3. **Intake Wizard**: Multi-step guidance capturing product, ICP, tool selection, and Slack approval toggle.
4. **Interactive Builder**: Dual mode (AI chat + visual configurator) rendering real-time nodes on canvas.
5. **Outputs Hub**: 1-click copy for `.n8n.json`, `BUILD_PROMPT.md`, `.env.template`, `PRD.md`, and deploy to n8n instance.
6. **Scripts Studio**: Multi-theme A/B test viewer with 1-click clipboard copy.
7. **Tech Signals Explorer**: Real-time filtering of companies using n8n and hiring GTM engineers.
