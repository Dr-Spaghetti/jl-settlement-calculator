/**
 * New Jersey known-answer tests. Expected numbers worked BY HAND (arithmetic in comments).
 * Base: med 10,000; wages 2,000; other 500; property 3,000; moderate, MD care, 4 months, no gap, no permanency, clear liability
 * → adjustment 0.10 + 0.15 + 0 + 0 + 0.25 = 0.50 → multipliers 2.50 / 3.25 / 4.00.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { calculateGated, type GatedInputs } from "./states/gated";
import { NJ_KIT, NJ_LAW } from "./states/nj";

const base: GatedInputs = {
  medicalBills: 10000, lostWages: 2000, otherOutOfPocket: 500, propertyDamage: 3000,
  severity: "moderate", careType: "md", treatmentMonths: 4, treatmentGap: "none", permanency: "none", liability: "clear",
  gate: "open", gateException: "unsure", plaintiffFaultPercent: 0, firstPartyMedical: 0, policyLimitPerPerson: null,
};
const nj = (o: Partial<GatedInputs>) => calculateGated({ ...base, ...o }, NJ_KIT.faultRule);

test("NJ constants equal P.L.2022 c.87 / 39:6B-1 ($35k/$70k/$25k; $25k prior) and DOBI ($10k basic BI option, $250k PIP common, $15k basic PIP)", () => {
  assert.equal(NJ_LAW.minLiability.perPerson, 35000);
  assert.equal(NJ_LAW.minLiability.perAccident, 70000);
  assert.equal(NJ_LAW.minLiability.propertyDamage, 25000);
  assert.equal(NJ_LAW.minLiability.priorPerPerson, 25000);
  assert.equal(NJ_LAW.basicPolicy.optionalBodilyInjury, 10000);
  assert.equal(NJ_LAW.pip.commonLimit, 250000);
  assert.equal(NJ_LAW.pip.basicLimit, 15000);
  assert.equal(NJ_LAW.sol.years, 2);
});

test("NJ no limitation, PIP $0: econ 15,500 + P&S 15,000/22,500/30,000 = 30,500/38,000/45,500", () => {
  const r = nj({});
  assert.equal(r.economic, 15500);
  assert.deepEqual(r.recoverable, { low: 30500, mid: 38000, high: 45500 });
});

test("NJ PIP $250,000 (default) offsets all $10,000 medical: econ 5,500 → 20,500/28,000/35,500", () => {
  const r = nj({ firstPartyMedical: 250000 });
  assert.equal(r.medicalOffset, 10000);
  assert.deepEqual(r.recoverable, { low: 20500, mid: 28000, high: 35500 });
});

test("NJ partial PIP $4,000: offset 4,000, econ 6,000 + 5,500 = 11,500", () => {
  assert.equal(nj({ firstPartyMedical: 4000 }).economic, 11500);
});

test("NJ limitation on lawsuit, no/unsure listed injury → economic only 5,500; listed injury → full range", () => {
  for (const ex of ["no", "unsure"] as const) {
    const r = nj({ gate: "restricted", gateException: ex, firstPartyMedical: 250000 });
    assert.deepEqual(r.recoverable, { low: 5500, mid: 5500, high: 5500 });
    assert.deepEqual(r.ifNonEconomicAvailable, { low: 20500, mid: 28000, high: 35500 });
  }
  assert.deepEqual(nj({ gate: "restricted", gateException: "yes", firstPartyMedical: 250000 }).recoverable, { low: 20500, mid: 28000, high: 35500 });
});

test("NJ 'Not sure' lawsuit option → both scenarios (PA pattern)", () => {
  const r = nj({ gate: "unsure", firstPartyMedical: 250000 });
  assert.deepEqual(r.gateUnsure, { open: { low: 20500, mid: 28000, high: 35500 }, restricted: { low: 5500, mid: 5500, high: 5500 } });
  assert.equal(NJ_KIT.gate!.defaultOption, "unsure");
});

test("NJ fault: 50% halves (15,250→15,300; 19,000; 22,750→22,800); 51% barred (2A:15-5.1)", () => {
  assert.deepEqual(nj({ plaintiffFaultPercent: 50 }).recoverable, { low: 15300, mid: 19000, high: 22800 });
  const b = nj({ plaintiffFaultPercent: 51 });
  assert.equal(b.barred, true);
  assert.deepEqual(b.recoverable, { low: 0, mid: 0, high: 0 });
});

test("NJ policy: $35k limit → 30,500/35,000/35,000; basic policy $0 BI → 0 and binds; Unknown → no cap", () => {
  assert.deepEqual(nj({ policyLimitPerPerson: 35000 }).capped, { low: 30500, mid: 35000, high: 35000 });
  const z = nj({ policyLimitPerPerson: 0 });
  assert.deepEqual(z.capped, { low: 0, mid: 0, high: 0 });
  assert.equal(z.policyLimitsMayBind, true);
  assert.equal(nj({}).capped, null);
  assert.equal(NJ_KIT.policyOptions[0].value, null);
});

test("NJ copy: statute-exact categories, no '51%' shorthand, default-limitation note cites 39:6A-8.1(b)", () => {
  const t = NJ_KIT.gate!.exceptions;
  for (const n of ["death; dismemberment; significant disfigurement or significant scarring; displaced fractures; loss of a fetus; or a permanent injury within a reasonable degree of medical probability, other than scarring or disfigurement"]) assert.ok(t.includes(n));
  assert.ok(NJ_KIT.gate!.unsureNote.includes("39:6A-8.1(b)"));
  assert.ok(!JSON.stringify(NJ_KIT).includes("51%"));
});
