---
name: prospect-step-5-email
description: Step 5 of Prospect Outreach. Writes a short personalised cold email from verified facts and runs automatic quality checks. Use when the user wants to change tone, length, signature or understand why an email was held in the n8n prospecting workflow.
---

# Step 5 - Email personalisation

**Goal:** a short plain email that is true, specific and easy to say no to.

**Config rows it uses:** `company_name`, `product_summary`, `value_prop`, `tone`, `sender_first_name`, `signature`, `email_mode` (`body_only` or `full_email`), `max_words`, `allow_links`.

## How it works

1. **Write** (one AI step): uses only the verified hooks plus your product summary and value proposition.
2. **Check** (code) - the lead becomes `needs_review`, with the reason in the report, if any of these fail:
   - subject too long, fake "Re:" or "Fwd:" subject, exclamation mark
   - too long (over `max_words`) or too short
   - a link when `allow_links` is false
   - placeholder text left in (for example `[Name]` or `REPLACE ME`)
   - a banned hype phrase
   - a number that was not in the verified evidence
   - a hook that was not verified
   - no opt-out line in the signature, when the run could actually send

## Writing guidance to give the user

- One idea, one ask, under 120 words. Open with the specific fact, not with "I hope you are well".
- No invented urgency, no fake familiarity, no claims about results you cannot prove.
- Put your postal address and an opt-out line (for example "Reply STOP to opt out") in `signature`. Follow the rules where your recipients live. This is not legal advice.

## Done when

The user would be comfortable seeing their own name on every email in the report.
