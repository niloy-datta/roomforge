# ROOMFORGE Technical Audit & Modernization Roadmap

**Date:** October 2026  
**Auditor:** ROOMFORGE Principal Architecture & Engineering Team  
**Scope:** Full codebase audit covering `roomforge/` (Next.js 15 App Router, React 19, TypeScript strict mode, SVG visualization, calculation engines, 7 dedicated calculators, legal & monetization components).

---

## 1. Features Already Working Correctly
- **Dual Room Geometry Engine:** Pure mathematical functions in `calculations.ts` support both Rectangular and L-Shaped orthogonal room geometries with bounding cutouts and unit conversions (`ft` and `m`).
- **Interactive 2D SVG Canvas:** `RoomSvgRenderer.tsx` renders dynamic polygon paths, drop shadow filters, architectural grid overlays, 4 laying patterns, door swings, and wall dimension markers.
- **Studio Interactive Controls:** Zoom in/out, fit-to-view, pan, grid toggle, and 25-step undo/redo stack (`Ctrl+Z` / `Ctrl+Y`).
- **Dedicated Calculator Engines:** Independent calculation modules for Flooring, Tile & Grout, Paint & Surface Area, Concrete Slab & Volume, Drywall & Sheetrock, Renovation Cost & Budget, and Material Lifecycle TCO.
- **Automated Test Coverage:** 23 Vitest unit tests, 11 Node legacy regression tests, and 14 Playwright E2E tests passing.
- **Static Optimization:** 21 static and SSG routes prerendering cleanly via `next build`.

---

## 2. Findings & Classification (P0 / P1 / P2)

### P0: Critical Reliability, Accuracy, Security & Deployment Issues
1. **Unverified Canonical Domain Fallbacks (SEO / Canonical Risk):**
   - *Issue:* Canonical links and sitemap currently reference `roomforge.app` as default without verifying domain ownership or environment provisioning.
   - *Fix:* Ensure canonical URLs dynamically respect `process.env.NEXT_PUBLIC_SITE_URL` and fall back gracefully to the actual hosting origin (e.g. `https://roomforge.pages.dev` or production Vercel URL) rather than asserting ownership of an unconfigured custom domain.
2. **Unsupported Regulatory & Standards Claims (Credibility / Compliance Risk):**
   - *Issue:* Phrases such as "TCNA-compliant", "exact engineering-grade", and "architecturally accurate" risk user misinterpretation regarding professional construction liability.
   - *Fix:* Replace with transparent disclaimer language: "Volumetric grout estimation based on standard industry coverage formulas; actual yields vary by tile absorption and manufacturer. Estimations are planning guides, not certified engineering blueprints."
3. **Root Repository Vercel Deployment Configuration:**
   - *Issue:* Git root `d:/roomforge` does not contain a root `vercel.json` pointing to `roomforge/`, which could cause standard Vercel imports without custom root directory setting to fail.
   - *Fix:* Provide a root `vercel.json` and clear `DEPLOY.md` instructions verifying `roomforge` as the project root.

### P1: Significant Usability, Functionality, Maintainability & Growth
1. **Missing CSV Material List Export (User Request Section 12):**
   - *Issue:* Users currently have print preview (`window.print()`), but contractors and budgeters need an exportable CSV materials list for Excel/Sheets.
   - *Fix:* Implement client-side CSV export in Studio and Calculators with formula injection protection (escaping `=`, `+`, `-`, `@`).
2. **Project Persistence & Local Project Management (Section 12):**
   - *Issue:* Currently, studio saves one single active project to `localStorage`. Users cannot name, duplicate, or manage multiple saved projects.
   - *Fix:* Upgrade state management to support multi-project saving (`My Projects`), renaming, duplicating, and exporting/importing JSON project files with schema validation.
3. **AdSense & Consent Architecture Hardening (Section 15):**
   - *Issue:* `AdSlot.tsx` handles placeholder display when `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is missing, but needs explicit support for responsive layouts across all 7 calculator article views without interfering with action buttons.
   - *Fix:* Verify ad placement distances from critical form buttons, keeping ads strictly in peripheral or post-result sections.
4. **Interactive 3D Perspective Studio Preview (Section 9):**
   - *Issue:* Users need a spatial perspective of their room beyond 2D top-down blueprints.
   - *Fix:* Build a lightweight, zero-dependency 3D isometric/perspective room viewer that syncs seamlessly with the 2D editor state and supports orbit, tilt, and wall transparency without adding heavy Three.js bloat.

### P2: Optional Enhancements & Polish
1. **Additional Laying Patterns & Metric Refinements:**
   - 45-degree basketweave and vertical stack patterns for subway tile.
2. **Enhanced Color System:**
   - Fine-tune CSS variables to match exact warm ivory (`#F8F7F4`), deep forest green (`#14251F`), and natural walnut/warm brass (`#C69B6B`) palette with tabular numeral scanning.

---

## 3. Implementation Plan
- **Phase A (Foundation & Correctness):** Qualify language/disclaimers, resolve domain fallbacks, add root `vercel.json`.
- **Phase B (UX/UI Polish & Palette):** Update design tokens to warm ivory/forest green/brass with tabular numerals.
- **Phase C (Studio & Persistence Upgrade):** Add multi-project manager (create, rename, save, restore, duplicate, JSON export/import), CSV materials export with formula injection sanitization.
- **Phase D (Calculators Standardization):** Enhance all 7 calculators with CSV export and transparent assumption notes.
- **Phase E (3D Perspective Studio View):** Add lightweight, zero-overhead client-side 3D room visualizer with orbit and wall transparency.
- **Phase F (SEO & Content):** Update canonical URLs to be dynamic and ensure original worked examples in guides.
- **Phase G (Monetization & AdSense):** Validate layout safety and ad separation.
- **Phase H (Final Verification & CI):** Full test pass across Vitest, Playwright, TypeScript, and Git push to `main`.
