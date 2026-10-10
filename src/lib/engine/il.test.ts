/**
 * Illinois known-answer tests, worked BY HAND. Base multipliers 2.50 / 3.25 / 4.00
 * (moderate 2.0/2.75/3.5 + MD 0.10 + 4 months 0.15 + clear 0.25).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { calculateGated, type GatedInputs } from "./states/gated";
import { IL_KIT, IL_LAW } from "./states/il";

const base: GatedInputs = {
  medicalBills: 10000, lostWages: 2000, otherOutOfPocket: 500, propertyDamage: 3000,
  severity: "moderate", careType: "md", treatmentMonths: 4, treatmentGap: "none", permanency: "none", liability: "clear",
  gate: null, gateException: "unsure", plaintiffFaultPercent: 0, firstPartyMedical: 0, policyLimitPerPerson: null,
};
const il = (o: Partial<GatedInputs>) => calculateGated({ ...base, ...o }, IL_KIT.faultRule);

test("IL constants equal 625 ILCS 5/7-203 ($25k/$50k/$20k), 13-202 (2 yrs), 8-101(a) (1 yr)", () => {
  assert.deepEqual([IL_LAW.minLiability.perPerson, IL_LAW.minLiability.perAccident, IL_LAW.minLiability.propertyDamage], [25000, 50000, 20000]);
  assert.equal(IL_LAW.sol.years, 2);
  assert.equal(IL_LAW.localEntitySol.years, 1);
});

test("IL 0% fault: econ 10,000+2,000+500+3,000 = 15,500; + P&S 15,000/22,500/30,000 = 30,500/38,000/45,500; no offset, no gate", () => {
  const r = il({});
  assert.equal(r.medicalOffset, 0);
  assert.equal(r.economic, 15500);
  assert.equal(r.nonEconomicAllowed, true);
  assert.equal(r.gateUnsure, null);
  assert.deepEqual(r.recoverable, { low: 30500, mid: 38000, high: 45500 });
});

test("IL 25% fault: ×0.75 → 22,875→22,900; 28,500; 34,125→34,100", () => {
  assert.deepEqual(il({ plaintiffFaultPercent: 25 }).recoverable, { low: 22900, mid: 28500, high: 34100 });
});

test("IL 50% not barred (15,300 / 19,000 / 22,800); 51% barred (more than 50%)", () => {
  assert.deepEqual(il({ plaintiffFaultPercent: 50 }).recoverable, { low: 15300, mid: 19000, high: 22800 });
  const b = il({ plaintiffFaultPercent: 51 });
  assert.equal(b.barred, true);
  assert.deepEqual(b.recoverable, { low: 0, mid: 0, high: 0 });
});

test("IL $25k minimum limit → 25,000 ×3, binds; Unknown default → no cap", () => {
  const r = il({ policyLimitPerPerson: 25000 });
  assert.deepEqual(r.capped, { low: 25000, mid: 25000, high: 25000 });
  assert.equal(r.policyLimitsMayBind, true);
  assert.equal(IL_KIT.policyOptions[0].value, null);
  assert.equal(il({}).capped, null);
});

test("IL copy: statute wording 'more than 50% of the proximate cause', no '51%' shorthand, no PIP/no-fault claims", () => {
  assert.ok(IL_KIT.copy.faultNote.includes("more than 50% of the proximate cause"));
  const all = JSON.stringify(IL_KIT);
  assert.ok(!all.includes("51%"));
  assert.ok(!/PIP|no-fault/i.test(all));
  assert.equal(IL_KIT.gate, undefined);
  assert.equal(IL_KIT.offset, undefined);
});
