import { PA_LAW } from "./pa";

/** Pennsylvania page copy (English). Spanish/other locales add a sibling file. */
export const PA_COPY = {
  regionName: "Pennsylvania",
  heroTitleA: "Pennsylvania Car Accident",
  heroTitleB: "Settlement Calculator",
  faultChip: { title: "PA fault rule", detail: "Barred if more than 50% at fault" },
  topbarRule: "Pennsylvania comparative fault: barred if more than 50% at fault",
  faultNote:
    "Pennsylvania uses modified comparative negligence (42 Pa.C.S. § 7102): your recovery is reduced by your share of fault, and barred if you are more than 50% at fault.",
  tortHelp:
    "Your own auto policy's tort option matters in Pennsylvania (75 Pa.C.S. § 1705). Full tort keeps the right to seek pain and suffering. Limited tort generally does not, unless an exception applies.",
  tortExceptionsSummary: "Limited-tort exceptions (§ 1705(d))",
  tortExceptions:
    "Even with limited tort, you can seek pain and suffering if your injury is a serious injury (death, serious impairment of body function, or permanent serious disfigurement), or if the at-fault driver: was convicted of or accepted ARD for DUI in this crash; was driving a vehicle registered in another state; intended to cause injury; or had no required insurance. You also keep full tort rights if you were in a vehicle other than a private passenger car (e.g., a bus or commercial vehicle), or for a vehicle-defect claim against a business that designs, manufactures, repairs, services or maintains vehicles (not for a vehicle that business was operating).",
  tortExceptionQuestion: "Serious injury (death, serious impairment of body function, or permanent serious disfigurement), or does another exception apply?",
  tortUnsureNote:
    "If no one on your policy elected limited tort, Pennsylvania presumes full tort (75 Pa.C.S. § 1705(a)(3)). If you don't own a car and aren't covered under any household auto policy, you are generally not limited (§ 1705(b)(3)). An owner of a registered car without insurance is treated as limited tort (§ 1705(a)(5)).",
  firstPartyHelp:
    "Most car policies pay at least $5,000 of your medical bills first (75 Pa.C.S. § 1711). Benefits paid or payable this way are not recovered again from the at-fault driver (§ 1722), so they are subtracted here. Bills paid by health insurance or other benefits generally can't be recovered from the other driver either. Enter $0 if you have no such coverage (for example, on a motorcycle).",
  policyMinLabel: `PA minimum: $${PA_LAW.minLiability.perPerson.toLocaleString("en-US")} per person / $${PA_LAW.minLiability.perAccident.toLocaleString("en-US")} per accident`,
  faq: [
    {
      q: "What is the difference between full tort and limited tort?",
      a: "Pennsylvania drivers choose a tort option on their own policy (75 Pa.C.S. § 1705). Full tort keeps the right to seek pain and suffering for any injury. Limited tort costs less but generally limits pain and suffering to cases with a \"serious injury\" (death, serious impairment of body function, or permanent serious disfigurement) or another § 1705(d) exception. Economic losses such as medical bills and lost wages can be claimed under either option. Your declarations page shows which option you chose.",
    },
    {
      q: "How does my share of fault affect a Pennsylvania claim?",
      a: "Under 42 Pa.C.S. § 7102, your recovery is reduced by your percentage of fault. If you are more than 50% at fault, you generally cannot recover from the other drivers. The calculator applies both rules.",
    },
    {
      q: "Why does the calculator subtract up to $5,000 of my medical bills?",
      a: "Most Pennsylvania car policies include at least $5,000 of first-party medical benefits (75 Pa.C.S. § 1711; motorcycles are excluded). Your own insurer pays those bills first, and benefits paid or payable are not recovered again from the at-fault driver (§ 1722). Bills paid by health insurance or other benefits generally can't be recovered from the other driver either. Enter your actual medical benefit in Step 3, or $0 if you have none.",
    },
    {
      q: "How long do I have to file a car accident lawsuit in Pennsylvania?",
      a: "Generally two years from the date of the injury (42 Pa.C.S. § 5524). Exceptions can shorten or extend that time, and claims against government entities have extra notice rules. Confirm your deadline with a Pennsylvania attorney.",
    },
    {
      q: "What if the at-fault driver only has the minimum insurance?",
      a: "Pennsylvania's minimum bodily-injury liability is $15,000 per person and $30,000 per accident (75 Pa.C.S. § 1702). A policy limit is not a legal cap on damages: this driver's insurance may stop at that limit, and your underinsured motorist coverage (if you bought it) or other sources may apply. Leave the policy limit on Unknown if you don't know it.",
    },
  ],
} as const;
