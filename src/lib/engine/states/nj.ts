import type { StateKit } from "./gated";

/** New Jersey law values. Each carries its official source and verification date (see AUDIT-kaplunmarx-nj.md). */
export const NJ_LAW = {
  minLiability: {
    perPerson: 35000, perAccident: 70000, propertyDamage: 25000, priorPerPerson: 25000,
    cite: "N.J.S.A. 39:6B-1(a) as amended by P.L.2022, c.87 (standard policies issued or renewed on or after Jan 1, 2026)",
    source: "https://pub.njleg.gov/Bills/2022/PL22/87_.HTM", verifiedOn: "2026-10-09",
  },
  basicPolicy: { optionalBodilyInjury: 10000, cite: "NJ DOBI Buyer's Guide 2026 (basic policy: bodily injury not included; $10,000 optional)", source: "https://www.nj.gov/dobi/division_consumers/pdf/autoguide2026.pdf", verifiedOn: "2026-10-09" },
  pip: { commonLimit: 250000, basicLimit: 15000, cite: "N.J.S.A. 39:6A-12; NJ DOBI Buyer's Guide 2026; Haines v. Taft, 237 N.J. 271 (2019)", source: "https://www.nj.gov/dobi/division_consumers/pdf/autoguide2026.pdf", verifiedOn: "2026-10-09" },
  fault: { cite: "N.J.S.A. 2A:15-5.1", source: "https://lis.njleg.state.nj.us/nxt/gateway.dll/statutes%2F1%2F112%2F352", verifiedOn: "2026-10-09" },
  lawsuitOption: { cite: "N.J.S.A. 39:6A-8(a), (b); 39:6A-8.1(a), (b)", source: "https://lis.njleg.state.nj.us/nxt/gateway.dll/statutes/1/32674/34098", verifiedOn: "2026-10-09 (official page text via search excerpt; NJ Supreme Court opinions quoting § 8(a); DOBI guide)" },
  sol: { years: 2, cite: "N.J.S.A. 2A:14-2(a)", source: "https://lis.njleg.state.nj.us/nxt/gateway.dll/statutes%2F1%2F112%2F308", verifiedOn: "2026-10-09" },
} as const;

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const POLICY_HELP_TAIL = "your own underinsured or uninsured motorist coverage (if you bought it) or other sources may apply.";

