/**
 * Generic i18n for the white-label firm template (firm-v1).
 * - Locale list per firm comes from clients/<id>.json "locales" (default ["en"]).
 * - "en" is served at "/", every other locale at "/<locale>" (e.g. /es).
 * - UI chrome strings live here; state-law copy lives next to each state module
 *   (states/<st>.copy.ts) as { en, es }.
 * - Money is always formatted en-US ($10,000) in every locale so numbers are
 *   byte-identical across languages (tested in i18n.test.ts).
 */
export type Locale = "en" | "es";
export const LOCALES: readonly Locale[] = ["en", "es"] as const;
export const LOCALE_LABEL: Record<Locale, string> = { en: "English", es: "Español" };
export const localePath = (l: Locale) => (l === "en" ? "/" : `/${l}`);

export const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export interface Ui {
  langName: string;
  navCalculator: string; navFormula: string; navFaq: string; navPrimary: string;
  heroQualifier: string; startEstimate: string;
  chipPrivate: { title: string; detail: string }; chipConsult: { title: string; detail: string };
  howKicker: string; howTitle: string;
  faqTitle: string; ctaTitle: string; call: string; callShort: string;
  reviewWithAttorney: string;
  /** Footer pieces (legal line). */
  responsibleAttorney: string; offices: string; noRelationship: string;
  /** Calculator chrome */
  steps: [string, string, string]; stepsShort: [string, string, string]; stepOf: (n: number) => string;
  stepTitles: [string, string, string];
  back: string; next: string; viewEstimate: string; settlementCalculator: string; calcSteps: string;
  medical: string; wages: string; other: string; property: string;
  severity: string; care: string; months: string; gap: string; impairment: string; liability: string;
  yourFault: (p: number) => string;
  severityOpts: Record<"minor" | "moderate" | "severe" | "catastrophic", string>;
  careOpts: Record<"chiro" | "md" | "surgery", string>;
  gapOpts: Record<"none" | "short" | "long", string>;
  permOpts: Record<"none" | "possible" | "rated", string>;
  liabilityOpts: Record<"clear" | "mixed" | "disputed", string>;
  yes: string; no: string; notSure: string;
  policyLabel: string; policyHelp: string; unknown: string; perPerson: (v: string) => string;
  offerLabel: string; optional: string;
  estimateBadge: string; rangeTitle: string; econOnlyTitle: string; twoScenariosTitle: string;
  low: string; mid: string; high: string; estimate: string; multiplier: string;
  showMath: string;
  offerCompare: (offer: string, pct: number) => string;
  policyBind: (lim: string) => string; policyBindTitle: string;
  rowMedical: string; rowEconOnce: string; rowEconomic: string; rowSeverity: (s: string) => string;
  rowLiability: (l: string) => string; rowAdjust: string; rowPain: (m: number) => string;
  rowFault: (f: number) => string; barredShort: string; rowPolicy: string; rowPolicyUnknown: string;
  notIncluded: string; base: string;
}

