"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo, Button, Badge, Icon, SectionHeading } from "@/components/ds";

const SIX_STEPS_CARDS = [
  {
    step: "01",
    group: "Steps 1 to 3: Find who to reach out to",
    title: "Identify your signals / ICP",
    engine: "Deterministic Code (optional HTTP signal fetch)",
    question: "What do you connect to in order to identify your signals?",
    label: "CONNECT TO",
    bullets: [
      "A workflow from another system",
      "A web search",
      "A general prompt",
      "Or just the ICP defined",
    ],
    feeds: "Feeds -> 02 Companies",
  },
  {
    step: "02",
    group: "Steps 1 to 3: Find who to reach out to",
    title: "Generate list of company targets",
    engine: "Code + 1 AI step for ICP fit scoring",
    question:
      "However you divide it, break your targets down into one list of companies or organizations. Where does that list live?",
    label: "SOURCE",
    bullets: [
      "A spreadsheet (inline JSON or CSV)",
      "Your CRM",
      "Webhooked data from another workflow",
    ],
    feeds: "Feeds -> 03 Contacts",
  },
  {
    step: "03",
    group: "Steps 1 to 3: Find who to reach out to",
    title: "Find contact information for buyer personas",
    engine: "Code + DNS MX record check (Already have leads? Skip steps 1 & 2)",
    question: "You reach out to a person, or their agent. Three ways to get them:",
    label: "FIND VIA",
    bullets: [
      "Web search + LinkedIn: learn email syntax, guess, and test with MX verification",
      "Data tool: ZoomInfo, Clay, Apollo and similar",
      "Already have them: bought a list? Ignore steps 1 and 2 (signal and company)",
    ],
    feeds: "Feeds -> 04 Research",
  },
  {
    step: "04",
    group: "Steps 4 to 6: Say it well, then send it",
    title: "Conduct research on prospect and signals",
    engine: "1 AI step + Code evidence verification",
    question:
      "The most important step: find out why they might be customers. Keeps only opening points that trace back to supplied evidence (company notes or research URL).",
    label: "BRIEF COVERS",
    bullets: [
      "Company overview & Prospect overview",
      "Signal: induced (explicit facts)",
      "Signal: deduced (relevant challenges)",
      "Your company's products, services & value proposition",
    ],
    feeds: "Feeds -> 05 Email",
  },
  {
    step: "05",
    group: "Steps 4 to 6: Say it well, then send it",
    title: "Write personalized email based on research",
    engine: "1 AI step + Code QA guardrails",
    question:
      "Turn the research into a compelling email in your company or rep tone using only verified facts.",
    label: "CHOOSE ONE",
    bullets: [
      "Full email: Hi, First name, body and signature",
      "Body only: no intro greeting or signature, set as a CRM token: Hi [First Name], [Email 1 Body], Best, [Signature]",
    ],
    feeds: "Feeds -> 06 Outreach",
  },
  {
    step: "06",
    group: "Steps 4 to 6: Say it well, then send it",
    title: "Connect to outreach tool and enroll in sequence",
    engine: "Deterministic Code (drafts by default: dry_run=true, log_only)",
    question: "What is going to do the sending? Two routes:",
    label: "SEND VIA",
    bullets: [
      "Mailbox direct: add subject line, map email body to message, and send per row",
      "Platform with sequence automation: connector or API calls to enroll each contact",
    ],
    feeds: "Result -> contacts enrolled and sending",
  },
];

const GUIDED_PROMPTS: Record<
  "p1" | "p2" | "p3" | "p4",
  {
    badge: string;
    title: string;
    file: string;
    downloadHref: string;
    summary: string;
    text: string;
  }
