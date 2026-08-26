import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prospect PAL — Build your outbound automation",
  description: "Answer eight questions. Get a nine-node n8n workflow you own, with AI-written 3-sentence PAS emails. Deploys to your instance.",
  keywords: ["n8n", "outbound automation", "sales automation", "GTM", "cold email", "lead generation"],
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--surface-page)", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
