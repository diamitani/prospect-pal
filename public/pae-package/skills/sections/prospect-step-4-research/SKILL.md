---
name: prospect-step-4-research
description: Step 4 of Prospect Outreach. Gathers facts about the person and company and keeps only facts backed by evidence. Use when the user wants better personalisation, is wiring a research or search tool, or sees "hooks_dropped" or no-evidence leads in the n8n prospecting workflow.
---

# Step 4 - Research

**Goal:** a few true, specific things worth mentioning, each tied to evidence.

**Config rows it uses:** `research_source` (`llm_only` or `http_search`), `research_url`.

## How it works

1. **Prepare** (code): collects what is known (company data, signals, any text from `research_url`).
2. **Has evidence?** Evidence is the company `notes` you supplied plus any text returned from `research_url`. If there are fewer than about 40 characters of it, the lead is marked `needs_review` with the reason `no_evidence` and no email is written. Fix it by adding notes for that company or using `http_search`.
3. **Research** (one AI step): proposes "hooks" (possible opening points), each with the evidence it relies on.
4. **Verify** (code): keeps a hook only if its evidence really appears in the material supplied. Anything else is dropped and counted as `hooks_dropped` in the report.

## Rules

- `llm_only` means the model only sees the notes you gave it. It must not claim recent news, numbers or quotes. If the user wants fresh facts without typing notes, set `research_source: http_search` and point `research_url` at a search or enrichment tool they trust.
- The workflow sends `{query, company, domain, person_name, person_title}` to `research_url` and uses the text that comes back as evidence.
- A high `hooks_dropped` count is good news: the checker is working. Do not loosen it.
- Do not add personal or sensitive facts (family, health, home address). Stick to professional, public information.

## Done when

Every hook in an email can be traced to a line of evidence in the run.