> = {
  p1: {
    badge: "Prompt 01 - Start Here",
    title: "Install the template step by step",
    file: "prompts/01-setup-prompt.md",
    downloadHref: "/pae-package/prompts/01-setup-prompt.md",
    summary:
      "Paste into Claude, ChatGPT, Gemini, or your n8n engineer agent after attaching the template files. Guides you one numbered step at a time in safe mode.",
    text: `You are my n8n engineer and setup guide. I am a beginner. Use plain words and give me one numbered step at a time. Wait for me to say "done" before the next step.

WHAT I HAVE
A package called "Prospect Outreach (Prospect Pal) n8n template". It contains:
- workflows/pae-main.json  (the 6-step prospecting workflow, 62 working nodes)
- workflows/pae-error-alert.json  (sends a failure alert, no lead data)
- skills/prospect-outreach/SKILL.md and skills/n8n-engineer-companion/SKILL.md
- skills/sections/*/SKILL.md  (one skill per step)
Read the two main skills first. They are the rules you must follow.

WHAT I WANT
Install this in MY n8n and get one safe test run working. Then help me make it my own.

RULES
1. Never ask me to paste a secret, API key or password into this chat. Tell me which n8n credential to create and where to type the key myself.
2. Do not tell me anything was imported, activated or sent unless I tell you I saw it happen.
3. Start in safe mode and keep it there: dry_run = true, outreach_mode = log_only, max_leads = 3.
4. Do not turn on sending, guessed-email sending, or webhook live sending without asking me, reading me the risk, and getting a clear "yes".
5. If I use n8n Cloud or self-hosted, ask me which, and ask my n8n version (Settings, About). The template was tested on n8n 2.35.7. If mine is very different, warn me which nodes may need re-checking.
6. If you can reach my n8n directly with a tool, say exactly what you are about to change and wait for my yes. If you cannot, give me the steps to do it myself.

STEPS TO GUIDE ME THROUGH
A. Create three credentials in n8n with these exact names:
   - "PAE Anthropic" (Anthropic API)
   - "PAE Webhook Key" (Header Auth, header name X-PAE-Key, value = a long random string I generate)
   - "PAE SMTP" (SMTP, only if I plan to send from a mailbox later)
B. Import pae-error-alert.json, then pae-main.json (Import from file).
C. In the main workflow settings, set Error Workflow to the alert workflow.
D. Open the "Config" node and help me replace every "REPLACE ME": icp, target_titles, company_name, product_summary, value_prop, sender_first_name, signature.
E. Help me replace the example company with 2 or 3 real companies, each with real "notes" (recent news, hiring, launches).
F. Run it once by hand with Execute workflow. Read the final report to me in plain words.`,
  },
  p2: {
    badge: "Prompt 02 - Verify Skills",
    title: "Upload the 8 skills & run the 5-question verification test",
    file: "prompts/02-upload-skills.md",
    downloadHref: "/pae-package/prompts/02-upload-skills.md",
    summary:
      "After uploading skills-zips/ into Claude, Claude Code (~/.claude/skills/), Cursor, or Antigravity, paste this prompt to verify the skills loaded.",
    text: `Without opening any file, tell me:
1. The six steps of the Prospect Outreach workflow, in order.
2. Which three steps use AI.
3. The safe-mode settings the workflow starts in.
4. Why a guessed email address is never sent by default.
5. The three n8n credential names I need to create.
If you cannot answer, tell me which skill did not load.`,
  },
  p3: {
    badge: "Prompt 03 - Customize",
    title: "Combine the template with your own skills and tools",
    file: "prompts/03-make-it-yours.md",
    downloadHref: "/pae-package/prompts/03-make-it-yours.md",
    summary:
      "Blends the 6-step template with your own CRM, contact data tool, email verifier, sequencer, and brand voice rules without weakening safety guards.",
    text: `You are my n8n engineer and GTM systems designer. Follow the rules in the skills "prospect-outreach" and "n8n-engineer-companion". Plain words. I am a beginner.

GOAL
Combine the Prospect Outreach template with MY skills and MY tools to produce MY OWN version, without breaking the safety rules.

MY SKILLS (names or pasted text): <list them>
MY TOOLS (name, what it does, how it is reached: API, webhook, MCP, or n8n node): <list them>
MY RULES: <list them>

DO THIS IN ORDER, AND STOP AFTER EACH PART FOR MY YES
1. PLAN. In 5 sentences: what my version does, what is reused from the template, what is new. Show a table: step | template does | my version does | tool.
2. GAPS. List anything you would have to guess. Ask me.
3. DESIGN. For each tool decide: n8n native node, HTTP Request node, or n8n MCP. Keep these rules:
   - Only company fit, research and email use AI. Everything that must be repeatable stays code.
   - New data sources go behind a new Config option that is OFF by default.
   - Credentials are named n8n credentials. No keys in prompts, Code nodes or Config.
   - Anything that sends needs my explicit yes, and stays behind dry_run and outreach_mode.
   - Facts in an email must trace to evidence; guessed emails stay labelled.
4. BUILD. Edit the generator or give me the exact node changes.
5. FOLD IN MY SKILLS. Merge my brand voice, ICP and playbook into the Config defaults and prompts.
6. TEST PLAN. Give me tests from smallest to largest, ending with one deliberate failure to prove the alert works.
7. HANDOFF. Produce my-version/workflows/*.json, my-version/CHANGES.md, and my-version/SETUP.md.`,
  },
  p4: {
    badge: "Prompt 04 - Engineer Brief",
    title: "One-page handoff brief for an n8n engineer (human or AI)",
    file: "prompts/04-n8n-engineer-handoff.md",
    downloadHref: "/pae-package/prompts/04-n8n-engineer-handoff.md",
    summary:
      "Technical handoff covering n8n 2.35.7 pinned node versions, webhook hardening (POST /webhook/pae-run, X-PAE-Key, early 202), and pre-send acceptance checklist.",
    text: `Brief for an n8n engineer (human or AI)
What this is: a 62-node n8n workflow (plus 5 sticky notes) and a 6-node error workflow that takes an ideal-customer description to drafted (or, when switched on, sent) personalised cold emails.

Facts you need:
- Built and tested against n8n 2.35.7.
- Credentials by name: "PAE Anthropic" (anthropicApi), "PAE Webhook Key" (httpHeaderAuth, header X-PAE-Key), "PAE SMTP" (smtp).
- Webhook: POST /webhook/pae-run, header-key auth, validated body, 400 on bad input, early 202, results by callback_url.
- LLM nodes: Anthropic chat model claude-sonnet-5-5, structured output parser, no tools, no agents.
- The "8d. Send Email (SMTP)" node ships disabled on purpose.

Acceptance checklist before turning sending on:
[ ] Imported into a non-production n8n and one manual run read end to end
[ ] Credentials created by name, nodes show no red warnings
[ ] Error workflow linked, and a deliberate failure produced an alert with no lead data
[ ] Real SMTP or sequencer tested with 1 lead to an inbox the owner controls
[ ] Signature has a postal address and an opt-out line
[ ] Sender domain has SPF, DKIM and DMARC set up`,
  },
};

