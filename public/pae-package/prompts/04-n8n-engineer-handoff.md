# Brief for an n8n engineer (human or AI)

**What this is:** a 62-node n8n workflow (plus 5 sticky notes) and a 6-node error workflow that takes an ideal-customer description to drafted (or, when switched on, sent) personalised cold emails. Created by Patrick Diamitani, Diamitani Industries, for SalesGency.

## What to review first

1. `docs/workflow-overview.md` - every step, whether it is code or AI, and what happens on failure.
2. `docs/diagrams/` and `docs/overview.html` - the picture.
3. `QA-REPORT-prospect-outreach-2026-11-09.md` - exactly what was checked and what was not.
4. `tools/generate_workflows.py` and `tools/code/*.js` - the workflows are generated from these. Edit these, regenerate, run `tools/qa/run_all.sh`.

## Facts you need

- Built and tested against **n8n 2.35.7**. Node versions are pinned (see the companion skill).
- Credentials by name: `PAE Anthropic` (anthropicApi), `PAE Webhook Key` (httpHeaderAuth, header `X-PAE-Key`), `PAE SMTP` (smtp). Their ids in the JSON are placeholders.
- Webhook: `POST /webhook/pae-run`, header-key auth, validated body, `400` on bad input, early `202`, results by `callback_url`.
- LLM nodes: Anthropic chat model `claude-sonnet-5-5`, structured output parser, no tools, no agents.
- The `8d. Send Email (SMTP)` node ships **disabled** on purpose.
- HTTP nodes use no authentication by default. Add credentials in the node if your tool needs a key.

## Not done, on purpose or by limit

- Nothing was imported into the owner's n8n. Nothing was activated there. Nothing was sent.
- The SMTP path was not run against a real mail server.
- Anthropic, DNS and every contact/research/sequencer endpoint were mocked in tests.
- Credential selection in the n8n editor after import was not exercised in the UI.
- Not tested on any n8n version other than 2.35.7.

## Acceptance checklist before the owner turns sending on

- [ ] Imported into a non-production n8n and one manual run read end to end
- [ ] Credentials created by name, nodes show no red warnings
- [ ] Error workflow linked, and a deliberate failure produced an alert with no lead data
- [ ] Real SMTP or sequencer tested with 1 lead to an inbox the owner controls
- [ ] Signature has a postal address and an opt-out line
- [ ] `dry_run` / `outreach_mode` / `allow_guessed_sends` / `allow_webhook_live_send` reviewed with the owner
- [ ] Sender domain has SPF, DKIM and DMARC set up
