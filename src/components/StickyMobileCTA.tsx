"use client";

import type { ClientConfig } from "@/lib/types";

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Sticky bottom bar on small screens — Call + Get review (Design-locked). */
export function StickyMobileCTA({ client }: { client: ClientConfig }) {
  return (
    <div
      className="sticky-mobile-cta fixed inset-x-0 bottom-0 z-40 border-t border-[color-mix(in_srgb,var(--brand-primary)_12%,transparent)] bg-[color-mix(in_srgb,var(--page-ground)_94%,white)]/95 p-3 shadow-[0_-8px_30px_-12px_rgba(10,37,64,0.22)] backdrop-blur-md md:hidden print:hidden"
      role="region"
      aria-label="Quick contact"
    >
      <div className="mx-auto flex max-w-lg gap-2">
        <a
          href={telHref(client.phone)}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--brand-primary)_20%,transparent)] bg-white px-3 py-3 text-sm font-semibold text-[var(--brand-primary)]"
        >
          Call {client.phone}
        </a>
        <a
          href={client.ctaUrl}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg px-3 py-3 text-sm font-semibold text-[var(--brand-primary)]"
          style={{ backgroundColor: "var(--brand-secondary)" }}
        >
          Get review
        </a>
      </div>
    </div>
  );
}
