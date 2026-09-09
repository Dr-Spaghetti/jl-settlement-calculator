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
import {
  BoltIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhoneIcon,
  RotateCcwIcon,
} from "@/components/icons";

const inputClass =
  "input-touch mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-plg-crimson focus:ring-1 focus:ring-plg-crimson";
const labelClass =
  "block text-xs font-bold uppercase tracking-wider text-slate-700";
const helpClass = "mt-1 text-[11px] text-slate-500";
const errorClass = "mt-1 text-xs font-medium text-red-600";

type StepId = 1 | 2 | 3;

type PresetId = "minor" | "moderate" | "severe";

const PRESETS: Record<
  PresetId,
  {
    label: string;
    medicalBillsPast: number;
    medicalBillsFuture: number;
    lostWages: number;
    otherOutOfPocket: number;
    propertyDamage: number;
    severity: Severity;
    treatmentMonths: number;
    careType: CareType;
    permanency: Permanency;
  }
> = {
  minor: {
    label: "Minor Whiplash ($16.5k bills)",
    medicalBillsPast: 12000,
    medicalBillsFuture: 1500,
    lostWages: 2000,
    otherOutOfPocket: 500,
    propertyDamage: 4500,
    severity: "minor",
    treatmentMonths: 2,
    careType: "chiro",
    permanency: "none",
  },
  moderate: {
    label: "Moderate Fracture / PT ($48k bills)",
    medicalBillsPast: 35000,
    medicalBillsFuture: 8000,
    lostWages: 6500,
    otherOutOfPocket: 1200,
    propertyDamage: 8500,
    severity: "moderate",
    treatmentMonths: 6,
    careType: "md",
    permanency: "possible",
  },
  severe: {
    label: "Severe Surgery / Disc ($145k bills)",
    medicalBillsPast: 110000,
    medicalBillsFuture: 25000,
    lostWages: 18000,
    otherOutOfPocket: 3500,
    propertyDamage: 12000,
    severity: "severe",
    treatmentMonths: 12,
    careType: "surgery",
    permanency: "rated",
  },
};

function NumberField({
  id,
  label,
  help,
  value,
  onChange,
  min = 0,
  error,
  optional,
  required,
}: {
  id: string;
  label: string;
  help?: string;
  value: number | "";
  onChange: (n: number | "") => void;
  min?: number;
  error?: string;
  optional?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}{" "}
        {required ? <span className="required-asterisk text-plg-crimson">*</span> : null}
      </label>
      <div className="relative mt-1.5 rounded-lg shadow-sm">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-slate-400">
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
          className={`${inputClass} !mt-0 pl-8 ${error ? "border-red-400" : ""}`}
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
  { id: 1, title: "Economic Losses", short: "Economics" },
  { id: 2, title: "Injury & Fault", short: "Injury" },
  { id: 3, title: "Policy Limits", short: "Policy" },
];

