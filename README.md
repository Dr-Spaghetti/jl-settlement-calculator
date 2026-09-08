# JL Settlement Calculator

White-label **car accident settlement calculator** template for Justify Local clients.
Inspired by public educational estimators for structure only — original branding, copy, and **Offer Reality Check** (not FairSettlement marks or proprietary scoring).

Stack: **Next.js App Router**, **TypeScript**, **Tailwind CSS**. Calculator math is browser-only; **no PII is stored**.

## Demo firm

Default active client: **Apex Injury Law Group** (fictional) via `clients/active.json` → `demo-apex-injury.json`.

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

### Option B — `CLIENT_ID` env

```bash
CLIENT_ID=demo-apex-injury npm run dev
CLIENT_ID=your-firm npm run build
```

Resolves to `clients/{CLIENT_ID}.json`.

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
2. Set env `CLIENT_ID` to the JSON basename **or** commit the desired `clients/active.json`.
3. Build command: `next build` (framework preset Next.js).
4. No secrets required for the calculator itself.

Do not invent or hardcode production deploy URLs in docs.

## Disclaimer

Educational estimates only — **not legal advice**. Does not create an attorney-client relationship or predict outcomes. Have deploying firm counsel review copy before public launch.

## License

Private template for Justify Local / client deployments unless otherwise agreed.

## Changelog (2026-09-08)

- UX: 3-step calc, live range, breakdown, SVG Offer Reality Check, print, sticky mobile CTA
- Trust: heroEyebrow/trustStats/testimonials, 3-pill strip, professional disclaimer, FAQ phone
- Visual: warm #F7F5F0, Source Serif 4 + Inter, Mid hierarchy + count-up, scarce gold
- Motion: reduced-motion hooks; signature-moment flag OFF

## Firm multipliers
Omit multipliers in client JSON for built-in defaults. See clients/_template.json _example_multipliers for severity, clampMin/Max, care, liability, treatmentGap, permanency, treatmentMonths.
Wire via calculateSettlement(inputs, client.multipliers) from the page.

## Usefulness features
- Comparative fault percent reduces or bars recoverable dollars
- Policy BI caps and dual formula demand vs adjuster
- Treatment gap, permanency, firm multipliers JSON
Testimonials: only real quotes for live clients.
