/**
 * California known-answer tests, worked BY HAND. Base multipliers 2.25 / 3.00 / 3.75
 * (moderate 2.0/2.75/3.5 + MD 0.10 + 4 months 0.15; no liability term).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { calculateGated, type GatedInputs } from "./states/gated";
import { CA_KIT, CA_LAW } from "./states/ca";

const base: GatedInputs = {
  medicalBills: 10000, lostWages: 2000, otherOutOfPocket: 500, propertyDamage: 3000,
  severity: "moderate", careType: "md", treatmentMonths: 4, treatmentGap: "none", permanency: "none",
  gate: "open", gateException: "unsure", plaintiffFaultPercent: 0, firstPartyMedical: 0, policyLimitPerPerson: null,
};
const ca = (o: Partial<GatedInputs>) => calculateGated({ ...base, ...o }, CA_KIT.faultRule);

test("CA constants equal Veh. Code § 16056(a)(2) ($30k/$60k/$15k), CCP § 335.1 (2 yrs), Gov. Code § 911.2(a) (6 months)", () => {
  assert.deepEqual([CA_LAW.minLiability.perPerson, CA_LAW.minLiability.perAccident, CA_LAW.minLiability.propertyDamage], [30000, 60000, 15000]);
  assert.equal(CA_LAW.sol.years, 2);
  assert.equal(CA_LAW.govClaimMonths.months, 6);
});

test("CA Prop 213 does not apply, 0% fault: 15,500 econ + 12,500/20,000/27,500 = 28,000/35,500/43,000", () => {
  assert.deepEqual(ca({}).recoverable, { low: 28000, mid: 35500, high: 43000 });
});

test("CA pure comparative: 51% → ×0.49 = 13,720→13,700; 17,395→17,400; 21,070→21,100 (not barred); 80% → 5,600/7,100/8,600", () => {
  const r = ca({ plaintiffFaultPercent: 51 });
  assert.equal(r.barred, false);
  assert.deepEqual(r.recoverable, { low: 13700, mid: 17400, high: 21100 });
  assert.deepEqual(ca({ plaintiffFaultPercent: 80 }).recoverable, { low: 5600, mid: 7100, high: 8600 });
  assert.deepEqual(ca({ plaintiffFaultPercent: 100 }).recoverable, { low: 0, mid: 0, high: 0 });
});

test("CA Prop 213 applies (no/unsure exception) → economic only 15,500; § 3333.4(c) exception → full range", () => {
  for (const ex of ["no", "unsure"] as const) assert.deepEqual(ca({ gate: "restricted", gateException: ex }).recoverable, { low: 15500, mid: 15500, high: 15500 });
  assert.deepEqual(ca({ gate: "restricted", gateException: "yes" }).recoverable, { low: 28000, mid: 35500, high: 43000 });
});

test("CA 'Not sure' (default) → both scenarios", () => {
  assert.equal(CA_KIT.gate!.defaultOption, "unsure");
  assert.deepEqual(ca({ gate: "unsure" }).gateUnsure, { open: { low: 28000, mid: 35500, high: 43000 }, restricted: { low: 15500, mid: 15500, high: 15500 } });
});

test("CA $30k minimum limit → 28,000/30,000/30,000 (low 28,000 is under the limit); Unknown default → no cap", () => {
  assert.deepEqual(ca({ policyLimitPerPerson: 30000 }).capped, { low: 28000, mid: 30000, high: 30000 });
  assert.equal(CA_KIT.policyOptions[0].value, null);
});

test("CA copy: no '50%'/'51%' bar language, Prop 213 lists all three § 3333.4(a) situations, no PIP", () => {
  const all = JSON.stringify(CA_KIT);
  assert.ok(!/5[01]%/.test(all));
  assert.ok(!/PIP|no-fault/i.test(all));
  for (const n of ["convicted of that offense", "not insured as required", "can't establish the financial responsibility"]) assert.ok(CA_KIT.gate!.help.includes(n), n);
  assert.equal(CA_KIT.offset, undefined);
});

test("CA: UIM tail on policy surfaces, no 'if you bought it'", () => {
  const tail = "your own underinsured motorist coverage (included unless you rejected it in writing; it applies only if your limit is higher than the at-fault driver's) or other sources may apply.";
  const c = CA_KIT.copy;
  assert.ok(c.policyHelp.includes(tail) && c.policyBanner.includes(tail) && c.how[3][1].includes(tail) && c.faq[3].a.includes(tail));
  assert.ok(!JSON.stringify(CA_KIT).includes("if you bought it"));
});

test("CA pure comparative, fault applied once (no liability penalty, no bar): $100,000 gross → 20% = $80,000; 51% = $49,000; 90% = $10,000; 100% = $0", () => {
  // med 10,000 + wages 70,000 = econ 80,000; P&S 10,000 × (3.00 − 1) = 20,000 → mid 100,000
  const i = { lostWages: 70000, otherOutOfPocket: 0, propertyDamage: 0 };
  assert.equal(ca(i).recoverable.mid, 100000);
  assert.equal(ca({ ...i, plaintiffFaultPercent: 20 }).recoverable.mid, 80000);
  assert.equal(ca({ ...i, plaintiffFaultPercent: 51 }).recoverable.mid, 49000);
  assert.equal(ca({ ...i, plaintiffFaultPercent: 90 }).recoverable.mid, 10000);
  assert.equal(ca({ ...i, plaintiffFaultPercent: 100 }).recoverable.mid, 0);
  const g = ca({}).recoverable;
  for (let f = 0; f <= 100; f++) {
    const k = (n: number) => Math.round((n * (1 - f / 100)) / 100) * 100;
    const r = ca({ plaintiffFaultPercent: f });
    assert.equal(r.barred, false);
    assert.deepEqual(r.recoverable, { low: k(g.low), mid: k(g.mid), high: k(g.high) }, `fault ${f}%`);
  }
});
