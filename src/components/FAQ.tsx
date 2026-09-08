const FAQS = [
  {
    q: "Is this calculator free to use?",
    a: "Yes. It runs entirely in your browser. We do not ask for your name, email, or case details to produce an estimate.",
  },
  {
    q: "Why is there a low, mid, and high number?",
    a: "Settlement valuation is uncertain. Showing a range reflects how severity, treatment, liability, and negotiation can move outcomes — and avoids implying false precision.",
  },
  {
    q: "What is the Offer Reality Check?",
    a: "If you enter an insurer offer, we compare it to the mid-range educational estimate for your inputs and summarize whether it appears well below, below, near, or above that mid point. It is not a fairness score or legal opinion.",
  },
  {
    q: "Does comparative fault change my number?",
    a: "The calculator shows an educational note about your state's general fault system. It does not automatically reduce the range by a fault percentage — that requires case-specific analysis.",
  },
  {
    q: "Will an attorney get the same number?",
    a: "Unlikely. Attorneys weigh medical proof, experts, venue, insurance limits, prior claims, and negotiation dynamics that no public form can capture. Treat this as a starting point for a conversation.",
  },
  {
    q: "Is this legal advice?",
    a: "No. Using this tool does not create an attorney-client relationship. For advice about your situation, contact a licensed attorney in your state.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="scroll-mt-20 bg-white py-16 sm:py-20"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2
          id="faq-heading"
          className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          Frequently asked questions
        </h2>
        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none text-base font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  {item.q}
                  <span
                    className="mt-0.5 shrink-0 text-slate-400 transition group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
