---
format: 1920x1080
duration: 45s
message: "PAL compiles your campaign description into a deployable workflow you own"
arc: Hook → Problem → Solution → Proof → CTA
audience: technical founders, RevOps, growth engineers
music: confident minimal upbeat underscore
---

## Video direction

**Palette (from frame.md — blue-professional):**
- Canvas: warm cream `#fdfae7` (never pure white)
- Accent: saturated cobalt `#1e2bfa` (the only color pop)
- Text: near-black `#111111` / muted `#6b6b6b`
- Cards: cobalt-tinted `rgba(30,43,250,0.04)` with `rgba(30,43,250,0.2)` border, no shadows

**Motion grammar:**
- Default ease: `power3` (smooth, long-tail settle — no bouncy, no overshoot)
- Reveals paced to voiceover — each piece enters when the VO names it, not at t=0
- Content in back ~50%: never front-load; spread reveals across the shot
- Stillness over bad motion: holds are intentional; no lazy breathing, no bad pan/push
- Aliveness during holds: subtle jitter only

**Rhythm / held frames:**
- Frame 5 (Ownership) is the breather — stat tiles enter then hold still
- Frame 6 (CTA) holds the lockup clean to end

**Typography:**
- Display: Space Grotesk 700 (headlines, hero text)
- Body: Inter 400 (supporting text)
- Chrome: Space Grotesk 500-600 (tags, labels)

**Negative list:**
- No shadows (except CTA button hover)
- No generic purple-blue AI gradients
- No bouncy/elastic eases
- No slideshow (front-load-then-freeze)
- No screensaver (everything floating independently)
- No nav bars, browser chrome, or cursors (faceless)

---

## Frame 1 — Hook

- scene: Bold rhetorical question builds word by word on clean cream canvas
- voiceover: "What if building outbound automation — was as simple as describing it?"
- duration: 5s
- transition_in: cut
- status: built
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Rhetorical question — creates immediate cognitive gap
- beat: curiosity
- blueprint: kinetic-type-beats (Reproduce)
- focal: the rhetorical question text
- roles: question text = foreground subject · cream canvas = background · subtle cobalt hairline grid = ambient layer (dim ~10%)
- sfx: none

narrativeRole: Opens with a curiosity gap — the viewer immediately wonders "is that possible?" This frames the entire video as an answer to that question.
keyMessage: There's a simpler way to build outbound automation.

Scene 1 (0.0–1.5s): Cream canvas with subtle cobalt hairline grid (10% opacity). "What if building" enters via per-word reveal from left, Space Grotesk 700, ~4cqw. Centered template, y ≈ 0.42.
Scene 2 (1.5–3.0s): "outbound automation" enters on beat — cobalt `#1e2bfa` color for emphasis. Slight spring-pop on "automation".
Scene 3 (3.0–4.2s): Second line "was as simple as describing it?" enters below, smaller weight (500), revealing word-by-word timed to VO.
Scene 4 (4.2–5.0s): Full question holds and reads. Subtle jitter on text. Question mark gets a micro-pulse (glow bloom 15% opacity).

---

## Frame 2 — The Problem

- scene: Black box visualization — opaque dark cube vs transparent wireframe, split comparison
- voiceover: "Most SDR tools are black boxes. — You rent access. — You don't own your workflows."
- duration: 8s
- transition_in: crossfade
- status: built
- src: compositions/frames/02-problem.html
- type: pain_point
- persuasion: Contrast — black box vs transparency, rent vs own
- beat: recognition + frustration
- blueprint: comparison-split (Adapt)
- focal: the black box cube
- roles: black box (opaque cube) = left subject · transparent wireframe = right subject (dim until Scene 3) · cream canvas = background · text labels = supporting
- sfx: thud-soft

Adapt: keep split-tilt structure; the two "capabilities" become opaque black box vs transparent wireframe representing ownership.

Scene 1 (0.0–2.5s): "Most SDR tools are black boxes" — black opaque cube enters from left with 3D tilt, lands at 40% left. Label "BLACK BOX" in muted gray below. Split-tilt card entrance.
Scene 2 (2.5–5.0s): "You rent access" — rent icon (key with X) appears inside the black box. "You don't own" — ownership icon (crossed out) appears. Each on its spoken cue.
Scene 3 (5.0–7.0s): "your workflows" — right side reveals: transparent wireframe cube with visible internal nodes, but grayed/dimmed to show it's NOT what you have. Asymmetric 60/40 layout.
Scene 4 (7.0–8.0s): Hold the contrast. Black box slightly pulses (subtle scale jitter). The comparison reads.

---

## Frame 3 — The Solution

- scene: Text input field transforms into workflow nodes emerging one by one
- voiceover: "Prospect PAL is different. — Describe your campaign in plain English — and PAL compiles it into a real workflow you own."
- duration: 10s
- transition_in: crossfade
- status: built
- src: compositions/frames/03-solution.html
- type: product_intro
- persuasion: Progressive disclosure — reveal the mechanism layer by layer
- beat: clarity + anticipation
- blueprint: prompt-type-submit-generate (Adapt)
- focal: the text input / compiler visualization
- roles: input field = stage element · typed text = foreground subject · emerging workflow nodes = payoff · PAL wordmark = branding element
- sfx: keystroke-soft, whoosh-soft

