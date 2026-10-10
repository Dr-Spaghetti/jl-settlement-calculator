import type { StateKit } from "./gated";

/** Illinois law values. Each carries its official source and verification date (see AUDIT-choosecharlie-il.md). */
const ILCS = (doc: string) => `https://www.ilga.gov/documents/legislation/ilcs/documents/${doc}.htm`;
export const IL_LAW = {
  minLiability: { perPerson: 25000, perAccident: 50000, propertyDamage: 20000, cite: "625 ILCS 5/7-203 (policies issued or renewed on or after Jan 1, 2015); required by 625 ILCS 5/7-601(a)", source: ILCS("062500050K7-203"), verifiedOn: "2026-10-09" },
  fault: { cite: "735 ILCS 5/2-1116", source: ILCS("073500050K2-1116"), verifiedOn: "2026-10-09" },
  sol: { years: 2, cite: "735 ILCS 5/13-202", source: ILCS("073500050K13-202"), verifiedOn: "2026-10-09" },
  localEntitySol: { years: 1, cite: "745 ILCS 10/8-101(a)", source: ILCS("074500100K8-101"), verifiedOn: "2026-10-09" },
} as const;

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const TAIL = "your own underinsured motorist coverage (if you have it) or other sources may apply.";

export const IL_KIT: StateKit = {
  code: "IL",
  faultRule: "modified50",
  copy: {
    regionName: "Illinois",
    heroTitleA: "Illinois Car Accident",
    heroTitleB: "Settlement Calculator",
    faultChip: { title: "IL fault rule", detail: "Barred if more than 50% at fault" },
    topbarRule: "Illinois comparative fault: barred if more than 50% at fault",
    faultNote:
      "Illinois law (735 ILCS 5/2-1116): you can't recover if your fault is more than 50% of the proximate cause of the injury; otherwise your damages are reduced in proportion to your fault.",
    barredNote: "At {fault}% fault, your fault would be more than 50% of the proximate cause, which bars recovery in Illinois (735 ILCS 5/2-1116).",
    how: [
      ["Economic losses", "Medical bills, lost wages, other out-of-pocket costs and property damage are added once. They are never multiplied."],
      ["Pain & suffering", "Pain and suffering = medical bills × (multiplier − 1). The multiplier range comes from injury severity, treatment and liability. Shared or disputed liability lowers the estimate in addition to the fault %. This is an estimate method, not law, and not how any insurer or court must value a claim."],
      ["State rules", "Illinois comparative fault (735 ILCS 5/2-1116) is applied as described in the calculator."],
      ["Policy reality", `A policy limit is not a legal cap on damages. If you enter the at-fault driver's per-person limit, the shown range stops there as a practical collection estimate; ${TAIL} If you don't know the limit, nothing is limited.`],
    ],
    policyHelp: `Not a legal cap on damages. This driver's insurance may stop at this limit; ${TAIL}`,
    policyBanner: `this driver's insurance may stop at the {limit} per-person limit you entered; ${TAIL}`,
    faq: [
      {
        q: "How does my share of fault affect an Illinois claim?",
        a: "Under 735 ILCS 5/2-1116, your damages are reduced in proportion to your fault. If your fault is more than 50% of the proximate cause of the injury, you can't recover. The calculator applies both rules.",
      },
      {
        q: "How long do I have to file a car accident lawsuit in Illinois?",
        a: "Generally within 2 years after the cause of action accrued (735 ILCS 5/13-202). A civil action against a local entity or any of its employees generally must be commenced within one year from the date the injury was received or the cause of action accrued (745 ILCS 10/8-101(a)). Confirm your deadline with an Illinois attorney.",
      },
      {
        q: "What if the at-fault driver only has the minimum insurance?",
        a: `Illinois requires liability insurance (625 ILCS 5/7-601) of at least ${usd(IL_LAW.minLiability.perPerson)} per person and ${usd(IL_LAW.minLiability.perAccident)} per crash for bodily injury (625 ILCS 5/7-203). A policy limit is not a legal cap on damages: this driver's insurance may stop at that limit, and ${TAIL} Leave the policy limit on Unknown if you don't know it.`,
      },
    ],
  },
  policyOptions: [
    { id: "unknown", label: "Unknown", value: null },
    { id: "min", label: `${usd(IL_LAW.minLiability.perPerson)} per person (Illinois minimum)`, value: IL_LAW.minLiability.perPerson },
    { id: "50k", label: "$50,000 per person", value: 50000 },
    { id: "100k", label: "$100,000 per person", value: 100000 },
    { id: "250k", label: "$250,000 per person", value: 250000 },
  ],
};
