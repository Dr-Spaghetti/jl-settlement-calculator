import type { ClientConfig } from "./types";

/**
 * Djougourian (CA) disclaimer copy: kept deliberately minimal.
 *  - Estimate qualifier: rendered under the estimate figures and in the print summary.
 *  - Footer legal line: advertising label, responsible firm/attorney + office
 *    (Rule 7.2(c); Bus. & Prof. Code 6157.2(b)), no attorney-client relationship, past results.
 * Bracketed values are placeholders until the firm confirms them in clients/djougourian-law.json.
 */

export const DJ_ESTIMATE_QUALIFIER =
  "Estimate only. Not a guarantee of any result or legal advice.";

export function djFooterLegalLine(client: ClientConfig): string {
  const street = client.officeAddress?.trim() || "[street address]";
  const attorney = client.responsibleAttorney?.trim() || "[name]";
  return `Attorney advertising. ${client.firmName}, ${street}, ${client.city}, ${client.state}. Responsible attorney: ${attorney}. Use of this tool does not create an attorney-client relationship. Past results do not guarantee future outcomes.`;
}
