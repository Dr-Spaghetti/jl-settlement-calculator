export type Severity = "minor" | "moderate" | "severe" | "catastrophic";
export type CareType = "chiro" | "md" | "surgery";
export type LiabilityClarity = "clear" | "mixed" | "disputed";

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

export interface SettlementRange {
  low: number;
  mid: number;
  high: number;
  economicBase: number;
  multiplierLow: number;
  multiplierMid: number;
  multiplierHigh: number;
  comparativeFaultNote: string;
  comparativeFaultCategory: "pure-comparative" | "modified-50" | "modified-51" | "contributory" | "unknown";
}

export interface OfferRealityCheck {
  offer: number;
  midEstimate: number;
  percentOfMid: number;
  gap: number;
  label: "well-below" | "below" | "near" | "above";
  summary: string;
}