export function Calculator({
  defaultState,
  client,
}: {
  defaultState: string;
  client: ClientConfig;
}) {
  const isDj = client.id === "djougourian-law";
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
  const [usState, setUsState] = useState(defaultState || "WA");
  const [plaintiffFaultPercent, setPlaintiffFaultPercent] = useState(0);
  const [treatmentGap, setTreatmentGap] = useState<TreatmentGap>("none");
  const [permanency, setPermanency] = useState<Permanency>("none");
  const [formulaMode, setFormulaMode] = useState<FormulaMode>("demand");
  const [policyLimitPerPerson, setPolicyLimitPerPerson] = useState<number | "">(
    100000
  );
  const [policyLimitPerAccident, setPolicyLimitPerAccident] = useState<
    number | ""
  >("");
  const [offerReceived, setOfferReceived] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [midPop, setMidPop] = useState(false);
  const [activePreset, setActivePreset] = useState<PresetId | null>(null);

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
    touched && (plaintiffFaultPercent < 0 || plaintiffFaultPercent > 100)
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

  function loadPreset(id: PresetId) {
    const p = PRESETS[id];
    setActivePreset(id);
    setMedicalBillsPast(p.medicalBillsPast);
    setMedicalBillsFuture(p.medicalBillsFuture);
    setLostWages(p.lostWages);
    setOtherOutOfPocket(p.otherOutOfPocket);
    setPropertyDamage(p.propertyDamage);
    setSeverity(p.severity);
    setTreatmentMonths(p.treatmentMonths);
    setCareType(p.careType);
    setPermanency(p.permanency);
    setTouched(true);
  }

  function resetCalculator() {
    setActivePreset(null);
    setMedicalBillsPast(12000);
    setMedicalBillsFuture(3000);
    setLostWages(4500);
    setOtherOutOfPocket(800);
    setPropertyDamage(6500);
    setSeverity("moderate");
    setTreatmentMonths(4);
    setCareType("md");
    setLiabilityClarity("clear");
    setUsState(defaultState || "WA");
    setPlaintiffFaultPercent(0);
    setTreatmentGap("none");
    setPermanency("none");
    setFormulaMode("demand");
    setPolicyLimitPerPerson(100000);
    setPolicyLimitPerAccident("");
    setOfferReceived("");
    setStep(1);
    setTouched(false);
  }

  const showPreFault = result.faultPercentApplied > 0 || result.recoveryBarred;

  const liabilityButtons: { id: LiabilityClarity; label: string }[] = [
    { id: "clear", label: "Clear Liability (Rear-ended, red light)" },
    { id: "mixed", label: "Disputed / Contested" },
    { id: "disputed", label: "Multi-Vehicle / Complex" },
  ];

  return (
    <section
      id="calculator"
      className={`scroll-mt-28 py-12 pb-32 sm:py-14 lg:pb-14 ${isDj ? "bg-[#eef2ef]" : "bg-plg-cream"}`}
      aria-labelledby="calculator-heading"
    >
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${isDj ? "max-w-[1200px]" : "max-w-7xl"}`}>
        <h2 id="calculator-heading" className="sr-only">
          Settlement calculator
        </h2>

        {/* Severity presets */}
        <div
          className={`mb-8 rounded-xl border p-4 shadow-sm sm:p-5 ${
            isDj
              ? "border-[#cdd6d0] bg-[#e6ece8]"
              : "border-plg-borderMuted bg-white"
          }`}
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span
                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                  isDj ? "text-[#047857]" : "text-plg-crimson"
                }`}
              >
                <BoltIcon size={14} className="inline-block" /> Quick{" "}
                {usState === "WA"
                  ? "Washington "
                  : usState === "CA"
                    ? "California "
                    : ""}
                Accident Presets
              </span>
              <p className="mt-0.5 text-xs text-slate-500">
                Load typical sample figures to see how multiplier dynamics change by
                case severity:
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PRESETS) as PresetId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => loadPreset(id)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    activePreset === id
                      ? isDj
                        ? "border-[#062e22] bg-[#062e22] text-white shadow-sm"
                        : "border-plg-crimson bg-plg-warmIvory text-plg-crimson"
                      : isDj
                        ? "border-[#c3cdc6] bg-[#dbe3de] text-[#062e22] hover:bg-[#cfd9d3]"
                        : "border-slate-200 text-slate-700 hover:border-plg-crimson hover:bg-plg-warmIvory"
                  }`}
                >
                  {PRESETS[id].label}
                </button>
              ))}
              <button
                type="button"
                onClick={resetCalculator}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  isDj
                    ? "text-red-600 hover:bg-red-50"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                title="Reset fields"
              >
                <RotateCcwIcon size={12} className="inline-block" /> Reset
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-7">
            <div
              className={`flex items-center justify-between rounded-xl border p-2 shadow-sm ${
                isDj
                  ? "border-[#cdd6d0] bg-[#e2e8e4]"
                  : "border-plg-borderMuted bg-white"
              }`}
              role="tablist"
              aria-label="Calculator steps"
            >
              {STEPS.map((s) => {
                const active = step === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => jumpToStep(s.id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-2 py-3 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                      active
                        ? isDj
                          ? "bg-[#062e22] text-white shadow-sm"
                          : "bg-plg-navy text-white shadow-sm"
                        : isDj
                          ? "font-medium text-[#404944] hover:text-[#111c16]"
                          : "font-medium text-slate-600 hover:bg-plg-warmIvory"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                        active
                          ? isDj
                            ? "bg-[#0e5c43] text-white"
                            : "bg-white/20 text-white"
                          : isDj
                            ? "bg-[#d3dbd5] text-[#111c16]"
                            : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {s.id}
                    </span>
                    <span className="hidden sm:inline">{s.title}</span>
                    <span className="sm:hidden">{s.short}</span>
                  </button>
                );
              })}
            </div>

            <div
              className={`overflow-hidden rounded-xl border shadow-plg-card sm:rounded-2xl ${
                isDj
                  ? "border-[#c8d2cc] bg-[#e6ece8]"
                  : "border-plg-borderMuted bg-white"
              }`}
            >
            <div className={isDj ? "p-0" : "p-6 sm:p-8"}>
              {step === 1 ? (
                <fieldset className="space-y-6" onChange={markTouched}>
                  <div
                    className={
                      isDj
                        ? "border-b border-[#1c5d48] bg-gradient-to-r from-[#0b3d2e] to-[#124d3b] px-6 py-4 text-white sm:px-8"
                        : "border-b border-slate-100 pb-4"
                    }
                  >
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isDj ? "text-[#85d9b6]" : "text-plg-crimson"
                      }`}
                    >
                      Step 1 of 3
                    </span>
                    <h3
                      className={`font-serif mt-1 text-2xl font-bold ${
                        isDj ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Direct Economic Damages (Special Damages)
                    </h3>
                    <p className={`mt-1 text-xs ${isDj ? "text-[#d5e7df]" : "text-slate-500"}`}>
                      Enter tangible, out-of-pocket financial expenses from the collision.
                    </p>
                    {economicError ? (
                      <p className={`mt-2 ${errorClass}`}>{economicError}</p>
                    ) : null}
                  </div>
                  <div className={isDj ? "space-y-6 px-6 pb-6 sm:px-8" : "contents"}>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <NumberField
                      id="medical-past"
                      label="Past Medical Bills ($)"
                      help="ER, ambulance, imaging, therapy, specialists."
                      value={medicalBillsPast}
                      onChange={(n) =>
                        setMedicalBillsPast(typeof n === "number" ? n : 0)
                      }
                      required
                    />
                    <NumberField
                      id="medical-future"
                      label="Estimated Future Care ($)"
                      help="Follow-up therapy, injections, future surgery."
                      value={medicalBillsFuture}
                      onChange={(n) =>
                        setMedicalBillsFuture(typeof n === "number" ? n : 0)
                      }
                    />
                    <NumberField
                      id="lost-wages"
                      label="Lost Wages / Lost Income ($)"
                      help="Missed workdays, sick leave used, PTO lost."
                      value={lostWages}
                      onChange={(n) => setLostWages(typeof n === "number" ? n : 0)}
                    />
                    <NumberField
                      id="other-oop"
                      label="Other Out-of-Pocket Costs ($)"
                      help="Prescriptions, braces, travel to doctor visits."
                      value={otherOutOfPocket}
                      onChange={(n) =>
                        setOtherOutOfPocket(typeof n === "number" ? n : 0)
                      }
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-2">
                    <NumberField
                      id="property"
                      label="Property Damage / Vehicle Repair or Total Loss ($)"
                      help="Property damage is reimbursed 1:1 and is not multiplied by pain & suffering multipliers."
                      value={propertyDamage}
                      onChange={(n) =>
                        setPropertyDamage(typeof n === "number" ? n : 0)
                      }
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-800">
                      Settlement Formula Methodology
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(Object.keys(FORMULA_MODE_COPY) as FormulaMode[]).map(
                        (mode) => {
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
                              className={`relative flex cursor-pointer items-start rounded-xl border-2 p-3.5 text-left transition ${
                                active
                                  ? isDj
                                    ? "border-[#047857] bg-[#F0FDF4]"
                                    : "border-plg-crimson bg-plg-warmIvory/40"
                                  : isDj
                                    ? "border-[#c7d2cc] bg-[#e0e7e2] hover:bg-[#d8e2db]"
                                    : "border-slate-200 bg-white hover:bg-plg-warmIvory"
                              }`}
                              aria-pressed={active}
                            >
                              <span
                                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                  active
                                    ? isDj
                                      ? "border-[#047857] bg-[#047857]"
                                      : "border-plg-crimson bg-plg-crimson"
                                    : "border-slate-300"
                                }`}
                                aria-hidden
                              >
                                {active ? (
                                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                ) : null}
                              </span>
                              <span className="ml-3">
                                <span className="block text-xs font-bold text-slate-900">
                                  {copy.label}
                                </span>
                                <span className="mt-0.5 block text-[11px] text-slate-600">
                                  {copy.short}
                                </span>
                              </span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div className={`flex items-center justify-between pt-4 ${isDj ? "border-t border-[#d1dbd4]" : ""}`}>
                    <span className="text-xs italic text-slate-500">
                      Step 1 figures update the live range immediately.
                    </span>
                    <button
                      type="button"
                      onClick={goNext}
                      className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition ${
                        isDj
                          ? "bg-[#062e22] hover:bg-[#0b3d2e]"
                          : "bg-slate-900 hover:bg-plg-crimson"
                      }`}
                    >
                      Continue to Injury Severity
                      <ChevronRightIcon size={14} className="shrink-0" />
                    </button>
                  </div>
                  </div>
                </fieldset>
              ) : null}

              {step === 2 ? (
                <fieldset className="space-y-6" onChange={markTouched}>
                  <div
                    className={
                      isDj
                        ? "border-b border-[#1c5d48] bg-gradient-to-r from-[#0b3d2e] to-[#124d3b] px-6 py-4 text-white sm:px-8"
                        : "border-b border-slate-100 pb-4"
                    }
                  >
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isDj ? "text-[#85d9b6]" : "text-plg-crimson"
                      }`}
                    >
                      Step 2 of 3
                    </span>
                    <h3
                      className={`font-serif mt-1 text-2xl font-bold ${
                        isDj ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Injury Severity & Comparative Fault
                    </h3>
                    <p className={`mt-1 text-xs ${isDj ? "text-[#d5e7df]" : "text-slate-500"}`}>
                      General damages are estimated from injury classification, care
                      factors, and degree of responsibility.
                    </p>
                  </div>
                  <div className={isDj ? "space-y-6 px-6 pb-6 sm:px-8" : "contents"}>

                  <div>
                    <label htmlFor="severity" className={`${labelClass} mb-1.5`}>
                      Injury Category & Treatment Complexity
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

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="treatment-months" className={labelClass}>
                        Months of Treatment
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
                          setTreatmentMonths(
                            Math.max(0, Number(e.target.value) || 0)
                          )
                        }
                        aria-invalid={Boolean(treatmentError)}
                      />
                      {treatmentError ? (
                        <p className={errorClass}>{treatmentError}</p>
                      ) : (
                        <p className={helpClass}>0–120 months of documented care.</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="care-type" className={labelClass}>
                        Primary Care Type
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
                      <label htmlFor="treatment-gap" className={labelClass}>
                        Treatment Gap
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
                        {(Object.keys(PERMANENCY_LABELS) as Permanency[]).map(
                          (k) => (
                            <option key={k} value={k}>
                              {PERMANENCY_LABELS[k]}
                            </option>
                          )
                        )}
                      </select>
                      <p className={helpClass}>
                        Documented lasting impairment can support higher multipliers.
                      </p>
                    </div>
                    <div>
                      <label htmlFor="us-state" className={labelClass}>
                        State Where Crash Occurred
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
                  </div>

                  <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                          Your Assigned Fault Percentage
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {usState === "WA"
                            ? "Washington RCW § 4.22.005 Pure Comparative Fault"
                            : usState === "CA"
                              ? "California Pure Comparative Fault"
                              : "Applied using this state’s comparative-fault category"}
                        </span>
                      </div>
                      <span className="rounded bg-slate-100 px-3 py-1 text-sm font-bold text-slate-900">
                        {plaintiffFaultPercent}%
                      </span>
                    </div>
                    <input
                      id="plaintiff-fault"
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={plaintiffFaultPercent}
                      onChange={(e) =>
                        setPlaintiffFaultPercent(Number(e.target.value) || 0)
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200"
                      aria-invalid={Boolean(faultError)}
                    />
                    {faultError ? (
                      <p className={errorClass}>{faultError}</p>
                    ) : (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-[11px] text-slate-600">
                        <strong>Legal note:</strong> Your share of fault typically reduces
                        recoverable damages.{" "}
                        {usState === "WA" ? (
                          <>
                            WA pure comparative negligence allows recovery even above 50%
                            fault (award reduced by your %).
                          </>
                        ) : usState === "CA" ? (
                          <>
                            California pure comparative negligence allows recovery even
                            above 50% fault (award reduced by your %).
                          </>
                        ) : (
                          <>
                            Comparative-fault rules vary by state — see the note for your
                            selected state.
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={`${labelClass} mb-1.5`}>
                      Police Report & Liability Assessment
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {liabilityButtons.map((btn) => {
                        const active = liabilityClarity === btn.id;
                        return (
                          <button
                            key={btn.id}
                            type="button"
                            onClick={() => {
                              markTouched();
                              setLiabilityClarity(btn.id);
                            }}
                            className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                              active
                                ? isDj
                                  ? "border-2 border-[#047857] bg-[#F0FDF4] text-[#064E3B]"
                                  : "border-2 border-plg-crimson bg-plg-warmIvory text-plg-crimson"
                                : isDj
                                  ? "border border-[#c7d2cc] font-medium text-slate-600 hover:border-[#047857]"
                                  : "border border-slate-200 font-medium text-slate-600 hover:border-slate-400"
                            }`}
                            aria-pressed={active}
                          >
                            {btn.label}
                          </button>
                        );
                      })}
                    </div>
                    <select
                      id="liability"
                      className="sr-only"
                      value={liabilityClarity}
                      onChange={(e) =>
                        setLiabilityClarity(e.target.value as LiabilityClarity)
                      }
                      tabIndex={-1}
                      aria-hidden
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

                  <div className={`flex items-center justify-between border-t pt-4 ${isDj ? "border-[#d1dbd4]" : "border-slate-100"}`}>
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-600 transition hover:text-slate-900"
                    >
                      <ChevronLeftIcon size={14} className="shrink-0" /> Back to Step 1
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition ${
                        isDj
                          ? "bg-[#062e22] hover:bg-[#0b3d2e]"
                          : "bg-slate-900 hover:bg-plg-crimson"
                      }`}
                    >
                      Continue to Insurance Limits
                      <ChevronRightIcon size={14} className="shrink-0" />
                    </button>
                  </div>
                  </div>
                </fieldset>
              ) : null}

              {step === 3 ? (
                <fieldset className="space-y-6" onChange={markTouched}>
                  <div
                    className={
                      isDj
                        ? "border-b border-[#1c5d48] bg-gradient-to-r from-[#0b3d2e] to-[#124d3b] px-6 py-4 text-white sm:px-8"
                        : "border-b border-slate-100 pb-4"
                    }
                  >
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isDj ? "text-[#85d9b6]" : "text-plg-crimson"
                      }`}
                    >
                      Step 3 of 3
                    </span>
                    <h3
                      className={`font-serif mt-1 text-2xl font-bold ${
                        isDj ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Insurance Policy Limits & Offer Reality Check
                    </h3>
                    <p className={`mt-1 text-xs ${isDj ? "text-[#d5e7df]" : "text-slate-500"}`}>
                      Settlements are frequently capped by applicable policy maximums.
                      Enter known BI limits and any insurer offer.
                    </p>
                  </div>
                  <div className={isDj ? "space-y-6 px-6 pb-6 sm:px-8" : "contents"}>

                  <div>
                    <label htmlFor="policy-preset" className={`${labelClass} mb-1.5`}>
                      At-Fault Driver&apos;s Bodily Injury (BI) Coverage
                    </label>
                    <select
                      id="policy-preset"
                      className={inputClass}
                      value={
                        policyLimitPerPerson === ""
                          ? "unknown"
                          : String(policyLimitPerPerson)
                      }
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "unknown") {
                          setPolicyLimitPerPerson("");
                        } else {
                          setPolicyLimitPerPerson(Number(v));
                        }
                      }}
                    >
                      <option value="25000">
                        Statutory minimum / $25,000 per person
                      </option>
                      <option value="50000">$50,000 Policy Limit</option>
                      <option value="100000">
                        $100,000 Policy Limit (Typical middle-tier)
                      </option>
                      <option value="250000">$250,000 Policy Limit</option>
                      <option value="500000">$500,000 Policy Limit</option>
                      <option value="1000000">
                        $1,000,000+ Commercial / Umbrella
                      </option>
                      <option value="unknown">Unknown / Multiple Coverage Layers</option>
                    </select>
                    <p className={helpClass}>
                      {usState === "WA" ? (
                        <>
                          <strong>Washington Minimum:</strong> WA requires $25,000 bodily
                          injury liability per person. If your claim exceeds this, ask about
                          UIM and umbrella policies.
                        </>
                      ) : usState === "CA" ? (
                        <>
                          <strong>California note:</strong> California requires minimum
                          bodily injury liability coverage; limits and UIM options vary.
                          Leave unknown if you do not know limits yet — the range still
                          updates. Ask counsel about current statutory minimums and excess
                          coverage.
                        </>
                      ) : (
                        "Leave unknown if you do not know limits yet — the range still updates."
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <NumberField
                      id="policy-per-person"
                      label="BI Limit Per Person ($)"
                      help="Caps recoverable range when set"
                      value={policyLimitPerPerson}
                      onChange={setPolicyLimitPerPerson}
                      optional
                    />
                    <NumberField
                      id="policy-per-accident"
                      label="BI Limit Per Accident ($)"
                      help="Shown as a note; not used to cap the estimate"
                      value={policyLimitPerAccident}
                      onChange={setPolicyLimitPerAccident}
                      optional
                    />
                  </div>

                  <div className="rounded-xl border border-plg-borderMuted bg-plg-warmIvory/60 p-4">
                    <label htmlFor="offer" className={`${labelClass} mb-1.5`}>
                      Has the insurance adjuster made an initial settlement offer?
                    </label>
                    <div className="relative rounded-lg shadow-sm sm:w-2/3">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 font-semibold text-slate-400">
                        $
                      </span>
                      <input
                        id="offer"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step={500}
                        placeholder="Optional (e.g. 18000)"
                        className={`${inputClass} !mt-0 pl-8 ${!offerValid ? "border-red-400" : ""}`}
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
                      <p className={`${helpClass} mt-1.5`}>
                        If provided, we compare this offer against your educational mid
                        estimate.
                      </p>
                    )}
                  </div>

                  <div className={`flex items-center justify-between border-t pt-4 ${isDj ? "border-[#d1dbd4]" : "border-slate-100"}`}>
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-600 transition hover:text-slate-900"
                    >
                      <ChevronLeftIcon size={14} className="shrink-0" /> Back to Step 2
                    </button>
                    <a
                      href="#results"
                      onClick={markTouched}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition lg:hidden ${
                        isDj
                          ? "border-[#c8d2cc] bg-[#dbe3de] text-[#062e22] hover:bg-[#cfd9d3]"
                          : "border-slate-300 bg-plg-warmIvory text-slate-900 hover:bg-slate-200"
                      }`}
                    >
                      View Live Estimate
                    </a>
                  </div>
                  </div>
                </fieldset>
              ) : null}
            </div>
            </div>

          </div>

          {/* RIGHT results */}
          <div className="lg:col-span-5">
            <div className="space-y-5 lg:sticky lg:top-28 pb-28 lg:pb-0">
              <div
                id="results"
                className={`scroll-mt-28 overflow-hidden rounded-xl border shadow-plg-panel sm:rounded-2xl ${
                  isDj
                    ? "dj-results-shell border-[#263a2f] bg-[#17231c] text-[#e9efe9]"
                    : "border-2 border-slate-900 bg-white"
                }`}
                aria-live="polite"
              >
                <div
                  className={`flex items-center justify-between px-6 py-4 ${
                    isDj
                      ? "border-b border-[#2d473a]"
                      : "border-b border-slate-800 bg-plg-navy text-white"
                  }`}
                >
                  <div>
                    <span
                      className={`block text-[10px] font-bold uppercase tracking-[0.2em] ${
                        isDj
                          ? "inline-block rounded bg-[#22382c] border border-[#2e4c3c] px-2 py-0.5 text-[#97f5cc]"
                          : "text-plg-gold"
                      }`}
                    >
                      Confidential Analysis
                    </span>
                    <h3
                      className={`font-serif text-lg font-bold ${
                        isDj ? "mt-2 text-white" : ""
                      }`}
                    >
                      Estimated Settlement Range
                    </h3>
                  </div>
                  {isDj ? (
                    <span className="text-xs text-[#e9efe9]/70">Estimated range</span>
                  ) : null}
                </div>

                <div
                  className={
                    isDj
                      ? "relative p-6"
                      : "bg-gradient-to-b from-white to-plg-cream/50 p-6"
                  }
                >
                  {isDj ? (
                    <div
                      className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#0e5c43]/20 blur-2xl"
                      aria-hidden
                    />
                  ) : null}
                  <SignatureMoment placement="result" className="min-h-0" />

                  {!hasEconomic ? (
                    <p className={`text-sm ${isDj ? "text-[#cadbd2]" : "text-slate-500"}`}>
                      Enter at least one economic damage amount to see a low / mid / high
                      range.
                    </p>
                  ) : (
                    <>
                      <p
                        className={`mb-3 text-[10px] font-semibold uppercase tracking-wide ${
                          isDj ? "text-[#cadbd2]/80" : "text-slate-500"
                        }`}
                      >
                        {showPreFault
                          ? "Recoverable after comparative fault"
                          : "Estimated range"}
                      </p>

                      <div
                        className={`mb-4 grid grid-cols-3 items-stretch gap-2 ${
                          isDj ? "gap-2 sm:gap-2.5" : "items-end gap-2.5"
                        }`}
                      >
                        <div
                          className={`rounded-xl border text-center transition ${
                            isDj
                              ? "dj-results-tier border-[#2b4236] bg-[#1f3027] p-2.5 sm:p-3"
                              : "border-slate-200 bg-slate-50 p-3 hover:border-slate-300"
                          }`}
                        >
                          <span
                            className={`mb-1 block text-[10px] font-bold uppercase tracking-wider ${
                              isDj ? "text-[#e9efe9]/45" : "text-slate-500"
                            }`}
                          >
                            Conservative
                          </span>
                          <span
                            className={`block font-extrabold ${
                              isDj
                                ? "text-sm text-[#e9efe9]/85 sm:text-base"
                                : "text-base text-slate-700 sm:text-lg"
                            }`}
                          >
                            <CountUpCurrency value={result.recoverableLow} />
                          </span>
                          <span
                            className={`mt-0.5 block text-[10px] ${
                              isDj ? "text-[#e9efe9]/40" : "text-slate-400"
                            }`}
                          >
                            {result.multiplierLow}× Multiplier
                          </span>
                        </div>

                        <div
                          className={`rounded-xl border text-center text-white shadow-md ${
                            isDj
                              ? "dj-results-mid relative z-10 border-[#10B981]/50 bg-[#064E3B] p-4 shadow-lg sm:p-5"
                              : "border-slate-700 bg-slate-900 p-3.5 ring-2 ring-plg-crimson/40"
                          } ${midPop ? "motion-safe:animate-mid-pop" : ""}`}
                        >
                          <span
                            className={`mb-1 block uppercase tracking-wider ${
                              isDj
                                ? "text-[10px] font-semibold text-[#97f5cc]"
                                : "text-[10px] font-medium text-plg-gold"
                            }`}
                          >
                            Estimated Mid
                          </span>
                          <span
                            className={`block font-black text-white ${
                              isDj
                                ? "text-2xl tabular-nums sm:text-3xl"
                                : "text-xl sm:text-2xl"
                            }`}
                          >
                            <CountUpCurrency value={result.recoverableMid} />
                          </span>
                          <span
                            className={`mt-0.5 block text-[10px] ${
                              isDj ? "text-[#a3e0c7]" : "text-slate-300"
                            }`}
                          >
                            {result.multiplierMid}× Multiplier
                          </span>
                        </div>

                        <div
                          className={`rounded-xl border text-center transition ${
                            isDj
                              ? "dj-results-tier border-[#2b4236] bg-[#1f3027] p-2.5 sm:p-3"
                              : "border-slate-200 bg-slate-50 p-3 hover:border-slate-300"
                          }`}
                        >
                          <span
                            className={`mb-1 block text-[10px] font-bold uppercase tracking-wider ${
                              isDj ? "text-[#e9efe9]/45" : "text-slate-500"
                            }`}
                          >
                            Trial / Strong
                          </span>
                          <span
                            className={`block font-extrabold ${
                              isDj
                                ? "text-sm text-[#e9efe9]/85 sm:text-base"
                                : "text-base text-slate-700 sm:text-lg"
                            }`}
                          >
                            <CountUpCurrency value={result.recoverableHigh} />
                          </span>
                          <span
                            className={`mt-0.5 block text-[10px] ${
                              isDj ? "text-[#e9efe9]/40" : "text-slate-400"
                            }`}
                          >
                            {result.multiplierHigh}× Multiplier
                          </span>
                        </div>
                      </div>

                      {result.policyLimitsMayBind ? (
                        <div
                          className={`mb-4 rounded-lg border p-3 text-xs ${
                            isDj
                              ? "border-[#6a3700]/60 bg-[#4a2400]/40 text-[#ffb77d]"
                              : "border-amber-200 bg-amber-50 text-amber-900"
                          }`}
                          role="status"
                        >
                          <strong>Policy Limit Cap:</strong> Value exceeds at-fault limit (
                          {formatCurrency(result.policyLimitPerPerson ?? 0)}). Full recovery
                          may require UIM or excess coverage.
                        </div>
                      ) : null}

                      {result.recoveryBarred ? (
                        <p
                          className={`mb-3 text-xs leading-snug ${
                            isDj ? "text-[#ffb77d]" : "text-amber-900"
                          }`}
                          role="status"
                        >
                          <span className="font-semibold">Recovery may be barred.</span> At{" "}
                          {result.faultPercentApplied}% plaintiff fault under {usState}
                          &apos;s rules, recoverable dollars are shown as $0.
                        </p>
                      ) : null}

                      {showPreFault ? (
                        <p
                          className={`mb-3 text-xs tabular-nums leading-snug ${
                            isDj ? "text-[#cadbd2]/80" : "text-slate-500"
                          }`}
                        >
                          Pre-fault: Low {formatCurrency(result.low)} · Mid{" "}
                          {formatCurrency(result.mid)} · High {formatCurrency(result.high)}
                          {result.faultPercentApplied > 0
                            ? ` · Fault ${result.faultPercentApplied}%`
                            : ""}
                        </p>
                      ) : null}

                      {result.cappedMid != null ? (
                        <p
                          className={`mb-3 rounded-lg border px-3 py-2 text-xs tabular-nums leading-snug ${
                            isDj
                              ? "border-[#2d473a] bg-[#1f3027] text-center text-[#e9efe9]/80"
                              : "text-slate-500"
                          }`}
                        >
                          Policy-capped: Low {formatCurrency(result.cappedLow ?? 0)} · Mid{" "}
                          {formatCurrency(result.cappedMid)} · High{" "}
                          {formatCurrency(result.cappedHigh ?? 0)}
                        </p>
                      ) : null}

                      {offerCheck ? (
                        <div className="mb-4">
                          <OfferGauge check={offerCheck} dark={isDj} />
                        </div>
                      ) : null}

                      <div
                        className={`mb-5 overflow-hidden rounded-xl border ${
                          isDj
                            ? "border-[#2d473a] bg-[#1f3027]"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <details>
                          <summary
                            className={`flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-left text-xs font-bold transition marker:content-none [&::-webkit-details-marker]:hidden ${
                              isDj
                                ? "text-[#97f5cc] hover:text-white"
                                : "text-slate-800 hover:bg-slate-50"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span
                                className={isDj ? "text-[#85d9b6]" : "text-plg-crimson"}
                                aria-hidden
                              >
                                ⌘
                              </span>
                              Show Line-by-Line Math Breakdown
                            </span>
                            <span
                              className={`text-xs ${isDj ? "text-[#85d9b6]/70" : "text-slate-400"}`}
                              aria-hidden
                            >
                              ▾
                            </span>
                          </summary>
                          <div
                            className={`border-t px-2 pb-2 pt-2 ${
                              isDj
                                ? "border-[#2d473a] bg-[#14221b]/80"
                                : "border-slate-100 bg-slate-50/50"
                            }`}
                          >
                            <BreakdownPanel result={result} usState={usState} dark={isDj} />
                          </div>
                        </details>
                      </div>

                      <div className="space-y-2.5 print:hidden">
                        <a
                          href={client.ctaUrl}
                          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold tracking-wide text-white shadow-md transition hover:shadow-lg ${
                            isDj
                              ? "bg-[#047857] hover:bg-[#064E3B]"
                              : "bg-plg-crimson hover:bg-plg-crimsonDark"
                          }`}
                        >
                          {client.ctaText} — Review With An Attorney
                        </a>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`tel:${client.phone.replace(/[^\d+]/g, "")}`}
                            className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold tracking-wide text-white transition ${
                              isDj
                                ? "bg-[#0F172A] hover:bg-[#1E293B]"
                                : "bg-slate-900 hover:bg-slate-800"
                            }`}
                          >
                            <PhoneIcon
                              size={14}
                              className={isDj ? "text-[#85d9b6]" : "text-plg-gold"}
                            />
                            {client.phone}
                          </a>
                          <PrintSummary
                            compact
                            result={result}
                            offerCheck={offerCheck}
                            firmName={client.firmName}
                            usState={usState}
                          />
                        </div>
                      </div>

                      <div
                        className={`mt-4 border-t pt-4 text-center ${
                          isDj ? "border-[#2d473a]" : "border-slate-200"
                        }`}
                      >
                        <p
                          className={`text-[11px] leading-normal ${
                            isDj ? "text-[#cadbd2]/80" : "text-slate-500"
                          }`}
                        >
                          <strong>No upfront attorney fees.</strong> For qualifying
                          contingency cases, you pay nothing unless {client.shortName}{" "}
                          settles or wins your case. Educational estimate only — not a
                          guarantee or legal advice.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
