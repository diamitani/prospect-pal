# Prospect PAL — Scroll Score

## Grammar: Filmic one-shot

**Why this one:**
- Single linear argument with one emotional arc: Recognition → Build (peak) → Commitment
- Allows mixing technical demonstration (the workflow canvas) with marketing substance
- Continuous flow needed for the scroll-to-wire mechanic
- The signature move differentiates, not the grammar

**Why the other seven lost:**
- **Chaptered editorial**: Forbids the full-bleed workflow canvas and requires hard cuts between chapters. We need continuous flow for the build sequence.
- **Live surface**: Forbids marketing copy and section headings. We need to explain the value proposition, not just show the tool.
- **Continuous world**: Requires worldflight mode and forbids all act devices. Too constrained for a conversion-focused sales funnel.
- **Typographic poster**: Forbids photographic grounds and scrub. We need visual richness for the workflow visualization.
- **Gallery / catalog**: Wrong structure — this isn't a collection of options, it's a linear sales argument.
- **Split stage**: Requires two-column comparison throughout. We need flexible layouts per section, not rigid structure.
- **Rhythmic cutlist**: Forbids pin and dwell. Our peak needs extended scroll room for the 9-node build sequence.

---

## Signature Move: Progressive Workflow Assembly

**The mechanic:**

As the visitor scrolls through Act 3 (Build), the 9-node workflow canvas progressively constructs itself:

1. **Canvas initialization** (scroll entry): Empty dark canvas with subtle grid, "Starting compilation..." status text
2. **Node 1** (scroll position 1/9): "Intake & cron" node fades in top-left, positioning animation
3. **Connection 1→2** (scroll position 2/9): Bezier curve animates from Node 1, Node 2 appears
4. **Nodes 3-8** (scroll positions 3-8/9): Each node wires in sequence with connecting curves
5. **Node 9 + completion** (scroll position 9/9): Final node wires, "WORKFLOW COMPILED" badge appears, subtle glow effect
6. **Hold** (post-completion): Canvas holds in completed state, "Your engine is ready" appears
7. **Pricing reveal** (continue scroll): Canvas fades to background, pricing section reveals

**Technical implementation:**
- Fixed canvas during Act 3 with `data-sc-act="pin" data-sc-span="3.5"`
- Each node positioned absolutely, driven by `--sc-p` thresholds
- SVG bezier paths with animating `stroke-dasharray` for connections
- CSS transitions for node fade-ins (300ms ease-out)
- Micro-interactions: subtle shadow pulse when each node completes
- Canvas stays visible but dimmed during Act 4-5, becomes background for Act 6 (pricing)

**Why this qualifies as a signature move:**
- Scroll is literally the compiler — you're building your automation engine by scrolling
- Participatory, not passive — the visitor is the one assembling it
- Unique to this site — directly demonstrates the product value (workflow generation)
- Can't be achieved with kit parameters — requires custom JS reading `--sc-p` and orchestrating 9 independent animations

**Conversion mechanic:**
When the workflow completes, the implicit message is: "You just built this. Now own it." The pricing section reveal becomes the natural next step, not an interruption.

---

## Feeling Curve (Validated)

| Act | Emotion | Screen Cause |
|-----|---------|--------------|
| Recognition | Tired acknowledgment | Copy that names their manual grind: "Research. Write. Check for dupes. Every day, hours lost." No judgment, just truth. |
| Promise | Opening possibility | The headline "One engine. Everything automated." lands with technical weight, not hype. |
| Build (PEAK) | Tactile satisfaction + agency | **Their scroll builds the 9-node workflow.** Each node clicks into place under their control. They're the compiler. |
| Power | Expansive confidence | "While you sleep, it runs." Copy puts them in the future, free from the manual grind. |
| Proof | Credibility + urgency | Real company cards: "NexusFlow Data · Series A $12M · Hiring GTM Automation Engineer." Live signals, not theory. |
| Commitment | Decisive clarity | Three pricing tiers, clean, no ambiguity. "Build my engine" CTA — one path forward. |

**Peak validation:**
- Act 3 (Build) gets 3.5 viewport-heights (most on page)
- Act 2 (Promise) ends clean with 0.8vh span — creates silence before peak
- Peak has the signature move (scroll-to-wire)
- Peak has the most visual change (empty canvas → fully wired workflow)
- One peak, not three

---

## Score Table

| Act | Beat | Device | Span (vh) | Why This Device |
|-----|------|--------|-----------|-----------------|
| 1 | Recognition | `pin` + kinetic lines | 1.2 | Grounded open — copy assembles while the visitor processes their reality. No video yet, just truth and motion. |
| 2 | Promise | `drift` + reveal | 0.8 | Ground shifts dark→champagne, headline reveals. Short span creates pre-peak silence. |
| 3 (PEAK) | Build | `pin` + **scroll-to-wire canvas** | 3.5 | The workflow assembles itself under scroll control. Longest span, signature move, most satisfying. |
| 4 | Power | `flow` + in (stagger) | 1.4 | Benefit cards flow in as visitor scrolls. Lighter weight after intense peak. |
| 5 | Proof | `pan` rail + tilt | 1.6 | Lead signal cards pan horizontally. Tilt on cards makes them tangible. |
| 6 | Commitment | `pin` + spotlight | 1.8 | Pricing tiers pinned, spotlight centers attention, magnetic CTA. |