export const NJ_KIT: StateKit = {
  code: "NJ",
  faultRule: "modified50",
  copy: {
    regionName: "New Jersey",
    heroTitleA: "New Jersey Car Accident",
    heroTitleB: "Settlement Calculator",
    faultChip: { title: "NJ fault rule", detail: "Barred if more than 50% at fault" },
    topbarRule: "New Jersey comparative negligence: barred if more than 50% at fault",
    faultNote:
      "New Jersey's Comparative Negligence Act (N.J.S.A. 2A:15-5.1): your damages are reduced by your percentage of negligence, and you can't recover if your negligence is greater than that of the person you sue (or the combined negligence of the people you sue).",
    barredNote: `At {fault}% fault, your negligence would be greater than that of the people you sue, which bars recovery in New Jersey (N.J.S.A. 2A:15-5.1).`,
    how: [
      ["Economic losses", "Medical bills (less up to $250,000 covered by the PIP rules), lost wages, other out-of-pocket costs and property damage are added once. They are never multiplied."],
      ["Pain & suffering", "Pain and suffering = medical bills × (multiplier − 1), on gross medical bills (including any your PIP pays). The multiplier range comes from injury severity, treatment and liability. Shared or disputed liability lowers the estimate in addition to the fault %. This is an estimate method, not law, and not how any insurer or court must value a claim."],
      ["State rules", "Comparative negligence (N.J.S.A. 2A:15-5.1) and your policy's lawsuit option (N.J.S.A. 39:6A-8) are applied as described in the calculator."],
      ["Policy reality", `A policy limit is not a legal cap on damages. If you enter the at-fault driver's limit, the shown range stops there as a practical collection estimate; ${POLICY_HELP_TAIL} If you don't know the limit, nothing is limited.`],
    ],
    policyHelp: `Not a legal cap on damages. This driver's insurance may stop at this limit; ${POLICY_HELP_TAIL}`,
    policyBanner: `this driver's insurance may stop at the {limit} limit you entered; ${POLICY_HELP_TAIL}`,
    faq: [
      {
        q: "What is the difference between the limitation on lawsuit and no limitation on lawsuit options?",
        a: "New Jersey drivers choose a lawsuit option on their own policy (N.J.S.A. 39:6A-8). With no limitation on lawsuit, you keep the right to sue for pain and suffering for any injury. With the limitation on lawsuit option (often called the verbal threshold), pain and suffering is recoverable only for an injury that results in death; dismemberment; significant disfigurement or significant scarring; displaced fractures; loss of a fetus; or a permanent injury within a reasonable degree of medical probability, other than scarring or disfigurement. Choosing the limitation does not affect your ability to sue for economic damages such as medical expenses and lost wages (NJ DOBI).",
      },
      {
        q: "How does my share of fault affect a New Jersey claim?",
        a: "Under N.J.S.A. 2A:15-5.1, your damages are reduced by your percentage of negligence. If your negligence is greater than that of the person you sue (or the combined negligence of the people you sue), you can't recover. The calculator applies both rules.",
      },
      {
        q: "Why does the calculator subtract my medical bills covered by PIP?",
        a: "Evidence of medical expenses collectible or paid under PIP is inadmissible in your lawsuit for bodily injury (N.J.S.A. 39:6A-12). Under a standard policy, the New Jersey Supreme Court held that this covers medical expenses up to $250,000 even if you chose a lower PIP limit (Haines v. Taft, 237 N.J. 271 (2019)). So the calculator subtracts up to $250,000 of medical bills. Pain and suffering is still estimated from your gross medical bills.",
      },
      {
        q: "How long do I have to file a car accident lawsuit in New Jersey?",
        a: "Generally two years after the cause of action accrues (N.J.S.A. 2A:14-2), except as otherwise provided by law. Confirm your deadline with a New Jersey attorney.",
      },
      {
        q: "What if the at-fault driver only has the minimum insurance?",
        a: `For standard policies issued or renewed on or after January 1, 2026, New Jersey's minimum bodily-injury liability is ${usd(NJ_LAW.minLiability.perPerson)} per person and ${usd(NJ_LAW.minLiability.perAccident)} per accident (N.J.S.A. 39:6B-1). A basic policy does not include bodily-injury liability unless the optional $10,000 coverage was bought. A policy limit is not a legal cap on damages: this driver's insurance may stop at that limit, and ${POLICY_HELP_TAIL} Leave the policy limit on Unknown if you don't know it.`,
      },
    ],
  },
  gate: {
    label: "Your own policy's lawsuit option",
    help: "Your own auto policy's lawsuit option matters in New Jersey (N.J.S.A. 39:6A-8). With the limitation on lawsuit option, you can't recover pain and suffering unless your injury is in one of the categories the law lists. It does not affect your ability to sue for economic damages such as medical expenses and lost wages (NJ DOBI).",
    options: [
      { id: "open", label: "No limitation on lawsuit" },
      { id: "restricted", label: "Limitation on lawsuit (verbal threshold)" },
      { id: "unsure", label: "Not sure" },
    ],
    exceptionsSummary: "Injury categories (N.J.S.A. 39:6A-8(a))",
    exceptions:
      "With the limitation on lawsuit option, pain and suffering is recoverable only for a bodily injury that results in death; dismemberment; significant disfigurement or significant scarring; displaced fractures; loss of a fetus; or a permanent injury within a reasonable degree of medical probability, other than scarring or disfigurement. An injury is considered permanent when the body part or organ has not healed to function normally and will not heal to function normally with further medical treatment.",
    exceptionQuestion: "Does your injury fall into one of those categories (for example, a displaced fracture or a permanent injury)?",
    unsureNote:
      "If the named insured didn't choose a lawsuit option, New Jersey law treats the policy as having the limitation on lawsuit option (N.J.S.A. 39:6A-8.1(b)), and a basic policy includes it (NJ DOBI). The choice applies to you, your spouse, children and other relatives living with you who are not covered under another auto policy (NJ DOBI).",
    scenarioOpen: "If no limitation on lawsuit",
    scenarioRestricted: "If limitation, no listed injury",
    headingUnsure: "Two Scenarios: Lawsuit Option Not Sure",
    restrictedNote: "Limitation on lawsuit: if your injury is in a listed category (or you have no limitation), pain and suffering could be included.",
    breakdownNotIncluded: "Not included (lawsuit option)",
    defaultOption: "unsure",
  },
  offset: {
    label: "Medical bills covered by the PIP rules",
    help: "In New Jersey, evidence of medical expenses collectible or paid under PIP is inadmissible in your lawsuit for bodily injury (N.J.S.A. 39:6A-12). Under a standard policy, that bars medical expenses up to $250,000 even if you chose a lower PIP limit (Haines v. Taft, 237 N.J. 271 (2019)), so up to $250,000 of your medical bills is subtracted here. If your situation is different (for example, you have no New Jersey auto policy), change this amount; an attorney can confirm what applies. Estimate simplification: PIP deductibles, copayments and income benefits are not adjusted for.",
    defaultValue: NJ_LAW.pip.commonLimit,
    breakdownLabel: "Less medical expenses covered by PIP rules (39:6A-12)",
  },
  policyOptions: [
    { id: "unknown", label: "Unknown", value: null },
    { id: "basic0", label: "No bodily-injury coverage (basic policy)", value: 0 },
    { id: "basic10", label: "$10,000 (basic policy optional coverage)", value: NJ_LAW.basicPolicy.optionalBodilyInjury },
    { id: "std25", label: "$25,000 per person (standard, issued/renewed 2023–2025)", value: NJ_LAW.minLiability.priorPerPerson },
    { id: "min", label: `${usd(NJ_LAW.minLiability.perPerson)} per person (standard minimum from Jan 1, 2026)`, value: NJ_LAW.minLiability.perPerson },
    { id: "50k", label: "$50,000 per person", value: 50000 },
    { id: "100k", label: "$100,000 per person", value: 100000 },
    { id: "250k", label: "$250,000 per person", value: 250000 },
  ],
};
