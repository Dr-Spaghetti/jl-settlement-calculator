import type { ComponentType } from "react";
import type { ClientConfig } from "@/lib/types";
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
  const trust =
    client.trustStats?.length === 4
      ? client.trustStats
      : [
          { value: "100% Private", label: "Zero data stored on servers" },
          {
            value: "WA Specific",
            label:
              client.state.toUpperCase() === "WA"
                ? "RCW 4.22.005 comparative rules"
                : `${client.state} comparative rules`,
          },
          { value: "Zero fee unless we win", label: "Contingency legal fee model" },
          {
            value: "Free consultation",
            label: client.trustStats?.[0]?.label || `${client.city} · ${client.state}`,
          },
        ];

  const supportCopy =
    client.state.toUpperCase() === "WA"
      ? "An educational estimate using common valuation concepts and Washington’s pure comparative fault laws (RCW 4.22.005). Illustrative ranges only — not a case valuation or legal advice."
      : client.tagline;

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-plg-borderMuted bg-gradient-to-b from-white via-plg-cream to-plg-warmIvory/50 pb-16 pt-12"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#8C1D24_1px,transparent_1px)] opacity-[0.03] [background-size:24px_24px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1
            id="hero-heading"
            className="font-serif mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
          >
            {client.state.toUpperCase() === "WA" ? "Washington Car Accident" : "Car Accident"}{" "}
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
