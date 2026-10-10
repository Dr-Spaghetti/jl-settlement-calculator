/**
 * Known-answer tests. Every expected number below was worked out BY HAND
 * (arithmetic shown in comments) — not produced by running the code.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { grossRange, multipliers, applyModifiedFault50, type CoreInputs } from "./core";
import { LIABILITY_OPTIONS, liabilityOption } from "./liability";
import { calculatePA, PA_LAW, type PaInputs } from "./states/pa";

const core: CoreInputs = {
  medicalBills: 10000, lostWages: 2000, otherOutOfPocket: 500, propertyDamage: 3000,
  severity: "moderate", careType: "md", treatmentMonths: 4, treatmentGap: "none",
  permanency: "none", liability: "clear",
};
const pa: PaInputs = { ...core, tortOption: "full", limitedTortException: "unsure", plaintiffFaultPercent: 0, firstPartyMedical: 5000, policyLimitPerPerson: null };

test("golden: $5k medical + $200k wages → ≈$223,600 mid (economics never multiplied)", () => {
  // adj = md 0.10 + 4mo 0.15 + gap 0 + perm 0 + clear 0.25 = 0.50 → mid 2.75+0.5 = 3.25
  // 5,000×3.25 + 200,000 + 800 + 6,500 = 223,550
  const g = grossRange({ ...core, medicalBills: 5000, lostWages: 200000, otherOutOfPocket: 800, propertyDamage: 6500 });
  assert.equal(g.m.mid, 3.25);
  assert.equal(Math.round(g.mid / 100) * 100, 223600);
});

test("golden: zero wages", () => {
  // 10,000×3.25 + 0 + 500 + 3,000 = 36,000
  assert.equal(grossRange({ ...core, lostWages: 0 }).mid, 36000);
});

test("golden: max severity clamps at 7×", () => {
  // catastrophic high 6.0 + surgery .45 + 13mo .45 + rated .55 + clear .25 = 7.70 → clamp 7
  const m = multipliers({ ...core, severity: "catastrophic", careType: "surgery", treatmentMonths: 13, permanency: "rated" });
  assert.equal(m.high, 7);
  assert.equal(m.mid, 6.7); // 5.0 + 1.70
});

test("liability table: every button's coef and breakdown label equal the clicked option", () => {
  const expected = { clear: 0.25, mixed: -0.2, disputed: -0.55 } as const;
  for (const o of LIABILITY_OPTIONS) {
    assert.equal(liabilityOption(o.id).coef, expected[o.id]);
    assert.equal(o.breakdownLabel, o.label);
    // mid multiplier moves by exactly the option's coef vs a zero-liability baseline
    const m = multipliers({ ...core, liability: o.id });
    assert.equal(Math.round((m.mid - (2.75 + 0.1 + 0.15)) * 100) / 100, expected[o.id]);
  }
});

test("modified 51% bar: 50% reduces, 51% bars", () => {
  assert.deepEqual(applyModifiedFault50(10000, 50), { recoverable: 5000, barred: false });
  assert.deepEqual(applyModifiedFault50(10000, 51), { recoverable: 0, barred: true });
});

test("PA law values match the verified reference", () => {
  assert.equal(PA_LAW.minLiability.perPerson, 15000);
  assert.equal(PA_LAW.minLiability.perAccident, 30000);
  assert.equal(PA_LAW.minLiability.propertyDamage, 5000);
  assert.equal(PA_LAW.firstPartyMedical.minimum, 5000);
  assert.equal(PA_LAW.sol.years, 2);
});

test("PA hand case — full tort, 0% fault", () => {
  // mult low 2.5 / mid 3.25 / high 4.0
  // economic = (10,000 − 5,000 first-party) + 2,000 + 500 + 3,000 = 10,500
  // non-economic = 10,000 × (m − 1) = 15,000 / 22,500 / 30,000
  // total = 25,500 / 33,000 / 40,500
  const r = calculatePA(pa);
  assert.deepEqual(r.recoverable, { low: 25500, mid: 33000, high: 40500 });
  assert.equal(r.economic, 10500);
  assert.equal(r.barred, false);
});

test("PA hand case — 20% fault reduces proportionally", () => {
  // 25,500×.8 = 20,400; 33,000×.8 = 26,400; 40,500×.8 = 32,400
  assert.deepEqual(calculatePA({ ...pa, plaintiffFaultPercent: 20 }).recoverable, { low: 20400, mid: 26400, high: 32400 });
});

test("PA hand case — 50% recovers half, 51% barred to $0", () => {
  assert.deepEqual(calculatePA({ ...pa, plaintiffFaultPercent: 50 }).recoverable, { low: 12800, mid: 16500, high: 20300 }); // 12,750→12,800; 20,250→20,300
  const b = calculatePA({ ...pa, plaintiffFaultPercent: 51 });
  assert.equal(b.barred, true);
  assert.deepEqual(b.recoverable, { low: 0, mid: 0, high: 0 });
});

test("PA limited tort without exception → economic damages only (10,500)", () => {
  for (const ex of ["no", "unsure"] as const) {
    const r = calculatePA({ ...pa, tortOption: "limited", limitedTortException: ex });
    assert.deepEqual(r.recoverable, { low: 10500, mid: 10500, high: 10500 });
    assert.equal(r.nonEconomicAllowed, false);
    assert.deepEqual(r.ifNonEconomicAvailable, { low: 25500, mid: 33000, high: 40500 });
  }
  const yes = calculatePA({ ...pa, tortOption: "limited", limitedTortException: "yes" });
  assert.deepEqual(yes.recoverable, { low: 25500, mid: 33000, high: 40500 });
});

test("PA 'not sure' tort → conservative economic-only headline", () => {
  assert.deepEqual(calculatePA({ ...pa, tortOption: "unsure" }).recoverable, { low: 10500, mid: 10500, high: 10500 });
});

test("PA first-party offset never exceeds medical bills", () => {
  // medical 3,000 → offset 3,000; economic = 0 + 2,000 + 500 + 3,000 = 5,500
  assert.equal(calculatePA({ ...pa, medicalBills: 3000 }).economic, 5500);
});

test("Policy limit: Unknown default → no cap, no banner; $15k cap binds", () => {
  const u = calculatePA(pa);
  assert.equal(u.capped, null);
  assert.equal(u.policyLimitsMayBind, false);
  const c = calculatePA({ ...pa, policyLimitPerPerson: 15000 });
  assert.deepEqual(c.capped, { low: 15000, mid: 15000, high: 15000 });
  assert.equal(c.policyLimitsMayBind, true);
});
