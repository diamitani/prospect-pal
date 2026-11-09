# Workflow overview (plain words)

Main workflow: `pae-main` (62 working nodes, plus 5 sticky notes that explain the sections on the canvas). Error workflow: `pae-error-alert` (6 working nodes plus 1 note). Created by Patrick Diamitani, Diamitani Industries, for SalesGency.

**Agent or deterministic?** Only the three rows marked **AGENT** use a language model. Even those are plain "chain" nodes with a fixed JSON answer, no tools. Everything else is code or a plain HTTP call.

## Steps

| Node | Type | Agent / deterministic | Input | Output | If it fails |
|---|---|---|---|---|---|
| Run (manual) | manual trigger | deterministic | click | starts run | n/a |
| Webhook | webhook | deterministic | POST + `X-PAE-Key` | starts run | wrong key: 403 |
| Config | set | deterministic | your settings | one settings row | n/a |
| Validate Config | code | deterministic | settings (+ webhook body) | checked settings, run id | manual: stops with message. Webhook: 400 with reason |
| Config Valid? / Via Webhook? | if | deterministic | validity | route | n/a |
| Respond 400 / Respond 202 | respond to webhook | deterministic | route | HTTP reply | n/a |
| Start Mode? | if | deterministic | `start_mode` | route to step 1 or the leads list | n/a |
| 1a. Signals: Brief | code | deterministic | icp, titles, signals | brief | stops with message |
| Signals Source? / 1b. Signals: Fetch (HTTP) | if / http | deterministic | `signals_url` | extra signal text | warning, continues with ICP only |
| 1c. Signals: Finalize | code | deterministic | brief + fetched text | final brief | stops with message |
| Companies Source? / 2a Inline / 2b Fetch (HTTP) | if / code / http | deterministic | `companies_json` or `companies_url` | raw companies | error text passed on |
| 2c. Companies: Normalize | code | deterministic | raw companies | cleaned, de-duplicated, capped list | "Company source failed: ..." stops the run, error alert fires |
| 2d. Companies: Fit (LLM) with Claude: Fit and Parser: Fit | LLM chain | **AGENT** | company + ICP | fit score 0-1 and reason | company marked `fit_failed` |
| 2e. Apply Fit / Fit Pass? | code / if | deterministic | scores | pass or skip by `min_confidence` | n/a |
| 2f. Skipped Rows | code | deterministic | skipped companies | report rows | n/a |
| Contacts Source? | switch | deterministic | `contacts_source` | route to 3a, 3b or 3d | n/a |
| 3a. Provided | code | deterministic | people inside company data | leads | `skipped_no_email` / `skipped_no_name` |
| 3b. Provider Input / 3b1. Provider (HTTP) / 3c. Provider Normalize | noop / http / code | deterministic | company | leads from your tool | `skipped_no_contact` or error text |
| 3d. Email Guesses | code | deterministic | names + domain + `email_pattern` | guessed address, labelled | `skipped_no_domain` |
| 3d1. MX Lookup (HTTP) / 3e. MX Verdict | http / code | deterministic | domain | `guessed_mx_ok`, or skipped | `skipped_no_route`; lookup error gives `needs_review` |
| Join Skipped / 10. Leads: Provided List / 3z. Collect | merge / code | deterministic | all lead sources | one list, signals attached, send slots numbered | n/a |
| 5a. Loop Over Leads | split in batches | deterministic | lead list | one lead at a time, capped by `max_leads` | n/a |
| 5b. Ready? | if | deterministic | status | only `ready` goes on | others go to the report |
| 6a. Research Source? / 6b. Fetch (HTTP) | if / http | deterministic | `research_url` | evidence text | `fetch_warning`, continues |
| 6c. Prepare / 6c1. Has Evidence? | code / if | deterministic | notes + fetched text | evidence block | no evidence: `needs_review` |
| 6d. Research (LLM) with Claude: Research and Parser: Research | LLM chain | **AGENT** | evidence block | up to 3 hooks, each with its evidence | `research_failed` |
| 6e. Research: Verify / 7a. Hooks OK? | code / if | deterministic | hooks | only hooks whose evidence is in the text | none left: `needs_review` |
| 7b. Email (LLM) with Claude: Email and Parser: Email | LLM chain | **AGENT** | verified hooks, your product text | subject and body | `email_failed` |
| 7c. Email: QA / 7d. Email OK? | code / if | deterministic | draft | `ready` or `needs_review` with flags | n/a |
| 8a. Send Decision / 8b. Action? | code / switch | deterministic | settings + lead | draft only, mailbox, or sequence | n/a |
| 8c. Throttle / 8d. Send Email (SMTP) / 8e. Result | wait / email / code | deterministic | draft | `sent` only with evidence, else `send_unconfirmed` | `send_failed` |
| 8f. Throttle / 8g. Push to Sequence (HTTP) / 8h. Result | wait / http / code | deterministic | draft | `queued` on 2xx | `send_failed` |
| 9a. Report: Rows / 9b. Report: Summary | code | deterministic | all leads | one row per lead, counts, `nothing_was_sent` | n/a |
| 9c. Callback? / 9d. Callback (HTTP) | if / http | deterministic | `callback_url` | summary posted | logged, run still completes |

Error workflow: **Error Trigger** -> **Alert Config** -> **Format Alert** -> **Alert Target Set?** -> **Send Alert (HTTP)** or **No Alert Target**. The alert says which workflow, which node, the error text and the execution id. It never contains lead data.

## Data contract

**Webhook in** (`POST /webhook/pae-run`, header `X-PAE-Key`): JSON object. Allowed keys: `start_mode, icp, target_titles, signals, companies_json, leads_json, contacts_source, research_source, email_mode, max_leads, min_confidence, max_words, tone, value_prop, product_summary, company_name, sender_first_name, signature, dry_run, callback_url`. Unknown or URL keys are ignored and listed as warnings. `dry_run` cannot be turned off here unless `allow_webhook_live_send` is true in the workflow's own Config.

**Replies:** `202` with a run id, `400` with a reason, `403` for a wrong key.

**Callback out** (`callback_url`): the run summary (counts per status, `nothing_was_sent`, warnings) and one row per lead.

## Statuses

`ready`, `drafted`, `queued`, `sent`, `send_unconfirmed`, `send_failed`, `needs_review`, `skipped_low_fit`, `fit_failed`, `skipped_no_contact`, `skipped_no_email`, `skipped_no_name`, `skipped_no_domain`, `skipped_no_route`, `skipped_over_cap`, `research_failed`, `email_failed`. Only the workflow code moves a lead between statuses; no model decides a status.

## Credentials (by name)

`PAE Anthropic`, `PAE Webhook Key`, `PAE SMTP`. Values are created inside n8n and never stored in the files.
