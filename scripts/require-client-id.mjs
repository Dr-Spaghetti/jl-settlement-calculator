// Lesson #1: never fall back to a default firm. The build FAILS without CLIENT_ID.
import { existsSync } from "node:fs";
const id = process.env.CLIENT_ID?.trim();
if (!id) { console.error("BUILD FAILED: CLIENT_ID is not set. Set CLIENT_ID=<firm> (Preview AND Production)."); process.exit(1); }
if (!existsSync(`clients/${id}.json`)) { console.error(`BUILD FAILED: clients/${id}.json not found.`); process.exit(1); }
console.log(`CLIENT_ID=${id}`);
