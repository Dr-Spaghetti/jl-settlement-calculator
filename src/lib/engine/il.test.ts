/**
 * Illinois known-answer tests, worked BY HAND. Base multipliers 2.25 / 3.00 / 3.75
 * (moderate 2.0/2.75/3.5 + MD 0.10 + 4 months 0.15; no liability term).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { calculateGated, type GatedInputs } from "./states/gated";
import { IL_KIT, IL_LAW } from "./states/il";

const base: GatedInputs = {
  medicalBills: 10000, lostWages: 2000, otherOutOfPocket: 500, propertyDamage: 3000,
  severity: "moderate", careType: "md", treatmentMonths: 4, treatmentGap: "none", permanency: "none",
  gate: null, gateException: "unsure", plaintiffFaultPercent: 0, firstPartyMedical: 0, policyLimitPerPerson: null,
};
const il = (o: Partial<GatedInputs>) => calculateGated({ ...base, ...o }, IL_KIT.faultRule);

test("IL constants equal 625 ILCS 5/7-203 ($25k/$50k/$20k), 13-202 (2 yrs), 8-101(a) (1 yr)", () => {
  assert.deepEqual([IL_LAW.minLiability.perPerson, IL_LAW.minLiability.perAccident, IL_LAW.minLiability.propertyDamage], [25000, 50000, 20000]);
  assert.equal(IL_LAW.sol.years, 2);
  assert.equal(IL_LAW.localEntitySol.years, 1);
});

test("IL 0% fault: econ 10,000+2,000+500+3,000 = 15,500; + P&S 12,500/20,000/27,500 = 28,000/35,500/43,000; no offset, no gate", () => {
  const r = il({});
  assert.equal(r.medicalOffset, 0);
  assert.equal(r.economic, 15500);
  assert.equal(r.nonEconomicAllowed, true);
  assert.equal(r.gateUnsure, null);
  assert.deepEqual(r.recoverable, { low: 28000, mid: 35500, high: 43000 });
});

test("IL 25% fault: ×0.75 → 21,000; 26,625→26,600; 32,250→32,300", () => {
  assert.deepEqual(il({ plaintiffFaultPercent: 25 }).recoverable, { low: 21000, mid: 26600, high: 32300 });
});

test("IL 50% not barred (14,000 / 17,750→17,800 / 21,500); 51% barred (more than 50%)", () => {
  assert.deepEqual(il({ plaintiffFaultPercent: 50 }).recoverable, { low: 14000, mid: 17800, high: 21500 });
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

test("IL client phone is the site's Chicago new-client number; no 'if you bought it'", async () => {
  const { readFileSync } = await import("node:fs");
  const c = JSON.parse(readFileSync(new URL("../../../clients/choosecharlie-il.json", import.meta.url), "utf8"));
  assert.equal(c.phone, "(773) 839-8944");
  assert.ok(!String(c.phone).includes("825-3093"));
  assert.ok(!JSON.stringify(IL_KIT).includes("if you bought it"));
});

test("IL fault applied once (735 ILCS 5/2-1116, no liability penalty): $100,000 gross → 20% = $80,000; 50% = $50,000; 51% = $0", () => {
  // med 10,000 + wages 70,000 = econ 80,000; P&S 10,000 × (3.00 − 1) = 20,000 → mid 100,000
  const i = { lostWages: 70000, otherOutOfPocket: 0, propertyDamage: 0 };
  assert.equal(il(i).recoverable.mid, 100000);
  assert.equal(il({ ...i, plaintiffFaultPercent: 20 }).recoverable.mid, 80000);
  assert.equal(il({ ...i, plaintiffFaultPercent: 50 }).recoverable.mid, 50000);
  assert.equal(il({ ...i, plaintiffFaultPercent: 51 }).recoverable.mid, 0);
  const g = il({}).recoverable;
  for (let f = 0; f <= 100; f++) {
    const k = (n: number) => (f > 50 ? 0 : Math.round((n * (1 - f / 100)) / 100) * 100);
    assert.deepEqual(il({ plaintiffFaultPercent: f }).recoverable, { low: k(g.low), mid: k(g.mid), high: k(g.high) }, `fault ${f}%`);
  }
});
