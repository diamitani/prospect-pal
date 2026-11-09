# Prompt 2 - Upload each skill, then check it loaded

A "skill" here is a folder with a file called `SKILL.md` inside. It teaches an AI assistant how this workflow works. This package has 8 skills. Upload the two main ones first; the six step skills are optional but make step-by-step coaching better.

| Skill | Folder | Upload it when |
|---|---|---|
| Prospect Outreach (main) | `skills/prospect-outreach/` | Always |
| n8n Engineer Companion (main) | `skills/n8n-engineer-companion/` | Always |
| Step 1 Signals and ICP | `skills/sections/prospect-step-1-signals-icp/` | You want help defining who to target |
| Step 2 Companies | `skills/sections/prospect-step-2-companies/` | You are preparing company lists |
| Step 3 Contacts | `skills/sections/prospect-step-3-contacts/` | You are choosing or wiring a contact tool |
| Step 4 Research | `skills/sections/prospect-step-4-research/` | You want better personalisation |
| Step 5 Email | `skills/sections/prospect-step-5-email/` | You want to tune tone, length, signature |
| Step 6 Outreach | `skills/sections/prospect-step-6-outreach/` | You are moving from drafts to real sending |

Ready-made zips (one per skill, folder at the top level) are in `skills-zips/`.

Menu names change often. If a menu below is not where I say, look for the word "Skills", "Customize", "Instructions", "Knowledge" or "Files" in your app's settings or search for it.

## A. Claude (claude.ai, desktop or mobile app)

1. Open Settings, then look for Customize or Capabilities, then Skills.
2. Choose to add or upload a skill and pick one zip from `skills-zips/`. Repeat for each skill.
3. Make sure each skill is switched on.

## B. Claude Code (terminal)

1. Copy each skill folder into `~/.claude/skills/` (all projects) or `.claude/skills/` inside one project. Result: `~/.claude/skills/prospect-outreach/SKILL.md`.
2. Start a new session. Ask: "List the skills you can see."

## C. ChatGPT, Gemini or any assistant without a skills upload

1. Make a Project, custom GPT or Gem (whatever your tool calls a saved assistant).
2. Paste the contents of `skills/prospect-outreach/SKILL.md` and `skills/n8n-engineer-companion/SKILL.md` into its Instructions, below the line `---` (leave out the top block between the first two `---` lines).
3. Upload `workflows/pae-main.json`, `workflows/pae-error-alert.json` and the six step `SKILL.md` files as Knowledge or Files.

## D. Your own n8n AI builder or agent

Give it the two main `SKILL.md` files as its system instructions and the two workflow JSON files as reference files.

## Check it worked (paste this to your assistant)

```text
Without opening any file, tell me:
1. The six steps of the Prospect Outreach workflow, in order.
2. Which three steps use AI.
3. The safe-mode settings the workflow starts in.
4. Why a guessed email address is never sent by default.
5. The three n8n credential names I need to create.
If you cannot answer, tell me which skill did not load.
```

Expected answers: Signals/ICP, Companies, Contacts, Research, Email personalisation, Outreach. AI is used for company fit, research and email. Safe mode is `dry_run` true, `outreach_mode` `log_only`, `max_leads` 3. A guess is not proof the mailbox exists, so sending needs `allow_guessed_sends`. Credentials: `PAE Anthropic`, `PAE Webhook Key`, `PAE SMTP`.
