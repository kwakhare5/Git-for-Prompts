# Validation Playbook — Git for Prompts

_Goal: Confirm real people have this problem before launching._

---

## The One Question You Are Trying to Answer

> "Do developers who build AI apps actually struggle to manage, version, and rollback their prompts?"

You do NOT want to ask: "Would you use my product?" (people lie)  
You DO want to ask: "Tell me about the last time a prompt change broke something."

---

## Part 1 — Where to Find These People

### On X (Twitter)

Search these exact queries one by one:

```
"prompt" "broke" "production" -filter:replies
"changed the prompt" site:twitter.com
"system prompt" "rollback" OR "undo"
"hardcoded" "prompt" lang:en
"openai" "claude" "gemini" "prompt" "version" -filter:links
"prompt engineering" "mistake" OR "regret" OR "oops"
"LangSmith" (shows people already aware of the problem space)
"prompt management" (very low volume — reply to all of these)
```

**Filter by:** Last 7 days. Real accounts (not bots). People who tweet code or AI.

---

### On Reddit

Subreddits to browse **right now** and reply to threads:

| Subreddit         | What to look for                             |
| ----------------- | -------------------------------------------- |
| r/LocalLLaMA      | Posts about prompt tuning, LLM apps breaking |
| r/MachineLearning | Prompt engineering discussions               |
| r/OpenAI          | "My ChatGPT integration broke" type posts    |
| r/SideProject     | AI SaaS builders sharing projects            |
| r/webdev          | Full-stack devs integrating OpenAI           |
| r/Entrepreneur    | Indie hackers with AI products               |

Search inside each sub: `prompt version` `prompt broke` `system prompt`

---

### On Discord

Communities to join and lurk in `#show-and-tell` and `#help` channels:

- **Indie Hackers Discord**
- **Buildspace Discord**
- **LangChain Discord** ← goldmine, already prompt-aware users
- **OpenAI Discord**
- **Cursor / Windsurf Discord** ← AI-first developers
- **Peerlist Discord**

---

### On Indie Hackers (indiehackers.com)

Search: `prompt` `AI` `production`  
Browse: "What I've learned building AI products" posts  
Post in the forum (see Part 3)

---

## Part 2 — Exact Messages to Send

### Cold DM on X (Twitter) — Short Version

Send this to anyone who has posted about building an AI app:

> Hey [name] — saw your post about [their project/AI thing].  
> Quick question: when you update a prompt in production, how do you track what changed? Do you version them or just edit in-place?  
> No pitch, genuinely trying to understand how people handle this.

---

### Cold DM on X — If They Said Something Broke

> Saw your tweet about [their prompt issue]. That sounds painful — did you have any way to rollback to what it was before?  
> Asking because I've been building something for exactly this situation.

---

### DM on Discord

> Hey! I saw your message about [their AI project]. Quick question — when you change a system prompt in production, do you track versions anywhere or just overwrite?  
> Trying to understand the workflow before building something. Would really appreciate 2 minutes of your time.

---

### Reply to X Posts (Not DMs — Public Replies)

When you see someone tweet about prompt issues, reply publicly:

> Real question — do you keep any version history of your prompts? Curious how you handled rolling this back.

OR:

> This is exactly why I started tracking prompts like code. Has this happened to you more than once?

---

### Reddit Comment Reply

When you find a thread about prompt issues:

> This is such a common problem. How did you recover — did you have the old version saved somewhere, or did you have to recreate it?  
> Asking because I've been building a versioning tool for this exact situation.

---

## Part 3 — Posts to Make (Validation, Not Launch)

### Post Type 1 — Pain Story (No product mention yet)

Post this on X:

> Hot take: the most underrated problem in AI app development is prompt version control.
>
> You edit one line. AI output breaks. You have no idea what it said before. No rollback. No diff. No history.
>
> It's just you and a broken chatbot.
>
> Does this happen to anyone else or is it just me?

_Wait for replies. Screenshot the good ones. Those people are your users._

---

### Post Type 2 — Ask the Audience

> Quick poll for people building with OpenAI / Claude / Groq:
>
> Where do you store your system prompts?
>
> - Hardcoded in the app
> - Env variable
> - Database
> - Notion/Google Doc
> - Something else
>
> Genuinely asking — I'm researching how people handle this

_Every reply = a data point + a potential user to DM_

---

### Post Type 3 — Problem Framing (Builds interest without pitching)

> I talked to 10 developers who build AI apps this week.
>
> Every single one stores their prompts hardcoded in their codebase.
>
> When I asked "what do you do when a prompt breaks production?" — most said "panic and rewrite from memory."
>
> Building a tool for this. Would love to hear how you handle it.

_Note: only post this AFTER you've actually talked to at least a few people._

---

### Post Type 4 — Direct Question to Community

Post on Indie Hackers forum:

**Title:** "How do you version control your AI prompts?"

> Hey IH community — working on a tool for prompt version control and trying to understand the real problem before building.
>
> If you run an AI-powered product:
>
> 1. Where do you store your system prompts?
> 2. Have you ever broken something by changing a prompt?
> 3. How do you rollback when something goes wrong?
>
> I'll compile the responses and share back. Thanks!

---

## Part 4 — What to Listen For (Validation Signals)

### ✅ Strong validation (they have the problem):

- "I just hardcode it and pray"
- "I had to dig through git history to find the old prompt"
- "I literally screenshot my prompts before editing them"
- "LangSmith is too expensive/complex for my use case"
- "I've broken production twice from prompt changes"

### 🟡 Weak signal (they're aware but not hurting):

- "I use a database column for it"
- "I use env vars"
- "I haven't needed to rollback yet"

### ❌ No validation (wrong audience):

- "I don't change prompts often"
- "What's a system prompt?"
- "I use no-code tools"

---

## Part 5 — Minimum Validation Before Launch

Talk to **5 real developers** who give you a ✅ strong validation signal above.  
Get at least **2 of them** to say they'd try your tool.  
Then launch.

That's it. 5 conversations. That's enough to know you're solving a real problem.
