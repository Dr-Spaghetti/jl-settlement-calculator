import type { ClientConfig } from "@/lib/types";

export function ProfessionalDisclaimer({ client }: { client: ClientConfig }) {
  return (
    <section
      className="border-t border-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] bg-white/50 py-12"
      aria-labelledby="disclaimer-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="disclaimer-heading"
          className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-[var(--brand-primary)]"
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
              className="font-semibold text-[var(--brand-primary)] underline decoration-slate-300 underline-offset-2 hover:decoration-[var(--brand-primary)]"
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
