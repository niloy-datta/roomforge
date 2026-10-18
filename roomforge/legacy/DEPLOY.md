# ROOMFORGE — Local run and deployment

## Run locally (zero install)

```bash
cd roomforge
python3 -m http.server 8000
```

Open http://localhost:8000/ in a browser. All calculations are performed in the browser; there is no remote backend. Python is used only to serve the static files; alternatively use `npx serve` if available.

## Test calculations

```bash
npm test
```

Node.js >= 20 is required for the automated math tests. No `npm install` is necessary.

## Publish to a *new* GitHub repository

1. Create an empty repository named `roomforge` in your GitHub account (no README, license, or .gitignore needed).
2. From this project directory, where the `main` branch and commit history already exist:

```bash
git remote add origin https://github.com/YOUR-USERNAME/roomforge.git
git push -u origin main
```

3. In GitHub repository Settings > Pages, choose **Deploy from a branch** > `main` > `/ (root)` and save.
4. Your public URL will typically be `https://YOUR-USERNAME.github.io/roomforge/`.

All internal navigation uses relative paths so it works beneath a GitHub Pages project subpath.

## Ads and growth

This package contains a labeled, reserved ad placeholder on the guide page only. It does not load AdSense scripts or contain a publisher ID. Add ads only after a real publisher account is approved, policies are met, and the user experience is tested.

## Current limitations

- Rectangular rooms only, SVG floor illustration rather than a geometrically optimized cut list.
- User-entered USD prices, not live retailer prices.
- One browser-local saved configuration; share links encode values, not uploaded plans.
- Print dialog can be saved as PDF. No server-side PDF generation.
- No authentication, product inventory, checkout or 3D/AI photo previews.

## Vercel production deployment (October 2026)

A static self-contained build was deployed independently of Git to the existing Vercel team.

- Project: `roomforge` (`prj_XCDavCDzLImOz03ubXiIEjONIRTB`)
- Production alias: https://roomforge.vercel.app
- Studio: https://roomforge.vercel.app/studio.html
- Deployment: `dpl_ExD1ncf3XmXJxtNkqEHHqWurHsYQ` — API reports READY.
- No password or Vercel SSO protection is enabled on this project.

This deployment currently uses direct uploaded files, **not a Git-connected deploy pipeline**. It will not automatically update when the local `main` branch changes. GitHub repository creation was unavailable through the linked GitHub connector and was not silently replaced with changes to unrelated repos.

Run `python3 scripts/build_standalone.py` to regenerate the deployed format from source. Do not manually modify `dist` because this directory is ignored by Git and reproducible.

To set up continuous deployment in the future, create a GitHub repository, push `main`, and connect that new repository in the Vercel project settings. GitHub Actions checks are already included in `.github/workflows/ci.yml`.
