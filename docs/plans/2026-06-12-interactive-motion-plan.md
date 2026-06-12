# Homepage Interactive Motion Graphics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a premium, motion-rich, interactive Tour Panel on the homepage that uses custom CSS/React animations to visually demonstrate version control, comparative diffing, test pipelines, and API fetches.

**Architecture:** Replace the static columns in `src/app/page.tsx` Tour view with a two-column grid. The left column manages a vertical features selector, while the right column renders a glassmorphic graphics container displaying the animated simulation corresponding to the active feature. Include an autoplay loop that pauses on hover/click.

**Tech Stack:** React 19, Tailwind CSS v4, Lucide React icons.

---

### Task 1: Set Up Autoplay Logic & Selection Interface

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add active feature index and autoplay timer states**
  Add state hooks to control the current active feature (`activeFeature = 0 | 1 | 2 | 3`), the paused state (`isAutoplayPaused = boolean`), and setup a `useEffect` loop that rotates features every 6 seconds unless paused.

  ```tsx
  // Insert at the top of the Home component (around line 40):
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isAutoplayPaused || activeTab !== 'tour') return;
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoplayPaused, activeTab]);
  ```

- [ ] **Step 2: Add left column feature selection list layout**
  Replace the static pillars section (`{/* Pillars Grid */}`) and Use Cases section with a two-column grid layout containing the Left Column selectors and Right Column canvas container.

  ```tsx
  {/* Replace pillars grid and use cases with the Tour Panel: */}
  <section 
    className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-start"
    onMouseEnter={() => setIsAutoplayPaused(true)}
    onMouseLeave={() => setIsAutoplayPaused(false)}
  >
    {/* Left Column - Feature Cards */}
    <div className="lg:col-span-5 space-y-4">
      {[
        {
          num: '01',
          title: 'Branching Commits',
          desc: 'Save prompt updates as Git-like commits. Track authors, timelines, and messages in an immutable tree.'
        },
        {
          num: '02',
          title: 'Visual Diff Comparisons',
          desc: 'Wipe across prompt versions with a draggable divider. Identify deletions and additions instantly.'
        },
        {
          num: '03',
          title: 'Automated Test Runner',
          desc: 'Simulate concurrent model checks. Assert output parameters against natural language guidelines.'
        },
        {
          num: '04',
          title: 'Runtime API Delivery',
          desc: 'Fetch active versions dynamically via API key. Decouple prompt updates from app redeployments.'
        }
      ].map((feature, idx) => (
        <button
          key={idx}
          onClick={() => {
            setActiveFeature(idx);
            setIsAutoplayPaused(true);
          }}
          className={`w-full flex items-start gap-4 p-5 rounded-xl border text-left transition-all cursor-pointer ${
            activeFeature === idx
              ? 'bg-zinc-900/60 border-zinc-800 text-zinc-100 shadow-lg shadow-zinc-950/40 relative before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[3px] before:bg-zinc-50 before:rounded-r'
              : 'bg-zinc-900/10 border-zinc-950 hover:bg-zinc-900/20 hover:border-zinc-900 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span className={`font-mono text-xs font-bold leading-5 ${activeFeature === idx ? 'text-zinc-50' : 'text-zinc-600'}`}>
            {feature.num}
          </span>
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">{feature.title}</h4>
            <p className="text-xs text-zinc-500 leading-relaxed font-light">{feature.desc}</p>
          </div>
        </button>
      ))}
    </div>

    {/* Right Column - Motion Demo Canvas */}
    <div className="lg:col-span-7 h-[420px] rounded-xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-sm overflow-hidden flex flex-col">
      {/* Canvas rendering will go in Tasks 2-6 */}
    </div>
  </section>
  ```

- [ ] **Step 3: Verify build**
  Run: `pnpm run build`
  Expected: Compiled successfully.

- [ ] **Step 4: Commit checkpoint**
  ```bash
  git add src/app/page.tsx
  git commit -m "feat: layout interactive tour panel grid and cards selector"
  ```

---

### Task 2: Implement Graphic 1 (Branching Commits Tree)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write Node Branching simulation layout**
  Write an animated SVG tree inside the canvas area showing a version branching off `main` when `activeFeature === 0`.
  
  ```tsx
  {activeFeature === 0 && (
    <div className="flex-1 flex flex-col p-6 space-y-6 animate-in fade-in duration-300 h-full justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Git Tree Visualizer</span>
        <span className="text-[10px] font-mono text-emerald-400">Autoplay Loop Running</span>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        {/* Branching SVG lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Main line */}
          <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#27272a" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="10%" y1="50%" x2="50%" y2="50%" stroke="#52525b" strokeWidth="3" />
          
          {/* Branch line */}
          <path d="M 50,150 Q 150,150 250,70 T 400,70" stroke="#10b981" strokeWidth="3" fill="none" className="animate-draw-line" />
        </svg>

        {/* Nodes overlay */}
        <div className="absolute inset-0 flex items-center justify-around px-8">
          <div className="flex flex-col items-center gap-1.5 z-10">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center font-mono text-[10px] font-bold text-zinc-400">v1</div>
            <span className="text-[9px] font-mono text-zinc-500">Initial draft</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 z-10 translate-y-[-40px]">
            <div className="w-8 h-8 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center font-mono text-[10px] font-bold text-emerald-400 animate-pulse">v2</div>
            <span className="text-[9px] font-mono text-emerald-500 font-semibold">Current</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 z-10">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center font-mono text-[10px] font-bold text-zinc-400">main</div>
            <span className="text-[9px] font-mono text-zinc-500">Master trunk</span>
          </div>
        </div>
      </div>

      <div className="border border-zinc-900 bg-zinc-900/30 rounded-lg p-3.5 font-mono text-xs text-zinc-400 space-y-1.5">
        <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase">
          <span>Commit Log Panel</span>
          <span className="text-zinc-600">karanwakhare</span>
        </div>
        <div className="text-zinc-200">
          <span className="text-emerald-400">commit 4d9863f</span> - "feat: adjust Support response criteria"
        </div>
      </div>
    </div>
  )}
  ```

- [ ] **Step 2: Verify build**
  Run: `pnpm run build`
  Expected: Compiled successfully.

- [ ] **Step 3: Commit**
  ```bash
  git add src/app/page.tsx
  git commit -m "feat: implement Git tree version branching visualizer"
  ```

---

### Task 3: Implement Graphic 2 (Draggable Split-Screen Wipe)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write drag-wipe state handlers and UI**
  Add state hooks to track the wipe divider position percentage (`wipePos = number`). Add drag/mouse move event listeners to calculate the percentage when dragging the central vertical bar.

  ```tsx
  // Add states at the top of the Home component:
  const [wipePos, setWipePos] = useState<number>(50);
  const [isWiping, setIsWiping] = useState<boolean>(false);
  ```

  And render Graphic 2 layout inside the canvas when `activeFeature === 1`:
  ```tsx
  {activeFeature === 1 && (
    <div 
      className="flex-1 flex flex-col p-6 space-y-4 animate-in fade-in duration-300 h-full select-none"
      onMouseMove={(e) => {
        if (!isWiping) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = Math.max(15, Math.min(85, (x / rect.width) * 100));
        setWipePos(pct);
      }}
      onMouseUp={() => setIsWiping(false)}
      onMouseLeave={() => setIsWiping(false)}
    >
      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
        <span className="text-[10px] uppercase tracking-wider">Drag Slider to Compare Diff</span>
        <span className="text-[10px] text-zinc-600">Left: v1 | Right: v2</span>
      </div>

      <div className="flex-1 border border-zinc-900 rounded-lg overflow-hidden relative bg-zinc-950 h-full cursor-ew-resize">
        {/* Left Side Original v1 */}
        <div 
          className="absolute inset-y-0 left-0 bg-red-950/5 p-4 overflow-hidden"
          style={{ width: `${wipePos}%` }}
        >
          <span className="text-[9px] font-mono uppercase tracking-wider text-red-500 block mb-2 font-semibold">Original Prompt</span>
          <pre className="font-mono text-[11px] leading-relaxed text-red-300 select-none">
            {`System: You are an assistant. Help queries.
User Query: {{customer_query}}
Thank you.`}
          </pre>
        </div>

        {/* Right Side Modified v2 */}
        <div 
          className="absolute inset-y-0 right-0 bg-emerald-950/5 p-4 overflow-hidden border-l border-zinc-800"
          style={{ left: `${wipePos}%` }}
        >
          <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-500 block mb-2 font-semibold">Refined Prompt</span>
          <pre className="font-mono text-[11px] leading-relaxed text-emerald-300 select-none">
            {`System: You are a polite support agent. If query mentions damage, offer refund.
User Query: {{customer_query}}
Sign off: Customer Support Team.`}
          </pre>
        </div>

        {/* Divider Drag Bar */}
        <div 
          className="absolute inset-y-0 w-1 bg-zinc-700 hover:bg-zinc-500 transition-colors flex items-center justify-center"
          style={{ left: `${wipePos}%` }}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsWiping(true);
          }}
        >
          <div className="w-4 h-8 rounded bg-zinc-800 border border-zinc-700 flex flex-col gap-0.5 items-center justify-center">
            <span className="w-1 h-2 bg-zinc-500 rounded-full" />
            <span className="w-1 h-2 bg-zinc-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )}
  ```

- [ ] **Step 2: Verify build**
  Run: `pnpm run build`
  Expected: Compiled successfully.

- [ ] **Step 3: Commit**
  ```bash
  git add src/app/page.tsx
  git commit -m "feat: implement draggable split-screen wipe diff comparator"
  ```

---

### Task 4: Implement Graphic 3 (Model Flow Test Pipeline)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write flow pipeline animations**
  Add state hooks to track the testing timeline (`runProgress = 0 | 1 | 2 | 3`).
  Setup an automatic `useEffect` loop that runs the pipeline sequence every 5 seconds when `activeFeature === 2`.

  ```tsx
  // Add state at the top of the Home component:
  const [pipelineState, setPipelineState] = useState<number>(0);

  useEffect(() => {
    if (activeFeature !== 2 || activeTab !== 'tour') return;
    const interval = setInterval(() => {
      setPipelineState((prev) => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, [activeFeature, activeTab]);
  ```

  And render Graphic 3 inside the canvas when `activeFeature === 2`:
  ```tsx
  {activeFeature === 2 && (
    <div className="flex-1 flex flex-col p-6 space-y-6 animate-in fade-in duration-300 h-full justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Pipeline Flow Visualizer</span>
        <span className="text-[10px] font-mono text-emerald-400">Automated Run Simulation</span>
      </div>

      {/* Nodes Map */}
      <div className="grid grid-cols-3 gap-4 relative py-4">
        {/* Pathway Lines */}
        <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-0.5 bg-zinc-900 z-0">
          <div 
            className={`h-full bg-emerald-500 transition-all duration-1000 ${
              pipelineState > 0 ? 'w-full' : 'w-0'
            }`} 
          />
        </div>

        <div className={`p-3 rounded-lg border text-center z-10 transition-all ${
          pipelineState >= 0 ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-950 border-zinc-900'
        }`}>
          <span className="text-[9px] font-mono text-zinc-500 uppercase block">Input</span>
          <span className="text-[10px] text-zinc-200 mt-1 font-mono">cracked sole</span>
        </div>

        <div className={`p-3 rounded-lg border text-center z-10 transition-all ${
          pipelineState >= 1 ? 'bg-zinc-900/80 border-emerald-950 ring-2 ring-emerald-900/30' : 'bg-zinc-950 border-zinc-900'
        }`}>
          <span className="text-[9px] font-mono text-zinc-500 uppercase block">Model (Groq)</span>
          <span className="text-[10px] text-emerald-400 mt-1 font-mono">Processing...</span>
        </div>

        <div className={`p-3 rounded-lg border text-center z-10 transition-all ${
          pipelineState >= 2 ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-950 border-zinc-900'
        }`}>
          <span className="text-[9px] font-mono text-zinc-500 uppercase block">Assertions</span>
          <span className="text-[10px] text-zinc-200 mt-1 font-mono">Checks</span>
        </div>
      </div>

      {/* Checks Logs Panel */}
      <div className="border border-zinc-900 bg-zinc-900/30 rounded-lg p-4 font-mono text-xs text-zinc-400 space-y-1.5 min-h-[100px]">
        {pipelineState >= 1 && (
          <div className="flex items-center gap-2">
            <span className="text-zinc-600">⏱️ [0.4s]</span>
            <span>Evaluating prompt criteria on llama-3.3...</span>
          </div>
        )}
        {pipelineState >= 2 && (
          <div className="flex items-center justify-between text-emerald-400 font-semibold animate-in slide-in-from-bottom-2 duration-300">
            <span>✔️ Assertion "refund check"</span>
            <span>PASSED</span>
          </div>
        )}
        {pipelineState >= 3 && (
          <div className="flex items-center justify-between text-emerald-400 font-semibold animate-in slide-in-from-bottom-2 duration-300">
            <span>✔️ Assertion "sign off check"</span>
            <span>PASSED</span>
          </div>
        )}
      </div>
    </div>
  )}
  ```

- [ ] **Step 2: Verify build**
  Run: `pnpm run build`
  Expected: Compiled successfully.

- [ ] **Step 3: Commit**
  ```bash
  git add src/app/page.tsx
  git commit -m "feat: implement animated test case model pipeline flow chart"
  ```

---

### Task 5: Implement Graphic 4 (API Fetch Packet Flow)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write API packet animation**
  Add state hooks to control the package delivery motion (`fetchProgress = number`). Setup a timer effect that moves fetch progress from 0% to 100% every 3 seconds to indicate data flowing.

  ```tsx
  // Add state at the top of the Home component:
  const [apiProgress, setApiProgress] = useState<number>(0);

  useEffect(() => {
    if (activeFeature !== 3 || activeTab !== 'tour') return;
    const interval = setInterval(() => {
      setApiProgress((prev) => (prev === 100 ? 0 : 100));
    }, 1500);
    return () => clearInterval(interval);
  }, [activeFeature, activeTab]);
  ```

  And render Graphic 4 inside the canvas when `activeFeature === 3`:
  ```tsx
  {activeFeature === 3 && (
    <div className="flex-1 flex flex-col p-6 space-y-6 animate-in fade-in duration-300 h-full justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Runtime Client Request</span>
        <span className="text-[10px] font-mono text-sky-400">Public API Endpoint</span>
      </div>

      {/* Packet flow pipeline */}
      <div className="grid grid-cols-2 gap-12 relative items-center py-6">
        <div className="p-4 border border-zinc-900 rounded-lg bg-zinc-950 relative z-10 flex flex-col items-center">
          <span className="text-[9px] font-mono text-zinc-500 uppercase">Your Server</span>
          <span className="text-xs text-zinc-300 mt-1 font-mono font-semibold">App Backend</span>
        </div>

        <div className="p-4 border border-zinc-900 rounded-lg bg-zinc-950 relative z-10 flex flex-col items-center">
          <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold text-emerald-400">GFP Server</span>
          <span className="text-xs text-zinc-300 mt-1 font-mono font-semibold">Prompt v2 (Active)</span>
        </div>

        {/* Floating Packet */}
        <div 
          className="absolute h-1.5 w-1.5 rounded-full bg-sky-400 shadow-md shadow-sky-500/50 transition-all duration-1000 ease-in-out"
          style={{ 
            left: `${apiProgress === 100 ? '75%' : '25%'}`,
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      {/* API JSON Payload Console */}
      <div className="border border-zinc-900 bg-zinc-950 rounded-lg overflow-hidden font-mono text-xs max-h-[140px] flex flex-col">
        <div className="px-3 py-1.5 border-b border-zinc-900 bg-zinc-900/30 text-[10px] text-zinc-500 flex justify-between font-mono">
          <span>GET /api/v1/prompts/latest</span>
          <span className="text-emerald-400">200 OK</span>
        </div>
        <pre className="p-3 text-zinc-400 overflow-x-auto select-none font-mono">
          {`{
  "id": "p_customer_support",
  "version": 2,
  "content": "You are a polite returns department..."
}`}
        </pre>
      </div>
    </div>
  )}
  ```

- [ ] **Step 2: Verify build**
  Run: `pnpm run build`
  Expected: Compiled successfully.

- [ ] **Step 3: Commit**
  ```bash
  git add src/app/page.tsx
  git commit -m "feat: implement public API fetch packet visualizer flow"
  ```
