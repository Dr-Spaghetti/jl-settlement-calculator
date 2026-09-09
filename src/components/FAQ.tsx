import type { ClientConfig } from "@/lib/types";
import type { ReactNode } from "react";

type FaqItem = {
  q: string;
  a: ReactNode;
};

function buildFaqs(client: ClientConfig): FaqItem[] {
  const phone = client.phone;
  const tel = phone.replace(/[^\d+]/g, "");
  const state = client.state.toUpperCase();
  const isWa = state === "WA";
  const isCa = state === "CA";

  const base: FaqItem[] = [
    {
      q: "How much is my car accident settlement worth?",
      a: "There is no single average that predicts your case. A common educational approach starts from economic damages (medical bills, lost wages, and related costs), estimates pain and suffering with a severity multiplier—often discussed around 1.5×–5×—and accounts for fault and available coverage. This calculator applies that method to your inputs and returns a low / mid / high range, not a guaranteed payout.",
    },
    {
      q: "How do insurance companies calculate car accident settlements?",
      a: "Many discussions use a multiplier-style approach: start from proven economic losses, estimate pain and suffering with a severity factor, add property damage (usually not multiplied), then consider fault and available coverage. This tool shows that educational structure—including Demand-style vs Adjuster-style views—so you can see how inputs move the range. It does not recreate any insurer’s proprietary software.",
    },
    {
      q: "How is pain and suffering calculated after a car accident?",
      a: "Pain and suffering is the non-economic part of a claim. The usual convention is medical or economic damages × a multiplier tied to severity (soft tissue toward the low end; surgery or permanent impairment toward the high end). Permanency, treatment length, care type, and treatment gaps all nudge that factor. Enter those levers in the calculator to see how the mid estimate changes.",
    },
  ];

  if (isWa) {
    base.push(
      {
        q: "How long do I have to file a personal injury claim in Washington?",
        a: (
          <>
            Deadlines are strict. Premier Law Group notes that in most Washington personal
            injury cases you generally have about three years to take action against the
            at-fault party, though the deadline can vary with the facts of your case. This
            is educational information only—not a determination of your filing deadline.
            Confirm timing with a licensed Washington attorney before relying on any date.
          </>
        ),
      },
      {
        q: "Does my percentage of fault reduce a Washington car accident settlement?",
        a: (
          <>
            Washington generally follows pure comparative negligence: contributory fault
            typically reduces recoverable damages by your percentage of fault but does not
            automatically bar recovery (see RCW 4.22.005 for the statutory rule). Enter your
            estimated fault % and set the state to WA in the calculator to see an educational
            recoverable range after that reduction. Insurers may still dispute fault share—
            this tool does not decide liability.
          </>
        ),
      },
      {
        q: "What does it cost to hire a personal injury lawyer?",
        a: (
          <>
            {client.shortName} handles many personal injury claims on a contingency-fee
            basis: the firm is paid a percentage of the recovery and, as they state on their
            site, you don’t pay a penny unless they win your case. Free consultations are
            offered for vehicle accident, personal injury, and wrongful death matters. Fee
            terms are set in a written agreement—ask during your consult.
          </>
        ),
      }
    );
  } else if (isCa) {
    base.push(
      {
        q: "How long do I have to file a personal injury claim in California?",
        a: (
          <>
            California personal injury deadlines are strict and fact-dependent. Many injury
            claims against private parties are discussed under a roughly two-year framework,
            but exceptions, notice rules, and different claim types can change the timeline.
            This is educational information only—not a determination of your filing deadline.
            Confirm timing with a licensed California attorney before relying on any date.
          </>
        ),
      },
      {
        q: "Does my percentage of fault reduce a California car accident settlement?",
        a: (
          <>
            California generally follows pure comparative negligence: your share of fault
            typically reduces recoverable damages by that percentage but does not
            automatically bar recovery even if you are mostly at fault. Enter your estimated
            fault % and set the state to CA in the calculator to see an educational
            recoverable range after that reduction. Insurers may still dispute fault share—
            this tool does not decide liability.
          </>
        ),
      },
      {
        q: "What does it cost to hire a personal injury lawyer?",
        a: (
          <>
            Many California personal injury lawyers work on contingency, meaning attorney
            fees are typically a percentage of any recovery and discussed up front.{" "}
            {client.shortName} offers a free consultation so you can ask about fee
            arrangements for your matter. This calculator is free and educational only—
            fee terms are set in a written agreement.
          </>
        ),
      }
    );
  } else {
    base.push(
      {
        q: "Does my percentage of fault reduce my car accident settlement?",
        a: "In most states, yes. Pure comparative negligence reduces recovery by your fault share; modified systems can bar recovery at 50% or 51%; a few states still use contributory negligence (any fault may bar recovery). Enter your estimated fault % and state—the range shows recoverable dollars after those rules, with a pre-fault footnote for context.",
      },
      {
        q: "What does it cost to hire a personal injury lawyer?",
        a: `Many personal injury lawyers work on contingency, meaning fees come from a percentage of any recovery. ${client.shortName} can explain fee arrangements during a consultation. This calculator is free and educational only.`,
      }
    );
  }

  base.push(
    {
      q: "What is a fair car accident settlement offer?",
      a: "“Fair” depends on proof, fault, venue, and insurance limits—not a national average. A practical check: compare the offer to a mid-range estimate built from your bills, wages, injury details, and fault %. Use Offer Reality Check to see whether an offer sits well below, near, or above that mid point. Early insurer offers are often starting points.",
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
            className="font-semibold text-plg-crimson underline decoration-slate-300 underline-offset-2 hover:decoration-plg-crimson"
            href={`tel:${tel}`}
          >
            {phone}
          </a>{" "}
          or a licensed attorney in your state.
        </>
      ),
    }
  );

  return base;
}

export function FAQ({ client }: { client: ClientConfig }) {
  const faqs = buildFaqs(client);

  return (
    <section
      id="faq"
      className="scroll-mt-28 border-t border-plg-borderMuted bg-plg-cream py-16 sm:py-20"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <span className="text-xs font-bold uppercase tracking-wider text-plg-crimson">
          Common Questions
        </span>
        <h2
          id="faq-heading"
          className="font-serif mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
        >
          Frequently asked questions
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Educational answers only — not legal advice. Rules and deadlines can vary; confirm
          details with a licensed attorney{client.state ? ` in ${client.state}` : ""}.
        </p>
        <div className="mt-8 divide-y divide-plg-borderMuted rounded-2xl border border-plg-borderMuted bg-white px-5 shadow-sm">
          {faqs.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  <span className="font-serif text-base font-semibold text-slate-900">
                    {item.q}
                  </span>
                  <span
                    className="mt-0.5 shrink-0 text-plg-crimson motion-safe:transition group-open:rotate-45"
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
