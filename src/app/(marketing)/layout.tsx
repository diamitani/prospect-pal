import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prospect PAL — Build Your Outbound Automation",
  description: "Turn plain English into a production-ready n8n outbound workflow in 5 minutes.",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
