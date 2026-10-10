import type { ClientConfig } from "@/lib/types";
import { FirmHeader, FirmHero, FirmHowItWorks, FirmFAQ, FirmFooter, FirmStickyCTA } from "./FirmChrome";
import { PaCalculator } from "./PaCalculator";
import { StateCalculator } from "./StateCalculator";
import { PA_COPY } from "@/lib/engine/states/pa.copy";
import { FL_COPY } from "@/lib/engine/states/fl.copy";
import { SC_COPY } from "@/lib/engine/states/sc.copy";
import { UI, type Locale } from "@/lib/i18n";

/** Shared white-label page. State modules plug in here; unknown modules fail the build. */
export function FirmPage({ client, locale = "en" }: { client: ClientConfig; locale?: Locale }) {
  if (!client.logo || !client.theme) throw new Error(`clients/${client.id}.json: logo and theme are required`);
  if (client.stateModule === "PA") {
    if (locale !== "en") throw new Error("PA module is English-only");
    const copy = PA_COPY;
    return (
      <>
        <FirmHeader client={client} regionName={copy.regionName} rule={copy.topbarRule} />
        <main>
          <FirmHero a={copy.heroTitleA} b={copy.heroTitleB} chips={[
            { title: "Private", detail: "Runs in your browser" },
            copy.faultChip,
            { title: "Free consult", detail: "No-obligation case review" },
          ]} />
          <PaCalculator client={client} />
          <FirmHowItWorks faultNote={copy.faultNote} />
          <FirmFAQ items={copy.faq} client={client} />
        </main>
        <FirmFooter client={client} />
        <FirmStickyCTA client={client} />
      </>
    );
  }
  if (client.stateModule !== "FL" && client.stateModule !== "SC") throw new Error(`clients/${client.id}.json: unsupported stateModule ${client.stateModule}`);
  const ui = UI[locale];
  const copy = client.stateModule === "FL" ? FL_COPY[locale] : SC_COPY[locale];
  return (
    <div lang={locale}>
      <FirmHeader client={client} regionName={copy.regionName} rule={copy.topbarRule} ui={ui} locale={locale} />
      <main>
        <FirmHero a={copy.heroTitleA} b={copy.heroTitleB} ui={ui} chips={[ui.chipPrivate, copy.faultChip, ui.chipConsult]} />
        <StateCalculator client={client} locale={locale} />
        <FirmHowItWorks faultNote={copy.faultNote} steps={copy.how} ui={ui} />
        <FirmFAQ items={copy.faq} client={client} ui={ui} locale={locale} />
      </main>
      <FirmFooter client={client} ui={ui} />
      <FirmStickyCTA client={client} ui={ui} locale={locale} />
    </div>
  );
}
