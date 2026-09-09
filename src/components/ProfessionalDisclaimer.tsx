import type { ClientConfig } from "@/lib/types";

export function ProfessionalDisclaimer({ client }: { client: ClientConfig }) {
  return (
    <section
      className="border-t border-plg-borderMuted bg-plg-warmIvory/80 py-12"
      aria-labelledby="disclaimer-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="disclaimer-heading"
          className="font-serif text-sm font-semibold uppercase tracking-[0.12em] text-plg-crimson"
        >
          Important legal disclaimer
        </h2>
        <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-slate-700">
          <p>{client.attorneyDisclaimer}</p>
          <p>
            Settlement values depend on liability, medical proof, insurance policy limits,
            venue, comparative fault, prior injuries, and negotiation — factors this
            browser-only tool cannot evaluate. Figures shown are educational ranges using a
            simplified multiplier method, not a guarantee, appraisal, or prediction of any
            outcome.
          </p>
          <p>
            No attorney-client relationship is formed by using this calculator. For advice
            about your situation, contact a licensed attorney in your jurisdiction — call{" "}
            <a
              className="font-semibold text-plg-crimson underline decoration-slate-300 underline-offset-2 hover:decoration-plg-crimson"
              href={`tel:${client.phone.replace(/[^\d+]/g, "")}`}
            >
              {client.phone}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
