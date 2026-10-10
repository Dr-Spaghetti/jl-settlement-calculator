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
    minimum: 5000, cite: "75 Pa.C.S. § 1711(a) (most car policies; excludes motorcycles); benefits paid or payable not recoverable, § 1722 (incl. § 1719 health-insurance benefits)",
    source: "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=75&div=0&chpt=17", verifiedOn: "2026-10-09",
  },
  fault: {
    rule: "modified comparative: barred when plaintiff's negligence is greater than the defendants' combined (51%+)",
    cite: "42 Pa.C.S. § 7102", source: "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=42&div=0&chpt=71", verifiedOn: "2026-10-09",
  },
  tortOption: {
    cite: "75 Pa.C.S. § 1705(a)(3), (b)(3), (c), (d); serious injury defined in § 1702",
    source: "https://www.palegis.us/statutes/consolidated/view-statute?txtType=PDF&ttl=75&div=00.&chpt=17",
    verifiedOn: "2026-10-09 (official PA General Assembly PDF, quoted in AUDIT-2026-10-09.md rows 11-16)",
  },
  sol: {
    years: 2, cite: "42 Pa.C.S. § 5524(2) (runs from accrual, § 5502(a); government notice 6 months, § 5522(a))",
    source: "https://www.palegis.us/statutes/consolidated/view-statute?txtType=PDF&ttl=42&div=00.&chpt=55",
    verifiedOn: "2026-10-09 (official PA General Assembly PDF, quoted in AUDIT-2026-10-09.md rows 18-19)",
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
  /**
   * Tort option "Not sure": both scenarios, shown with equal weight (audit row 16).
   * PA presumes full tort when no election was made (§ 1705(a)(3)); people with no PA auto policy are not limited (§ 1705(b)(3)).
   */
  tortUnsure: { full: Range; limited: Range } | null;
}

function fault(r: Range, f: number): { r: Range; barred: boolean } {
  const lo = applyModifiedFault50(r.low, f);
  return {
    r: { low: roundMoney(lo.recoverable), mid: roundMoney(applyModifiedFault50(r.mid, f).recoverable), high: roundMoney(applyModifiedFault50(r.high, f).recoverable) },
    barred: lo.barred,
  };
}

/** Practical collection estimate (not a legal cap): limit the shown range to the entered per-person limit. */
function capR(r: Range, lim: number | null): Range {
  if (lim == null || !Number.isFinite(lim) || lim <= 0) return r;
  return { low: Math.min(r.low, lim), mid: Math.min(r.mid, lim), high: Math.min(r.high, lim) };
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
    tortUnsure: i.tortOption === "unsure" ? { full: capR(fault(withNE, f).r, lim), limited: capR(fault(econOnly, f).r, lim) } : null,
  };
}
