import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prospect PAL — AI Prompt Builder for Outbound Automation",
  description: "The PAL (Prompt Abstraction Layer) system that turns your plain-English ICP description into a fully wired outbound automation engine. Find leads, research contacts, write personalized emails — on autopilot.",
  openGraph: {
    title: "Prospect PAL",
    description: "Turn plain English into a complete outbound automation engine.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
