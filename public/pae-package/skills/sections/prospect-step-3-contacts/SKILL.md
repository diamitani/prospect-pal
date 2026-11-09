---
name: prospect-step-3-contacts
description: Step 3 of Prospect Outreach. Gets the people to contact at each company and labels how reliable each email address is. Use when the user is choosing a contacts source, wiring a contact data tool, or asking whether guessed emails are safe to send to.
---

# Step 3 - Contacts

**Goal:** a person and an email address for each company, with an honest label for how sure we are.

**Config rows it uses:** `contacts_source`, `contacts_url`, `contacts_per_company`, `email_pattern`, `dns_resolver_url`, `target_titles`.

## Three sources

| `contacts_source` | What happens | Email label |
|---|---|---|
| `provided` | People and emails come inside your company data (`people` list per company) | `provided` |
| `provider_http` | The workflow asks your contact tool at `contacts_url` | `provider` |
| `guess_syntax` | Builds an address from first name, last name, domain and `email_pattern` | `guessed_mx_ok` or `guessed_unverified` |

## The truth about guessed emails

- A guess is only a guess. The mail-server (MX) check proves the domain can receive mail. It does **not** prove the mailbox exists.
- A domain that does not exist, has no mail server, or declares it accepts no mail is skipped (`skipped_no_route`). If the DNS lookup itself fails the lead is marked `needs_review`.
- Guessed addresses are never sent unless `allow_guessed_sends` is true. Recommend using a dedicated email verifier before turning that on, and tell the user a bounce hurts their sending reputation.

## Calling a contact tool

The workflow sends `{company_name, domain, target_titles[], limit}` and accepts a list or an object with `contacts`, `people`, `results`, `data` or `items`. Set any API key as a credential on the `3b1` HTTP node, never in the URL or a Config row.

## Done when

Every lead shows where its email came from, and the user knows which ones could bounce.
