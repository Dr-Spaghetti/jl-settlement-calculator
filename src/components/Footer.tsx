import type { ClientConfig } from "@/lib/types";

export function Footer({ client }: { client: ClientConfig }) {
  const year = new Date().getFullYear();
  const email = client.email?.trim();
  return (
    <footer className="border-t border-slate-800 bg-plg-navy pb-24 text-slate-300 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-cinzel text-base font-bold uppercase tracking-[0.12em] text-white">
              {client.shortName}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {client.city}, {client.state}
              {client.state.toUpperCase() === "WA"
                ? " · Seattle · Federal Way · Renton"
                : ""}
            </p>
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
            <p className="mt-3 text-xs italic text-plg-gold">
              Big Enough to Win. Small Enough to Care.
            </p>
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
                  WA ranges
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
