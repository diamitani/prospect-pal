# Jobs To Be Done — Prospect PAL

**Artifact:** 02-jtbd  
**Version:** v1.0.0  
**Status:** approved  
**Framework:** DDC / ROSTR

---

## Primary Job

> **When** I have a defined ICP and limited time,  
> **I want** to automate prospect research and outreach,  
> **So I can** focus on closing deals instead of prospecting.

### Success Metric
- Pipeline generated per hour of setup time
- Target: 10+ qualified opportunities per workflow per month

---

## Secondary Jobs

### 1. Campaign Configuration

> **When** I'm setting up a new outbound campaign,  
> **I want** to configure my tools, ICP, and messaging in one place,  
> **So I can** launch without switching between 5 different apps.

**Metric:** Time from "I want to run a campaign" to "workflow is live"  
**Target:** < 15 minutes

### 2. CRM Protection

> **When** prospects flow through my automation,  
> **I want** them deduplicated against my CRM,  
> **So I can** avoid embarrassing outreach to existing customers.

**Metric:** Duplicate contacts created  
**Target:** 0%

### 3. Personalized Outreach

> **When** I need to write emails to prospects,  
> **I want** AI to research each company and write relevant copy,  
> **So I can** get higher reply rates than generic templates.

**Metric:** Email reply rate  
**Target:** 5%+ (vs 1-2% industry average for cold)

### 4. Human Oversight

> **When** prospects are about to be enrolled,  
> **I want** to review and approve before sending,  
> **So I can** catch errors and maintain brand quality.

**Metric:** User-approved vs auto-enrolled ratio  
**Target:** Configurable per campaign

### 5. Workflow Ownership

> **When** I build an automation workflow,  
> **I want** to own the JSON and run it on my own n8n,  
> **So I can** customize, audit, and not depend on a third party.

**Metric:** Users who export/deploy workflows  
**Target:** 90%+

---

## Switching Triggers

What causes someone to look for Prospect PAL:

| Trigger | Signal |
|---------|--------|
| Hiring SDRs is too expensive | "We can't afford a team yet" |
| Current tools are disconnected | "I'm copying data between 5 apps" |
| Generic outreach isn't working | "Our reply rates are terrible" |
| Need to scale without adding headcount | "We need to do more with less" |
| Want control over automation | "I don't trust black-box tools" |

---

## Anxieties

| Fear | Resolution |
|------|------------|
| "Will this spam people?" | Dedupe, approval gates, unsubscribe handling |
| "Will the AI write garbage?" | PAS framework, structured prompts, review mode |
| "Is my data safe?" | No secrets in workflow, BYOK, self-hosted option |
| "Can I customize it?" | Full n8n JSON, editable nodes |
| "What if it breaks?" | Error handlers, Slack alerts, retry logic |

---

## Competing Solutions

| Solution | Limitation |
|----------|------------|
| Manual prospecting | Doesn't scale |
| Apollo/ZoomInfo sequences | Limited personalization |
| Clay | Complex, requires technical setup |
| Outreach/Salesloft | Expensive, no AI research |
| Custom dev | Months of work, maintenance burden |

**Prospect PAL wedge:** Pre-built 9-node architecture + AI research + you own the workflow.

---

*JTBD v1.0.0 — supersede with an ADR.*