Adapt: keep the type-in-input-and-generate structure; the "result" is workflow nodes emerging rather than a generated artifact.

Scene 1 (0.0–2.5s): "Prospect PAL is different" — PAL wordmark (Space Grotesk 700, cobalt) enters with spring-pop, centered upper-third. A clean input field (cobalt border, cream fill) appears below.
Scene 2 (2.5–5.5s): "Describe your campaign in plain English" — cursor blinks in input, text types: "Build a campaign for Series A DevOps leads..." — type-on with caret, paced to VO.
Scene 3 (5.5–8.0s): "PAL compiles it" — input field pulses with cobalt glow, shrinks and moves up. Below it, 3 abstract workflow nodes (cobalt-tinted cards) spring-pop in sequence.
Scene 4 (8.0–10.0s): "a real workflow you own" — nodes connect with SVG lines (self-draw). "YOU OWN IT" label enters below in cobalt. Hold and read.

---

## Frame 4 — The Pipeline

- scene: 9-node pipeline assembles itself — nodes appear in sequence with connecting lines
- voiceover: "Nine deterministic nodes. — Intake to enrollment. — Your keys. Your instance."
- duration: 10s
- transition_in: push-slide LEFT
- status: built
- src: compositions/frames/04-pipeline.html
- type: feature_showcase
- persuasion: Enumeration + demonstration — show the actual artifact
- beat: comprehension + confidence
- blueprint: grid-card-assemble (Reproduce)
- focal: the 9-node pipeline grid
- roles: node cards = foreground subjects (staggered cascade) · connecting lines = supporting · stat badges ("9", "DETERMINISTIC") = emphasis · cream canvas = background
- sfx: tick, tick, tick (one per node cluster)

Scene 1 (0.0–1.5s): "Nine deterministic nodes" — large "9" count-up (Space Grotesk 700, cobalt, ~8cqw) at center. Value-scaled counter.
Scene 2 (1.5–5.5s): "Intake to enrollment" — the 9 nodes self-assemble in a 3x3 grid. Staggered cascade entrance, 0.15s apart. Each node is a cobalt-tinted card with icon + label:
- Row 1: Intake & Cron, Normalizer, CRM Dedupe
- Row 2: Data Adapter, AI Research, Approval
- Row 3: CRM Upsert, Enrollment, Review Alert
SVG connector lines draw between adjacent nodes as they land.
Scene 3 (5.5–8.0s): "Your keys" — a key icon pulses on the central node. "Your instance" — a server/cloud icon appears below the grid.
Scene 4 (8.0–10.0s): Grid holds complete. Subtle ambient glow on the grid. The eye reads the structure.

---

## Frame 5 — Ownership

- scene: Three stat tiles fade in — "Your instance" / "100% BYOK" / "Unlimited"
- voiceover: "Deploy, don't rent. — Keys stay local. — Unlimited campaigns."
- duration: 7s
- transition_in: crossfade
- status: built
- src: compositions/frames/05-ownership.html
- type: benefit_highlight
- persuasion: Rule of three — three ownership benefits
- beat: conviction + relief
- blueprint: titlecard-reveal (Reproduce)
- focal: the three benefit tiles
- roles: stat tiles = foreground subjects (triptych) · cream canvas = background · cobalt accent underlines = supporting
- sfx: none

Scene 1 (0.0–2.0s): "Deploy, don't rent" — first tile enters from bottom with slide-up crossfade: icon (server) + "Your instance" + "Deploy, don't rent". Centered, then shifts left to make room.
Scene 2 (2.0–4.0s): "Keys stay local" — second tile enters same way: icon (key) + "100% BYOK" + "Keys stay local". Centered, grid adjusts to triptych.
Scene 3 (4.0–5.5s): "Unlimited campaigns" — third tile enters: icon (infinity) + "Unlimited" + "Campaigns". Triptych complete.
Scene 4 (5.5–7.0s): All three tiles hold and read. This is the breather frame — stillness is intentional. Subtle cobalt underline appears beneath all three.

---

## Frame 6 — CTA

- scene: Logo assembles, URL appears below — "Start building → prospectpal.dev"
- voiceover: "Start building."
- duration: 5s
- transition_in: crossfade
- status: built
- src: compositions/frames/06-cta.html
- type: cta
- persuasion: Distillation — compress to one action
- beat: resolve + inevitability
- blueprint: logo-assemble-lockup (Adapt)
- focal: the Prospect PAL wordmark + URL
- roles: wordmark = foreground subject · URL = call to action · cream canvas = background · cobalt accent line = supporting
- sfx: pop-soft

Adapt: keep the logo-build-to-lockup structure; the logo is the PAL wordmark, not an assembled graphic.

Scene 1 (0.0–1.5s): Stage clears. "PROSPECT" enters via per-word reveal (Space Grotesk 700, near-black).
Scene 2 (1.5–2.5s): "PAL" enters with spring-pop beside it, cobalt color. Wordmark complete.
Scene 3 (2.5–3.5s): "Start building." — text appears below wordmark, timed to VO.
Scene 4 (3.5–5.0s): URL "prospectpal.dev" fades in below with cobalt pill button styling. Subtle ambient glow behind the lockup. Holds clean to end.
