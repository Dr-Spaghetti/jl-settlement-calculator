import type { ClientConfig } from "@/lib/types";

export function CTASection({ client }: { client: ClientConfig }) {
  return (
    <section
      className="py-16 sm:py-20"
      style={{ backgroundColor: "var(--brand-primary)" }}
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2
          id="cta-heading"
          className="font-display text-2xl font-semibold text-white sm:text-3xl"
        >
          Ready to talk about your case?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 sm:text-base">
          {client.shortName} can review your facts, insurance coverage, and next steps —
          often at no upfront cost for qualifying injury matters.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={client.ctaUrl}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-card motion-safe:transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ backgroundColor: "var(--brand-secondary)" }}
          >
            {client.ctaText}
          </a>
          <a
            href={`tel:${client.phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur motion-safe:transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Call {client.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
