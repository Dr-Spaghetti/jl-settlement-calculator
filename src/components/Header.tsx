import type { ClientConfig } from "@/lib/types";
import {
  ArrowRightIcon,
  PhoneIcon,
  ScaleIcon,
} from "@/components/icons";

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function shortTagline(tagline: string): string {
  const match = tagline.match(/^([^.]+\.[^.]*\.)/);
  return match ? match[1].trim() : "Big Enough to Win. Small Enough to Care.";
}

export function Header({ client }: { client: ClientConfig }) {
  const cities =
    client.state.toUpperCase() === "WA"
      ? "Serving Seattle • Bellevue • Federal Way • Renton"
      : `Serving ${client.city}, ${client.state}`;
  const tag = shortTagline(client.tagline);
  const isPremier = client.id === "premier-law-group";

  return (
    <>
      <div className="border-b border-slate-800 bg-plg-navy text-xs text-white print:hidden">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="inline-flex items-center rounded bg-plg-crimson px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              {client.state.toUpperCase() === "WA"
                ? "Washington State"
                : client.state}
            </span>
            <span className="text-slate-300">{cities}</span>
          </div>
          <div className="flex items-center space-x-6 text-xs text-slate-300">
            {client.state.toUpperCase() === "WA" ? (
              <span className="hidden md:inline">
                <ScaleIcon
                  size={14}
                  className="mr-1.5 inline-block align-[-2px] text-plg-gold"
                />
                RCW § 4.22.005 Pure Comparative Negligence
              </span>
            ) : null}
            <a
              href={telHref(client.phone)}
              className="flex items-center font-semibold text-white transition hover:text-plg-gold"
            >
              <PhoneIcon
                size={14}
                className="mr-1.5 inline-block align-[-2px] text-plg-crimson"
              />
              {client.phone}
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-plg-borderMuted bg-white/95 shadow-sm backdrop-blur transition-all duration-300 print:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-28 items-center justify-between gap-4">
            <a href="#top" className="group flex min-w-0 items-center gap-3 sm:gap-4">
              {isPremier && client.logoUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.logoUrl}
                    alt={`${client.firmName} logo`}
                    className="h-[4.25rem] w-auto max-w-[200px] shrink-0 object-contain object-left sm:h-20 sm:max-w-[280px] lg:h-[5.25rem] lg:max-w-[340px]"
                    width={340}
                    height={84}
                    decoding="async"
                  />
                  <div className="hidden h-12 w-px shrink-0 bg-slate-200 sm:block" aria-hidden />
                </>
              ) : (
                <div className="flex items-center justify-center space-x-1.5 border-r border-slate-200 py-1 pr-5">
                  <span className="font-cinzel text-3xl font-bold tracking-tight text-slate-900 transition group-hover:text-plg-crimson">
                    {client.shortName.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex min-w-0 flex-col">
                <span className="font-cinzel truncate text-sm font-bold uppercase tracking-[0.14em] text-slate-900 sm:text-lg lg:text-xl">
                  {client.shortName}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                    PLLC
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="truncate text-[11px] font-medium italic text-plg-crimson">
                    {tag}
                  </span>
                </div>
              </div>
            </a>

            <div className="flex items-center space-x-4 sm:space-x-6">
              <nav
                className="hidden items-center space-x-8 text-sm font-medium text-slate-700 lg:flex"
                aria-label="Primary"
              >
                <a href="#calculator" className="transition hover:text-plg-crimson">
                  Calculator
                </a>
                <a href="#how-it-works" className="transition hover:text-plg-crimson">
                  The Formula
                </a>
                <a
                  href="#settlement-ranges"
                  className="transition hover:text-plg-crimson"
                >
                  WA Ranges
                </a>
                <a href="#faq" className="transition hover:text-plg-crimson">
                  FAQ
                </a>
              </nav>

              <a
                href={client.ctaUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-plg-crimson px-4 py-2.5 text-sm font-semibold tracking-wide text-white shadow-sm transition hover:bg-plg-crimsonDark hover:shadow sm:px-5"
              >
                <span className="hidden sm:inline">{client.ctaText}</span>
                <span className="sm:hidden">Consult</span>
                <ArrowRightIcon size={14} className="opacity-80" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-plg-borderMuted bg-plg-warmIvory/80 px-4 py-1 text-center">
          <p className="text-[11px] text-slate-600">
            <strong className="font-semibold text-plg-crimson">
              Educational Calculator:
            </strong>{" "}
            Provides educational, illustrative ranges — not a prediction of your case.
            No attorney-client relationship is created.
          </p>
        </div>
      </header>
    </>
  );
}
