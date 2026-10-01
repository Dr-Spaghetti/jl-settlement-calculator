# JL Settlement Calculator

White-label **car accident settlement calculator** template for Justify Local clients.
Inspired by public educational estimators for structure only — original branding, copy, and **Offer Reality Check** (not FairSettlement marks or proprietary scoring).

Stack: **Next.js App Router**, **TypeScript**, **Tailwind CSS**. Calculator math is browser-only; **no PII is stored**.

## Active client & multi-tenant deploys

**`CLIENT_ID` always wins** over `clients/active.json`.

| Deploy target | How client is selected |
|---------------|------------------------|
| `jl-settlement-calculator-djlaw` (Djougourian black-gold) | Vercel env `CLIENT_ID=djougourian-law` (Preview + Production) |
| `jl-settlement-calculator` (Premier / shared) | No `CLIENT_ID` → falls through to `clients/active.json` → currently `premier-law-group.json` |

Do **not** flip `clients/active.json` to Djougourian if Premier production still shares this repo without its own `CLIENT_ID`. Local/dev without env uses `active.json`.

Fallback when neither env nor active.json resolve: `demo-apex-injury.json` (fictional Apex demo).

## Local run

```bash
cd jl-settlement-calculator
npm install
npm run dev
```

Open http://localhost:3000

```bash
npm run build
npm start
```

Bun also works: `bun install && bun run dev` / `bun run build`.

## Swap client (template for every firm)

### Option A — `clients/active.json`

1. Copy `clients/_template.json` → `clients/your-firm.json`
2. Fill in firm fields
3. Set active pointer:

```json
{
  "clientFile": "your-firm.json"
}
```

4. Restart the dev server / redeploy

### Option B — `CLIENT_ID` env (preferred for per-firm Vercel projects)

```bash
CLIENT_ID=djougourian-law npm run dev
CLIENT_ID=premier-law-group npm run build
CLIENT_ID=demo-apex-injury npm run build
```

Resolves to `clients/{CLIENT_ID}.json`. On Vercel, set `CLIENT_ID` per project so one git repo can serve multiple firms without changing `active.json`.

### Config fields

| Field | Purpose |
|-------|---------|
| `firmName` | Full firm name (header, footer, metadata) |
| `shortName` | Short name in CTAs |
| `logoUrl` | Path under `/public` or absolute URL |
| `primaryColor` / `secondaryColor` | Hex → CSS variables |
| `phone` / `email` / `website` | Contact |
| `ctaText` / `ctaUrl` | Primary conversion button |
| `city` / `state` | Location + default calculator state |
| `tagline` | Hero subcopy |
| `attorneyDisclaimer` | Firm-specific disclaimer |

Place logos in `public/` and reference them as `/logo-yourfirm.svg`.

## Key files

| Path | Role |
|------|------|
| `clients/_template.json` | Blank firm template |
| `clients/demo-apex-injury.json` | Demo firm |
| `clients/active.json` | Which client file is live |
| `src/lib/client.ts` | Client resolution |
| `src/lib/calculator.ts` | Multiplier method + Offer Reality Check |
| `src/lib/states.ts` | Educational comparative-fault notes |
| `src/components/Calculator.tsx` | Browser-only calculator UI |
| `src/app/page.tsx` | Landing composition |

## Vercel notes

1. Import this folder as a Next.js project (set root directory if nested).
2. Prefer project env `CLIENT_ID=<basename>` (e.g. `djougourian-law`) so Preview/Production always ship the right firm. `active.json` is only the no-env fallback.
3. Build command: `next build` (framework preset Next.js).
4. No secrets required for the calculator itself.
5. **Band D / prod alias:** do not promote a Djougourian preview alias to production until Nick explicitly approves Band D.

Do not invent or hardcode production deploy URLs in docs.

## Disclaimer

Educational estimates only — **not legal advice**. Does not create an attorney-client relationship or predict outcomes. Have deploying firm counsel review copy before public launch.

## License

Private template for Justify Local / client deployments unless otherwise agreed.

## Changelog (2026-09-08)

- UX: 3-step calc, live range, breakdown, SVG Offer Reality Check, sticky mobile CTA (no print/PDF)
- Trust: heroEyebrow/trustStats/testimonials, 3-pill strip, professional disclaimer, FAQ phone
- Visual: warm #F7F5F0, Source Serif 4 + Inter, Mid hierarchy + count-up, scarce gold
- Motion: reduced-motion hooks; signature-moment flag OFF

## Firm multipliers
Omit multipliers in client JSON for built-in defaults. See clients/_template.json _example_multipliers for severity, clampMin/Max, care, liability, treatmentGap, permanency, treatmentMonths.
Wire via calculateSettlement(inputs, client.multipliers) from the page.

## Usefulness features
- Comparative fault percent reduces or bars recoverable dollars
- Policy BI caps (default Unknown / no cap) and dual formula demand vs adjuster (both multiply medical only; economic added once)
- Treatment gap, permanency, firm multipliers JSON
Testimonials: only real quotes for live clients.

## Changelog (2026-10-01) — Ben punch list (Band C)

1. Document CLIENT_ID-first multi-tenant; Djougourian Vercel keeps `CLIENT_ID=djougourian-law`; do not flip shared `active.json` away from Premier.
2. Demand formula no longer multiplies wages/OOP; default formula mode → adjuster.
3. Print/PDF feature **removed** (no Save PDF CTA, no `window.print`, no print-summary isolation CSS) so visitors cannot walk away with a clean estimate PDF.
4. CA statutory BI minimum option → $30k/$60k (Jan 1, 2025+).
5. Policy limit default → Unknown (null; no banner).
6. Liability buttons aligned with coefficients + breakdown labels (Clear / Mixed / Disputed).
