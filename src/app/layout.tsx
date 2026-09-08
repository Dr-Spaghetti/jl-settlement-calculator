import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { getActiveClient, getClientCssVars } from "@/lib/client";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export function generateMetadata(): Metadata {
  const client = getActiveClient();
  const title = `Car Accident Settlement Calculator | ${client.firmName}`;
  const description = `${client.tagline} Free educational settlement range estimator from ${client.firmName} in ${client.city}, ${client.state}. Not legal advice.`;
  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      title: `Car Accident Settlement Calculator | ${client.shortName}`,
      description: client.tagline,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = getActiveClient();
  const cssVars = getClientCssVars(client);

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sourceSerif.variable} font-sans`}
        style={cssVars}
      >
        {children}
      </body>
    </html>
  );
}
