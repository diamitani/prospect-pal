import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SalesGency Prospect Automation Engine - 1 ICP to Full Outbound Workflow",
  description:
    "Scale qualified outbound pipeline with an autonomous sales engine. 1 ICP or buying signal to a full 6-step outbound workflow powered by ROSTR, PAL, Vercel AI Stack, Cloudflare, and MCP.",
  openGraph: {
    title: "SalesGency Prospect Automation Engine",
    description:
      "1 ICP or signal to full outbound workflow. Built on ROSTR Multi-Agent System, PAL Compiler, n8n, and Model Context Protocol (MCP).",
    type: "website",
    url: "https://prospect.salesgency.com",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://prospect.salesgency.com"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
