---
name: prospect-step-1-signals-icp
description: Step 1 of Prospect Outreach. Turns an ideal-customer description and buying signals into a clear brief the rest of the workflow uses. Use when the user needs to define or sharpen their ICP, target titles or signals before running the n8n prospecting workflow.
---

# Step 1 - Signals and ICP

**Goal:** a short, specific brief: who the customer is, who to contact, and what events suggest they are ready to talk.

**Config rows it uses:** `icp`, `target_titles`, `signals`, `signals_source` (`icp_only` or `http`), `signals_url`.

## Help the user write

- **icp**: 2 to 3 plain sentences. Industry, company size, who buys, the problem they have. Example: "US B2B software companies with 50 to 200 staff selling to mid-market revenue teams. They are adding sales headcount and their reps spend hours on research."
- **target_titles**: the buyers, separated by `;`. Example: `VP Sales; Head of RevOps; Director of Sales Enablement`.
- **signals**: one per line. Events you can check, such as "hiring a sales leader", "raised funding in the last 12 months", "launched a new product line". Avoid vague ones like "growing fast".

## Rules

- Do not invent customers, numbers or proof points. If the user has none, leave them out.
- A signal is only useful if someone could check it. If it cannot be checked, rewrite it or drop it.
- With `signals_source: http`, the workflow fetches `signals_url` (https only) and merges what it finds. The ICP stays the user's own words.

## Done when

The user can read the brief aloud and a stranger could tell whether a company fits.
