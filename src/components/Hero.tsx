import type { ComponentType } from "react";
import type { ClientConfig } from "@/lib/types";
import { clientUsesDjFonts } from "@/lib/client";
import type { IconProps } from "@/components/icons";
import {
  BuildingIcon,
  CurrencyIcon,
  ScaleIcon,
  ShieldIcon,
} from "@/components/icons";

const TRUST_ICONS: ComponentType<IconProps>[] = [
  ShieldIcon,
  ScaleIcon,
  CurrencyIcon,
  BuildingIcon,
];

export function Hero({ client }: { client: ClientConfig }) {
  const isDj = clientUsesDjFonts(client);
  const state = client.state.toUpperCase();

  const trust =
    client.trustStats?.length === 4
      ? client.trustStats
      : [
          { value: "100% Private", label: "Zero data stored on servers" },
          {
            value: state === "CA" ? "CA Comparative" : "WA Specific",
            label:
              state === "WA"
                ? "RCW 4.22.005 comparative rules"
                : state === "CA"
                  ? "Pure comparative fault education"
                  : `${client.state} comparative rules`,
          },
          { value: "Zero fee unless we win", label: "Contingency legal fee model" },
          {
            value: "Free consultation",
            label: client.trustStats?.[0]?.label || `${client.city} · ${client.state}`,
          },
        ];

  const supportCopy =
    state === "WA"
      ? "An educational estimate using common valuation concepts and Washington’s pure comparative fault laws (RCW 4.22.005). Illustrative ranges only — not a case valuation or legal advice."
      : state === "CA"
        ? "An educational estimate using common valuation concepts and California’s pure comparative fault rules. Your share of fault may reduce recoverable damages, but does not automatically bar recovery. Illustrative ranges only — not a case valuation or legal advice."
        : client.tagline;

  const titleLead =
    state === "WA"
      ? "Washington Car Accident"
      : state === "CA"
        ? "California Car Accident"
        : "Car Accident";

  if (isDj) {
    const shortSupport =
      "Educational California settlement ranges — illustrative only, not legal advice.";

    return (
      <section
        id="top"
        className="relative overflow-hidden border-b border-[#d8dfdb] bg-gradient-to-b from-[#091b15] via-[#0d261e] to-[#eef2ef] pb-8 pt-8 sm:pb-10 sm:pt-9"
        aria-labelledby="hero-heading"
      >
        <div
          className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#1b5e47]/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-[#144233]/20 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1
              id="hero-heading"
              className="font-display mb-4 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[56px] lg:leading-[1.08]"
            >
              {titleLead}{" "}
              <span className="font-display italic text-[#85d9b6]">
                Settlement Calculator
              </span>
            </h1>

            <p className="mx-auto mb-5 max-w-2xl text-sm font-normal leading-relaxed text-[#c3d5cb] sm:text-base">
              {shortSupport}
            </p>

            <div className="mb-6 flex justify-center">
              <a
                href="#calculator"
                className="inline-flex items-center gap-2 rounded-lg bg-[#047857] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_2px_10px_rgba(4,120,87,0.35)] transition hover:bg-[#064E3B]"
              >
                Start estimate
              </a>
            </div>

            <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2">
              {trust.map((stat, i) => {
                const Icon = TRUST_ICONS[i] ?? ShieldIcon;
                return (
                  <div
                    key={`${stat.value}-${stat.label}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#225542] bg-[#113126]/90 px-3 py-1.5 text-left"
                  >
                    <Icon size={14} className="shrink-0 text-[#85d9b6]" aria-hidden />
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-white">
                        {stat.value}
                      </div>
                      <div className="truncate text-[10px] text-[#a3bdb2]">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-plg-borderMuted bg-gradient-to-b from-white via-plg-cream to-plg-warmIvory/50 pb-16 pt-12"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--plg-crimson)_1px,transparent_1px)] opacity-[0.03] [background-size:24px_24px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {client.heroEyebrow ? (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-plg-crimson">
              {client.heroEyebrow}
            </p>
          ) : null}
          <h1
            id="hero-heading"
            className="font-serif mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
          >
            {titleLead}{" "}
            <br className="hidden sm:inline" />
            <span className="font-serif italic text-plg-crimson">Settlement Calculator</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg font-normal leading-relaxed text-slate-600 sm:text-xl">
            {supportCopy}
          </p>

          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 border-t border-slate-200/80 pt-4 sm:grid-cols-4">
            {trust.map((stat, i) => {
              const Icon = TRUST_ICONS[i] ?? ShieldIcon;
              return (
                <div
                  key={`${stat.value}-${stat.label}`}
                  className="flex items-center justify-center gap-2.5 p-2 text-left"
                >
                  <Icon
                    size={20}
                    className="shrink-0 text-plg-crimson"
                    aria-hidden
                  />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-slate-500">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
