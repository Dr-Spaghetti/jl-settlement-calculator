export function HowItWorks() {
  const steps = [
    {
      title: "Add up economic damages",
      body: "Past and future medical bills, lost wages, and other out-of-pocket costs form the base used for pain-and-suffering multipliers. Property damage is tracked separately and added after multiplication.",
    },
    {
      title: "Choose a multiplier band",
      body: "Severity sets a starting band (roughly 1.5×–5×+). Clear documentation and longer treatment often support higher multipliers; disputed liability and brief care often pull them down.",
    },
    {
      title: "Adjust for case levers",
      body: "Care type (chiro / MD / surgery), months of treatment, and liability clarity nudge the band up or down within sensible bounds — producing low, mid, and high estimates.",
    },
    {
      title: "Remember the caveats",
      body: "Insurance policy limits, comparative fault, venue, prior injuries, and proof quality can overshadow any formula. Use this as a conversation starter with counsel — not a verdict.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-white py-16 sm:py-20"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="how-heading"
          className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
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
              className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: "var(--brand-primary)" }}
                aria-hidden
              >
                {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 font-mono text-sm text-slate-700">
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-slate-500">
            Simplified formula
          </p>
          <p className="mt-2 overflow-x-auto whitespace-nowrap">
            Estimate ≈ (Medical + Wages + Other) × Multiplier + PropertyDamage
          </p>
        </div>
      </div>
    </section>
  );
}