const SKILL_ZIPS = [
  {
    name: "Prospect Outreach (Main Skill)",
    slug: "prospect-outreach.zip",
    href: "/pae-package/skills-zips/prospect-outreach.zip",
    when: "Always upload first",
    desc: "Teaches your AI how all 6 steps, the Config node, and safe-mode rules work.",
  },
  {
    name: "n8n Engineer Companion (Main Skill)",
    slug: "n8n-engineer-companion.zip",
    href: "/pae-package/skills-zips/n8n-engineer-companion.zip",
    when: "Always upload first",
    desc: "Install checklist, 8 safety rules, n8n 2.35.7 traps, and pinned node versions.",
  },
  {
    name: "Step 01: Signals & ICP",
    slug: "prospect-step-1-signals-icp.zip",
    href: "/pae-package/skills-zips/prospect-step-1-signals-icp.zip",
    when: "Defining who to target",
    desc: "Helps structure ICP criteria, signal sources, and workflow origins.",
  },
  {
    name: "Step 02: Companies",
    slug: "prospect-step-2-companies.zip",
    href: "/pae-package/skills-zips/prospect-step-2-companies.zip",
    when: "Preparing company lists",
    desc: "Guides inline JSON/CSV lists, CRM extracts, deduplication, and AI fit scoring.",
  },
  {
    name: "Step 03: Contacts",
    slug: "prospect-step-3-contacts.zip",
    href: "/pae-package/skills-zips/prospect-step-3-contacts.zip",
    when: "Choosing or wiring a contact tool",
    desc: "Covers provided contacts, provider HTTP (Clay/Apollo/ZoomInfo), and syntax + MX checks.",
  },
  {
    name: "Step 04: Research",
    slug: "prospect-step-4-research.zip",
    href: "/pae-package/skills-zips/prospect-step-4-research.zip",
    when: "Tuning deep research & evidence",
    desc: "Enforces evidence-backed induced/deduced signals from company notes or research URLs.",
  },
  {
    name: "Step 05: Email Personalization",
    slug: "prospect-step-5-email.zip",
    href: "/pae-package/skills-zips/prospect-step-5-email.zip",
    when: "Tuning tone, length & CRM tokens",
    desc: "Full email vs body_only CRM token plus QA checks against fabricated claims.",
  },
  {
    name: "Step 06: Outreach Execution",
    slug: "prospect-step-6-outreach.zip",
    href: "/pae-package/skills-zips/prospect-step-6-outreach.zip",
    when: "Moving from drafts to live sending",
    desc: "Safe graduation from dry_run/log_only to mailbox SMTP or sequence_api.",
  },
];

