# AGENTS.md — Project Rules
# Global: C:\Users\kwakh\.gemini\config\AGENTS.md
# Brain: D:\workflow-main\brain\Projects\[Project].md

# Git for Prompts — CLAUDE.md
# Global rules: C:\Users\kwakh\.gemini\config\AGENTS.md (read this first)
# Brain file: D:\workflow-main\brain\Projects\Git-for-Prompts.md (full context)

---

## PROJECT RULES

### Database
- Drizzle ORM only. Never supabase-js for DB queries.
- Every DB read/write MUST check ownerId = auth().userId(). No exceptions.
- Versions are IMMUTABLE — every save creates a new row in versions table. Never update existing.
- revalidatePath() after every DB mutation.

### Auth
- Clerk only. Never add Supabase Auth.
- User ID from auth().userId() — always Clerk userId.

### API Keys
- Stored as bcrypt hash (keyHash) + SHA-256 lookup hash (keyLookupHash).
- Display only keyPrefix (e.g. "gfp_live_"). Never show full key after creation.
- Rate limiting: Upstash Redis + @upstash/ratelimit.

### AI Calls
- All AI calls in Server Actions or API routes. Never in Client Components.
- Primary: Groq. Fallback: OpenRouter. Model name in config constant, not hardcoded.

### Code Style
- Named exports for components. Default export for pages.
- font-mono class on ALL prompt text and AI output.
- unknown + Zod. Never any.
- Check src/components/ before building new components.
- No console.log in production.

### Before Marking Done
- npm run lint + npx tsc --noEmit -> zero errors.
- Test with real data (real prompts, real commits, real test cases).

