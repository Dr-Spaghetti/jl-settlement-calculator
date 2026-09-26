import { DJ_ESTIMATE_QUALIFIER } from "@/lib/disclaimers";

/** Quiet one-line qualifier shown directly under the estimate figures (djlaw only). */
export function EstimateQualifier({ className = "", id }: { className?: string; id?: string }) {
  return (
    <p id={id} className={`text-center text-xs leading-snug text-[#C9C1B3] ${className}`}>
      {DJ_ESTIMATE_QUALIFIER}
    </p>
  );
}
