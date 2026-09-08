import { EDUCATIONAL_RANGES } from "@/lib/calculator";

export function RangesTable() {
  return (
    <section
      id="ranges"
      className="scroll-mt-20 bg-[var(--page-ground)] py-16 sm:py-20"
      aria-labelledby="ranges-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="ranges-heading"
          className="font-display text-2xl font-semibold tracking-tight text-[var(--brand-primary)] sm:text-3xl"
        >
          Educational settlement ranges
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Illustrative bands only — real cases vary widely by venue, policy limits, and
          proof. These figures are not averages from any firm&apos;s closed files.
        </p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] bg-white shadow-soft">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">
              Educational car accident settlement range examples by severity
            </caption>
            <thead className="bg-[var(--brand-primary)] text-white">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold sm:px-6">
                  Scenario
                </th>
                <th scope="col" className="px-4 py-3 font-semibold sm:px-6">
                  Medical specials
                </th>
                <th scope="col" className="px-4 py-3 font-semibold sm:px-6">
                  Typical multiplier
                </th>
                <th scope="col" className="px-4 py-3 font-semibold sm:px-6">
                  Illustrative total*
                </th>
              </tr>
            </thead>
            <tbody>
              {EDUCATIONAL_RANGES.map((row, idx) => (
                <tr
                  key={row.scenario}
                  className={idx % 2 === 0 ? "bg-white" : "bg-[var(--page-ground)]/80"}
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-[var(--brand-primary)] sm:px-6"
                  >
                    {row.scenario}
                  </th>
                  <td className="px-4 py-3 text-slate-600 sm:px-6">{row.medical}</td>
                  <td className="px-4 py-3 text-slate-600 sm:px-6">
                    {row.typicalMultiplier}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800 sm:px-6">
                    {row.illustrative}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          *Catastrophic matters often involve structured settlements, life-care plans, and
          multiple coverage layers. Always seek individualized legal advice.
        </p>
      </div>
    </section>
  );
}
