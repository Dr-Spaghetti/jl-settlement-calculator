"use client";

import type { SettlementRange } from "@/lib/types";
import {
  formatCurrency,
  formatSignedMultiplier,
  FORMULA_MODE_COPY,
} from "@/lib/calculator";

export function BreakdownPanel({
  result,
  usState,
  dark = false,
}: {
  result: SettlementRange;
  usState?: string;
  dark?: boolean;
}) {
  const formula = FORMULA_MODE_COPY[result.formulaMode];
  const muted = dark ? "text-[#cadbd2]/80" : "text-slate-500";
  const strong = dark ? "text-white" : "text-slate-800";
  const label = dark ? "text-[#97f5cc]" : "text-slate-500";
  const border = dark ? "border-[#294234]" : "border-slate-200/80";

  return (
    <div
      className={
        dark
          ? "rounded-xl border border-[#23382c] bg-[#14221b] p-4 text-sm text-[#cadbd2]"
          : "rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600"
      }
    >
      <h4 className={`text-xs font-semibold uppercase tracking-wide ${label}`}>
        Breakdown
      </h4>

      <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
        <span className={`font-semibold ${strong}`}>{formula.label}</span>
        {" — "}
        {formula.blurb}
      </p>

      <dl className="mt-3 space-y-1.5 font-mono text-[13px]">
        <div className="flex justify-between gap-3">
          <dt>Medical (past + future)</dt>
          <dd className={`font-medium tabular-nums ${strong}`}>
            {formatCurrency(result.medicalTotal)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Lost wages</dt>
          <dd className={`font-medium tabular-nums ${strong}`}>
            {formatCurrency(result.lostWages)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Other out-of-pocket</dt>
          <dd className={`font-medium tabular-nums ${strong}`}>
            {formatCurrency(result.otherOutOfPocket)}
          </dd>
        </div>
        <div className={`flex justify-between gap-3 border-t pt-1.5 ${border}`}>
          <dt className={`font-medium ${dark ? "text-[#97f5cc]" : "text-slate-800"}`}>
            {result.formulaMode === "adjuster"
              ? "Multiplied base (medical)"
              : "Specials (multiplied)"}
          </dt>
          <dd className={`font-semibold tabular-nums ${dark ? "text-[#97f5cc]" : "text-slate-900"}`}>
            {formatCurrency(result.multipliedBase)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Property damage (added after)</dt>
          <dd className={`font-medium tabular-nums ${strong}`}>
            {formatCurrency(result.propertyDamage)}
          </dd>
        </div>
        <div className={`flex justify-between gap-3 border-t pt-1.5 ${border}`}>
          <dt className={`font-medium ${strong}`}>Economic base (total)</dt>
          <dd className={`font-medium tabular-nums ${strong}`}>
            {formatCurrency(result.economicBase)}
          </dd>
        </div>
      </dl>

      <div className={`mt-4 border-t pt-3 ${border}`}>
        <p className={`text-xs font-semibold uppercase tracking-wide ${label}`}>
          Multiplier levers
        </p>
        <ul className="mt-2 space-y-1.5">
          {result.levers.map((lever) => (
            <li key={lever.id} className="flex items-start justify-between gap-3">
              <span>
                <span className={`font-medium ${strong}`}>{lever.label}</span>
                <span className={`block text-xs ${muted}`}>{lever.detail}</span>
              </span>
              <span className={`shrink-0 tabular-nums ${strong}`}>
                {lever.id === "severity"
                  ? `${result.baseMultiplier.low}–${result.baseMultiplier.high}× base`
                  : formatSignedMultiplier(lever.adjustment)}
              </span>
            </li>
          ))}
        </ul>
        <p className={`mt-2 text-xs ${muted}`}>
          Net lever adj. {formatSignedMultiplier(result.totalAdjustment)} → multipliers{" "}
          {result.multiplierLow}× / {result.multiplierMid}× / {result.multiplierHigh}×
        </p>
      </div>

      <p className={`mt-3 text-xs leading-relaxed ${muted}`}>
        {result.formulaMode === "adjuster"
          ? "Adjuster-style: only medical bills are multiplied; wages, other costs, and property are added after."
          : "Demand-style: pain-and-suffering multipliers apply to medical, wages, and other out-of-pocket. Property damage is added after multiplication."}
      </p>

      {result.comparativeFaultNote ? (
        <p className={`mt-3 border-t pt-3 text-xs leading-relaxed ${border} ${muted}`}>
          <span className={`font-semibold ${strong}`}>
            Comparative fault{usState ? ` (${usState})` : ""}:
          </span>{" "}
          {result.comparativeFaultNote}
        </p>
      ) : null}
    </div>
  );
}
