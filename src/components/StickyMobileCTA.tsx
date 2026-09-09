"use client";

import type { ClientConfig } from "@/lib/types";

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Sticky bottom bar on small screens — Call + primary CTA (no lead capture). */
export function StickyMobileCTA({ client }: { client: ClientConfig }) {
  return (
    <div
      className="sticky-mobile-cta fixed inset-x-0 bottom-0 z-50 border-t border-plg-borderMuted bg-white/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.22)] backdrop-blur-md md:hidden print:hidden"
      role="region"
      aria-label="Quick contact"
    >
      <div className="mx-auto flex max-w-lg gap-2">
        <a
          href={telHref(client.phone)}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-plg-navy"
        >
          Call {client.phone}
        </a>
        <a
          href={client.ctaUrl}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg bg-plg-crimson px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-plg-crimsonDark"
        >
          {client.ctaText}
        </a>
      </div>
    </div>
  );
}
