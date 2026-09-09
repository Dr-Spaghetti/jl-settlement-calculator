import { WORKED_EXAMPLE } from "@/lib/calculator";
import { CheckIcon } from "@/components/icons";

export function HowItWorks() {
  const steps = [
    {
      title: "Total Economic Base",
      body: "Tangible damages include past hospital bills, future therapy, documented lost income, and out-of-pocket medical costs.",
    },
    {
      title: "The Multiplier Band",
      body: "Pain, emotional distress, and disruption to daily life are represented by a severity multiplier, generally ranging from about 1.5× up to 5.0×+.",
    },
    {
      title: "Adjust for Case Levers",
      body: "Care type, treatment length, gaps in care, permanency, and liability clarity nudge the multiplier band within bounds.",
    },
    {
      title: "Apply Policy Reality",
      body: "Insurance carriers often cannot pay beyond bodily injury limits. Identifying UIM or excess coverage is essential when damages exceed limits.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="scroll-mt-28 border-t border-plg-borderMuted bg-white py-16"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-plg-crimson">
            Transparency In Valuation
          </span>
          <h2
            id="how-heading"
            className="font-serif mt-1 mb-3 text-3xl font-bold text-slate-900 sm:text-4xl"
          >
            How Insurance Companies and Lawyers Calculate Your Settlement
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Insurers and attorneys often discuss a “multiplier method” for general damages.
            This calculator follows that educational framework transparently — not a
            prediction of any particular outcome.
          </p>
        </div>

        <ol className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-xl border border-slate-200 bg-plg-cream/50 p-6 transition hover:bg-white hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg font-serif text-sm font-bold text-white ${
                  i % 2 === 0 ? "bg-plg-navy" : "bg-plg-crimson"
                }`}
                aria-hidden
              >
                {i + 1}
              </div>
              <h3 className="font-serif mb-2 text-lg font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border border-slate-800 bg-plg-navy p-6 text-white shadow-plg-panel sm:p-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-plg-gold">
                Formula Architectures
              </span>
              <h3 className="font-serif mt-1 mb-4 text-2xl font-bold text-white">
                Demand Formula vs Adjuster Formula
              </h3>
              <div className="space-y-4 font-mono text-xs">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <span className="mb-1 block font-bold text-plg-gold">
                    Plaintiff Demand Model:
                  </span>
                  <code>
                    Gross = [(Medical Specials + Lost Wages + OOP) × Multiplier] + Property
                    Damage
                  </code>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <span className="mb-1 block font-bold text-slate-300">
                    Insurance Adjuster Model:
                  </span>
                  <code>
                    Gross = (Medical Specials × Multiplier) + Lost Wages + OOP + Property
                    Damage
                  </code>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <h4 className="font-serif mb-2 text-lg font-bold text-white">
                Educational caveat
              </h4>
              <p className="mb-4 text-xs leading-relaxed text-slate-300">
                Policy limits, comparative fault, venue, and proof quality can overshadow
                any formula. Use this tool as a conversation starter with a licensed
                attorney — not a verdict or guarantee.
              </p>
              <div className="flex items-center gap-3 text-xs text-plg-gold">
                <CheckIcon size={16} className="shrink-0 text-plg-crimson" />
                <span>
                  Contingency fee for many injury cases — no attorney fee unless the firm
                  wins.
                </span>
              </div>
            </div>
          </div>
        </div>

        <details className="mt-8 rounded-2xl border border-plg-borderMuted bg-plg-cream p-6">
          <summary className="cursor-pointer list-none marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-3">
              <span
                id="worked-example-heading"
                className="font-serif text-lg font-semibold text-slate-900"
              >
                {WORKED_EXAMPLE.title}
              </span>
              <span className="text-sm font-medium text-slate-500" aria-hidden>
                Show
              </span>
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {WORKED_EXAMPLE.narrative}
          </p>
          <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
            {WORKED_EXAMPLE.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
