---
name: n8n-engineer-companion
description: Companion for building, installing, testing and changing n8n workflows safely, written for a beginner. Use with the Prospect Outreach template, or any n8n workflow, when importing JSON, adding credentials, choosing node types, wiring webhooks, handling errors, or deciding what is code and what is AI.
---

# n8n Engineer Companion

A short, practical version of the n8n-engineer way of working. Use it next to the Prospect Outreach template. It does not replace the full `n8n-engineer` skill if you have it; it carries the rules this template was built with so any assistant can extend it without breaking it.

Created by Patrick Diamitani, Diamitani Industries.

## How to work with a beginner

- Plain words first. One setup path, numbered steps. Show a worked example.
- Say what is real and what is only a file: "This JSON has been checked by scripts and run on a test n8n. It has not been imported into your n8n until you do it."
- Never ask the user to paste a secret into chat. Credentials are made inside n8n.
- Plan before building. State the goal, trigger, outcome in 2 or 3 sentences and get a yes before editing nodes.

## Install checklist (what to guide the user through)

1. n8n is running (cloud or self-hosted). Note the version: Settings, About. The template was tested on **2.35.7**. Older versions may reject some node versions.
2. Create three credentials in n8n with these exact names (the workflow looks them up by name):
   - `PAE Anthropic`, type Anthropic API (your key).
   - `PAE Webhook Key`, type Header Auth, name `X-PAE-Key`, value a long random string you make.
   - `PAE SMTP`, type SMTP (only needed if you will send from a mailbox; the Send Email node ships **disabled**).
3. Import `workflows/pae-error-alert.json` first, then `workflows/pae-main.json` (menu, Import from file).
4. In the main workflow, open Settings, set **Error Workflow** to the imported alert workflow.
5. In the alert workflow, open `Alert Config` and set `alert_webhook_url` (for example a Slack incoming webhook). Leave empty to disable.
6. Open `Config` in the main workflow and replace every `REPLACE ME`.
7. If any node shows a red credential warning, open it and pick your credential from the list.
8. Run by hand once with the defaults (dry run, log only). Read the report.
9. Only then consider the webhook trigger: publish the workflow and call it.

## Rules this template follows (keep them when you change it)

1. **Deterministic vs agent.** Anything that must be true or repeatable (counts, merges, scoring rules, whitelists, sending decisions) is a Code or HTTP node. Models only write words or make judgement calls. Prose steps are plain LLM chain nodes with a fixed JSON output, not agents with tools.
2. **Calibrated truth.** Output states how sure it is. Guessed emails are labelled. Facts in an email must trace to evidence or they are dropped.
3. **Safe defaults.** Dry run on, send off, guessed addresses blocked. A change that sends needs the owner's clear yes.
4. **Webhook hardening.** Header-key auth, validate the body in a Code node, return `400` with the reason on bad input, return `202` early, report results by callback URL, allow only listed fields to be overridden, ignore URL fields from the body, block private hosts (SSRF).
5. **No secrets in JSON.** Credentials are referenced by name. Prompts, Code nodes and README contain no keys.
6. **Bounded loops and retries.** Every retry has a limit. Every loop has a cap (`max_leads`, `max_sends_per_run`).
7. **Evidence for "sent".** A result node confirms a send from real response data. A disabled Send node cannot fake a send.
8. **An error workflow always exists** and its alert contains no lead data.

## n8n traps already hit (so you do not hit them again)

- Execution order is "v1" (position-based). Wire a response node *before* the long work if you want an early `202`.
- The Code node sandbox has no global `URL`. Parse URLs with a regex helper.
- The structured output parser (v1.2) expects the model answer wrapped as `{"output": {...}}`. Treat a missing `output` as a failure, do not assume success.
- LLM chain system messages must not contain curly braces (n8n reads them as variables). Put braces only in the schema.
- A disabled node passes its items straight through. Never treat "the node ran" as "the email sent".
- Inside loops use `$('Node').first(0, 0)` to pin run 0; in per-item Code nodes use `$('Node').item`.
- Merge v3.2 in append mode works even when one input is empty.
- n8n can cut an error `message` at the first colon. Read the first line of `error.stack` for the full text.
- Webhook paths must be unique per n8n instance or the second workflow fails to activate.
- Importing a workflow does not create credentials. Importing keeps the credential *name*, you pick the matching credential once per node.

## Pinned node versions in the template (installed n8n 2.35.7)

manualTrigger 1, webhook 2, set 3.4, code 2, if 2.2, switch 3.2, httpRequest 4.2, splitInBatches 3, merge 3.2, wait 1.1, emailSend 2.1, respondToWebhook 1.1, noOp 1, stickyNote 1, errorTrigger 1, chainLlm 1.5, lmChatAnthropic 1.3, outputParserStructured 1.2. If the user's n8n is newer or older, re-check these before editing.

## How to change the template safely

1. Edit the generator (`tools/generate_workflows.py` and `tools/code/*.js`) instead of the JSON when you can, then run `tools/qa/run_all.sh`. The JSON is generated.
2. If you edit in the n8n editor instead, export the JSON and run `python3 tools/qa/lint_workflows.py` on it.
3. After any change, re-run the checks and say which ones ran. Do not say "tested" for what was not run.
4. Add, do not replace: new data sources go behind a new `Config` option, default off.

## Verdict words (use exactly)

BLOCK (a secret or a serious confirmed problem), WARN (confirmed, not blocking), PASS (none found), UNADJUDICATED (the review step could not run, treat findings as candidates).

## What to say when you cannot do something

If you cannot reach the user's n8n, say so and give them the exact steps to do it themselves. Never claim an import, activation or send happened unless you saw it happen.
