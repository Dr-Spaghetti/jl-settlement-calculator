import { PA_LAW } from "./pa";

/** Pennsylvania page copy (English). Spanish/other locales add a sibling file. */
export const PA_COPY = {
  regionName: "Pennsylvania",
  heroTitleA: "Pennsylvania Car Accident",
  heroTitleB: "Settlement Calculator",
  faultChip: { title: "PA 51% Bar", detail: "Modified comparative fault" },
  topbarRule: "Pennsylvania modified comparative fault (51% bar)",
  faultNote:
    "Pennsylvania uses modified comparative negligence (42 Pa.C.S. § 7102): your recovery is reduced by your share of fault, and barred if you are more than 50% at fault.",
  tortHelp:
    "Your own auto policy's tort option matters in Pennsylvania (75 Pa.C.S. § 1705). With limited tort, pain and suffering is generally recoverable only for a \"serious injury\" or if certain exceptions apply (for example, some DUI cases or an out-of-state vehicle).",
  firstPartyHelp: `Your own policy pays medical bills first (at least $${PA_LAW.firstPartyMedical.minimum.toLocaleString("en-US")}, 75 Pa.C.S. § 1711). Those bills are not recovered again from the at-fault driver, so they are subtracted here.`,
  policyMinLabel: `PA minimum: $${PA_LAW.minLiability.perPerson.toLocaleString("en-US")} per person / $${PA_LAW.minLiability.perAccident.toLocaleString("en-US")} per accident`,
  faq: [
    {
      q: "What is the difference between full tort and limited tort?",
      a: "Pennsylvania drivers choose a tort option on their own policy (75 Pa.C.S. § 1705). Full tort keeps the right to seek pain and suffering for any injury. Limited tort costs less but generally limits pain and suffering to cases with a \"serious injury\" or another exception. Economic losses such as medical bills and lost wages can be claimed under either option. Your declarations page shows which option you chose.",
    },
    {
      q: "How does my share of fault affect a Pennsylvania claim?",
      a: "Under 42 Pa.C.S. § 7102, your recovery is reduced by your percentage of fault. If you are more than 50% at fault, you generally cannot recover from the other drivers. The calculator applies both rules.",
    },
    {
      q: "Why does the calculator subtract $5,000 of my medical bills?",
      a: "Pennsylvania policies must include at least $5,000 of first-party medical benefits (75 Pa.C.S. § 1711). Your own insurer pays those bills first, and they are not recovered again from the at-fault driver (§ 1722). If your policy has a higher medical benefit, enter it in Step 3.",
    },
    {
      q: "How long do I have to file a car accident lawsuit in Pennsylvania?",
      a: "Generally two years from the date of the injury (42 Pa.C.S. § 5524). Exceptions can shorten or extend that time, and claims against government entities have extra notice rules. Confirm your deadline with a Pennsylvania attorney.",
    },
    {
      q: "What if the at-fault driver only has the minimum insurance?",
      a: "Pennsylvania's minimum bodily-injury liability is $15,000 per person and $30,000 per accident (75 Pa.C.S. § 1702). If your losses exceed the other driver's limits, your own underinsured motorist coverage may matter. Leave the policy limit on Unknown if you don't know it.",
    },
  ],
} as const;
