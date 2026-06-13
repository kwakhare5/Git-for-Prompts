# Motion Graphics Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild all 4 Tour Panel motion graphics in `src/app/page.tsx` to eliminate label misalignment, animation jitter, invisible bars, and teleporting packets.

**Architecture:** Pure SVG for Graphic 1 (text elements share viewBox coordinates). CSS `@keyframes` for Graphic 2 wipe and Graphic 4 packet movement. Flex row layout for Graphic 3 pipeline bars. All changes are surgical — only the 4 graphic JSX blocks and the CSS file are touched.

**Tech Stack:** React 18, Next.js 15 App Router, TypeScript, Tailwind CSS v4, vanilla CSS keyframes in `globals.css`

---

## Task 1: Add CSS Keyframes to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Open globals.css and find the animation block**

Look for the existing `@keyframes` block (currently has `draw-line`, `badge-pop`, `packet-glow`, `cdn-flow`, `node-pulse`).

- [ ] **Step 2: Add the 6 new keyframes + 5 new classes**

Insert after the last existing `@keyframes` block:

```css
/* ── Graphic 1: Git Tree ────────────────────────────── */
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

/* ── Graphic 2: Diff Wipe ───────────────────────────── */
@keyframes wipe-scan {
  0%   { width: 30%; }
  100% { width: 70%; }
}
.animate-wipe-scan {
  animation: wipe-scan 3.5s ease-in-out infinite alternate;
}

/* ── Graphic 4: API Packet ──────────────────────────── */
@keyframes packet-req {
  0%   { left: 0%;              opacity: 1; }
  42%  { left: calc(100% - 36px); opacity: 1; }
  50%  { left: calc(100% - 36px); opacity: 0; }
  100% { left: calc(100% - 36px); opacity: 0; }
}
@keyframes packet-res {
  0%   { left: calc(100% - 36px); opacity: 0; }
  50%  { left: calc(100% - 36px); opacity: 0; }
  58%  { left: calc(100% - 36px); opacity: 1; }
  100% { left: 4px;              opacity: 1; }
}
.animate-packet-req {
  animation: packet-req 4.5s ease-in-out infinite;
}
.animate-packet-res {
  animation: packet-res 4.5s ease-in-out infinite;
}
```

- [ ] **Step 3: Verify — no build errors**

```powershell
npx tsc --noEmit
```
Expected: no output (zero errors).

- [ ] **Step 4: Commit CSS**

```powershell
git add src/app/globals.css
git commit -m "feat(css): add motion graphics keyframes for G1/G2/G4 rebuild"
```

---

## Task 2: Graphic 1 — Rebuild Git Tree (Pure SVG)

**Files:**
- Modify: `src/app/page.tsx` lines ~648–753

- [ ] **Step 1: Remove state variables no longer needed**

In page.tsx, find and remove these two state variable declarations (they drove the old auto-wipe):
```tsx
const [isDemoWiping, setIsDemoWiping] = useState(true);
const [demoWipeDir, setDemoWipeDir] = useState<1 | -1>(1);
```

Also remove the `useEffect` block for Graphic 2 that references `isDemoWiping`/`demoWipeDir` (the JS interval wipe). It starts with `// States for Feature Graphic 2 (Diff Wipe auto-demo)`.

- [ ] **Step 2: Replace the Graphic 1 SVG + HTML overlay block**

Find the block `{/* Graphic 1: Branching Git Tree */}` (line ~648). Replace the entire `{activeFeature === 0 && (...)}` block with:

