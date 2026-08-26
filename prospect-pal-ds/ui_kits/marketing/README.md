# UI kit — Prospect PAL marketing site

Single-page landing recreation, rebranded off the green original.

**Sections** — `index.html` composes:
- `SiteChrome.jsx` — announcement strip (navy), sticky translucent nav, footer
- `Hero.jsx` — headline, proof strip, and the live 9-node canvas on navy
- `Sections.jsx` — resolved bindings grid, deliverables, tech signals (navy), pricing

**Interactions that work:** node selection in the hero canvas, checkout modal, demo modal with the node rail, anchor nav.

**Source of truth:** `diamitani/prospect-pal` → `src/app/(marketing)/home/page.tsx` (section order, copy structure, pricing tiers, deliverable list) and `src/components/CheckoutModal.tsx`. Structure preserved; green, emoji icons and gradient text replaced per the new brand.
