---
title: Prospect PAL Video Design Specification
version: v2.0.0-PROD
aspect_ratio: 16:9
resolution: 1920x1080
fps: 60
theme: pure-white-premium
colors:
  bg_canvas: "#09090B"
  bg_surface: "#18181B"
  bg_surface_light: "#FFFFFF"
  border_subtle: "rgba(255, 255, 255, 0.12)"
  border_light: "rgba(0, 0, 0, 0.08)"
  text_primary: "#FFFFFF"
  text_primary_dark: "#09090B"
  text_secondary: "#A1A1AA"
  brand_accent: "#2563EB"
  brand_accent_glow: "rgba(37, 99, 235, 0.35)"
  status_success: "#16A34A"
  status_danger: "#EF4444"
  status_warning: "#F59E0B"
fonts:
  display: "Space Grotesk, sans-serif"
  body: "Inter, sans-serif"
  mono: "JetBrains Mono, monospace"
motion:
  ease_out_expo: "power4.out"
  ease_in_out: "power2.inOut"
  spring: "elastic.out(1, 0.75)"
---

# HyperFrames Creative Spec: Prospect PAL Overview Video

## 1. Visual Direction & Composition Architecture
- **Layer Recipe:**
  1. *Deep Background:* Radial gradient ambient glow (`#09090B` base with subtle `#1e1e24` vignette or `#2563EB/10` center aura).
  2. *Middle Layer:* Tactile frosted glass containers (`backdrop-blur-xl`, `border 1px solid border_subtle`, gentle drop shadows).
  3. *Foreground Active Elements:* Glowing SVG connection splines, dynamic animated badges, kinetic metric counters, and crisp typography.

## 2. Scene Choreography & Motion Blueprint
- **Scene 1 (The Outbound Crisis):** Red glitch/pulse indicators around fragmented tool badges (Apollo, Hunter, ChatGPT, Sheets, Mailer). Floating warning badge *"CRM COLLISION DETECTED"*.
- **Scene 2 (ROSTR v2 & NPAO Core):** 4-quadrant tactile glass cards popping in with staggered spring eases (`Necessity`, `Priority`, `Anxiety`, `Opportunity`).
- **Scene 3 (5-Pillar Live Workflow DAG):** 9-node interactive DAG rendering with live animated pulse packets travelling along glowing SVG splines through the CRM Dedupe Shield.
- **Scene 4 (Multi-Provider AI Gateway):** Multi-model router diagram with live switching between Anthropic Claude 3.5, Google Gemini Flash, and OpenAI GPT-4o with zero latency.
- **Scene 5 (Impact & Launch CTA):** Kinetic stat counters scaling from 0 to 10x with glowing emerald checkmarks, transitioning into the grand Prospect PAL logo and CTA card.
