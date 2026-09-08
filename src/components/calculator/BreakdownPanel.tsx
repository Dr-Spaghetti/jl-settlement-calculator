"use client";

import type { SettlementRange } from "@/lib/types";
import { formatCurrency, formatSignedMultiplier } from "@/lib/calculator";

export function BreakdownPanel({ result }: { result: SettlementRange }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Breakdown
      </h4>

      <dl className="mt-3 space-y-1.5">
        <div className="flex justify-between gap-3">
          <dt>Medical (past + future)</dt>
          <dd className="font-medium text-slate-800 tabular-nums">
            {formatCurrency(result.medicalTotal)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Lost wages</dt>
          <dd className="font-medium text-slate-800 tabular-nums">
            {formatCurrency(result.lostWages)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Other out-of-pocket</dt>
          <dd className="font-medium text-slate-800 tabular-nums">
            {formatCurrency(result.otherOutOfPocket)}
          </dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-slate-200/80 pt-1.5">
          <dt className="font-medium text-slate-800">Specials (multiplied)</dt>
          <dd className="font-semibold text-slate-900 tabular-nums">
            {formatCurrency(result.specialsForPain)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Property damage (added after)</dt>
          <dd className="font-medium text-slate-800 tabular-nums">
            {formatCurrency(result.propertyDamage)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Economic base (total)</dt>
          <dd className="font-medium text-slate-800 tabular-nums">
            {formatCurrency(result.economicBase)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-slate-200/80 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Multiplier levers
        </p>
        <ul className="mt-2 space-y-1.5">
          {result.levers.map((lever) => (
            <li key={lever.id} className="flex items-start justify-between gap-3">
              <span>
                <span className="font-medium text-slate-800">{lever.label}</span>
                <span className="block text-xs text-slate-500">{lever.detail}</span>
              </span>
              <span className="shrink-0 tabular-nums text-slate-700">
                {lever.id === "severity"
                  ? `${result.baseMultiplier.low}–${result.baseMultiplier.high}× base`
                  : formatSignedMultiplier(lever.adjustment)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-slate-500">
          Net lever adj. {formatSignedMultiplier(result.totalAdjustment)} → multipliers{" "}
          {result.multiplierLow}× / {result.multiplierMid}× / {result.multiplierHigh}×
        </p>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        Pain-and-suffering style multipliers apply to medical, wages, and other out-of-pocket
        costs. Property damage is added after multiplication.
      </p>
    </div>
  );
}
