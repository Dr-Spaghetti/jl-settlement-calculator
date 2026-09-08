import type { ClientConfig } from "@/lib/types";

/** Default 3-col strip when client omits trustStats — privacy/education only, no fake recoveries. */
const DEFAULT_STATS = [
  { value: "Browser-only", label: "All math runs on your device" },
  { value: "No PII", label: "Nothing collected or stored" },
  { value: "Educational", label: "Not a case valuation or legal advice" },
] as const;

export function TrustStrip({ client }: { client: ClientConfig }) {
  const stats = client.trustStats?.length ? client.trustStats : [...DEFAULT_STATS];

  return (
    <section
      className="border-b border-[color-mix(in_srgb,var(--brand-primary)_12%,transparent)] bg-[var(--page-ground)]"
      aria-label="Calculator assurances"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-[color-mix(in_srgb,var(--brand-primary)_12%,transparent)] px-4 py-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 sm:py-6">
        {stats.map((stat) => (
          <div
            key={`${stat.value}-${stat.label}`}
            className="flex flex-col items-center px-4 py-3 text-center sm:py-0"
          >
            <p className="text-sm font-semibold text-[var(--brand-primary)]">{stat.value}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
