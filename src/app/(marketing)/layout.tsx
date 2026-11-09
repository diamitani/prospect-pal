import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SalesGency Prospect Automation Engine - 1 ICP to Full Outbound Workflow",
  description:
    "Scale qualified outbound pipeline with an autonomous sales engine that finds ICP accounts, extracts decision-makers, and writes hyper-personalized emails on behalf of your reps.",
  keywords: [
    "outbound automation",
    "GTM engineering",
    "ROSTR agent",
    "PAL compiler",
    "MCP server",
    "n8n workflow",
    "SalesGency",
  ],
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        background: "var(--surface-page)",
        minHeight: "100dvh",
      }}
    >
      {children}
    </div>
  );
}
