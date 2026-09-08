import type { SignatureMomentKind } from "./types";

/**
 * Feature flags for premium moments.
 * Signature motion/3D stays OFF until Design delivers direction + assets.
 * Enable with NEXT_PUBLIC_SIGNATURE_MOMENT=1 and optionally
 * NEXT_PUBLIC_SIGNATURE_MOMENT_KIND=css|lottie|r3f
 */
function envFlag(name: string): boolean {
  const v = process.env[name];
  return v === "1" || v === "true" || v === "yes";
}

function parseKind(raw: string | undefined): SignatureMomentKind {
  if (raw === "css" || raw === "lottie" || raw === "r3f") return raw;
  return "none";
}

export const FEATURES = {
  /** Master switch — default false so demos never ship programmer-art 3D */
  signatureMomentEnabled: envFlag("NEXT_PUBLIC_SIGNATURE_MOMENT"),
  /**
   * Backend for the single signature moment (hero OR result reveal — pick one).
   * "none" = slot rendered empty / static fallback.
   * Do not invent spinning meshes; only load R3F/Lottie when Design provides assets.
   */
  signatureMomentKind: parseKind(process.env.NEXT_PUBLIC_SIGNATURE_MOMENT_KIND),
  /** Prefer result-reveal over hero unless Design says otherwise */
  signatureMomentPlacement:
    process.env.NEXT_PUBLIC_SIGNATURE_MOMENT_PLACEMENT === "hero"
      ? ("hero" as const)
      : ("result" as const),
};

export function shouldMountSignatureMoment(): boolean {
  return (
    FEATURES.signatureMomentEnabled && FEATURES.signatureMomentKind !== "none"
  );
}
