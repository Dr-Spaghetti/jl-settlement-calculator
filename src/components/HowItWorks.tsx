import { WORKED_EXAMPLE } from "@/lib/calculator";

export function HowItWorks() {
  const steps = [
    {
      title: "Add up economic damages",
      body: "Medical bills, lost wages, and other out-of-pocket costs form the multiplied base. Property damage is added after multiplication.",
    },
    {
      title: "Choose a multiplier band",
      body: "Severity sets a starting band (about 1.5×–5×+). Strong documentation and longer care support higher multipliers; disputed liability pulls them down.",
    },
    {
      title: "Adjust for case levers",
      body: "Care type, months of treatment, and liability clarity nudge the band within bounds — producing low, mid, and high estimates.",
    },
    {
      title: "Remember the caveats",
      body: "Policy limits, comparative fault, venue, and proof quality can overshadow any formula. Use this as a conversation starter — not a verdict.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-white/60 py-16 sm:py-20"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="how-heading"
          className="font-display text-2xl font-semibold tracking-tight text-[var(--brand-primary)] sm:text-3xl"
        >
          How the math works
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Insurers and attorneys often discuss a &ldquo;multiplier method&rdquo; for general
          damages. This calculator follows that educational framework transparently.
        </p>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] bg-[var(--page-ground)] p-6"
            >
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: "var(--brand-primary)" }}
                aria-hidden
              >
                {i + 1}
              </span>
              <h3 className="font-display mt-3 text-lg font-semibold text-[var(--brand-primary)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-xl border border-[color-mix(in_srgb,var(--brand-primary)_12%,transparent)] bg-white p-5 font-mono text-sm text-slate-700">
          <p className="legend-micro font-sans">Simplified formulas</p>
          <p className="mt-2 overflow-x-auto whitespace-nowrap">
            Demand ≈ (Medical + Wages + Other) × Multiplier + Property
          </p>
          <p className="mt-1 overflow-x-auto whitespace-nowrap text-slate-600">
            Adjuster ≈ Medical × Multiplier + Wages + Other + Property
          </p>
        </div>

        <details className="mt-8 rounded-2xl border border-[color-mix(in_srgb,var(--brand-primary)_12%,transparent)] bg-[var(--page-ground)] p-6">
          <summary className="cursor-pointer list-none marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-3">
              <span
                id="worked-example-heading"
                className="font-display text-lg font-semibold text-[var(--brand-primary)]"
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
