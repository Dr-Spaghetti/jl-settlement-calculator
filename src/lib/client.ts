import { readFileSync, existsSync } from "fs";
import path from "path";
import type { ClientConfig } from "./types";

const CLIENTS_DIR = path.join(process.cwd(), "clients");

function readJson<T>(filePath: string): T {
  const raw = readFileSync(filePath, "utf8");
  return JSON.parse(raw) as T;
}

/**
 * Resolve active client:
 * 1. CLIENT_ID env → clients/{CLIENT_ID}.json
 * 2. clients/active.json → { clientFile: "demo-apex-injury.json" }
 * 3. Fallback: demo-apex-injury.json
 */
export function getActiveClient(): ClientConfig {
  const envId = process.env.CLIENT_ID?.trim();

  if (envId) {
    const candidates = [
      path.join(CLIENTS_DIR, `${envId}.json`),
      path.join(CLIENTS_DIR, envId),
    ];
    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return readJson<ClientConfig>(candidate);
      }
    }
    throw new Error(
      `CLIENT_ID="${envId}" did not match a file in clients/. Expected clients/${envId}.json`
    );
  }

  const activePath = path.join(CLIENTS_DIR, "active.json");
  if (existsSync(activePath)) {
    const active = readJson<{ clientFile: string }>(activePath);
    const filePath = path.join(CLIENTS_DIR, active.clientFile);
    if (!existsSync(filePath)) {
      throw new Error(`active.json points to missing file: ${active.clientFile}`);
    }
    return readJson<ClientConfig>(filePath);
  }

  const fallback = path.join(CLIENTS_DIR, "demo-apex-injury.json");
  return readJson<ClientConfig>(fallback);
}

export function getClientCssVars(
  client: ClientConfig
): Record<string, string> {
  return {
    "--brand-primary": client.primaryColor,
    "--brand-secondary": client.secondaryColor,
  };
}
