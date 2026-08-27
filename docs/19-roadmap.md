# Product Roadmap — Prospect PAL

**Artifact:** 19-roadmap  
**Version:** v1.0.0  
**Status:** approved  
**Framework:** DDC / NPAO

---

## NPAO: Now / Next / Later / Out

### NOW (v1.0 — Must Ship)

| Feature | Description | DDC Stage |
|---------|-------------|-----------|
| Campaign intake | 10 hard gates wizard | Intake |
| 9-node workflow | Full pipeline generation | Scaffolding → Scripts |
| Tool integrations | HubSpot, Salesforce, Apollo, Clay, Smartlead, Instantly | Connecting |
| AI research | Claude/OpenAI company research | Scripts |
| PAS email copy | 7-touch email sequence generation | Scripts |
| JSON export | Download workflow file | Deploying |
| Approval gates | Human review before enrollment | Scripts |
| CRM dedupe | Existing contact/deal protection | Scripts |

### NEXT (v1.1 — Fast Follow)

| Feature | Description | Rationale |
|---------|-------------|-----------|
| Direct n8n deploy | Push workflow to user's instance via API | Reduces friction |
| A/B email variants | Multiple subject/body options | Improve reply rates |
| Campaign analytics | Success metrics dashboard | Prove ROI |
| LinkedIn copy | Connection notes, DMs, InMails | Multi-channel |
| More CRMs | Pipedrive, Attio, Zoho | Market expansion |
| More data tools | ZoomInfo, Amplemarket | Market expansion |

### LATER (v2.0+)

| Feature | Description | Rationale |
|---------|-------------|-----------|
| Reply handling | Auto-classify and route responses | Close the loop |
| Meeting booking | Calendar integration | End-to-end |
| Custom nodes | User-defined workflow steps | Power users |
| Team workspaces | Multi-seat, shared campaigns | Enterprise |
| Webhook builder | Custom trigger sources | Advanced use cases |
| Multi-channel orchestration | Email + LinkedIn + calls | Full GTM |

### OUT (Not Building)

| Feature | Why Not |
|---------|---------|
| CRM replacement | Not our job; integrate, don't compete |
| Direct email sending | Sequence tools do this better |
| Data enrichment | Partner with Apollo/Clay, don't rebuild |
| Marketing automation | Different market, different product |
| Non-n8n workflows | Too much fragmentation |

---

## Scale Stages

### Stage 0: Founder (Current)
- **Users:** 1-10
- **Ship:** Campaign wizard, workflow export, Stripe checkout
- **Do not:** Over-engineer infrastructure

### Stage 1: First Ten (Next)
- **Users:** 10-100
- **Ship:** Direct deploy, basic analytics, support docs
- **Do not:** Build team features yet

### Stage 2: Neighborhood (Q1 2027)
- **Users:** 100-1,000
- **Ship:** A/B testing, more integrations, team invites
- **Do not:** Premature enterprise features

### Stage 3: City (Q2 2027)
- **Users:** 1,000-10,000
- **Ship:** Reply handling, meeting booking, SSO
- **Do not:** Multi-region before needed

### Stage 4+: Country/Continent
- **Users:** 10,000+
- **Ship:** Enterprise, custom nodes, white-label
- **Infrastructure:** Multi-region, dedicated support

---

## GTM Roadmap

### Phase 1: Launch (Now)
- Landing page with AIDA copy
- $99/mo Pro plan
- DIY package for builders
- Product Hunt launch

### Phase 2: Growth (Next)
- Content marketing (use case guides)
- Integration partnerships (Apollo, Clay)
- Affiliate program
- Case studies

### Phase 3: Scale (Later)
- Enterprise sales motion
- Agency partnerships
- Conference presence
- Category leadership

---

## Quality Gates Before Each Release

| Dimension | Threshold |
|-----------|-----------|
| Contract | All intake gates documented |
| Taste | Email copy passes PAS review |
| Usefulness | 3 beta users complete core job |
| Security | No secrets in exports |
| Reliability | Error handlers on all HTTP nodes |
| Performance | < 10s per prospect |
| Ops | Runbook exists |
| Scale | Can handle stated user count |

---

*Roadmap v1.0.0 — update quarterly, supersede with ADR.*
