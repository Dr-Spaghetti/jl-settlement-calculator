/**
 * New Jersey known-answer tests. Expected numbers worked BY HAND (arithmetic in comments).
 * Base: med 10,000; wages 2,000; other 500; property 3,000; moderate, MD care, 4 months, no gap, no permanency (no liability term)
 * → adjustment 0.10 + 0.15 + 0 + 0 = 0.25 → multipliers 2.25 / 3.00 / 3.75 → P&S 12,500 / 20,000 / 27,500.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { calculateGated, type GatedInputs } from "./states/gated";
import { NJ_KIT, NJ_LAW } from "./states/nj";

const base: GatedInputs = {
  medicalBills: 10000, lostWages: 2000, otherOutOfPocket: 500, propertyDamage: 3000,
  severity: "moderate", careType: "md", treatmentMonths: 4, treatmentGap: "none", permanency: "none",
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

test("NJ no limitation, PIP $0: econ 15,500 + P&S 12,500/20,000/27,500 = 28,000/35,500/43,000", () => {
  const r = nj({});
  assert.equal(r.economic, 15500);
  assert.deepEqual(r.recoverable, { low: 28000, mid: 35500, high: 43000 });
});

test("NJ PIP threshold $250,000 (default, Haines v. Taft) offsets all $10,000 medical: econ 5,500 → 18,000/25,500/33,000", () => {
  const r = nj({ firstPartyMedical: 250000 });
  assert.equal(r.medicalOffset, 10000);
  assert.deepEqual(r.recoverable, { low: 18000, mid: 25500, high: 33000 });
});

test("NJ partial PIP $4,000: offset 4,000, econ 6,000 + 5,500 = 11,500", () => {
  assert.equal(nj({ firstPartyMedical: 4000 }).economic, 11500);
});

test("NJ limitation on lawsuit, no/unsure listed injury → economic only 5,500; listed injury → full range", () => {
  for (const ex of ["no", "unsure"] as const) {
    const r = nj({ gate: "restricted", gateException: ex, firstPartyMedical: 250000 });
    assert.deepEqual(r.recoverable, { low: 5500, mid: 5500, high: 5500 });
    assert.deepEqual(r.ifNonEconomicAvailable, { low: 18000, mid: 25500, high: 33000 });
  }
  assert.deepEqual(nj({ gate: "restricted", gateException: "yes", firstPartyMedical: 250000 }).recoverable, { low: 18000, mid: 25500, high: 33000 });
});

test("NJ 'Not sure' lawsuit option → both scenarios (PA pattern)", () => {
  const r = nj({ gate: "unsure", firstPartyMedical: 250000 });
  assert.deepEqual(r.gateUnsure, { open: { low: 18000, mid: 25500, high: 33000 }, restricted: { low: 5500, mid: 5500, high: 5500 } });
  assert.equal(NJ_KIT.gate!.defaultOption, "unsure");
});

test("NJ fault: 50% halves (14,000; 17,750→17,800; 21,500); 51% barred (2A:15-5.1)", () => {
  assert.deepEqual(nj({ plaintiffFaultPercent: 50 }).recoverable, { low: 14000, mid: 17800, high: 21500 });
  const b = nj({ plaintiffFaultPercent: 51 });
  assert.equal(b.barred, true);
  assert.deepEqual(b.recoverable, { low: 0, mid: 0, high: 0 });
});

test("NJ policy: $35k limit → 28,000/35,000/35,000; basic policy $0 BI → 0 and binds; Unknown → no cap", () => {
  assert.deepEqual(nj({ policyLimitPerPerson: 35000 }).capped, { low: 28000, mid: 35000, high: 35000 });
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

test("NJ PIP copy follows Haines v. Taft: $250,000 regardless of elected PIP limit; no 'enter your actual PIP limit'", () => {
  assert.ok(NJ_KIT.offset!.help.includes("even if you chose a lower PIP limit"));
  assert.equal(NJ_KIT.offset!.defaultValue, 250000);
  assert.ok(!JSON.stringify(NJ_KIT).includes("Enter your actual PIP limit"));
});

test("NJ: UIM tail on all 4 policy surfaces, no 'if you bought it', 8.1(a) household note", () => {
  const tail = "your own underinsured motorist coverage (required on standard policies, not included in basic policies; it applies only if your UIM limit is higher than the at-fault driver's limit) or other sources may apply.";
  const c = NJ_KIT.copy;
  assert.ok(c.policyHelp.includes(tail) && c.policyBanner.includes(tail) && c.how[3][1].includes(tail) && c.faq[4].a.includes(tail));
  assert.ok(!JSON.stringify(NJ_KIT).includes("if you bought it"));
  assert.ok(NJ_KIT.gate!.unsureNote.includes("The choice applies to you and to your spouse and children who live with you and are not named insureds on another auto policy (N.J.S.A. 39:6A-8.1(a))."));
});

test("NJ fault applied once (2A:15-5.1/5.3-style reduction, no liability penalty): $100,000 gross → 20% = $80,000; 50% = $50,000; 51% = $0", () => {
  // med 10,000 + wages 70,000 = econ 80,000 (PIP 0); P&S 10,000 × (3.00 − 1) = 20,000 → mid 100,000
  const i = { lostWages: 70000, otherOutOfPocket: 0, propertyDamage: 0 };
  assert.equal(nj(i).recoverable.mid, 100000);
  assert.equal(nj({ ...i, plaintiffFaultPercent: 20 }).recoverable.mid, 80000);
  assert.equal(nj({ ...i, plaintiffFaultPercent: 50 }).recoverable.mid, 50000);
  assert.equal(nj({ ...i, plaintiffFaultPercent: 51 }).recoverable.mid, 0);
  const g = nj({}).recoverable;
  for (let f = 0; f <= 100; f++) {
    const k = (n: number) => (f > 50 ? 0 : Math.round((n * (1 - f / 100)) / 100) * 100);
    assert.deepEqual(nj({ plaintiffFaultPercent: f }).recoverable, { low: k(g.low), mid: k(g.mid), high: k(g.high) }, `fault ${f}%`);
  }
});
