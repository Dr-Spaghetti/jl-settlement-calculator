import type { ClientConfig } from "@/lib/types";
import { PhoneIcon, ArrowRightIcon, ScaleIcon } from "@/components/icons";

export const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;

/** Responsible attorney + office address + no attorney-client line (compact, every page). */
export function legalLine(c: ClientConfig): string {
  if (!c.responsibleAttorney || !c.officeAddress) {
    throw new Error(`clients/${c.id}.json: responsibleAttorney and officeAddress are required`);
  }
  return (`${c.firmName}, ${c.officeAddress}, ${c.city}, ${c.state} ${c.officeZip ?? ""}`.trim() +
    (c.additionalOffices?.length ? `; ${c.additionalOffices.join("; ")}` : "")) +
    `. Responsible attorney: ${c.responsibleAttorney}. Use of this tool does not create an attorney-client relationship and is not legal advice.`;
}

export function FirmHeader({ client, regionName, rule }: { client: ClientConfig; regionName: string; rule: string }) {
  const logo = client.logo!;
  return (
    <>
      <div className="border-b border-t-text/10 bg-t-header text-xs">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-t-muted">
            <span className="rounded bg-t-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-t-on-accent">
              {regionName}
            </span>
            <span className="hidden items-center md:inline-flex">
              <ScaleIcon size={14} className="mr-1.5 text-t-accent" />
              {rule}
            </span>
          </div>
          <a href={telHref(client.phone)} className="flex min-h-[32px] items-center font-semibold text-t-text hover:text-t-accent">
            <PhoneIcon size={14} className="mr-1.5 text-t-accent" />
            {client.phone}
          </a>
        </div>
      </div>
      <header
        className="sticky top-0 z-40 border-b border-t-accent/40 shadow-md"
        style={{
          backgroundColor: logo.headerBg,
          // Logo heights per firm (CSS px). Bar = logo + the same vertical padding as before (14px phone, 12px desktop).
          ["--logo-h-m" as string]: `${logo.heightPhone ?? 44}px`,
          ["--logo-h-d" as string]: `${logo.heightDesktop ?? 56}px`,
        }}
      >
        <div className="mx-auto flex h-[calc(var(--logo-h-m)+28px)] max-w-[1200px] items-center justify-between gap-4 px-4 sm:h-[calc(var(--logo-h-d)+24px)] sm:px-6 lg:px-8">
          <a href="#top" id="firm-logo-box" className="flex h-full shrink-0 items-center" aria-label={`${client.firmName} home`}>
            {/* Official file, untouched; scaled by CSS only. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              id="firm-logo"
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="firm-logo block h-[var(--logo-h-m)] w-auto sm:h-[var(--logo-h-d)]"
              // Optical centering of the file's artwork inside its own canvas (CSS move only; file untouched).
              style={{
                transform: `translate(${(-(logo.artworkOffsetX ?? 0) / logo.width) * 100}%, ${(-(logo.artworkOffsetY ?? 0) / logo.height) * 100}%)`,
              }}
              decoding="async"
            />
          </a>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1 rounded-xl border border-t-muted/20 bg-t-surface p-1 text-sm lg:flex" aria-label="Primary">
              <a href="#calculator" className="rounded-lg bg-t-accent px-3 py-1.5 font-semibold text-t-on-accent">Calculator</a>
              <a href="#how-it-works" className="rounded-lg px-3 py-1.5 text-t-muted hover:text-t-text">The Formula</a>
              <a href="#faq" className="rounded-lg px-3 py-1.5 text-t-muted hover:text-t-text">FAQ</a>
            </nav>
            <a href={client.ctaUrl} className="hidden items-center gap-2 rounded-lg bg-t-accent px-4 py-2.5 text-sm font-semibold text-t-on-accent shadow-sm hover:bg-t-accent/90 sm:inline-flex">
              {client.ctaText} <ArrowRightIcon size={14} />
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

export function FirmHero({ a, b, chips }: { a: string; b: string; chips: { title: string; detail: string }[] }) {
  return (
    <section id="top" className="border-b border-t-muted/15 bg-gradient-to-b from-t-header to-t-ground px-4 pb-12 pt-10 text-center sm:pt-14">
      <h1 className="font-display text-balance text-4xl font-semibold leading-tight text-t-text sm:text-5xl">
        {a}
        <br />
        <span className="italic text-t-accent">{b}</span>
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-balance text-sm text-t-text sm:text-base">
        Estimate only. Not a guarantee of any result or legal advice.
      </p>
      <a href="#calculator" className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-t-accent px-5 text-sm font-semibold text-t-on-accent shadow-md hover:bg-t-accent/90">
        Start estimate
      </a>
      <ul className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-2">
        {chips.map((c) => (
          <li key={c.title} className="rounded-full border border-t-muted/25 bg-t-surface px-4 py-1.5 text-left text-[11px] leading-tight">
            <span className="block font-bold uppercase tracking-wider text-t-text">{c.title}</span>
            <span className="text-t-muted">{c.detail}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FirmHowItWorks({ faultNote }: { faultNote: string }) {
  const steps = [
    ["Economic losses", "Medical bills (less benefits paid or payable by your own coverage), lost wages, other out-of-pocket costs and property damage are added once. They are never multiplied."],
    ["Pain & suffering", "Pain and suffering = medical bills × (multiplier − 1), on gross medical bills (including any your own insurer pays). The multiplier range comes from injury severity and treatment. Your share of fault is applied only once, as the statutory percentage reduction (with the bar above 50%). This is an estimate method, not law, and not how any insurer or court must value a claim."],
    ["State rules", faultNote],
    ["Policy reality", "A policy limit is not a legal cap on damages. If you enter the at-fault driver's per-person limit, the shown range stops there as a practical collection estimate; your underinsured motorist coverage (if you bought it) or other sources may apply. If you don't know the limit, nothing is limited."],
  ];
  return (
    <section id="how-it-works" className="px-4 py-14">
      <div className="mx-auto max-w-[1200px]">
        <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-t-accent">Transparent by design</p>
        <h2 className="font-display mt-2 text-center text-3xl font-semibold text-t-text">How the Estimate Is Calculated</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-xl border border-t-muted/20 bg-t-surface p-5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-t-accent text-xs font-bold text-t-on-accent">{i + 1}</span>
              <h3 className="font-display mt-3 text-lg font-semibold text-t-text">{t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-t-muted">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FirmFAQ({ items, client }: { items: readonly { q: string; a: string }[]; client: ClientConfig }) {
  return (
    <section id="faq" className="px-4 pb-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-center text-3xl font-semibold text-t-text">Frequently Asked Questions</h2>
        <div className="mt-6 divide-y divide-t-muted/20 rounded-xl border border-t-muted/20 bg-t-surface">
          {items.map((f) => (
            <details key={f.q} className="group px-5">
              <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 py-3 font-display text-base font-semibold text-t-text marker:content-none [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-t-accent transition group-open:rotate-180" aria-hidden>▾</span>
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-t-muted">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-t-accent/40 bg-t-surface p-6 text-center">
          <h2 className="font-display text-2xl font-semibold text-t-text">Want a lawyer to look at your numbers?</h2>
          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={client.ctaUrl} className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-t-accent px-5 text-sm font-semibold text-t-on-accent">{client.ctaText}</a>
            <a href={telHref(client.phone)} className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-t-text/40 px-5 text-sm font-semibold text-t-text">Call {client.phone}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FirmFooter({ client }: { client: ClientConfig }) {
  return (
    <footer className="border-t border-t-accent/30 bg-t-header px-4 pb-24 pt-6 lg:pb-6">
      <p id="legal-line" className="mx-auto max-w-[1200px] text-center text-[11px] leading-relaxed text-t-muted">
        {legalLine(client)}
      </p>
    </footer>
  );
}

export function FirmStickyCTA({ client }: { client: ClientConfig }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-t-accent/40 bg-t-surface/95 p-3 backdrop-blur lg:hidden">
      <a href={client.ctaUrl} className="flex min-h-[44px] flex-1 items-center justify-center rounded-lg bg-t-accent text-sm font-semibold text-t-on-accent">{client.ctaText}</a>
      <a href={telHref(client.phone)} className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-t-text/40 text-sm font-semibold text-t-text">
        <PhoneIcon size={14} className="text-t-accent" /> Call
      </a>
    </div>
  );
}
