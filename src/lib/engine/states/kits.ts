import type { StateKit } from "./gated";
import { CA_KIT } from "./ca";

/** State kits available to the firm-v1 page (PA uses its own PaCalculator). */
export const STATE_KITS: Partial<Record<"NJ" | "IL" | "CA", StateKit>> = { CA: CA_KIT };
