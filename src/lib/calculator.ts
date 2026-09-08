import type {
  CalculatorInputs,
  CareType,
  FirmMultipliers,
  FormulaMode,
  LiabilityClarity,
  MultiplierLever,
  OfferRealityCheck,
  Permanency,
  SettlementRange,
  Severity,
  TreatmentGap,
} from "./types";
import { getStateFaultInfo, type FaultCategory } from "./states";

const DEFAULT_SEVERITY_BASE: Record<
  Severity,
  { low: number; mid: number; high: number }
> = {
  minor: { low: 1.5, mid: 2.0, high: 2.5 },
  moderate: { low: 2.0, mid: 2.75, high: 3.5 },
  severe: { low: 3.0, mid: 3.75, high: 4.5 },
  catastrophic: { low: 4.0, mid: 5.0, high: 6.0 },
};

const DEFAULT_CARE: Record<CareType, number> = {
  chiro: -0.15,
  md: 0.1,
  surgery: 0.45,
};

const DEFAULT_LIABILITY: Record<LiabilityClarity, number> = {
  clear: 0.25,
  mixed: -0.2,
  disputed: -0.55,
};

const DEFAULT_TREATMENT_GAP: Record<TreatmentGap, number> = {
  none: 0,
  short: -0.2,
  long: -0.45,
};

const DEFAULT_PERMANENCY: Record<Permanency, number> = {
  none: 0,
  possible: 0.25,
  rated: 0.55,
};

const DEFAULT_TREATMENT_MONTHS: { maxMonths: number; adjustment: number }[] = [
  { maxMonths: 1, adjustment: -0.15 },
  { maxMonths: 3, adjustment: 0 },
  { maxMonths: 6, adjustment: 0.15 },
  { maxMonths: 12, adjustment: 0.3 },
];
const DEFAULT_TREATMENT_MONTHS_FALLBACK = 0.45;

const DEFAULT_CLAMP_MIN = 1.25;
const DEFAULT_CLAMP_MAX = 7;

function resolveMultipliers(overrides?: FirmMultipliers) {
  const severity = { ...DEFAULT_SEVERITY_BASE };
  if (overrides?.severity) {
    for (const key of Object.keys(overrides.severity) as Severity[]) {
      const band = overrides.severity[key];
      if (band) severity[key] = { ...severity[key], ...band };
    }
  }
  return {
    severity,
    clampMin: overrides?.clampMin ?? DEFAULT_CLAMP_MIN,
    clampMax: overrides?.clampMax ?? DEFAULT_CLAMP_MAX,
    care: { ...DEFAULT_CARE, ...overrides?.care },
    liability: { ...DEFAULT_LIABILITY, ...overrides?.liability },
    treatmentGap: { ...DEFAULT_TREATMENT_GAP, ...overrides?.treatmentGap },
    permanency: { ...DEFAULT_PERMANENCY, ...overrides?.permanency },
    treatmentMonths:
      overrides?.treatmentMonths && overrides.treatmentMonths.length > 0
        ? [...overrides.treatmentMonths].sort(
            (a, b) => a.maxMonths - b.maxMonths
          )
        : DEFAULT_TREATMENT_MONTHS,
    treatmentMonthsFallback: DEFAULT_TREATMENT_MONTHS_FALLBACK,
  };
}

function treatmentAdjustment(
  months: number,
  breakpoints: { maxMonths: number; adjustment: number }[],
  fallback: number
): number {
  const m = Math.max(0, months);
  for (const bp of breakpoints) {
    if (m <= bp.maxMonths) return bp.adjustment;
  }
  return fallback;
}

