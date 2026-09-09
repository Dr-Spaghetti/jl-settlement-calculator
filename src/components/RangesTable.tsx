import type { ClientConfig } from "@/lib/types";
import { EDUCATIONAL_RANGES } from "@/lib/calculator";
import { stateRegionLabel } from "@/lib/client";

export function RangesTable({ client }: { client?: ClientConfig }) {
  const region = client ? stateRegionLabel(client.state) : "Educational";
  const eyebrow =
    client?.state.toUpperCase() === "WA"
      ? "Washington Benchmarks"
      : client?.state.toUpperCase() === "CA"
        ? "California Educational Benchmarks"
        : `${region} Benchmarks`;

  return (
    <section
      id="settlement-ranges"
      className="scroll-mt-28 border-t border-plg-borderMuted bg-plg-warmIvory/60 py-16"
      aria-labelledby="ranges-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-plg-crimson">
            {eyebrow}
          </span>
          <h2
            id="ranges-heading"
            className="font-serif mt-1 mb-3 text-3xl font-bold text-slate-900 sm:text-4xl"
          >
            Typical Educational Settlement Ranges by Injury Type
          </h2>
          <p className="text-xs text-slate-600 sm:text-sm">
            Illustrative bands only — real cases vary widely by venue, policy limits, and
            proof. These figures are not averages from any firm&apos;s closed files.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-plg-borderMuted bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <caption className="sr-only">
                Educational car accident settlement range examples by severity
              </caption>
              <thead>
                <tr className="bg-plg-navy text-[11px] uppercase tracking-wider text-white sm:text-xs">
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Scenario
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Medical Specials
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Usual Multiplier
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Illustrative Total*
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {EDUCATIONAL_RANGES.map((row) => (
                  <tr
                    key={row.scenario}
                    className="transition hover:bg-plg-warmIvory/30"
                  >
                    <th
                      scope="row"
                      className="px-5 py-4 font-bold text-slate-900"
                    >
                      {row.scenario}
                    </th>
                    <td className="px-5 py-4 font-mono">{row.medical}</td>
                    <td className="px-5 py-4 font-semibold text-plg-crimson">
                      {row.typicalMultiplier}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {row.illustrative}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          *Catastrophic matters often involve structured settlements, life-care plans, and
          multiple coverage layers. Always seek individualized legal advice.
        </p>
      </div>
    </section>
  );
}
