import type { ClientConfig } from "@/lib/types";
import { FirmHeader, FirmHero, FirmHowItWorks, FirmFAQ, FirmFooter, FirmStickyCTA } from "./FirmChrome";
import { PaCalculator } from "./PaCalculator";
import { PA_COPY } from "@/lib/engine/states/pa.copy";
import { FirmStateCalculator } from "./FirmStateCalculator";
import { STATE_KITS } from "@/lib/engine/states/kits";

/** Shared white-label page. State modules plug in here; unknown modules fail the build. */
export function FirmPage({ client }: { client: ClientConfig }) {
  if (!client.logo || !client.theme) throw new Error(`clients/${client.id}.json: logo and theme are required`);
  const kit = client.stateModule && client.stateModule !== "PA" ? STATE_KITS[client.stateModule as keyof typeof STATE_KITS] : undefined;
  if (kit) {
    const c = kit.copy;
    return (
      <>
        <FirmHeader client={client} regionName={c.regionName} rule={c.topbarRule} />
        <main>
          <FirmHero a={c.heroTitleA} b={c.heroTitleB} chips={[
            { title: "Private", detail: "Runs in your browser" },
            c.faultChip,
            { title: "Free consult", detail: "No-obligation case review" },
          ]} />
          <FirmStateCalculator client={client} kit={kit} />
          <FirmHowItWorks faultNote={c.faultNote} steps={c.how} />
          <FirmFAQ items={c.faq} client={client} />
        </main>
        <FirmFooter client={client} />
        <FirmStickyCTA client={client} />
      </>
    );
  }
  if (client.stateModule !== "PA") throw new Error(`clients/${client.id}.json: unsupported stateModule ${client.stateModule}`);
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
