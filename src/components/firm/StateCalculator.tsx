"use client";
/**
 * Generic, localized calculator for state modules FL and SC (PA keeps PaCalculator, unchanged).
 * All visible strings come from src/lib/i18n (chrome) and states/<st>.copy.ts (law copy).
 */
import { useMemo, useState } from "react";
import type { ClientConfig } from "@/lib/types";
import { LIABILITY_OPTIONS, liabilityOption, type LiabilityId } from "@/lib/engine/liability";
import { roundMoney, type CareType, type Permanency, type Severity, type TreatmentGap } from "@/lib/engine/core";
import { calculateFL, type PipStatus, type YesNoUnsure } from "@/lib/engine/states/fl";
import { calculateSC, SC_LAW, type InsuredStatus } from "@/lib/engine/states/sc";
import { FL_COPY } from "@/lib/engine/states/fl.copy";
import { SC_COPY } from "@/lib/engine/states/sc.copy";
import { UI, fmtMoney as fmt, type Locale } from "@/lib/i18n";
import { PhoneIcon } from "@/components/icons";

const label = "block text-xs font-bold uppercase tracking-wider text-t-muted";
const help = "mt-1 text-[11px] leading-snug text-t-muted";
const input = "mt-1.5 block w-full rounded-lg border border-t-muted/30 bg-t-ground px-3.5 py-2.5 text-sm font-semibold text-t-text outline-none focus:border-t-accent focus:ring-1 focus:ring-t-accent";
type Range = { low: number; mid: number; high: number };

