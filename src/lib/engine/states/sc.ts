import { grossRange, multipliers, applyModifiedFault50, roundMoney, type CoreInputs } from "../core";

/** South Carolina module. Values quoted in /workspace/calculators/out/leekelaw-sc/AUDIT-leekelaw-sc.md. */
export const SC_LAW = {
  minLiability: {
    perPerson: 25000, perAccident: 50000, propertyDamage: 25000,
    cite: "S.C. Code § 38-77-140(A)", source: "https://www.scstatehouse.gov/code/t38c077.php", verifiedOn: "2026-10-09",
  },
  uninsuredMotorist: {
    perPerson: 25000, perAccident: 50000, propertyDamage: 25000,
    cite: "S.C. Code § 38-77-150(A) (UM required at § 38-77-140 limits); § 38-77-160 (UIM must be offered)",
    source: "https://www.scstatehouse.gov/code/t38c077.php", verifiedOn: "2026-10-09",
  },
  noPip: { cite: "S.C. Code § 38-77-144 (no PIP mandated; med-pay not subject to setoff)", source: "https://www.scstatehouse.gov/code/t38c077.php", verifiedOn: "2026-10-09" },
  fault: {
    rule: "modified comparative negligence: recover if plaintiff's negligence is not greater than the defendants' combined; reduced in proportion",
    cite: "Nelson v. Concrete Supply Co., 303 S.C. 243, 399 S.E.2d 783 (1991) (causes of action arising on or after July 1, 1991)",
    source: "https://law.justia.com/cases/south-carolina/supreme-court/1991/23303-2.html", verifiedOn: "2026-10-09",
  },
  sol: {
    years: 3, cite: "S.C. Code § 15-3-530(5); § 15-3-535 (knew or should have known); S.C. Tort Claims Act § 15-78-110",
    source: "https://www.scstatehouse.gov/code/t15c003.php", verifiedOn: "2026-10-09",
  },
} as const;

export type InsuredStatus = "insured" | "uninsured" | "unsure";
export interface ScInputs extends CoreInputs {
  plaintiffFaultPercent: number;
  policyLimitPerPerson: number | null;
  otherDriverInsured: InsuredStatus;
}
export interface Range { low: number; mid: number; high: number }
export interface ScResult {
  m: ReturnType<typeof multipliers>;
  economic: number; nonEconomic: Range; preFault: Range; recoverable: Range; barred: boolean; faultPercent: number;
  capped: Range | null; policyLimitsMayBind: boolean;
}

export function calculateSC(i: ScInputs): ScResult {
  const g = grossRange(i);
  const med = Math.max(0, i.medicalBills);
  // No PIP in SC and med-pay "is not subject to a setoff" (§ 38-77-144): nothing is subtracted.
  const economic = med + Math.max(0, i.lostWages) + Math.max(0, i.otherOutOfPocket) + Math.max(0, i.propertyDamage);
  const ne: Range = { low: med * (g.m.low - 1), mid: med * (g.m.mid - 1), high: med * (g.m.high - 1) };
  const pre: Range = { low: economic + ne.low, mid: economic + ne.mid, high: economic + ne.high };
  const f = Math.max(0, Math.min(100, i.plaintiffFaultPercent));
  const rec: Range = { low: roundMoney(applyModifiedFault50(pre.low, f).recoverable), mid: roundMoney(applyModifiedFault50(pre.mid, f).recoverable), high: roundMoney(applyModifiedFault50(pre.high, f).recoverable) };
  const lim = i.policyLimitPerPerson;
  let capped: Range | null = null; let policyLimitsMayBind = false;
  if (lim != null && Number.isFinite(lim) && lim >= 0) { capped = { low: Math.min(rec.low, lim), mid: Math.min(rec.mid, lim), high: Math.min(rec.high, lim) }; policyLimitsMayBind = rec.high > lim; }
  return {
    m: g.m, economic: roundMoney(economic),
    nonEconomic: { low: roundMoney(ne.low), mid: roundMoney(ne.mid), high: roundMoney(ne.high) },
    preFault: { low: roundMoney(pre.low), mid: roundMoney(pre.mid), high: roundMoney(pre.high) },
    recoverable: rec, barred: applyModifiedFault50(pre.low, f).barred, faultPercent: f, capped, policyLimitsMayBind,
  };
}
