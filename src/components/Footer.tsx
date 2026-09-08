import type { ClientConfig } from "@/lib/types";

export function Footer({ client }: { client: ClientConfig }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-base font-semibold text-white">{client.firmName}</p>
            <p className="mt-2 text-sm text-slate-400">
              {client.city}, {client.state}
            </p>
            <p className="mt-1 text-sm">
              <a className="hover:text-white" href={`tel:${client.phone.replace(/[^\d+]/g, "")}`}>
                {client.phone}
              </a>
            </p>
            <p className="mt-1 text-sm">
              <a className="hover:text-white" href={`mailto:${client.email}`}>
                {client.email}
              </a>
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Quick links
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#calculator" className="hover:text-white">
                  Settlement calculator
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white">
                  How the math works
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href={client.website} className="hover:text-white" rel="noopener noreferrer">
                  Firm website
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Important
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              {client.attorneyDisclaimer}
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-500">
          <p>
            © {year} {client.firmName}. Educational tool only — not legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
