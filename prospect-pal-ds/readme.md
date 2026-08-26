# Prospect PAL — Design System

**Prospect PAL** is a standalone agent-SaaS company. It sells one thing: a conversational builder that turns a short intake into a **runnable GTM automation** — a nine-node n8n workflow, compiled against the customer's own tool stack, deployed onto the customer's own n8n instance. Startups, solopreneurs and small sales teams get an outbound engine without hiring an automation engineer; nothing runs on Prospect PAL's infrastructure after the compile.

The product surface is two things:

| Surface | What it is | Source |
|---|---|---|
| **Marketing site** | Single-page pitch: hero + live node canvas, resolved bindings, deliverables, tech-signal leads, three plans | `src/app/(marketing)/home/page.tsx` |
| **Workspace app** | Authenticated shell: dashboard, workflow builder (chat/form + navy canvas), intake wizard, outputs & deploy, tech signals, integrations & keys | `src/components/Sidebar.tsx`, `TopBar.tsx`, `src/components/views/*` |

Underneath both sits the **PAL pipeline**: intake gate → intent compiler → NPAO binding → instruction pack → n8n Engineer compile → quality evaluator → ack JSON + `workflow.n8n.json`. The canonical **nine-node graph** (Intake & Cron → Data Normalizer → CRM Dedupe Shield → Data Tool Adapter → AI Research & PAS Copy → Approval Switch → CRM Contact Creation → Sequence Enrollment → Review Alert) is the product's spine and shows up in almost every screen; treat it as brand furniture, not decoration.

## Sources this system was built from

- **GitHub:** https://github.com/diamitani/prospect-pal — read at branch `main`. Read directly: `src/app/globals.css`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/components/Sidebar.tsx`, `src/components/TopBar.tsx`, `src/components/views/DashboardHome.tsx`, `src/components/views/BuilderView.tsx`, `src/app/(marketing)/home/page.tsx`. **Explore this repo further** (`src/lib/pal-pipeline.ts`, `workflow-generator.ts`, the remaining `views/*`, `docs/MASTER_ARCHITECTURE.md`) before doing deeper product design — it holds the real data contracts.
- **Attached codebase folder:** `Prospect Automation Workflow/` — `PAE-Builder-PRD-and-Specs.md` (the PRD quoted throughout this readme: site map, conversational form spec, ack JSON contract, deploy flow), plus `pae diagram.png`, `PAE Worflow.png`, `Protect Automation Engine Workflow.pdf`.
- **Uploaded file:** `uploads/PAE Intake.png` — the hand-sketched intake flow (trigger → CRM → outreach tool → automation tool → data tool).
- **Prior visual identity (deliberately replaced):** the repo's green system (`--color-brand-700 #1c5a1c`, emoji icons, gradient hero text). Layout metrics were kept; the palette, type and iconography are new per the brief.

---

## VISUAL FOUNDATIONS

### The idea
*Confident infrastructure on warm paper.* Prospect PAL is handing you something that runs your revenue — the design has to read secure and premium, never playful. So: a lot of quiet warm white, a deep navy that shows up wherever the machine is doing work, one cobalt for anything you can act on, and a champagne accent used like a hallmark, not a highlight.

### Colour
- **Prospect Navy `--ink-800` #101B2D** — the brand core. Sidebar, node canvas, signal sections, the logo tile. Navy = "the engine".
- **Signal Cobalt `--cobalt-600` #2A41C9** — interactive only: links, focus rings, selected states, the one conversion button per view. Cobalt is never decorative.
- **Champagne `--champagne-300` #D9B968** — premium/accent: the mark's leading node, active-nav inset rule, Pro-tier chips, funding-round chips, signal glyphs. Roughly 2% of any screen.
- **Paper `--paper-50` #FBFAF8 / `--paper-0` #FFFFFF** — page and card. Warm, not blue-white; the light background the brief asked to keep.
- **Status** — approved `#0E7C66`, needs-clarification `#B4690E`, blocked `#B3261E`, info `#2033A2`, each with a tinted background pair. Green survives *only* as a status colour; it is never a brand colour.
- **Pipeline stage hues** — fixed per node family (trigger cobalt, shield green, data light cobalt, ai violet, sequence champagne, logic slate) so a node's colour always means the same thing.
- Maximum two background colours per screen: paper + navy. No third surface, no gradient backgrounds. The only gradient permitted anywhere is the navy scrim behind a modal.

