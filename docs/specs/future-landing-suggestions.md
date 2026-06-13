# Future Refinement Suggestions: Landing Page & Playground

These ideas were brainstormed and saved during the architectural alignment phase on June 13, 2026. They will be tackled after completing the initial landing page decomposition.

---

### 1. Interactive SDK Code Tab Selector
Provide a code panel displaying tabs for `Node.js`, `Python`, `Go`, and `cURL` requests.
- **Node.js (Fetch)**:
  ```typescript
  import { GFPClient } from '@gitforprompts/sdk';
  const gfp = new GFPClient({ apiKey: process.env.GFP_API_KEY });
  const systemPrompt = await gfp.prompts.getLatest('customer-support');
  ```
- **cURL Request**:
  ```bash
  curl -X GET "https://gitforprompts.com/api/v1/prompts/YOUR_PROMPT_ID/latest" \
    -H "Authorization: Bearer gfp_live_your_key_here"
  ```

---

### 2. Connected Git Tree SVG Explorer
Make nodes in the branching Git tree SVG graphic clickable. Clicking a node (`v1`, `v2`, `v3`) renders the corresponding historical prompt version text inside a metadata box.

---

### 3. Predefined Test Runner Queries
Let the user switch query examples in the test pipeline demo (e.g., "Item damaged refund request" vs. "Late shipment request"). Update the assertion checklists dynamically to showcase specific verification requirements.

---

### 4. Mock Terminal CLI Showcase
A dark terminal block demonstrating simulated shell commands:
- `gfp login`
- `gfp pull <id> --version <num>`
- `gfp test <id>`
