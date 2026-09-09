import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Plus_Jakarta_Sans,
  Cinzel,
  Montserrat,
  Roboto,
} from "next/font/google";
import {
  getActiveClient,
  getClientCssVars,
  clientUsesDjFonts,
  stateRegionLabel,
} from "@/lib/client";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
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

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export function generateMetadata(): Metadata {
  const client = getActiveClient();
  const region = stateRegionLabel(client.state);
  const title = `${region} Car Accident Settlement Calculator | ${client.firmName}`;
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
  const useDj = clientUsesDjFonts(client);

  const fontVars: Record<string, string> = useDj
    ? {
        "--font-sans": "var(--font-roboto)",
        "--font-display": "var(--font-montserrat)",
      }
    : {
        "--font-sans": "var(--font-jakarta)",
        "--font-display": "var(--font-cormorant)",
      };

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${plusJakarta.variable} ${cormorant.variable} ${cinzel.variable} ${montserrat.variable} ${roboto.variable} bg-plg-cream font-sans text-plg-charcoal antialiased`}
        style={{ ...cssVars, ...fontVars }}
      >
        {children}
      </body>
    </html>
  );
}
