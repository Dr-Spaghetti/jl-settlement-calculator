import type { Locale } from "@/lib/i18n";

/** Florida page copy, English + Spanish. Numbers and statute cites must be identical across locales (i18n.test.ts). */
export interface FlCopy {
  regionName: string; heroTitleA: string; heroTitleB: string;
  faultChip: { title: string; detail: string }; topbarRule: string; faultNote: string;
  how: [string, string][];
  /** § 768.0427(2)(a) note under the medical-bills input. */
  medicalPaidNote: string;
  thresholdLabel: string; thresholdHelp: string; thresholdUnsureNote: string;
  scenarioMet: string; scenarioNotMet: string; titleUnsure: string;
  notMetLine: (lo: string, hi: string) => string;
  pipLabel: string; pipOpts: { emc: string; noEmc: string; none: string }; pipHelp: string;
  rowPip: string; rowPainNotMet: string; rowPainUnsure: (v: string) => string;
  barred: (f: number) => string;
  faq: { q: string; a: string }[];
}

const en: FlCopy = {
  regionName: "Florida",
  heroTitleA: "Florida Car Accident",
  heroTitleB: "Settlement Calculator",
  faultChip: { title: "FL fault rule", detail: "No recovery if more than 50% at fault" },
  topbarRule: "Florida comparative fault: no recovery if more than 50% at fault",
  faultNote:
    "Florida comparative fault (Fla. Stat. § 768.81): your fault reduces your damages proportionately, and a party found greater than 50 percent at fault for his or her own harm may not recover any damages. This applies to negligence lawsuits filed after March 24, 2023 (ch. 2023-15, § 30, Laws of Fla.).",
  medicalPaidNote: "For Florida lawsuits filed after March 24, 2023, past medical bills that have been paid are proven by the amount actually paid, not the amount billed (Fla. Stat. § 768.0427(2)(a)). Enter amounts paid if you know them.",
  how: [
    ["Economic losses", "Medical bills, lost wages, other out-of-pocket costs and property damage are added once. They are never multiplied. Personal Injury Protection (PIP) benefits paid or payable are subtracted, because they can't be recovered again from the at-fault driver (Fla. Stat. § 627.736(3)). For Florida lawsuits filed after March 24, 2023, past medical bills that have been paid are proven by the amount actually paid, not the amount billed (Fla. Stat. § 768.0427(2)(a)). Enter amounts paid if you know them."],
    ["Pain & suffering", "Pain and suffering = medical bills × (multiplier − 1), on gross medical bills. It is included only if the § 627.737(2) threshold is met. The multiplier range comes from injury severity, treatment and liability. Shared or disputed liability lowers the estimate in addition to the fault %. This is an estimate method, not law, and not how any insurer or court must value a claim."],
    ["State rules", ""],
    ["Policy reality", "A policy limit is not a legal cap on damages. If you enter the at-fault driver's per-person bodily-injury limit, the shown range stops there as a practical collection estimate; your uninsured/underinsured motorist coverage (if you have it) or other sources may apply. If you don't know the limit, nothing is limited."],
  ],
  thresholdLabel: "Does your injury meet Florida's threshold for pain and suffering?",
  thresholdHelp:
    "Fla. Stat. § 627.737(2): against a driver or owner whose vehicle had Florida no-fault security, pain and suffering can be recovered only if the injury consists in whole or in part of: significant and permanent loss of an important bodily function; permanent injury within a reasonable degree of medical probability, other than scarring or disfigurement; significant and permanent scarring or disfigurement; or death.",
  thresholdUnsureNote:
    "Whether the § 627.737(2) threshold is met usually turns on medical evidence, so both scenarios are shown. A Florida attorney can review your records.",
  scenarioMet: "If the threshold is met",
  scenarioNotMet: "If the threshold is not met",
  titleUnsure: "Two Scenarios: Threshold Not Sure",
  notMetLine: (lo, hi) => `Threshold not met: if the § 627.737(2) threshold were met, the range would be ${lo} – ${hi} before any policy limit.`,
  pipLabel: "Your Personal Injury Protection (PIP)",
  pipOpts: {
    emc: "PIP, emergency medical condition determined ($10,000 limit)",
    noEmc: "PIP, no emergency medical condition (medical capped at $2,500)",
    none: "No PIP available to me",
  },
  pipHelp:
    "Florida PIP pays 80% of reasonable medical expenses and 60% of lost income, up to a $10,000 limit for medical and disability benefits. Medical benefits require initial care within 14 days after the accident and are limited to $2,500 if a provider determines you did not have an emergency medical condition (Fla. Stat. § 627.736(1)).",
  rowPip: "Less PIP paid or payable (§ 627.736(3))",
  rowPainNotMet: "Not included (§ 627.737(2) threshold)",
  rowPainUnsure: (v) => `${v} if threshold met`,
  barred: (f) => `At ${f}% fault, Florida law bars recovery when you are found greater than 50 percent at fault for your own harm (Fla. Stat. § 768.81(6)).`,
  faq: [
    {
      q: "Do I need a permanent injury to recover pain and suffering in Florida?",
      a: "Against a driver or owner whose vehicle had Florida no-fault (PIP) security, generally yes. Fla. Stat. § 627.737(2) allows damages for pain, suffering, mental anguish and inconvenience only if the injury consists in whole or in part of: significant and permanent loss of an important bodily function; permanent injury within a reasonable degree of medical probability, other than scarring or disfigurement; significant and permanent scarring or disfigurement; or death. Economic losses beyond what PIP pays can still be claimed (§ 627.737(1)).",
    },
    {
      q: "What does Florida PIP pay?",
      a: "PIP pays 80% of reasonable medical expenses and 60% of lost income, up to a $10,000 limit for medical and disability benefits, plus a $5,000 death benefit (Fla. Stat. § 627.736(1)). Medical benefits require initial care within 14 days after the accident and are limited to $2,500 if a provider determines you did not have an emergency medical condition. Benefits paid or payable by PIP can't be recovered again from the at-fault driver (§ 627.736(3)).",
    },
    {
      q: "How does my share of fault affect a Florida claim?",
      a: "Under Fla. Stat. § 768.81(2), your fault diminishes economic and noneconomic damages proportionately. Under § 768.81(6), a party found greater than 50 percent at fault for his or her own harm may not recover any damages; that subsection does not apply to medical negligence actions under chapter 766. These rules apply to lawsuits filed after March 24, 2023 (ch. 2023-15, § 30, Laws of Fla.).",
    },
    {
      q: "How long do I have to file a car accident lawsuit in Florida?",
      a: "An action founded on negligence generally must be filed within 2 years (Fla. Stat. § 95.11(5)(a)). The 2-year period applies to causes of action accruing after March 24, 2023 (ch. 2023-15, § 28, Laws of Fla.); an earlier accident may fall under the prior period. Exceptions and claims against government entities have different rules. Confirm your deadline with a Florida attorney.",
    },
    {
      q: "What if the at-fault driver has little or no bodily-injury insurance?",
      a: "Florida requires PIP with a $10,000 limit (Fla. Stat. § 627.736(1)) and $10,000 of property damage liability (§ 324.022(1)), so the at-fault driver's bodily-injury coverage may be low or unknown. A policy limit is not a legal cap on damages. Your uninsured/underinsured motorist coverage, if you have it (it can be rejected in writing, § 627.727(1)), may apply; it covers pain and suffering only if the § 627.737(2) threshold is met (§ 627.727(7)). Leave the policy limit on Unknown if you don't know it.",
    },
  ],
};

