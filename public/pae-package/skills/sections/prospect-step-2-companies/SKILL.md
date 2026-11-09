---
name: prospect-step-2-companies
description: Step 2 of Prospect Outreach. Loads, cleans, de-duplicates and fit-scores a list of target companies. Use when the user needs to prepare company data, choose a company source, or understand why companies were skipped in the n8n prospecting workflow.
---

# Step 2 - Companies

**Goal:** a clean list of companies that genuinely match the ICP.

**Config rows it uses:** `companies_source` (`inline` or `http`), `companies_json`, `companies_url`, `min_confidence`, `max_leads`.

## Input shape

A JSON list. Each company needs at least a `name` or a `domain`. Extra fields such as `industry`, `size` help the fit score. **`notes`** (also read from `signal` or `description`) matters most: it is the evidence step 4 may use, and a company without it gets no email in the default research mode. The workflow also accepts an object holding `items`, `data`, `companies`, `results` or `records`.

```json
[{"name": "Example Co", "domain": "example.com", "industry": "Software"}]
```

## What the workflow does

1. Cleans domains (strips `https://`, `www.`, paths), removes duplicates by domain then name, caps the list.
2. One AI step scores fit against the ICP from 0 to 1 and gives a one-line reason.
3. Companies below `min_confidence` become `skipped_low_fit`. If scoring itself fails the company is `fit_failed`, which is a system problem, not a judgement about the company.

## Rules

- Skipped companies still appear in the final report with the reason.
- Never raise `min_confidence` to hit a number of leads; lower `max_leads` instead.
- If every company fails with `fit_failed`, check the Anthropic credential before blaming the data.
- With `start_mode: have_leads`, this step is skipped and no fit score exists.

## Done when

The report shows only companies the user would be happy to call, and each skip has a reason they accept.
