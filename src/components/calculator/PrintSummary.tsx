"use client";

import type { OfferRealityCheck, SettlementRange } from "@/lib/types";
import { formatCurrency } from "@/lib/calculator";
import { djOfferSummary } from "@/lib/disclaimers";

export function PrintSummary({
  result,
  offerCheck,
  firmName,
  usState,
  compact,
  disclaimer,
}: {
  result: SettlementRange;
  offerCheck: OfferRealityCheck | null;
  firmName: string;
  usState: string;
  compact?: boolean;
  /** Optional qualifier printed with the summary (djlaw passes one). */
  disclaimer?: string;
}) {
  function handlePrint() {
    window.print();
  }

  return (
    <div className={compact ? "" : "space-y-3"}>
      <button
        type="button"
        onClick={handlePrint}
        className={
          compact
            ? "flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold tracking-wide text-slate-800 transition hover:bg-slate-100 print:hidden"
            : "inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-plg-crimson/30 print:hidden"
        }
      >
        Print / Save PDF
      </button>

      {/* Not a <header> — global print CSS hides site headers; firm name must remain. */}
      <div className="hidden print:block print:space-y-4 print-summary-sheet" id="print-summary">
        <div className="print-summary-brand">
          <h1 className="text-xl font-bold text-slate-900 print-ink">{firmName}</h1>
          <p className="text-sm text-slate-700 print-ink-muted">
            {disclaimer
              ? "Settlement estimate summary"
              : "Educational settlement estimate summary — not legal advice"}
          </p>
          <p className="text-xs text-slate-600 print-ink-muted">
            Generated locally in your browser · State note: {usState} · Formula:{" "}
            {result.formulaMode}
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-3 text-center">
          <div>
            <dt className="text-xs uppercase text-slate-600 print-ink-muted">Pre-fault Low</dt>
            <dd className="text-lg font-bold text-slate-900 print-ink">{formatCurrency(result.low)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-600 print-ink-muted">Pre-fault Mid</dt>
            <dd className="text-lg font-bold text-slate-900 print-ink">{formatCurrency(result.mid)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-600 print-ink-muted">Pre-fault High</dt>
            <dd className="text-lg font-bold text-slate-900 print-ink">{formatCurrency(result.high)}</dd>
          </div>
        </dl>
        <dl className="grid grid-cols-3 gap-3 text-center">
          <div>
            <dt className="text-xs uppercase text-slate-600 print-ink-muted">Recoverable Low</dt>
            <dd className="text-lg font-bold text-slate-900 print-ink">
              {formatCurrency(result.recoverableLow)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-600 print-ink-muted">Recoverable Mid</dt>
            <dd className="text-lg font-bold text-slate-900 print-ink">
              {formatCurrency(result.recoverableMid)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-slate-600 print-ink-muted">Recoverable High</dt>
            <dd className="text-lg font-bold text-slate-900 print-ink">
              {formatCurrency(result.recoverableHigh)}
            </dd>
          </div>
        </dl>
        {result.cappedMid != null ? (
          <p className="text-sm text-slate-900 print-ink">
            Per-person policy capped mid: {formatCurrency(result.cappedMid)}
            {result.policyLimitsMayBind ? " — policy limits may bind" : ""}
          </p>
        ) : null}
        <p className="text-sm text-slate-900 print-ink">
          Economic base {formatCurrency(result.economicBase)} · Multipliers{" "}
          {result.multiplierLow}× / {result.multiplierMid}× / {result.multiplierHigh}×
          {result.faultPercentApplied > 0
            ? ` · Plaintiff fault ${result.faultPercentApplied}%`
            : ""}
          {result.recoveryBarred ? " · Recovery may be barred" : ""}
        </p>
        {offerCheck ? (
          <p className="text-sm text-slate-900 print-ink">
            Offer Reality Check: {formatCurrency(offerCheck.offer)} ={" "}
            {offerCheck.percentOfMid}% of post-fault mid (
            {formatCurrency(offerCheck.midEstimate)}). {disclaimer
              ? djOfferSummary(offerCheck)
              : offerCheck.summary}
          </p>
        ) : null}
        <p className="text-xs text-slate-700 print-ink-muted">{result.comparativeFaultNote}</p>
        {disclaimer ? (
          <p className="border-t border-slate-400 pt-2 text-xs text-slate-800 print-ink">
            {disclaimer}
          </p>
        ) : null}
      </div>
    </div>
  );
}
