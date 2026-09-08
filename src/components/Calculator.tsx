"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculateSettlement,
  evaluateOffer,
  SEVERITY_LABELS,
  CARE_LABELS,
  LIABILITY_LABELS,
} from "@/lib/calculator";
import { US_STATES } from "@/lib/states";
import type {
  CareType,
  ClientConfig,
  LiabilityClarity,
  Severity,
} from "@/lib/types";
import { BreakdownPanel } from "@/components/calculator/BreakdownPanel";
import { OfferGauge } from "@/components/calculator/OfferGauge";
import { PrintSummary } from "@/components/calculator/PrintSummary";
import { CountUpCurrency } from "@/components/calculator/CountUpCurrency";
import { SignatureMoment } from "@/components/motion/SignatureMoment";
import { prefersReducedMotion } from "@/lib/motion";

const inputClass =
  "input-touch mt-1.5 w-full rounded-lg border border-slate-300/90 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none motion-safe:transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20";
const labelClass = "block text-sm font-medium text-slate-700";
const helpClass = "mt-1 text-xs text-slate-500";
const errorClass = "mt-1 text-xs font-medium text-red-600";

type StepId = 1 | 2 | 3;

function NumberField({
  id,
  label,
  help,
  value,
  onChange,
  min = 0,
  error,
}: {
  id: string;
  label: string;
  help?: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
          $
        </span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={100}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
          className={`${inputClass} !mt-0 pl-7 ${error ? "border-red-400" : ""}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className={errorClass}>
          {error}
        </p>
      ) : help ? (
        <p className={helpClass}>{help}</p>
      ) : null}
    </div>
  );
}

const STEPS: { id: StepId; title: string; short: string }[] = [
  { id: 1, title: "Economic damages", short: "Costs" },
  { id: 2, title: "Injury & liability", short: "Injury" },
  { id: 3, title: "Offer (optional)", short: "Offer" },
];

export function Calculator({
  defaultState,
  client,
}: {
  defaultState: string;
  client: ClientConfig;
}) {
  const [step, setStep] = useState<StepId>(1);
  const [medicalBillsPast, setMedicalBillsPast] = useState(12000);
  const [medicalBillsFuture, setMedicalBillsFuture] = useState(3000);
  const [lostWages, setLostWages] = useState(4500);
  const [otherOutOfPocket, setOtherOutOfPocket] = useState(800);
  const [propertyDamage, setPropertyDamage] = useState(6500);
  const [severity, setSeverity] = useState<Severity>("moderate");
  const [treatmentMonths, setTreatmentMonths] = useState(4);
  const [careType, setCareType] = useState<CareType>("md");
  const [liabilityClarity, setLiabilityClarity] =
    useState<LiabilityClarity>("clear");
  const [usState, setUsState] = useState(defaultState || "AZ");
  const [offerReceived, setOfferReceived] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [midPop, setMidPop] = useState(false);

  const result = useMemo(
    () =>
      calculateSettlement({
        medicalBillsPast,
        medicalBillsFuture,
        lostWages,
        otherOutOfPocket,
        propertyDamage,
        severity,
        treatmentMonths,
        careType,
        liabilityClarity,
        usState,
      }),
    [
      medicalBillsPast,
      medicalBillsFuture,
      lostWages,
      otherOutOfPocket,
      propertyDamage,
      severity,
      treatmentMonths,
      careType,
      liabilityClarity,
      usState,
    ]
  );

  const offerNum = offerReceived.trim() === "" ? null : Number(offerReceived);
  const offerValid =
    offerNum === null || (Number.isFinite(offerNum) && offerNum >= 0);
  const offerCheck =
    offerNum !== null && Number.isFinite(offerNum) && offerNum >= 0
      ? evaluateOffer(offerNum, result.mid)
      : null;

  const hasEconomic =
    medicalBillsPast + medicalBillsFuture + lostWages + otherOutOfPocket > 0;
  const treatmentError =
    touched && (treatmentMonths < 0 || treatmentMonths > 120)
      ? "Enter 0–120 months"
      : undefined;
  const economicError =
    touched && !hasEconomic
      ? "Enter at least one economic damage amount to estimate a range."
      : undefined;

  useEffect(() => {
    if (!touched || !hasEconomic) return;
    if (prefersReducedMotion()) return;
    setMidPop(true);
    const t = window.setTimeout(() => setMidPop(false), 480);
    return () => window.clearTimeout(t);
  }, [result.mid, touched, hasEconomic]);

  function markTouched() {
    if (!touched) setTouched(true);
  }

  function goNext() {
    markTouched();
    if (step === 1 && !hasEconomic) return;
    if (step < 3) setStep((s) => (s + 1) as StepId);
  }

  function goBack() {
    if (step > 1) setStep((s) => (s - 1) as StepId);
  }

  function jumpToStep(id: StepId) {
    markTouched();
    setStep(id);
  }

  return (
    <section
      id="calculator"
      className="scroll-mt-20 bg-[var(--page-ground)] py-16 sm:py-20"
      aria-labelledby="calculator-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2
            id="calculator-heading"
            className="font-display text-2xl font-semibold tracking-tight text-[var(--brand-primary)] sm:text-3xl"
          >
            Estimate your settlement range
          </h2>
          <p className="mt-3 text-slate-600">
            Step through your known costs and injury details. The range updates live —
            low, mid, and high — with a transparent breakdown. No personal information is
            collected or stored.
          </p>
        </div>

        <nav className="mt-8" aria-label="Calculator steps">
          <ol className="flex flex-wrap gap-2 sm:gap-3">
            {STEPS.map((s) => {
              const active = step === s.id;
              const done = step > s.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => jumpToStep(s.id)}
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium motion-safe:transition ${
                      active
                        ? "text-white shadow-soft"
                        : done
                          ? "bg-white text-slate-800 ring-1 ring-slate-200"
                          : "bg-white/70 text-slate-500 ring-1 ring-slate-200"
                    }`}
                    style={
                      active ? { backgroundColor: "var(--brand-primary)" } : undefined
                    }
                    aria-current={active ? "step" : undefined}
                  >
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                        active ? "bg-white/20" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {s.id}
                    </span>
                    <span className="hidden sm:inline">{s.title}</span>
                    <span className="sm:hidden">{s.short}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <div className="space-y-6 rounded-2xl border border-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] bg-white p-5 shadow-soft sm:p-6 lg:col-span-3">
            {step === 1 ? (
              <fieldset onChange={markTouched}>
                <legend className="legend-micro">Step 1 · Economic damages</legend>
                {economicError ? (
                  <p className={`mt-2 ${errorClass}`}>{economicError}</p>
                ) : null}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <NumberField
                    id="medical-past"
                    label="Medical bills (past)"
                    help="ER, imaging, PT, specialists to date"
                    value={medicalBillsPast}
                    onChange={setMedicalBillsPast}
                  />
                  <NumberField
                    id="medical-future"
                    label="Medical bills (future)"
                    help="Expected remaining care costs"
                    value={medicalBillsFuture}
                    onChange={setMedicalBillsFuture}
                  />
                  <NumberField
                    id="lost-wages"
                    label="Lost wages / income"
                    value={lostWages}
                    onChange={setLostWages}
                  />
                  <NumberField
                    id="other-oop"
                    label="Other out-of-pocket"
                    help="Travel, meds, household help, etc."
                    value={otherOutOfPocket}
                    onChange={setOtherOutOfPocket}
                  />
                  <NumberField
                    id="property"
                    label="Property damage"
                    help="Vehicle repair / total loss (added, not multiplied)"
                    value={propertyDamage}
                    onChange={setPropertyDamage}
                  />
                </div>
              </fieldset>
            ) : null}

            {step === 2 ? (
              <fieldset onChange={markTouched}>
                <legend className="legend-micro">Step 2 · Injury & liability</legend>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="severity" className={labelClass}>
                      Injury severity
                    </label>
                    <select
                      id="severity"
                      className={inputClass}
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as Severity)}
                    >
                      {(Object.keys(SEVERITY_LABELS) as Severity[]).map((k) => (
                        <option key={k} value={k}>
                          {SEVERITY_LABELS[k]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="treatment-months" className={labelClass}>
                      Months of treatment
                    </label>
                    <input
                      id="treatment-months"
                      type="number"
                      min={0}
                      max={120}
                      step={1}
                      className={`${inputClass} ${treatmentError ? "border-red-400" : ""}`}
                      value={treatmentMonths}
                      onChange={(e) =>
                        setTreatmentMonths(Math.max(0, Number(e.target.value) || 0))
                      }
                      aria-invalid={Boolean(treatmentError)}
                    />
                    {treatmentError ? (
                      <p className={errorClass}>{treatmentError}</p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="care-type" className={labelClass}>
                      Primary care type
                    </label>
                    <select
                      id="care-type"
                      className={inputClass}
                      value={careType}
                      onChange={(e) => setCareType(e.target.value as CareType)}
                    >
                      {(Object.keys(CARE_LABELS) as CareType[]).map((k) => (
                        <option key={k} value={k}>
                          {CARE_LABELS[k]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="liability" className={labelClass}>
                      Liability clarity
                    </label>
                    <select
                      id="liability"
                      className={inputClass}
                      value={liabilityClarity}
                      onChange={(e) =>
                        setLiabilityClarity(e.target.value as LiabilityClarity)
                      }
                    >
                      {(Object.keys(LIABILITY_LABELS) as LiabilityClarity[]).map(
                        (k) => (
                          <option key={k} value={k}>
                            {LIABILITY_LABELS[k]}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="us-state" className={labelClass}>
                      State where crash occurred
                    </label>
                    <select
                      id="us-state"
                      className={inputClass}
                      value={usState}
                      onChange={(e) => setUsState(e.target.value)}
                    >
                      {US_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <p className={helpClass}>
                      Used for an educational comparative-fault note only.
                    </p>
                  </div>
                </div>
              </fieldset>
            ) : null}

            {step === 3 ? (
              <fieldset onChange={markTouched}>
                <legend className="legend-micro">
                  Step 3 · Offer Reality Check (optional)
                </legend>
                <p className="mt-2 text-sm text-slate-600">
                  If an insurer already made an offer, enter it to compare against the mid
                  estimate. Leave blank to skip.
                </p>
                <div className="mt-4 max-w-sm">
                  <label htmlFor="offer" className={labelClass}>
                    Offer received
                  </label>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                      $
                    </span>
                    <input
                      id="offer"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={100}
                      placeholder="Leave blank if none"
                      className={`${inputClass} !mt-0 pl-7 ${!offerValid ? "border-red-400" : ""}`}
                      value={offerReceived}
                      onChange={(e) => setOfferReceived(e.target.value)}
                      aria-invalid={!offerValid}
                    />
                  </div>
                  {!offerValid ? (
                    <p className={errorClass}>Enter a valid offer amount (0 or more).</p>
                  ) : (
                    <p className={helpClass}>
                      Powers the Offer Reality Check meter in your live results.
                    </p>
                  )}
                </div>
              </fieldset>
            ) : null}

            <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Back
                </button>
              ) : null}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                >
                  Continue
                </button>
              ) : (
                <a
                  href="#results"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:opacity-95 lg:hidden"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                  onClick={markTouched}
                >
                  View live estimate
                </a>
              )}
              <p className="text-xs text-slate-500">
                Estimate updates instantly as you type.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div
              id="results"
              className="results-gold-edge sticky top-24 scroll-mt-24 space-y-4 rounded-2xl border border-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] bg-white p-5 shadow-card sm:p-6"
              aria-live="polite"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-[var(--brand-primary)]">
                  Your live range
                </h3>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                  Live
                </span>
              </div>

              <SignatureMoment placement="result" className="min-h-0" />

              {!hasEconomic ? (
                <p className="text-sm text-slate-500">
                  Enter at least one economic damage amount to see a low / mid / high range.
                </p>
              ) : (
                <>
                  <dl className="grid grid-cols-3 items-end gap-2 text-center">
                    <div className="rounded-xl bg-[var(--page-ground)] p-3">
                      <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                        Low
                      </dt>
                      <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-700 sm:text-base">
                        <CountUpCurrency value={result.low} />
                      </dd>
                    </div>
                    <div
                      className={`relative rounded-xl bg-[var(--brand-primary)] px-2 py-4 text-white shadow-soft sm:px-3 ${
                        midPop ? "motion-safe:animate-mid-pop" : ""
                      }`}
                    >
                      <div
                        className="pointer-events-none absolute inset-x-3 top-0 h-0.5 rounded-full"
                        style={{ backgroundColor: "var(--brand-secondary)" }}
                        aria-hidden
                      />
                      <dt className="text-[10px] font-medium uppercase tracking-wide text-white/75">
                        Mid
                      </dt>
                      <dd className="mt-1 text-xl font-bold tabular-nums sm:text-2xl">
                        <CountUpCurrency value={result.mid} />
                      </dd>
                    </div>
                    <div className="rounded-xl bg-[var(--page-ground)] p-3">
                      <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                        High
                      </dt>
                      <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-700 sm:text-base">
                        <CountUpCurrency value={result.high} />
                      </dd>
                    </div>
                  </dl>

                  <BreakdownPanel result={result} />

                  <div className="rounded-xl border border-slate-200 p-4">
                    <h4 className="font-display text-sm font-semibold text-[var(--brand-primary)]">
                      Comparative fault note ({usState})
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {result.comparativeFaultNote}
                    </p>
                  </div>

                  {offerCheck ? (
                    <OfferGauge check={offerCheck} />
                  ) : (
                    <p className="rounded-xl border border-dashed border-slate-200 bg-[var(--page-ground)]/60 px-4 py-3 text-sm text-slate-500">
                      Enter an offer in step 3 to see the Offer Reality Check meter.
                    </p>
                  )}

                  <PrintSummary
                    result={result}
                    offerCheck={offerCheck}
                    firmName={client.firmName}
                    usState={usState}
                  />

                  <div className="flex flex-col gap-2 print:hidden sm:flex-row">
                    <a
                      href={client.ctaUrl}
                      className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-[var(--brand-primary)]"
                      style={{ backgroundColor: "var(--brand-secondary)" }}
                    >
                      {client.ctaText}
                    </a>
                    <a
                      href={`tel:${client.phone.replace(/[^\d+]/g, "")}`}
                      className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[var(--brand-primary)]"
                    >
                      Call {client.phone}
                    </a>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-500">
                    Educational estimate only — not a guarantee, valuation opinion, or
                    legal advice. Policy limits, venue, prior injuries, and proof quality
                    can move outcomes substantially.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
