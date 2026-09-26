import type { ClientConfig } from "./types";

/**
 * Djougourian (CA) disclaimer copy. Every clause maps to a CA requirement or a
 * clear best practice (see PR description for the citation table):
 *  - Rule 7.1 & cmts [2]-[4]; Bus. & Prof. Code 6157.1, 6157.2(a)(1), 6158, 6158.1(c)
 *  - Rule 7.2(c) + B&P 6157.2(b): responsible firm name + office location/address
 *  - CCP 335.1 / Gov. Code 911.2: deadline caution
 * Firm counsel must approve before production.
 */

export const DJ_PLACEHOLDER_ADDRESS =
  "[Office street address — pending firm confirmation]";
export const DJ_PLACEHOLDER_ATTORNEY =
  "[Responsible attorney — pending firm confirmation]";

export function djOfficeLine(client: ClientConfig): string {
  const street = client.officeAddress?.trim() || DJ_PLACEHOLDER_ADDRESS;
  return `${street}, ${client.city}, ${client.state}`;
}

export function djResponsibleAttorney(client: ClientConfig): string {
  return client.responsibleAttorney?.trim() || DJ_PLACEHOLDER_ATTORNEY;
}

/** One-line qualifier shown directly next to every dollar estimate. */
export const DJ_ESTIMATE_QUALIFIER =
  "Educational estimate only — not a guarantee, prediction, or offer of any result, and not legal advice. It is calculated only from the numbers you entered using a simplified formula; the actual value of a claim depends on the specific facts.";

export type DisclaimerItem = { title: string; body: string };

export function djDisclaimerItems(client: ClientConfig): DisclaimerItem[] {
  return [
    {
      title: "Not a guarantee or prediction",
      body: `The figures this calculator shows are not a guarantee, warranty, or prediction of the outcome of any claim, and they are not an appraisal of your case or an offer of settlement by ${client.firmName} or anyone else.`,
    },
    {
      title: "How the figures are calculated",
      body: "The calculator applies a simplified formula only to the numbers you enter: your economic losses are multiplied by a general pain-and-suffering range (about 1.5× for minor injuries up to 6× for catastrophic injuries), adjusted for the factors you select, reduced by any fault percentage you enter, and, if you enter policy limits, capped at those limits. These multiplier ranges are general rules of thumb. They are not based on the firm’s case results, jury-verdict data, or any insurance company’s software. The sample ranges in the table are rounded illustrations of the same approach, not averages.",
    },
    {
      title: "Results depend on your facts",
      body: "The actual value of a claim depends on liability, evidence, medical records, available insurance, venue, prior injuries, and negotiation or trial, none of which this tool can evaluate. Results in other matters, including any results the firm has obtained, do not guarantee or predict a similar result in yours.",
    },
    {
      title: "Not legal advice; no attorney-client relationship",
      body: "This calculator provides general information only and is not legal advice. Using it does not create an attorney-client relationship with the firm or any lawyer.",
    },
    {
      title: "Your information",
      body: "The calculator runs entirely in your web browser. The numbers you enter are not sent to or stored by the firm and are cleared when you reload or leave the page, so they are not a communication with a lawyer. As with any website, the hosting provider may log standard technical data (such as IP address and browser type) when the page loads.",
    },
    {
      title: "Deadlines apply — act promptly",
      body: "California law sets strict deadlines. Many personal-injury lawsuits must be filed within two years (Code Civ. Proc. § 335.1), and a claim against a public entity generally must be presented within six months (Gov. Code § 911.2). Other deadlines and exceptions may apply. Talk with a licensed California attorney promptly.",
    },
    {
      title: "Fees and costs",
      body: "Ask about attorney fees and who pays case costs during your free consultation. Any fee arrangement is set in a written agreement.",
    },
  ];
}