function clampMultiplier(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function roundMoney(n: number): number {
  return Math.round(n / 100) * 100;
}

/**
 * Apply state comparative-fault rules to a dollar amount.
 * Educational only — not legal advice.
 */
export function applyComparativeFault(
  amount: number,
  faultPercent: number,
  category: FaultCategory
): { recoverable: number; barred: boolean } {
  const fault = Math.max(0, Math.min(100, faultPercent));
  const safeAmount = Math.max(0, amount);

  switch (category) {
    case "pure-comparative":
      return {
        recoverable: safeAmount * (1 - fault / 100),
        barred: false,
      };
    case "modified-50":
      if (fault >= 50) return { recoverable: 0, barred: true };
      return {
        recoverable: safeAmount * (1 - fault / 100),
        barred: false,
      };
    case "modified-51":
      if (fault >= 51) return { recoverable: 0, barred: true };
      return {
        recoverable: safeAmount * (1 - fault / 100),
        barred: false,
      };
    case "contributory":
      if (fault > 0) return { recoverable: 0, barred: true };
      return { recoverable: safeAmount, barred: false };
    case "unknown":
    default:
      return {
        recoverable: safeAmount * (1 - fault / 100),
        barred: false,
      };
  }
}

function buildLevers(
  inputs: CalculatorInputs,
  cfg: ReturnType<typeof resolveMultipliers>
): MultiplierLever[] {
  const gap = inputs.treatmentGap ?? "none";
  const perm = inputs.permanency ?? "none";
  const careAdj = cfg.care[inputs.careType];
  const liabAdj = cfg.liability[inputs.liabilityClarity];
  const treatAdj = treatmentAdjustment(
    inputs.treatmentMonths,
    cfg.treatmentMonths,
    cfg.treatmentMonthsFallback
  );
  const gapAdj = cfg.treatmentGap[gap];
  const permAdj = cfg.permanency[perm];

  return [
    {
      id: "severity",
      label: "Injury severity",
      detail: SEVERITY_LABELS[inputs.severity],
      adjustment: 0,
    },
    {
      id: "care",
      label: "Primary care type",
      detail: CARE_LABELS[inputs.careType],
      adjustment: careAdj,
    },
    {
      id: "treatment",
      label: "Months of treatment",
      detail: `${Math.max(0, inputs.treatmentMonths)} month${inputs.treatmentMonths === 1 ? "" : "s"}`,
      adjustment: treatAdj,
    },
    {
      id: "treatmentGap",
      label: "Treatment gap",
      detail: TREATMENT_GAP_LABELS[gap],
      adjustment: gapAdj,
    },
    {
      id: "permanency",
      label: "Permanency",
      detail: PERMANENCY_LABELS[perm],
      adjustment: permAdj,
    },
    {
      id: "liability",
      label: "Liability clarity",
      detail: LIABILITY_LABELS[inputs.liabilityClarity],
      adjustment: liabAdj,
    },
  ];
}

function applyFormula(
  mode: FormulaMode,
  medical: number,
  wages: number,
  other: number,
  property: number,
  multiplier: number
): number {
  if (mode === "adjuster") {
    return medical * multiplier + wages + other + property;
  }
  // demand (default): specials × mult + property
  const specials = medical + wages + other;
  return specials * multiplier + property;
}

/**
 * Educational multiplier-method estimate.
 * Supports demand vs adjuster formulas, firm multipliers, comparative fault,
 * and optional per-person policy caps.
 */
export function calculateSettlement(
  inputs: CalculatorInputs,
  multipliers?: FirmMultipliers
): SettlementRange {
  const cfg = resolveMultipliers(multipliers);
  const mode: FormulaMode = inputs.formulaMode ?? "demand";

  const medical =
    Math.max(0, inputs.medicalBillsPast) + Math.max(0, inputs.medicalBillsFuture);
  const wages = Math.max(0, inputs.lostWages);
  const other = Math.max(0, inputs.otherOutOfPocket);
  const property = Math.max(0, inputs.propertyDamage);

  const specialsForPain = medical + wages + other;
  const economicBase = specialsForPain + property;
  const multipliedBase = mode === "adjuster" ? medical : specialsForPain;

  const base = cfg.severity[inputs.severity];
  const levers = buildLevers(inputs, cfg);
  const totalAdjustment = levers
    .filter((l) => l.id !== "severity")
    .reduce((sum, l) => sum + l.adjustment, 0);

  const multiplierLow = clampMultiplier(
    base.low + totalAdjustment,
    cfg.clampMin,
    cfg.clampMax
  );
  const multiplierMid = clampMultiplier(
    base.mid + totalAdjustment,
    cfg.clampMin,
    cfg.clampMax
  );
  const multiplierHigh = clampMultiplier(
    base.high + totalAdjustment,
    cfg.clampMin,
    cfg.clampMax
  );

  const low = roundMoney(
    applyFormula(mode, medical, wages, other, property, multiplierLow)
  );
  const mid = roundMoney(
    applyFormula(mode, medical, wages, other, property, multiplierMid)
  );
  const high = roundMoney(
    applyFormula(mode, medical, wages, other, property, multiplierHigh)
  );

  const state = getStateFaultInfo(inputs.usState);
  const faultPercent = Math.max(
    0,
    Math.min(100, inputs.plaintiffFaultPercent ?? 0)
  );

  const faultLow = applyComparativeFault(low, faultPercent, state.category);
  const faultMid = applyComparativeFault(mid, faultPercent, state.category);
  const faultHigh = applyComparativeFault(high, faultPercent, state.category);
  const recoveryBarred =
    faultLow.barred || faultMid.barred || faultHigh.barred;

  const recoverableLow = roundMoney(faultLow.recoverable);
  const recoverableMid = roundMoney(faultMid.recoverable);
  const recoverableHigh = roundMoney(faultHigh.recoverable);

  const limitRaw = inputs.policyLimitPerPerson;
  const policyLimitPerPerson =
    limitRaw != null && Number.isFinite(limitRaw) && limitRaw > 0
      ? limitRaw
      : null;
  const accidentRaw = inputs.policyLimitPerAccident;
  const policyLimitPerAccident =
    accidentRaw != null && Number.isFinite(accidentRaw) && accidentRaw > 0
      ? accidentRaw
      : null;

  let cappedLow: number | null = null;
  let cappedMid: number | null = null;
  let cappedHigh: number | null = null;
  let policyLimitsMayBind = false;

  if (policyLimitPerPerson != null) {
    cappedLow = roundMoney(Math.min(recoverableLow, policyLimitPerPerson));
    cappedMid = roundMoney(Math.min(recoverableMid, policyLimitPerPerson));
    cappedHigh = roundMoney(Math.min(recoverableHigh, policyLimitPerPerson));
    policyLimitsMayBind = recoverableMid > policyLimitPerPerson;
  }

  let comparativeFaultNote = state.note;
  if (state.category === "unknown" && faultPercent > 0) {
    comparativeFaultNote = `${state.note} For illustration, this estimate reduces the range by your entered fault share (${faultPercent}%).`;
  }
  if (recoveryBarred) {
    comparativeFaultNote = `Recovery may be barred under ${state.name}'s fault rules at ${faultPercent}% plaintiff fault. ${state.note}`;
  }

  return {
    low,
    mid,
    high,
    recoverableLow,
    recoverableMid,
    recoverableHigh,
    recoveryBarred,
    faultPercentApplied: faultPercent,
    cappedLow,
    cappedMid,
    cappedHigh,
    policyLimitPerPerson,
    policyLimitPerAccident,
    policyLimitsMayBind,
    formulaMode: mode,
    economicBase,
    specialsForPain,
    multipliedBase,
    propertyDamage: property,
    medicalTotal: medical,
    lostWages: wages,
    otherOutOfPocket: other,
    baseMultiplier: { ...base },
    levers,
    totalAdjustment: Math.round(totalAdjustment * 100) / 100,
    multiplierLow: Math.round(multiplierLow * 100) / 100,
    multiplierMid: Math.round(multiplierMid * 100) / 100,
    multiplierHigh: Math.round(multiplierHigh * 100) / 100,
    comparativeFaultNote,
    comparativeFaultCategory: state.category,
  };
}

export function evaluateOffer(
  offer: number,
  midEstimate: number,
  options?: { cappedMid?: number | null; policyLimitsMayBind?: boolean }
): OfferRealityCheck {
  const safeMid = Math.max(1, midEstimate);
  const percentOfMid = Math.round((offer / safeMid) * 1000) / 10;
  const gap = midEstimate - offer;
  const gaugePercent = Math.min(140, Math.max(0, percentOfMid));

  let label: OfferRealityCheck["label"];
  let summary: string;

  if (percentOfMid < 40) {
    label = "well-below";
    summary =
      "This offer sits well below a typical mid-range estimate for the inputs you entered. Early insurer offers are often starting points — documenting injuries and negotiating can matter.";
  } else if (percentOfMid < 70) {
    label = "below";
    summary =
      "This offer is below the mid-range educational estimate. There may be room to negotiate, depending on liability, medical proof, and insurance limits.";
  } else if (percentOfMid <= 110) {
    label = "near";
    summary =
      "This offer is near the mid-range educational estimate. Whether it is fair depends on case specifics an attorney can evaluate.";
  } else {
    label = "above";
    summary =
      "This offer is above the mid-range educational estimate for these inputs. Confirm that future care, wage loss, and all damages are fully accounted for before accepting.";
  }

  const cappedMid = options?.cappedMid ?? null;
  if (
    options?.policyLimitsMayBind &&
    cappedMid != null &&
    Number.isFinite(cappedMid)
  ) {
    summary += ` Policy limits may bind: per-person capped mid is ${formatCurrency(cappedMid)} (vs uncapped post-fault mid ${formatCurrency(midEstimate)}).`;
  }

  return {
    offer,
    midEstimate,
    percentOfMid,
    gaugePercent,
    gap,
    label,
    summary,
    cappedMidEstimate: cappedMid,
  };
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatSignedMultiplier(adj: number): string {
  if (adj === 0) return "±0.00×";
  const sign = adj > 0 ? "+" : "";
  return `${sign}${adj.toFixed(2)}×`;
}

export const SEVERITY_LABELS: Record<Severity, string> = {
  minor: "Minor (soft tissue, brief recovery)",
  moderate: "Moderate (months of care, lasting symptoms)",
  severe: "Severe (fractures, significant impairment)",
  catastrophic: "Catastrophic (permanent / life-altering)",
};

export const CARE_LABELS: Record<CareType, string> = {
  chiro: "Chiropractic / PT primary",
  md: "MD / specialist care",
  surgery: "Surgery involved",
};

export const LIABILITY_LABELS: Record<LiabilityClarity, string> = {
  clear: "Clear (other party clearly at fault)",
  mixed: "Mixed (shared or unclear fault)",
  disputed: "Disputed (liability contested)",
};

export const TREATMENT_GAP_LABELS: Record<TreatmentGap, string> = {
  none: "No meaningful gap in care",
  short: "Short gap (weeks)",
  long: "Long gap (months+)",
};

export const PERMANENCY_LABELS: Record<Permanency, string> = {
  none: "No permanency claimed",
  possible: "Possible lasting impairment",
  rated: "Rated / documented permanency",
};

export const FORMULA_MODE_COPY: Record<
  FormulaMode,
  { label: string; blurb: string }
> = {
  demand: {
    label: "Demand-style",
    blurb:
      "Multiplies medical + wages + other (specials), then adds property — common in demand letters.",
  },
  adjuster: {
    label: "Adjuster-style",
    blurb:
      "Multiplies medical only, then adds wages, other, and property — closer to some adjuster worksheets.",
  },
};

/** Educational sample ranges for the ranges table (not predictions). */
export const EDUCATIONAL_RANGES = [
  {
    scenario: "Minor soft-tissue, clear liability",
    medical: "$2,000–$8,000",
    typicalMultiplier: "1.5×–2.5×",
    illustrative: "$5,000–$25,000",
  },
  {
    scenario: "Moderate injury, several months of care",
    medical: "$8,000–$30,000",
    typicalMultiplier: "2×–3.5×",
    illustrative: "$25,000–$100,000",
  },
  {
    scenario: "Severe injury / surgery",
    medical: "$30,000–$150,000+",
    typicalMultiplier: "3×–4.5×",
    illustrative: "$100,000–$500,000+",
  },
  {
    scenario: "Catastrophic / permanent impairment",
    medical: "$150,000+",
    typicalMultiplier: "4×–6×+",
    illustrative: "$500,000–multi-million*",
  },
];

/** Worked example used in educational content (matches demo defaults). */
export const WORKED_EXAMPLE = {
  title: "Worked example (educational)",
  narrative:
    "Suppose $15,000 in medical bills, $4,500 lost wages, $800 other costs, and $6,500 property damage after a moderate injury with four months of MD care and clear liability.",
  highlights: [
    "Specials for pain: $20,300",
    "Severity band starts near 2.0×–3.5×",
    "Care + treatment + liability levers nudge the mid multiplier upward",
    "Property damage is added after multiplication",
  ],
};

/** Built-in defaults exposed for docs / firm templates. */
export const DEFAULT_MULTIPLIERS_DOC = {
  severity: DEFAULT_SEVERITY_BASE,
  clampMin: DEFAULT_CLAMP_MIN,
  clampMax: DEFAULT_CLAMP_MAX,
  care: DEFAULT_CARE,
  liability: DEFAULT_LIABILITY,
  treatmentGap: DEFAULT_TREATMENT_GAP,
  permanency: DEFAULT_PERMANENCY,
  treatmentMonths: DEFAULT_TREATMENT_MONTHS,
  treatmentMonthsElse: DEFAULT_TREATMENT_MONTHS_FALLBACK,
};
