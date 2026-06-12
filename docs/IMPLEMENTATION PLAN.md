Here is the entire plan start to finish, plain text, no code.

PHASE 0 — Before you touch any code
Go create these four accounts right now. Supabase at supabase.com — create a new project, go to Settings then Database, copy the connection string URI and save it somewhere. Clerk at clerk.com — create a new app, turn on GitHub OAuth and Google OAuth, copy the publishable key and the secret key. Google AI Studio at aistudio.google.com — click Get API Key, create one, copy it. Vercel at vercel.com — sign up with your GitHub account, you will deploy here at the very end.
Write all those keys down in a text file on your desktop. You will need them in the next phase.
This phase is done when you have all four accounts open and all keys saved.

PHASE 1 — Project setup
Open your terminal. You are going to create the Next.js app, install all dependencies, set up Clerk auth, and verify that login works before doing anything else.
Create a new Next.js 15 app with App Router and TypeScript and Tailwind using pnpm. Install all your dependencies — drizzle-orm, postgres, clerk, monaco editor, gemini SDK, zod, react hook form, bcryptjs, date-fns. Install shadcn/ui and initialize it with dark theme. Add the shadcn components you need — button, input, card, badge, dialog, dropdown menu, separator, tooltip.
Create your .env.local file and fill in all the keys you saved in Phase 0.
Set up Clerk middleware so that everything under /dashboard is protected and only /, /sign-in, and /sign-up are public. Wrap your root layout with ClerkProvider. Create basic sign-in and sign-up pages using Clerk's built-in components. Create a placeholder dashboard page that just says "Dashboard" so you can confirm the redirect works.
Run the dev server. Visit localhost:3000. You should be redirected to sign-in. Sign in with GitHub. You should land on the dashboard placeholder.
This phase is done when you can sign in and out successfully.

PHASE 2 — Database schema
This is the most important foundational step. Get this right before anything else because every feature depends on it.
You have five tables to create. The prompts table stores the metadata for each prompt — id, name, description, owner id from Clerk, whether it is public, which version is current, created at, updated at. The versions table stores every saved version of a prompt — id, which prompt it belongs to, version number that auto increments per prompt, the full prompt text content, a commit message, who created it, created at. The test cases table stores the tests a prompt must pass — id, which prompt it belongs to, a name for the test, the input text to send to the AI, the expected criteria the AI output must meet, created at. The test results table stores the outcome of running a version against a test case — id, which version, which test case, whether it passed, the actual AI output, created at. The api keys table stores hashed API keys for the public API — id, owner id, key name, the bcrypt hash of the key, the prefix shown to the user, last used, created at.
Write all of this in your Drizzle schema file. Set up the Drizzle client connecting to your Supabase database URL. Set up drizzle kit config pointing to your schema. Run the generate command to create migrations. Run the migrate command to push them to Supabase. Open Drizzle Studio to visually confirm all five tables exist with the right columns.
This phase is done when you can see all five tables in Drizzle Studio and in your Supabase dashboard.

PHASE 3 — Dashboard and prompt management
Now you build the first thing users actually see and interact with.
Build the dashboard page as a server component. It fetches all prompts belonging to the currently logged in user from the database using Drizzle. Display them as cards — each card shows the prompt name, description truncated to two lines, the current version number like v3, the test pass rate like 8 out of 10 passing, and how long ago it was last modified. If the user has no prompts show an empty state with a Create your first prompt button.
Build the sidebar navigation component. Dark theme, GitHub style, shows the app name at the top and navigation links.
Build the create prompt page with a form — name field and description field. Validate with Zod. On submit call a server action that inserts into the prompts table, sets the owner id to the current Clerk user id, then redirects to the new prompt's detail page. Call revalidatePath after the insert.
Build delete functionality — a delete button on each prompt card that calls a server action. The server action must check that the prompt belongs to the current user before deleting.
This phase is done when you can create a prompt, see it on the dashboard, and delete it.

PHASE 4 — Monaco editor and versioning
This is where prompts actually get written and saved as versions.
Build the prompt editor page. Use Monaco Editor — the same engine that powers VS Code. Set it to plaintext mode, dark theme, monospace font. Below the editor put a text input for the commit message — something like "Made tone friendlier". Add a Save Version button.
When Save Version is clicked it calls a server action. That action finds the highest existing version number for this prompt, adds one to it, and inserts a new row into the versions table with the content, the commit message, the new version number, and the current user's id. Then it updates the prompt's current version id and calls revalidatePath.
Build the version history panel next to or below the editor. It shows all versions in reverse order — newest first. Each row shows the version number like v3, the commit message, the date, and the author. Clicking any version loads that version's content into the editor in read-only preview mode so you can see what it looked like. Add a Restore button to each past version — clicking it creates a brand new version with that old content and a commit message that says Restored from v2 or whatever number it was.
This phase is done when saving creates new version numbers, the history list shows all past versions, clicking previews them, and restoring creates a new version.

