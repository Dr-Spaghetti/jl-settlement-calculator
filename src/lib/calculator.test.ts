/** Mirror scenarios. Prefer scripts/verify-calculator.mjs */
import assert from "node:assert/strict";
import { applyComparativeFault, calculateSettlement, LIABILITY_LABELS } from "./calculator";
function roundMoney(n: number) { return Math.round(n / 100) * 100; }
const base = { medicalBillsPast: 12000, medicalBillsFuture: 3000, lostWages: 4500, otherOutOfPocket: 800, propertyDamage: 6500, severity: "moderate" as const, treatmentMonths: 4, careType: "md" as const, liabilityClarity: "clear" as const, usState: "AZ", plaintiffFaultPercent: 0, treatmentGap: "none" as const, permanency: "none" as const, formulaMode: "adjuster" as const };
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
  // Corrected demand no longer multiplies wages/OOP — same structure as adjuster.
  assert.equal(demand.mid, adjuster.mid);
  // High-earner regression: wages must not be multiplied (Ben audit $5k med + $200k wages).
  const highEarner = calculateSettlement({
    ...base,
    medicalBillsPast: 5000,
    medicalBillsFuture: 0,
    lostWages: 200000,
    otherOutOfPocket: 800,
    propertyDamage: 6500,
    formulaMode: "demand",
  });
  // mid mult = clamp(2.75 + 0.1 + 0.25 + 0.15) = 3.25
  // 5000*3.25 + 200000 + 800 + 6500 = 223550 → 223600
  assert.equal(highEarner.mid, 223600);
  assert.equal(highEarner.multiplierMid, 3.25);
  const uncapped = calculateSettlement({ ...base });
  const limit = Math.max(1000, roundMoney(uncapped.recoverableMid / 2));
  const capped = calculateSettlement({ ...base, policyLimitPerPerson: limit });
  assert.equal(capped.cappedMid, limit);
  assert.equal(capped.policyLimitsMayBind, true);
  const noLimit = calculateSettlement({ ...base, policyLimitPerPerson: null });
  assert.equal(noLimit.policyLimitPerPerson, null);
  assert.equal(noLimit.policyLimitsMayBind, false);
  assert.equal(applyComparativeFault(10000, 25, "pure-comparative").recoverable, 7500);
  // SD slight-vs-defendant (educational SDCL 20-9-2 / Wood ~30% bar)
  assert.equal(applyComparativeFault(10000, 10, "slight-vs-defendant").recoverable, 9000);
  assert.equal(applyComparativeFault(10000, 10, "slight-vs-defendant").barred, false);
  assert.equal(applyComparativeFault(10000, 30, "slight-vs-defendant").recoverable, 0);
  assert.equal(applyComparativeFault(10000, 30, "slight-vs-defendant").barred, true);
  const sdOk = calculateSettlement({ ...base, usState: "SD", plaintiffFaultPercent: 10 });
  const sdBar = calculateSettlement({ ...base, usState: "SD", plaintiffFaultPercent: 30 });
  assert.equal(sdOk.comparativeFaultCategory, "slight-vs-defendant");
  assert.ok(sdOk.recoverableMid > 0);
  assert.equal(sdBar.recoverableMid, 0);
  assert.equal(sdBar.recoveryBarred, true);
  // Liability labels align with keys used by UI buttons / breakdown
  assert.equal(LIABILITY_LABELS.mixed.includes("Mixed"), true);
  assert.equal(LIABILITY_LABELS.disputed.includes("Disputed"), true);
  assert.equal(LIABILITY_LABELS.clear.includes("Clear"), true);
}
