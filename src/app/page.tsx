import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Calculator } from "@/components/Calculator";
import { HowItWorks } from "@/components/HowItWorks";
import { RangesTable } from "@/components/RangesTable";
import { FAQ } from "@/components/FAQ";
import { CTASection } from "@/components/CTASection";
import { Testimonials } from "@/components/Testimonials";
import { ProfessionalDisclaimer } from "@/components/ProfessionalDisclaimer";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { getActiveClient, clientUsesDjFonts } from "@/lib/client";
import { FirmPage } from "@/components/firm/FirmPage";

export default function HomePage() {
  const client = getActiveClient();
  const isDj = clientUsesDjFonts(client);
  if (client.template === "firm-v1") return <FirmPage client={client} />;

  return (
    <>
      <Header client={client} />
      <main>
        <Hero client={client} />
        <Calculator defaultState={client.state} client={client} />
        <HowItWorks dj={isDj} />
        <RangesTable client={client} />
        <Testimonials client={client} />
        <CTASection client={client} />
        <FAQ client={client} />
        {isDj ? null : <ProfessionalDisclaimer client={client} />}
      </main>
      <Footer client={client} />
      <StickyMobileCTA client={client} />
    </>
  );
}
