# Brand Guidelines & Design Specifications — Pure White Premium
**Document Type:** Brand Guidelines, Design System & Taste Brief  
**Project:** Prospect PAL Full-Stack GTM Automation Engine  
**Version:** v2.0.0-PROD  
**Status:** Approved  
**Governing Skill:** Taste Skill `design-taste-frontend` v2  

---

## 1. Brand Identity & Visual Philosophy

Prospect PAL embodies **Pure White Premium** SaaS aesthetics—inspired by modern high-end developer tools, Modelence, AgentX, and Linear. It rejects generic purple AI gradients and clunky cards in favor of crisp white surfaces, subtle 1px translucent borders, refined micro-shadows, and high-contrast typography.

### 1.1 Core Design Pillars
1. **Airy & Crisp:** Generous whitespace (8pt grid system) that lets complex data graphs breathe.
2. **Tactile Depth:** Subtle layered cards with light backdrop-blur (`backdrop-blur-md`), gentle borders (`border-neutral-200/80`), and glowing micro-indicators.
3. **Motion with Intent:** 60fps spring transitions (`framer-motion`) that provide tactile feedback on clicks, graph dragging, and canvas node transitions.
4. **Anti-Slop Guarantee:** Clean, purposeful layouts with bespoke custom SVG icons and typography.

---

## 2. Color Palette & Design Tokens

### 2.1 Color Tokens

```css
:root {
  /* Backgrounds */
  --bg-app: #FAFAFA;
  --bg-surface: #FFFFFF;
  --bg-surface-subtle: #F4F4F5;
  --bg-surface-elevated: #FFFFFF;

  /* Borders & Dividers */
  --border-subtle: rgba(228, 228, 231, 0.8);
  --border-strong: #D4D4D8;
  --border-focus: #18181B;

  /* Typography */
  --text-primary: #09090B;
  --text-secondary: #71717A;
  --text-muted: #A1A1AA;
  --text-inverse: #FFFFFF;

  /* Accent & Brand Colors */
  --brand-primary: #18181B;      /* Deep Onyx Black */
  --brand-accent: #2563EB;       /* Electric Cobalt Blue */
  --brand-accent-subtle: #EFF6FF;
  --status-success: #16A34A;     /* Emerald Green */
  --status-warning: #D97706;     /* Amber */
  --status-error: #DC2626;       /* Crimson */

  /* Elevation Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
}
```

---

## 3. Typography System
- **Primary Typeface:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, sans-serif.
- **Monospace Code Typeface:** `JetBrains Mono`, `Fira Code`, `ui-monospace`, monospace.

| Scale | Size / Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- |
| **Display 1** | 48px / 1.1 | Bold (700) | Marketing Hero Headlines |
| **Heading 1** | 32px / 1.2 | SemiBold (600) | Dashboard Section Headers |
| **Heading 2** | 24px / 1.3 | SemiBold (600) | Modal & Canvas Node Titles |
| **Heading 3** | 18px / 1.4 | Medium (500) | Card Headers & Tab Labels |
| **Body Base** | 14px / 1.5 | Regular (400) | Primary Paragraphs & Chat Text |
| **Body Small**| 12px / 1.5 | Regular (400) | Tooltips, Node Badges, Timestamps |
| **Code Mono** | 13px / 1.4 | Regular (400) | JSON Payload Previews & Key Vault |

---

## 4. UI Components & Canvas Specifications
- **Interactive 9-Node Canvas:** Each node features a sleek 1px border, status badge (Ready, Ingesting, Deduplicating, Enriching, Enrolled), and smooth spline connectors.
- **Dual-Pane Chat & Studio:** Left pane for conversational AI refinement, right pane for live graph inspection and instant code export.
- **Button System:**
  - *Primary:* Solid Onyx (`bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm active:scale-98 transition-all`).
  - *Secondary:* White Surface (`bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50`).
  - *Accent:* Electric Cobalt (`bg-blue-600 text-white hover:bg-blue-700`).
