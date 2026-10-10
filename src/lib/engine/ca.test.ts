/**
 * California known-answer tests, worked BY HAND. Base multipliers 2.50 / 3.25 / 4.00
 * (moderate 2.0/2.75/3.5 + MD 0.10 + 4 months 0.15 + clear 0.25).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { calculateGated, type GatedInputs } from "./states/gated";
import { CA_KIT, CA_LAW } from "./states/ca";

const base: GatedInputs = {
  medicalBills: 10000, lostWages: 2000, otherOutOfPocket: 500, propertyDamage: 3000,
  severity: "moderate", careType: "md", treatmentMonths: 4, treatmentGap: "none", permanency: "none", liability: "clear",
  gate: "open", gateException: "unsure", plaintiffFaultPercent: 0, firstPartyMedical: 0, policyLimitPerPerson: null,
};
const ca = (o: Partial<GatedInputs>) => calculateGated({ ...base, ...o }, CA_KIT.faultRule);

test("CA constants equal Veh. Code § 16056(a)(2) ($30k/$60k/$15k), CCP § 335.1 (2 yrs), Gov. Code § 911.2(a) (6 months)", () => {
  assert.deepEqual([CA_LAW.minLiability.perPerson, CA_LAW.minLiability.perAccident, CA_LAW.minLiability.propertyDamage], [30000, 60000, 15000]);
  assert.equal(CA_LAW.sol.years, 2);
  assert.equal(CA_LAW.govClaimMonths.months, 6);
});

test("CA Prop 213 does not apply, 0% fault: 15,500 econ + 15,000/22,500/30,000 = 30,500/38,000/45,500", () => {
  assert.deepEqual(ca({}).recoverable, { low: 30500, mid: 38000, high: 45500 });
});

test("CA pure comparative: 51% → ×0.49 = 14,945→14,900; 18,620→18,600; 22,295→22,300 (not barred); 80% → 6,100/7,600/9,100", () => {
  const r = ca({ plaintiffFaultPercent: 51 });
  assert.equal(r.barred, false);
  assert.deepEqual(r.recoverable, { low: 14900, mid: 18600, high: 22300 });
  assert.deepEqual(ca({ plaintiffFaultPercent: 80 }).recoverable, { low: 6100, mid: 7600, high: 9100 });
  assert.deepEqual(ca({ plaintiffFaultPercent: 100 }).recoverable, { low: 0, mid: 0, high: 0 });
});

test("CA Prop 213 applies (no/unsure exception) → economic only 15,500; § 3333.4(c) exception → full range", () => {
  for (const ex of ["no", "unsure"] as const) assert.deepEqual(ca({ gate: "restricted", gateException: ex }).recoverable, { low: 15500, mid: 15500, high: 15500 });
  assert.deepEqual(ca({ gate: "restricted", gateException: "yes" }).recoverable, { low: 30500, mid: 38000, high: 45500 });
});

test("CA 'Not sure' (default) → both scenarios", () => {
  assert.equal(CA_KIT.gate!.defaultOption, "unsure");
  assert.deepEqual(ca({ gate: "unsure" }).gateUnsure, { open: { low: 30500, mid: 38000, high: 45500 }, restricted: { low: 15500, mid: 15500, high: 15500 } });
});

test("CA $30k minimum limit → 30,000/30,000/30,000 after 30,500 low; Unknown default → no cap", () => {
  assert.deepEqual(ca({ policyLimitPerPerson: 30000 }).capped, { low: 30000, mid: 30000, high: 30000 });
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
