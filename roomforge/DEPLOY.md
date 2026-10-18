# ROOMFORGE — Production Deployment & Architecture Guide

## Production Architecture (Next.js App Router)

ROOMFORGE is a modern Next.js 15 App Router platform with React 19, TypeScript strict mode, and Tailwind CSS.
All calculations run client-side with zero external database dependencies.

- **GitHub Repository:** [https://github.com/niloy-datta/roomforge](https://github.com/niloy-datta/roomforge)
- **Production Branch:** `main`
- **Application Directory:** `roomforge/`
- **Vercel Project ID:** `prj_XCDavCDzLImOz03ubXiIEjONIRTB`
- **Production URL:** [https://roomforge.vercel.app](https://roomforge.vercel.app)

---

## Authoritative Deployment Strategy

The repository supports both deployment strategies seamlessly:

### Strategy A: Repository Root (Recommended for Git Integration)
- Root `package.json` delegates `build`, `dev`, `start`, `lint`, and `test` to `roomforge/`.
- Root `vercel.json` configures:
  ```json
  {
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "framework": "nextjs",
    "installCommand": "cd roomforge && npm install",
    "buildCommand": "cd roomforge && npm run build",
    "outputDirectory": "roomforge/.next"
  }
  ```

### Strategy B: Subdirectory Root (`roomforge/`)
- If Vercel Project Settings > Root Directory is set to `roomforge`, `roomforge/vercel.json` configures:
  ```json
  {
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "framework": "nextjs"
  }
  ```

---

## Connecting Vercel to GitHub Continuous Deployment

1. Navigate to [Vercel Dashboard](https://vercel.com/dashboard) and open the `roomforge` project.
2. Go to **Settings** > **Git**.
3. Under **Connected Git Repository**, select **GitHub** and connect `niloy-datta/roomforge`.
4. Ensure the **Production Branch** is set to `main`.
5. Trigger or await the automatic deployment: Vercel will pull the latest commit (`main`), run `npm run build`, and assign `https://roomforge.vercel.app`.

---

## Command Line Deployment (Vercel CLI)

To deploy directly from the command line using Vercel CLI:

```bash
# Log in to Vercel (interactive)
npx vercel login

# Deploy directly to production
cd roomforge
npx vercel --prod
```

Or deploy non-interactively using an API token:

```bash
cd roomforge
npx vercel --prod --token $VERCEL_TOKEN
```

---

## Local Development & Testing

```bash
# Install dependencies
cd roomforge
npm install

# Run development server
npm run dev

# Run full test suite (Typecheck, Lint, Vitest, Legacy, Playwright E2E, Build)
npm run typecheck
npm run lint
npm run test:unit
npm run test:legacy
npm run test:e2e
npm run build
```
