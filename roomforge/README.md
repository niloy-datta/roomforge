# ROOMFORGE — Visual Flooring Studio

A premium, responsive, ad-ready **static web app** to calculate flooring boxes, visualize a rectangular 2D room and estimate material costs. No Lovable, paid service, framework installation, database or API key required.

## Run in seconds

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000` in your browser. See [DEPLOY.md](DEPLOY.md) for publishing it to GitHub Pages.

## Features

- Architectural landing page with room-dimension quick start
- Responsive three-panel studio, mobile tabs
- Live SVG 2D flooring preview, material/pattern switching and zoom
- Feet/meters conversion that preserves dimensions
- Mathematically tested area, waste allowance, box rounding, prices and optional tax
- Explicit price disclaimers and inline validation
- Local browser saving, shareable URL, copyable estimate, printable shopping list
- Original flooring formula guide and reserved, labeled future ad space
- Semantic page titles/descriptions and reduced-motion behavior

## Stack

- Pure HTML5, CSS3, ES modules in modern JavaScript
- Native Node.js test runner, **zero npm runtime dependencies**
- GitHub Pages and any static host compatible

Static browser modules were chosen to make a fully runnable and testable MVP in this environment, where installing npm dependencies is unavailable. The calculation modules are independent of the UI and can later be reused in a Next.js/TypeScript migration.

## Repository layout

```text
index.html                       Landing page & quick start
studio.html                      Interactive flooring studio
guides/flooring-calculator.html  Math guide and FAQ
src/core/calculations.js         Deterministic math functions
src/core/materials.js            Material presets
src/core/state.js                Browser save and share logic
src/ui/floor-plan.js             Scaled SVG renderer
src/pages/home.js                Homepage controller
src/pages/studio.js              Studio controller
assets/styles.css                Responsive design system
assets/favicon.svg               Original favicon
tests/                           Native Node.js tests
```

## Check the math

```bash
npm test
```

Example: 12 × 18 ft with 10% waste, 24 ft²/box and $45/box yields **216 ft²**, **237.6 ft²** required, **10 boxes**, **$450** material cost before tax.

## Important disclaimers

Estimates do not include labor, delivery, trims, transitions, underlayment, subfloor preparation or cutting optimization. All example prices are editable and are not live market quotes. Google AdSense approval and publisher script setup are NOT part of this MVP.

## Deployment status and CI

- `vercel.json` supports Vercel static deployments with basic security response headers. No build step or secrets required.
- `.github/workflows/ci.yml` tests committed changes and checks JavaScript syntax on pushes to `main` and pull requests.
- `robots.txt` allows crawlers; add `sitemap.xml` and canonical URLs **only after a real production domain is selected**.
- Actual publisher approval, ad serving, analytics credentials, GitHub remote creation, and production deployment must be verified separately; none are implied by these files.
