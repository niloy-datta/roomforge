# ROOMFORGE

> Architectural 2D visual flooring studio, calculation engine, and material budgeting platform built with Next.js 15 App Router, TypeScript strict mode, and Tailwind CSS.

## Features

- **Architectural Flooring Studio:** Interactive 2D SVG canvas with zoom, plank & tile patterns, and realistic drop shadow.
- **Deterministic Math Engine:** Full parity with verified flooring geometry, box packaging, and waste allowance algorithms.
- **Specialized Calculation Tools:** Box & carton estimator, laying pattern waste comparator, and unit converters.
- **Architectural Field Guides:** Formula transparency and practical guides for renovations.
- **Full Test Coverage:** Unit tests (Vitest), end-to-end tests (Playwright), legacy verification suites, and strict TypeScript checks.

## Project Structure

- `roomforge/`: Next.js 15 application codebase.
  - `src/app/`: Next.js App Router routes (`/`, `/studio`, `/tools`, `/guides`, `/about`).
  - `src/features/`: Feature-sliced modules (studio, tools, calculations, guides, home, about).
  - `src/components/`: Shared UI primitives and SVG renderer.
  - `tests/`: Vitest and Playwright test suites.
  - `legacy/`: Preserved legacy static assets and compatibility scripts.
- `.github/workflows/`: CI verification workflow.