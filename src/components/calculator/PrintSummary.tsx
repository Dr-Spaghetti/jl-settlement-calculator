"use client";

import type { OfferRealityCheck, SettlementRange } from "@/lib/types";
import { formatCurrency } from "@/lib/calculator";

export function PrintSummary({
  result,
  offerCheck,
  firmName,
  usState,
}: {
  result: SettlementRange;
  offerCheck: OfferRealityCheck | null;
  firmName: string;
  usState: string;
}) {
  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/30 print:hidden"
      >
        Print / save summary
      </button>

      <div className="hidden print:block print:space-y-4" id="print-summary">
        <header>
          <h1 className="text-xl font-bold">{firmName}</h1>
          <p className="text-sm text-slate-600">
            Educational settlement estimate summary — not legal advice
          </p>
          <p className="text-xs text-slate-500">
            Generated locally in your browser · State note: {usState} · Formula:{" "}
            {result.formulaMode}
          </p>
        </header>
        <dl className="grid grid-cols-3 gap-3 text-center">
          <div>
            <dt className="text-xs uppercase text-slate-500">Pre-fault Low</dt>
            <dd className="text-lg font-bold">{formatCurrency(result.low)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Pre-fault Mid</dt>
            <dd className="text-lg font-bold">{formatCurrency(result.mid)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Pre-fault High</dt>
            <dd className="text-lg font-bold">{formatCurrency(result.high)}</dd>
          </div>
        </dl>
        <dl className="grid grid-cols-3 gap-3 text-center">
          <div>
            <dt className="text-xs uppercase text-slate-500">Recoverable Low</dt>
            <dd className="text-lg font-bold">
              {formatCurrency(result.recoverableLow)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Recoverable Mid</dt>
            <dd className="text-lg font-bold">
              {formatCurrency(result.recoverableMid)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-500">Recoverable High</dt>
            <dd className="text-lg font-bold">
              {formatCurrency(result.recoverableHigh)}
            </dd>
          </div>
        </dl>
        {result.cappedMid != null ? (
          <p className="text-sm">
            Per-person policy capped mid: {formatCurrency(result.cappedMid)}
            {result.policyLimitsMayBind ? " — policy limits may bind" : ""}
          </p>
        ) : null}
        <p className="text-sm">
          Economic base {formatCurrency(result.economicBase)} · Multipliers{" "}
          {result.multiplierLow}× / {result.multiplierMid}× / {result.multiplierHigh}×
          {result.faultPercentApplied > 0
            ? ` · Plaintiff fault ${result.faultPercentApplied}%`
            : ""}
          {result.recoveryBarred ? " · Recovery may be barred" : ""}
        </p>
        {offerCheck ? (
          <p className="text-sm">
            Offer Reality Check: {formatCurrency(offerCheck.offer)} ={" "}
            {offerCheck.percentOfMid}% of post-fault mid (
            {formatCurrency(offerCheck.midEstimate)}). {offerCheck.summary}
          </p>
        ) : null}
        <p className="text-xs text-slate-500">{result.comparativeFaultNote}</p>
      </div>
    </div>
  );
}
