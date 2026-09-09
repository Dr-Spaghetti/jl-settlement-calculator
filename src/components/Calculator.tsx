"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculateSettlement,
  evaluateOffer,
  formatCurrency,
  SEVERITY_LABELS,
  CARE_LABELS,
  LIABILITY_LABELS,
  TREATMENT_GAP_LABELS,
  PERMANENCY_LABELS,
  FORMULA_MODE_COPY,
} from "@/lib/calculator";
import { US_STATES } from "@/lib/states";
import type {
  CareType,
  ClientConfig,
  FormulaMode,
  LiabilityClarity,
  Permanency,
  Severity,
  TreatmentGap,
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
  optional,
}: {
  id: string;
  label: string;
  help?: string;
  value: number | "";
  onChange: (n: number | "") => void;
  min?: number;
  error?: string;
  optional?: boolean;
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
          placeholder={optional ? "Optional" : undefined}
          value={value === "" ? "" : Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = e.target.value;
            if (optional && raw.trim() === "") {
              onChange("");
              return;
            }
            onChange(Math.max(min, Number(raw) || 0));
          }}
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
  { id: 3, title: "Offer & limits", short: "Offer" },
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
  const [plaintiffFaultPercent, setPlaintiffFaultPercent] = useState(0);
  const [treatmentGap, setTreatmentGap] = useState<TreatmentGap>("none");
  const [permanency, setPermanency] = useState<Permanency>("none");
  const [formulaMode, setFormulaMode] = useState<FormulaMode>("demand");
  const [policyLimitPerPerson, setPolicyLimitPerPerson] = useState<number | "">(
    ""
  );
  const [policyLimitPerAccident, setPolicyLimitPerAccident] = useState<
    number | ""
  >("");
  const [offerReceived, setOfferReceived] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [midPop, setMidPop] = useState(false);

  const result = useMemo(
    () =>
      calculateSettlement(
        {
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
          plaintiffFaultPercent,
          treatmentGap,
          permanency,
          formulaMode,
          policyLimitPerPerson:
            policyLimitPerPerson === "" ? null : policyLimitPerPerson,
          policyLimitPerAccident:
            policyLimitPerAccident === "" ? null : policyLimitPerAccident,
        },
        client.multipliers
      ),
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
      plaintiffFaultPercent,
      treatmentGap,
      permanency,
      formulaMode,
      policyLimitPerPerson,
      policyLimitPerAccident,
      client.multipliers,
    ]
  );

  const offerNum = offerReceived.trim() === "" ? null : Number(offerReceived);
  const offerValid =
    offerNum === null || (Number.isFinite(offerNum) && offerNum >= 0);
  const offerCheck =
    offerNum !== null && Number.isFinite(offerNum) && offerNum >= 0
      ? evaluateOffer(offerNum, result.recoverableMid, {
          cappedMid: result.cappedMid,
          policyLimitsMayBind: result.policyLimitsMayBind,
        })
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
  const faultError =
    touched &&
    (plaintiffFaultPercent < 0 || plaintiffFaultPercent > 100)
      ? "Enter 0–100%"
      : undefined;

  const displayMid = result.recoverableMid;

  useEffect(() => {
    if (!touched || !hasEconomic) return;
    if (prefersReducedMotion()) return;
    setMidPop(true);
    const t = window.setTimeout(() => setMidPop(false), 480);
    return () => window.clearTimeout(t);
  }, [displayMid, touched, hasEconomic]);

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

  const showPreFault =
    result.faultPercentApplied > 0 || result.recoveryBarred;

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
            Range updates live as you step through costs and injury details.
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

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
          <div className="space-y-6 rounded-2xl border border-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] bg-white p-5 shadow-soft sm:p-6">
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
                    onChange={(n) => setMedicalBillsPast(typeof n === "number" ? n : 0)}
                  />
                  <NumberField
                    id="medical-future"
                    label="Medical bills (future)"
                    help="Expected remaining care costs"
                    value={medicalBillsFuture}
                    onChange={(n) =>
                      setMedicalBillsFuture(typeof n === "number" ? n : 0)
                    }
                  />
                  <NumberField
                    id="lost-wages"
                    label="Lost wages / income"
                    value={lostWages}
                    onChange={(n) => setLostWages(typeof n === "number" ? n : 0)}
                  />
                  <NumberField
                    id="other-oop"
                    label="Other out-of-pocket"
                    help="Travel, meds, household help, etc."
                    value={otherOutOfPocket}
                    onChange={(n) =>
                      setOtherOutOfPocket(typeof n === "number" ? n : 0)
                    }
                  />
                  <NumberField
                    id="property"
                    label="Property damage"
                    help="Vehicle repair / total loss (added, not multiplied)"
                    value={propertyDamage}
                    onChange={(n) =>
                      setPropertyDamage(typeof n === "number" ? n : 0)
                    }
                  />
                </div>
                <div className="mt-5 rounded-xl border border-slate-200 bg-[var(--page-ground)]/50 p-4">
                  <p className="text-sm font-medium text-slate-800">
                    Formula style
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Choose how wages and other costs enter the multiplier math.
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {(Object.keys(FORMULA_MODE_COPY) as FormulaMode[]).map((mode) => {
                      const copy = FORMULA_MODE_COPY[mode];
                      const active = formulaMode === mode;
                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => {
                            markTouched();
                            setFormulaMode(mode);
                          }}
                          className={`rounded-lg border px-3 py-2.5 text-left text-sm motion-safe:transition ${
                            active
                              ? "border-[var(--brand-primary)] bg-white shadow-sm ring-2 ring-[var(--brand-primary)]/20"
                              : "border-slate-200 bg-white/80 hover:border-slate-300"
                          }`}
                          aria-pressed={active}
                        >
                          <span className="font-semibold text-[var(--brand-primary)]">
                            {copy.label}
                          </span>
                          <span className="mt-1 block text-xs leading-snug text-slate-500">
                            {copy.short}
                          </span>
                        </button>
                      );
                    })}
                  </div>
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
                  <div>
                    <label htmlFor="treatment-gap" className={labelClass}>
                      Treatment gap
                    </label>
                    <select
                      id="treatment-gap"
                      className={inputClass}
                      value={treatmentGap}
                      onChange={(e) =>
                        setTreatmentGap(e.target.value as TreatmentGap)
                      }
                    >
                      {(Object.keys(TREATMENT_GAP_LABELS) as TreatmentGap[]).map(
                        (k) => (
                          <option key={k} value={k}>
                            {TREATMENT_GAP_LABELS[k]}
                          </option>
                        )
                      )}
                    </select>
                    <p className={helpClass}>
                      Gaps in care can reduce multiplier support (educational).
                    </p>
                  </div>
                  <div>
                    <label htmlFor="permanency" className={labelClass}>
                      Permanency
                    </label>
                    <select
                      id="permanency"
                      className={inputClass}
                      value={permanency}
                      onChange={(e) =>
                        setPermanency(e.target.value as Permanency)
                      }
                    >
                      {(Object.keys(PERMANENCY_LABELS) as Permanency[]).map((k) => (
                        <option key={k} value={k}>
                          {PERMANENCY_LABELS[k]}
                        </option>
                      ))}
                    </select>
                    <p className={helpClass}>
                      Documented lasting impairment can support higher multipliers.
                    </p>
                  </div>
                  <div>
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
                  </div>
                  <div>
                    <label htmlFor="plaintiff-fault" className={labelClass}>
                      Your estimated fault %
                    </label>
                    <input
                      id="plaintiff-fault"
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      className={`${inputClass} ${faultError ? "border-red-400" : ""}`}
                      value={plaintiffFaultPercent}
                      onChange={(e) =>
                        setPlaintiffFaultPercent(
                          Math.max(0, Math.min(100, Number(e.target.value) || 0))
                        )
                      }
                      aria-invalid={Boolean(faultError)}
                    />
                    {faultError ? (
                      <p className={errorClass}>{faultError}</p>
                    ) : (
                      <p className={helpClass}>
                        Applied using this state&apos;s comparative-fault category
                        (reduces or bars recoverable dollars).
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>
            ) : null}

            {step === 3 ? (
              <fieldset onChange={markTouched}>
                <legend className="legend-micro">
                  Step 3 · Offer & policy limits (optional)
                </legend>
                <p className="mt-2 text-sm text-slate-600">
                  Enter an insurer offer and known BI limits to compare against the
                  post-fault mid estimate. Leave blank to skip.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
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
                      <p className={errorClass}>
                        Enter a valid offer amount (0 or more).
                      </p>
                    ) : (
                      <p className={helpClass}>
                        Compared to post-fault Mid in the Offer Reality Check.
                      </p>
                    )}
                  </div>
                  <NumberField
                    id="policy-per-person"
                    label="BI limit per person"
                    help="Caps recoverable range when set"
                    value={policyLimitPerPerson}
                    onChange={setPolicyLimitPerPerson}
                    optional
                  />
                  <NumberField
                    id="policy-per-accident"
                    label="BI limit per accident"
                    help="Shown as a note; not used to cap the estimate"
                    value={policyLimitPerAccident}
                    onChange={setPolicyLimitPerAccident}
                    optional
                  />
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

          {/* Quiet step guidance — caption weight only; fills left column without a competing card */}
          <aside
            className="rounded-xl border border-[color-mix(in_srgb,var(--brand-primary)_8%,transparent)] bg-[var(--page-ground)]/80 px-4 py-3"
            aria-label="While you estimate"
          >
            <p className="legend-micro">While you estimate</p>
            <ul className="mt-2.5 divide-y divide-slate-200/80">
              {(step === 1
                ? [
                    "Specials (medical + wages + OOP) drive the multiplier base.",
                    "Property damage is added after multipliers — not multiplied.",
                    "Demand vs settlement style only changes how wages enter the math.",
                  ]
                : step === 2
                  ? [
                      "Severity and care type set the starting multiplier band.",
                      "Your fault % reduces recoverable dollars by state rules.",
                      "Permanency and treatment gaps quietly shift the levers.",
                    ]
                  : [
                      "Offer Reality Check compares an insurer offer to Mid.",
                      "Per-person BI limits can cap what is realistically collectible.",
                      "Leave blanks if you do not know limits yet — range still updates.",
                    ]
              ).map((line) => (
                <li key={line} className="py-2 text-sm leading-snug text-slate-500 first:pt-0 last:pb-0">
                  {line}
                </li>
              ))}
            </ul>
            {step === 2 ? (
              <p className="mt-2 border-t border-slate-200/80 pt-2 text-xs tabular-nums text-slate-500">
                Entered so far: medical{" "}
                {formatCurrency(medicalBillsPast + medicalBillsFuture)} · wages{" "}
                {formatCurrency(lostWages)}
              </p>
            ) : null}
            {step === 3 && hasEconomic ? (
              <p className="mt-2 border-t border-slate-200/80 pt-2 text-xs tabular-nums text-slate-500">
                Current Mid recoverable: {formatCurrency(result.recoverableMid)}
              </p>
            ) : null}
          </aside>
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
                <span className="rounded-full bg-[var(--page-ground)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-primary)]">
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
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {showPreFault
                      ? "Recoverable after comparative fault"
                      : "Estimated range"}
                  </p>
                  <dl className="grid grid-cols-3 items-end gap-2 text-center">
                    <div className="rounded-xl bg-[var(--page-ground)] p-3">
                      <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                        Low
                      </dt>
                      <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-700 sm:text-base">
                        <CountUpCurrency value={result.recoverableLow} />
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
                        <CountUpCurrency value={result.recoverableMid} />
                      </dd>
                    </div>
                    <div className="rounded-xl bg-[var(--page-ground)] p-3">
                      <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                        High
                      </dt>
                      <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-700 sm:text-base">
                        <CountUpCurrency value={result.recoverableHigh} />
                      </dd>
                    </div>
                  </dl>

                  <div className="space-y-2.5">
                    {result.recoveryBarred ? (
                      <p className="text-xs leading-snug text-amber-900" role="status">
                        <span className="font-semibold">Recovery may be barred.</span> At{" "}
                        {result.faultPercentApplied}% plaintiff fault under {usState}
                        &apos;s rules, recoverable dollars are shown as $0.
                      </p>
                    ) : null}

                    {showPreFault ? (
                      <p className="text-xs tabular-nums leading-snug text-slate-500">
                        Pre-fault: Low {formatCurrency(result.low)} · Mid{" "}
                        {formatCurrency(result.mid)} · High {formatCurrency(result.high)}
                        {result.faultPercentApplied > 0
                          ? ` · Fault ${result.faultPercentApplied}%`
                          : ""}
                      </p>
                    ) : null}

                    {result.cappedMid != null ? (
                      <p className="text-xs tabular-nums leading-snug text-slate-500">
                        Policy-capped: Low {formatCurrency(result.cappedLow ?? 0)} · Mid{" "}
                        {formatCurrency(result.cappedMid)} · High{" "}
                        {formatCurrency(result.cappedHigh ?? 0)}
                        {result.policyLimitPerPerson != null
                          ? ` · Limit ${formatCurrency(result.policyLimitPerPerson)}`
                          : ""}
                        {result.policyLimitPerAccident != null
                          ? ` · Per-accident noted ${formatCurrency(result.policyLimitPerAccident)}`
                          : ""}
                      </p>
                    ) : null}

                    {result.policyLimitsMayBind ? (
                      <p className="text-xs leading-snug text-[var(--brand-primary)]" role="status">
                        <span className="font-semibold">Policy limits may bind.</span>{" "}
                        Post-fault Mid ({formatCurrency(result.recoverableMid)}) exceeds
                        the per-person BI limit (
                        {formatCurrency(result.policyLimitPerPerson ?? 0)}).
                      </p>
                    ) : null}
                  </div>

                  {offerCheck ? (
                    <OfferGauge check={offerCheck} />
                  ) : (
                    <p className="border-t border-dashed border-slate-200 pt-2.5 text-xs text-slate-500">
                      Enter an offer in step 3 to see the Offer Reality Check.
                    </p>
                  )}

                  <details className="rounded-xl border border-slate-200/80 bg-[var(--page-ground)]/40">
                    <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-semibold text-slate-600 marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center justify-between gap-2">
                        <span>Show math / levers</span>
                        <span className="text-slate-400" aria-hidden>
                          +
                        </span>
                      </span>
                    </summary>
                    <div className="border-t border-slate-200/80 px-2 pb-2 pt-2">
                      <BreakdownPanel result={result} usState={usState} />
                    </div>
                  </details>

                  <PrintSummary
                    result={result}
                    offerCheck={offerCheck}
                    firmName={client.firmName}
                    usState={usState}
                  />

                  <div className="flex flex-col gap-2 print:hidden sm:flex-row">
                    <a
                      href={client.ctaUrl}
                      className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
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
