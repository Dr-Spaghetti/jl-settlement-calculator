import type { ClientConfig } from "@/lib/types";

export function Testimonials({ client }: { client: ClientConfig }) {
  const items = client.testimonials;
  if (!items?.length) return null;

  return (
    <section
      className="bg-white/50 py-14 sm:py-16"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="testimonials-heading"
          className="font-display text-2xl font-semibold tracking-tight text-[var(--brand-primary)] sm:text-3xl"
        >
          What clients say
        </h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <li
              key={t.name + t.quote.slice(0, 24)}
              className="rounded-2xl border border-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] bg-[var(--page-ground)] p-5 shadow-soft"
            >
              <blockquote className="font-display text-sm leading-relaxed text-slate-700">
                “{t.quote}”
              </blockquote>
              <p className="mt-4 text-sm font-semibold text-[var(--brand-primary)]">
                {t.name}
              </p>
              {t.detail ? (
                <p className="text-xs text-slate-500">{t.detail}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
