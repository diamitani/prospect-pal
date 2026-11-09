import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prospect Pal by Salesgency — Internal GTM",
  description:
    "Internal GTM prospecting app for Salesgency. Evidence-backed prospect research, scoring, and HubSpot sync with human approval.",
  openGraph: {
    title: "Prospect Pal by Salesgency",
    description: "Internal GTM prospecting — free path + BYOK connectors.",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
