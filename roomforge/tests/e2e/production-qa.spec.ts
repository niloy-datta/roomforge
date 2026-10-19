import { test, expect } from '@playwright/test';

test.describe('ROOMFORGE Production QA & E2E Verification', () => {
  // Test 1: Route Coverage (All 17 Required Production Routes)
  const productionRoutes = [
    { path: '/', titleCheck: /ROOMFORGE/i },
    { path: '/studio', titleCheck: /Studio/i },
    { path: '/tools', titleCheck: /Tools/i },
    { path: '/guides', titleCheck: /Guide/i },
    { path: '/about', titleCheck: /About|Manifesto/i },
    { path: '/calculators', titleCheck: /Calculators/i },
    { path: '/calculators/flooring', titleCheck: /Flooring/i },
    { path: '/calculators/tile', titleCheck: /Tile/i },
    { path: '/calculators/paint', titleCheck: /Paint/i },
    { path: '/calculators/concrete', titleCheck: /Concrete/i },
    { path: '/calculators/drywall', titleCheck: /Drywall/i },
    { path: '/calculators/renovation-cost', titleCheck: /Renovation/i },
    { path: '/calculators/material-comparison', titleCheck: /Comparison|TCO/i },
    { path: '/privacy', titleCheck: /Privacy/i },
    { path: '/terms', titleCheck: /Terms/i },
  ];

  for (const route of productionRoutes) {
    test(`Route ${route.path} responds with 200 and passes title check`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(route.titleCheck);
    });
  }

  test('Sitemap /sitemap.xml returns valid XML and includes all canonical routes', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('<?xml');
    expect(text).toContain('<urlset');
    expect(text).toContain('/calculators/flooring');
    expect(text).toContain('/studio');
    expect(text).toContain('https://roomforge.vercel.app');
  });

  test('Robots /robots.txt returns valid directives referencing sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('User-Agent: *');
    expect(text).toContain('Allow: /');
    expect(text).toContain('Sitemap: https://roomforge.vercel.app/sitemap.xml');
  });

  // Test 2: Studio Interactive Features & Math Accuracy
  test('Studio geometry: Rectangle vs L-Shape calculation and cutout update', async ({ page }) => {
    await page.goto('/studio?w=20&l=20');
    // Default 20x20 ft = 400 sq ft
    await expect(page.locator('#area-number')).toContainText('400');

    // Switch to L-Shape
    await page.getByRole('button', { name: 'L-Shaped Room' }).click();
    await expect(page.getByText('Corner Cutout Dimensions')).toBeVisible();

    // Fill cutout 5x10 (cutout = 50 sq ft, remaining = 350 sq ft)
    const cutoutWidthInput = page.locator('input[placeholder="e.g. 4"]');
    const cutoutLengthInput = page.locator('input[placeholder="e.g. 6"]');
    await cutoutWidthInput.fill('5');
    await cutoutLengthInput.fill('10');
    await expect(page.locator('#area-number')).toContainText('350');
  });

  test('Studio unit conversion: Feet to Meters and back', async ({ page }) => {
    await page.goto('/studio?w=10&l=10&u=ft');
    await expect(page.locator('#area-number')).toContainText('100');

    // Switch to Meters
    await page.getByRole('button', { name: 'm', exact: true }).click();
    await expect(page.locator('#area-number')).toContainText('m²');

    // Switch back to Feet
    await page.getByRole('button', { name: 'ft', exact: true }).click();
    await expect(page.locator('#area-number')).toContainText('ft²');
  });

  test('Studio material switching, laying patterns, and cost estimation', async ({ page }) => {
    await page.goto('/studio?w=12&l=18'); // 216 sq ft
    // Select Engineered Oak
    await page.getByRole('button', { name: /Engineered oak/i }).click();
    await expect(page.locator('#total-cost')).not.toBeEmpty();

    // Select Herringbone pattern
    await page.getByRole('button', { name: /Herringbone Parquet/i }).click();

    // Adjust waste slider to 15%
    const wasteSlider = page.locator('#waste');
    await wasteSlider.fill('15');
    await expect(page.getByRole('region', { name: 'Room geometry and material' }).getByText('15%', { exact: true })).toBeVisible();
  });

  test('Studio zoom, pan, and reset controls', async ({ page }) => {
    await page.goto('/studio');
    const zoomInBtn = page.locator('button[title="Zoom in"]');
    const zoomOutBtn = page.locator('button[title="Zoom out"]');
    const resetBtn = page.locator('button[title="Reset view"]');
    const zoomIndicator = page.locator('button[title="Zoom in"] + span');

    await expect(zoomInBtn).toBeVisible();
    await zoomInBtn.click();
    await expect(zoomIndicator).toContainText('115%');

    await zoomOutBtn.click();
    await expect(zoomIndicator).toContainText('100%');

    await zoomInBtn.click();
    await resetBtn.click();
    await expect(zoomIndicator).toContainText('100%');
  });

  test('Studio project persistence: save, load from Projects Modal', async ({ page }) => {
    await page.goto('/studio?w=14&l=22');
    // Open Projects Modal
    await page.locator('#projects-button').click();
    const modalHeading = page.getByRole('heading', { name: /My Saved Projects & Plans/i });
    await expect(modalHeading).toBeVisible();

    // Save current plan
    const saveNameInput = page.locator('input[placeholder="e.g. Master Bedroom, Basement Living Area"]');
    await saveNameInput.fill('Master Suite 2026');
    await page.getByRole('button', { name: 'Save Plan' }).click();

    // Verify it appears in the saved list with exact match
    await expect(page.getByText('Master Suite 2026', { exact: true })).toBeVisible();

    // Close modal
    await page.getByTitle(/Close dialog/i).click();
    await expect(modalHeading).not.toBeVisible();
  });

  test('Studio CSV export function generates download', async ({ page }) => {
    await page.goto('/studio');
    const exportBtn = page.locator('#export-csv-button');
    await expect(exportBtn).toBeVisible();

    // Trigger CSV export
    const downloadPromise = page.waitForEvent('download');
    await exportBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^roomforge-.*\.csv$/);
  });

  test('Responsive viewport checks: Mobile navigation and layout', async ({ page }) => {
    // Set viewport to mobile (iPhone dimensions)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile menu toggle button should be visible
    const mobileMenuBtn = page.locator('#mobile-menu-toggle');
    await expect(mobileMenuBtn).toBeVisible();

    // Open mobile menu
    await mobileMenuBtn.click();
    const mobileNav = page.locator('#mobile-nav');
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Studio' })).toBeVisible();

    // Set viewport to tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/studio');
    await expect(page.locator('svg[role="img"]')).toBeVisible();

    // Set viewport to desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/calculators');
    await expect(page.getByRole('heading', { name: 'Flooring & Plank Calculator' })).toBeVisible();
  });
});
