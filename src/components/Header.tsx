import type { ClientConfig } from "@/lib/types";

export function Header({ client }: { client: ClientConfig }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-3 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={client.logoUrl}
            alt={`${client.firmName} logo`}
            className="h-10 w-10 shrink-0 rounded-lg object-contain"
            width={40}
            height={40}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
              {client.firmName}
            </p>
            <p className="hidden truncate text-xs text-slate-500 sm:block">
              {client.city}, {client.state}
            </p>
          </div>
        </a>
        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Primary">
          <a
            href="#calculator"
            className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline"
          >
            Calculator
          </a>
          <a
            href="#how-it-works"
            className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 md:inline"
          >
            How it works
          </a>
          <a
            href={client.ctaUrl}
            className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            {client.ctaText}
          </a>
        </nav>
      </div>
    </header>
  );
}