```tsx
{/* Graphic 1: Branching Git Tree — Pure SVG */}
{activeFeature === 0 && (
  <div className="flex-1 flex flex-col p-5 justify-between h-full animate-in fade-in duration-400">
    <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-2">
      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Version History — Git Tree</span>
      <span className="text-[10px] font-mono text-emerald-500/80">● Live branch: main</span>
    </div>

    <div className="flex-1 relative min-h-0">
      <svg
        viewBox="0 0 500 230"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dashed continuation of main trunk */}
        <line x1="60" y1="148" x2="460" y2="148" stroke="#27272a" strokeWidth="2" strokeDasharray="5 5" />

        {/* Trunk v1→v2 — animated draw */}
        <line
          x1="100" y1="148" x2="240" y2="148"
          stroke="#52525b" strokeWidth="2.5"
          className="animate-draw-trunk"
        />

        {/* Branch arc v2→v3 — animated draw, delayed */}
        <path
          d="M 240 148 C 295 148 305 75 355 75 L 405 75"
          stroke="#10b981" strokeWidth="2.5" fill="none"
          className="animate-draw-branch-g1"
        />

        {/* v1 circle */}
        <circle cx="100" cy="148" r="20" fill="#09090b" stroke="#3f3f46" strokeWidth="2"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredNode('v1')}
          onMouseLeave={() => setHoveredNode(null)}
        />
        {/* v1 label */}
        <text x="100" y="148" textAnchor="middle" dominantBaseline="middle"
          fill="#a1a1aa" fontSize="10" fontFamily="monospace" fontWeight="bold"
          style={{ pointerEvents: 'none', userSelect: 'none' }}>v1</text>
        {/* v1 sub-label */}
        <text x="100" y="178" textAnchor="middle"
          fill="#52525b" fontSize="9" fontFamily="monospace"
          style={{ pointerEvents: 'none', userSelect: 'none' }}>Initial draft</text>

        {/* v2 circle + fork dot */}
        <circle cx="240" cy="148" r="20" fill="#09090b" stroke="#3f3f46" strokeWidth="2"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredNode('v2')}
          onMouseLeave={() => setHoveredNode(null)}
        />
        <circle cx="240" cy="148" r="5" fill="#52525b" style={{ pointerEvents: 'none' }} />
        {/* v2 label */}
        <text x="240" y="148" textAnchor="middle" dominantBaseline="middle"
          fill="#a1a1aa" fontSize="10" fontFamily="monospace" fontWeight="bold"
          style={{ pointerEvents: 'none', userSelect: 'none' }}>v2</text>
        {/* v2 sub-label */}
        <text x="240" y="178" textAnchor="middle"
          fill="#52525b" fontSize="9" fontFamily="monospace"
          style={{ pointerEvents: 'none', userSelect: 'none' }}>+ refund fix</text>

        {/* v3 active — glowing */}
        <circle cx="405" cy="75" r="24" fill="#052e16" stroke="#10b981" strokeWidth="2.5"
          className="svg-node-active cursor-pointer"
          onMouseEnter={() => setHoveredNode('v3')}
          onMouseLeave={() => setHoveredNode(null)}
        />
        {/* v3 label */}
        <text x="405" y="75" textAnchor="middle" dominantBaseline="middle"
          fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold"
          style={{ pointerEvents: 'none', userSelect: 'none' }}>v3</text>
        {/* "Active" above v3 */}
        <text x="405" y="43" textAnchor="middle"
          fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="600"
          style={{ pointerEvents: 'none', userSelect: 'none' }}>● Active</text>

        {/* main trunk stub */}
        <circle cx="455" cy="148" r="18" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
        <text x="455" y="148" textAnchor="middle" dominantBaseline="middle"
          fill="#52525b" fontSize="9" fontFamily="monospace"
          style={{ userSelect: 'none' }}>main</text>
      </svg>

      {/* Hover metadata card — HTML corner popup (safe, positioned in parent div) */}
      {hoveredNode && (
        <div className="absolute top-2 right-2 bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-[9px] font-mono space-y-0.5 shadow-xl z-20 animate-in fade-in duration-150">
          <div className="text-zinc-500 uppercase font-semibold tracking-wider">Commit — {hoveredNode}</div>
          <div className="text-zinc-300">
            {hoveredNode === 'v1' && 'Initial prompt draft'}
            {hoveredNode === 'v2' && 'feat: add refund check'}
            {hoveredNode === 'v3' && 'feat: adjust criteria (active)'}
          </div>
          <div className="text-zinc-600">
            {hoveredNode === 'v1' && 'karan · 2h ago'}
            {hoveredNode === 'v2' && 'karan · 45m ago'}
            {hoveredNode === 'v3' && 'karan · 10m ago'}
          </div>
        </div>
      )}
    </div>

    {/* Typewriter commit log */}
    <div className="border border-zinc-900 bg-zinc-950/70 rounded-lg p-3 font-mono text-[10px] text-zinc-400 space-y-1 shrink-0">
      <div className="flex justify-between text-[9px] text-zinc-600 uppercase font-semibold">
        <span>Latest Commit</span>
        <span className="text-emerald-600">branch: main</span>
      </div>
      <div className="flex items-center gap-1.5 text-zinc-200">
        <span className="text-emerald-400 font-semibold">commit 4d9863f</span>
        <span className="text-zinc-500">—</span>
        <span className="text-zinc-300">
          {commitTyped}<span className="inline-block w-[5px] h-[11px] bg-zinc-400 ml-0.5 align-middle animate-pulse" />
        </span>
      </div>
    </div>
  </div>
)}
```

