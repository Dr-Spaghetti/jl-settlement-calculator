import { grossRange, multipliers, applyModifiedFault50, roundMoney, type CoreInputs } from "../core";

/**
 * Generic state engine for the firm-v1 template (NJ / IL / CA modules).
 * - fault "modified50": barred when plaintiff fault is greater than 50%; else reduced proportionally.
 * - fault "pure": never barred; reduced proportionally.
 * - Optional non-economic gate (NJ lawsuit limitation, CA Prop 213): "open" | "restricted" | "unsure",
 *   with an exception question when restricted. "unsure" shows BOTH scenarios (PA 'Not sure' pattern).
 * - Optional first-party offset (NJ PIP): benefits paid or payable subtracted from medical bills.
 * Economic losses are added once, never multiplied. Pain & suffering = gross medical × (m − 1) (estimate method, not law).
 */
export type FaultRule = "modified50" | "pure";
export type GateOption = "open" | "restricted" | "unsure";
export type YesNoUnsure = "yes" | "no" | "unsure";
export interface Range { low: number; mid: number; high: number }

export interface GatedInputs extends CoreInputs {
  gate: GateOption | null;
  gateException: YesNoUnsure;
  plaintiffFaultPercent: number;
  /** First-party benefit (e.g. NJ PIP medical limit); 0 when the state has none. */
  firstPartyMedical: number;
  /** null = Unknown (default). 0 is allowed (no bodily-injury coverage). */
  policyLimitPerPerson: number | null;
}

export interface GatedResult {
  m: ReturnType<typeof multipliers>;
  medicalOffset: number;
  economic: number;
  nonEconomicAllowed: boolean;
  nonEconomic: Range;
  preFault: Range;
  recoverable: Range;
  barred: boolean;
  faultPercent: number;
  capped: Range | null;
  policyLimitsMayBind: boolean;
  ifNonEconomicAvailable: Range | null;
  gateUnsure: { open: Range; restricted: Range } | null;
}

const validLimit = (lim: number | null): lim is number => lim != null && Number.isFinite(lim) && lim >= 0;

export function applyFault(rule: FaultRule, amount: number, f: number) {
  if (rule === "modified50") return applyModifiedFault50(amount, f);
  const p = Math.max(0, Math.min(100, f));
  return { recoverable: Math.max(0, amount) * (1 - p / 100), barred: false };
}

export function calculateGated(i: GatedInputs, rule: FaultRule): GatedResult {
  const g = grossRange(i);
  const med = Math.max(0, i.medicalBills);
  const medicalOffset = Math.min(med, Math.max(0, i.firstPartyMedical));
  const economic = med - medicalOffset + Math.max(0, i.lostWages) + Math.max(0, i.otherOutOfPocket) + Math.max(0, i.propertyDamage);
  const nonEcon: Range = { low: med * (g.m.low - 1), mid: med * (g.m.mid - 1), high: med * (g.m.high - 1) };
  const nonEconomicAllowed = i.gate === null || i.gate === "open" || (i.gate === "restricted" && i.gateException === "yes");
  const withNE: Range = { low: economic + nonEcon.low, mid: economic + nonEcon.mid, high: economic + nonEcon.high };
  const econOnly: Range = { low: economic, mid: economic, high: economic };
  const f = Math.max(0, Math.min(100, i.plaintiffFaultPercent));
  const fault = (r: Range) => ({
    r: { low: roundMoney(applyFault(rule, r.low, f).recoverable), mid: roundMoney(applyFault(rule, r.mid, f).recoverable), high: roundMoney(applyFault(rule, r.high, f).recoverable) },
    barred: applyFault(rule, r.low, f).barred,
  });
  const lim = i.policyLimitPerPerson;
  const capR = (r: Range): Range => (validLimit(lim) ? { low: Math.min(r.low, lim), mid: Math.min(r.mid, lim), high: Math.min(r.high, lim) } : r);
  const pre = nonEconomicAllowed ? withNE : econOnly;
  const rec = fault(pre);
  const capped = validLimit(lim) ? capR(rec.r) : null;
  return {
    m: g.m, medicalOffset, economic: roundMoney(economic), nonEconomicAllowed,
    nonEconomic: nonEconomicAllowed ? { low: roundMoney(nonEcon.low), mid: roundMoney(nonEcon.mid), high: roundMoney(nonEcon.high) } : { low: 0, mid: 0, high: 0 },
    preFault: { low: roundMoney(pre.low), mid: roundMoney(pre.mid), high: roundMoney(pre.high) },
    recoverable: rec.r, barred: rec.barred, faultPercent: f, capped,
    policyLimitsMayBind: validLimit(lim) && rec.r.high > lim,
    ifNonEconomicAvailable: nonEconomicAllowed ? null : fault(withNE).r,
    gateUnsure: i.gate === "unsure" ? { open: capR(fault(withNE).r), restricted: capR(fault(econOnly).r) } : null,
  };
}

/** Everything a state needs to render on the shared page (copy + law + options). */
export interface StateKit {
  code: "NJ" | "IL" | "CA";
  faultRule: FaultRule;
  copy: {
    regionName: string; heroTitleA: string; heroTitleB: string;
    faultChip: { title: string; detail: string }; topbarRule: string; faultNote: string;
    /** "{fault}" is replaced with the fault %. */
    barredNote: string;
    how: [string, string][];
    faq: readonly { q: string; a: string }[];
    policyHelp: string;
    /** "{limit}" is replaced with the entered limit. */
    policyBanner: string;
  };
  gate?: {
    label: string; help: string; options: { id: GateOption; label: string }[];
    exceptionsSummary: string; exceptions: string; exceptionQuestion: string; unsureNote: string;
    scenarioOpen: string; scenarioRestricted: string; headingUnsure: string; restrictedNote: string;
    breakdownNotIncluded: string; defaultOption: GateOption;
  };
  offset?: { label: string; help: string; defaultValue: number; breakdownLabel: string };
  policyOptions: { id: string; label: string; value: number | null }[];
}
