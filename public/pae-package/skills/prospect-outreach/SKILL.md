---
name: prospect-outreach
description: Run, configure and troubleshoot the Prospect Outreach workflow (Prospect Pal) in n8n, a 6-step pipeline from buying signals to a drafted or sent cold email. Use when the user wants to find companies and contacts, research them, write personalised emails, or set up, tune or debug this workflow.
---

# Prospect Outreach (Prospect Pal) - how to run and tune it

This skill teaches an AI assistant how the Prospect Outreach n8n workflow works, so it can set it up for a beginner, change its settings safely, and explain results in plain words. The workflow itself is in `workflows/pae-main.json` (and `workflows/pae-error-alert.json` for failure alerts).

Created by Patrick Diamitani, Diamitani Industries, for SalesGency. Brand tagline and call-to-action wording are drafts until the owner confirms them.

## The six steps

| # | Step | What it does | Who does it |
|---|---|---|---|
| 1 | Signals / ICP | Turns your ideal-customer description and buying signals into a short brief | Code (optionally fetches signals from a URL you give it) |
| 2 | Companies | Loads companies (pasted list or a URL), cleans and de-duplicates them, then scores fit against your ICP | Code, plus one AI step for fit |
| 3 | Contacts | Gets people at each company: provided in your data, from your contact tool, or guessed from a name pattern | Code (guessed emails get a mail-server check) |
| 4 | Research | Finds possible opening points, then keeps only those that trace back to evidence you supplied (company `notes`, or text from your research URL) | One AI step, then code checks it |
| 5 | Email personalisation | Writes a short email using only verified facts | One AI step, then code checks it |
| 6 | Outreach | Logs a draft by default, or sends through your mailbox or sequencing tool when you turn that on | Code |

Only three steps use AI (company fit, research, email). Everything else is plain code, so counts, checks and sending rules are repeatable.

## Safety defaults (do not weaken these without the owner saying so)

- `dry_run` is **true** and `outreach_mode` is **log_only**. Nothing is sent until both are changed on purpose.
- A guessed email address is labelled `guessed_unverified` or `guessed_mx_ok`. A mail-server check only proves the domain can receive mail, not that the mailbox exists. Guessed addresses are never sent unless `allow_guessed_sends` is true.
- A live send needs an opt-out line in `signature`. Without it the lead is marked `needs_review` and nothing is pushed.
- Webhook runs cannot turn off `dry_run` unless `allow_webhook_live_send` is true. URL settings cannot be changed from a webhook.
- The email check blocks fake "Re:" subjects, exclamation marks, links (unless allowed), unverified numbers, left-over placeholders, banned phrases, and facts that are not in the verified research.
- Every finished run produces a report with one row per lead and an honest `nothing_was_sent` flag.

## Settings (the `Config` node)

Open the `Config` node. Every setting is one row. Anything that says `REPLACE ME` must be filled in or the run stops with a clear message.

**Important:** in the default `llm_only` research mode the only evidence is the `notes` field on each company (also read from `signal` or `description`). A company with no notes and no research URL is marked `needs_review` and gets no email. Put real, checkable notes (recent news, hiring, launches) on each company, or set `research_source` to `http_search`.

Fill these first: `icp`, `target_titles` (separate with `;`), `company_name`, `product_summary`, `value_prop`, `sender_first_name`, `signature`.

| Setting | Allowed values | Default |
|---|---|---|
| `start_mode` | `from_icp` (steps 1 to 6) or `have_leads` (skip 1 and 2, use `leads_json`) | `from_icp` |
| `signals_source` | `icp_only` or `http` (uses `signals_url`) | `icp_only` |
| `companies_source` | `inline` (uses `companies_json`) or `http` (uses `companies_url`) | `inline` |
| `contacts_source` | `provided`, `provider_http` (uses `contacts_url`), `guess_syntax` | `provided` |
| `email_pattern` | `first.last`, `flast`, `first`, `firstlast`, `first_last`, `f.last` | `first.last` |
| `research_source` | `llm_only` or `http_search` (uses `research_url`) | `llm_only` |
| `email_mode` | `body_only` or `full_email` | `body_only` |
| `outreach_mode` | `log_only`, `mailbox`, `sequence_api` | `log_only` |
| `min_confidence` | 0 to 1, minimum fit score to continue | 0.6 |
| `max_leads`, `max_sends_per_run`, `throttle_seconds`, `max_words` | numbers | 10, 25, 30, 120 |
| `dry_run`, `allow_guessed_sends`, `allow_webhook_live_send`, `allow_private_urls`, `allow_links` | true / false | true, false, false, false, false |
| `callback_url` | https URL that receives the run summary | empty |

