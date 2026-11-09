# QA report - Prospect Outreach (Prospect Pal) n8n template

**Date:** 2026-11-09  
**Created by:** Patrick Diamitani, Diamitani Industries, for SalesGency  
**Scope:** `workflows/pae-main.json` (62 working nodes + 5 notes), `workflows/pae-error-alert.json` (6 working nodes + 1 note), the Code-node sources, skills, prompts and docs in this package.

## Verdict: UNADJUDICATED (no open deterministic findings)

The Jev adjudication step (an independent review gateway) was not available in this session, so findings could not be independently confirmed or dismissed. Under the verdict rules that makes the verdict **UNADJUDICATED**. The deterministic checks below found **0 open findings** (0 BLOCK, 0 WARN) after fixes. This is not the same as an independent PASS.

## What was run, and the result

| # | Check | Result |
|---|---|---|
| 1 | Secret and key scan of the whole package (workflows, code, prompts, skills, docs) | 0 findings after fix (see findings table) |
| 2 | Structure lint: unique node names, valid connections, reachability, expression references, Code node JavaScript parses | 0 findings |
| 3 | Parameter lint against the installed n8n 2.35.7 node definitions. Every node type was introspected | 0 findings; "not introspected: none" |
| 4 | Lint self-test: 14 deliberately planted defects | 14 of 14 caught |
| 5 | Code-node behaviour tests with a shim, including hostile inputs (private hosts, bad URLs, hostile enums, placeholders, missing output) | 90 passed, 0 failed |
| 6 | Mutation checks: tests were re-run against deliberately broken copies of the Code. Run earlier in the build, not repeated after the final alert fix (`code_tests.js` supports `PAE_ROOT` to repeat it) | Planted breaks were detected (one earlier miss, MX "no record", was fixed by asserting the reason text) |
| 7 | End to end on a real n8n 2.35.7 (`n8n execute`), 13 scenarios, mock servers | 26 checks, 0 failed |
| 8 | Webhook tests on a real running n8n: wrong key, missing key, bad enum, private callback, good call, early 202, override allow-list, callback arrives later | 9 checks, 0 failed |
| 9 | Error-workflow test: a production run fails on purpose, the alert must arrive with no lead data | PASS |

Re-run everything with `tools/qa/run_all.sh`.

## Findings

| Severity | Finding | Status |
|---|---|---|
| Medium | Webhook validation errors returned 200 with an empty body | Fixed: 400 with reason |
| Medium | The 202 reply was sent only after the whole run | Fixed: reply moved before the long work, measured under 3 s while the run takes over 4 s |
| Medium | Failure alert text was cut off and could omit the real cause (n8n splits the message at a colon) | Fixed: alert uses the first line of the stack; test added |
| Low | Alert formatter referenced a node that does not exist in the alert workflow | Fixed |
| Low | A scoring failure was labelled `skipped_low_fit` | Fixed: new `fit_failed` status |
| Low | The package-wide secret scan flagged a dummy key inside the lint self-test | Fixed: the dummy value is now built at run time so no key-shaped text exists in any file |
| Info | `tools/test/creds.json` holds dummy test values (for example `test-key-123`) used only against the local mock | Accepted, not a real secret |

## Claims audit

| Claim made in the package | Traced to |
|---|---|
| Nothing is sent with default settings | scenarios `smoke`, `leads`, `guess` (no outreach endpoint touched) |
| Guessed addresses are not sent unless allowed | scenarios `sequence_live`, `sequence_live_guess` |
| A rejected push is `send_failed`, not `sent` | scenario `sequence_reject` |
| A disabled SMTP node cannot fake a send | scenario `mailbox_disabled` |
| Live mode without an opt-out line pushes nothing | scenario `nosig` |
| Webhook rules | `e2e_webhook.py` |
| Alert has no lead data | `e2e_errorflow.py` plus code test |

## What was NOT verified (read this)

- **Nothing was imported into your n8n, activated there, or sent.** Everything ran on a scratch n8n inside the build environment.
- Tested on **n8n 2.35.7 only**.
- **Anthropic, DNS, contact, research and sequencer endpoints were mock servers.** Real model answers, real contact tools (Clay, Apollo, ZoomInfo or others) and real sequencers were not called. Model output quality was not evaluated.
- The **SMTP send path was not run against a real mail server.** The node ships disabled.
- Credential selection in the n8n editor after import (the red-warning step) was not exercised in the user interface.
- Model cost per run and deliverability were not measured.
- No independent (Jev gateway) adjudication.
- This is not legal advice. Cold-email rules vary by country.

## Still your move

1. Import into a non-production n8n and do one manual dry run.
2. Create the three credentials by name and link the error workflow.
3. Test one real send to an inbox you control before any real prospect.
4. Set up SPF, DKIM and DMARC on the sending domain.
