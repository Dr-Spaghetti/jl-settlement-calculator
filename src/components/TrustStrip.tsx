import type { ClientConfig } from "@/lib/types";

/** Default 3-pill strip when client omits trustStats — privacy/education only, no fake recoveries. */
const DEFAULT_PILLS = [
  { value: "Browser-only", label: "All math runs on your device" },
  { value: "No PII", label: "Nothing collected or stored" },
  { value: "Educational", label: "Not a case valuation or legal advice" },
] as const;

export function TrustStrip({ client }: { client: ClientConfig }) {
  const stats = client.trustStats?.length ? client.trustStats : [...DEFAULT_PILLS];

  return (
    <section
      className="border-b border-[color-mix(in_srgb,var(--brand-primary)_12%,transparent)] bg-[var(--page-ground)]"
      aria-label="Calculator assurances"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-stretch justify-center gap-2 px-4 py-5 sm:gap-3 sm:px-6 sm:py-6">
        {stats.map((stat) => (
          <div
            key={`${stat.value}-${stat.label}`}
            className="flex min-w-[9.5rem] flex-1 flex-col items-center rounded-full border border-[color-mix(in_srgb,var(--brand-primary)_14%,transparent)] bg-white/70 px-4 py-2.5 text-center shadow-soft sm:max-w-[14rem] sm:flex-none"
          >
            <p className="text-sm font-semibold text-[var(--brand-primary)]">{stat.value}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