- [ ] **Step 3: Verify — TypeScript + lint**

```powershell
npx tsc --noEmit
npm run lint
```
Expected: 0 errors.

- [ ] **Step 4: Visual check in browser**

Open `http://localhost:3000`. Click the "01 Branching Commits" tab.
Confirm:
- v1, v2, v3, main labels are centered in their circles
- "● Active" text appears above v3, not inside it
- Hovering v1/v2/v3 shows the corner card
- Trunk draws left-to-right, then branch arc draws with delay

- [ ] **Step 5: Commit**

```powershell
git add src/app/page.tsx
git commit -m "feat(g1): rebuild git tree as pure SVG with text elements"
```

---

## Task 3: Graphic 2 — Rebuild Diff Wipe (CSS Animation)

**Files:**
- Modify: `src/app/page.tsx` lines ~755–853

- [ ] **Step 1: Replace the Graphic 2 JSX block**

Find `{/* Graphic 2: Draggable + Auto-Wipe Diff Viewer */}` and replace the entire `{activeFeature === 1 && (...)}` block with:

```tsx
{/* Graphic 2: Diff Wipe — CSS auto-scan + user drag */}
{activeFeature === 1 && (
  <div
    ref={wipeContainerRef}
    className="flex-1 flex flex-col p-5 justify-between h-full select-none animate-in fade-in duration-400"
    onMouseMove={(e) => {
      if (!isWiping || !wipeContainerRef.current) return;
      const rect = wipeContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
      setWipePos(pct);
    }}
    onMouseUp={() => setIsWiping(false)}
    onMouseLeave={() => setIsWiping(false)}
  >
    <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3">
      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Side-by-Side Prompt Diff</span>
      <span className="text-[9px] text-zinc-500 bg-zinc-900/70 border border-zinc-800 px-2 py-0.5 rounded font-mono">
        ↔ Drag handle to compare
      </span>
    </div>

    {/* Diff container */}
    <div className="flex-1 border border-zinc-900 rounded-lg overflow-hidden relative bg-zinc-950 cursor-ew-resize">

      {/* Left panel — Original v1 */}
      <div
        className={`absolute inset-y-0 left-0 bg-red-950/10 overflow-hidden ${!isWiping ? 'animate-wipe-scan' : ''}`}
        style={isWiping ? { width: `${wipePos}%`, animation: 'none' } : undefined}
      >
        <div className="p-3 min-w-[280px]">
          <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-red-950/40">
            <span className="w-2 h-2 rounded-full bg-red-500/70 inline-block" />
            <span className="text-[9px] font-mono uppercase tracking-wider text-red-400 font-bold">v1  Original</span>
          </div>
          <div className="font-mono text-[10px] leading-[1.8] space-y-px">
            <div className="text-zinc-600 whitespace-nowrap overflow-hidden">01  System: You answer queries.</div>
            <div className="flex gap-1 overflow-hidden">
              <span className="text-red-600 w-4 shrink-0">−</span>
              <span className="bg-red-950/50 border-l-2 border-red-500 pl-1.5 text-red-300/90 whitespace-nowrap overflow-hidden">You answer questions about customer returns.</span>
            </div>
            <div className="text-zinc-600 whitespace-nowrap overflow-hidden">03  ...</div>
            <div className="flex gap-1 overflow-hidden">
              <span className="text-red-600 w-4 shrink-0">−</span>
              <span className="bg-red-950/50 border-l-2 border-red-500 pl-1.5 text-red-300/90 whitespace-nowrap overflow-hidden">Thank you for your message.</span>
            </div>
            <div className="text-zinc-600 whitespace-nowrap overflow-hidden">05  User: {'{customer_query}'}</div>
          </div>
        </div>
      </div>

      {/* Right panel — Refined v2 */}
      <div
        className={`absolute inset-y-0 right-0 bg-emerald-950/10 overflow-hidden border-l border-zinc-800`}
        style={isWiping ? { left: `${wipePos}%` } : undefined}
      >
        <div className="p-3 min-w-[280px]">
          <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-emerald-950/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500/70 inline-block" />
            <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-bold">v2  Refined</span>
          </div>
          <div className="font-mono text-[10px] leading-[1.8] space-y-px">
            <div className="text-zinc-600 whitespace-nowrap overflow-hidden">01  System: You answer queries.</div>
            <div className="flex gap-1 overflow-hidden">
              <span className="text-emerald-500 w-4 shrink-0">+</span>
              <span className="bg-emerald-950/40 border-l-2 border-emerald-500 pl-1.5 text-emerald-300/90 whitespace-nowrap overflow-hidden">You are a polite returns agent. Offer a full refund if broken.</span>
            </div>
            <div className="text-zinc-600 whitespace-nowrap overflow-hidden">03  ...</div>
            <div className="flex gap-1 overflow-hidden">
              <span className="text-emerald-500 w-4 shrink-0">+</span>
              <span className="bg-emerald-950/40 border-l-2 border-emerald-500 pl-1.5 text-emerald-300/90 whitespace-nowrap overflow-hidden">Sign off: &quot;Customer Support Team&quot;.</span>
            </div>
            <div className="text-zinc-600 whitespace-nowrap overflow-hidden">05  User: {'{customer_query}'}</div>
          </div>
        </div>
      </div>

      {/* Divider handle */}
      <div
        className={`absolute inset-y-0 z-10 flex items-center justify-center pointer-events-none ${!isWiping ? 'animate-wipe-scan' : ''}`}
        style={isWiping ? { left: `calc(${wipePos}% - 12px)`, width: '24px', animation: 'none' } : { width: '24px', marginLeft: '-12px' }}
      >
        <div className="h-full w-[2px] bg-zinc-600" />
        <div
          className="absolute w-7 h-10 rounded-xl bg-zinc-900 border border-zinc-600 shadow-xl flex items-center justify-center cursor-ew-resize pointer-events-auto"
          onMouseDown={(e) => { e.preventDefault(); setIsWiping(true); }}
        >
          <span className="text-[11px] text-zinc-400 leading-none select-none">⟷</span>
        </div>
      </div>
    </div>

    {/* Diff stats footer */}
    <div className="flex items-center gap-3 pt-2.5 font-mono text-[9px] text-zinc-600">
      <span className="text-red-400">−2 removed</span>
      <span className="text-zinc-700">·</span>
      <span className="text-emerald-400">+2 added</span>
      <span className="text-zinc-700">·</span>
      <span>v1 → v2 · 3 lines changed</span>
    </div>
  </div>
)}
```

