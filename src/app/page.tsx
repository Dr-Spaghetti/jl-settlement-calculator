import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Calculator } from "@/components/Calculator";
import { HowItWorks } from "@/components/HowItWorks";
import { RangesTable } from "@/components/RangesTable";
import { FAQ } from "@/components/FAQ";
import { CTASection } from "@/components/CTASection";
import { getActiveClient } from "@/lib/client";

export default function HomePage() {
  const client = getActiveClient();

  return (
    <>
      <Header client={client} />
      <DisclaimerBanner />
      <main>
        <Hero client={client} />
        <Calculator defaultState={client.state} />
        <HowItWorks />
        <RangesTable />
        <CTASection client={client} />
        <FAQ />
        <section className="border-t border-amber-200 bg-amber-50 py-10" aria-label="Full disclaimer">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-900">
              Disclaimer
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-amber-950/90">
              {client.attorneyDisclaimer}
            </p>
          </div>
        </section>
      </main>
      <Footer client={client} />
    </>
  );
}