const en: Ui = {
  langName: "English",
  navCalculator: "Calculator", navFormula: "The Formula", navFaq: "FAQ", navPrimary: "Primary",
  heroQualifier: "Estimate only. Not a guarantee of any result or legal advice.",
  startEstimate: "Start estimate",
  chipPrivate: { title: "Private", detail: "Runs in your browser" },
  chipConsult: { title: "Free consult", detail: "No-obligation case review" },
  howKicker: "Transparent by design", howTitle: "How the Estimate Is Calculated",
  faqTitle: "Frequently Asked Questions", ctaTitle: "Want a lawyer to look at your numbers?",
  call: "Call", callShort: "Call", reviewWithAttorney: "Review With An Attorney",
  responsibleAttorney: "Responsible attorney", offices: "Offices",
  noRelationship: "Use of this tool does not create an attorney-client relationship and is not legal advice.",
  steps: ["Economic Losses", "Injury & Fault", "Coverage"], stepsShort: ["Losses", "Injury", "Coverage"],
  stepOf: (n) => `Step ${n} of 3`,
  stepTitles: ["Your Economic Losses", "Injury, Treatment & Fault", "Your Coverage & the Other Driver's"],
  back: "← Back", next: "Continue →", viewEstimate: "View estimate", settlementCalculator: "Settlement calculator", calcSteps: "Calculator steps",
  medical: "Medical bills (past + expected)", wages: "Lost wages", other: "Other out-of-pocket costs", property: "Property damage",
  severity: "Injury severity", care: "Primary care", months: "Months of treatment", gap: "Gaps in treatment", impairment: "Lasting impairment", liability: "Liability",
  yourFault: (p) => `Your share of fault: ${p}%`,
  severityOpts: { minor: "Minor (soft tissue, brief recovery)", moderate: "Moderate (months of care, lasting symptoms)", severe: "Severe (fractures, significant impairment)", catastrophic: "Catastrophic (permanent / life-altering)" },
  careOpts: { chiro: "Chiropractic / PT primary", md: "MD / specialist care", surgery: "Surgery involved" },
  gapOpts: { none: "No meaningful gap in care", short: "Short gap (weeks)", long: "Long gap (months+)" },
  permOpts: { none: "No lasting impairment claimed", possible: "Possible lasting impairment", rated: "Documented permanent impairment" },
  liabilityOpts: { clear: "Clear liability (e.g. rear-ended, ran a red light)", mixed: "Shared or unclear fault", disputed: "Disputed / contested" },
  yes: "Yes", no: "No", notSure: "Not sure",
  policyLabel: "At-fault driver's bodily-injury limit (per person)",
  policyHelp: "A policy limit is not a legal cap on damages. Leave Unknown if you don't know it.",
  unknown: "Unknown", perPerson: (v) => `${v} per person`,
  offerLabel: "Insurance offer received (optional)", optional: "Optional",
  estimateBadge: "Settlement Estimate", rangeTitle: "Estimated Settlement Range", econOnlyTitle: "Economic Damages Only", twoScenariosTitle: "Two Scenarios",
  low: "low", mid: "mid", high: "high", estimate: "Estimate", multiplier: "multiplier",
  showMath: "Show line-by-line math",
  offerCompare: (o, p) => `Your offer of ${o} is ${p}% of the mid estimate. This comparison is educational only and is not advice on whether to accept an offer.`,
  policyBindTitle: "Policy limit (practical estimate, not a legal cap):",
  policyBind: (l) => `this driver's insurance may stop at the ${l} per-person limit you entered; your underinsured motorist coverage (if you have it) or other sources may apply.`,
  rowMedical: "Medical bills", rowEconOnce: "Lost wages + other + property (added once)", rowEconomic: "Economic damages",
  rowSeverity: (s) => `Severity: ${s} (estimate method, not law)`, rowLiability: (l) => `Liability: ${l}`, rowAdjust: "All adjustments",
  rowPain: (m) => `Pain & suffering = gross medical × (${m} − 1)`, rowFault: (f) => `Your fault ${f}%`, barredShort: "Barred (>50%)",
  rowPolicy: "Policy limit (practical, not a legal cap)", rowPolicyUnknown: "Unknown — not limited", notIncluded: "Not included", base: "base",
};