- [ ] **Step 2: Verify — TypeScript + lint**

```powershell
npx tsc --noEmit
npm run lint
```
Expected: 0 errors.

- [ ] **Step 3: Visual check in browser**

Click "02 Visual Diff Comparisons" tab.
Confirm:
- Divider sweeps left↔right smoothly (no stutter)
- Text in both panels is clipped at edges, no wrapping
- Dragging the handle moves divider under cursor precisely
- Releasing drag resumes auto-scan

- [ ] **Step 4: Commit**

```powershell
git add src/app/page.tsx
git commit -m "feat(g2): replace JS interval wipe with CSS keyframe animation"
```

---

## Task 4: Graphic 3 — Rebuild Pipeline (Flex Layout Bars)

**Files:**
- Modify: `src/app/page.tsx` lines ~855–978

- [ ] **Step 1: Replace the Graphic 3 JSX block**

Find `{/* Graphic 3: Animated Pipeline */}` and replace the entire `{activeFeature === 2 && (...)}` block with:

```tsx
{/* Graphic 3: Pipeline — flex row with inline bars */}
{activeFeature === 2 && (
  <div className="flex-1 flex flex-col p-5 justify-between h-full animate-in fade-in duration-400">
    <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Automated Scoring Pipeline</span>
      <span className={`text-[9px] font-mono transition-colors ${showPassedBadge ? 'text-emerald-400' : 'text-zinc-500'}`}>
        {showPassedBadge ? '● All assertions passed' : '● Simulation running…'}
      </span>
    </div>

    {/* Node row — flex so bars span naturally between nodes */}
    <div className="flex items-center py-5 px-2">

      {/* Node 1 — Prompt Input */}
      <div className={`relative flex-none w-[28%] p-3 rounded-xl border text-center transition-all duration-300 ${
        pipelineState >= 1 ? 'bg-zinc-900/80 border-zinc-700' : 'bg-zinc-950 border-zinc-900'
      }`}>
        <span className="text-[8px] font-mono text-zinc-500 uppercase block font-semibold tracking-wider">1. Input</span>
        <span className="text-[9px] text-zinc-300 font-mono block mt-1 truncate font-semibold">returns_v2</span>
        {pipelineState >= 1 && (
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
        )}
      </div>

      {/* Bar 1: Node1 → Node2 */}
      <div className="flex-1 mx-2 h-[2px] bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
          style={{ width: pipelineState >= 2 ? '100%' : '0%' }}
        />
      </div>

      {/* Node 2 — LLM */}
      <div className={`relative flex-none w-[28%] p-3 rounded-xl border text-center transition-all duration-500 ${
        pipelineState >= 2
          ? 'bg-zinc-900 border-emerald-800'
          : pipelineState === 1
          ? 'bg-zinc-900/50 border-zinc-700 animate-pulse'
          : 'bg-zinc-950 border-zinc-900'
      }`}>
        <span className="text-[8px] font-mono text-zinc-500 uppercase block font-semibold tracking-wider">2. Groq LLM</span>
        <span className={`text-[9px] font-mono block mt-1 font-bold transition-colors ${
          pipelineState >= 2 ? 'text-emerald-400' : pipelineState === 1 ? 'text-zinc-400' : 'text-zinc-600'
        }`}>
          {pipelineState >= 2 ? 'Responded ✓' : pipelineState === 1 ? 'Calling…' : 'Idle'}
        </span>
        {pipelineState >= 2 && (
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
        )}
      </div>

      {/* Bar 2: Node2 → Node3 */}
      <div className="flex-1 mx-2 h-[2px] bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
          style={{ width: pipelineState >= 3 ? '100%' : '0%' }}
        />
      </div>

      {/* Node 3 — Grader */}
      <div className={`relative flex-none w-[28%] p-3 rounded-xl border text-center transition-all duration-500 ${
        showPassedBadge
          ? 'bg-emerald-950/30 border-emerald-700'
          : pipelineState >= 3
          ? 'bg-zinc-900/80 border-zinc-700'
          : 'bg-zinc-950 border-zinc-900'
      }`}>
        <span className="text-[8px] font-mono text-zinc-500 uppercase block font-semibold tracking-wider">3. Grader</span>
        <span className={`text-[9px] font-mono block mt-1 font-bold transition-colors ${
          showPassedBadge ? 'text-emerald-300' : pipelineState >= 3 ? 'text-zinc-400' : 'text-zinc-600'
        }`}>
          {showPassedBadge ? 'Scored ✓' : pipelineState >= 3 ? 'Grading…' : 'Idle'}
        </span>
        {showPassedBadge && (
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
        )}
      </div>
    </div>

    {/* Log window */}
    <div className="border border-zinc-900 bg-zinc-950 rounded-lg p-3.5 font-mono text-[10px] text-zinc-400 space-y-1.5 min-h-[110px] flex flex-col justify-center relative overflow-hidden">
      <div className="flex items-center gap-2 text-zinc-600">
        <span className="text-zinc-700">⏱ [0.0s]</span>
        <span>Dispatching test: &quot;customer_returns_query&quot;</span>
      </div>
      {pipelineState >= 1 && (
        <div className="flex items-center gap-2 text-zinc-400 animate-in slide-in-from-bottom-1 duration-200">
          <span className="text-zinc-600">🤖 [0.4s]</span>
          <span>Calling llama-3.3-70b-versatile via Groq…</span>
        </div>
      )}
      {pipelineState >= 2 && (
        <div className="flex items-center justify-between text-emerald-400 font-semibold animate-in slide-in-from-bottom-1 duration-200">
          <span>✔ Assert &quot;Offer refund if broken&quot;</span>
          <span className="text-emerald-500">PASS 100/100</span>
        </div>
      )}
      {pipelineState >= 3 && (
        <div className="flex items-center justify-between text-emerald-400 font-semibold animate-in slide-in-from-bottom-1 duration-200">
          <span>✔ Assert &quot;Sign off with support team&quot;</span>
          <span className="text-emerald-500">PASS 100/100</span>
        </div>
      )}
      {/* ALL PASSED badge */}
      {showPassedBadge && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
          <div className="animate-badge-pop flex flex-col items-center gap-1">
            <div className="px-5 py-2 rounded-xl bg-emerald-950 border-2 border-emerald-500">
              <span className="font-mono font-bold text-emerald-300 text-sm tracking-widest">● ALL PASSED</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-600">2/2 assertions · 100/100</span>
          </div>
        </div>
      )}
    </div>
  </div>
)}
```

