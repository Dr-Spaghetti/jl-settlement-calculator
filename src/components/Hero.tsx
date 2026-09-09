import type { ClientConfig } from "@/lib/types";
import { SignatureMoment } from "@/components/motion/SignatureMoment";

export function Hero({ client }: { client: ClientConfig }) {
  const eyebrow =
    client.heroEyebrow?.trim() ||
    `Free educational estimate · ${client.city}, ${client.state}`;

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[var(--brand-primary)] text-white"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 15% 0%, color-mix(in srgb, var(--brand-secondary) 35%, transparent), transparent 55%)`,
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:py-20">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
          {eyebrow}
        </p>
        <h1
          id="hero-heading"
          className="font-display max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
        >
          Car Accident Settlement Calculator
        </h1>
        <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">
          {client.tagline}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#calculator"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-card motion-safe:transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-primary)]"
            style={{ backgroundColor: "var(--brand-secondary)" }}
          >
            Start the calculator
          </a>
          <a
            href={client.ctaUrl}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur motion-safe:transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            {client.ctaText}
          </a>
        </div>

        <SignatureMoment placement="hero" className="mt-6" />
      </div>
    </section>
  );
}
