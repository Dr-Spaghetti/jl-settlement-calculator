import type { Locale } from "@/lib/i18n";

/** South Carolina page copy, English + Spanish. Numbers and cites identical across locales (i18n.test.ts). */
export interface ScCopy {
  regionName: string; heroTitleA: string; heroTitleB: string;
  faultChip: { title: string; detail: string }; topbarRule: string; faultNote: string;
  how: [string, string][];
  insuredLabel: string; insuredOpts: { insured: string; uninsured: string; unsure: string };
  umNote: string; unsureBoth: [string, string];
  policyMinLabel: string;
  barred: (f: number) => string;
  faq: { q: string; a: string }[];
}

const en: ScCopy = {
  regionName: "South Carolina",
  heroTitleA: "South Carolina Car Accident",
  heroTitleB: "Settlement Calculator",
  faultChip: { title: "SC fault rule", detail: "Barred if more than 50% at fault" },
  topbarRule: "South Carolina comparative negligence: barred if more than 50% at fault",
  faultNote:
    "South Carolina uses modified comparative negligence (Nelson v. Concrete Supply Co., 303 S.C. 243 (1991)): you may recover if your negligence is not greater than that of the defendants combined, and your recovery is reduced in proportion to your negligence. More than 50% at fault means no recovery.",
  how: [
    ["Economic losses", "Medical bills, lost wages, other out-of-pocket costs and property damage are added once. They are never multiplied. South Carolina mandates no PIP coverage, and optional medical payments coverage is not subject to a setoff (S.C. Code § 38-77-144), so nothing is subtracted here."],
    ["Pain & suffering", "Pain and suffering = medical bills × (multiplier − 1), on gross medical bills. The multiplier range comes from injury severity, treatment and liability. Shared or disputed liability lowers the estimate in addition to the fault %. This is an estimate method, not law, and not how any insurer or court must value a claim."],
    ["State rules", ""],
    ["Policy reality", "A policy limit is not a legal cap on damages. If you enter the at-fault driver's per-person limit, the shown range stops there as a practical collection estimate; your underinsured motorist coverage (if you have it) or other sources may apply. If you don't know the limit, nothing is limited."],
  ],
  insuredLabel: "Was the at-fault driver insured?",
  insuredOpts: { insured: "Insured", uninsured: "Uninsured", unsure: "Not sure" },
  umNote:
    "Every South Carolina auto policy must include uninsured motorist (UM) coverage of at least $25,000 per person and $50,000 per accident, plus $25,000 for property damage (S.C. Code §§ 38-77-140, 38-77-150). If the at-fault driver was uninsured, your own UM coverage may pay. Insurers must also offer underinsured motorist (UIM) coverage, which you may or may not have bought (§ 38-77-160).",
  unsureBoth: [
    "If the other driver was insured: their liability policy (at least $25,000 per person, § 38-77-140) is the usual first source.",
    "If the other driver was uninsured: your own UM coverage (at least $25,000 per person, § 38-77-150) may pay.",
  ],
  policyMinLabel: "SC minimum: $25,000 per person / $50,000 per accident",
  barred: (f) => `At ${f}% fault, South Carolina bars recovery when your negligence is greater than that of the defendants combined (Nelson v. Concrete Supply Co., 303 S.C. 243 (1991)).`,
  faq: [
    {
      q: "How does my share of fault affect a South Carolina claim?",
      a: "Under Nelson v. Concrete Supply Co., 303 S.C. 243 (1991), for causes of action arising on or after July 1, 1991, you may recover damages if your negligence is not greater than that of the defendant, and your recovery is reduced in proportion to your negligence. If there is more than one defendant, your negligence is compared to their combined negligence. The calculator applies both rules.",
    },
    {
      q: "How long do I have to file a car accident lawsuit in South Carolina?",
      a: "Generally 3 years for an injury to the person (S.C. Code § 15-3-530(5)), counted from when you knew or by the exercise of reasonable diligence should have known that you had a cause of action (§ 15-3-535). Claims against a government entity under the South Carolina Tort Claims Act generally must be filed within 2 years, or 3 years if a claim was first filed under that Act (§ 15-78-110). Confirm your deadline with a South Carolina attorney.",
    },
    {
      q: "What is South Carolina's minimum auto liability insurance?",
      a: "At least $25,000 for bodily injury to one person, $50,000 for bodily injury to two or more people in one accident, and $25,000 for property damage (S.C. Code § 38-77-140). A policy limit is not a legal cap on damages: this driver's insurance may stop at that limit, and other coverage may apply. Leave the policy limit on Unknown if you don't know it.",
    },
    {
      q: "What if the at-fault driver was uninsured or underinsured?",
      a: "Every South Carolina auto policy must include uninsured motorist (UM) coverage of at least $25,000 per person and $50,000 per accident, plus $25,000 for property damage (S.C. Code § 38-77-150). Insurers must also offer underinsured motorist (UIM) coverage up to your liability limits; buying it is your choice (§ 38-77-160).",
    },
    {
      q: "Does South Carolina have PIP?",
      a: "No. No personal injury protection (PIP) coverage is mandated under South Carolina's automobile insurance laws (S.C. Code § 38-77-144). If you bought medical payments coverage, it is not subject to a setoff, so this estimate does not subtract it.",
    },
  ],
};