### Type
Geist (sans) for everything structural, Geist Mono for anything the machine owns, Instrument Serif italic for a single pull quote per page. No Inter, no Roboto.
- Display 60px / 44px, weight 700, tracking −0.03em, line-height 1.06–1.24. Titles are **sentence case**, always.
- Headings 32/24/18/15, weight 700→600, tracking −0.018em.
- Body 15px, secondary 13px, line-height 1.62, `text-wrap: pretty`.
- Mono 11–13px for bindings (`n8n-nodes-base.hubspot`), ENV names, filenames, run ids, instance URLs. Mono is a promise that the string is literal — never use it for prose.
- Eyebrows: 11px, weight 600, uppercase, 0.1em tracking, cobalt on paper / champagne on navy. One per section.

### Space, radii, borders
2px base scale (2/4/6/8/10/12/16/20/24/32/40/48/64/80/96). Cards pad 20 (dense 16, feature 24–28); 12px between cards; 32px section gutter; 1180px max content width. App metrics carried from the code: 236px sidebar, 52px top bar, 440px intake pane.

Square-shouldered radii: 4/6/8/12/16/20. Cards are 12–16px, modals 16–20px, controls 6–8px, node cards 12px. **Pill radius is reserved for status chips and badges** — nothing else. Borders are 1px hairline (`--paper-200`) on paper, 1px `--ink-700` on navy, 1.5px only where a control must feel physical (inputs, selected tool cards, featured plan). **No card ever gets a coloured left border.**

### Surfaces, shadow, transparency
Two-layer soft shadows, never hard drops: `--shadow-hairline` for tiles, `--shadow-card` for cards, `--shadow-card-hover`, `--shadow-raised` for the featured plan, `--shadow-overlay` for modals and the hero canvas. Navy surfaces use `rgba(255,255,255,0.03–0.08)` fills instead of shadow — light, not depth. Blur appears exactly twice: the sticky nav (`blur(14px)` over 86% paper) and modal scrims (`blur(6px)` over ink at 55%). No frosted cards.

### Motion
Fast and mechanical: 80ms instant, 150ms controls, 220ms surfaces, 380ms overlays, easing `cubic-bezier(0.2,0,0.2,1)` (entrances `(0.16,1,0.3,1)`). Hover = `translateY(-2px)` plus a shadow step; press = `scale(0.985)`. Ambient motion only where something is genuinely live: the 3s status-dot pulse and the typing dots. No bounce, no parallax, no scroll-triggered reveals, no number counters.

### States
- **Hover:** paper controls darken one step or tint cobalt-50; navy rows go to 4% white; cards lift.
- **Press:** scale down, no colour change.
- **Focus:** 1.5px cobalt-400 border + `0 0 0 3px rgba(58,86,228,0.18)`. Never remove it.
- **Selected:** cobalt border + cobalt-50 fill + check glyph (paper), stage-coloured border + faint glow (navy).
- **Disabled:** 40% opacity, no other change.

### Imagery
There is none, and that is deliberate: no photography, no illustration, no 3D. The hero image *is* the compiled node graph. If photography is ever introduced, keep it cool, desaturated and architectural (server rooms, structure, not smiling teams) — but ask first.

---

## CONTENT FUNDAMENTALS

**Voice:** a senior engineer who has done this a hundred times and is not selling you anything you don't need. Direct, specific, unhurried. It earns trust by naming the mechanism, not by adjectives.

**Person:** speak to the reader as **you**; the product is **Prospect PAL** or "the compiler"/"the agent" — third person. Never "we" for the software, never "I" outside the agent's own chat turns. In chat, the agent may use "I" ("I've bound CRM dedupe to HubSpot").

**Casing:** sentence case everywhere — headlines, buttons, nav, badges. Uppercase is only for eyebrows and stat captions. No Title Case Marketing Headlines. Never all-caps a sentence.

**Sentences:** short. One idea per line. Numbers are concrete and true (nine nodes, eight questions, three sentences). If a number can't be verified, cut it rather than round it.

**Emoji: never.** The source product used emoji as its icon set (⚡🛡️🔍✍️📬); the new brand replaces all of them with Lucide glyphs. No emoji in UI, copy, headings or badges.

**Machine strings stay literal.** Write `n8n-nodes-base.hubspot`, `ENV:CLAY_API_KEY`, `status: needs-clarification` in mono, exactly as the system emits them. Never prettify a technical value into prose.

**Say the safety part out loud.** Security copy is a feature, not fine print: "We only ask which provider — never a key." / "The approval switch is in every compiled engine." / "The workflow lives entirely on your instance."

**Examples**
- Hero: *"Answer eight questions. Get a workflow you own."*
- Sub: *"Prospect PAL gates your intake, resolves every tool to a concrete n8n node, and compiles a nine-node outbound engine that deploys to your instance."*
- Button: *"Compile GTM engine"* · *"Connect & deploy"* · *"Download JSON"* (verb + object, no "Get started")
- Empty/blocked state: *"Blocked at `tools_needed[1].capability` — pick an outreach tool before compiling."*
- Agent turn: *"Which platform holds your contact data today?"* — one question, no preamble.

