# Git for Prompts — Master 26.5s Launch Video Specification

## 1. Overview
- **Goal**: High-converting, developer-focused 26.5-second product launch video demonstrating local-first prompt version control, multi-model evaluation, and cloud sync.
- **Format**: Remotion React Motion Graphics (16:9, 1024x576 canvas, 30fps = 795 frames total).
- **Aesthetic**: Technical dark-tech (`#141417` surfaces, `#0A0A0C` terminal), Emil Kowalski motion curves, zero decorative AI slop.
- **Audio Architecture**: Custom dark-tech electronic BGM (`public/bgm.mp3`) + calibrated Mixkit tactile Foley suite (Holy Panda typing, slot machine lock, whoosh surge, click chime).

---

## 2. 5-Act Master Storyboard (26.5s / 795 Frames @ 30fps)

### Act 1: The Pain (0.0s – 5.33s / Frames 0 – 160)
- **Sub-beat 1 (0–66f)**: Smooth linear typewriter typing across 58 frames (`0.67 chars/frame`): `"Your prompts are scattered in text files"` followed by a static reading hold with blinking emerald cursor.
- **Sub-beat 2 (66–160f)**: Static `"No"` with 3D perspective slot machine reel flipping through `["diffs.", "evals.", "tests.", "history."]`.
- **Motion Physics**: 2-frame micro-blur bridge at frames 64–68; asymmetric mechanical deceleration curve (`1 - (1-p)^3.5`).
- **Sound**: Mechanical typing stream ➔ tactile slot machine lock on `"history."` at frame 134.

### Act 2: Hero Reveal (5.33s – 9.50s / Frames 160 – 285)
- **Visual**: Dark charcoal brand tile expands (`scale(0.88) ➔ scale(1.0)`) with SVG git branch node paths (`strokeDashoffset`).
- **Typography**: Brand title `"Git for Prompts"` unrolls horizontally with an exponential ease-out curve (`1 - (1-slideP)^4`).
- **Subtitle**: `"Local-first prompt package manager for AI engineering."` rises smoothly into view.
- **Sound**: Electronic beat drop and warm synth swell at 9.5s (`285f`).

### Act 3: Terminal CLI Workflow (9.50s – 14.50s / Frames 285 – 435)
- **Terminal UI**: MacOS traffic light header, `#0A0A0C` background, 10 FPS CLI spinner, `px-20` lateral padding.
- **Commands Executed**:
  1. `$ npx gfp init` ➔ `✔ Initialized .gfp/ repository`
  2. `$ gfp run main` ➔ `✔ 12/12 assertions passed (Groq 120ms / Claude 1.5s)`
  3. `$ gfp push main` ➔ `✔ Published main v2` + `[sha256: 7f3a9e04]` cryptographic badge.
- **Sound**: Rapid CLI keystrokes ➔ Holy Panda Enter thuds at frames 32, 76, 135.

### Act 4: Deep Tech Showcase (14.50s – 22.50s / Frames 435 – 675)
- **Cut 1 (435–515f)**: *Visual Prompt Diffs* — Monaco side-by-side split editor showing v1 raw text vs v2 structured JSON schema addition.
- **Cut 2 (515–595f)**: *Multi-Model Evals* — Live latency bars showing Groq Llama 3.3 70B (`140ms`, 6.2x FASTER) vs GPT-4o (`650ms`) vs Claude 3.5 Sonnet (`1250ms`).
- **Cut 3 (595–675f)**: *Local-to-Cloud Sync* — `Local .gfp/` ➔ `Cloud Postgres` locked sync with SHA-256 stream.
- **Motion**: 4-frame card morph cross-dissolves (`opacity` + `translateY(2px)`) between cuts.

### Act 5: Outro & CTA (22.50s – 26.50s / Frames 675 – 795)
- **Visual**: Brand logo tile, headline `"Git for Prompts"`, subheadline `"Open source, all the way down"`.
- **Interactive CTA**: `$ npx gfp init` button simulating active click (`scale: 0.97`) at frame 40 (715 global) swapping to `✔ Copied!`.
- **Sound**: Close-mic mouse click + soft celebration chime.
