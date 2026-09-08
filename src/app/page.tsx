import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { TrustStrip } from "@/components/TrustStrip";
import { Calculator } from "@/components/Calculator";
import { HowItWorks } from "@/components/HowItWorks";
import { RangesTable } from "@/components/RangesTable";
import { FAQ } from "@/components/FAQ";
import { CTASection } from "@/components/CTASection";
import { Testimonials } from "@/components/Testimonials";
import { ProfessionalDisclaimer } from "@/components/ProfessionalDisclaimer";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { getActiveClient } from "@/lib/client";

export default function HomePage() {
  const client = getActiveClient();

  return (
    <>
      <Header client={client} />
      <DisclaimerBanner />
      <main>
        <Hero client={client} />
        <TrustStrip client={client} />
        <Calculator defaultState={client.state} client={client} />
        <HowItWorks />
        <RangesTable />
        <Testimonials client={client} />
        <CTASection client={client} />
        <FAQ client={client} />
        <ProfessionalDisclaimer client={client} />
      </main>
      <Footer client={client} />
      <StickyMobileCTA client={client} />
    </>
  );
}
