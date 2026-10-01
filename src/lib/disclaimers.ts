import type { ClientConfig, OfferRealityCheck } from "./types";

/**
 * Djougourian (CA) disclaimer copy: kept deliberately minimal.
 *  - Estimate qualifier: rendered under the estimate figures.
 *  - Footer legal line: responsible firm/attorney + office (Rule 7.2(c);
 *    Bus. & Prof. Code 6157.2(b)) and no attorney-client relationship.
 * Bracketed values are placeholders until the firm confirms them in clients/djougourian-law.json.
 */

export const DJ_ESTIMATE_QUALIFIER =
  "Estimate only. Not a guarantee of any result or legal advice.";

export const DJ_OFFER_NOTE =
  "This comparison is educational only and is not advice on whether to accept or reject an offer.";

/** Neutral (non-advice) band copy for the djlaw Offer Reality Check. */
const DJ_OFFER_BAND_COPY: Record<OfferRealityCheck["label"], string> = {
  "well-below":
    "This offer sits well below the mid-range educational estimate for the inputs you entered. An attorney can explain how documentation and negotiation may affect an offer.",
  below:
    "This offer is below the mid-range educational estimate. Where it lands depends on liability, medical proof, and insurance limits.",
  near:
    "This offer is near the mid-range educational estimate. Whether it is fair depends on case specifics an attorney can evaluate.",
  above:
    "This offer is above the mid-range educational estimate for these inputs. An attorney can review whether future care, wage loss, and other damages are fully accounted for.",
};

/**
 * Offer Reality Check summary for djlaw: neutral band copy, the shared policy-limit
 * sentence (if any), then the educational-only note.
 */
export function djOfferSummary(check: Pick<OfferRealityCheck, "label" | "summary">): string {
  const i = check.summary.indexOf(" Policy limits may bind:");
  const policy = i >= 0 ? check.summary.slice(i) : "";
  return `${DJ_OFFER_BAND_COPY[check.label]}${policy} ${DJ_OFFER_NOTE}`;
}

export function djFooterLegalLine(client: ClientConfig): string {
  const street = client.officeAddress?.trim() || "[street address]";
  const attorney = client.responsibleAttorney?.trim() || "[name]";
  const zip = client.officeZip?.trim() ? ` ${client.officeZip.trim()}` : "";
  return `${client.firmName}, ${street}, ${client.city}, ${client.state}${zip}. Responsible attorney: ${attorney}. Use of this tool does not create an attorney-client relationship.`;
}
