import { NextResponse } from "next/server";

export interface ScriptTheme {
  id: string;
  theme: string;
  angle: string;
  subjectA: string;
  subjectB: string;
  sentence1_problem: string;
  sentence2_agitate: string;
  sentence3_solve: string;
  fullBodyA: string;
  fullBodyB: string;
  targetPersona: string;
  projectedReplyRate: string;
}

export async function POST(req: Request) {
  try {
    const { icp, valueProp, industry, tools } = await req.json();

    const targetICP = icp || "VP of Sales / Head of RevOps at B2B SaaS (50-250 emp)";
    const offer = valueProp || "Autonomous outbound pipeline using n8n + AI PAS copywriting";
    const toolsUsed = tools || "Apollo, HubSpot, Smartlead";

    const themes: ScriptTheme[] = [
      {
        id: "theme-1",
        theme: "Operational Friction & SDR Burnout",
        angle: "Focuses on the high manual cost and rep exhaustion of manual prospect research and lead logging.",
        subjectA: "{{company}}'s outbound research bottleneck",
        subjectB: "Quick question on {{first_name}}'s prospecting stack",
        sentence1_problem: "Noticed {{company}} is scaling the SDR team, but most reps lose 15+ hours a week manually copy-pasting contacts between Apollo and {{crm}}.",
        sentence2_agitate: "When SDRs spend 60% of their day on data entry rather than conversations, pipeline velocity stalls and customer acquisition costs quietly double.",
        sentence3_solve: "We built an autonomous 5-pillar n8n engine that enriches verified contacts, writes personalized 3-sentence emails, and syncs directly into {{sequencer}} on autopilot — would you be open to seeing the 2-min blueprint?",
        fullBodyA: `Hi {{first_name}},\n\nNoticed {{company}} is scaling the SDR team, but most reps lose 15+ hours a week manually copy-pasting contacts between Apollo and {{crm}}.\n\nWhen SDRs spend 60% of their day on data entry rather than conversations, pipeline velocity stalls and customer acquisition costs quietly double.\n\nWe built an autonomous 5-pillar n8n engine that enriches verified contacts, writes personalized 3-sentence emails, and syncs directly into {{sequencer}} on autopilot — would you be open to seeing the 2-min blueprint?\n\nBest,\n{{sender_name}}`,
        fullBodyB: `{{first_name}} — saw your team is actively growing revenue operations at {{company}}.\n\nMost sales leaders tell us their reps burn half their week manually building lead lists, leading to uneven pipeline and low outreach consistency.\n\nWe deployed a self-hosted automation that auto-dedupes against {{crm}} and drafts tailored PAS emails before reps log on at 8 AM. Open to taking a quick look this Thursday?`,
        targetPersona: "VP Sales / Head of Revenue",
        projectedReplyRate: "7.8% (Top Quartile)",
      },
      {
        id: "theme-2",
        theme: "Speed to Lead & Website Intent Signals",
        angle: "Leverages real-time visitor identification to trigger immediate, relevant multi-channel outreach within 15 minutes.",
        subjectA: "15-minute intent trigger for {{company}}",
        subjectB: "Capturing {{company}}'s anonymous web traffic",
        sentence1_problem: "Over 95% of high-intent B2B buyers visit {{company}}'s pricing page and leave without ever booking a demo.",
        sentence2_agitate: "Waiting days for marketing to batch export leads means inbound intent decays before your reps even send a first touch.",
        sentence3_solve: "Our n8n webhook workflow reveals the buying committee in under 15 minutes and enriches verified work emails before deal intent cools down — interested in testing it on your current traffic?",
        fullBodyA: `Hi {{first_name}},\n\nOver 95% of high-intent B2B buyers visit {{company}}'s pricing page and leave without ever booking a demo.\n\nWaiting days for marketing to batch export leads means inbound intent decays before your reps even send a first touch.\n\nOur n8n webhook workflow reveals the buying committee in under 15 minutes and enriches verified work emails before deal intent cools down — interested in testing it on your current traffic?\n\nBest,\n{{sender_name}}`,
        fullBodyB: `{{first_name}} — noticed {{company}} is driving strong brand traffic lately.\n\nMost SaaS teams let 90%+ of warm site visitors slip through the cracks because their CRM sync only runs once a week.\n\nWe set up a real-time signal engine that maps domain visitors to verified decision makers in Apollo and triggers personalized touches within 15 minutes. Worth a 3-min peek?`,
        targetPersona: "Demand Gen / Growth Marketing",
        projectedReplyRate: "9.2% (High Intent)",
      },
      {
        id: "theme-3",
        theme: "CRM Collision & Clean Data Guardrail",
        angle: "Addresses SDR deal collisions, duplicates, and messaging active enterprise accounts by enforcing strict CRM deduplication gates.",
        subjectA: "Preventing outreach collision at {{company}}",
        subjectB: "CRM deduplication shield for {{first_name}}",
        sentence1_problem: "As outbound volume ramps up at {{company}}, SDRs inevitably step on existing customer accounts or active pipeline deals.",
        sentence2_agitate: "Accidentally cold-pitching a client currently in contract renewal creates awkward churn risks and damages brand credibility.",
        sentence3_solve: "We engineered a zero-leak CRM Dedupe Shield node that verifies account status across {{crm}} before any message leaves the queue — can I share how it works?",
        fullBodyA: `Hi {{first_name}},\n\nAs outbound volume ramps up at {{company}}, SDRs inevitably step on existing customer accounts or active pipeline deals.\n\nAccidentally cold-pitching a client currently in contract renewal creates awkward churn risks and damages brand credibility.\n\nWe engineered a zero-leak CRM Dedupe Shield node that verifies account status across {{crm}} before any message leaves the queue — can I share how it works?\n\nBest,\n{{sender_name}}`,
        fullBodyB: `{{first_name}} — with {{company}}'s expanding outbound motions, protecting existing pipeline is critical.\n\nWithout automated guardrails, reps frequently blast leads that are already mid-negotiation in {{crm}}.\n\nOur automated CRM gate checks deal stage and ownership in real time to guarantee zero collisions. Happy to send over the flow diagram if helpful?`,
        targetPersona: "Sales Operations & RevOps Leaders",
        projectedReplyRate: "6.4% (Executive Alignment)",
      },
      {
        id: "theme-4",
        theme: "AI PAS Personalization at Scale",
        angle: "Eliminates generic AI spam by generating authentic 3-sentence observations grounded in verified company news and triggers.",
        subjectA: "Generic AI outreach vs 3-sentence PAS",
        subjectB: "Better reply rates for {{company}}'s sequences",
        sentence1_problem: "Buyers can spot generic, multi-paragraph AI cold emails in their inbox within 2 seconds and immediately mark them as spam.",
        sentence2_agitate: "Blasting 10,000 templated emails burns your domain reputation and tanks deliverability across your entire sales organization.",
        sentence3_solve: "Our LLM node writes hyper-personalized 3-sentence Problem-Agitate-Solve copy tailored specifically to {{first_name}}'s exact tech stack and recent milestones — open to a quick comparison?",
        fullBodyA: `Hi {{first_name}},\n\nBuyers can spot generic, multi-paragraph AI cold emails in their inbox within 2 seconds and immediately mark them as spam.\n\nBlasting 10,000 templated emails burns your domain reputation and tanks deliverability across your entire sales organization.\n\nOur LLM node writes hyper-personalized 3-sentence Problem-Agitate-Solve copy tailored specifically to {{first_name}}'s exact tech stack and recent milestones — open to a quick comparison?\n\nBest,\n{{sender_name}}`,
        fullBodyB: `{{first_name}} — how are reply rates holding up on {{company}}'s cold sequences this quarter?\n\nLong-winded sales templates are getting filtered out faster than ever by modern inbox algorithms.\n\nWe developed a clean 3-sentence framework that gets straight to the operational point without fluff. Would you be opposed to seeing a live test?`,
        targetPersona: "Founders & Heads of Outbound",
        projectedReplyRate: "8.5% (High Engagement)",
      },
    ];

    return NextResponse.json({
      success: true,
      icp: targetICP,
      offer,
      toolsUsed,
      themes,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate scripts" },
      { status: 500 }
    );
  }
}
