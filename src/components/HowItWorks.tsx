import { WORKED_EXAMPLE } from "@/lib/calculator";
import { CheckIcon } from "@/components/icons";

export function HowItWorks({ dj = false }: { dj?: boolean } = {}) {
  const steps = [
    {
      title: "Total Economic Base",
      body: "Tangible damages include past hospital bills, future therapy, documented lost income, and out-of-pocket medical costs.",
    },
    {
      title: "The Multiplier Band",
      body: dj
        ? "Pain, emotional distress, and disruption to daily life are represented by a severity multiplier. This calculator applies a severity multiplier of about 1.25× to 7×, based on your inputs."
        : "Pain, emotional distress, and disruption to daily life are represented by a severity multiplier, generally ranging from about 1.5× up to 5.0×+.",
    },
    {
      title: "Adjust for Case Levers",
      body: "Care type, treatment length, gaps in care, permanency, and liability clarity nudge the multiplier band within bounds.",
    },
    {
      title: "Apply Policy Reality",
      body: "Available insurance coverage can limit what is realistically collectible. Identifying UIM or excess options matters when damages may exceed policy limits.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className={
        dj
          ? "scroll-mt-28 border-t border-[#C9C1B3]/20 bg-[#060E18] py-16"
          : "scroll-mt-28 border-t border-plg-borderMuted bg-transparent py-16"
      }
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              dj ? "text-[#B58A45]" : "text-plg-crimson"
            }`}
          >
            Transparency In Valuation
          </span>
          <h2
            id="how-heading"
            className={
              dj
                ? "font-serif mt-1 mb-3 text-3xl font-bold text-white sm:text-4xl"
                : "font-serif mt-1 mb-3 text-3xl font-bold text-slate-900 sm:text-4xl"
            }
          >
            {dj
              ? "How the Estimate Is Calculated"
              : "How Insurance Companies and Lawyers Calculate Your Settlement"}
          </h2>
          <p
            className={
              dj
                ? "text-sm leading-relaxed text-[#C9C1B3] sm:text-base"
                : "text-sm leading-relaxed text-slate-600 sm:text-base"
            }
          >
            {dj ? (
              "Attorneys and claims professionals often discuss a “multiplier method” for general damages. The figures come only from the numbers you enter and a simplified formula. They are not based on Djougourian Law Corporation’s case results, jury-verdict data, or any insurer’s software."
            ) : (
              <>
                Attorneys and claims professionals often discuss a “multiplier method” for
                general damages. This calculator shows that educational framework
                transparently — not a prediction of any particular outcome.
              </>
            )}
          </p>
        </div>

        <ol className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-xl border border-slate-200 bg-transparent px-5 pb-6 pt-8 text-center shadow-sm transition hover:shadow-md"
            >
              <div
                className={
                  dj
                    ? "absolute left-1/2 top-0 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#B58A45] text-sm font-bold text-[#1B1B1B] shadow-sm"
                    : "absolute left-1/2 top-0 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-plg-crimson text-sm font-bold text-white shadow-sm"
                }
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

        <div
          className={
            dj
              ? "rounded-2xl border border-[#B58A45]/50 bg-[#0D1B2A] p-6 text-white sm:p-8"
              : "rounded-2xl border border-slate-800 bg-plg-navy p-6 text-white shadow-plg-panel sm:p-8"
          }
        >
          <div
            className={
              dj
                ? "grid grid-cols-1 items-center gap-8"
                : "grid grid-cols-1 items-center gap-8 lg:grid-cols-2"
            }
          >
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

            {dj ? null : (
            <div className="rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <h4 className="font-serif mb-2 text-lg font-bold text-white">
                Educational caveat
              </h4>
              <p
                className={
                  dj
                    ? "text-sm leading-relaxed text-[#C9C1B3]"
                    : "mb-4 text-xs leading-relaxed text-slate-300"
                }
              >
                Policy limits, comparative fault, venue, and proof quality can overshadow
                any formula. Use this tool as a conversation starter with a licensed
                attorney — not a verdict or guarantee.
              </p>
              {dj ? null : (
                <div className="flex items-center gap-3 text-xs text-plg-gold">
                  <CheckIcon size={16} className="shrink-0 text-plg-crimson" />
                  <span>
                    Contingency fee for many injury cases — no attorney fee unless the firm
                    wins.
                  </span>
                </div>
              )}
            </div>
            )}
          </div>
        </div>

        <details
          className={
            dj
              ? "mt-8 rounded-2xl border border-[#C9C1B3]/20 bg-[#0D1B2A] p-6"
              : "mt-8 rounded-2xl border border-plg-borderMuted bg-plg-cream p-6"
          }
        >
          <summary className="cursor-pointer list-none marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-3">
              <span
                id="worked-example-heading"
                className={`font-serif text-lg font-semibold ${
                  dj ? "text-white" : "text-slate-900"
                }`}
              >
                {WORKED_EXAMPLE.title}
              </span>
              <span
                className={`text-sm font-medium ${dj ? "text-[#B58A45]" : "text-slate-500"}`}
                aria-hidden
              >
                Show
              </span>
            </span>
          </summary>
          <p
            className={`mt-3 text-sm leading-relaxed ${
              dj ? "text-[#C9C1B3]" : "text-slate-600"
            }`}
          >
            {WORKED_EXAMPLE.narrative}
          </p>
          <ul
            className={`mt-4 list-disc space-y-1.5 pl-5 text-sm ${
              dj ? "text-[#F5F0E6]" : "text-slate-700"
            }`}
          >
            {WORKED_EXAMPLE.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
