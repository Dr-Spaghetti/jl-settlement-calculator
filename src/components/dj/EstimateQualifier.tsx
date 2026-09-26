import { DJ_ESTIMATE_QUALIFIER } from "@/lib/disclaimers";

/** Concise qualifier rendered directly adjacent to dollar estimates (djlaw only). */
export function EstimateQualifier({
  tone = "dark",
  className = "",
  id,
}: {
  tone?: "dark" | "light";
  className?: string;
  id?: string;
}) {
  const dark = tone === "dark";
  return (
    <p
      id={id}
      className={`rounded-lg border px-3 py-2.5 text-left text-xs leading-relaxed ${
        dark
          ? "border-[#3A3426] bg-[#141414] text-[#E7E5E4]"
          : "border-[#D6D3D1] bg-[#FAFAF9] text-[#292524]"
      } ${className}`}
    >
      <strong className={dark ? "font-semibold text-[#C9A227]" : "font-semibold text-[#0A0A0A]"}>
        Important:
      </strong>{" "}
      {DJ_ESTIMATE_QUALIFIER}{" "}
      <a
        href="#legal-disclaimer"
        className={`font-semibold underline underline-offset-2 ${
          dark ? "text-white decoration-[#C9A227]" : "text-[#0A0A0A] decoration-[#7A5F12]"
        }`}
      >
        Full disclaimer
      </a>
    </p>
  );
}
