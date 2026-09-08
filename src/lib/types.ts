export type Severity = "minor" | "moderate" | "severe" | "catastrophic";
export type CareType = "chiro" | "md" | "surgery";
export type LiabilityClarity = "clear" | "mixed" | "disputed";
export type FormulaMode = "demand" | "adjuster";
export type TreatmentGap = "none" | "short" | "long";
export type Permanency = "none" | "possible" | "rated";

export interface TrustStat {
  value: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  detail?: string;
}

/** Firm-tunable multiplier knobs. Omitted keys fall back to built-in defaults. */
export interface FirmMultipliers {
  severity?: Partial<
    Record<Severity, { low: number; mid: number; high: number }>
  >;
  clampMin?: number;
  clampMax?: number;
  care?: Partial<Record<CareType, number>>;
  liability?: Partial<Record<LiabilityClarity, number>>;
  treatmentGap?: Partial<Record<TreatmentGap, number>>;
  permanency?: Partial<Record<Permanency, number>>;
  /**
   * Optional treatment-months breakpoints (inclusive maxMonths, ascending).
   * Default: ≤1 → -0.15, ≤3 → 0, ≤6 → 0.15, ≤12 → 0.30, else → 0.45
   */
  treatmentMonths?: { maxMonths: number; adjustment: number }[];
}

export interface ClientConfig {
  id: string;
  firmName: string;
  shortName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  email: string;
  website: string;
  ctaText: string;
  ctaUrl: string;
  city: string;
  state: string;
  tagline: string;
  attorneyDisclaimer: string;
  /** Optional eyebrow above the hero H1 (e.g. "Free educational estimate") */
  heroEyebrow?: string;
  /** Optional trust strip stats shown under hero / above calculator */
  trustStats?: TrustStat[];
  /** Optional short testimonials — only include real quotes for live clients */
  testimonials?: Testimonial[];
  /** Optional firm overrides for multiplier bands and levers */
  multipliers?: FirmMultipliers;
}

export interface CalculatorInputs {
  medicalBillsPast: number;
  medicalBillsFuture: number;
  lostWages: number;
  otherOutOfPocket: number;
  propertyDamage: number;
  severity: Severity;
  treatmentMonths: number;
  careType: CareType;
  liabilityClarity: LiabilityClarity;
  usState: string;
  /** 0–100 plaintiff fault share (educational) */
  plaintiffFaultPercent: number;
  /** Optional BI per-person policy limit */
  policyLimitPerPerson?: number | null;
  /** Optional BI per-accident limit (display note; not used to cap) */
  policyLimitPerAccident?: number | null;
  /** demand = specials×mult+property; adjuster = med×mult+wages+other+property */
  formulaMode?: FormulaMode;
  treatmentGap?: TreatmentGap;
  permanency?: Permanency;
  offerReceived?: number | null;
}

export interface MultiplierLever {
  id: string;
  label: string;
  detail: string;
  adjustment: number;
}

export interface SettlementRange {
  /** Pre-fault low / mid / high */
  low: number;
  mid: number;
  high: number;
  /** Post-comparative-fault recoverable range */
  recoverableLow: number;
  recoverableMid: number;
  recoverableHigh: number;
  recoveryBarred: boolean;
  faultPercentApplied: number;
  /** Per-person capped post-fault range (null when no limit set) */
  cappedLow: number | null;
  cappedMid: number | null;
  cappedHigh: number | null;
  policyLimitPerPerson: number | null;
  policyLimitPerAccident: number | null;
  policyLimitsMayBind: boolean;
  formulaMode: FormulaMode;
  economicBase: number;
  specialsForPain: number;
  /** Amount actually multiplied under the active formula */
  multipliedBase: number;
  propertyDamage: number;
  medicalTotal: number;
  lostWages: number;
  otherOutOfPocket: number;
  baseMultiplier: { low: number; mid: number; high: number };
  levers: MultiplierLever[];
  totalAdjustment: number;
  multiplierLow: number;
  multiplierMid: number;
  multiplierHigh: number;
  comparativeFaultNote: string;
  comparativeFaultCategory:
    | "pure-comparative"
    | "modified-50"
    | "modified-51"
    | "contributory"
    | "unknown";
}

export interface OfferRealityCheck {
  offer: number;
  midEstimate: number;
  percentOfMid: number;
  /** 0–100 clamped for gauge fill (can exceed 100 for display cap) */
  gaugePercent: number;
  gap: number;
  label: "well-below" | "below" | "near" | "above";
  summary: string;
  cappedMidEstimate?: number | null;
}

/** Signature moment backends — wire only when Design approves an asset/path */
export type SignatureMomentKind = "none" | "css" | "lottie" | "r3f";
