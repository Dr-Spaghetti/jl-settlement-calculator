import { grossRange, multipliers, applyModifiedFault50, roundMoney, type CoreInputs } from "../core";

/**
 * Florida module. Every value carries its official source + verification date
 * (quoted in /workspace/calculators/out/nordenleacox-fl/AUDIT-nordenleacox-fl.md).
 */
const FS = (path: string) => `http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=${path}`;
export const FL_LAW = {
  pip: {
    limit: 10000, medicalPct: 0.8, disabilityPct: 0.6, nonEmcMedicalCap: 2500, initialCareDays: 14, deathBenefit: 5000,
    cite: "Fla. Stat. § 627.736(1)(a)-(b), (3)", source: FS("0600-0699/0627/Sections/0627.736.html"), verifiedOn: "2026-10-09",
  },
  threshold: { cite: "Fla. Stat. § 627.737(2)", source: FS("0600-0699/0627/Sections/0627.737.html"), verifiedOn: "2026-10-09" },
  propertyDamageLiability: { amount: 10000, cite: "Fla. Stat. § 324.022(1)", source: FS("0300-0399/0324/Sections/0324.022.html"), verifiedOn: "2026-10-09" },
  fault: {
    rule: "comparative fault; a party greater than 50 percent at fault for his or her own harm may not recover (negligence actions; not ch. 766 medical negligence)",
    cite: "Fla. Stat. § 768.81(2), (6); ch. 2023-15, § 30, Laws of Fla. (actions filed after Mar. 24, 2023)",
    source: FS("0700-0799/0768/Sections/0768.81.html"), verifiedOn: "2026-10-09",
  },
  sol: {
    years: 2, cite: "Fla. Stat. § 95.11(5)(a); ch. 2023-15, § 28, Laws of Fla. (causes of action accruing after Mar. 24, 2023)",
    source: FS("0000-0099/0095/Sections/0095.11.html"), verifiedOn: "2026-10-09",
  },
} as const;

export type YesNoUnsure = "yes" | "no" | "unsure";
/** Visitor's own PIP: "emc" = $10,000 limit (emergency medical condition determined); "noEmc" = medical capped at $2,500; "none" = no PIP. */
export type PipStatus = "emc" | "noEmc" | "none";

export interface FlInputs extends CoreInputs {
  /** § 627.737(2) threshold (permanent injury, significant scarring, etc.) */
  permanentInjury: YesNoUnsure;
  pip: PipStatus;
  plaintiffFaultPercent: number;
  policyLimitPerPerson: number | null;
}
export interface Range { low: number; mid: number; high: number }
export interface FlResult {
  m: ReturnType<typeof multipliers>;
  pipMedical: number; pipDisability: number; pipOffset: number;
  economic: number;
  nonEconomicAllowed: boolean;
  nonEconomic: Range;
  preFault: Range;
  recoverable: Range;
  barred: boolean;
  faultPercent: number;
  capped: Range | null;
  policyLimitsMayBind: boolean;
  ifNonEconomicAvailable: Range | null;
  /** "Not sure" on the § 627.737(2) threshold: both scenarios, equal weight (PA 'Not sure' pattern). */
  thresholdUnsure: { met: Range; notMet: Range } | null;
}

/**
 * PIP paid or payable (estimate of the § 627.736(3) offset):
 * medical = 80% of medical bills, capped at $2,500 when no emergency medical condition;
 * disability = 60% of lost income; combined limit $10,000 (§ 627.736(1)).
 */
export function pipBenefits(medical: number, wages: number, pip: PipStatus) {
  if (pip === "none") return { pipMedical: 0, pipDisability: 0, pipOffset: 0 };
  const L = FL_LAW.pip;
  let pipMedical = Math.max(0, medical) * L.medicalPct;
  if (pip === "noEmc") pipMedical = Math.min(pipMedical, L.nonEmcMedicalCap);
  pipMedical = Math.min(pipMedical, L.limit);
  const pipDisability = Math.min(Math.max(0, wages) * L.disabilityPct, L.limit - pipMedical);
  return { pipMedical, pipDisability, pipOffset: pipMedical + pipDisability };
}

const fault = (r: Range, f: number) => ({
  r: { low: roundMoney(applyModifiedFault50(r.low, f).recoverable), mid: roundMoney(applyModifiedFault50(r.mid, f).recoverable), high: roundMoney(applyModifiedFault50(r.high, f).recoverable) },
  barred: applyModifiedFault50(r.low, f).barred,
});
const capR = (r: Range, lim: number | null): Range =>
  lim == null || !Number.isFinite(lim) || lim < 0 ? r : { low: Math.min(r.low, lim), mid: Math.min(r.mid, lim), high: Math.min(r.high, lim) };

export function calculateFL(i: FlInputs): FlResult {
  const g = grossRange(i);
  const med = Math.max(0, i.medicalBills);
  const wages = Math.max(0, i.lostWages);
  const p = pipBenefits(med, wages, i.pip);
  const economic = med + wages + Math.max(0, i.otherOutOfPocket) + Math.max(0, i.propertyDamage) - p.pipOffset;
  const nonEcon: Range = { low: med * (g.m.low - 1), mid: med * (g.m.mid - 1), high: med * (g.m.high - 1) };
  const nonEconomicAllowed = i.permanentInjury === "yes";
  const withNE: Range = { low: economic + nonEcon.low, mid: economic + nonEcon.mid, high: economic + nonEcon.high };
  const econOnly: Range = { low: economic, mid: economic, high: economic };
  const pre = nonEconomicAllowed ? withNE : econOnly;
  const f = Math.max(0, Math.min(100, i.plaintiffFaultPercent));
  const rec = fault(pre, f);
  const lim = i.policyLimitPerPerson;
  let capped: Range | null = null; let policyLimitsMayBind = false;
  if (lim != null && Number.isFinite(lim) && lim >= 0) { capped = capR(rec.r, lim); policyLimitsMayBind = rec.r.high > lim; }
  return {
    m: g.m, ...p, economic: roundMoney(economic), nonEconomicAllowed,
    nonEconomic: nonEconomicAllowed ? { low: roundMoney(nonEcon.low), mid: roundMoney(nonEcon.mid), high: roundMoney(nonEcon.high) } : { low: 0, mid: 0, high: 0 },
    preFault: { low: roundMoney(pre.low), mid: roundMoney(pre.mid), high: roundMoney(pre.high) },
    recoverable: rec.r, barred: rec.barred, faultPercent: f, capped, policyLimitsMayBind,
    ifNonEconomicAvailable: nonEconomicAllowed ? null : fault(withNE, f).r,
    thresholdUnsure: i.permanentInjury === "unsure" ? { met: capR(fault(withNE, f).r, lim), notMet: capR(fault(econOnly, f).r, lim) } : null,
  };
}
