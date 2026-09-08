import type { ClientConfig } from "@/lib/types";

export function Hero({ client }: { client: ClientConfig }) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-slate-950 text-white"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 20% 20%, ${client.primaryColor}88, transparent), radial-gradient(ellipse 60% 50% at 90% 10%, ${client.secondaryColor}55, transparent)`,
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
        <p className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-200 backdrop-blur">
          Free educational estimate · {client.city}, {client.state}
        </p>
        <h1
          id="hero-heading"
          className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
        >
          Car Accident Settlement Calculator
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
          {client.tagline}
        </p>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          Get a transparent low / mid / high range using the same multiplier method many
          adjusters discuss — then compare any offer you&apos;ve received with an{" "}
          <strong className="font-semibold text-slate-200">Offer Reality Check</strong>.
          Nothing is stored; all math runs in your browser.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#calculator"
            className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-slate-950 shadow-card transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            style={{ backgroundColor: "var(--brand-secondary)" }}
          >
            Start the calculator
          </a>
          <a
            href={client.ctaUrl}
            className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            {client.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
