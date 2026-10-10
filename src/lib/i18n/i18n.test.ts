/** EN/ES parity: same keys, and identical numbers + statute cites in every string. */
import test from "node:test";
import assert from "node:assert/strict";
import { UI, fmtMoney } from "./index";
import { FL_COPY } from "../engine/states/fl.copy";
import { SC_COPY } from "../engine/states/sc.copy";

const SAMPLE = [37, "$12,345", "$67,890"] as const;
function flatten(o: unknown, p = ""): Record<string, string> {
  if (typeof o === "string") return { [p]: o };
  if (typeof o === "function") return { [p]: String((o as (...a: unknown[]) => unknown)(...SAMPLE)) };
  if (Array.isArray(o)) return Object.assign({}, ...o.map((v, i) => flatten(v, `${p}[${i}]`)));
  if (o && typeof o === "object") return Object.assign({}, ...Object.entries(o).map(([k, v]) => flatten(v, p ? `${p}.${k}` : k)));
  return { [p]: String(o) };
}
const nums = (s: string) => (s.match(/\d[\d,.]*\d|\d/g) ?? []).map((x) => x.replace(/[.,]$/, "")).sort();
const cites = (s: string) => (s.match(/§+\s?[\d.\-]+(\(\w+\))*/g) ?? []).sort();

for (const [name, dict] of [["UI", UI], ["FL_COPY", FL_COPY], ["SC_COPY", SC_COPY]] as const) {
  test(`${name}: EN and ES have the same keys`, () => {
    assert.deepEqual(Object.keys(flatten(dict.es)).sort(), Object.keys(flatten(dict.en)).sort());
  });
  test(`${name}: every string has identical numbers and statute cites in EN and ES`, () => {
    const en = flatten(dict.en), es = flatten(dict.es);
    for (const k of Object.keys(en)) {
      assert.deepEqual(nums(es[k]), nums(en[k]), `numbers differ at ${k}\nEN: ${en[k]}\nES: ${es[k]}`);
      assert.deepEqual(cites(es[k]), cites(en[k]), `cites differ at ${k}`);
    }
  });
  test(`${name}: no empty Spanish strings except intentional blanks`, () => {
    const en = flatten(dict.en), es = flatten(dict.es);
    for (const k of Object.keys(es)) if (en[k] !== "") assert.ok(es[k].trim().length > 0, k);
  });
}
test("money format is locale-independent", () => assert.equal(fmtMoney(12345), "$12,345"));
test("no liability/shared-fault penalty copy in EN or ES (fault is applied once, by %)", () => {
  const all = JSON.stringify([FL_COPY, SC_COPY]) + JSON.stringify(Object.keys(UI.en));
  assert.ok(!/in addition to the fault|además del porcentaje de culpa|liabilityOpts|rowLiability/.test(all));
});

// Re-audit SC #4: "excluido/excluida" mistranslates the >50% bar ("no recovery"). Never in ES copy.
test("ES copy never says 'excluido' (SC, FL, UI chrome)", () => {
  const dump = JSON.stringify([SC_COPY.es, FL_COPY.es, Object.fromEntries(Object.entries(UI.es).map(([k, v]) => [k, typeof v === "function" ? String((v as (...a: unknown[]) => string)(1, 1)) : v]))]);
  assert.ok(!/xclu[ií]d/i.test(dump), "found 'excluido' in Spanish copy");
});
