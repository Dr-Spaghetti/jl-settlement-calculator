"use client";

import { useMemo, useState } from "react";
import type { ClientConfig } from "@/lib/types";
import { LIABILITY_OPTIONS, liabilityOption, type LiabilityId } from "@/lib/engine/liability";
import type { CareType, Permanency, Severity, TreatmentGap } from "@/lib/engine/core";
import { calculatePA, PA_LAW, type TortOption, type YesNoUnsure } from "@/lib/engine/states/pa";
import { PA_COPY } from "@/lib/engine/states/pa.copy";
import { PhoneIcon } from "@/components/icons";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const label = "block text-xs font-bold uppercase tracking-wider text-t-muted";
const help = "mt-1 text-[11px] leading-snug text-t-muted";
const input = "mt-1.5 block w-full rounded-lg border border-t-muted/30 bg-t-ground px-3.5 py-2.5 text-sm font-semibold text-t-text outline-none focus:border-t-accent focus:ring-1 focus:ring-t-accent";

const SEVERITY: { id: Severity; label: string }[] = [
  { id: "minor", label: "Minor (soft tissue, brief recovery)" },
  { id: "moderate", label: "Moderate (months of care, lasting symptoms)" },
  { id: "severe", label: "Severe (fractures, significant impairment)" },
  { id: "catastrophic", label: "Catastrophic (permanent / life-altering)" },
];
const CARE: { id: CareType; label: string }[] = [
  { id: "chiro", label: "Chiropractic / PT primary" },
  { id: "md", label: "MD / specialist care" },
  { id: "surgery", label: "Surgery involved" },
];
const GAP: { id: TreatmentGap; label: string }[] = [
  { id: "none", label: "No meaningful gap in care" },
  { id: "short", label: "Short gap (weeks)" },
  { id: "long", label: "Long gap (months+)" },
];
const PERM: { id: Permanency; label: string }[] = [
  { id: "none", label: "No lasting impairment claimed" },
  { id: "possible", label: "Possible lasting impairment" },
  { id: "rated", label: "Documented permanent impairment" },
];
const TORT: { id: TortOption; label: string }[] = [
  { id: "full", label: "Full tort" },
  { id: "limited", label: "Limited tort" },
  { id: "unsure", label: "Not sure" },
];
const EXC: { id: YesNoUnsure; label: string }[] = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
  { id: "unsure", label: "Not sure" },
];
const POLICY = [
  { id: "unknown", label: "Unknown", value: null },
  { id: "min", label: PA_COPY.policyMinLabel, value: PA_LAW.minLiability.perPerson },
  { id: "25k", label: "$25,000 per person", value: 25000 },
  { id: "50k", label: "$50,000 per person", value: 50000 },
  { id: "100k", label: "$100,000 per person", value: 100000 },
  { id: "250k", label: "$250,000 per person", value: 250000 },
] as const;

function Money({ id, l, h, v, set }: { id: string; l: string; h?: string; v: number; set: (n: number) => void }) {
  return (
    <div>
      <label htmlFor={id} className={label}>{l}</label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 pt-1.5 text-sm text-t-muted">$</span>
        <input id={id} type="number" inputMode="decimal" min={0} step={100} value={v}
          onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))} className={`${input} pl-8`} />
      </div>
      {h ? <p className={help}>{h}</p> : null}
    </div>
  );
}

