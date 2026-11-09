---
name: prospect-step-6-outreach
description: Step 6 of Prospect Outreach. Decides whether a checked email is only logged, queued in a sequencing tool, or sent from a mailbox, and reports honestly what happened. Use when the user wants to go from drafts to real sending or needs to debug a send in the n8n prospecting workflow.
---

# Step 6 - Outreach

**Goal:** the right thing happens to each clean email, and the report never overstates it.

**Config rows it uses:** `outreach_mode` (`log_only`, `mailbox`, `sequence_api`), `dry_run`, `mailbox_from`, `sequence_api_url`, `allow_guessed_sends`, `allow_webhook_live_send`, `max_sends_per_run`, `throttle_seconds`, `callback_url`.

## Decision order (first match wins, so nothing sends by accident)

1. `outreach_mode` is `log_only` -> draft only.
2. `dry_run` is true -> draft only.
3. Over `max_sends_per_run` -> draft only.
4. Email is a guess and `allow_guessed_sends` is false -> draft only, with the reason.
5. `mailbox` -> wait (`throttle_seconds`), then the Send Email node (SMTP).
6. `sequence_api` -> wait, then `POST` to your sequencing tool.

## Going live: a checklist to walk the user through

1. Run several times in dry run and read every draft.
2. Confirm the signature has a name, company, postal address and an opt-out line.
3. For `mailbox`: create the `PAE SMTP` credential, **enable** the `8d. Send Email` node (it ships disabled), set `mailbox_from`.
4. For `sequence_api`: set `sequence_api_url`, add authentication on node `8g`.
5. Set `max_leads: 3` and `max_sends_per_run: 3`. Set `dry_run: false` and change `outreach_mode`.
6. Run once by hand, check the mailbox or tool, and only then raise limits.
7. Webhook runs stay in dry run unless `allow_webhook_live_send` is true. Leave it off unless the user understands why it exists.

## Honest reporting

- `sent` (mailbox) appears only when real evidence comes back (a message id or an accepted recipient). A 2xx from the sequencer is `queued`.
- A disabled Send node produces `send_unconfirmed`, never `sent`.
- A 4xx or 5xx from the sequencer is `send_failed`.
- The summary includes `nothing_was_sent` so a quiet dry run cannot be mistaken for a live one.

## Done when

The user can say exactly how many emails left their system, and the report agrees with their mailbox or tool.
