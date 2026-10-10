import test from "node:test";
import assert from "node:assert/strict";
import { legalLine } from "./FirmChrome";
import { UI } from "@/lib/i18n";
import type { ClientConfig } from "@/lib/types";

const base = { id: "x", firmName: "Trade Name Law", responsibleAttorney: "A. Lawyer", officeAddress: "1 Main St", city: "Orlando", state: "FL", officeZip: "32801",
  offices: [{ name: "Myrtle (HQ)", nameEs: "Myrtle (sede)", address: "1 Main St", phone: "407-000-0000" }] } as unknown as ClientConfig;

test("footer: firmLegalName shown after trade name in EN and ES", () => {
  const c = { ...base, firmLegalName: "Trade, PLLC" } as ClientConfig;
  assert.match(legalLine(c, UI.en), /^Trade Name Law \(Trade, PLLC\)\. Responsible attorney: A\. Lawyer/);
  assert.match(legalLine(c, UI.es), /^Trade Name Law \(Trade, PLLC\)\. Abogado\(a\) responsable: A\. Lawyer/);
});
test("footer: practiceGeography per locale; office nameEs in ES only", () => {
  const c = { ...base, practiceGeography: { en: "Cases handled in X.", es: "Casos atendidos en X." } } as ClientConfig;
  const en = legalLine(c, UI.en), es = legalLine(c, UI.es);
  assert.ok(en.includes("Myrtle (HQ), 1 Main St") && en.includes(". Cases handled in X. Use of this tool"));
  assert.ok(es.includes("Myrtle (sede), 1 Main St") && es.includes(". Casos atendidos en X. El uso"));
});
test("footer: no extra names when fields absent", () => {
  assert.ok(legalLine(base, UI.en).startsWith("Trade Name Law. Responsible attorney"));
});
