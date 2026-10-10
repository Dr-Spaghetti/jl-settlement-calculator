import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getActiveClient } from "@/lib/client";
import { FirmPage } from "@/components/firm/FirmPage";
import { FL_COPY } from "@/lib/engine/states/fl.copy";
import { SC_COPY } from "@/lib/engine/states/sc.copy";

/** Spanish route (generic i18n): only served when the firm config lists "es". */
export function generateMetadata(): Metadata {
  const c = getActiveClient();
  if (!c.locales?.includes("es")) return {};
  const region = c.stateModule === "FL" ? FL_COPY.es.regionName : SC_COPY.es.regionName;
  return {
    title: `Calculadora de acuerdos por accidentes de auto en ${region} | ${c.firmName}`,
    description: `Estimador educativo y gratuito de ${c.firmName}. No constituye asesoría legal.`,
    alternates: { languages: { en: "/", es: "/es" } },
  };
}

export default function SpanishPage() {
  const client = getActiveClient();
  if (client.template !== "firm-v1" || !client.locales?.includes("es")) notFound();
  return (
    <>
      {/* Root layout renders <html lang="en">; set the document language for this route. */}
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='es'" }} />
      <FirmPage client={client} locale="es" />
    </>
  );
}
