import { grossRange, multipliers, applyModifiedFault50, roundMoney, type CoreInputs } from "../core";

/**
 * Pennsylvania module. Every value carries its source and verification date.
 * Values from /workspace/calculators/_STATE-LAW-REFERENCE.md + _VERIFICATION-2026-10-09.md.
 */
export const PA_LAW = {
  minLiability: {
    perPerson: 15000, perAccident: 30000, propertyDamage: 5000,
    cite: "75 Pa.C.S. § 1702", source: "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=75&div=0&chpt=17", verifiedOn: "2026-10-09",
  },
  firstPartyMedical: {
    minimum: 5000, cite: "75 Pa.C.S. § 1711 (paid first; not recoverable from the at-fault driver, § 1722)",
    source: "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=75&div=0&chpt=17", verifiedOn: "2026-10-09",
  },
  fault: {
    rule: "modified comparative: barred when plaintiff's negligence is greater than the defendants' combined (51%+)",
    cite: "42 Pa.C.S. § 7102", source: "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=42&div=0&chpt=71", verifiedOn: "2026-10-09",
  },
  tortOption: {
    cite: "75 Pa.C.S. § 1705", source: "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=75&div=0&chpt=17",
    verifiedOn: "cited only — not yet opened (see _VERIFICATION-2026-10-09.md)",
  },
  sol: {
    years: 2, cite: "42 Pa.C.S. § 5524", source: "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=42&div=0&chpt=55",
    verifiedOn: "cited only — not yet opened (see _VERIFICATION-2026-10-09.md)",
  },
} as const;

export type TortOption = "full" | "limited" | "unsure";
export type YesNoUnsure = "yes" | "no" | "unsure";

export interface PaInputs extends CoreInputs {
  tortOption: TortOption;
  /** Only relevant for limited tort: serious injury or another § 1705 exception. */
  limitedTortException: YesNoUnsure;
  plaintiffFaultPercent: number;
  /** Visitor's own first-party medical benefit; defaults to the § 1711 minimum. */
  firstPartyMedical: number;
  /** null = Unknown (default). */
  policyLimitPerPerson: number | null;
}

export interface Range { low: number; mid: number; high: number }
export interface PaResult {
  m: ReturnType<typeof multipliers>;
  medicalOffset: number;
  economic: number;
  nonEconomicAllowed: boolean;
  nonEconomic: Range;
  preFault: Range;
  recoverable: Range;
  barred: boolean;
  faultPercent: number;
  capped: Range | null;
  policyLimitsMayBind: boolean;
  /** For "limited/unsure", the range IF pain & suffering were available (shown as a secondary line). */
  ifNonEconomicAvailable: Range | null;
}

function fault(r: Range, f: number): { r: Range; barred: boolean } {
  const lo = applyModifiedFault50(r.low, f);
  return {
    r: { low: roundMoney(lo.recoverable), mid: roundMoney(applyModifiedFault50(r.mid, f).recoverable), high: roundMoney(applyModifiedFault50(r.high, f).recoverable) },
    barred: lo.barred,
  };
}

export function calculatePA(i: PaInputs): PaResult {
  const g = grossRange(i);
  const med = Math.max(0, i.medicalBills);
  const medicalOffset = Math.min(med, Math.max(0, i.firstPartyMedical));
  const economic = med - medicalOffset + Math.max(0, i.lostWages) + Math.max(0, i.otherOutOfPocket) + Math.max(0, i.propertyDamage);
  const nonEcon: Range = { low: med * (g.m.low - 1), mid: med * (g.m.mid - 1), high: med * (g.m.high - 1) };
  // Conservative: pain & suffering only when full tort, or limited tort WITH a confirmed exception.
  const nonEconomicAllowed = i.tortOption === "full" || (i.tortOption === "limited" && i.limitedTortException === "yes");
  const withNE: Range = { low: economic + nonEcon.low, mid: economic + nonEcon.mid, high: economic + nonEcon.high };
  const econOnly: Range = { low: economic, mid: economic, high: economic };
  const pre = nonEconomicAllowed ? withNE : econOnly;
  const preFault: Range = { low: roundMoney(pre.low), mid: roundMoney(pre.mid), high: roundMoney(pre.high) };
  const f = Math.max(0, Math.min(100, i.plaintiffFaultPercent));
  const rec = fault(pre, f);
  let capped: Range | null = null;
  let policyLimitsMayBind = false;
  const lim = i.policyLimitPerPerson;
  if (lim != null && Number.isFinite(lim) && lim > 0) {
    capped = { low: Math.min(rec.r.low, lim), mid: Math.min(rec.r.mid, lim), high: Math.min(rec.r.high, lim) };
    policyLimitsMayBind = rec.r.high > lim;
  }
  return {
    m: g.m, medicalOffset, economic: roundMoney(economic), nonEconomicAllowed,
    nonEconomic: nonEconomicAllowed ? { low: roundMoney(nonEcon.low), mid: roundMoney(nonEcon.mid), high: roundMoney(nonEcon.high) } : { low: 0, mid: 0, high: 0 },
    preFault, recoverable: rec.r, barred: rec.barred, faultPercent: f, capped, policyLimitsMayBind,
    ifNonEconomicAvailable: nonEconomicAllowed ? null : fault(withNE, f).r,
  };
}