- [ ] **Step 2: Verify — TypeScript + lint**

```powershell
npx tsc --noEmit
npm run lint
```
Expected: 0 errors.

- [ ] **Step 3: Visual check in browser**

Click "03 Automated Test Runner" tab.
Confirm:
- Both bars visibly fill (green gradient) between nodes as pipeline progresses
- Nodes pulse/glow at the right stages
- ALL PASSED badge pops at end
- Animation loops and resets cleanly

- [ ] **Step 4: Commit**

```powershell
git add src/app/page.tsx
git commit -m "feat(g3): rebuild pipeline with flex layout for correctly positioned bars"
```

---

## Task 5: Graphic 4 — Rebuild API Flow (Pure CSS Packet)

**Files:**
- Modify: `src/app/page.tsx` lines ~980–1078

- [ ] **Step 1: Remove apiPhase state and its useEffect**

Find and remove:
```tsx
const [apiPhase, setApiPhase] = useState<0 | 1 | 2>(0);
```
And the `useEffect` block starting with `// States for Feature Graphic 4 (API Packet Flow)`.

- [ ] **Step 2: Replace the Graphic 4 JSX block**

Find `{/* Graphic 4: Bidirectional API Packet Flow */}` and replace the entire `{activeFeature === 3 && (...)}` block with:

```tsx
{/* Graphic 4: Runtime API Delivery — pure CSS packet animation */}
{activeFeature === 3 && (
  <div className="flex-1 flex flex-col p-5 justify-between h-full animate-in fade-in duration-400">
    <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Runtime API Delivery</span>
      <span className="text-[9px] font-mono text-zinc-500">● Live endpoint</span>
    </div>

    {/* Packet flow diagram */}
    <div className="flex items-center gap-3 px-2 py-5">

      {/* Client node */}
      <div className="shrink-0 p-3 border border-zinc-800 rounded-xl bg-zinc-950 flex flex-col items-center w-28">
        <div className="w-5 h-5 mb-1.5 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <span className="text-[8px] font-mono text-zinc-400">&#123;&#125;</span>
        </div>
        <span className="text-[8px] font-mono text-zinc-500 uppercase font-semibold">Your App</span>
        <span className="text-[9px] text-zinc-300 font-mono mt-0.5 font-bold">Backend</span>
      </div>

      {/* Connection track */}
      <div className="flex-1 relative h-10 flex items-center">
        {/* Dashed track */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#27272a" strokeWidth="1.5" strokeDasharray="5 5" />
        </svg>

        {/* Request packet — pure CSS left→right */}
        <div className="animate-packet-req absolute top-1/2 -translate-y-1/2 flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" style={{ boxShadow: '0 0 6px rgba(56,189,248,0.8)' }} />
          <span className="text-[8px] font-mono text-sky-400 whitespace-nowrap">GET</span>
        </div>

        {/* Response packet — pure CSS right→left */}
        <div className="animate-packet-res absolute top-1/2 -translate-y-1/2 flex items-center gap-1">
          <span className="text-[8px] font-mono text-emerald-400 whitespace-nowrap">200</span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }} />
        </div>

        {/* Phase label */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-zinc-700 whitespace-nowrap">
          api.gitforprompts.com
        </div>
      </div>

      {/* GFP node */}
      <div className="shrink-0 p-3 border border-emerald-900/60 rounded-xl bg-zinc-950 flex flex-col items-center w-28">
        <div className="w-5 h-5 mb-1.5 rounded bg-emerald-950/50 border border-emerald-900/60 flex items-center justify-center">
          <span className="text-[8px] font-mono text-emerald-400">GFP</span>
        </div>
        <span className="text-[8px] font-mono text-emerald-500 uppercase font-semibold">Edge CDN</span>
        <span className="text-[9px] text-emerald-300 font-mono mt-0.5 font-bold">returns_v2</span>
      </div>
    </div>

    {/* Response JSON panel — always shows 200 OK (it's a demo) */}
    <div className="border border-zinc-900 bg-zinc-950 rounded-lg overflow-hidden font-mono text-[10px]">
      <div className="px-3 py-1.5 border-b border-zinc-900 bg-zinc-900/40 flex justify-between items-center">
        <span className="text-zinc-500 text-[9px]">GET /api/v1/prompts/<span className="text-sky-500">p_returns</span>/latest</span>
        <span className="text-[9px] font-semibold text-emerald-400">200 OK · 14ms</span>
      </div>
      <pre className="p-3 overflow-x-auto select-none leading-[1.7]">
        <span className="text-zinc-600">{'{'}</span>{`\n  `}<span className="text-sky-400">&quot;id&quot;</span><span className="text-zinc-500">:</span> <span className="text-amber-300">&quot;p_customer_returns&quot;</span><span className="text-zinc-600">,</span>{`\n  `}<span className="text-sky-400">&quot;version&quot;</span><span className="text-zinc-500">:</span> <span className="text-violet-400">2</span><span className="text-zinc-600">,</span>{`\n  `}<span className="text-sky-400">&quot;content&quot;</span><span className="text-zinc-500">:</span> <span className="text-emerald-300">&quot;You are a polite returns agent…&quot;</span>{`\n`}<span className="text-zinc-600">{'}'}</span>
      </pre>
    </div>
  </div>
)}
```