const es: ScCopy = {
  regionName: "Carolina del Sur",
  heroTitleA: "Calculadora de acuerdos",
  heroTitleB: "por accidentes de auto en Carolina del Sur",
  faultChip: { title: "Regla de culpa en SC", detail: "Sin indemnización si tiene más del 50% de culpa" },
  topbarRule: "Negligencia comparativa en Carolina del Sur: sin indemnización si tiene más del 50% de culpa",
  faultNote:
    "Carolina del Sur aplica la negligencia comparativa modificada (Nelson v. Concrete Supply Co., 303 S.C. 243 (1991)): usted puede recuperar daños si su negligencia no es mayor que la de los demandados en conjunto, y su indemnización se reduce en proporción a su negligencia. Con más del 50% de culpa no hay indemnización.",
  how: [
    ["Pérdidas económicas", "Los gastos médicos, los salarios perdidos, otros gastos de su bolsillo y los daños a la propiedad se suman una sola vez. Nunca se multiplican. Carolina del Sur no exige cobertura PIP, y la cobertura opcional de pagos médicos no está sujeta a compensación (S.C. Code § 38-77-144), así que aquí no se resta nada."],
    ["Dolor y sufrimiento", "Dolor y sufrimiento = gastos médicos × (multiplicador − 1), sobre los gastos médicos brutos. El rango del multiplicador depende de la gravedad de la lesión, del tratamiento y de la responsabilidad. Una responsabilidad compartida o en disputa reduce la estimación además del porcentaje de culpa. Es un método de estimación, no es ley, y no es la forma en que una aseguradora o un tribunal deba valorar un reclamo."],
    ["Reglas del estado", ""],
    ["La realidad de la póliza", "El límite de la póliza no es un tope legal de los daños. Si indica el límite por persona del conductor culpable, el rango mostrado se detiene ahí como estimación práctica de cobro; su cobertura de motorista con seguro insuficiente (si la tiene) u otras fuentes podrían aplicarse. Si no conoce el límite, no se limita nada."],
  ],
  insuredLabel: "¿El conductor culpable tenía seguro?",
  insuredOpts: { insured: "Tenía seguro", uninsured: "No tenía seguro", unsure: "No estoy seguro" },
  umNote:
    "Toda póliza de auto de Carolina del Sur debe incluir cobertura de motorista sin seguro (UM) de al menos $25,000 por persona y $50,000 por accidente, más $25,000 por daños a la propiedad (S.C. Code §§ 38-77-140, 38-77-150). Si el conductor culpable no tenía seguro, su propia cobertura UM podría pagar. Las aseguradoras también deben ofrecer cobertura de motorista con seguro insuficiente (UIM), que usted pudo haber comprado o no (§ 38-77-160).",
  unsureBoth: [
    "Si el otro conductor tenía seguro: su póliza de responsabilidad (al menos $25,000 por persona, § 38-77-140) suele ser la primera fuente.",
    "Si el otro conductor no tenía seguro: su propia cobertura UM (al menos $25,000 por persona, § 38-77-150) podría pagar.",
  ],
  policyMinLabel: "Mínimo en SC: $25,000 por persona / $50,000 por accidente",
  barred: (f) => `Con un ${f}% de culpa, Carolina del Sur no permite indemnización cuando su negligencia es mayor que la de los demandados en conjunto (Nelson v. Concrete Supply Co., 303 S.C. 243 (1991)).`,
  faq: [
    {
      q: "¿Cómo afecta mi porcentaje de culpa a un reclamo en Carolina del Sur?",
      a: "Según Nelson v. Concrete Supply Co., 303 S.C. 243 (1991), para las causas de acción que surgieron a partir del 1 de julio de 1991, usted puede recuperar daños si su negligencia no es mayor que la del demandado, y su indemnización se reduce en proporción a su negligencia. Si hay más de un demandado, su negligencia se compara con la negligencia combinada de todos ellos. La calculadora aplica ambas reglas.",
    },
    {
      q: "¿Cuánto tiempo tengo para presentar una demanda por un accidente de auto en Carolina del Sur?",
      a: "Por lo general, 3 años por una lesión a la persona (S.C. Code § 15-3-530(5)), contados desde que usted supo o, con diligencia razonable, debió saber que tenía una causa de acción (§ 15-3-535). Los reclamos contra una entidad del gobierno bajo la Ley de Reclamos por Agravios de Carolina del Sur (South Carolina Tort Claims Act) por lo general deben presentarse dentro de 2 años, o de 3 años si primero se presentó un reclamo bajo esa ley (§ 15-78-110). Confirme su plazo de prescripción con un abogado de Carolina del Sur.",
    },
    {
      q: "¿Cuál es el seguro mínimo de responsabilidad de auto en Carolina del Sur?",
      a: "Al menos $25,000 por lesiones corporales a una persona, $50,000 por lesiones corporales a dos o más personas en un accidente y $25,000 por daños a la propiedad (S.C. Code § 38-77-140). El límite de la póliza no es un tope legal de los daños: el seguro de este conductor podría pagar solo hasta ese límite, y otras coberturas podrían aplicarse. Deje el límite de la póliza en «Desconocido» si no lo sabe.",
    },
    {
      q: "¿Qué pasa si el conductor culpable no tenía seguro o tenía un seguro insuficiente?",
      a: "Toda póliza de auto de Carolina del Sur debe incluir cobertura de motorista sin seguro (UM) de al menos $25,000 por persona y $50,000 por accidente, más $25,000 por daños a la propiedad (S.C. Code § 38-77-150). Las aseguradoras también deben ofrecer cobertura de motorista con seguro insuficiente (UIM) hasta sus límites de responsabilidad; comprarla es su decisión (§ 38-77-160).",
    },
    {
      q: "¿Tiene Carolina del Sur el seguro PIP?",
      a: "No. Las leyes de seguro de auto de Carolina del Sur no exigen la cobertura de Protección contra Lesiones Personales (PIP) (S.C. Code § 38-77-144). Si usted compró cobertura de pagos médicos, no está sujeta a compensación, así que esta estimación no la resta.",
    },
  ],
};

export const SC_COPY: Record<Locale, ScCopy> = { en, es };
