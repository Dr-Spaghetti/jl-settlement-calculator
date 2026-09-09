import type { ClientConfig } from "@/lib/types";

export function CTASection({ client }: { client: ClientConfig }) {
  return (
    <section
      className="border-t border-plg-borderMuted bg-plg-navy py-16 sm:py-20"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-bold uppercase tracking-wider text-plg-gold">
          Next Step
        </span>
        <h2
          id="cta-heading"
          className="font-serif mt-2 text-3xl font-bold text-white sm:text-4xl"
        >
          Ready to talk about your case?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
          {client.shortName} offers a free consultation for vehicle accident and personal
          injury matters. For qualifying contingency cases, you don’t pay attorney fees
          unless the firm wins — start with this educational estimate, then talk with a
          lawyer.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={client.ctaUrl}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-plg-crimson px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-plg-crimsonDark focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {client.ctaText}
          </a>
          <a
            href={`tel:${client.phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Call {client.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
