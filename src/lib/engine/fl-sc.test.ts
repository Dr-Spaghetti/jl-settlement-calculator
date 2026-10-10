/**
 * Known-answer tests for FL and SC. Every expected number was worked out BY HAND
 * (arithmetic in comments), not produced by running the code.
 * Shared core inputs → multipliers low 2.5 / mid 3.25 / high 4.0
 * (moderate 2.0/2.75/3.5 + md .10 + 4 months .15 + no gap 0 + no perm 0 + clear .25 = +0.50).
 */
import test from "node:test";
import assert from "node:assert/strict";
import type { CoreInputs } from "./core";
import { calculateFL, pipBenefits, FL_LAW, type FlInputs } from "./states/fl";
import { calculateSC, SC_LAW, type ScInputs } from "./states/sc";

const core: CoreInputs = {
  medicalBills: 10000, lostWages: 2000, otherOutOfPocket: 500, propertyDamage: 3000,
  severity: "moderate", careType: "md", treatmentMonths: 4, treatmentGap: "none", permanency: "none", liability: "clear",
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

test("FL threshold met: economic 15,500 − 9,200 = 6,300; + P&S 15,000/22,500/30,000 → 21,300/28,800/36,300", () => {
  const r = calculateFL(fl);
  assert.equal(r.economic, 6300);
  assert.deepEqual(r.nonEconomic, { low: 15000, mid: 22500, high: 30000 });
  assert.deepEqual(r.recoverable, { low: 21300, mid: 28800, high: 36300 });
  assert.equal(r.thresholdUnsure, null);
});
test("FL threshold NOT met: economic only 6,300; 'if met' line 21,300–36,300", () => {
  const r = calculateFL({ ...fl, permanentInjury: "no" });
  assert.deepEqual(r.recoverable, { low: 6300, mid: 6300, high: 6300 });
  assert.deepEqual(r.ifNonEconomicAvailable, { low: 21300, mid: 28800, high: 36300 });
});
test("FL threshold NOT SURE: both scenarios (PA 'Not sure' pattern)", () => {
  const r = calculateFL({ ...fl, permanentInjury: "unsure" });
  assert.deepEqual(r.thresholdUnsure, { met: { low: 21300, mid: 28800, high: 36300 }, notMet: { low: 6300, mid: 6300, high: 6300 } });
});
test("FL no EMC: economic 15,500 − 3,700 = 11,800 → 26,800/34,300/41,800", () => {
  assert.deepEqual(calculateFL({ ...fl, pip: "noEmc" }).recoverable, { low: 26800, mid: 34300, high: 41800 });
});
test("FL no PIP: economic 15,500 → 30,500/38,000/45,500", () => {
  assert.deepEqual(calculateFL({ ...fl, pip: "none" }).recoverable, { low: 30500, mid: 38000, high: 45500 });
});
test("FL § 768.81(6): exactly 50% still recovers (×0.5: 10,650→10,700; 14,400; 18,150→18,200)", () => {
  const r = calculateFL({ ...fl, plaintiffFaultPercent: 50 });
  assert.equal(r.barred, false);
  assert.deepEqual(r.recoverable, { low: 10700, mid: 14400, high: 18200 });
});
test("FL § 768.81(6): 51% ('greater than 50 percent') is barred", () => {
  const r = calculateFL({ ...fl, plaintiffFaultPercent: 51 });
  assert.equal(r.barred, true);
  assert.deepEqual(r.recoverable, { low: 0, mid: 0, high: 0 });
});
test("FL policy limit: med 50,000, wages 20,000 → PIP 10,000; economic 60,000; mid 60,000+112,500 = 172,500 → shown 25,000", () => {
  const r = calculateFL({ ...fl, medicalBills: 50000, lostWages: 20000, otherOutOfPocket: 0, propertyDamage: 0, policyLimitPerPerson: 25000 });
  assert.equal(r.pipOffset, 10000);
  assert.equal(r.economic, 60000);
  assert.equal(r.recoverable.mid, 172500);
  assert.deepEqual(r.capped, { low: 25000, mid: 25000, high: 25000 });
  assert.equal(r.policyLimitsMayBind, true);
});

// ---------- South Carolina ----------
test("SC law values (§ 38-77-140; § 38-77-150; § 15-3-530(5))", () => {
  assert.deepEqual([SC_LAW.minLiability.perPerson, SC_LAW.minLiability.perAccident, SC_LAW.minLiability.propertyDamage], [25000, 50000, 25000]);
  assert.deepEqual([SC_LAW.uninsuredMotorist.perPerson, SC_LAW.uninsuredMotorist.perAccident, SC_LAW.uninsuredMotorist.propertyDamage], [25000, 50000, 25000]);
  assert.equal(SC_LAW.sol.years, 3);
});
test("SC: no PIP/med-pay setoff → 15,500 + 15,000/22,500/30,000 = 30,500/38,000/45,500", () => {
  const r = calculateSC(sc);
  assert.equal(r.economic, 15500);
  assert.deepEqual(r.recoverable, { low: 30500, mid: 38000, high: 45500 });
});
test("SC: 20% fault → ×0.8 = 24,400/30,400/36,400", () => {
  assert.deepEqual(calculateSC({ ...sc, plaintiffFaultPercent: 20 }).recoverable, { low: 24400, mid: 30400, high: 36400 });
});
test("SC Nelson: 50% ('not greater than') recovers ×0.5 → 15,250→15,300; 19,000; 22,750→22,800", () => {
  const r = calculateSC({ ...sc, plaintiffFaultPercent: 50 });
  assert.equal(r.barred, false);
  assert.deepEqual(r.recoverable, { low: 15300, mid: 19000, high: 22800 });
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
