# ROOMFORGE — Visual Flooring Studio & Material Estimator

A production-grade, architectural Next.js App Router application to calculate flooring boxes, visualize rectangular 2D rooms with live SVG scaling, estimate material budgets, and benchmark installation waste factors.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Verification & Testing
```bash
npm run test         # Run Vitest unit & component test suite
npm run test:legacy  # Run preserved legacy native node test suite
npm run test:all     # Run both test suites
npm run typecheck    # Validate TypeScript strict mode (zero errors)
npm run lint         # Run ESLint validation (zero warnings/errors)
npm run build        # Build optimized production bundle
```

---

## 🏗️ Architecture & Features

- **Framework**: Next.js 15 App Router with React 19 and TypeScript strict mode.
- **Styling**: Tailwind CSS with custom architectural palette (`sand`, `sage`, `clay`, `forest`), glassmorphism, responsive mobile-first layouts, and dedicated print stylesheets.
- **Visual Studio**: Interactive scaled 2D SVG canvas with zoom, live dimensions, door cutaways, and dynamic pattern rendering (Luxury Vinyl Plank, Engineered Oak, Porcelain Tile, Oak-look Laminate).
- **Core Routes**:
  - `/`: Architectural landing page, quick-start calculator, interactive living room preview, process steps, math breakdown, and FAQ.
  - `/studio`: Full 3-panel interactive studio with dimensions panel, 2D floor visualizer, and live estimate breakdown. Includes URL sharing, clipboard copy, print-ready reports, and local storage persistence.
  - `/tools`: Suite of dedicated utilities including Carton Calculator, Pattern Waste Factor Advisor, Area & Length Converter (`ft²` ↔ `m²`, `ft` ↔ `m`), and Side-by-Side Material Price Benchmark.
  - `/guides`: Field guides directory and in-depth guide readers (e.g. `/guides/flooring-calculator`, `/guides/laying-patterns`).
  - `/about`: Engineering methodology, deterministic formula specification, site condition disclaimers, and architectural mission.
  - `/sitemap.xml`: Dynamic search engine index.

---

## 📐 Deterministic Math Specification

1. **Room Area**: `Area = width × length` (internally computed in feet, converted accurately for metric users).
2. **Waste Allowance**: `Needed Area = Area × (1 + waste % / 100)`.
3. **Carton Ceiling**: `Boxes = Math.ceil(Needed Area / Box Coverage)`.
4. **Material Cost**: `Cost = Boxes × Price per Box`.
5. **Sales Tax**: Computed on material subtotal without intermediate rounding.

---

## 🛡️ Protected Legacy Functionality

The original vanilla HTML/CSS/JavaScript MVP is 100% preserved in `legacy/`:
- Legacy tests run via `npm run test:legacy` (`node --test legacy/tests/*.test.mjs`).
- Standalone HTML files are available in `legacy/index.html`, `legacy/studio.html`, and `legacy/guides/`.
