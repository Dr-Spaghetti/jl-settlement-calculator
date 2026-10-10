import type { StateKit } from "./gated";

/** California law values. Each carries its official source and verification date (see AUDIT-omegalaw-ca.md). */
const LI = (code: string, sec: string) => `https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${code}&sectionNum=${sec}`;
export const CA_LAW = {
  minLiability: { perPerson: 30000, perAccident: 60000, propertyDamage: 15000, cite: "Veh. Code § 16056(a)(2) (policies issued or renewed on or after Jan 1, 2025)", source: LI("VEH", "16056"), verifiedOn: "2026-10-09" },
  fault: { cite: "Li v. Yellow Cab Co. (1975) 13 Cal.3d 804, 829", source: "https://scocal.stanford.edu/opinion/li-v-yellow-cab-co-27850/", verifiedOn: "2026-10-09" },
  prop213: { cite: "Civ. Code § 3333.4 (Prop. 213, 1996)", source: LI("CIV", "3333.4"), verifiedOn: "2026-10-09" },
  sol: { years: 2, cite: "Code Civ. Proc. § 335.1", source: LI("CCP", "335.1"), verifiedOn: "2026-10-09" },
  govClaimMonths: { months: 6, cite: "Gov. Code § 911.2(a)", source: LI("GOV", "911.2"), verifiedOn: "2026-10-09" },
} as const;

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const TAIL = "your own underinsured motorist coverage (included unless you rejected it in writing; it applies only if your limit is higher than the at-fault driver's) or other sources may apply.";
const PROP213_LIST =
  "you were driving under the influence (Vehicle Code § 23152 or 23153) and were convicted of that offense; you owned a vehicle involved in the crash that was not insured as required by California's financial responsibility laws; or you were driving a vehicle involved in the crash and can't establish the financial responsibility those laws require";

export const CA_KIT: StateKit = {
  code: "CA",
  faultRule: "pure",
  copy: {
    regionName: "California",
    heroTitleA: "California Car Accident",
    heroTitleB: "Settlement Calculator",
    faultChip: { title: "CA fault rule", detail: "Reduced by your share, not barred" },
    topbarRule: "California pure comparative negligence: reduced by your share of fault",
    faultNote:
      "California uses pure comparative negligence (Li v. Yellow Cab Co. (1975) 13 Cal.3d 804): your own negligence does not bar recovery, but damages are reduced in proportion to the negligence attributable to you.",
    barredNote: "",
    how: [
      ["Economic losses", "Medical bills, lost wages, other out-of-pocket costs and property damage are added once. They are never multiplied."],
      ["Pain & suffering", "Pain and suffering = medical bills × (multiplier − 1). The multiplier range comes from injury severity, treatment. Your share of fault is applied only once, as the statutory percentage reduction (pure comparative fault, no bar). This is an estimate method, not law, and not how any insurer or court must value a claim."],
      ["State rules", "California pure comparative negligence and Proposition 213 (Civil Code § 3333.4) are applied as described in the calculator."],
      ["Policy reality", `A policy limit is not a legal cap on damages. If you enter the at-fault driver's per-person limit, the shown range stops there as a practical collection estimate; ${TAIL} If you don't know the limit, nothing is limited.`],
    ],
    policyHelp: `Not a legal cap on damages. This driver's insurance may stop at this limit; ${TAIL}`,
    policyBanner: `this driver's insurance may stop at the {limit} per-person limit you entered; ${TAIL}`,
    faq: [
      {
        q: "How does my share of fault affect a California claim?",
        a: "California uses pure comparative negligence (Li v. Yellow Cab Co. (1975) 13 Cal.3d 804). Your own negligence does not bar recovery, but your damages are reduced in proportion to the negligence attributable to you. The calculator reduces the estimate by the fault % you enter.",
      },
      {
        q: "What is Proposition 213?",
        a: `Under Civil Code § 3333.4 (Proposition 213), in a case arising out of the operation or use of a motor vehicle, you can't recover non-economic losses such as pain and suffering if ${PROP213_LIST}. If the only reason is that you owned an uninsured vehicle, you can still recover them when the other driver was driving under the influence and was convicted of that offense (§ 3333.4(c)).`,
      },
      {
        q: "How long do I have to file a car accident lawsuit in California?",
        a: "Generally within two years (Code Civ. Proc. § 335.1). A claim against a public entity for personal injury generally must be presented no later than six months after the cause of action accrues (Gov. Code § 911.2(a)). Confirm your deadline with a California attorney.",
      },
      {
        q: "What if the at-fault driver only has the minimum insurance?",
        a: `For policies issued or renewed on or after January 1, 2025, California's minimum bodily-injury liability is ${usd(CA_LAW.minLiability.perPerson)} per person and ${usd(CA_LAW.minLiability.perAccident)} per accident (Veh. Code § 16056(a)(2)). A policy limit is not a legal cap on damages: this driver's insurance may stop at that limit, and ${TAIL} Leave the policy limit on Unknown if you don't know it.`,
      },
    ],
  },
  gate: {
    label: "Does Proposition 213 apply to you?",
    help: `Under Civil Code § 3333.4 (Proposition 213), you can't recover pain and suffering from a car crash if ${PROP213_LIST}. Economic losses are not affected.`,
    options: [
      { id: "open", label: "No" },
      { id: "restricted", label: "Yes" },
      { id: "unsure", label: "Not sure" },
    ],
    exceptionsSummary: "Exception (Civ. Code § 3333.4(c))",
    exceptions: "If the only reason is that you owned a vehicle that wasn't insured as required, you can still recover pain and suffering when the other driver was driving under the influence (Vehicle Code § 23152 or 23153) and was convicted of that offense.",
    exceptionQuestion: "Does that exception apply (uninsured owner only, and the other driver was convicted of DUI for this crash)?",
    unsureNote: "Proposition 213 limits pain and suffering only in the three situations listed in Civil Code § 3333.4(a). If none of them applies to you, it doesn't limit your claim.",
    scenarioOpen: "If Prop 213 does not apply",
    scenarioRestricted: "If Prop 213 applies, no exception",
    headingUnsure: "Two Scenarios: Proposition 213 Not Sure",
    restrictedNote: "Proposition 213: if it doesn't apply to you (or the § 3333.4(c) exception applies), pain and suffering could be included.",
    breakdownNotIncluded: "Not included (Prop 213)",
    defaultOption: "unsure",
  },
  policyOptions: [
    { id: "unknown", label: "Unknown", value: null },
    { id: "min", label: `${usd(CA_LAW.minLiability.perPerson)} per person (CA minimum, policies from Jan 1, 2025)`, value: CA_LAW.minLiability.perPerson },
    { id: "50k", label: "$50,000 per person", value: 50000 },
    { id: "100k", label: "$100,000 per person", value: 100000 },
    { id: "250k", label: "$250,000 per person", value: 250000 },
  ],
};
