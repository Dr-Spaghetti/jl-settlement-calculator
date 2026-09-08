import assert from "node:assert/strict";

export function applyComparativeFault(amount, faultPercent, category) {
  const fault = Math.max(0, Math.min(100, faultPercent));
  const safeAmount = Math.max(0, amount);
  switch (category) {
    case "pure-comparative":
      return { recoverable: safeAmount * (1 - fault / 100), barred: false };
    case "modified-50":
      if (fault >= 50) return { recoverable: 0, barred: true };
      return { recoverable: safeAmount * (1 - fault / 100), barred: false };
    case "modified-51":
      if (fault >= 51) return { recoverable: 0, barred: true };
      return { recoverable: safeAmount * (1 - fault / 100), barred: false };
    case "contributory":
      if (fault > 0) return { recoverable: 0, barred: true };
      return { recoverable: safeAmount, barred: false };
    default:
      return { recoverable: safeAmount * (1 - fault / 100), barred: false };
  }
}

const SEVERITY_BASE = {
  minor: { low: 1.5, mid: 2.0, high: 2.5 },
  moderate: { low: 2.0, mid: 2.75, high: 3.5 },
  severe: { low: 3.0, mid: 3.75, high: 4.5 },
  catastrophic: { low: 4.0, mid: 5.0, high: 6.0 },
};
const CARE = { chiro: -0.15, md: 0.1, surgery: 0.45 };
const LIABILITY = { clear: 0.25, mixed: -0.2, disputed: -0.55 };
const GAP = { none: 0, short: -0.2, long: -0.45 };
const PERM = { none: 0, possible: 0.25, rated: 0.55 };
const STATE_CAT = { AZ: "pure-comparative", NC: "contributory", TX: "modified-51" };

function treatmentAdj(months) {
  const m = Math.max(0, months);
  if (m <= 1) return -0.15;
  if (m <= 3) return 0;
  if (m <= 6) return 0.15;
  if (m <= 12) return 0.3;
  return 0.45;
}
function clamp(n) { return Math.max(1.25, Math.min(7, n)); }
function roundMoney(n) { return Math.round(n / 100) * 100; }

export function calculateSettlement(inputs) {
  const mode = inputs.formulaMode ?? "demand";
  const medical = Math.max(0, inputs.medicalBillsPast) + Math.max(0, inputs.medicalBillsFuture);
  const wages = Math.max(0, inputs.lostWages);
  const other = Math.max(0, inputs.otherOutOfPocket);
  const property = Math.max(0, inputs.propertyDamage);
  const base = SEVERITY_BASE[inputs.severity];
  const totalAdjustment =
    CARE[inputs.careType] + LIABILITY[inputs.liabilityClarity] + treatmentAdj(inputs.treatmentMonths) +
    GAP[inputs.treatmentGap ?? "none"] + PERM[inputs.permanency ?? "none"];
  const multiplierMid = clamp(base.mid + totalAdjustment);
  const multiplierLow = clamp(base.low + totalAdjustment);
  const multiplierHigh = clamp(base.high + totalAdjustment);
  function apply(mult) {
    if (mode === "adjuster") return medical * mult + wages + other + property;
    return (medical + wages + other) * mult + property;
  }
  const low = roundMoney(apply(multiplierLow));
  const mid = roundMoney(apply(multiplierMid));
  const high = roundMoney(apply(multiplierHigh));
  const category = STATE_CAT[inputs.usState] ?? "unknown";
  const fault = inputs.plaintiffFaultPercent ?? 0;
  const fLow = applyComparativeFault(low, fault, category);
  const fMid = applyComparativeFault(mid, fault, category);
  const fHigh = applyComparativeFault(high, fault, category);
  const recoverableLow = roundMoney(fLow.recoverable);
  const recoverableMid = roundMoney(fMid.recoverable);
  const recoverableHigh = roundMoney(fHigh.recoverable);
  const recoveryBarred = fLow.barred || fMid.barred || fHigh.barred;
  const limit = inputs.policyLimitPerPerson != null && Number.isFinite(inputs.policyLimitPerPerson) && inputs.policyLimitPerPerson > 0
    ? inputs.policyLimitPerPerson : null;
  let cappedMid = null;
  let policyLimitsMayBind = false;
  if (limit != null) {
    cappedMid = roundMoney(Math.min(recoverableMid, limit));
    policyLimitsMayBind = recoverableMid > limit;
  }
  return { low, mid, high, recoverableLow, recoverableMid, recoverableHigh, recoveryBarred, cappedMid, policyLimitsMayBind, formulaMode: mode };
}

