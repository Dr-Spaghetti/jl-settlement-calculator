import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  getActiveClient,
  getClientCssVars,
  clientUsesDjFonts,
  stateRegionLabel,
} from "@/lib/client";
import { firmThemeVars } from "@/lib/firm-theme";
import "./globals.css";

// Lesson #7: fonts are self-hosted (committed woff2, latin subset incl. Spanish
// accents) so the build never fetches fonts.googleapis.com.
const plusJakarta = localFont({ src: "../fonts/plus-jakarta-sans-latin-wght-normal.woff2", variable: "--font-jakarta", weight: "200 800", display: "swap" });
const cormorant = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin-wght-normal.woff2", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-wght-italic.woff2", style: "italic" },
  ],
  variable: "--font-cormorant", weight: "300 700", display: "swap",
});
const cinzel = localFont({ src: "../fonts/cinzel-latin-wght-normal.woff2", variable: "--font-cinzel", weight: "400 900", display: "swap" });
const newsreader = localFont({
  src: [
    { path: "../fonts/newsreader-latin-wght-normal.woff2", style: "normal" },
    { path: "../fonts/newsreader-latin-wght-italic.woff2", style: "italic" },
  ],
  variable: "--font-newsreader", weight: "200 800", display: "swap", preload: false,
});
const inter = localFont({ src: "../fonts/inter-latin-wght-normal.woff2", variable: "--font-inter", weight: "100 900", display: "swap", preload: false });

export function generateMetadata(): Metadata {
  const client = getActiveClient();
  const region = stateRegionLabel(client.state);
  const title = `${region} Car Accident Settlement Calculator | ${client.firmName}`;
  const description = clientUsesDjFonts(client)
    ? `${client.tagline} Free educational settlement range estimator from ${client.firmName} in ${client.city}, ${client.state}.`
    : `${client.tagline} Free educational settlement range estimator from ${client.firmName} in ${client.city}, ${client.state}. Not legal advice.`;
  return {
    title,
    description,
    robots: { index: true, follow: true },
    ...(clientUsesDjFonts(client)
      ? {
          icons: {
            icon: [
              { url: "/favicon-djougourian.ico", sizes: "any" },
              { url: "/icon-djougourian.png", type: "image/png", sizes: "512x512" },
            ],
            apple: "/apple-icon-djougourian.png",
          },
        }
      : {}),
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
  const isFirm = client.template === "firm-v1";

  const fontVars: Record<string, string> = useDj || isFirm
    ? {
        "--font-sans": "var(--font-inter)",
        "--font-display": "var(--font-newsreader)",
      }
    : {
        "--font-sans": "var(--font-jakarta)",
        "--font-display": "var(--font-cormorant)",
      };

  return (
    <html
      lang="en"
      className={`scroll-smooth${useDj ? " theme-djougourian" : ""}${isFirm ? " theme-firm" : ""}`}
    >
      <body
        className={`${plusJakarta.variable} ${cormorant.variable} ${cinzel.variable}${useDj || isFirm ? ` ${newsreader.variable} ${inter.variable}` : ""} bg-plg-cream font-sans text-plg-charcoal antialiased`}
        style={{ ...cssVars, ...fontVars, ...(isFirm ? firmThemeVars(client) : {}) }}
      >
        {children}
      </body>
    </html>
  );
}
