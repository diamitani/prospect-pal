import { NextResponse } from "next/server";

export interface SignalLead {
  id: string;
  companyName: string;
  domain: string;
  logo: string;
  headcount: string;
  industry: string;
  fundingRound: string;
  fundingAmount: string;
  techSignals: string[];
  openRoles: string[];
  keyDecisionMaker: {
    name: string;
    title: string;
    linkedin: string;
    verifiedEmail: string;
  };
  detectedTrigger: string;
  triggerConfidence: number;
}

const SAMPLE_LEADS: SignalLead[] = [
  {
    id: "lead-1",
    companyName: "NexusFlow Data",
    domain: "nexusflowdata.com",
    logo: "⚡",
    headcount: "45-70",
    industry: "B2B SaaS / Data Infra",
    fundingRound: "Series A",
    fundingAmount: "$12M (60 days ago)",
    techSignals: ["n8n (Self-Hosted)", "HubSpot", "Apollo.io", "PostgreSQL"],
    openRoles: ["GTM Automation Engineer", "Senior RevOps Manager"],
    keyDecisionMaker: {
      name: "Marcus Vance",
      title: "VP of Revenue Operations",
      linkedin: "https://linkedin.com/in/marcus-vance-revops",
      verifiedEmail: "m.vance@nexusflowdata.com",
    },
    detectedTrigger: "Actively hiring GTM Engineer with explicit n8n workflow maintenance requirements.",
    triggerConfidence: 98,
  },
  {
    id: "lead-2",
    companyName: "HyperScale AI",
    domain: "hyperscale.ai",
    logo: "🧠",
    headcount: "80-150",
    industry: "Enterprise AI & LLM Tools",
    fundingRound: "Series B",
    fundingAmount: "$28M (30 days ago)",
    techSignals: ["n8n (Cloud)", "Salesforce", "Clay.com", "Smartlead.ai"],
    openRoles: ["Head of Outbound Growth", "Staff n8n Architect"],
    keyDecisionMaker: {
      name: "Elena Rostova",
      title: "Head of Growth & Outbound",
      linkedin: "https://linkedin.com/in/elena-rostova-growth",
      verifiedEmail: "elena@hyperscale.ai",
    },
    detectedTrigger: "Recent $28M Series B round + scaling cold outbound volume to 5,000 verified leads/mo.",
    triggerConfidence: 95,
  },
  {
    id: "lead-3",
    companyName: "CloudPulse Systems",
    domain: "cloudpulse.io",
    logo: "☁️",
    headcount: "30-50",
    industry: "DevOps & Cloud Security",
    fundingRound: "Seed",
    fundingAmount: "$4.5M (45 days ago)",
    techSignals: ["n8n (Self-Hosted)", "Attio CRM", "Instantly.ai", "LangChain"],
    openRoles: ["Founding GTM Specialist", "Sales Lead"],
    keyDecisionMaker: {
      name: "Devon Chen",
      title: "Co-Founder & CEO",
      linkedin: "https://linkedin.com/in/devon-chen-cloudpulse",
      verifiedEmail: "devon@cloudpulse.io",
    },
    detectedTrigger: "Self-hosting n8n on AWS EC2, migrating manual outbound to automated 5-pillar pipeline.",
    triggerConfidence: 94,
  },
  {
    id: "lead-4",
    companyName: "Veloce Financial",
    domain: "velocefintech.co",
    logo: "💳",
    headcount: "120-200",
    industry: "Fintech & Embedded Banking",
    fundingRound: "Series A",
    fundingAmount: "$16M (14 days ago)",
    techSignals: ["n8n (Enterprise)", "HubSpot", "ZoomInfo", "Slack Webhooks"],
    openRoles: ["Director of Sales Enablement", "Automation Architect"],
    keyDecisionMaker: {
      name: "Rachel Sterling",
      title: "Chief Commercial Officer",
      linkedin: "https://linkedin.com/in/rachel-sterling-fintech",
      verifiedEmail: "r.sterling@velocefintech.co",
    },
    detectedTrigger: "Fresh Series A announcement and posted new job opening for Outbound Automation Lead.",
    triggerConfidence: 96,
  },
  {
    id: "lead-5",
    companyName: "OmniChannel Care",
    domain: "omnichannelcare.com",
    logo: "🎧",
    headcount: "60-90",
    industry: "Customer Experience SaaS",
    fundingRound: "Series A",
    fundingAmount: "$9M (75 days ago)",
    techSignals: ["n8n (Docker)", "Pipedrive", "Apollo.io", "Lemlist"],
    openRoles: ["RevOps Specialist", "Outbound SDR"],
    keyDecisionMaker: {
      name: "Jordan Rivera",
      title: "Head of Sales Development",
      linkedin: "https://linkedin.com/in/jordan-rivera-cx",
      verifiedEmail: "jordan@omnichannelcare.com",
    },
    detectedTrigger: "Tech stack scan detected n8n webhook listener endpoints on primary subdomains.",
    triggerConfidence: 91,
  },
];

export async function POST(req: Request) {
  try {
    const { signalFilter, roleFilter, fundingFilter } = await req.json();

    let filtered = [...SAMPLE_LEADS];

    if (signalFilter && signalFilter !== "all") {
      filtered = filtered.filter((lead) =>
        lead.techSignals.some((tech) => tech.toLowerCase().includes(signalFilter.toLowerCase()))
      );
    }

    if (roleFilter && roleFilter !== "all") {
      filtered = filtered.filter((lead) =>
        lead.openRoles.some((role) => role.toLowerCase().includes(roleFilter.toLowerCase()))
      );
    }

    if (fundingFilter && fundingFilter !== "all") {
      filtered = filtered.filter((lead) =>
        lead.fundingRound.toLowerCase().includes(fundingFilter.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      totalCount: filtered.length,
      leads: filtered,
      queryTimestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to search signal leads" },
      { status: 500 }
    );
  }
}
