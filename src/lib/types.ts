export type Severity = "minor" | "moderate" | "severe" | "catastrophic";
export type CareType = "chiro" | "md" | "surgery";
export type LiabilityClarity = "clear" | "mixed" | "disputed";

export interface TrustStat {
  value: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  detail?: string;
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
  /** Optional short testimonials for conversion */
  testimonials?: Testimonial[];
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
  offerReceived?: number | null;
}

export interface MultiplierLever {
  id: string;
  label: string;
  detail: string;
  adjustment: number;
}

export interface SettlementRange {
  low: number;
  mid: number;
  high: number;
  economicBase: number;
  specialsForPain: number;
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
}

/** Signature moment backends — wire only when Design approves an asset/path */
export type SignatureMomentKind = "none" | "css" | "lottie" | "r3f";
