# Product Journal

A chronological record of project milestones, features shipped, and metrics. This file is append-only.

---

## How to Maintain This Journal (For the Agent)
During the Session End ritual (called automatically whenever significant changes are made), the agent:
1. Reads the current `JOURNAL.md`.
2. Compiles the session's work into the format below.
3. Prepends the dated entry directly under the `## Log Entries` header (newest on top) without deleting or modifying any past history.

---

## Log Entries

### [Example Entry] 2026-08-10
* **Commit**: `a8f31b2`
* **Shipped**: Completed Next.js Auth flow and created clean settings page.
* **Hurdles**: Spent 3 hours fighting a hydration mismatch on SSR. Fixed by wrapping the theme provider in a client wrapper.
* **Metrics**: MRR: $0 | Users: 0 | Emails: 42
* **Visuals**: Screenshot of new responsive landing page hero section.
* **Ask/Roast**: Ask for feedback on whether a free trial or paid from day one is better for pre-launch.
* **Vibe**: 🔥 - very productive session.