const es: FlCopy = {
  regionName: "Florida",
  heroTitleA: "Calculadora de acuerdos",
  heroTitleB: "por accidentes de auto en Florida",
  faultChip: { title: "Regla de culpa en FL", detail: "Sin indemnización si tiene más del 50% de culpa" },
  topbarRule: "Culpa comparativa en Florida: sin indemnización si tiene más del 50% de culpa",
  faultNote:
    "Culpa comparativa en Florida (Fla. Stat. § 768.81): su culpa reduce sus daños de forma proporcional, y la parte a la que se le atribuya más del 50 por ciento de la culpa por su propio daño no puede recuperar ningún daño. Esto se aplica a las demandas por negligencia presentadas después del 24 de marzo de 2023 (ch. 2023-15, § 30, Laws of Fla.).",
  medicalPaidNote: "En las demandas de Florida presentadas después del 24 de marzo de 2023, los gastos médicos pasados ya pagados se prueban por el monto realmente pagado, no por el monto facturado (Fla. Stat. § 768.0427(2)(a)). Indique los montos pagados si los conoce.",
  how: [
    ["Pérdidas económicas", "Los gastos médicos, los salarios perdidos, otros gastos de su bolsillo y los daños a la propiedad se suman una sola vez. Nunca se multiplican. Se restan los beneficios de Protección contra Lesiones Personales (PIP) pagados o pagaderos, porque no se pueden cobrar de nuevo al conductor culpable (Fla. Stat. § 627.736(3)). En las demandas de Florida presentadas después del 24 de marzo de 2023, los gastos médicos pasados ya pagados se prueban por el monto realmente pagado, no por el monto facturado (Fla. Stat. § 768.0427(2)(a)). Indique los montos pagados si los conoce."],
    ["Dolor y sufrimiento", "Dolor y sufrimiento = gastos médicos × (multiplicador − 1), sobre los gastos médicos brutos. Solo se incluye si se cumple el umbral del § 627.737(2). El rango del multiplicador depende de la gravedad de la lesión, del tratamiento y de la responsabilidad. Una responsabilidad compartida o en disputa reduce la estimación además del porcentaje de culpa. Es un método de estimación, no es ley, y no es la forma en que una aseguradora o un tribunal deba valorar un reclamo."],
    ["Reglas del estado", ""],
    ["La realidad de la póliza", "El límite de la póliza no es un tope legal de los daños. Si indica el límite por persona de lesiones corporales del conductor culpable, el rango mostrado se detiene ahí como estimación práctica de cobro; su cobertura de motorista sin seguro o con seguro insuficiente (si la tiene) u otras fuentes podrían aplicarse. Si no conoce el límite, no se limita nada."],
  ],
  thresholdLabel: "¿Su lesión cumple el umbral de Florida para reclamar dolor y sufrimiento?",
  thresholdHelp:
    "Fla. Stat. § 627.737(2): contra un conductor o propietario cuyo vehículo tenía la garantía del seguro sin culpa (no-fault) de Florida, solo se puede recuperar dolor y sufrimiento si la lesión consiste, en todo o en parte, en: pérdida importante y permanente de una función corporal importante; lesión permanente dentro de un grado razonable de probabilidad médica, salvo cicatrices o desfiguración; cicatrices o desfiguración importantes y permanentes; o la muerte.",
  thresholdUnsureNote:
    "Si se cumple el umbral del § 627.737(2) suele depender de la evidencia médica, por eso se muestran ambos escenarios. Un abogado de Florida puede revisar sus expedientes.",
  scenarioMet: "Si se cumple el umbral",
  scenarioNotMet: "Si no se cumple el umbral",
  titleUnsure: "Dos escenarios: no está seguro del umbral",
  notMetLine: (lo, hi) => `Umbral no cumplido: si se cumpliera el umbral del § 627.737(2), el rango sería de ${lo} – ${hi} antes de cualquier límite de la póliza.`,
  pipLabel: "Su Protección contra Lesiones Personales (PIP)",
  pipOpts: {
    emc: "PIP, se determinó una condición médica de emergencia (límite de $10,000)",
    noEmc: "PIP, sin condición médica de emergencia (beneficios médicos limitados a $2,500)",
    none: "No tengo PIP disponible",
  },
  pipHelp:
    "El PIP de Florida paga el 80% de los gastos médicos razonables y el 60% de los ingresos perdidos, hasta un límite de $10,000 en beneficios médicos y por incapacidad. Los beneficios médicos exigen recibir la atención inicial dentro de los 14 días posteriores al accidente y se limitan a $2,500 si un proveedor determina que usted no tuvo una condición médica de emergencia (Fla. Stat. § 627.736(1)).",
  rowPip: "Menos PIP pagado o pagadero (§ 627.736(3))",
  rowPainNotMet: "No incluido (umbral del § 627.737(2))",
  rowPainUnsure: (v) => `${v} si se cumple el umbral`,
  barred: (f) => `Con un ${f}% de culpa, la ley de Florida no permite indemnización cuando se determina que usted tiene más del 50 por ciento de la culpa por su propio daño (Fla. Stat. § 768.81(6)).`,
  faq: [
    {
      q: "¿Necesito una lesión permanente para recuperar dolor y sufrimiento en Florida?",
      a: "Contra un conductor o propietario cuyo vehículo tenía la garantía del seguro sin culpa (PIP) de Florida, por lo general sí. Fla. Stat. § 627.737(2) permite daños por dolor, sufrimiento, angustia mental e inconvenientes solo si la lesión consiste, en todo o en parte, en: pérdida importante y permanente de una función corporal importante; lesión permanente dentro de un grado razonable de probabilidad médica, salvo cicatrices o desfiguración; cicatrices o desfiguración importantes y permanentes; o la muerte. Las pérdidas económicas que superen lo que paga el PIP se pueden reclamar de todos modos (§ 627.737(1)).",
    },
    {
      q: "¿Qué paga el PIP de Florida?",
      a: "El PIP paga el 80% de los gastos médicos razonables y el 60% de los ingresos perdidos, hasta un límite de $10,000 en beneficios médicos y por incapacidad, más un beneficio por muerte de $5,000 (Fla. Stat. § 627.736(1)). Los beneficios médicos exigen recibir la atención inicial dentro de los 14 días posteriores al accidente y se limitan a $2,500 si un proveedor determina que usted no tuvo una condición médica de emergencia. Lo que el PIP pagó o debe pagar no se puede cobrar de nuevo al conductor culpable (§ 627.736(3)).",
    },
    {
      q: "¿Cómo afecta mi porcentaje de culpa a un reclamo en Florida?",
      a: "Según Fla. Stat. § 768.81(2), su culpa reduce de forma proporcional los daños económicos y no económicos. Según el § 768.81(6), la parte a la que se le atribuya más del 50 por ciento de la culpa por su propio daño no puede recuperar ningún daño; esa subsección no se aplica a las demandas por negligencia médica del capítulo 766. Estas reglas se aplican a las demandas presentadas después del 24 de marzo de 2023 (ch. 2023-15, § 30, Laws of Fla.).",
    },
    {
      q: "¿Cuánto tiempo tengo para presentar una demanda por un accidente de auto en Florida?",
      a: "Una acción basada en negligencia por lo general debe presentarse dentro de 2 años (Fla. Stat. § 95.11(5)(a)). El plazo de prescripción de 2 años se aplica a las causas de acción que surgieron después del 24 de marzo de 2023 (ch. 2023-15, § 28, Laws of Fla.); un accidente anterior puede regirse por el plazo previo. Las excepciones y los reclamos contra entidades del gobierno tienen reglas distintas. Confirme su plazo con un abogado de Florida.",
    },
    {
      q: "¿Qué pasa si el conductor culpable tiene poco o ningún seguro de lesiones corporales?",
      a: "Florida exige el PIP con un límite de $10,000 (Fla. Stat. § 627.736(1)) y $10,000 de responsabilidad por daños a la propiedad (§ 324.022(1)), así que la cobertura de lesiones corporales del conductor culpable puede ser baja o desconocida. El límite de la póliza no es un tope legal de los daños. Su cobertura de motorista sin seguro o con seguro insuficiente, si la tiene (se puede rechazar por escrito, § 627.727(1)), podría aplicarse; cubre el dolor y sufrimiento solo si se cumple el umbral del § 627.737(2) (§ 627.727(7)). Deje el límite de la póliza en «Desconocido» si no lo sabe.",
    },
  ],
};

export const FL_COPY: Record<Locale, FlCopy> = { en, es };
