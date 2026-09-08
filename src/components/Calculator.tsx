"use client";

import { useMemo, useState } from "react";
import {
  calculateSettlement,
  evaluateOffer,
  formatCurrency,
  SEVERITY_LABELS,
  CARE_LABELS,
  LIABILITY_LABELS,
} from "@/lib/calculator";
import { US_STATES } from "@/lib/states";
import type {
  CareType,
  LiabilityClarity,
  Severity,
} from "@/lib/types";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20";
const labelClass = "block text-sm font-medium text-slate-700";
const helpClass = "mt-1 text-xs text-slate-500";

function NumberField({
  id,
  label,
  help,
  value,
  onChange,
  min = 0,
}: {
  id: string;
  label: string;
  help?: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
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
          className={`${inputClass} !mt-0 pl-7`}
        />
      </div>
      {help ? <p className={helpClass}>{help}</p> : null}
    </div>
  );
}

export function Calculator({ defaultState }: { defaultState: string }) {
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
  const [showResults, setShowResults] = useState(false);

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
  const offerCheck =
    offerNum !== null && Number.isFinite(offerNum) && offerNum >= 0
      ? evaluateOffer(offerNum, result.mid)
      : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowResults(true);
    requestAnimationFrame(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <section
      id="calculator"
      className="scroll-mt-20 bg-slate-50 py-16 sm:py-20"
      aria-labelledby="calculator-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2
            id="calculator-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Estimate your settlement range
          </h2>
          <p className="mt-3 text-slate-600">
            Enter your known costs and injury details. We&apos;ll apply an educational
            multiplier method and show a low, mid, and high range. No personal information
            is collected or stored.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-8 lg:grid-cols-5"
          noValidate
        >
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6 lg:col-span-3">
            <fieldset>
              <legend className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Economic damages
              </legend>
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

            <fieldset>
              <legend className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Injury & liability factors
              </legend>
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
                    className={inputClass}
                    value={treatmentMonths}
                    onChange={(e) =>
                      setTreatmentMonths(Math.max(0, Number(e.target.value) || 0))
                    }
                  />
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
                    {(Object.keys(LIABILITY_LABELS) as LiabilityClarity[]).map((k) => (
                      <option key={k} value={k}>
                        {LIABILITY_LABELS[k]}
                      </option>
                    ))}
                  </select>
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
                  <p className={helpClass}>
                    Used for an educational comparative-fault note only.
                  </p>
                </div>
                <div>
                  <label htmlFor="offer" className={labelClass}>
                    Offer received (optional)
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
                      className={`${inputClass} !mt-0 pl-7`}
                      value={offerReceived}
                      onChange={(e) => setOfferReceived(e.target.value)}
                    />
                  </div>
                  <p className={helpClass}>
                    Powers the Offer Reality Check below your range.
                  </p>
                </div>
              </div>
            </fieldset>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:w-auto"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              Calculate estimate
            </button>
          </div>

          <div className="lg:col-span-2">
            <div
              id="results"
              className="sticky top-24 scroll-mt-24 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"
              aria-live="polite"
            >
              <h3 className="text-lg font-semibold text-slate-900">Your range</h3>
              {!showResults ? (
                <p className="text-sm text-slate-500">
                  Fill in the form and tap <strong>Calculate estimate</strong> to see
                  low / mid / high results here.
                </p>
              ) : (
                <>
                  <dl className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Low
                      </dt>
                      <dd className="mt-1 text-base font-bold text-slate-800 sm:text-lg">
                        {formatCurrency(result.low)}
                      </dd>
                    </div>
                    <div
                      className="rounded-xl p-3 text-white"
                      style={{ backgroundColor: "var(--brand-primary)" }}
                    >
                      <dt className="text-xs font-medium uppercase tracking-wide text-white/80">
                        Mid
                      </dt>
                      <dd className="mt-1 text-base font-bold sm:text-lg">
                        {formatCurrency(result.mid)}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        High
                      </dt>
                      <dd className="mt-1 text-base font-bold text-slate-800 sm:text-lg">
                        {formatCurrency(result.high)}
                      </dd>
                    </div>
                  </dl>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-800">Economic base:</span>{" "}
                      {formatCurrency(result.economicBase)}
                    </p>
                    <p className="mt-1">
                      <span className="font-medium text-slate-800">Multipliers:</span>{" "}
                      {result.multiplierLow}× / {result.multiplierMid}× /{" "}
                      {result.multiplierHigh}×
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      Pain-and-suffering style multipliers apply to medical, wages, and
                      other out-of-pocket costs. Property damage is added after
                      multiplication.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <h4 className="text-sm font-semibold text-slate-900">
                      Comparative fault note ({usState})
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {result.comparativeFaultNote}
                    </p>
                  </div>

                  {offerCheck ? (
                    <div
                      className="rounded-xl border p-4"
                      style={{
                        borderColor: "var(--brand-secondary)",
                        backgroundColor: "color-mix(in srgb, var(--brand-secondary) 12%, white)",
                      }}
                    >
                      <h4 className="text-sm font-semibold text-slate-900">
                        Offer Reality Check
                      </h4>
                      <p className="mt-2 text-sm text-slate-700">
                        Offer {formatCurrency(offerCheck.offer)} is{" "}
                        <strong>{offerCheck.percentOfMid}%</strong> of the mid estimate (
                        {formatCurrency(offerCheck.midEstimate)}).
                        {offerCheck.gap > 0
                          ? ` Gap to mid: ${formatCurrency(offerCheck.gap)}.`
                          : offerCheck.gap < 0
                            ? ` Offer exceeds mid by ${formatCurrency(Math.abs(offerCheck.gap))}.`
                            : ""}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {offerCheck.summary}
                      </p>
                    </div>
                  ) : null}

                  <p className="text-xs leading-relaxed text-slate-500">
                    Educational estimate only — not a guarantee, valuation opinion, or
                    legal advice. Policy limits, venue, prior injuries, and proof quality
                    can move outcomes substantially.
                  </p>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
