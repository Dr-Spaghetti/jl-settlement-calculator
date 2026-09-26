import type { ClientConfig } from "@/lib/types";
import {
  djDisclaimerItems,
  djOfficeLine,
  djResponsibleAttorney,
} from "@/lib/disclaimers";

/** Full, always-reachable disclaimer section for the Djougourian variant. */
export function DjLegalDisclaimer({ client }: { client: ClientConfig }) {
  const items = djDisclaimerItems(client);
  const tel = client.phone.replace(/[^\d+]/g, "");
  return (
    <section
      id="legal-disclaimer"
      className="scroll-mt-28 border-t border-[#3A3426] bg-[#111111] py-12 sm:py-14"
      aria-labelledby="disclaimer-heading"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9A227]">
          Attorney Advertising
        </p>
        <h2
          id="disclaimer-heading"
          className="font-display mt-1 text-2xl font-semibold text-white sm:text-3xl"
        >
          Important Legal Disclaimer
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#D6D3D1]">
          This website is an advertisement for legal services by{" "}
          <strong className="font-semibold text-white">{client.firmName}</strong>,{" "}
          {djOfficeLine(client)}. Attorney responsible for this communication:{" "}
          {djResponsibleAttorney(client)}. Phone:{" "}
          <a
            href={`tel:${tel}`}
            className="font-semibold text-white underline decoration-[#C9A227] underline-offset-2"
          >
            {client.phone}
          </a>
          .
        </p>

        <dl className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="border-l-2 border-[#C9A227] pl-4">
              <dt className="text-sm font-semibold text-white">{item.title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-[#D6D3D1]">{item.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
