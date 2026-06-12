# Motion Graphics Rebuild — Tour Panel Spec
**Date:** 2026-06-12
**Status:** Approved (GRILL session)
**File:** `src/app/page.tsx` (lines ~648–1078)

---

## Problem Statement

The four animated motion graphics in the landing page Tour Panel have three classes of bugs:

1. **Misaligned labels (Graphic 1):** HTML `<div>` labels float over the SVG canvas at hardcoded `%` positions that don't match the SVG `viewBox` coordinate system. The "Active" label ends up inside the v3 circle. Sub-labels overlap the circles.

2. **Jittery animation (Graphic 2):** The diff wipe auto-scan is driven by a JS `setInterval` that calls `setWipePos` every 30ms. React state updates batch unpredictably, causing jitter and stutter. Text in the narrow side panels also wraps visibly.

3. **Invisible connection bars (Graphic 3):** The two connector bars between pipeline nodes use `position: absolute` with hardcoded `%` values inside a CSS Grid container. The `%` values do not match the actual node column positions, so bars are invisible or misplaced.

4. **Teleporting packet (Graphic 4):** The API flow packet uses JS `setTimeout` to toggle state between positions, causing the dot to snap/teleport rather than animate smoothly.

---

## Decisions (from GRILL)

| # | Decision |
|---|---|
| D1 | All graphics use **pure SVG** — `<text>` elements share the same `viewBox` as circles/lines |
| D2 | Diff wipe auto-scan uses **CSS `@keyframes`** (GPU, inherently smooth), not JS interval |
| D3 | Wipe sweeps 30%↔70% in auto mode; manual drag is unrestricted |
| D4 | Pipeline bars use **flex layout** — bars are flex siblings of nodes, not absolutely positioned |
| D5 | API packet dot uses **pure CSS `@keyframes`** for movement |
| D6 | All animations loop continuously (not run-once) |

---

## Graphic 1 — Branching Git Tree

### Current (broken)
- SVG `viewBox="0 0 500 200"` with circles at hardcoded cx/cy
- Separate HTML overlay `<div>` for each label (v1, v2, v3, main) using `left: %` positioning
- Labels misalign because HTML `%` ≠ SVG coordinate space

### Target (correct)
- SVG `viewBox="0 0 500 230"` (extra 30px vertical for sub-labels)
- **No HTML overlay**. All labels as `<text>` elements at same cx/cy as their circles
- Node circles: v1 at `(100,148)`, v2 at `(240,148)`, v3 at `(405,75)`, main at `(455,148)`
- Branch arc path: `M 240 148 C 295 148 305 75 355 75 L 405 75`
- Trunk line: `x1=100 x2=240 y1=y2=148`
- v3 circle: CSS class `svg-node-active` → `animation: svg-glow 2s ease-in-out infinite` using `filter: drop-shadow(0 0 8px #10b981)`
- Hover card (HTML) stays as corner popup — positioned relative to parent `div`, not SVG ✓
- SVG `<circle>` elements receive React `onMouseEnter`/`onMouseLeave` for hover state

### New CSS classes needed
```css
@keyframes draw-trunk {
  from { stroke-dashoffset: 140; }
  to   { stroke-dashoffset: 0; }
}
@keyframes draw-branch-g1 {
  from { stroke-dashoffset: 230; }
  to   { stroke-dashoffset: 0; }
}
@keyframes svg-glow {
  0%, 100% { filter: drop-shadow(0 0 3px rgba(16,185,129,0.5)); }
  50%       { filter: drop-shadow(0 0 10px rgba(16,185,129,0.9)); }
}
.animate-draw-trunk {
  stroke-dasharray: 140;
  stroke-dashoffset: 140;
  animation: draw-trunk 1.2s cubic-bezier(.4,0,.2,1) forwards;
}
.animate-draw-branch-g1 {
  stroke-dasharray: 230;
  stroke-dashoffset: 230;
  animation: draw-branch-g1 1.4s 0.9s cubic-bezier(.4,0,.2,1) forwards;
}
.svg-node-active {
  animation: svg-glow 2s ease-in-out infinite;
}
```

### State changes
- **Remove:** `isDemoWiping`, `demoWipeDir` state variables
- **Remove:** the `useEffect` that drove the JS interval wipe
- **Keep:** `hoveredNode`, `commitTyped`, `wipePos`, `isWiping`, `wipeContainerRef`

