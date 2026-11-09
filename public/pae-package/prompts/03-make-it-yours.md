# Prompt 3 - Combine it with your own skills and tools

Use this after Prompt 1 works. It asks your AI and your own n8n engineer to blend this template with the skills, tools and data you already have, and produce your own version.

Before you paste it, make a short list of:
- **Your skills** (for example your brand voice, your sales playbook, your ICP document).
- **Your tools** (for example CRM, contact data tool, email verifier, sequencer, search tool).
- **Your rules** (who you never contact, countries you do not email, tone, approval steps).

```text
You are my n8n engineer and GTM systems designer. Follow the rules in the skills "prospect-outreach" and "n8n-engineer-companion". Plain words. I am a beginner.

GOAL
Combine the Prospect Outreach template with MY skills and MY tools to produce MY OWN version, without breaking the safety rules.

MY SKILLS (names or pasted text): <list them>
MY TOOLS (name, what it does, how it is reached: API, webhook, MCP, or n8n node): <list them>
MY RULES: <list them>

DO THIS IN ORDER, AND STOP AFTER EACH PART FOR MY YES
1. PLAN. In 5 sentences: what my version does, what is reused from the template, what is new. List which of the 6 steps each of my tools replaces or feeds. Show it as a table: step | template does | my version does | tool.
2. GAPS. List anything you would have to guess. Ask me. Do not guess about my customers, prices, results or legal rules.
3. DESIGN. For each tool decide: n8n native node, HTTP Request node, or n8n MCP. Prefer the simplest. Keep these rules:
   - Only company fit, research and email use AI. Everything that must be repeatable stays code.
   - New data sources go behind a new Config option that is OFF by default.
   - Credentials are named n8n credentials. No keys in prompts, Code nodes or Config.
   - Anything that sends needs my explicit yes, and stays behind dry_run and outreach_mode.
   - Facts in an email must trace to evidence; guessed emails stay labelled.
4. BUILD. Edit the generator (tools/generate_workflows.py and tools/code/*.js) where possible, or give me the exact node changes. Then run tools/qa/run_all.sh if you can run code, or tell me exactly what you could not run.
5. FOLD IN MY SKILLS. Merge my brand voice, ICP and playbook into the Config defaults and the prompts for the email and research steps. Show me every changed prompt before you save it.
6. TEST PLAN. Give me tests from smallest to largest, ending with one deliberate failure to prove the alert works. Tell me which tests you ran and which I must run.
7. HANDOFF. Produce: an updated Config checklist, a one-page "how to run it", and a list of what is tested and what is not. Do not say "production ready".

OUTPUT FILES
- my-version/workflows/*.json
- my-version/CHANGES.md (what I changed and why, in plain words)
- my-version/SETUP.md (numbered steps for me)
```

## If you have a human n8n engineer

Send them the whole package and this prompt. They can use `prompts/04-n8n-engineer-handoff.md` as their brief.