function Choice<T extends string>({ name, opts, v, set }: { name: string; opts: { id: T; label: string }[]; v: T; set: (t: T) => void }) {
  return (
    <div className="mt-1.5 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label={name}>
      {opts.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={v === o.id} data-option={o.id} onClick={() => set(o.id)}
          className={`min-h-[44px] rounded-lg border px-3 py-2 text-left text-xs font-semibold transition ${v === o.id ? "border-t-accent bg-t-accent text-t-on-accent" : "border-t-muted/30 text-t-text hover:border-t-accent"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

const STEPS = ["Economic Losses", "Injury & Fault", "Coverage"] as const;
const SHORT = ["Losses", "Injury", "Coverage"] as const;

export function PaCalculator({ client }: { client: ClientConfig }) {
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
  const [tortOption, setTort] = useState<TortOption>("unsure");
  const [exc, setExc] = useState<YesNoUnsure>("unsure");
  const [firstParty, setFirstParty] = useState<number>(PA_LAW.firstPartyMedical.minimum);
  const [policy, setPolicy] = useState<(typeof POLICY)[number]["id"]>("unknown");
  const [offer, setOffer] = useState("");

  const r = useMemo(() => calculatePA({
    medicalBills, lostWages, otherOutOfPocket, propertyDamage, severity, careType, treatmentMonths, treatmentGap,
    permanency, liability, plaintiffFaultPercent: fault, tortOption, limitedTortException: exc,
    firstPartyMedical: firstParty, policyLimitPerPerson: POLICY.find((p) => p.id === policy)!.value,
  }), [medicalBills, lostWages, otherOutOfPocket, propertyDamage, severity, careType, treatmentMonths, treatmentGap, permanency, liability, fault, tortOption, exc, firstParty, policy]);

  const shown = r.capped ?? r.recoverable;
  const single = shown.low === shown.high;
  const offerNum = offer.trim() === "" ? null : Number(offer);
  const lev = liabilityOption(liability);

  return (
    <section id="calculator" className="px-4 py-12" aria-labelledby="calc-h">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="calc-h" className="sr-only">Settlement calculator</h2>
        <div className="grid items-start gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            <div className="flex rounded-xl border border-t-muted/20 bg-t-surface p-1.5" role="tablist" aria-label="Calculator steps">
              {STEPS.map((s, i) => (
                <button key={s} type="button" role="tab" aria-selected={step === i} onClick={() => setStep(i)}
                  className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg text-xs font-semibold sm:text-sm ${step === i ? "bg-t-accent text-t-on-accent" : "text-t-muted hover:text-t-text"}`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${step === i ? "bg-t-ground text-t-accent" : "bg-t-muted/15 text-t-text"}`}>{i + 1}</span>
                  <span className="hidden sm:inline">{s}</span>
                  <span className="sm:hidden">{SHORT[i]}</span>
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-t-muted/20 bg-t-surface">
              <div className="border-b-2 border-t-accent bg-t-ground px-6 py-4">
                <span className="text-xs font-bold uppercase tracking-wider text-t-accent">Step {step + 1} of 3</span>
                <h3 className="font-display mt-1 text-2xl font-semibold text-t-text">
                  {["Your Economic Losses", "Injury, Treatment & Fault", "Your Coverage & the Other Driver's"][step]}
                </h3>
              </div>
              <div className="space-y-6 p-6">
                {step === 0 ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Money id="med" l="Medical bills (past + expected)" v={medicalBills} set={setMed} />
                    <Money id="wages" l="Lost wages" v={lostWages} set={setWages} />
                    <Money id="other" l="Other out-of-pocket costs" v={otherOutOfPocket} set={setOther} />
                    <Money id="prop" l="Property damage" v={propertyDamage} set={setProp} />
                  </div>
                ) : null}
                {step === 1 ? (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="sev" className={label}>Injury severity</label>
                        <select id="sev" className={input} value={severity} onChange={(e) => setSev(e.target.value as Severity)}>
                          {SEVERITY.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="care" className={label}>Primary care</label>
                        <select id="care" className={input} value={careType} onChange={(e) => setCare(e.target.value as CareType)}>
                          {CARE.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="months" className={label}>Months of treatment</label>
                        <input id="months" type="number" min={0} max={120} className={input} value={treatmentMonths}
                          onChange={(e) => setMonths(Math.min(120, Math.max(0, Number(e.target.value) || 0)))} />
                      </div>
                      <div>
                        <label htmlFor="gap" className={label}>Gaps in treatment</label>
                        <select id="gap" className={input} value={treatmentGap} onChange={(e) => setGap(e.target.value as TreatmentGap)}>
                          {GAP.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="perm" className={label}>Lasting impairment</label>
                        <select id="perm" className={input} value={permanency} onChange={(e) => setPerm(e.target.value as Permanency)}>
                          {PERM.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <span className={label}>Liability</span>
                      <Choice name="Liability" opts={LIABILITY_OPTIONS.map((o) => ({ id: o.id, label: o.label }))} v={liability} set={setLiab} />
                    </div>
                    <div>
                      <label htmlFor="fault" className={label}>Your share of fault: {fault}%</label>
                      <input id="fault" type="range" min={0} max={100} step={1} value={fault} onChange={(e) => setFault(Number(e.target.value))} className="mt-2 h-11 w-full" />
                      <p className={help}>{PA_COPY.faultNote}</p>
                    </div>
                  </>
                ) : null}
                {step === 2 ? (
                  <>
                    <div>
                      <span className={label}>Your own policy&apos;s tort option</span>
                      <Choice name="Tort option" opts={TORT} v={tortOption} set={setTort} />
                      <p className={help}>{PA_COPY.tortHelp}</p>
                      <details className={help}>
                        <summary className="cursor-pointer font-semibold text-t-accent">{PA_COPY.tortExceptionsSummary}</summary>
                        <p className="mt-1">{PA_COPY.tortExceptions}</p>
                      </details>
                      {tortOption === "unsure" ? <p className={help}>{PA_COPY.tortUnsureNote}</p> : null}
                    </div>
                    {tortOption === "limited" ? (
                      <div>
                        <span className={label}>{PA_COPY.tortExceptionQuestion}</span>
                        <Choice name="Limited tort exception" opts={EXC} v={exc} set={setExc} />
                      </div>
                    ) : null}
                    <Money id="fpb" l="Your own policy's medical benefit" h={PA_COPY.firstPartyHelp} v={firstParty} set={setFirstParty} />
                    <div>
                      <label htmlFor="policy" className={label}>At-fault driver&apos;s bodily-injury limit (practical collection estimate)</label>
                      <select id="policy" className={input} value={policy} onChange={(e) => setPolicy(e.target.value as typeof policy)}>
                        {POLICY.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                      </select>
                      <p className={help}>Not a legal cap on damages. This driver&apos;s insurance may stop at this limit; your underinsured motorist coverage or other sources may apply.</p>
                    </div>
                    <div>
                      <label htmlFor="offer" className={label}>Insurance offer received (optional)</label>
                      <input id="offer" type="number" min={0} step={500} placeholder="Optional" className={input} value={offer} onChange={(e) => setOffer(e.target.value)} />
                    </div>
                  </>
                ) : null}
                <div className="flex justify-between border-t border-t-muted/20 pt-4">
                  <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="min-h-[44px] text-xs font-bold text-t-muted disabled:opacity-0">← Back</button>
                  {step < 2 ? (
                    <button type="button" onClick={() => setStep((s) => s + 1)} className="min-h-[44px] rounded-lg bg-t-accent px-5 text-xs font-bold uppercase tracking-wider text-t-on-accent">Continue →</button>
                  ) : (
                    <a href="#results" className="flex min-h-[44px] items-center rounded-lg bg-t-text px-5 text-xs font-bold uppercase tracking-wider text-t-ground lg:hidden">View estimate</a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div id="results" aria-live="polite" className="overflow-hidden rounded-2xl border border-t-accent/60 bg-t-surface shadow-lg">
              <div className="border-b border-t-muted/20 px-6 py-4">
                <span className="inline-block rounded border border-t-muted/20 bg-t-ground px-2 py-0.5 text-xs font-bold uppercase tracking-[0.14em] text-t-accent">Settlement Estimate</span>
                <h3 className="font-display mt-2 text-lg font-semibold text-t-text">
                  {r.tortUnsure ? "Two Scenarios: Tort Option Not Sure" : r.nonEconomicAllowed ? "Estimated Settlement Range" : "Economic Damages Only"}
                </h3>
              </div>
              <div className="p-6">
                {r.tortUnsure ? (
                  <div className="space-y-3">
                    <Scenario title="If full tort" range={r.tortUnsure.full} m={r.m} />
                    <Scenario title="If limited tort, no exception" range={r.tortUnsure.limited} />
                    <p className="text-center text-xs leading-snug text-t-muted">{PA_COPY.tortUnsureNote}</p>
                  </div>
                ) : (
                  <>
                {single ? (
                    <div className="rounded-xl bg-t-accent p-4 text-center text-t-on-accent">
                      <span className="block text-[11px] font-bold uppercase tracking-wider">Estimate</span>
                      <span id="est-mid" className="block text-3xl font-black tabular-nums">{fmt(shown.mid)}</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-[1fr_1.3fr_1fr] gap-2">
                      {(["low", "mid", "high"] as const).map((k) => (
                        <div key={k} className={`rounded-xl border p-3 text-center ${k === "mid" ? "border-t-accent bg-t-accent text-t-on-accent" : "border-t-muted/20 bg-t-ground text-t-text"}`}>
                          <span className={`block text-[10px] font-bold uppercase tracking-wider ${k === "mid" ? "" : "text-t-muted"}`}>{k}</span>
                          <span id={`est-${k}`} className={`block whitespace-nowrap font-extrabold tabular-nums ${k === "mid" ? "text-xl" : "text-base"}`}>{fmt(shown[k])}</span>
                          <span className={`block text-[10px] ${k === "mid" ? "" : "text-t-muted"}`}>{r.m[k]}× multiplier</span>
                        </div>
                      ))}
                    </div>
                  )}
                  </>
                )}
                <p id="estimate-qualifier" className="mt-3 text-center text-xs leading-snug text-t-muted">
                  Estimate only. Not a guarantee of any result or legal advice.
                </p>

                {r.barred ? (
                  <p className="mt-4 text-xs text-t-text" role="status"><strong>Recovery may be barred.</strong> At {r.faultPercent}% fault, Pennsylvania bars recovery when you are more than 50% at fault (42 Pa.C.S. § 7102).</p>
                ) : null}
                {!r.nonEconomicAllowed && !r.tortUnsure && r.ifNonEconomicAvailable && !r.barred ? (
                  <p className="mt-4 rounded-lg border border-t-muted/20 bg-t-ground px-3 py-2 text-xs leading-snug text-t-text">
                    {"Limited tort: "}
                    if pain and suffering is available (full tort, or a serious injury/exception under limited tort), the range would be {fmt(r.ifNonEconomicAvailable.low)} – {fmt(r.ifNonEconomicAvailable.high)} before any policy limit.
                  </p>
                ) : null}
                {r.policyLimitsMayBind && r.capped && !r.tortUnsure ? (
                  <p className="mt-4 rounded-lg border border-t-accent/50 bg-t-accent/10 px-3 py-2 text-xs text-t-text" role="status">
                    <strong>Policy limit (practical estimate, not a legal cap):</strong> this driver&apos;s insurance may stop at the {fmt(POLICY.find((p) => p.id === policy)!.value ?? 0)} per-person limit you entered; your underinsured motorist coverage or other sources may apply.
                  </p>
                ) : null}
                {offerNum != null && Number.isFinite(offerNum) && offerNum >= 0 && shown.mid > 0 ? (
                  <p className="mt-4 rounded-lg border border-t-muted/20 bg-t-ground px-3 py-2 text-xs text-t-text">
                    Your offer of {fmt(offerNum)} is {Math.round((offerNum / shown.mid) * 100)}% of the mid estimate. This comparison is educational only and is not advice on whether to accept an offer.
                  </p>
                ) : null}

                <details className="mt-4 rounded-xl border border-t-muted/20 bg-t-ground">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between px-4 text-xs font-bold text-t-accent [&::-webkit-details-marker]:hidden">
                    Show line-by-line math <span aria-hidden>▾</span>
                  </summary>
                  <dl id="breakdown" className="space-y-1.5 border-t border-t-muted/20 px-4 py-3 text-xs text-t-text">
                    <Row k="Medical bills" v={fmt(medicalBills)} />
                    <Row k="Less benefits paid or payable (§ 1722; § 1711 medical benefit)" v={`− ${fmt(r.medicalOffset)}`} />
                    <Row k="Lost wages + other + property (added once)" v={fmt(lostWages + otherOutOfPocket + propertyDamage)} />
                    <Row k="Economic damages" v={fmt(r.economic)} strong />
                    <Row k={`Severity: ${SEVERITY.find((s) => s.id === severity)!.label}`} v={`${(r.m.mid - r.m.adjustment).toFixed(2)}× base (estimate method, not law)`} />
                    <Row k={`Liability: ${lev.breakdownLabel}`} v={`${lev.coef > 0 ? "+" : ""}${lev.coef.toFixed(2)}×`} />
                    <Row k="All adjustments" v={`${r.m.adjustment > 0 ? "+" : ""}${r.m.adjustment.toFixed(2)}×`} />
                    <Row k={`Pain & suffering = gross medical × (${r.m.mid} − 1)`} v={r.nonEconomicAllowed ? fmt(r.nonEconomic.mid) : r.tortUnsure ? `${fmt(medicalBills * (r.m.mid - 1))} if full tort` : "Not included (tort option)"} />
                    <Row k={`Your fault ${r.faultPercent}%`} v={r.barred ? "Barred (>50%)" : `× ${(1 - r.faultPercent / 100).toFixed(2)}`} />
                    <Row k="Policy limit (practical, not a legal cap)" v={r.capped ? fmt(POLICY.find((p) => p.id === policy)!.value ?? 0) : "Unknown — not limited"} />
                  </dl>
                </details>

                <div className="mt-4 flex flex-col gap-2.5">
                  <a href={client.ctaUrl} className="flex min-h-[48px] items-center justify-center rounded-xl bg-t-accent px-4 text-sm font-bold text-t-on-accent hover:bg-t-accent/90">
                    {client.ctaText} — Review With An Attorney
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

/** Equal-weight scenario block (same tier styling as the main range). */
function Scenario({ title, range, m }: { title: string; range: { low: number; mid: number; high: number }; m?: { low: number; mid: number; high: number } }) {
  const single = range.low === range.high;
  return (
    <div className="rounded-xl border border-t-muted/20 bg-t-ground p-3 text-center text-t-text">
      <span className="block text-[11px] font-bold uppercase tracking-wider text-t-accent">{title}</span>
      {single ? (
        <span className="mt-1 block text-xl font-extrabold tabular-nums">{fmt(range.mid)}</span>
      ) : (
        <div className="mt-1 grid grid-cols-3 gap-1">
          {(["low", "mid", "high"] as const).map((k) => (
            <div key={k}>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-t-muted">{k}</span>
              <span className="block whitespace-nowrap text-xl font-extrabold tabular-nums">{fmt(range[k])}</span>
              {m ? <span className="block text-[10px] text-t-muted">{m[k]}× multiplier</span> : null}
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
