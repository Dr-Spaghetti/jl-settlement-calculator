/**
 * Known-answer tests. Every expected number below was worked out BY HAND
 * (arithmetic shown in comments) — not produced by running the code.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { grossRange, multipliers, applyModifiedFault50, type CoreInputs } from "./core";
import { calculatePA, PA_LAW, type PaInputs } from "./states/pa";
import { PA_COPY } from "./states/pa.copy";

const core: CoreInputs = {
  medicalBills: 10000, lostWages: 2000, otherOutOfPocket: 500, propertyDamage: 3000,
  severity: "moderate", careType: "md", treatmentMonths: 4, treatmentGap: "none",
  permanency: "none",
};
const pa: PaInputs = { ...core, tortOption: "full", limitedTortException: "unsure", plaintiffFaultPercent: 0, firstPartyMedical: 5000, policyLimitPerPerson: null };

test("golden: $5k medical + $200k wages → $222,300 mid (economics never multiplied)", () => {
  // adj = md 0.10 + 4mo 0.15 + gap 0 + perm 0 = 0.25 (no liability term) → mid 2.75+0.25 = 3.00
  // 5,000×3.00 + 200,000 + 800 + 6,500 = 222,300
  const g = grossRange({ ...core, medicalBills: 5000, lostWages: 200000, otherOutOfPocket: 800, propertyDamage: 6500 });
  assert.equal(g.m.mid, 3);
  assert.equal(Math.round(g.mid / 100) * 100, 222300);
});

test("golden: zero wages", () => {
  // 10,000×3.00 + 0 + 500 + 3,000 = 33,500
  assert.equal(grossRange({ ...core, lostWages: 0 }).mid, 33500);
});

test("golden: max severity clamps at 7×", () => {
  // catastrophic high 6.0 + surgery .45 + 13mo .45 + rated .55 = 7.45 → clamp 7
  const m = multipliers({ ...core, severity: "catastrophic", careType: "surgery", treatmentMonths: 13, permanency: "rated" });
  assert.equal(m.high, 7);
  assert.equal(m.mid, 6.45); // 5.0 + 1.45
});

test("§ 7102: fault is applied once — recoverable = round(gross × (1 − f)) for f ≤ 50, $0 for f > 50; no liability input exists", () => {
  // Inputs carry no liability/shared-fault field (CoreInputs has none), so nothing else can reduce for fault.
  assert.ok(!("liability" in pa));
  const g = calculatePA(pa).recoverable; // f = 0 → 23,000 / 30,500 / 38,000 (hand case below)
  for (let f = 0; f <= 100; f++) {
    const r = calculatePA({ ...pa, plaintiffFaultPercent: f });
    const k = (n: number) => (f > 50 ? 0 : Math.round((n * (1 - f / 100)) / 100) * 100);
    assert.deepEqual(r.recoverable, { low: k(g.low), mid: k(g.mid), high: k(g.high) }, `fault ${f}%`);
    assert.equal(r.barred, f > 50);
  }
});

test("§ 7102 example: $100,000 gross at 20% fault = $80,000; 50% = $50,000; 51% = $0", () => {
  assert.deepEqual(applyModifiedFault50(100000, 20), { recoverable: 80000, barred: false });
  // End to end: medical 10,000 (no first-party offset) + wages 70,000 = economic 80,000;
  // mid multiplier 3.00 → P&S 10,000 × 2.00 = 20,000 → gross mid 100,000.
  const i: PaInputs = { ...pa, medicalBills: 10000, lostWages: 70000, otherOutOfPocket: 0, propertyDamage: 0, firstPartyMedical: 0 };
  assert.equal(calculatePA(i).recoverable.mid, 100000);
  assert.equal(calculatePA({ ...i, plaintiffFaultPercent: 20 }).recoverable.mid, 80000);
  assert.equal(calculatePA({ ...i, plaintiffFaultPercent: 50 }).recoverable.mid, 50000);
  assert.equal(calculatePA({ ...i, plaintiffFaultPercent: 51 }).recoverable.mid, 0);
});

test("barred when more than 50%: 50% reduces, 51% bars", () => {
  assert.deepEqual(applyModifiedFault50(10000, 50), { recoverable: 5000, barred: false });
  assert.deepEqual(applyModifiedFault50(10000, 51), { recoverable: 0, barred: true });
});

test("PA constants equal the figures quoted from §1702 ($15k/$30k/$5k), §1711(a) ($5,000) and §5524 (2 years) — a constant check, not a test of the law itself", () => {
  assert.equal(PA_LAW.minLiability.perPerson, 15000);
  assert.equal(PA_LAW.minLiability.perAccident, 30000);
  assert.equal(PA_LAW.minLiability.propertyDamage, 5000);
  assert.equal(PA_LAW.firstPartyMedical.minimum, 5000);
  assert.equal(PA_LAW.sol.years, 2);
});

test("PA hand case — full tort, 0% fault", () => {
  // mult low 2.25 / mid 3.00 / high 3.75 (moderate 2.0/2.75/3.5 + md .10 + 4 mo .15)
  // economic = (10,000 − 5,000 first-party) + 2,000 + 500 + 3,000 = 10,500
  // non-economic = 10,000 × (m − 1) = 12,500 / 20,000 / 27,500
  // total = 23,000 / 30,500 / 38,000
  const r = calculatePA(pa);
  assert.deepEqual(r.recoverable, { low: 23000, mid: 30500, high: 38000 });
  assert.equal(r.economic, 10500);
  assert.equal(r.barred, false);
});

test("PA hand case — 20% fault reduces proportionally", () => {
  // 23,000×.8 = 18,400; 30,500×.8 = 24,400; 38,000×.8 = 30,400
  assert.deepEqual(calculatePA({ ...pa, plaintiffFaultPercent: 20 }).recoverable, { low: 18400, mid: 24400, high: 30400 });
});

test("PA hand case — 50% recovers half, 51% barred to $0", () => {
  assert.deepEqual(calculatePA({ ...pa, plaintiffFaultPercent: 50 }).recoverable, { low: 11500, mid: 15300, high: 19000 }); // 11,500; 15,250→15,300; 19,000
  const b = calculatePA({ ...pa, plaintiffFaultPercent: 51 });
  assert.equal(b.barred, true);
  assert.deepEqual(b.recoverable, { low: 0, mid: 0, high: 0 });
});

test("PA limited tort without exception → economic damages only (10,500)", () => {
  for (const ex of ["no", "unsure"] as const) {
    const r = calculatePA({ ...pa, tortOption: "limited", limitedTortException: ex });
    assert.deepEqual(r.recoverable, { low: 10500, mid: 10500, high: 10500 });
    assert.equal(r.nonEconomicAllowed, false);
    assert.deepEqual(r.ifNonEconomicAvailable, { low: 23000, mid: 30500, high: 38000 });
  }
  const yes = calculatePA({ ...pa, tortOption: "limited", limitedTortException: "yes" });
  assert.deepEqual(yes.recoverable, { low: 23000, mid: 30500, high: 38000 });
});

test("PA 'not sure' tort → BOTH scenarios with equal weight (§1705(a)(3), (b)(3))", () => {
  // full: 23,000 / 30,500 / 38,000 (hand case above); limited, no exception: economic only 10,500
  const r = calculatePA({ ...pa, tortOption: "unsure" });
  assert.deepEqual(r.tortUnsure, { full: { low: 23000, mid: 30500, high: 38000 }, limited: { low: 10500, mid: 10500, high: 10500 } });
  assert.equal(calculatePA({ ...pa, tortOption: "full" }).tortUnsure, null);
});

test("PA 'not sure' + 20% fault + $15k limit: both scenarios reduced, then limited as a practical estimate", () => {
  // full ×0.8 = 18,400 / 24,400 / 30,400 → each above 15,000 → 15,000 ×3
  // limited 10,500 × 0.8 = 8,400 (below 15,000, unchanged)
  const r = calculatePA({ ...pa, tortOption: "unsure", plaintiffFaultPercent: 20, policyLimitPerPerson: 15000 });
  assert.deepEqual(r.tortUnsure, { full: { low: 15000, mid: 15000, high: 15000 }, limited: { low: 8400, mid: 8400, high: 8400 } });
});

test("PA medical benefit may be $0 (e.g. motorcycle): no deduction", () => {
  // economic = 10,000 + 2,000 + 500 + 3,000 = 15,500; full tort mid = 15,500 + 20,000 = 35,500
  const r = calculatePA({ ...pa, firstPartyMedical: 0 });
  assert.equal(r.medicalOffset, 0);
  assert.equal(r.economic, 15500);
  assert.equal(r.recoverable.mid, 35500);
});

test("PA copy: all six §1705(d) exceptions, §1702 serious-injury definition, statutory fault wording, no '51%' shorthand", () => {
  const t = PA_COPY.tortExceptions;
  for (const needle of [
    "death, serious impairment of body function, or permanent serious disfigurement",
    "convicted of or accepted ARD for DUI in this crash",
    "registered in another state",
    "intended to cause injury",
    "had no required insurance",
    "other than a private passenger car",
    "against a business that designs, manufactures, repairs, services or maintains vehicles (not for a vehicle that business was operating)",
  ]) assert.ok(t.includes(needle), needle);
  assert.equal(PA_COPY.tortUnsureNote, "If no one on your policy elected limited tort, Pennsylvania presumes full tort (75 Pa.C.S. § 1705(a)(3)). If you don't own a car and aren't covered under any household auto policy, you are generally not limited (§ 1705(b)(3)). An owner of a registered car without insurance is treated as limited tort (§ 1705(a)(5)).");
  assert.ok(!PA_COPY.tortUnsureNote.includes("never signed") && !PA_COPY.tortUnsureNote.includes("your own car insurance"));
  assert.ok(!t.includes("manufacturer or repair business"));
  assert.ok(JSON.stringify(PA_COPY.faq).includes("underinsured motorist coverage (if you bought it)"));
  assert.equal(PA_COPY.faultChip.detail, "Barred if more than 50% at fault");
  assert.ok(!JSON.stringify(PA_COPY).includes("51%"));
  assert.ok(PA_COPY.firstPartyHelp.includes("Most car policies") && PA_COPY.firstPartyHelp.includes("§ 1722") && PA_COPY.firstPartyHelp.includes("health insurance"));
  assert.ok(!PA_LAW.tortOption.verifiedOn.includes("not yet opened") && !PA_LAW.sol.verifiedOn.includes("not yet opened"));
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

// ---- Breakdown base / clamp. Hand-worked (no liability term). ----
test("PA clamp floor: minor 1.5/2.0/2.5 + chiro −.15 + ≤1 mo −.15 + long gap −.45 = −0.75 → 0.75/1.25/1.75 → 1.25/1.25/1.75; real base 2.00", () => {
  const i = { ...pa, severity: "minor", careType: "chiro", treatmentMonths: 1, treatmentGap: "long" } as PaInputs;
  const m = multipliers(i);
  assert.equal(m.adjustment, -0.75);
  assert.deepEqual([m.low, m.mid, m.high, m.baseMid, m.clamped], [1.25, 1.25, 1.75, 2.0, true]);
  // econ 10,500; P&S 10,000 × 0.25/0.25/0.75 = 2,500/2,500/7,500 → 13,000/13,000/18,000
  assert.deepEqual(calculatePA(i).recoverable, { low: 13000, mid: 13000, high: 18000 });
});
test("PA no clamp on defaults: moderate 2.0/2.75/3.5 + .25 → 2.25/3.00/3.75, baseMid 2.75, clamped false", () => {
  const m = multipliers(pa);
  assert.deepEqual([m.low, m.mid, m.high, m.baseMid, m.clamped], [2.25, 3, 3.75, 2.75, false]);
});
test("PA clamp ceiling: catastrophic 4/5/6 + surgery .45 + 13 mo .45 + rated .55 = +1.45 → 5.45/6.45/7.45→7.00", () => {
  const i = { ...pa, severity: "catastrophic", careType: "surgery", treatmentMonths: 13, permanency: "rated" } as PaInputs;
  const m = multipliers(i);
  assert.deepEqual([m.low, m.mid, m.high, m.baseMid, m.clamped], [5.45, 6.45, 7, 5.0, true]);
  // P&S 10,000 × 4.45/5.45/6.00 = 44,500/54,500/60,000; + 10,500 → 55,000/65,000/70,500
  assert.deepEqual(calculatePA(i).recoverable, { low: 55000, mid: 65000, high: 70500 });
});

test("PA footer carries the approved Philadelphia principal-office sentence and keeps 115 S 8th St", async () => {
  const { readFileSync } = await import("node:fs");
  const c = JSON.parse(readFileSync(new URL("../../../clients/kaplunmarx-pa.json", import.meta.url), "utf8"));
  assert.equal(c.footerNote, "Cases are handled by lawyers who principally practice in our Philadelphia office.");
  assert.equal(c.officeAddress, "115 S 8th St Suite 5");
});
