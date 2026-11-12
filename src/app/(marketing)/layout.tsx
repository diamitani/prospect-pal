import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prospect PAL — Autonomous Outbound & GTM Agent Engine",
  description: "Turn any ICP brief into a 5-pillar, zero-collision outbound engine in 3 seconds. Verified leads, deep company research, personalized PAS copy, and live CRM shields.",
  keywords: ["outbound automation", "sales automation", "GTM engine", "n8n", "Twenty CRM", "HubSpot", "cold email", "AI agent", "CRM shield", "PAS copywriting"],
  openGraph: {
    title: "Prospect PAL — Autonomous Outbound & GTM Agent Engine",
    description: "Turn any ICP brief into a 5-pillar, zero-collision outbound engine in 3 seconds. Verified leads, deep company research, personalized PAS copy, and live CRM shields.",
    type: "website",
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-body)", background: "#F6F8FA", color: "#14142D", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
