# Apple-Style Git Tree Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Git Tree animation curves to premium "Apple-style" ease-outs and elastic pop-ins, and update timeline delay variables for a synchronized 8s cycle.

**Architecture:** Encapsulate easing functions and delays inside the component-local CSS style tag of `git-tree.tsx`. Synchronize the typewriter component timing with the drawing timeline.

**Tech Stack:** React, Next.js, CSS Keyframe Animations, SVG

---

### Task 1: Update Animations and Easing in Local Stylesheet

**Files:**
- Modify: `src/app/(landing)/_components/graphics/git-tree.tsx:30-80`

- [ ] **Step 1: Update local animations to use Apple cubic-bezier and coordinated delays**

Update the stylesheet keyframes and duration/delay classes inside the style block to match the new spec timings:
- Trunk `v1` to `v2` line: duration `1.0s`, easing `cubic-bezier(0.16, 1, 0.3, 1)`.
- Branch `v2` to `v3` line: duration `1.2s`, delay `1.0s`, easing `cubic-bezier(0.16, 1, 0.3, 1)`.
- Node `v3` pop-in: delay `2.2s`, easing `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Active text fade-in: delay `2.3s`.

```typescript
        .animate-draw-trunk-local {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw-trunk-local 1.0s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-draw-branch-g1-local {
          stroke-dasharray: 160;
          stroke-dashoffset: 160;
          animation: draw-branch-g1-local 1.2s 1.0s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-v2-node {
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          animation: pop-node-local 0.4s 1.0s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-v3-node {
          transform-box: fill-box;
          transform-origin: center;
          opacity: 0;
          animation: pop-node-local 0.4s 2.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-v2-text {
          opacity: 0;
          animation: fade-in-local 0.4s 1.1s ease-out forwards;
        }
        .animate-v3-text {
          opacity: 0;
          animation: fade-in-local 0.4s 2.3s ease-out forwards;
        }
```

---

### Task 2: Synchronize Typewriter Console Delay

**Files:**
- Modify: `src/app/(landing)/_components/graphics/git-tree.tsx:10-25`

- [ ] **Step 1: Increase typewriter delay from 2200ms to 2400ms**

Since the branch takes 200ms longer to draw (`1.2s` instead of `1.0s`), `v3` pops in at `2.2s`. The typewriter should start typing at `2.4s` (`2400` milliseconds delay):

```typescript
  useEffect(() => {
    // Start typing after v3 has popped in (2.4s delay)
    const delayTimer = setTimeout(() => {
      let i = 0;
      const typer = setInterval(() => {
        i++;
        setCommitTyped(commitMsg.slice(0, i));
        if (i >= commitMsg.length) clearInterval(typer);
      }, 50);

      return () => clearInterval(typer);
    }, 2400);

    return () => clearTimeout(delayTimer);
  }, [animationKey]);
```

---

### Task 3: Verification

**Files:**
- Verify command execution

- [ ] **Step 1: Verify TypeScript compiler check**

Run: `npx tsc --noEmit`
Expected output: Success (no errors)

- [ ] **Step 2: Verify lint rules**

Run: `npm run lint`
Expected output: Success (no warnings or errors)

- [ ] **Step 3: Verify build compilation**

Run: `npm run build`
Expected output: Success (production bundle completes)

- [ ] **Step 4: Commit changes**

```bash
git add src/app/\(landing\)/_components/graphics/git-tree.tsx
git commit -m "feat: animate git tree paths with premium Apple-style ease curves"
```