const es: Ui = {
  langName: "Español",
  navCalculator: "Calculadora", navFormula: "La fórmula", navFaq: "Preguntas", navPrimary: "Principal",
  heroQualifier: "Solo es una estimación. No garantiza ningún resultado ni constituye asesoría legal.",
  startEstimate: "Empezar la estimación",
  chipPrivate: { title: "Privada", detail: "Funciona en su navegador" },
  chipConsult: { title: "Consulta gratuita", detail: "Revisión del caso sin compromiso" },
  howKicker: "Transparente por diseño", howTitle: "Cómo se calcula la estimación",
  faqTitle: "Preguntas frecuentes", ctaTitle: "¿Quiere que un abogado revise sus números?",
  call: "Llame al", callShort: "Llamar", reviewWithAttorney: "Revisión con un abogado",
  responsibleAttorney: "Abogado responsable", offices: "Oficinas",
  noRelationship: "El uso de esta herramienta no establece una relación abogado-cliente y no constituye asesoría legal.",
  steps: ["Pérdidas económicas", "Lesión y culpa", "Cobertura"], stepsShort: ["Pérdidas", "Lesión", "Cobertura"],
  stepOf: (n) => `Paso ${n} de 3`,
  stepTitles: ["Sus pérdidas económicas", "Lesión, tratamiento y culpa", "Su cobertura y la del otro conductor"],
  back: "← Atrás", next: "Continuar →", viewEstimate: "Ver la estimación", settlementCalculator: "Calculadora de acuerdos", calcSteps: "Pasos de la calculadora",
  medical: "Gastos médicos (pasados y previstos)", wages: "Salarios perdidos", other: "Otros gastos de su bolsillo", property: "Daños a la propiedad",
  severity: "Gravedad de la lesión", care: "Atención principal", months: "Meses de tratamiento", gap: "Interrupciones en el tratamiento", impairment: "Discapacidad duradera", liability: "Responsabilidad",
  yourFault: (p) => `Su porcentaje de culpa: ${p}%`,
  severityOpts: { minor: "Leve (tejido blando, recuperación breve)", moderate: "Moderada (meses de atención, síntomas persistentes)", severe: "Grave (fracturas, discapacidad importante)", catastrophic: "Catastrófica (permanente / cambia la vida)" },
  careOpts: { chiro: "Quiropráctica / fisioterapia principal", md: "Médico / especialista", surgery: "Hubo cirugía" },
  gapOpts: { none: "Sin interrupciones importantes", short: "Interrupción corta (semanas)", long: "Interrupción larga (meses o más)" },
  permOpts: { none: "No se reclama discapacidad duradera", possible: "Posible discapacidad duradera", rated: "Discapacidad permanente documentada" },
  liabilityOpts: { clear: "Responsabilidad clara (p. ej., le chocaron por detrás o se pasaron un semáforo en rojo)", mixed: "Culpa compartida o poco clara", disputed: "En disputa / impugnada" },
  yes: "Sí", no: "No", notSure: "No estoy seguro",
  policyLabel: "Límite de lesiones corporales del conductor culpable (por persona)",
  policyHelp: "El límite de la póliza no es un tope legal de los daños. Deje «Desconocido» si no lo sabe.",
  unknown: "Desconocido", perPerson: (v) => `${v} por persona`,
  offerLabel: "Oferta recibida del seguro (opcional)", optional: "Opcional",
  estimateBadge: "Estimación del acuerdo", rangeTitle: "Rango estimado del acuerdo", econOnlyTitle: "Solo daños económicos", twoScenariosTitle: "Dos escenarios",
  low: "bajo", mid: "medio", high: "alto", estimate: "Estimación", multiplier: "multiplicador",
  showMath: "Ver el cálculo línea por línea",
  offerCompare: (o, p) => `Su oferta de ${o} es el ${p}% de la estimación media. Esta comparación es solo educativa y no es un consejo sobre si aceptar una oferta.`,
  policyBindTitle: "Límite de la póliza (estimación práctica, no un tope legal):",
  policyBind: (l) => `el seguro de este conductor podría pagar solo hasta el límite de ${l} por persona que usted indicó; su cobertura de motorista con seguro insuficiente (si la tiene) u otras fuentes podrían aplicarse.`,
  rowMedical: "Gastos médicos", rowEconOnce: "Salarios perdidos + otros + propiedad (se suman una vez)", rowEconomic: "Daños económicos",
  rowSeverity: (s) => `Gravedad: ${s} (método de estimación, no es ley)`, rowLiability: (l) => `Responsabilidad: ${l}`, rowAdjust: "Todos los ajustes",
  rowPain: (m) => `Dolor y sufrimiento = gastos médicos brutos × (${m} − 1)`, rowFault: (f) => `Su culpa ${f}%`, barredShort: "Excluido (>50%)",
  rowPolicy: "Límite de la póliza (práctico, no un tope legal)", rowPolicyUnknown: "Desconocido: sin límite", notIncluded: "No incluido", base: "base",
};

export const UI: Record<Locale, Ui> = { en, es };