const CONFIG_SETTINGS = [
  {
    key: "start_mode",
    allowed: "from_icp (steps 1-6) | have_leads (skip 1 & 2, use leads_json)",
    defaultVal: "from_icp",
  },
  {
    key: "signals_source",
    allowed: "icp_only | http (uses signals_url)",
    defaultVal: "icp_only",
  },
  {
    key: "companies_source",
    allowed: "inline (uses companies_json) | http (uses companies_url)",
    defaultVal: "inline",
  },
  {
    key: "contacts_source",
    allowed: "provided | provider_http (uses contacts_url) | guess_syntax",
    defaultVal: "provided",
  },
  {
    key: "research_source",
    allowed: "llm_only (uses company notes) | http_search (uses research_url)",
    defaultVal: "llm_only",
  },
  {
    key: "email_mode",
    allowed: "body_only (CRM token) | full_email (Hi First name + body + sig)",
    defaultVal: "body_only",
  },
  {
    key: "outreach_mode",
    allowed: "log_only | mailbox | sequence_api",
    defaultVal: "log_only",
  },
  {
    key: "dry_run / allow_guessed_sends / allow_webhook_live_send",
    allowed: "true / false safety locks",
    defaultVal: "true / false / false",
  },
];

export default function TemplatesPage() {
  const [activePrompt, setActivePrompt] = useState<"p1" | "p2" | "p3" | "p4">(
    "p1"
  );
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(GUIDED_PROMPTS[activePrompt].text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      {/* Top Navigation (<= 80px single-line) */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          height: 68,
          padding: "0 32px",
          background: "rgba(251,250,248,0.88)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border-hairline)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/home"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Logo size={32} />
          </Link>
          <Badge tone="brand">n8n Template &amp; Skills Kit</Badge>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link
            href="/home#workbench"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            Vertical Workbench
          </Link>
          <Link
            href="/packages"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            MCP &amp; Marketplace
          </Link>
          <Link
            href="/how-it-works"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            Architecture
          </Link>
          <Link
            href="/home#pricing"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            Pricing
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a
            href="/pae-package/prospect-outreach-n8n-template.zip"
            download
            style={{ textDecoration: "none" }}
          >
            <Button variant="accent" size="sm" icon="Download">
              Download Full Template (.zip)
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero (Matches Page 1 & Page 2 of Prospect Outreach Workflow PDF) */}
      <section
        style={{
          padding: "64px 32px 48px",
          maxWidth: "var(--layout-max)",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 12px",
            borderRadius: 999,
            background: "var(--cobalt-50)",
            border: "1px solid var(--cobalt-100)",
            color: "var(--cobalt-600)",
            fontFamily: "var(--font-data)",
            fontSize: 11,
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          <Icon name="Workflow" size={13} color="var(--cobalt-600)" />
          PROSPECT AUTOMATION SYSTEM - N8N 2.35.7 TEMPLATE (62 NODES + 8 SKILLS)
        </div>

        <h1
          style={{
            margin: "0 0 14px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(36px, 4.4vw, 54px)",
            letterSpacing: "-0.025em",
            lineHeight: 1.08,
            color: "var(--text-primary)",
          }}
        >
          Six steps from signal to sequence.{" "}
          <span style={{ color: "var(--cobalt-600)" }}>
            Everything else is a connector, prompt, tool.
          </span>
        </h1>

        <p
          style={{
            margin: "0 0 28px",
            fontSize: 18,
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            maxWidth: 760,
          }}
        >
          Download the ready-to-import 62-node <code>pae-main.json</code> and
          6-node <code>pae-error-alert.json</code> n8n workflows, 8 modular AI
          skills, and 4 guided setup prompts. Drafts by default (
          <code>dry_run = true</code>, <code>outreach_mode = log_only</code>) so
          nothing is ever sent until you flip the switch.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <a
            href="/pae-package/prospect-outreach-n8n-template.zip"
            download
            style={{ textDecoration: "none" }}
          >
            <Button variant="accent" size="lg" icon="Download">
              Download Full Package (.zip)
            </Button>
          </a>
          <a
            href="/pae-package/workflows/pae-main.json"
            download="pae-main.json"
            style={{ textDecoration: "none" }}
          >
            <Button variant="outline" size="lg" icon="FileCode">
              pae-main.json (62 Nodes)
            </Button>
          </a>
          <a
            href="/pae-package/workflows/pae-error-alert.json"
            download="pae-error-alert.json"
            style={{ textDecoration: "none" }}
          >
            <Button variant="outline" size="lg" icon="ShieldCheck">
              pae-error-alert.json (6 Nodes)
            </Button>
          </a>
        </div>
      </section>

      {/* The Sales Outreach Workflow Diagram Banner (Page 2 of PDF) */}
      <section
        style={{
          padding: "24px 32px 64px",
          maxWidth: "var(--layout-max)",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            padding: 28,
            borderRadius: "var(--radius-xl)",
            background: "var(--surface-deep)",
            color: "var(--paper-0)",
            border: "1px solid var(--border-deep)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--champagne-300)",
                  marginBottom: 4,
                }}
              >
                THE SALES OUTREACH WORKFLOW
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                01 Signals -&gt; 02 Companies -&gt; 03 Contacts -&gt; 04
                Research -&gt; 05 Email -&gt; 06 Outreach
              </div>
            </div>

            <div
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px dashed var(--champagne-300)",
                fontFamily: "var(--font-data)",
                fontSize: 11,
                color: "var(--champagne-300)",
              }}
            >
              Already have leads? Skip steps 1 and 2 (start_mode = have_leads)
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {SIX_STEPS_CARDS.map((card) => (
              <div
                key={card.step}
                style={{
                  padding: 20,
                  borderRadius: "var(--radius-lg)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border-deep)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-data)",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--champagne-300)",
                        background: "rgba(255,255,255,0.08)",
                        padding: "3px 8px",
                        borderRadius: 6,
                      }}
                    >
                      STEP {card.step}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-data)",
                        fontSize: 10,
                        color: "var(--ink-300)",
                      }}
                    >
                      {card.feeds}
                    </span>
                  </div>

                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontFamily: "var(--font-display)",
                      fontSize: 17,
                      fontWeight: 700,
                      color: "var(--paper-0)",
                    }}
                  >
                    {card.title}
                  </h3>

                  <div
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: 11,
                      color: "var(--champagne-300)",
                      marginBottom: 10,
                    }}
                  >
                    {card.engine}
                  </div>

                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--ink-200)",
                      lineHeight: 1.5,
                      marginBottom: 12,
                    }}
                  >
                    {card.question}
                  </p>
                </div>

                <div
                  style={{
                    paddingTop: 10,
                    borderTop: "1px solid var(--border-deep)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--ink-300)",
                      marginBottom: 6,
                    }}
                  >
                    {card.label}
                  </div>
                  <div style={{ display: "grid", gap: 4 }}>
                    {card.bullets.map((b) => (
                      <div
                        key={b}
                        style={{
                          fontSize: 12,
                          color: "var(--paper-0)",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 6,
                        }}
                      >
                        <span style={{ color: "var(--champagne-300)" }}>*</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guided Prompts Switcher (01-setup-prompt.md to 04-n8n-engineer-handoff.md) */}
      <section
        style={{
          padding: "64px 32px",
          background: "var(--surface-sunken)",
          borderTop: "1px solid var(--border-hairline)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <div style={{ maxWidth: "var(--layout-max)", margin: "0 auto" }}>
          <SectionHeading
            eyebrow="Guided AI Setup & Customization"
            title="4 Copy-and-Paste Prompts for Your AI & n8n Engineer"
            description="Paste Prompt 01 into Claude, ChatGPT, Gemini, or Cursor to install the workflow in 15 minutes, then use Prompt 03 to blend it with your own skills and tools."
          />

          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            {(
              Object.keys(GUIDED_PROMPTS) as Array<keyof typeof GUIDED_PROMPTS>
            ).map((key) => {
              const p = GUIDED_PROMPTS[key];
              const isSelected = activePrompt === key;
              return (
                <button
                  key={key}
                  onClick={() => setActivePrompt(key)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "var(--radius-md)",
                    border: isSelected
                      ? "1.5px solid var(--cobalt-600)"
                      : "1px solid var(--border-hairline)",
                    background: isSelected
                      ? "var(--cobalt-600)"
                      : "var(--surface-card)",
                    color: isSelected ? "white" : "var(--text-primary)",
                    fontFamily: "var(--font-data)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {p.badge}
                </button>
              );
            })}
          </div>

          <div
            style={{
              borderRadius: "var(--radius-xl)",
              background: "var(--surface-deep)",
              border: "1px solid var(--border-deep)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 22px",
                borderBottom: "1px solid var(--border-deep)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 700,
                    color: "var(--paper-0)",
                    marginBottom: 4,
                  }}
                >
                  {GUIDED_PROMPTS[activePrompt].title}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-300)" }}>
                  {GUIDED_PROMPTS[activePrompt].summary}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleCopyPrompt}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 6,
                    border: "1px solid var(--border-deep)",
                    background: "var(--cobalt-600)",
                    color: "white",
                    fontFamily: "var(--font-data)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {copiedPrompt ? "Copied to Clipboard!" : "Copy Prompt"}
                </button>
                <a
                  href={GUIDED_PROMPTS[activePrompt].downloadHref}
                  download
                  style={{
                    padding: "7px 14px",
                    borderRadius: 6,
                    border: "1px solid var(--border-deep)",
                    background: "rgba(255,255,255,0.06)",
                    color: "var(--champagne-300)",
                    fontFamily: "var(--font-data)",
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Download .md
                </a>
              </div>
            </div>

            <pre
              style={{
                margin: 0,
                padding: 22,
                fontFamily: "var(--font-data)",
                fontSize: 12,
                lineHeight: 1.6,
                color: "var(--paper-0)",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              <code>{GUIDED_PROMPTS[activePrompt].text}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 8 Downloadable Zipped Skills */}
      <section
        style={{
          padding: "64px 32px",
          maxWidth: "var(--layout-max)",
          margin: "0 auto",
        }}
      >
        <SectionHeading
          eyebrow="8 Ready-to-Upload Skill Archives"
          title="Companion Skills for Claude, Claude Code, Cursor & Antigravity"
          description="Upload the two main skills first (prospect-outreach.zip and n8n-engineer-companion.zip), plus any of the 6 step skills for step-by-step coaching."
        />

        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {SKILL_ZIPS.map((sk) => (
            <div
              key={sk.slug}
              style={{
                padding: 20,
                borderRadius: "var(--radius-lg)",
                background: "var(--surface-card)",
                border: "1px solid var(--border-hairline)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--cobalt-600)",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  {sk.when}
                </div>
                <h3
                  style={{
                    margin: "0 0 6px",
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {sk.name}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    marginBottom: 14,
                  }}
                >
                  {sk.desc}
                </p>
              </div>

              <a
                href={sk.href}
                download={sk.slug}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-data)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--cobalt-600)",
                  textDecoration: "none",
                }}
              >
                <Icon name="Download" size={13} color="var(--cobalt-600)" />
                {sk.slug}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Config Node Reference & QA Verification Summary */}
      <section
        style={{
          padding: "64px 32px",
          background: "var(--surface-sunken)",
          borderTop: "1px solid var(--border-hairline)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--layout-max)",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 24,
          }}
        >
          {/* Config Node Table */}
          <div
            style={{
              padding: 24,
              borderRadius: "var(--radius-xl)",
              background: "var(--surface-card)",
              border: "1px solid var(--border-hairline)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-data)",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--cobalt-600)",
                marginBottom: 6,
              }}
            >
              THE `Config` NODE (SAFE DEFAULTS)
            </div>
            <h3
              style={{
                margin: "0 0 14px",
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Single-Node Configuration &amp; Guardrails
            </h3>
            <div style={{ display: "grid", gap: 8 }}>
              {CONFIG_SETTINGS.map((row) => (
                <div
                  key={row.key}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--border-hairline)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <code
                      style={{
                        fontFamily: "var(--font-data)",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--cobalt-600)",
                      }}
                    >
                      {row.key}
                    </code>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        marginTop: 2,
                      }}
                    >
                      {row.allowed}
                    </div>
                  </div>
                  <code
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: 11,
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: "var(--cobalt-50)",
                      color: "var(--cobalt-600)",
                      flexShrink: 0,
                    }}
                  >
                    default: {row.defaultVal}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* QA Report Summary */}
          <div
            style={{
              padding: 24,
              borderRadius: "var(--radius-xl)",
              background: "var(--surface-card)",
              border: "1px solid var(--border-hairline)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--signal-good)",
                  marginBottom: 6,
                }}
              >
                QA REPORT (N8N 2.35.7 VERIFICATION)
              </div>
              <h3
                style={{
                  margin: "0 0 12px",
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                What Was Tested &amp; Honest Boundaries
              </h3>
              <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
                {[
                  "Secret & key scan across workflows, code, prompts, skills: 0 findings",
                  "Structure & parameter lint against n8n 2.35.7 node definitions: 0 findings",
                  "Lint self-test against 14 planted defects: 14 of 14 caught",
                  "Code-node behavior tests (including SSRF, bad URLs, placeholders): 90 passed, 0 failed",
                  "End-to-end execution on n8n 2.35.7 across 13 scenarios: 26 checks passed",
                  "Webhook hardening tests (X-PAE-Key, early 202, override allow-list): 9 checks passed",
                  "Error workflow test (pae-error-alert.json): alerts contain zero lead PII",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: 12,
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Icon
                      name="Check"
                      size={14}
                      color="var(--signal-good)"
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: "var(--surface-sunken)",
                border: "1px solid var(--border-hairline)",
                fontSize: 12,
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: "var(--text-primary)" }}>
                Read before turning sending on:
              </strong>{" "}
              Nothing is imported or activated in your n8n until you run Prompt
              01. Create the 3 named credentials (<code>PAE Anthropic</code>,{" "}
              <code>PAE Webhook Key</code>, <code>PAE SMTP</code>) inside your
              own n8n instance and test 1 send to your own inbox first.
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "32px",
          borderTop: "1px solid var(--border-hairline)",
          textAlign: "center",
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--layout-max)",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Logo size={24} />
          <span>
            Created by Patrick Diamitani - Diamitani Industries - SalesGency
          </span>
          <Link
            href="/home"
            style={{
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}
