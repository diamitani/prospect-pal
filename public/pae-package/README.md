# Prospect Outreach (Prospect Pal) - n8n template package

Created by Patrick Diamitani, Diamitani Industries, for SalesGency.

A ready-to-import n8n workflow that turns an ideal-customer description into researched, quality-checked cold emails, plus the skills and prompts that let an AI assistant install it, explain it, and combine it with your own tools.

**It drafts by default. It sends nothing until you change settings on purpose.**

## Read this first: what is and is not proven

- Checked by scripts and run end to end on a **real n8n 2.35.7**, using **mock servers** in place of Anthropic, your contact tool, your research tool, your sequencer and DNS.
- **Nothing has been imported into your n8n, activated there, or sent.** You do that, with the prompts below.
- The SMTP send path was not run against a real mail server. Real model answers were not evaluated.
- Independent review verdict: **UNADJUDICATED** (no open findings from the automated checks). Details: `QA-REPORT-prospect-outreach-2026-11-09.md`.

## What is in the box

| Folder / file | What it is |
|---|---|
| `workflows/pae-main.json` | The main workflow (62 working nodes) |
| `workflows/pae-error-alert.json` | The failure alert workflow (no lead data in alerts) |
| `prompts/01-setup-prompt.md` | **Start here.** Paste into your AI to install step by step |
| `prompts/02-upload-skills.md` | How to upload each skill to Claude, Claude Code, ChatGPT, Gemini or your own agent, and a test to confirm it loaded |
| `prompts/03-make-it-yours.md` | Asks your AI and n8n engineer to combine this with your own skills and tools |
| `prompts/04-n8n-engineer-handoff.md` | One-page brief for an n8n engineer (human or AI) |
| `skills/prospect-outreach/` | Main skill: how the workflow works and how to run it |
| `skills/n8n-engineer-companion/` | Companion skill: install checklist, safety rules, n8n traps |
| `skills/sections/prospect-step-1..6-*/` | One skill per step (signals, companies, contacts, research, email, outreach) |
| `skills-zips/` | Each skill zipped, ready to upload |
| `docs/` | Plain-words overview, diagrams (`diagrams/`), `overview.html`, plan files `00` to `10` |
| `QA-REPORT-...md` | Exactly what was checked and what was not |
| `tools/` | Generator and test tools (for engineers). `tools/qa/run_all.sh` runs every check |

## Quick start (about 15 minutes)

1. Have an n8n you can log in to, and an Anthropic API key.
2. Upload the two main skills (see `prompts/02-upload-skills.md`).
3. Open `prompts/01-setup-prompt.md`, paste the prompt into your AI assistant, and answer its questions one at a time.
4. Run once by hand in safe mode. Read the report.
5. Only after you have read real drafts and tested one send to your own inbox, think about turning sending on.

## The one thing that trips people up

In the default research mode the emails are built only from the **`notes`** you put on each company (recent news, hiring, launches) or from a research tool you connect. A company with no notes and no research tool gets status `needs_review` and no email. That is deliberate: it stops invented facts.

## Setup details in one place

- Credentials (create in n8n, exact names): `PAE Anthropic`, `PAE Webhook Key`, `PAE SMTP`.
- Replace every `REPLACE ME` in the `Config` node.
- Link the alert workflow in the main workflow's settings (Error Workflow).
- Webhook: `POST /webhook/pae-run` with header `X-PAE-Key`. Replies 202 at once and posts a summary to your `callback_url`.
- The "8d. Send Email (SMTP)" node ships disabled.
- Your contact, research and sequencing tools are connected by URL. If a tool needs an API key, set it as an authentication credential on that HTTP node.

## Rules of the road

- Do not paste secrets into chat or into the Config node.
- Follow the cold-email rules where your recipients live. Include your postal address and an opt-out line in the signature. This package is not legal advice.
- The tagline and call-to-action wording in SalesGency materials are drafts awaiting the owner's confirmation.
