import { readFileSync, existsSync } from "fs";
import path from "path";
import type { ClientConfig } from "./types";

const CLIENTS_DIR = path.join(process.cwd(), "clients");

const DEFAULT_GOLD = "#C5A880";
const DEFAULT_GROUND = "#F9F8F6";

function readJson<T>(filePath: string): T {
  const raw = readFileSync(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export function getActiveClient(): ClientConfig {
  // Lesson #1: no silent firm default. CLIENT_ID is required; there is no fallback.
  const envId = process.env.CLIENT_ID?.trim();
  if (!envId) {
    throw new Error("CLIENT_ID is not set. Refusing to fall back to a default firm.");
  }
  const candidate = path.join(CLIENTS_DIR, `${envId}.json`);
  if (!existsSync(candidate)) {
    throw new Error(`CLIENT_ID="${envId}" did not match clients/${envId}.json`);
  }
  return readJson<ClientConfig>(candidate);
}

/**
 * Map client brand colors onto CSS variables used by Tailwind `plg-*` tokens.
 * - primary → navy / charcoal (header, panels)
 * - secondary → crimson (Premier) / gold CTA (Djougourian)
 * - accent → gold / amber scarce accent
 */
export function getClientCssVars(
  client: ClientConfig
): Record<string, string> {
  const primary = client.primaryColor;
  const secondary = client.secondaryColor;
  const accent = client.accentColor?.trim() || DEFAULT_GOLD;
  const ground = client.pageGround?.trim() || DEFAULT_GROUND;

  const isDj = client.id === "djougourian-law";
  // Djougourian: palette-only tints (charcoal / navy / gold / cream / taupe)
  const warmIvory = isDj ? "#F5F0E6" : "#F4F1EA";
  const surface = isDj ? "#0D1B2A" : "#FFFFFF";
  const borderMuted = isDj ? "rgba(201, 193, 179, 0.2)" : "#E5DFD5";

  return {
    "--brand-primary": primary,
    "--brand-secondary": secondary,
    "--brand-accent": accent,
    "--page-ground": ground,
    "--plg-crimson": secondary,
    "--plg-crimson-dark": `color-mix(in srgb, ${secondary} 78%, black)`,
    "--plg-crimson-light": `color-mix(in srgb, ${secondary} 85%, white)`,
    "--plg-gold": accent,
    "--plg-gold-light": `color-mix(in srgb, ${accent} 42%, white)`,
    "--plg-navy": primary,
    "--plg-charcoal": isDj ? "#060E18" : primary === "#212529" ? "#212529" : "#1E293B",
    "--plg-warm-ivory": warmIvory,
    "--plg-surface": surface,
    "--plg-border-muted": borderMuted,
  };
}

export function clientUsesDjFonts(client: ClientConfig): boolean {
  return client.id === "djougourian-law";
}

export function stateRegionLabel(state: string): string {
  const s = state.toUpperCase();
  if (s === "WA") return "Washington";
  if (s === "CA") return "California";
  if (s === "PA") return "Pennsylvania";
  if (s === "FL") return "Florida";
  if (s === "SC") return "South Carolina";
  return state;
}
