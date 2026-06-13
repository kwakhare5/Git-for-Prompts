# Specification — Apple-Style Git Tree Animations

**Date**: 2026-06-13  
**Status**: Draft  
**Target File**: `src/app/(landing)/_components/graphics/git-tree.tsx`

---

## 1. Overview
This specification details the transition from the standard CSS ease-in-out animations to snappy, premium "Apple-style" cubic-bezier easing curves on the SVG path tracing lines and node pop-ins in `GitTreeGraphic`.

---

## 2. Animation Easing Curves
We define two custom curves for the motion system:
1. **Snappy Path Tracing Easing**: `cubic-bezier(0.16, 1, 0.3, 1)`. Starts with high momentum (snaps out) and glides smoothly to its final target.
2. **Elastic Node Pop Easing**: `cubic-bezier(0.34, 1.56, 0.64, 1)`. Bounces slightly past scale 1.0 (overshoots to ~1.15) before returning and settling, providing a playful organic feel.

---

## 3. Coordinated Timeline Loop (8-Second Cycle)
To prevent drift between the SVG paths, the nodes, and the console typewriter log, all animations are bound to a synchronized 8.0-second loop controlled by a React `animationKey` state change:

1. **0.0s - 1.0s (Duration 1.0s)**:
   - Line trunk `v1 -> v2` traces from left to right.
   - Easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
2. **1.0s (Trigger)**:
   - Node `v2` begins its elastic pop-in (takes 0.4s).
   - Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`.
3. **1.0s - 2.2s (Duration 1.2s)**:
   - Branch arc path `v2 -> v3` traces from bottom-left to top-right.
   - Easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
4. **2.2s (Trigger)**:
   - Glowing active node `v3` begins its elastic pop-in (takes 0.4s).
   - Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`.
5. **2.4s (Trigger)**:
   - The commit console typewriter log begins typing character-by-character.
6. **8.0s (Reset Boundary)**:
   - `animationKey` increments, resetting `commitTyped` to `""` asynchronously and forcing a complete unmount/remount of the SVG tree, triggering all CSS animations to start fresh.

---

## 4. Technical Implementation Details
All styles and keyframes are defined inside the local `<style>` block of `src/app/(landing)/_components/graphics/git-tree.tsx` to maintain full component isolation.

---

## 5. Verification Plan
- **TypeScript**: Run `npx tsc --noEmit` to ensure there are no compilation or typing issues.
- **Linter**: Run `npm run lint` to verify that no ESLint rules are violated.
- **Interactive Check**: Verify in-browser via the local Next.js dev server that:
  - Line tracing starts extremely fast and decelerates smoothly.
  - Nodes pop in with a springy overshoot.
  - The loop resets perfectly every 8 seconds, keeping typewriter and SVG in exact synchronization.
