import { liabilityOption, type LiabilityId } from "./liability";

export type Severity = "minor" | "moderate" | "severe" | "catastrophic";
export type CareType = "chiro" | "md" | "surgery";
export type TreatmentGap = "none" | "short" | "long";
export type Permanency = "none" | "possible" | "rated";

export const SEVERITY_BANDS: Record<Severity, { low: number; mid: number; high: number }> = {
  minor: { low: 1.5, mid: 2.0, high: 2.5 },
  moderate: { low: 2.0, mid: 2.75, high: 3.5 },
  severe: { low: 3.0, mid: 3.75, high: 4.5 },
  catastrophic: { low: 4.0, mid: 5.0, high: 6.0 },
};
export const CARE_COEF: Record<CareType, number> = { chiro: -0.15, md: 0.1, surgery: 0.45 };
export const GAP_COEF: Record<TreatmentGap, number> = { none: 0, short: -0.2, long: -0.45 };
export const PERM_COEF: Record<Permanency, number> = { none: 0, possible: 0.25, rated: 0.55 };
export const CLAMP_MIN = 1.25;
export const CLAMP_MAX = 7;

export function treatmentCoef(months: number): number {
  const m = Math.max(0, months);
  if (m <= 1) return -0.15;
  if (m <= 3) return 0;
  if (m <= 6) return 0.15;
  if (m <= 12) return 0.3;
  return 0.45;
}
export const roundMoney = (n: number) => Math.round(n / 100) * 100;
const clamp = (n: number) => Math.max(CLAMP_MIN, Math.min(CLAMP_MAX, n));

export interface CoreInputs {
  medicalBills: number;
  lostWages: number;
  otherOutOfPocket: number;
  propertyDamage: number;
  severity: Severity;
  careType: CareType;
  treatmentMonths: number;
  treatmentGap: TreatmentGap;
  permanency: Permanency;
  liability: LiabilityId;
}

export interface Multipliers { low: number; mid: number; high: number; adjustment: number }

export function multipliers(i: CoreInputs): Multipliers {
  const base = SEVERITY_BANDS[i.severity];
  const adjustment =
    CARE_COEF[i.careType] + treatmentCoef(i.treatmentMonths) + GAP_COEF[i.treatmentGap] +
    PERM_COEF[i.permanency] + liabilityOption(i.liability).coef;
  const r = (n: number) => Math.round(clamp(n) * 100) / 100;
  return { low: r(base.low + adjustment), mid: r(base.mid + adjustment), high: r(base.high + adjustment), adjustment: Math.round(adjustment * 100) / 100 };
}

/**
 * Conservative (adjuster-style) formula — the only formula offered.
 * Medical bills × multiplier (pain & suffering on medical only), then economic
 * losses (wages, out-of-pocket, property) added ONCE, never multiplied.
 */
export function grossRange(i: CoreInputs) {
  const m = multipliers(i);
  const med = Math.max(0, i.medicalBills);
  const econ = Math.max(0, i.lostWages) + Math.max(0, i.otherOutOfPocket) + Math.max(0, i.propertyDamage);
  const at = (mult: number) => med * mult + econ;
  return { m, low: at(m.low), mid: at(m.mid), high: at(m.high) };
}

/** Modified comparative fault, barred when plaintiff fault is GREATER THAN 50%. */
export function applyModifiedFault50(amount: number, faultPercent: number) {
  const f = Math.max(0, Math.min(100, faultPercent));
  if (f > 50) return { recoverable: 0, barred: true };
  return { recoverable: Math.max(0, amount) * (1 - f / 100), barred: false };
}