---

## Graphic 2 — Diff Wipe

### Current (broken)
- JS `setInterval` every 30ms calls `setWipePos` with direction state — jittery
- Text in narrow panels wraps visually

### Target (correct)
- Left panel `width` is driven by a **CSS animation** when user is not dragging:
  ```css
  @keyframes wipe-scan {
    0%   { width: 30%; }
    100% { width: 70%; }
  }
  .animate-wipe-scan {
    animation: wipe-scan 3.5s ease-in-out infinite alternate;
  }
  ```
- When user starts dragging (`isWiping = true`): apply `style={{ width: wipePos + '%', animation: 'none' }}`
- When user releases: remove `animation: none`, CSS animation resumes
- All text line `<div>` elements: `overflow-hidden whitespace-nowrap`
- Text `<span>` inside each line: `truncate` (or `overflow-hidden text-ellipsis`)
- Header badge text: static `'Drag handle ↔ to compare'`

### State changes
- **Remove:** `isDemoWiping`, `demoWipeDir`
- **Keep:** `wipePos`, `isWiping`, `wipeContainerRef`

---

## Graphic 3 — Automated Test Pipeline

### Current (broken)
- Grid `grid-cols-3 gap-3` with bars as `position: absolute` children
- `left: '34%', right: '34%'` does not align with grid column centers
- Bars are invisible

### Target (correct)
- Flex row: `flex items-center` container
- Layout: `[Node1 w-[28%]] [Bar flex-1 h-0.5] [Node2 w-[28%]] [Bar flex-1 h-0.5] [Node3 w-[28%]]`
- Bars are flex children — they naturally fill the space between nodes
- Bar fill: `<div style={{ width: pipelineState >= N ? '100%' : '0%' }} className="transition-all duration-700 h-full bg-gradient-to-r from-emerald-600 to-emerald-400" />`
- Status dots above nodes: `absolute -top-1.5 -right-1.5`
- Pipeline loop: JS state machine unchanged (stages 0–4 + badge)

### State changes
- No state changes — only structural JSX changes

---

## Graphic 4 — Runtime API Flow

### Current (broken)
- JS `setInterval` + `setTimeout` chain changes `apiPhase` to move dot via React state
- Dot snaps between positions rather than animating

### Target (correct)
- Two absolutely-positioned dots driven by **pure CSS**, no JS:
  ```css
  @keyframes packet-req {
    0%   { left: 0; opacity: 1; }
    45%  { left: calc(100% - 36px); opacity: 1; }
    50%  { left: calc(100% - 36px); opacity: 0; }
    100% { left: calc(100% - 36px); opacity: 0; }
  }
  @keyframes packet-res {
    0%   { left: calc(100% - 36px); opacity: 0; }
    50%  { left: calc(100% - 36px); opacity: 0; }
    55%  { left: calc(100% - 36px); opacity: 1; }
    100% { left: 0; opacity: 1; }
  }
  .animate-packet-req { animation: packet-req 4s ease-in-out infinite; }
  .animate-packet-res { animation: packet-res 4s ease-in-out infinite; }
  ```
- `apiPhase` state and its `useEffect` loop are **removed** — the JSON panel and node borders use a simpler approach: always show `200 OK` and the GFP node always glows (it's a demo, not a simulation)

---

## Files Changed

| File | Change |
|---|---|
| `src/app/globals.css` | Add: `draw-trunk`, `draw-branch-g1`, `svg-glow`, `wipe-scan`, `packet-req`, `packet-res` keyframes + classes |
| `src/app/page.tsx` | Remove 4 state vars; rewrite 4 graphic JSX blocks |

---

## Success Criteria

- [ ] v1/v2/v3/main labels centered exactly inside their SVG circles
- [ ] "Active ●" text appears clearly above v3 node, not inside it
- [ ] Hover card shows commit metadata in top-right corner
- [ ] Diff wipe sweeps left↔right smoothly with no stutter
- [ ] Both diff panels clip text at edges (no wrapping)
- [ ] Pipeline bars visibly fill between all three nodes
- [ ] ALL PASSED badge pops after pipeline completes
- [ ] API packet dot travels smoothly left→right then right→left
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npm run lint` → 0 errors
