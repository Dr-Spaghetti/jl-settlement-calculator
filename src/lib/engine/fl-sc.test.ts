/**
 * Known-answer tests for FL and SC. Every expected number was worked out BY HAND
 * (arithmetic in comments), not produced by running the code.
 * Shared core inputs → multipliers low 2.25 / mid 3.00 / high 3.75
 * (moderate 2.0/2.75/3.5 + md .10 + 4 months .15 + no gap 0 + no perm 0 = +0.25; no liability term)
 * → P&S on $10,000 medical = 12,500 / 20,000 / 27,500.
 */
import test from "node:test";
import assert from "node:assert/strict";
import type { CoreInputs } from "./core";
import { calculateFL, pipBenefits, FL_LAW, type FlInputs } from "./states/fl";
import { calculateSC, SC_LAW, type ScInputs } from "./states/sc";

const core: CoreInputs = {
  medicalBills: 10000, lostWages: 2000, otherOutOfPocket: 500, propertyDamage: 3000,
  severity: "moderate", careType: "md", treatmentMonths: 4, treatmentGap: "none", permanency: "none",
};
const fl: FlInputs = { ...core, permanentInjury: "yes", pip: "emc", plaintiffFaultPercent: 0, policyLimitPerPerson: null };
const sc: ScInputs = { ...core, plaintiffFaultPercent: 0, policyLimitPerPerson: null, otherDriverInsured: "insured" };

// ---------- Florida ----------
test("FL law values (Fla. Stat. § 627.736(1); § 324.022; § 95.11(5)(a))", () => {
  assert.equal(FL_LAW.pip.limit, 10000);
  assert.equal(FL_LAW.pip.medicalPct, 0.8);
  assert.equal(FL_LAW.pip.disabilityPct, 0.6);
  assert.equal(FL_LAW.pip.nonEmcMedicalCap, 2500);
  assert.equal(FL_LAW.pip.initialCareDays, 14);
  assert.equal(FL_LAW.propertyDamageLiability.amount, 10000);
  assert.equal(FL_LAW.sol.years, 2);
});

test("FL PIP: EMC → 80% med 8,000 + 60% wages 1,200 = 9,200", () => {
  assert.deepEqual(pipBenefits(10000, 2000, "emc"), { pipMedical: 8000, pipDisability: 1200, pipOffset: 9200 });
});
test("FL PIP: no EMC → medical capped 2,500 + 1,200 = 3,700", () => {
  assert.deepEqual(pipBenefits(10000, 2000, "noEmc"), { pipMedical: 2500, pipDisability: 1200, pipOffset: 3700 });
});
test("FL PIP: combined $10,000 limit — med 2,000 → 1,600; wages 20,000 → 60% = 12,000 but only 8,400 left", () => {
  assert.deepEqual(pipBenefits(2000, 20000, "emc"), { pipMedical: 1600, pipDisability: 8400, pipOffset: 10000 });
});
test("FL PIP: none → 0", () => assert.equal(pipBenefits(10000, 2000, "none").pipOffset, 0));