**Total page length:** 10.3 viewport-heights (within 8-14vh target)

**Checks:**
- ✅ Four distinct device families: pin, drift, flow, pan
- ✅ No device twice in a row
- ✅ At most two scrub acts: Zero (no video scrub needed)
- ✅ No adjacent acts with same feeling
- ✅ Peak has largest span (3.5vh vs next-largest 1.8vh)
- ✅ Act before peak (Promise) is quieter (0.8vh, minimal)
- ✅ Every act earns its span
- ✅ Different from prior build patterns (no 6-7 acts at 13.6-13.8vh)

---

## Device Details

### Act 1: Recognition (pin + kinetic)
```html
<section data-sc-act="pin" data-sc-span="1.2">
  <div data-sc-stage>
    <h1 data-sc-kinetic="lines" data-sc-greet>
      Research. Write.<br>
      Check for dupes.<br>
      Every day, hours lost.
    </h1>
  </div>
</section>
```

### Act 2: Promise (drift + reveal)
```html
<section data-sc-act="drift" data-sc-span="0.8">
  <div data-sc-stage data-sc-color="1:#0A0806" data-sc-color="2:#FDF8F3">
    <h2 data-sc-reveal="line">One engine.<br>Everything automated.</h2>
  </div>
</section>
```

### Act 3: Build — PEAK (pin + scroll-to-wire)
```html
<section data-sc-act="pin" data-sc-span="3.5" id="workflow-builder">
  <div data-sc-stage>
    <div class="workflow-canvas" data-workflow-canvas>
      <!-- 9 nodes positioned absolutely -->
      <!-- SVG connections between nodes -->
      <!-- Status text: "Compiling workflow..." → "WORKFLOW COMPILED" -->
    </div>
  </div>
</section>
```

Custom JS reads `--sc-p` from this section, maps 0→1 to node assembly sequence.

### Act 4: Power (flow + in)
```html
<section data-sc-act="flow">
  <div data-sc-stage>
    <div data-sc-in="0.2" data-sc-stagger="0.15">
      <div class="power-card">Time back</div>
      <div class="power-card">Pipeline growth</div>
      <div class="power-card">Precision at scale</div>
    </div>
  </div>
</section>
```

### Act 5: Proof (pan + tilt)
```html
<section data-sc-act="pan" data-sc-span="1.6">
  <div data-sc-rail>
    <div class="lead-card" data-sc-tilt="6">NexusFlow Data...</div>
    <div class="lead-card" data-sc-tilt="6">HyperScale AI...</div>
    <div class="lead-card" data-sc-tilt="6">CloudPulse...</div>
  </div>
</section>
```

### Act 6: Commitment (pin + spotlight)
```html
<section data-sc-act="pin" data-sc-span="1.8">
  <div data-sc-stage data-sc-spotlight>
    <div class="pricing-grid">
      <div class="pricing-tier">DIY</div>
      <div class="pricing-tier featured">Pro</div>
      <div class="pricing-tier">Custom</div>
    </div>
    <button data-sc-magnet="0.26">Build my engine</button>
  </div>
</section>
```

---

## Assets Required

Since we have brand colors and logo only:

1. **Workflow node icons** (9 SVG icons)
   - Generate: simple, technical iconography for each node type
   - Style: single-color, 24x24px artboard, premium-minimal

2. **Grid texture for canvas**
   - Generate: subtle dot grid or isometric grid pattern
   - Usage: background for workflow canvas

3. **Bezier connection curves**
   - Code: SVG paths, no generation needed

4. **Company logo placeholders** (for lead cards in Act 5)
   - Use: Generic logo shapes or initials if we can't generate real company logos

**No photography needed** — entire page is interface-driven, which aligns with "engineered" vibe.

---

## Fingerprint Gate

Need to check against existing builds in `FINGERPRINTS.md` once we have prior builds. Currently registry is empty (first build), so gate passes automatically.

**This build's fingerprint:**
- Grammar: Filmic one-shot
- Nav: Fixed minimal bar
- Hero: Pin + kinetic lines (manual reality stated plainly)
- Act shape: 6 acts, 10.3vh total
- Close: Pin + spotlight + magnetic CTA
- Signature: Progressive workflow assembly via scroll-to-wire

---

## Next Steps

1. ✅ Brief written
2. ✅ Grammar chosen and justified
3. ✅ Signature move designed
4. ✅ Feeling curve validated
5. ✅ Score table complete
6. → Copy engine files to build directory
7. → Build the HTML page
8. → Implement scroll-to-wire JS
9. → Verify with screenshots
10. → Report