- [ ] **Step 2: Verify — TypeScript + lint**

```powershell
npx tsc --noEmit
npm run lint
```
Expected: 0 errors.

- [ ] **Step 3: Visual check in browser**

Click "04 Runtime API Delivery" tab.
Confirm:
- Sky-blue dot travels smoothly left→right (request)
- Emerald dot travels smoothly right→left (response)
- No snapping or teleporting
- JSON panel always shows `200 OK`

- [ ] **Step 4: Final commit**

```powershell
git add src/app/page.tsx
git commit -m "feat(g4): replace JS timeout packet with pure CSS animation"
```

---

## Task 6: Final Verification

- [ ] **Step 1: Full TS + lint pass**

```powershell
npx tsc --noEmit
npm run lint
```
Expected: 0 errors, 0 warnings.

- [ ] **Step 2: Click through all 4 graphics in browser**

Verify every success criterion from the spec is met.

- [ ] **Step 3: Final commit**

```powershell
git add .
git commit -m "feat: rebuild all 4 tour panel motion graphics - pure SVG, CSS animations, flex bars"

---

## Visual Polish Upgrades (2026-06-13)

### Task 7: Git Tree Visual & Hover Overhaul
- Modify: `src/app/(landing)/_components/graphics/git-tree.tsx`
- [ ] **Step 1: Delete duplicate fork dot inside the v2 node group**
  Remove `<circle cx="240" cy="148" r="4" fill="#a1a1aa" style={{ pointerEvents: 'none' }} />` from the `v2` node.
- [ ] **Step 2: Move mouse hover handlers to parent `<g>` groups**
  Shift `onMouseEnter` and `onMouseLeave` from `<circle>` elements to `<g className="node-vX">` groups.
- [ ] **Step 3: Implement local CSS hover styles & transitions**
  Add styles inside the local `<style>` block:
  - Set `transition: stroke 0.25s ease, fill 0.25s ease, filter 0.25s ease;` to circle nodes.
  - Hover highlights for `.node-v1` and `.node-v2` circles (Border: `#e4e4e7`, Fill: `#18181b`).
  - Hover highlight for `.node-v3` circle (Border: `#34d399`, Fill: `#042f1a`, intensified filter shadow glow).

### Task 8: API Flow Loop Stagger & Node Glows
- Modify: `src/app/(landing)/_components/graphics/api-flow.tsx`
- [ ] **Step 1: Stagger response packet keyframes**
  Update `@keyframes packet-res-local` to fade out to `opacity: 0` between `90%` and `100%` of the animation timeline, clearing loop boundary packet overlaps.

### Task 9: Hero Dashboard Mockup Sync & Typewriter
- Modify: `src/app/(landing)/_components/hero.tsx`
- [ ] **Step 1: Update prompt templates & active highlights**
  Add v1/v2/v3 highlights corresponding to `heroStep` and align prompt text definitions.
- [ ] **Step 2: Add dynamic typewriter typing effect**
  Create a typewriter loop that triggers typing on step changes.

```


```
