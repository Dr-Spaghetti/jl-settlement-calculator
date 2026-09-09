"use client";

import type { OfferRealityCheck } from "@/lib/types";
import { formatCurrency } from "@/lib/calculator";

const LABEL_COPY: Record<OfferRealityCheck["label"], string> = {
  "well-below": "Well below mid",
  below: "Below mid",
  near: "Near mid",
  above: "Above mid",
};

/**
 * Horizontal 2D SVG Offer Reality Check meter (Design-locked).
 * Navy/10 track, gold fill to % of mid. Not a 3D needle.
 */
export function OfferGauge({
  check,
  dark = false,
}: {
  check: OfferRealityCheck;
  dark?: boolean;
}) {
  const pct = Math.max(0, check.percentOfMid);
  const fillRatio = Math.min(1, pct / 100);
  const trackW = 320;
  const trackH = 12;
  const fillW = Math.max(0, trackW * fillRatio);
  const midX = trackW;
  const overMid = pct > 100;

  return (
    <div
      className={
        dark
          ? "rounded-xl border border-[#2d473a] bg-[#1f3027] p-4"
          : "rounded-xl border border-plg-borderMuted bg-plg-warmIvory/50 p-4"
      }
      role="group"
      aria-label="Offer Reality Check"
    >
      <div className="flex items-start justify-between gap-3">
        <h4
          className={`font-serif text-base font-semibold ${
            dark ? "text-white" : "text-slate-900"
          }`}
        >
          Offer Reality Check
        </h4>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            dark
              ? "bg-[#0e5c43]/40 text-[#97f5cc]"
              : "bg-plg-crimson/10 text-plg-crimson"
          }`}
        >
          {LABEL_COPY[check.label]}
        </span>
      </div>

      <p className={`mt-2 text-sm ${dark ? "text-[#cadbd2]" : "text-slate-700"}`}>
        Offer {formatCurrency(check.offer)} is{" "}
        <strong className="tabular-nums">{check.percentOfMid}%</strong> of the mid estimate (
        {formatCurrency(check.midEstimate)}).
        {check.gap > 0
          ? ` Gap to mid: ${formatCurrency(check.gap)}.`
          : check.gap < 0
            ? ` Offer exceeds mid by ${formatCurrency(Math.abs(check.gap))}.`
            : ""}
      </p>

      <div className="mt-4">
        <svg
          viewBox={`0 0 ${trackW} 28`}
          className="h-7 w-full"
          role="img"
          aria-label={`Offer is ${check.percentOfMid}% of mid estimate`}
        >
          <title>
            Offer Reality Check: {check.percentOfMid}% of mid
            {overMid ? " (above mid)" : ""}
          </title>
          <rect
            x={0}
            y={8}
            width={trackW}
            height={trackH}
            rx={6}
            fill={dark ? "#85d9b6" : "var(--brand-primary)"}
            fillOpacity={dark ? 0.15 : 0.1}
          />
          <rect
            x={0}
            y={8}
            width={fillW}
            height={trackH}
            rx={6}
            fill={dark ? "#047857" : "var(--brand-secondary)"}
            className="motion-safe:transition-[width] motion-safe:duration-500"
          />
          <line
            x1={midX - 1}
            y1={4}
            x2={midX - 1}
            y2={24}
            stroke={dark ? "#85d9b6" : "var(--brand-primary)"}
            strokeWidth={2}
            strokeOpacity={0.55}
          />
        </svg>
        <div
          className={`mt-1 flex justify-between text-[10px] font-medium uppercase tracking-wide ${
            dark ? "text-[#cadbd2]/60" : "text-slate-400"
          }`}
        >
          <span>0%</span>
          <span>Mid (100%)</span>
        </div>
        {overMid ? (
          <p
            className={`mt-1 text-xs font-medium ${
              dark ? "text-[#97f5cc]" : "text-[var(--brand-primary)]"
            }`}
          >
            Offer exceeds mid — meter capped at 100% track.
          </p>
        ) : null}
      </div>

      <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-[#cadbd2]/90" : "text-slate-600"}`}>
        {check.summary}
      </p>
    </div>
  );
}
