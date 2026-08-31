# tastyskill.dev Design Framework Implementation - Complete Plan

## Files to Modify
1. `src/app/(marketing)/home/page.tsx` - Transform hero to split-screen layout
2. `src/app/globals.css` - Add CSS animations (float, gridMove, fadeIn)
3. `DESIGN-tastyskill.md` - Document design specifications

## Implementation Steps

### 1. Add CSS Animations to globals.css
- Add `@keyframes float` for orb animation (6s ease-in-out)
- Add `@keyframes gridMove` for background pattern (20s linear)
- Add `@keyframes fadeIn` for node details (0.3s ease)
- Add `.tastyskill-orb` and `.tastyskill-grid` utility classes

### 2. Transform Hero Section
- Replace centered hero with 50/50 split-screen layout
- Left: Headline with cobalt accent, subcopy, dual CTAs
- Right: Interactive PipelineRail with node selection
- Add gradient orb (top-right) and animated grid background
- Mobile-responsive stacking (max-width: 960px)

### 3. Enhance PipelineRail
- Magnetic hover states with cobalt highlights
- Click interaction to reveal detailed tooltips
- Smooth fadeIn animation for node details
- Cobalt accent color (#2563EB) consistently applied

### 4. Verification
- `npm run build` - Ensure no syntax errors
- Git diff review - Confirm changes
- Test build locally