function Money({ id, l, v, set }: { id: string; l: string; v: number; set: (n: number) => void }) {
  return (
    <div>
      <label htmlFor={id} className={label}>{l}</label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 pt-1.5 text-sm text-t-muted">$</span>
        <input id={id} type="number" inputMode="decimal" min={0} step={100} value={v} onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))} className={`${input} pl-8`} />
      </div>
    </div>
  );
}
function Choice<T extends string>({ name, opts, v, set, cols = 3 }: { name: string; opts: { id: T; label: string }[]; v: T; set: (t: T) => void; cols?: number }) {
  return (
    <div className={`mt-1.5 grid gap-2 ${cols === 3 ? "sm:grid-cols-3" : ""}`} role="radiogroup" aria-label={name}>
      {opts.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={v === o.id} data-option={o.id} onClick={() => set(o.id)}
          className={`min-h-[44px] rounded-lg border px-3 py-2 text-left text-xs font-semibold transition ${v === o.id ? "border-t-accent bg-t-accent text-t-on-accent" : "border-t-muted/30 text-t-text hover:border-t-accent"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function StateCalculator({ client, locale }: { client: ClientConfig; locale: Locale }) {
  const st = client.stateModule as "FL" | "SC";
  const ui = UI[locale];
  const fl = FL_COPY[locale];
  const sc = SC_COPY[locale];
  const [step, setStep] = useState(0);
  const [medicalBills, setMed] = useState(15000);
  const [lostWages, setWages] = useState(4500);
  const [otherOutOfPocket, setOther] = useState(800);
  const [propertyDamage, setProp] = useState(6500);
  const [severity, setSev] = useState<Severity>("moderate");
  const [careType, setCare] = useState<CareType>("md");
  const [treatmentMonths, setMonths] = useState(4);
  const [treatmentGap, setGap] = useState<TreatmentGap>("none");
  const [permanency, setPerm] = useState<Permanency>("none");
  const [liability, setLiab] = useState<LiabilityId>("clear");
  const [fault, setFault] = useState(0);
  const [threshold, setThreshold] = useState<YesNoUnsure>("unsure");
  const [pip, setPip] = useState<PipStatus>("emc");
  const [insured, setInsured] = useState<InsuredStatus>("unsure");
  const [policy, setPolicy] = useState<string>("unknown");
  const [offer, setOffer] = useState("");

  const POLICY: { id: string; label: string; value: number | null }[] = [
    { id: "unknown", label: ui.unknown, value: null },
    ...(st === "SC" ? [{ id: "min", label: sc.policyMinLabel, value: SC_LAW.minLiability.perPerson }] : [{ id: "10k", label: ui.perPerson(fmt(10000)), value: 10000 }, { id: "25k", label: ui.perPerson(fmt(25000)), value: 25000 }]),
    { id: "50k", label: ui.perPerson(fmt(50000)), value: 50000 },
    { id: "100k", label: ui.perPerson(fmt(100000)), value: 100000 },
    { id: "250k", label: ui.perPerson(fmt(250000)), value: 250000 },
  ];
  const lim = POLICY.find((p) => p.id === policy)!.value;
  const core = { medicalBills, lostWages, otherOutOfPocket, propertyDamage, severity, careType, treatmentMonths, treatmentGap, permanency, liability };

  const r = useMemo(() => {
    if (st === "FL") {
      const x = calculateFL({ ...core, permanentInjury: threshold, pip, plaintiffFaultPercent: fault, policyLimitPerPerson: lim });
      return { ...x, unsure: x.thresholdUnsure ? { a: x.thresholdUnsure.met, b: x.thresholdUnsure.notMet } : null, offset: x.pipOffset };
    }
    const x = calculateSC({ ...core, plaintiffFaultPercent: fault, policyLimitPerPerson: lim, otherDriverInsured: insured });
    return { ...x, nonEconomicAllowed: true, ifNonEconomicAvailable: null as Range | null, unsure: null as { a: Range; b: Range } | null, offset: 0 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st, medicalBills, lostWages, otherOutOfPocket, propertyDamage, severity, careType, treatmentMonths, treatmentGap, permanency, liability, fault, threshold, pip, insured, lim]);

  const shown = r.capped ?? r.recoverable;
  const single = shown.low === shown.high;
  const offerNum = offer.trim() === "" ? null : Number(offer);
  const lev = liabilityOption(liability);
  const yn = (["yes", "no", "unsure"] as const).map((id) => ({ id, label: id === "yes" ? ui.yes : id === "no" ? ui.no : ui.notSure }));
  const faultNote = st === "FL" ? fl.faultNote : sc.faultNote;
  const title = r.unsure ? fl.titleUnsure : r.nonEconomicAllowed ? ui.rangeTitle : ui.econOnlyTitle;

  return (
    <section id="calculator" className="px-4 py-12" aria-labelledby="calc-h">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="calc-h" className="sr-only">{ui.settlementCalculator}</h2>
        <div className="grid items-start gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            <div className="flex rounded-xl border border-t-muted/20 bg-t-surface p-1.5" role="tablist" aria-label={ui.calcSteps}>
              {ui.steps.map((s, i) => (
                <button key={s} type="button" role="tab" aria-selected={step === i} onClick={() => setStep(i)}
                  className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg text-xs font-semibold sm:text-sm ${step === i ? "bg-t-accent text-t-on-accent" : "text-t-muted hover:text-t-text"}`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${step === i ? "bg-t-ground text-t-accent" : "bg-t-muted/15 text-t-text"}`}>{i + 1}</span>
                  <span className="hidden sm:inline">{s}</span>
                  <span className="sm:hidden">{ui.stepsShort[i]}</span>
                </button>
              ))}
            </div>
            <div className="overflow-hidden rounded-2xl border border-t-muted/20 bg-t-surface">
              <div className="border-b-2 border-t-accent bg-t-ground px-6 py-4">
                <span className="text-xs font-bold uppercase tracking-wider text-t-accent">{ui.stepOf(step + 1)}</span>
                <h3 className="font-display mt-1 text-2xl font-semibold text-t-text">{ui.stepTitles[step]}</h3>
              </div>
              <div className="space-y-6 p-6">
                {step === 0 ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Money id="med" l={ui.medical} v={medicalBills} set={setMed} />
                    <Money id="wages" l={ui.wages} v={lostWages} set={setWages} />
                    <Money id="other" l={ui.other} v={otherOutOfPocket} set={setOther} />
                    <Money id="prop" l={ui.property} v={propertyDamage} set={setProp} />
                  </div>
                ) : null}
                {step === 1 ? (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="sev" className={label}>{ui.severity}</label>
                        <select id="sev" className={input} value={severity} onChange={(e) => setSev(e.target.value as Severity)}>
                          {(Object.keys(ui.severityOpts) as Severity[]).map((k) => <option key={k} value={k}>{ui.severityOpts[k]}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="care" className={label}>{ui.care}</label>
                        <select id="care" className={input} value={careType} onChange={(e) => setCare(e.target.value as CareType)}>
                          {(Object.keys(ui.careOpts) as CareType[]).map((k) => <option key={k} value={k}>{ui.careOpts[k]}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="months" className={label}>{ui.months}</label>
                        <input id="months" type="number" min={0} max={120} className={input} value={treatmentMonths} onChange={(e) => setMonths(Math.min(120, Math.max(0, Number(e.target.value) || 0)))} />
                      </div>
                      <div>
                        <label htmlFor="gap" className={label}>{ui.gap}</label>
                        <select id="gap" className={input} value={treatmentGap} onChange={(e) => setGap(e.target.value as TreatmentGap)}>
                          {(Object.keys(ui.gapOpts) as TreatmentGap[]).map((k) => <option key={k} value={k}>{ui.gapOpts[k]}</option>)}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="perm" className={label}>{ui.impairment}</label>
                        <select id="perm" className={input} value={permanency} onChange={(e) => setPerm(e.target.value as Permanency)}>
                          {(Object.keys(ui.permOpts) as Permanency[]).map((k) => <option key={k} value={k}>{ui.permOpts[k]}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <span className={label}>{ui.liability}</span>
                      <Choice name={ui.liability} opts={LIABILITY_OPTIONS.map((o) => ({ id: o.id, label: ui.liabilityOpts[o.id] }))} v={liability} set={setLiab} />
                    </div>
                    <div>
                      <label htmlFor="fault" className={label}>{ui.yourFault(fault)}</label>
                      <input id="fault" type="range" min={0} max={100} step={1} value={fault} onChange={(e) => setFault(Number(e.target.value))} className="mt-2 h-11 w-full" />
                      <p className={help}>{faultNote}</p>
                    </div>
                    {st === "FL" ? (
                      <div>
                        <span className={label}>{fl.thresholdLabel}</span>
                        <Choice name={fl.thresholdLabel} opts={yn} v={threshold} set={setThreshold} />
                        <p className={help}>{fl.thresholdHelp}</p>
                      </div>
                    ) : null}
                  </>
                ) : null}
                {step === 2 ? (
                  <>
                    {st === "FL" ? (
                      <div>
                        <span className={label}>{fl.pipLabel}</span>
                        <Choice name={fl.pipLabel} cols={1} opts={(["emc", "noEmc", "none"] as const).map((id) => ({ id, label: fl.pipOpts[id] }))} v={pip} set={setPip} />
                        <p className={help}>{fl.pipHelp}</p>
                      </div>
                    ) : (
                      <div>
                        <span className={label}>{sc.insuredLabel}</span>
                        <Choice name={sc.insuredLabel} opts={(["insured", "uninsured", "unsure"] as const).map((id) => ({ id, label: sc.insuredOpts[id] }))} v={insured} set={setInsured} />
                        {insured === "unsure" ? (
                          <ul className={`${help} list-disc space-y-1 pl-4`}>{sc.unsureBoth.map((x) => <li key={x}>{x}</li>)}</ul>
                        ) : null}
                        {insured === "uninsured" ? <p className={help}>{sc.umNote}</p> : null}
                      </div>
                    )}
                    <div>
                      <label htmlFor="policy" className={label}>{ui.policyLabel}</label>
                      <select id="policy" className={input} value={policy} onChange={(e) => setPolicy(e.target.value)}>
                        {POLICY.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                      </select>
                      <p className={help}>{ui.policyHelp}</p>
                    </div>
                    <div>
                      <label htmlFor="offer" className={label}>{ui.offerLabel}</label>
                      <input id="offer" type="number" min={0} step={500} placeholder={ui.optional} className={input} value={offer} onChange={(e) => setOffer(e.target.value)} />
                    </div>
                  </>
                ) : null}
                <div className="flex justify-between border-t border-t-muted/20 pt-4">
                  <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="min-h-[44px] text-xs font-bold text-t-muted disabled:opacity-0">{ui.back}</button>
                  {step < 2 ? (
                    <button type="button" onClick={() => setStep((s) => s + 1)} className="min-h-[44px] rounded-lg bg-t-accent px-5 text-xs font-bold uppercase tracking-wider text-t-on-accent">{ui.next}</button>
                  ) : (
                    <a href="#results" className="flex min-h-[44px] items-center rounded-lg bg-t-text px-5 text-xs font-bold uppercase tracking-wider text-t-ground lg:hidden">{ui.viewEstimate}</a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div id="results" aria-live="polite" className="overflow-hidden rounded-2xl border border-t-accent/60 bg-t-surface shadow-lg">
              <div className="border-b border-t-muted/20 px-6 py-4">
                <span className="inline-block rounded border border-t-muted/20 bg-t-ground px-2 py-0.5 text-xs font-bold uppercase tracking-[0.14em] text-t-accent">{ui.estimateBadge}</span>
                <h3 id="result-title" className="font-display mt-2 text-lg font-semibold text-t-text">{title}</h3>
              </div>
              <div className="p-6">
                {r.unsure ? (
                  <div className="space-y-3">
                    <Scenario ui={ui} title={fl.scenarioMet} range={r.unsure.a} m={r.m} id="scn-met" />
                    <Scenario ui={ui} title={fl.scenarioNotMet} range={r.unsure.b} id="scn-notmet" />
                    <p className="text-center text-xs leading-snug text-t-muted">{fl.thresholdUnsureNote}</p>
                  </div>
                ) : single ? (
                  <div className="rounded-xl bg-t-accent p-4 text-center text-t-on-accent">
                    <span className="block text-[11px] font-bold uppercase tracking-wider">{ui.estimate}</span>
                    <span id="est-mid" className="block text-3xl font-black tabular-nums">{fmt(shown.mid)}</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-[1fr_1.3fr_1fr] gap-2">
                    {(["low", "mid", "high"] as const).map((k) => (
                      <div key={k} className={`rounded-xl border p-3 text-center ${k === "mid" ? "border-t-accent bg-t-accent text-t-on-accent" : "border-t-muted/20 bg-t-ground text-t-text"}`}>
                        <span className={`block text-[10px] font-bold uppercase tracking-wider ${k === "mid" ? "" : "text-t-muted"}`}>{ui[k]}</span>
                        <span id={`est-${k}`} className={`block whitespace-nowrap font-extrabold tabular-nums ${k === "mid" ? "text-xl" : "text-base"}`}>{fmt(shown[k])}</span>
                        <span className={`block text-[10px] ${k === "mid" ? "" : "text-t-muted"}`}>{r.m[k]}× {ui.multiplier}</span>
                      </div>
                    ))}
                  </div>
                )}
                <p id="estimate-qualifier" className="mt-3 text-center text-xs leading-snug text-t-muted">{ui.heroQualifier}</p>

                {r.barred ? (
                  <p className="mt-4 text-xs text-t-text" role="status">{st === "FL" ? fl.barred(r.faultPercent) : sc.barred(r.faultPercent)}</p>
                ) : null}
                {st === "FL" && !r.nonEconomicAllowed && !r.unsure && r.ifNonEconomicAvailable && !r.barred ? (
                  <p className="mt-4 rounded-lg border border-t-muted/20 bg-t-ground px-3 py-2 text-xs leading-snug text-t-text">
                    {fl.notMetLine(fmt(r.ifNonEconomicAvailable.low), fmt(r.ifNonEconomicAvailable.high))}
                  </p>
                ) : null}
                {r.policyLimitsMayBind && r.capped && !r.unsure ? (
                  <p className="mt-4 rounded-lg border border-t-accent/50 bg-t-accent/10 px-3 py-2 text-xs text-t-text" role="status">
                    <strong>{ui.policyBindTitle}</strong> {ui.policyBind(fmt(lim ?? 0))}
                  </p>
                ) : null}
                {offerNum != null && Number.isFinite(offerNum) && offerNum >= 0 && shown.mid > 0 ? (
                  <p className="mt-4 rounded-lg border border-t-muted/20 bg-t-ground px-3 py-2 text-xs text-t-text">{ui.offerCompare(fmt(offerNum), Math.round((offerNum / shown.mid) * 100))}</p>
                ) : null}

                <details className="mt-4 rounded-xl border border-t-muted/20 bg-t-ground">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between px-4 text-xs font-bold text-t-accent [&::-webkit-details-marker]:hidden">
                    {ui.showMath} <span aria-hidden>▾</span>
                  </summary>
                  <dl id="breakdown" className="space-y-1.5 border-t border-t-muted/20 px-4 py-3 text-xs text-t-text">
                    <Row k={ui.rowMedical} v={fmt(medicalBills)} />
                    {st === "FL" ? <Row k={fl.rowPip} v={`− ${fmt(roundMoney(r.offset))}`} /> : null}
                    <Row k={ui.rowEconOnce} v={fmt(lostWages + otherOutOfPocket + propertyDamage)} />
                    <Row k={ui.rowEconomic} v={fmt(r.economic)} strong />
                    <Row k={ui.rowSeverity(ui.severityOpts[severity])} v={`${(r.m.mid - r.m.adjustment).toFixed(2)}× ${ui.base}`} />
                    <Row k={ui.rowLiability(ui.liabilityOpts[lev.id])} v={`${lev.coef > 0 ? "+" : ""}${lev.coef.toFixed(2)}×`} />
                    <Row k={ui.rowAdjust} v={`${r.m.adjustment > 0 ? "+" : ""}${r.m.adjustment.toFixed(2)}×`} />
                    <Row k={ui.rowPain(r.m.mid)} v={r.nonEconomicAllowed ? fmt(r.nonEconomic.mid) : r.unsure ? fl.rowPainUnsure(fmt(roundMoney(medicalBills * (r.m.mid - 1)))) : fl.rowPainNotMet} />
                    <Row k={ui.rowFault(r.faultPercent)} v={r.barred ? ui.barredShort : `× ${(1 - r.faultPercent / 100).toFixed(2)}`} />
                    <Row k={ui.rowPolicy} v={r.capped ? fmt(lim ?? 0) : ui.rowPolicyUnknown} />
                  </dl>
                </details>

                <div className="mt-4 flex flex-col gap-2.5">
                  <a href={client.ctaUrl} className="flex min-h-[48px] items-center justify-center rounded-xl bg-t-accent px-4 text-sm font-bold text-t-on-accent hover:bg-t-accent/90">
                    {locale === "es" && client.ctaTextEs ? client.ctaTextEs : client.ctaText} — {ui.reviewWithAttorney}
                  </a>
                  <a href={`tel:${client.phone.replace(/[^\d+]/g, "")}`} className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-t-text/40 text-sm font-bold text-t-text">
                    <PhoneIcon size={16} className="text-t-accent" /> {client.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Scenario({ ui, title, range, m, id }: { ui: (typeof UI)["en"]; title: string; range: Range; m?: Range; id: string }) {
  const single = range.low === range.high;
  return (
    <div id={id} className="rounded-xl border border-t-muted/20 bg-t-ground p-3 text-center text-t-text">
      <span className="block text-[11px] font-bold uppercase tracking-wider text-t-accent">{title}</span>
      {single ? (
        <span className="mt-1 block text-xl font-extrabold tabular-nums">{fmt(range.mid)}</span>
      ) : (
        <div className="mt-1 grid grid-cols-3 gap-1">
          {(["low", "mid", "high"] as const).map((k) => (
            <div key={k}>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-t-muted">{ui[k]}</span>
              <span className="block whitespace-nowrap text-xl font-extrabold tabular-nums">{fmt(range[k])}</span>
              {m ? <span className="block text-[10px] text-t-muted">{m[k]}× {ui.multiplier}</span> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 ${strong ? "border-t border-t-muted/20 pt-1.5 font-bold" : ""}`}>
      <dt className="text-t-muted">{k}</dt>
      <dd className="whitespace-nowrap tabular-nums">{v}</dd>
    </div>
  );
}
