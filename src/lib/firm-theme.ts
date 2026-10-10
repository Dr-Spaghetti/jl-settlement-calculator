import type { ClientConfig } from "./types";

function channels(hex: string): string {
  const h = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`Bad theme hex ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(" ");
}

/** Theme tokens for the shared white-label template (Tailwind `t-*` colors). */
export function firmThemeVars(client: ClientConfig): Record<string, string> {
  const t = client.theme;
  if (!t) throw new Error(`clients/${client.id}.json: template firm-v1 requires "theme"`);
  return {
    "--t-header": channels(t.headerBg),
    "--t-ground": channels(t.ground),
    "--t-surface": channels(t.surface),
    "--t-accent": channels(t.accent),
    "--t-on-accent": channels(t.onAccent),
    "--t-text": channels(t.text),
    "--t-muted": channels(t.muted),
  };
}
