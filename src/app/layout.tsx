import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Plus_Jakarta_Sans,
  Cinzel,
} from "next/font/google";
import { getActiveClient, getClientCssVars } from "@/lib/client";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export function generateMetadata(): Metadata {
  const client = getActiveClient();
  const title = `Washington Car Accident Settlement Calculator | ${client.firmName}`;
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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${plusJakarta.variable} ${cormorant.variable} ${cinzel.variable} bg-plg-cream font-sans text-plg-charcoal antialiased`}
        style={cssVars}
      >
        {children}
      </body>
    </html>
  );
}
