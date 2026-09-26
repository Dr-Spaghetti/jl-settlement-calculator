import type { ClientConfig } from "@/lib/types";
import { clientUsesDjFonts } from "@/lib/client";
import { djOfficeLine } from "@/lib/disclaimers";

export function Footer({ client }: { client: ClientConfig }) {
  const year = new Date().getFullYear();
  const email = client.email?.trim();
  const state = client.state.toUpperCase();
  const rangesLabel =
    state === "WA" ? "WA ranges" : state === "CA" ? "CA ranges" : "Ranges";
  const footerTag =
    state === "WA"
      ? "Big Enough to Win. Small Enough to Care."
      : client.tagline;
  const locationLine =
    client.servingAreas?.trim() ||
    (state === "WA"
      ? `${client.city}, ${client.state} · Seattle · Federal Way · Renton`
      : `${client.city}, ${client.state}`);

  if (clientUsesDjFonts(client)) {
    return <DjFooter client={client} year={year} locationLine={locationLine} />;
  }

  return (
    <footer className="border-t border-slate-800 bg-plg-navy pb-24 text-slate-300 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-cinzel text-base font-bold uppercase tracking-[0.12em] text-white">
              {client.shortName}
            </p>
            <p className="mt-2 text-sm text-slate-400">{locationLine}</p>
            <p className="mt-1 text-sm">
              <a
                className="font-semibold text-white transition hover:text-plg-gold"
                href={`tel:${client.phone.replace(/[^\d+]/g, "")}`}
              >
                {client.phone}
              </a>
            </p>
            {email ? (
              <p className="mt-1 text-sm">
                <a className="hover:text-white" href={`mailto:${email}`}>
                  {email}
                </a>
              </p>
            ) : null}
            <p className="mt-3 text-xs italic text-plg-gold">{footerTag}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Quick links
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#calculator" className="transition hover:text-white">
                  Settlement calculator
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition hover:text-white">
                  The formula
                </a>
              </li>
              <li>
                <a href="#settlement-ranges" className="transition hover:text-white">
                  {rangesLabel}
                </a>
              </li>
              <li>
                <a href="#faq" className="transition hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href={client.website}
                  className="transition hover:text-white"
                  rel="noopener noreferrer"
                >
                  Firm website
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Important
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300/90">
              {client.attorneyDisclaimer}
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-400">
          <p>
            © {year} {client.firmName}. Educational tool only — not legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

function DjFooter({
  client,
  year,
  locationLine,
}: {
  client: ClientConfig;
  year: number;
  locationLine: string;
}) {
  const tel = client.phone.replace(/[^\d+]/g, "");
  const links = [
    { href: "#calculator", label: "Settlement calculator" },
    { href: "#how-it-works", label: "How the estimate works" },
    { href: "#settlement-ranges", label: "Illustrative ranges" },
    { href: "#faq", label: "FAQ" },
    { href: "#legal-disclaimer", label: "Legal disclaimer" },
  ];
  return (
    <footer className="border-t border-[#C9A227]/60 bg-[#0A0A0A] pb-28 text-[#D6D3D1] md:pb-0">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-display text-base font-semibold uppercase tracking-[0.12em] text-white">
              {client.firmName}
            </p>
            <p className="mt-2 text-sm">{djOfficeLine(client)}</p>
            <p className="mt-1 text-sm text-[#A8A29E]">{locationLine}</p>
            <p className="mt-2 text-sm">
              <a
                className="font-semibold text-white transition hover:text-[#C9A227]"
                href={`tel:${tel}`}
              >
                {client.phone}
              </a>
            </p>
            {client.email?.trim() ? (
              <p className="mt-1 text-sm">
                <a className="transition hover:text-white" href={`mailto:${client.email.trim()}`}>
                  {client.email.trim()}
                </a>
              </p>
            ) : null}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C9A227]">
              Quick links
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={client.website} className="transition hover:text-white" rel="noopener noreferrer">
                  Firm website
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C9A227]">
              Important
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              {client.attorneyDisclaimer}{" "}
              <a
                href="#legal-disclaimer"
                className="font-semibold text-white underline decoration-[#C9A227] underline-offset-2"
              >
                Read the full disclaimer
              </a>
              .
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-white/15 pt-6 text-xs leading-relaxed text-[#A8A29E]">
          <p>
            <strong className="font-semibold uppercase tracking-wider text-white">
              Attorney Advertising.
            </strong>{" "}
            © {year} {client.firmName}, {djOfficeLine(client)}. Educational estimates only —
            not a guarantee of any result and not legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
