# Prospect PAL Scroll Landing Page — Integration Guide

## 🎉 What You Got

A premium scroll-driven landing page where visitors **build your automation engine by scrolling**. The signature move: each scroll increment wires another node into the 9-node workflow canvas, creating a tactile, participatory experience that leads naturally to your pricing.

**Local preview:** [http://localhost:4500](http://localhost:4500) *(server running)*

---

## 📁 Files in This Directory

```
scroll-landing/
├── index.html         # The scroll page (production-ready)
├── scrollcraft.js     # Engine (don't edit)
├── scrollcraft.css    # Engine styles (don't edit)
├── BRIEF.md           # Interview answers + feeling curve
├── SCORE.md           # Grammar choice + device details
├── REPORT.md          # Full build report
└── INTEGRATION.md     # This file
```

---

## 🚀 Integration Options

### Option 1: Replace Your Current Landing Page (Recommended)

**If you want the scroll page as your new homepage:**

```bash
# From prospect-pal root
cp scroll-landing/index.html public/landing.html
cp scroll-landing/scrollcraft.js public/scrollcraft.js
cp scroll-landing/scrollcraft.css public/scrollcraft.css
```

Then update `src/app/page.tsx`:

```tsx
export default async function RootPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/landing.html"); // Points to scroll page
  }
}
```

**Benefits:**
- ✅ Drop-in replacement
- ✅ Zero build step
- ✅ Works immediately
- ✅ No React conflicts

---

### Option 2: Standalone Marketing Domain

**Deploy scroll page to a separate subdomain:**

```bash
# Deploy scroll-landing/ to marketing.prospectpal.com
# Keep app.prospectpal.com for your authenticated app
```

Use the scroll page for cold traffic (ads, social, SEO), and the React app for authenticated users.

**Benefits:**
- ✅ Keep your existing app untouched
- ✅ Optimize each for different audiences
- ✅ A/B test scroll vs. React landing

---

### Option 3: Convert to React Component

**Extract the scroll-to-wire mechanic into a React component:**

This is more work but gives you full control within your Next.js app.

**Steps:**

1. Create `src/components/ScrollWorkflowCanvas.tsx`
2. Extract `.workflow-canvas` markup + styles from `index.html`
3. Convert scroll listener to `useEffect` hook
4. Use `useState` for node activation instead of direct DOM manipulation

**Example skeleton:**

```tsx
'use client';

import { useEffect, useState } from 'react';

export default function ScrollWorkflowCanvas() {
  const [progress, setProgress] = useState(0);
  const [activeNodes, setActiveNodes] = useState<number[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      // Read scroll position, calculate progress
      // Activate nodes based on thresholds
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="workflow-canvas">
      {/* Render nodes with conditional active class */}
    </div>
  );
}
```

**Benefits:**
- ✅ Full React integration
- ✅ Type safety
- ✅ Can mix with your existing components

**Tradeoff:** More work, and you'll need to port the scrollcraft.js engine behavior.

---

## 🎨 Customization

### Update Brand Colors

Edit the CSS custom properties at the top of `index.html`:

```css
:root {
  --sc-canvas: #0A0806;      /* Background */
  --sc-surface: #16110E;     /* Elevated surfaces */
  --sc-ink: #F5EBDD;         /* Primary text */
  --sc-ink-soft: #A2968A;    /* Secondary text */
  --sc-accent: #D4AF37;      /* Champagne gold (your primary) */
  --sc-accent-ink: #0A0806;  /* Text on accent */
}
```

These are currently set to your existing Prospect PAL colors.

### Update Copy

All copy is plain HTML, no templating. Search for:
- Hero text: `Research. Write. Check for dupes.`
- Promise: `One engine. Everything automated.`
- Power cards: `Time back`, `Pipeline growth`, `Precision at scale`
- Lead companies: `NexusFlow Data`, etc.
- Pricing tiers: `DIY Build`, `Pro Unlimited`, `Custom Build`

### Wire CTAs to Stripe

Find all buttons with class `.cta-button` and `.tier-cta`, then add your checkout URLs:

```html
<button class="tier-cta accent" onclick="window.location.href='https://buy.stripe.com/your-pro-plan'">
  Build my engine
</button>
```

Or integrate with your existing `CheckoutModal` if you convert to React.

---

## 📊 What Makes This Unique

### The Signature Move: Scroll-to-Wire

- **Scroll is the compiler** — Not "watch a demo," but "build it yourself"
- **9 progressive node reveals** — Each 1/9th of scroll reveals the next node
- **SVG connection animations** — Bezier curves draw themselves between nodes
- **Live status updates** — "COMPILING... 5/9 NODES" updates as you scroll
- **Completion moment** — "WORKFLOW COMPILED ✓" badge when all nodes are wired
- **Natural pricing transition** — Continuing to scroll reveals pricing

**Custom JavaScript** at the bottom of `index.html` reads the `--sc-p` CSS property (published by scrollcraft.js) and orchestrates the node assembly.

### Why It Works for Conversion

1. **Participatory** — Visitor has agency, not just attention
2. **Demonstrates value** — Shows what the product does by having them build it
3. **Creates ownership** — "I built this, now I want to own it"
4. **Earned reveal** — Pricing appears after they've invested attention
5. **Premium feel** — Engineered precision matches your brand positioning

---

## 🧪 Testing Recommendations

### Before Going Live

1. **Test scroll mechanics:**
   - Scroll slowly through Act 3 (Build) — all 9 nodes should appear smoothly
   - Scroll fast — no janky animations or missed nodes
   - Scroll backwards — nodes should stay visible (they do)

2. **Test on mobile:**
   - iOS Safari (real device, not simulator)
   - Android Chrome
   - Check that workflow canvas is legible at smaller widths

3. **Test CTAs:**
   - Click "Build my engine" in nav
   - Click all three pricing tier buttons
   - Verify they go where you expect

4. **Check contrast:**
   - All text should be legible on all backgrounds
   - Dark text on light ground (Act 2: Promise)
   - Light text on dark ground (everywhere else)

5. **Performance:**
   - Run Lighthouse audit
   - Check First Contentful Paint < 1s
   - Ensure no layout shift during scroll

### After Launch

1. **Add analytics:**
   - Track scroll depth (how many reach Act 3?)
   - Time-to-pricing (how long to Act 6?)
   - Completion rate (do they finish the workflow?)

2. **A/B test:**
   - Scroll-to-wire vs. static demo
   - Measure conversion impact

3. **Monitor real devices:**
   - iOS Low Power Mode behavior
   - Video autoplay policies
   - Touch scroll smoothness

---

## 🐛 Known Limitations

1. **Desktop-optimized workflow layout** — Node positions are fixed pixels, may overlap on narrow viewports <768px
2. **No automated verification run** — Screenshot harness not executed (see REPORT.md for commands)
3. **Placeholder lead data** — Act 5 lead cards use static data, not live signal API
4. **No Stripe integration** — CTAs don't connect to checkout yet
5. **No mobile-specific workflow** — Should ideally be vertical stack on mobile

---

## 📖 Documentation

- **[BRIEF.md](./BRIEF.md)** — Interview answers, feeling curve, completion criteria
- **[SCORE.md](./SCORE.md)** — Grammar choice, score table, device details per act
- **[REPORT.md](./REPORT.md)** — Full build report with technical details, verification checklist, and next steps

---

## 🎯 Quick Start (Next 5 Minutes)

1. **View the scroll page:** [http://localhost:4500](http://localhost:4500)
2. **Scroll slowly through Act 3** to see the workflow build itself
3. **Decide integration approach:**
   - Quick win? → Option 1 (replace landing)
   - Keep separation? → Option 2 (standalone domain)
   - Full control? → Option 3 (convert to React)
4. **Update CTAs** to point to your Stripe checkout
5. **Test on mobile** before deploying

---

## 💡 The Innovation

**Traditional landing pages:**
- Show you a demo
- Ask you to imagine using it
- Hope you convert

**This scroll page:**
- You build the engine yourself
- You experience the value (automation) by scrolling (automation)
- By the time you reach pricing, you've already invested
- Conversion becomes the natural next step, not an interruption

That's the magic. That's what makes this worth installing the skill for.

---

## 🆘 Need Help?

- **Scroll mechanics not working?** Check browser console for JavaScript errors
- **Styles broken?** Verify `scrollcraft.css` and `scrollcraft.js` are loading
- **Want to run verification harness?** See REPORT.md "Automated Verification" section
- **Converting to React?** Start with Option 3 skeleton above

---

**Built with:** [scrollcraft](https://github.com/nateherkai/scroll-craft) by Nate Herk  
**Your build:** Prospect PAL · August 26, 2026  
**Grammar:** Filmic one-shot  
**Signature move:** Progressive workflow assembly (scroll-to-wire)

🎉 **Your engine is ready. Choose your integration.**