PHASE 5 — Diff viewer
This is the hero feature of the entire product. Make it look exactly like GitHub's pull request diff view.
Build the diff viewer page. Use the DiffEditor component from the Monaco Editor React package — this is different from the regular Editor. It takes two strings, one for the left side and one for the right side, and shows exactly what changed between them with red highlighting for removed text and green highlighting for added text, side by side.
At the top of the page put two dropdown selectors — one for the left version and one for the right version. When you change either dropdown the page updates and shows the new diff. Use URL parameters to store which versions are selected so the user can share or bookmark the URL.
Add a stats bar below the diff — shows how many lines were added in green and how many were removed in red.
Style the labels above each diff panel to show the version number and commit message.
This phase is done when you can pick any two versions, see the red and green diff between them, and this looks impressive enough to put in a demo video.

PHASE 6 — Test cases and Gemini runner
This is the feature that makes the product serious infrastructure and not just a pretty version history tool.
Build the test cases management UI. Users can add test cases to any prompt. Each test case has three fields — a name like "Mentions refund window", an input text which is the message you would send to the AI like "What is your return policy", and expected criteria which is plain English describing what the AI must do like "must mention 30 days and must not say I don't know". Users can delete test cases. All of this is stored in the test cases table.
Now build the Gemini integration. When a user clicks Run Tests on a specific version, for each test case you make two API calls to Gemini 2.0 Flash. The first call uses the prompt version content as the system instruction and sends the test case input text as the user message. You get back whatever the AI responded. The second call sends that response to Gemini again and asks it to evaluate whether the response meets the expected criteria, returning a JSON object with passed true or false and a reason string. Strip any markdown code fences before parsing the JSON. Handle parse errors gracefully by defaulting to failed.
Save every result to the test results table. Show each test case in the UI with a loading spinner while it runs, then a green PASS badge or red FAIL badge. Show the actual AI output collapsed by default with an expand button. Show the overall score at the top like 8 out of 10 passed with a progress bar.
All Gemini calls must live inside server actions. Never call the Gemini API from a client component.
This phase is done when you can add test cases, click Run Tests, watch them run one by one, and see real pass and fail results from actual Gemini calls.

PHASE 7 — Version comparison
Build the compare page. Users pick two versions of the same prompt. Click Run Comparison. You run all the prompt's test cases against both versions simultaneously using Promise.all. Show the results in a side-by-side table — each row is a test case, each column is a version, each cell shows PASS or FAIL. At the top show the scores for both versions and a clear winner badge like "Version 3 wins — 9 out of 10 vs 6 out of 10" with the winning column highlighted in green.
This phase is done when you can objectively prove which version of a prompt performs better.

PHASE 8 — Public API and API key management
This is the feature that makes the project look like real infrastructure on your resume.
Build the API keys settings page. User types a name for the key like "Production key" and clicks Generate. You generate a random key with the prefix gfp*live* followed by 32 random characters. Show it to the user once with a "Copy this now, you will never see it again" message. Store only the bcrypt hash in the database, never the plaintext key.
Build the API endpoint at /api/v1/prompts/[id]/latest. It reads the Authorization header, extracts the Bearer token, looks up the key hash in the database, compares using bcrypt, and if valid returns the latest version content as JSON. Return 401 for invalid keys, 404 for prompts not found or not owned by that key's owner.
Test it yourself with a curl command from your terminal to confirm it works.
This phase is done when a curl request with a valid key returns prompt content and an invalid key returns a 401 error.

PHASE 9 — Polish and deploy
Go through every button in the app that triggers an async action and make sure it shows a loading spinner or disabled state while waiting. Nothing should feel frozen.
Check every empty state — dashboard with no prompts, prompt with no test cases, prompt with no versions. Each should have a friendly message and a call to action, not a blank white void.
Add error handling — if a server action fails, show the user a readable error message not a raw stack trace.
Push your code to GitHub. Go to vercel.com, click New Project, import your GitHub repo. Add every single environment variable from your .env.local file into Vercel's environment variables settings. Deploy.
After deploy, go to your Clerk dashboard and add your Vercel production URL to the allowed origins list. Test the live URL end to end — sign in, create a prompt, save a version, view the diff, run tests, check the score.
Record a 30 second screen recording. Show the dashboard, edit a prompt, save a new version with a commit message, open the diff viewer and show the red and green changes, click Run Tests and watch them pass or fail, show the final score. That video goes on your GitHub README, your LinkedIn, and X. That is what gets you noticed.
This phase is done when the live URL works completely and you have a demo video recorded.