**Avoid:** "revolutionary", "seamlessly", "unleash", "supercharge", "game-changing", "10x", exclamation marks, rhetorical questions, "just" as a softener.

---

## ICONOGRAPHY

**Substitution flagged:** the source repo ships **no icon assets** — `public/*.svg` is the Next.js starter set (file, globe, next, vercel, window) and the app used **emoji** as icons throughout. Emoji is off-brand for a premium security-adjacent product, so this system standardises on **[Lucide](https://lucide.dev) 0.544** from CDN, at **1.75 stroke weight**. If Prospect PAL commissions a custom glyph set, swap it behind `components/core/Icon.jsx` and nothing else changes.

- **Loading:** `<script src="https://unpkg.com/lucide@0.544.0/dist/umd/lucide.js"></script>`, then `<Icon name="shield-check" />`.
- **Sizes:** 12–13 in chips, 14 dense rows, 16 buttons/nav, 18–20 cards, 24 feature tiles. Colour is `currentColor` unless the glyph is carrying meaning (status, stage hue).
- **Standing vocabulary:** `zap` trigger · `shield-check` dedupe/security · `search` enrichment · `sparkles` AI · `scale` approval gate · `send` sequencer · `database` CRM · `workflow` builder · `wand-sparkles` wizard · `package` outputs · `radio` signals · `plug` integrations · `key-round` credentials · `rocket` deploy · `circle-check` verified.
- **Vendor logos are not included.** Apollo, HubSpot, Smartlead et al. appear as neutral Lucide glyphs in tinted tiles. Real marks need licensing — ask before adding them.
- **Unicode as icons: no.** Arrows use `arrow-right`/`chevron-right`, not "→". The only non-Lucide glyphs are the mark's own three nodes.
- **The logo is the only bespoke SVG** in the system: `assets/logo-mark.svg`, `assets/logo-lockup.svg`, `assets/logo-lockup-inverse.svg`, `assets/logo-mark-cobalt.svg`, `assets/logo-mark-mono.svg`. A navy tile holding an ascending three-node path — the pipeline, drawn once. Clear space = 0.5× the tile; minimum tile 20px; never recolour outside navy / paper / cobalt.

**Font substitution flagged:** no font binaries were supplied. The system uses **Geist** and **Geist Mono** (Google Fonts) in place of the repo's Inter/JetBrains Mono, and keeps **Instrument Serif** for editorial italics. If Prospect PAL licenses a display face, replace `tokens/fonts.css` and `--font-display`.

---

## Index

**Root**
- `styles.css` — the single entry point consumers link (@import list only)
- `readme.md` (this file) · `SKILL.md` (Agent Skills wrapper) · `github.md` (upstream sync record) · `thumbnail.html`

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `motion.css`

**`assets/`** — logo mark, cobalt mark, mono mark, lockup, inverse lockup

**`guidelines/`** — 18 specimen cards: brand core, cobalt / ink / paper / champagne scales, status colours, stage hues, display / heading / body / mono / editorial / eyebrow type, spacing scale, radii, spacing in use, elevation, motion

**`components/`**
- `core/` — `Icon`, `Button`, `IconButton`, `Label`, `Input`, `Textarea`, `Select`, `Badge`, `StatusPill`, `Card`
- `brand/` — `Logo`
- `app/` — `NavItem`, `StatTile`, `ChatBubble`, `TypingDots`, `ToolOptionCard`, `StepIndicator`, `Modal`
- `pipeline/` — `NodeCard`, `PipelineRail`
- `marketing/` — `SectionHeading`, `IntegrationCard`, `DeliverableCard`, `PricingCard`, `LeadSignalCard`

**`ui_kits/`**
- `app/` — workspace recreation (dashboard, builder canvas, intake wizard, outputs & deploy, tech signals, integrations & keys, deploy modal)
- `marketing/` — landing page recreation (hero canvas, bindings, deliverables, signals, pricing, checkout)

### Intentional additions
- **`Icon`** — the source had no icon primitive (it used emoji). One wrapper keeps the glyph set swappable.
- **`StatusPill`** — extracted from the repo's inline "AI Ready" top-bar chip because it recurs on four surfaces.
- **`StepIndicator`** — the PRD defines eight gated intake steps but the code had no shared progress control.

### Not built (no source definition)
No Toast, Tooltip, Avatar, Tabs, Table, Accordion or date control: the product doesn't define them yet. Ask before inventing one.