test("FL threshold met: economic 15,500 − 9,200 = 6,300; + P&S 12,500/20,000/27,500 → 18,800/26,300/33,800", () => {
  const r = calculateFL(fl);
  assert.equal(r.economic, 6300);
  assert.deepEqual(r.nonEconomic, { low: 12500, mid: 20000, high: 27500 });
  assert.deepEqual(r.recoverable, { low: 18800, mid: 26300, high: 33800 });
  assert.equal(r.thresholdUnsure, null);
});
test("FL threshold NOT met: economic only 6,300; 'if met' line 18,800–33,800", () => {
  const r = calculateFL({ ...fl, permanentInjury: "no" });
  assert.deepEqual(r.recoverable, { low: 6300, mid: 6300, high: 6300 });
  assert.deepEqual(r.ifNonEconomicAvailable, { low: 18800, mid: 26300, high: 33800 });
});
test("FL threshold NOT SURE: both scenarios (PA 'Not sure' pattern)", () => {
  const r = calculateFL({ ...fl, permanentInjury: "unsure" });
  assert.deepEqual(r.thresholdUnsure, { met: { low: 18800, mid: 26300, high: 33800 }, notMet: { low: 6300, mid: 6300, high: 6300 } });
});
test("FL no EMC: economic 15,500 − 3,700 = 11,800 → 24,300/31,800/39,300", () => {
  assert.deepEqual(calculateFL({ ...fl, pip: "noEmc" }).recoverable, { low: 24300, mid: 31800, high: 39300 });
});
test("FL no PIP: economic 15,500 → 28,000/35,500/43,000", () => {
  assert.deepEqual(calculateFL({ ...fl, pip: "none" }).recoverable, { low: 28000, mid: 35500, high: 43000 });
});
test("FL § 768.81(6): exactly 50% still recovers (×0.5: 9,400; 13,150→13,200; 16,900)", () => {
  const r = calculateFL({ ...fl, plaintiffFaultPercent: 50 });
  assert.equal(r.barred, false);
  assert.deepEqual(r.recoverable, { low: 9400, mid: 13200, high: 16900 });
});
test("FL § 768.81(6): 51% ('greater than 50 percent') is barred", () => {
  const r = calculateFL({ ...fl, plaintiffFaultPercent: 51 });
  assert.equal(r.barred, true);
  assert.deepEqual(r.recoverable, { low: 0, mid: 0, high: 0 });
});
test("FL policy limit: med 50,000, wages 20,000 → PIP 10,000; economic 60,000; mid 60,000+100,000 = 160,000 → shown 25,000", () => {
  const r = calculateFL({ ...fl, medicalBills: 50000, lostWages: 20000, otherOutOfPocket: 0, propertyDamage: 0, policyLimitPerPerson: 25000 });
  assert.equal(r.pipOffset, 10000);
  assert.equal(r.economic, 60000);
  assert.equal(r.recoverable.mid, 160000);
  assert.deepEqual(r.capped, { low: 25000, mid: 25000, high: 25000 });
  assert.equal(r.policyLimitsMayBind, true);
});

// ---------- South Carolina ----------
test("SC law values (§ 38-77-140; § 38-77-150; § 15-3-530(5))", () => {
  assert.deepEqual([SC_LAW.minLiability.perPerson, SC_LAW.minLiability.perAccident, SC_LAW.minLiability.propertyDamage], [25000, 50000, 25000]);
  assert.deepEqual([SC_LAW.uninsuredMotorist.perPerson, SC_LAW.uninsuredMotorist.perAccident, SC_LAW.uninsuredMotorist.propertyDamage], [25000, 50000, 25000]);
  assert.equal(SC_LAW.sol.years, 3);
});
test("SC: no PIP/med-pay setoff → 15,500 + 12,500/20,000/27,500 = 28,000/35,500/43,000", () => {
  const r = calculateSC(sc);
  assert.equal(r.economic, 15500);
  assert.deepEqual(r.recoverable, { low: 28000, mid: 35500, high: 43000 });
});
test("SC: 20% fault → ×0.8 = 22,400/28,400/34,400", () => {
  assert.deepEqual(calculateSC({ ...sc, plaintiffFaultPercent: 20 }).recoverable, { low: 22400, mid: 28400, high: 34400 });
});
test("SC Nelson: 50% ('not greater than') recovers ×0.5 → 14,000; 17,750→17,800; 21,500", () => {
  const r = calculateSC({ ...sc, plaintiffFaultPercent: 50 });
  assert.equal(r.barred, false);
  assert.deepEqual(r.recoverable, { low: 14000, mid: 17800, high: 21500 });
});
test("SC Nelson: 51% is barred", () => {
  const r = calculateSC({ ...sc, plaintiffFaultPercent: 51 });
  assert.equal(r.barred, true);
  assert.deepEqual(r.recoverable, { low: 0, mid: 0, high: 0 });
});
test("SC $25,000 minimum limit binds: 25,000 across", () => {
  const r = calculateSC({ ...sc, policyLimitPerPerson: 25000 });
  assert.deepEqual(r.capped, { low: 25000, mid: 25000, high: 25000 });
  assert.equal(r.policyLimitsMayBind, true);
});
test("SC: insured/uninsured/unsure never changes the math (informational only)", () => {
  const a = calculateSC(sc), b = calculateSC({ ...sc, otherDriverInsured: "uninsured" }), c = calculateSC({ ...sc, otherDriverInsured: "unsure" });
  assert.deepEqual(a, b); assert.deepEqual(a, c);
});

