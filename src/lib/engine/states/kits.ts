import type { StateKit } from "./gated";

/** State kits available to the firm-v1 page (PA uses its own PaCalculator). */
export const STATE_KITS: Partial<Record<"NJ" | "IL" | "CA", StateKit>> = {};