## Ways to start a run

1. **By hand**: open the workflow, click **Execute workflow** (the "Run" trigger).
2. **By webhook**: `POST` to `/webhook/pae-run` with header `X-PAE-Key: <your key>` and a JSON body. Only these fields may be overridden: `start_mode, icp, target_titles, signals, companies_json, leads_json, contacts_source, research_source, email_mode, max_leads, min_confidence, max_words, tone, value_prop, product_summary, company_name, sender_first_name, signature, dry_run, callback_url`. A bad body returns `400` with the reason. A good one returns `202` straight away, and the summary is posted to `callback_url` when the run ends.

Example body:

```json
{
  "icp": "US B2B software companies, 50 to 200 staff, selling to mid-market revenue teams",
  "target_titles": "VP Sales; Head of RevOps",
  "companies_json": "[{\"name\":\"Example Co\",\"domain\":\"example.com\"}]",
  "dry_run": true
}
```

## Connecting your own tools (steps 1 to 3, 4 and 6)

The workflow does not lock you to one vendor. It calls URLs you give it.

- **Contacts** (`provider_http`): the workflow `POST`s `{company_name, domain, target_titles[], limit}` to `contacts_url`. It accepts a list, or an object holding `contacts`, `people`, `results`, `data` or `items`. Each person may have `first_name/last_name` (or `name`), `title`, `email`, `linkedin_url`.
- **Research** (`http_search`): `POST`s `{query, company, domain, person_name, person_title}` to `research_url`. Evidence returned is what the verifier checks facts against.
- **Sequencer** (`sequence_api`): `POST`s `{lead_id, run_id, email, first_name, last_name, title, company, subject, body}` to `sequence_api_url`. A 2xx answer counts as queued. A 4xx or 5xx is reported as `send_failed`, never as sent.
- If your tool needs an API key: open the matching HTTP node in n8n (nodes starting `3b1`, `6b`, `8g`, `1b`, `2b`) and set Authentication to a credential. Never paste a key into a Config row or a prompt.
- Tool names such as Clay, Apollo or ZoomInfo are only examples of what could sit behind a contacts URL. The workflow was tested against a mock server, not those products.

## What each status means

`ready` (passed every check), `drafted` (email written, nothing sent), `queued` (accepted by your sequencing tool), `sent` (confirmed by real mailbox evidence), `send_unconfirmed` (the send step gave no confirmation), `send_failed`, `needs_review` (a check stopped it, the reason is in the row: no evidence, a rejected email, a DNS lookup failure), `skipped_low_fit`, `fit_failed` (scoring failed, which is a system problem and not a judgement), `skipped_no_contact`, `skipped_no_email`, `skipped_no_name`, `skipped_no_domain`, `skipped_no_route` (the mail domain does not exist or accepts no mail), `skipped_over_cap`, `research_failed`, `email_failed`.

## When helping the user

1. Ask for the seven required Config values before anything else. Do not invent them.
2. Always start with `dry_run: true`, `outreach_mode: log_only`, `max_leads: 3`.
3. Read the report rows to the user in plain words. Explain any `needs_review`, `skipped_*` or `*_failed` reason.
4. Before changing anything that sends, get a clear yes from the owner, and re-read the safety defaults above to them.
5. Do not claim the workflow is "production ready". State what was tested (see `QA-REPORT`) and what was not.
6. Follow the sender's local rules for cold email (identity, postal address, opt-out). This skill is not legal advice.
