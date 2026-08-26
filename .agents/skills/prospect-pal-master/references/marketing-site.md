# Marketing Site Reference

Content and structure for the Prospect PAL marketing website.

---

## Site Map

```
/ (Landing Page)
├── /pricing
├── /features
├── /templates
├── /docs
├── /blog
├── /contact
├── /login
└── /signup
```

---

## Landing Page Sections

### Hero Section
**Headline**: Transform Plain-English ICP Briefs into Production-Ready Outbound Workflows

**Subheadline**: AI-powered prospect automation platform that generates n8n workflows, cold email scripts, and CRM integrations in minutes, not weeks.

**CTA**: Get Started Free | Watch Demo

**Trust Badges**: "Powers 500+ sales teams" | "4.9/5 on G2" | "SOC 2 Compliant"

### Problem Section
**Title**: The Outbound Scaling Problem

**Pain Points**:
- Manual prospecting takes 10+ hours per SDR per week
- Cold emails get <1% reply rates with generic copy
- CRM data quality degrades without automation
- Hiring more SDRs isn't scalable or cost-effective

### Solution Section
**Title**: Your Autonomous Revenue Architecture

**How It Works**:
1. **Describe** - Tell us your ICP in plain English
2. **Configure** - Select your tools (Apollo, Clay, HubSpot, Smartlead)
3. **Generate** - Get production-ready n8n workflows + email scripts
4. **Deploy** - Import to n8n and start prospecting in minutes

### Features Grid
| Feature | Description |
|---------|-------------|
| PAL Compilation | Transform natural language into agent manifests |
| 5-Pillar Pipeline | Lead → Enrich → Research → Email → Sequence |
| AI Email Writer | PAS framework, <75 words, personalized hooks |
| CRM Deduplication | Never contact existing customers or pipeline |
| Slack Approval | Human-in-the-loop before sending |
| Execution Analyst | Diagnose and fix workflow errors automatically |

### Social Proof Section
**Testimonials**:
- "Cut our prospecting time by 80% while doubling reply rates" - VP Sales, SaaS Co
- "Finally an automation tool that understands what we sell" - Revenue Ops, FinTech
- "The n8n workflows just work. No debugging, no tweaking." - Sales Manager, Agency

**Metrics**:
- 15,700% ROI on automation investment
- 94.5% email deliverability rate
- 80% reduction in cost per lead
- 6-10% average reply rate

### Pricing Preview
**Three Tiers**:
- DIY Package: $19.99 one-time
- Pro BYOK: $99/month
- Custom Build: Starting at $999

[See Full Pricing →]

### CTA Section
**Title**: Ready to Scale Your Outbound?

**Primary CTA**: Start Free Trial (no credit card)

**Secondary CTA**: Book a Demo

---

## Pricing Page

### Tier Comparison Table

| Feature | DIY ($19.99) | Pro ($99/mo) | Custom ($999+) |
|---------|--------------|--------------|----------------|
| n8n Workflow Templates | ✓ | ✓ | ✓ |
| Email Framework | ✓ | ✓ | ✓ |
| Build Prompts | ✓ | ✓ | ✓ |
| Claude Code Skills | ✓ | ✓ | ✓ |
| Dashboard Access | - | ✓ | ✓ |
| Unlimited Campaigns | - | ✓ | ✓ |
| AI Agents (4) | - | ✓ | ✓ |
| BYOK Key Management | - | ✓ | ✓ |
| Execution Analyst | - | ✓ | ✓ |
| Custom Integrations | - | - | ✓ |
| White-Glove Setup | - | - | ✓ |
| Dedicated Support | - | - | ✓ |
| SLA Guarantees | - | - | ✓ |

### DIY Package Details
**What's Included**:
- 4 n8n workflow templates (webhook, schedule, spreadsheet, CRM trigger)
- PAS email framework with 4-touch sequence
- Build prompts for customization
- Deploy guide with credential setup
- 6 Claude Code skills for self-service

**Best For**: Technical founders, solo SDRs, RevOps experimenting with automation

### Pro BYOK Details
**What's Included**:
- Everything in DIY
- Full dashboard access
- Unlimited campaign generation
- All 4 AI agents (Tools, Copy, Workflow, Analyst)
- BYOK API key vault
- Execution monitoring and alerts
- Priority email support

**Best For**: SMB sales teams, growing startups, agencies

### Custom Build Details
**What's Included**:
- Everything in Pro
- Custom n8n workflow development
- Non-standard tool integrations
- White-glove implementation
- Team training sessions
- Dedicated Slack channel
- 99.9% uptime SLA

**Best For**: Enterprise teams, agencies, complex requirements

---

## Templates Page

### Available Templates

**Workflow Templates**:
1. **prospect-automation-webhook.json**
   - Trigger: Webhook endpoint
   - Best for: Event-driven lead intake
   
2. **prospect-automation-schedule.json**
   - Trigger: Daily at 7 AM
   - Best for: Automated daily prospecting
   
3. **prospect-automation-spreadsheet.json**
   - Trigger: CSV upload
   - Best for: Batch processing lead lists
   
4. **prospect-automation-template.json**
   - Trigger: Manual
   - Best for: Testing and development

**Email Templates**:
1. PAS Framework (4-touch sequence)
2. BAB Framework (transformation story)
3. AIDA Framework (nurture sequence)
4. Trigger Event templates

**Skill Templates**:
1. prospect-pal-master (orchestrator)
2. prospect-pal-tools (configuration)
3. prospect-pal-copywriter (messaging)
4. prospect-pal-workflow (n8n generation)
5. prospect-pal-n8n-engineer (customization)
6. prospect-pal-analyst (monitoring)

### Download Package
```
prospect-pal-package.zip
├── templates/
│   ├── workflow-webhook.json
│   ├── workflow-schedule.json
│   ├── workflow-spreadsheet.json
│   └── workflow-manual.json
├── emails/
│   ├── pas-framework.md
│   ├── bab-framework.md
│   └── sequence-4-touch.md
├── skills/
│   ├── prospect-pal-master/
│   ├── prospect-pal-tools/
│   ├── prospect-pal-copywriter/
│   ├── prospect-pal-workflow/
│   ├── prospect-pal-n8n-engineer/
│   └── prospect-pal-analyst/
├── .env.example
├── deploy-guide.md
└── README.md
```

---

## Contact Page

### Contact Form
**Fields**:
- Name (required)
- Email (required)
- Company
- Team Size (select: 1-5, 6-20, 21-50, 51-100, 100+)
- Message (required)

### Book a Call
**Calendly Integration**:
- 15-min Discovery Call (free)
- 30-min Demo (free)
- 60-min Audit Call ($299)

### Support Channels
- Email: support@prospectpal.com
- Discord: discord.gg/prospectpal
- Twitter: @prospectpal

---

## SEO & Meta

### Homepage
```html
<title>Prospect PAL | AI-Powered Outbound Automation Platform</title>
<meta name="description" content="Transform ICP briefs into production-ready n8n workflows, cold emails, and CRM integrations. Scale your outbound without hiring more SDRs.">
```

### Keywords
- Outbound automation
- n8n workflow generator
- AI cold email writer
- Sales automation platform
- Prospect automation
- Lead enrichment automation
- CRM integration
- Apollo Clay HubSpot integration

---

## Analytics & Tracking

### Key Metrics
- Visitors to signup conversion rate
- Template downloads
- Demo bookings
- Trial to paid conversion
- Feature adoption (by agent)

### Events to Track
- page_view
- signup_started
- signup_completed
- template_downloaded
- demo_booked
- campaign_created
- workflow_generated
- workflow_deployed
