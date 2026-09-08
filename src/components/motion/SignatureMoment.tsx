"use client";

import { FEATURES, shouldMountSignatureMoment } from "@/lib/features";
import type { SignatureMomentKind } from "@/lib/types";

/**
 * Single signature moment slot (hero OR result reveal — pick one via FEATURES).
 *
 * WAITING ON DESIGN: do not invent cheap spinning 3D or programmer-art meshes.
 * When Design delivers direction + assets:
 * - kind=css → high-end CSS / Lottie-free reveal
 * - kind=lottie → dynamic-import a Lottie player + approved JSON
 * - kind=r3f → dynamic-import R3F/drei scene behind this flag only
 *
 * Until then this renders a static, accessible fallback (or nothing).
 */
export function SignatureMoment({
  placement,
  className = "",
}: {
  placement: "hero" | "result";
  className?: string;
}) {
  if (FEATURES.signatureMomentPlacement !== placement) return null;
  if (!shouldMountSignatureMoment()) {
    return (
      <div
        className={`signature-moment-slot signature-moment-slot--pending ${className}`}
        data-signature-kind="none"
        data-design-status="waiting"
        aria-hidden
      />
    );
  }

  return (
    <SignatureMomentBackend kind={FEATURES.signatureMomentKind} className={className} />
  );
}

function SignatureMomentBackend({
  kind,
  className,
}: {
  kind: SignatureMomentKind;
  className: string;
}) {
  // Backends intentionally stubbed — wire real assets only after Design approval.
  switch (kind) {
    case "css":
      return (
        <div
          className={`signature-moment-slot signature-moment-slot--css motion-safe:animate-rise ${className}`}
          data-signature-kind="css"
          aria-hidden
        />
      );
    case "lottie":
      return (
        <div
          className={`signature-moment-slot signature-moment-slot--lottie ${className}`}
          data-signature-kind="lottie"
          data-todo="dynamic-import-lottie-when-asset-ready"
          aria-hidden
        />
      );
    case "r3f":
      return (
        <div
          className={`signature-moment-slot signature-moment-slot--r3f ${className}`}
          data-signature-kind="r3f"
          data-todo="dynamic-import-r3f-drei-when-design-approves"
          aria-hidden
        />
      );
    default:
      return null;
  }
}
