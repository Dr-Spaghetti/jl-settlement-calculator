import type { ClientConfig } from "@/lib/types";
import { clientUsesDjFonts } from "@/lib/client";
import {
  ArrowRightIcon,
  PhoneIcon,
  ScaleIcon,
} from "@/components/icons";

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function shortTagline(tagline: string, fallback: string): string {
  const match = tagline.match(/^([^.]+\.[^.]*\.)/);
  if (match) return match[1].trim();
  const first = tagline.split(/[.!?]/)[0]?.trim();
  return first || fallback;
}

export function Header({ client }: { client: ClientConfig }) {
  const isDj = clientUsesDjFonts(client);
  const state = client.state.toUpperCase();
  const cities =
    client.servingAreas?.trim() ||
    (state === "WA"
      ? "Serving Seattle • Bellevue • Federal Way • Renton"
      : `Serving ${client.city}, ${client.state}`);
  const tag = shortTagline(
    client.tagline,
    state === "WA"
      ? "Big Enough to Win. Small Enough to Care."
      : client.tagline
  );
  const entity = client.entitySuffix?.trim() || (state === "CA" ? "PLC" : "PLLC");
  const showLogo = Boolean(client.logoUrl);
  const rangesLabel =
    state === "WA" ? "WA Ranges" : state === "CA" ? "CA Ranges" : "Ranges";

  if (isDj) {
    return (
      <>
        <div className="border-b border-[#132c22] bg-[var(--dj-utility,#05130e)] text-xs text-white print:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-2 px-4 py-2.5 sm:flex-row sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#a3e0c7]/90">
              <span className="inline-flex items-center rounded bg-[#0e5c43] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                California
              </span>
              <span className="text-[#85d9b6]">{cities}</span>
              <span className="hidden text-[#85d9b6]/40 md:inline">|</span>
              <span className="hidden items-center md:inline-flex">
                <ScaleIcon
                  size={14}
                  className="mr-1.5 inline-block align-[-2px] text-[#85d9b6]"
                />
                California Pure Comparative Negligence
              </span>
            </div>
            <a
              href={telHref(client.phone)}
              className="flex items-center font-semibold text-white transition hover:text-[#85d9b6]"
            >
              <PhoneIcon
                size={14}
                className="mr-1.5 inline-block align-[-2px] text-[#85d9b6]"
              />
              {client.phone}
            </a>
          </div>
        </div>

        <header className="sticky top-0 z-40 border-b border-[#cdd6d0] bg-white/95 shadow-sm backdrop-blur-md print:hidden">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between gap-4">
              <a href="#top" className="group flex min-w-0 items-center gap-3">
                {showLogo ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={client.logoUrl}
                      alt={`${client.firmName} logo`}
                      className="h-12 w-auto max-w-[160px] shrink-0 object-contain object-left sm:max-w-[200px]"
                      width={200}
                      height={48}
                      decoding="async"
                    />
                  </>
                ) : null}
                <div className="flex min-w-0 flex-col">
                  <span className="font-display truncate text-sm font-semibold tracking-tight text-[#0f172a] sm:text-lg">
                    {client.shortName.toUpperCase()}
                  </span>
                  <span className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-[#85d9b6]/80">
                    {entity} • {tag}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-3 sm:gap-4">
                <nav
                  className="hidden items-center gap-1 rounded-xl border border-[#cdd6d0] bg-[#eef2ef] p-1 text-sm lg:flex"
                  aria-label="Primary"
                >
                  <a
                    href="#calculator"
                    className="rounded-lg bg-[#0e5c43] px-3 py-1.5 font-semibold text-white shadow-sm"
                  >
                    Calculator
                  </a>
                  <a
                    href="#how-it-works"
                    className="rounded-lg px-3 py-1.5 text-[#334155] transition hover:text-[#0f172a]"
                  >
                    The Formula
                  </a>
                  <a
                    href="#settlement-ranges"
                    className="rounded-lg px-3 py-1.5 text-[#334155] transition hover:text-[#0f172a]"
                  >
                    {rangesLabel}
                  </a>
                  <a
                    href="#faq"
                    className="rounded-lg px-3 py-1.5 text-[#334155] transition hover:text-[#0f172a]"
                  >
                    FAQ
                  </a>
                </nav>

                <a
                  href={client.ctaUrl}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#157a58] px-4 py-2.5 text-sm font-semibold tracking-wide text-white shadow-[0_2px_10px_rgba(14,92,67,0.35)] transition hover:bg-[#1b936b] sm:px-5"
                >
                  <span className="hidden sm:inline">{client.ctaText}</span>
                  <span className="sm:hidden">Consult</span>
                  <ArrowRightIcon size={14} className="opacity-80" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#193d30] bg-[#0d221b] px-4 py-2">
            <p className="mx-auto flex max-w-[1200px] items-center justify-center gap-2 rounded-full border border-[#1f4b3c] bg-[#133026] px-4 py-1 text-center text-[11px] text-[#b9cdc3]">
              <strong className="font-semibold text-white">
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

  return (
    <>
      <div className="border-b border-slate-800 bg-plg-navy text-xs text-white print:hidden">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="inline-flex items-center rounded bg-plg-crimson px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              {state === "WA"
                ? "Washington State"
                : state === "CA"
                  ? "California"
                  : client.state}
            </span>
            <span className="text-slate-300">{cities}</span>
          </div>
          <div className="flex items-center space-x-6 text-xs text-slate-300">
            {state === "WA" ? (
              <span className="hidden md:inline">
                <ScaleIcon
                  size={14}
                  className="mr-1.5 inline-block align-[-2px] text-plg-gold"
                />
                RCW § 4.22.005 Pure Comparative Negligence
              </span>
            ) : state === "CA" ? (
              <span className="hidden md:inline">
                <ScaleIcon
                  size={14}
                  className="mr-1.5 inline-block align-[-2px] text-plg-gold"
                />
                California Pure Comparative Negligence
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
              {showLogo ? (
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
                    {entity}
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
                  {rangesLabel}
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
