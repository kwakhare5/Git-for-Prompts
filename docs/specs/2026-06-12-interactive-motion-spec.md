# Specification — Homepage Interactive Motion Graphics

**Date**: 2026-06-12  
**Status**: Approved  
**Target File**: `src/app/page.tsx`

---

## 1. Overview
To elevate the Git for Prompts landing page to a premium standard, we will replace the static feature text in the "Tour" view with an **Interactive Tour Panel** matching the layout structure reference. 
- **Left Column (Feature List)**: A vertical stack of four cards detailing core product modules:
  1. **Immutable commits** (Branching version tree)
  2. **Visual comparisons** (Draggable split-screen diff)
  3. **High-speed automated grading** (Model evaluation flowchart)
  4. **Dynamic API client fetch** (Package delivery flow)
- **Right Column (Bespoke Motion Canvas)**: A large, dark-themed canvas container displaying an animated simulation corresponding to the active feature.

---

## 2. Left Column: Feature Selection Cards
Four interactive cards vertically stacked. Each features:
- A leading index label (e.g., `01`, `02`, `03`, `04`) in a micro-label styling.
- A concise feature title and brief description.
- A left border line highlight that glows when active.
- **Autoplay Rotation**: By default, the active feature rotates every 6 seconds. If the user clicks or hovers over any card or the right-hand canvas, the autoplay pauses to let them interact.

---

## 3. Right Column: Custom Motion Graphics

### 3.1 Graphic 1: Branching Commits Timeline (Version Control)
- **Concept**: A visual Git branch history graph.
- **Visuals**: A horizontal node tree starting with `main` branch. 
- **Animation Loop**: 
  - An input prompt is modified in a small terminal window.
  - A modal pops up showing a git commit log input with text typing: `"feat: add refund check"`.
  - A line animation draws a new branch off the trunk, and a glowing node `v3` appears at the end.
- **Interactive State**: Clicking nodes overlays the commit metadata ("v2: Clarified returns policy - Karan, 10m ago").

### 3.2 Graphic 2: Draggable Split-Screen Wipe (Diff Viewer)
- **Concept**: A draggable visual compare panel.
- **Visuals**: Side-by-side prompt views (Left: `v1 Original`, Right: `v2 Active Edited`).
- **Interaction**: A vertical divider line splits the container. The user can click and drag the divider left or right.
  - Dragging sweeps across the prompts: revealing the deleted lines (red background) on the left, and added lines (green background) on the right.
  - Custom drag boundaries limit the wipe between 15% and 85% width.

### 3.3 Graphic 3: Interactive Model Flow Graph (Test Runner)
- **Concept**: Visual mapping of LLM inputs, models, and evaluations.
- **Visuals**: Three horizontal nodes:
  1. `[Variable Input]` (e.g. customer return query)
  2. `[LLM Processor (Groq)]` (simulating inference)
  3. `[Assertion Checker]` (checklist validation)
- **Animation Loop**:
  - Glowing pulse dots travel from Node 1 to Node 2.
  - Node 2 glows as a typewriter response output streams out.
  - Pulse travels to Node 3.
  - Node 3 checklist items trigger checkmark animations sequentially:
    - `[✓] Refund offered` (Glows Green)
    - `[✓] Support sign-off` (Glows Green)
  - Finally, a green glowing **PASSED** badge pulses in the center.

### 3.4 Graphic 4: Runtime Fetch Flow (API Delivery)
- **Concept**: Visual request-response packets between backend servers and Git for Prompts API.
- **Visuals**: Backend App (code block) <─── Dotted Line (Pathway) ───> Git for Prompts API.
- **Animation Loop**:
  - Dotted line dashes move from the App to the API, indicating a request.
  - API glows and returns a data packet back along the path.
  - The App's text template updates dynamically, displaying the active version variables.

---

## 4. Performance & Execution Safety
- Animation loops will utilize optimized CSS animations (`@keyframes` and Tailwind transitions) combined with React local states to prevent performance lag or memory leaks.
- All code runs client-side inside the landing page component tree, ensuring zero impact on database schemas or authenticated routes.
