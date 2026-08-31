# DESIGN.md: Prospect Automation Engine - tastyskill.dev Premium Framework

## Source Inspiration: tastyskill.dev Design Language
Based on premium SaaS landing page patterns with split-screen hero, sophisticated motion, and editorial-grade typography.

## Design Philosophy
- **Visual Language:** Premium SaaS with split-screen hero, sophisticated motion, editorial typography
- **Typography:** Geist Display (68px-88px hero headlines), Geist Mono for metrics
- **Color:** Cobalt electric blue (#2563EB) accent, neutral slate foundation
- **Layout:** Split-screen hero (50/50), asymmetric grids, generous whitespace
- **Motion:** Framer Motion with spring physics, staggerChildren patterns

## Design Tokens

### Colors
- `--accent-cobalt: #2563EB` - Electric blue for CTAs, nodes, brand elements  
- `--accent-tint: rgba(37, 99, 235, 0.1)` - 10% tint for backgrounds
- `--text-primary: #F9FAFB` - Near-white for headings
- `--text-secondary: #94A3B8` - Slate for body text
- `--surface-deep: #0F172A` - Deep navy background

### Typography
- **Display:** `Geist Sans, 68px-88px, -0.02em tracking, 800 weight`
- **Display Mobile:** `48px-56px responsive`
- **Body Large:** `Geist Sans, 18px, 400 weight, max-width: 65ch`
- **Metrics:** `Geist Mono, 14px, 500 weight`

### Spacing & Layout
- `--layout-max: 1400px`
- `--section-gap: 80px`
- `--element-gap: 24px`
- Hero section: `min-h-[100vh]` with split-screen 50/50
- Cards: `rounded-3xl`, `32px` padding

## Component Specifications

### Split-Screen Hero
- Left: Headline, subcopy, primary CTA
- Right: PipelineRail 9-node workflow diagram
- Background: Subtle grid pattern + animated gradient orb
- Motion: Staggered entrance with spring physics

### Premium PipelineRail
- Horizontal 9-node layout with cobalt-accented nodes
- Magnetic hover effects on node hover
- Sticky placement on scroll
- Node selection reveals detail panels

### Cobalt Nodes (Bento Archetypes)
- **Intelligence List:** Auto-sorting leads with AI prioritization
- **Command Input:** Multi-step Typewriter effect for workflow compilation
- **Live Status:** Breathing indicators for active workflows
- **Data Stream:** Infinite carousel of metrics/stats
- **Contextual UI:** Document highlight with floating toolbar

## Implementation Instructions
1. Replace hero section with split-screen layout
2. Add CSS keyframe animations (float, gradientShift, gridMove)
3. Implement cobalt accent color throughout
4. Add Framer Motion staggerChildren patterns
5. Transform cards to Bento Grid pattern
6. Add perpetual micro-interactions
7. Optimize for mobile-first responsive