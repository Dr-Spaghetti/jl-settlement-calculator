import type { ClientConfig } from "@/lib/types";
import type { ReactNode } from "react";

type FaqItem = {
  q: string;
  a: ReactNode;
};

export function FAQ({ client }: { client: ClientConfig }) {
  const phone = client.phone;
  const tel = phone.replace(/[^\d+]/g, "");

  const faqs: FaqItem[] = [
    {
      q: "How much is my car accident settlement worth?",
      a: "There is no single average that predicts your case. Adjusters often start from economic damages (medical bills, lost wages, and related costs), then estimate pain and suffering with a severity multiplier—commonly about 1.5×–5×—and reduce for your share of fault and available insurance limits. This calculator applies that educational method to your inputs and returns a low / mid / high range, not a guaranteed payout.",
    },
    {
      q: "How do insurance companies calculate car accident settlements?",
      a: "Most use a multiplier method: add proven specials, multiply for pain and suffering based on injury severity and documentation, add property damage (usually not multiplied), then adjust for liability and policy limits. This tool mirrors that structure—including Demand-style vs Adjuster-style formulas—so you can see how the math moves.",
    },
    {
      q: "How is pain and suffering calculated after a car accident?",
      a: "Pain and suffering is the non-economic part of a claim. The usual convention is medical or economic damages × a multiplier tied to severity (soft tissue toward the low end; surgery or permanent impairment toward the high end). Permanency, treatment length, care type, and treatment gaps all nudge that factor. Enter those levers in the calculator to see how the mid estimate changes.",
    },
    {
      q: "What is a fair car accident settlement offer?",
      a: "“Fair” depends on proof, fault, venue, and insurance limits—not a national average. A practical check: compare the offer to a mid-range estimate built from your bills, wages, injury details, and fault %. Use Offer Reality Check to see whether an offer sits well below, near, or above that mid point. Early insurer offers are often starting points.",
    },
    {
      q: "Does my percentage of fault reduce my car accident settlement?",
      a: "In most states, yes. Pure comparative negligence reduces recovery by your fault share; modified systems can bar recovery at 50% or 51%; a few states still use contributory negligence (any fault may bar recovery). Enter your estimated fault % and state—the range shows recoverable dollars after those rules, with a pre-fault footnote for context.",
    },
    {
      q: "Do insurance policy limits cap my car accident settlement?",
      a: "Often. Even a strong claim may be limited by the at-fault driver’s bodily injury limits (and sometimes your underinsured-motorist coverage). Enter per-person BI limits to see when the estimate may be capped and when policy limits may bind.",
    },
    {
      q: "How much is a car accident settlement with soft tissue injuries or whiplash?",
      a: "Soft-tissue claims usually sit toward the lower multiplier band (often roughly 1.5×–2.5×), especially with short treatment and full recovery. Longer care, imaging findings, specialist treatment, or lasting symptoms can push higher. Use severity, care type, and months of treatment in the calculator for a range that fits your facts—not a one-size average.",
    },
    {
      q: "Is an online car accident settlement calculator accurate?",
      a: (
        <>
          It is a starting point, not a case valuation. No public form can weigh medical
          records, experts, venue, prior injuries, or negotiation strategy. Treat the
          result as an educational range to prepare for a consult—not a promise of what
          you will receive. This tool is not legal advice and does not create an
          attorney-client relationship. For a real review, contact {client.shortName} at{" "}
          <a
            className="font-semibold text-[var(--brand-primary)] underline decoration-slate-300 underline-offset-2 hover:decoration-[var(--brand-primary)]"
            href={`tel:${tel}`}
          >
            {phone}
          </a>{" "}
          or a licensed attorney in your state.
        </>
      ),
    },
  ];

  return (
    <section
      id="faq"
      className="scroll-mt-20 bg-[var(--page-ground)] py-16 sm:py-20"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2
          id="faq-heading"
          className="font-display text-2xl font-semibold tracking-tight text-[var(--brand-primary)] sm:text-3xl"
        >
          Frequently asked questions
        </h2>
        <div className="mt-8 divide-y divide-slate-200/80 border-y border-slate-200/80">
          {faqs.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  <span className="font-display text-base font-semibold text-[var(--brand-primary)]">
                    {item.q}
                  </span>
                  <span
                    className="mt-0.5 shrink-0 text-slate-400 motion-safe:transition group-open:rotate-45"
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
