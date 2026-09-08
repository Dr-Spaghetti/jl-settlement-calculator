/** Mirror scenarios. Prefer scripts/verify-calculator.mjs */
import assert from "node:assert/strict";
import { applyComparativeFault, calculateSettlement } from "./calculator";
function roundMoney(n: number) { return Math.round(n / 100) * 100; }
const base = { medicalBillsPast: 12000, medicalBillsFuture: 3000, lostWages: 4500, otherOutOfPocket: 800, propertyDamage: 6500, severity: "moderate" as const, treatmentMonths: 4, careType: "md" as const, liabilityClarity: "clear" as const, usState: "AZ", plaintiffFaultPercent: 0, treatmentGap: "none" as const, permanency: "none" as const, formulaMode: "demand" as const };
export function runCalculatorTests(): void {
  const pre = calculateSettlement({ ...base, usState: "AZ", plaintiffFaultPercent: 0 });
  const post = calculateSettlement({ ...base, usState: "AZ", plaintiffFaultPercent: 20 });
  assert.equal(post.recoverableMid, roundMoney(pre.mid * 0.8));
  const nc = calculateSettlement({ ...base, usState: "NC", plaintiffFaultPercent: 1 });
  assert.equal(nc.recoverableMid, 0);
  const barred = calculateSettlement({ ...base, usState: "TX", plaintiffFaultPercent: 51 });
  const recovers = calculateSettlement({ ...base, usState: "TX", plaintiffFaultPercent: 50 });
  assert.equal(barred.recoverableMid, 0);
  assert.ok(recovers.recoverableMid > 0);
  const preTx = calculateSettlement({ ...base, usState: "TX", plaintiffFaultPercent: 0 });
  assert.equal(recovers.recoverableMid, roundMoney(preTx.mid * 0.5));
  const demand = calculateSettlement({ ...base, formulaMode: "demand" });
  const adjuster = calculateSettlement({ ...base, formulaMode: "adjuster" });
  assert.notEqual(demand.mid, adjuster.mid);
  const uncapped = calculateSettlement({ ...base });
  const limit = Math.max(1000, roundMoney(uncapped.recoverableMid / 2));
  const capped = calculateSettlement({ ...base, policyLimitPerPerson: limit });
  assert.equal(capped.cappedMid, limit);
  assert.equal(capped.policyLimitsMayBind, true);
  assert.equal(applyComparativeFault(10000, 25, "pure-comparative").recoverable, 7500);
}