// ---- Breakdown base / clamp. Hand-worked (no liability term). ----
import { multipliers } from "./core";
test("clamp floor: minor 1.5/2.0/2.5 + chiro −.15 + ≤1 mo −.15 + long gap −.45 = −0.75 → 0.75/1.25/1.75 → 1.25/1.25/1.75; real base 2.00", () => {
  const m = multipliers({ ...core, severity: "minor", careType: "chiro", treatmentMonths: 1, treatmentGap: "long" });
  assert.equal(m.adjustment, -0.75);
  assert.deepEqual([m.low, m.mid, m.high, m.baseMid, m.clamped], [1.25, 1.25, 1.75, 2.0, true]);
});
test("no clamp on defaults: moderate 2.0/2.75/3.5 + .25 → 2.25/3.00/3.75, baseMid 2.75, clamped false", () => {
  const m = multipliers(core);
  assert.deepEqual([m.low, m.mid, m.high, m.baseMid, m.clamped], [2.25, 3, 3.75, 2.75, false]);
});
test("clamp ceiling: catastrophic 4/5/6 + surgery .45 + 13 mo .45 + rated .55 = +1.45 → 5.45/6.45/7.45→7.00; clamped", () => {
  const m = multipliers({ ...core, severity: "catastrophic", careType: "surgery", treatmentMonths: 13, permanency: "rated" });
  assert.deepEqual([m.low, m.mid, m.high, m.baseMid, m.clamped], [5.45, 6.45, 7, 5.0, true]);
});
test("SC with floor: econ 15,500 + 10,000 × 0.25/0.25/0.75 = 2,500/2,500/7,500 → 18,000/18,000/23,000", () => {
  const r = calculateSC({ ...sc, severity: "minor", careType: "chiro", treatmentMonths: 1, treatmentGap: "long" });
  assert.deepEqual(r.recoverable, { low: 18000, mid: 18000, high: 23000 });
});

// ---- Fault applied once (Nick's ruling): result = gross × (1 − f); $0 above 50%. No liability input exists. ----
const k = (n: number, f: number) => (f > 50 ? 0 : Math.round((n * (1 - f / 100)) / 100) * 100);
test("FL § 768.81(2),(6): $100,000 gross → 20% = $80,000; 50% = $50,000; 51% = $0; every f 0–100 = gross × (1 − f)", () => {
  // no PIP, threshold met: med 10,000 + wages 70,000 = econ 80,000; P&S 10,000 × (3.00 − 1) = 20,000 → 100,000
  const i: FlInputs = { ...fl, pip: "none", lostWages: 70000, otherOutOfPocket: 0, propertyDamage: 0 };
  assert.equal(calculateFL(i).recoverable.mid, 100000);
  assert.equal(calculateFL({ ...i, plaintiffFaultPercent: 20 }).recoverable.mid, 80000);
  assert.equal(calculateFL({ ...i, plaintiffFaultPercent: 50 }).recoverable.mid, 50000);
  assert.equal(calculateFL({ ...i, plaintiffFaultPercent: 51 }).recoverable.mid, 0);
  assert.ok(!("liability" in fl));
  const g = calculateFL(fl).recoverable;
  for (let f = 0; f <= 100; f++) assert.deepEqual(calculateFL({ ...fl, plaintiffFaultPercent: f }).recoverable, { low: k(g.low, f), mid: k(g.mid, f), high: k(g.high, f) }, `FL ${f}%`);
});
test("SC Nelson: $100,000 gross → 20% = $80,000; 50% = $50,000; 51% = $0; every f 0–100 = gross × (1 − f)", () => {
  const i: ScInputs = { ...sc, lostWages: 70000, otherOutOfPocket: 0, propertyDamage: 0 };
  assert.equal(calculateSC(i).recoverable.mid, 100000);
  assert.equal(calculateSC({ ...i, plaintiffFaultPercent: 20 }).recoverable.mid, 80000);
  assert.equal(calculateSC({ ...i, plaintiffFaultPercent: 50 }).recoverable.mid, 50000);
  assert.equal(calculateSC({ ...i, plaintiffFaultPercent: 51 }).recoverable.mid, 0);
  const g = calculateSC(sc).recoverable;
  for (let f = 0; f <= 100; f++) assert.deepEqual(calculateSC({ ...sc, plaintiffFaultPercent: f }).recoverable, { low: k(g.low, f), mid: k(g.mid, f), high: k(g.high, f) }, `SC ${f}%`);
});
