import type {
  CalculatorInputs,
  OfferRealityCheck,
  SettlementRange,
  Severity,
  CareType,
  LiabilityClarity,
} from "./types";
import { getStateFaultInfo } from "./states";

const SEVERITY_BASE: Record<Severity, { low: number; mid: number; high: number }> = {
  minor: { low: 1.5, mid: 2.0, high: 2.5 },
  moderate: { low: 2.0, mid: 2.75, high: 3.5 },
  severe: { low: 3.0, mid: 3.75, high: 4.5 },
  catastrophic: { low: 4.0, mid: 5.0, high: 6.0 },
};

function careAdjustment(care: CareType): number {
  switch (care) {
    case "chiro":
      return -0.15;
    case "md":
      return 0.1;
    case "surgery":
      return 0.45;
    default:
      return 0;
  }
}

function liabilityAdjustment(liability: LiabilityClarity): number {
  switch (liability) {
    case "clear":
      return 0.25;
    case "mixed":
      return -0.2;
    case "disputed":
      return -0.55;
    default:
      return 0;
  }
}

function treatmentAdjustment(months: number): number {
  if (months <= 1) return -0.15;
  if (months <= 3) return 0;
  if (months <= 6) return 0.15;
  if (months <= 12) return 0.3;
  return 0.45;
}

function clampMultiplier(n: number): number {
  return Math.max(1.25, Math.min(7, n));
}

function roundMoney(n: number): number {
  return Math.round(n / 100) * 100;
}

/**
 * Educational multiplier-method estimate.
 * Economic damages × adjusted multiplier → low / mid / high range.
 * Property damage is included in economic base but not multiplied (common practice).
 */
export function calculateSettlement(inputs: CalculatorInputs): SettlementRange {
  const medical =
    Math.max(0, inputs.medicalBillsPast) + Math.max(0, inputs.medicalBillsFuture);
  const wages = Math.max(0, inputs.lostWages);
  const other = Math.max(0, inputs.otherOutOfPocket);
  const property = Math.max(0, inputs.propertyDamage);

  const specialsForPain = medical + wages + other;
  const economicBase = specialsForPain + property;

  const base = SEVERITY_BASE[inputs.severity];
  const adj =
    careAdjustment(inputs.careType) +
    liabilityAdjustment(inputs.liabilityClarity) +
    treatmentAdjustment(Math.max(0, inputs.treatmentMonths));

  const multiplierLow = clampMultiplier(base.low + adj);
  const multiplierMid = clampMultiplier(base.mid + adj);
  const multiplierHigh = clampMultiplier(base.high + adj);

  const low = roundMoney(specialsForPain * multiplierLow + property);
  const mid = roundMoney(specialsForPain * multiplierMid + property);
  const high = roundMoney(specialsForPain * multiplierHigh + property);

  const state = getStateFaultInfo(inputs.usState);

  return {
    low,
    mid,
    high,
    economicBase,
    multiplierLow: Math.round(multiplierLow * 100) / 100,
    multiplierMid: Math.round(multiplierMid * 100) / 100,
    multiplierHigh: Math.round(multiplierHigh * 100) / 100,
    comparativeFaultNote: state.note,
    comparativeFaultCategory: state.category,
  };
}

export function evaluateOffer(
  offer: number,
  midEstimate: number
): OfferRealityCheck {
  const safeMid = Math.max(1, midEstimate);
  const percentOfMid = Math.round((offer / safeMid) * 1000) / 10;
  const gap = midEstimate - offer;

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

  return {
    offer,
    midEstimate,
    percentOfMid,
    gap,
    label,
    summary,
  };
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
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