const baseInputs = {
  medicalBillsPast: 12000, medicalBillsFuture: 3000, lostWages: 4500, otherOutOfPocket: 800,
  propertyDamage: 6500, severity: "moderate", treatmentMonths: 4, careType: "md",
  liabilityClarity: "clear", usState: "AZ", plaintiffFaultPercent: 0, treatmentGap: "none",
  permanency: "none", formulaMode: "demand",
};

console.log("Running calculator usefulness assertions...");

{
  const pre = calculateSettlement({ ...baseInputs, usState: "AZ", plaintiffFaultPercent: 0 });
  const post = calculateSettlement({ ...baseInputs, usState: "AZ", plaintiffFaultPercent: 20 });
  assert.equal(post.recoverableMid, roundMoney(pre.mid * 0.8));
  assert.equal(post.recoveryBarred, false);
  console.log("  OK AZ pure-comparative 20% fault");
}
{
  const post = calculateSettlement({ ...baseInputs, usState: "NC", plaintiffFaultPercent: 1 });
  assert.equal(post.recoverableMid, 0);
  assert.equal(post.recoveryBarred, true);
  console.log("  OK NC contributory 1% bars recovery");
}
{
  const barred = calculateSettlement({ ...baseInputs, usState: "TX", plaintiffFaultPercent: 51 });
  const recovers = calculateSettlement({ ...baseInputs, usState: "TX", plaintiffFaultPercent: 50 });
  assert.equal(barred.recoverableMid, 0);
  assert.equal(barred.recoveryBarred, true);
  assert.ok(recovers.recoverableMid > 0);
  assert.equal(recovers.recoveryBarred, false);
  const pre = calculateSettlement({ ...baseInputs, usState: "TX", plaintiffFaultPercent: 0 });
  assert.equal(recovers.recoverableMid, roundMoney(pre.mid * 0.5));
  console.log("  OK TX modified-51 51 barred / 50 reduced");
}
{
  const demand = calculateSettlement({ ...baseInputs, formulaMode: "demand", plaintiffFaultPercent: 0 });
  const adjuster = calculateSettlement({ ...baseInputs, formulaMode: "adjuster", plaintiffFaultPercent: 0 });
  assert.ok(baseInputs.lostWages > 0);
  assert.notEqual(demand.mid, adjuster.mid);
  assert.ok(demand.mid > adjuster.mid);
  console.log("  OK demand vs adjuster differ when wages > 0");
}
{
  const uncapped = calculateSettlement({ ...baseInputs, plaintiffFaultPercent: 0 });
  const limit = Math.max(1000, roundMoney(uncapped.recoverableMid / 2));
  assert.ok(uncapped.recoverableMid > limit);
  const capped = calculateSettlement({ ...baseInputs, plaintiffFaultPercent: 0, policyLimitPerPerson: limit });
  assert.equal(capped.cappedMid, limit);
  assert.equal(capped.policyLimitsMayBind, true);
  console.log("  OK policy per-person cap binds Mid");
}
{
  const r = applyComparativeFault(10000, 25, "pure-comparative");
  assert.equal(r.recoverable, 7500);
  console.log("  OK applyComparativeFault pure 25%");
}

console.log("All calculator tests passed.");
