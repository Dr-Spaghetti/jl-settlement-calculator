import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  /** Default 24 — pass e.g. 16 or 18 for dense chrome. */
  size?: number | string;
};

const defaults = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

/** Lucide-like outline icons — thin stroke, currentColor, rounded joins. */

export function ShieldIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...defaults} {...rest}>
      <path d="M12 3 5.5 6v5.5c0 4.2 2.8 7.4 6.5 8.5 3.7-1.1 6.5-4.3 6.5-8.5V6L12 3Z" />
    </svg>
  );
}

export function ScaleIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...defaults} {...rest}>
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M5 7 2.5 13a2.5 2.5 0 0 0 5 0L5 7Z" />
      <path d="M19 7 16.5 13a2.5 2.5 0 0 0 5 0L19 7Z" />
      <path d="M9 21h6" />
    </svg>
  );
}

/** Contingency / value — coin + dollar mark. */
export function CurrencyIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...defaults} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10" />
      <path d="M15 9.5c0-1.4-1.3-2-3-2s-3 .6-3 2 1.2 1.8 3 2.2 3 .8 3 2.2-1.3 2-3 2-3-.6-3-2" />
    </svg>
  );
}

export function BuildingIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...defaults} {...rest}>
      <path d="M4 21h16" />
      <path d="M6 21V7l6-3 6 3v14" />
      <path d="M10 21v-5h4v5" />
      <path d="M9 10h1M14 10h1M9 14h1M14 14h1" />
    </svg>
  );
}

export function BoltIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...defaults} {...rest}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}

export function CheckIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...defaults} {...rest}>
      <path d="M5 12.5 10 17.5 19 6.5" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...defaults} {...rest}>
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...defaults} {...rest}>
      <path d="M9 5 16 12l-7 7" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...defaults} {...rest}>
      <path d="M5 12h14" />
      <path d="M13 6 19 12 13 18" />
    </svg>
  );
}

export function PhoneIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...defaults} {...rest}>
      <path d="M22 16.9v2.2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h2.2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.1 9.9a16 16 0 0 0 6 6l1.5-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2.1Z" />
    </svg>
  );
}

export function RotateCcwIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...defaults} {...rest}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}
