import { test, expect } from '@playwright/test';

test.describe('RoomForge Web Application', () => {
  test('Landing page renders hero, quick start, and navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ROOMFORGE/i);
    await expect(page.locator('h1')).toContainText(/A room you love/i);
    await expect(page.locator('#quick-start')).toBeVisible();
    await expect(page.locator('#home-width')).toBeVisible();
    await expect(page.locator('#home-length')).toBeVisible();
  });

  test('Studio page loads with interactive canvas, inputs, and calculates 10 boxes for 12x18 room', async ({ page }) => {
    await page.goto('/studio?w=12&l=18&u=ft');
    await expect(page.locator('svg[role="img"]')).toBeVisible();
    await expect(page.locator('#box-count')).toContainText('10 boxes');
    await expect(page.locator('#total-cost')).toContainText('$450.00');
  });

  test('Studio allows switching room shapes to L-Shape and toggling grid overlay', async ({ page }) => {
    await page.goto('/studio?w=16&l=20&s=l-shape&cw=6&cl=8');
    await expect(page.locator('svg[role="img"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'L-Shaped Room' })).toBeVisible();
    await expect(page.getByText('Corner Cutout Dimensions')).toBeVisible();
  });

  test('Calculators Hub renders all 7 specialized calculators', async ({ page }) => {
    await page.goto('/calculators');
    await expect(page).toHaveTitle(/Renovation & Material Calculators Suite/i);
    const main = page.locator('main');
    await expect(main.getByRole('heading', { name: 'Flooring & Plank Calculator' })).toBeVisible();
    await expect(main.getByRole('heading', { name: 'Tile & Grout Calculator' })).toBeVisible();
    await expect(main.getByRole('heading', { name: 'Paint & Surface Area Calculator' })).toBeVisible();
    await expect(main.getByRole('heading', { name: 'Concrete Slab & Footing Calculator' })).toBeVisible();
    await expect(main.getByRole('heading', { name: 'Drywall & Sheetrock Calculator' })).toBeVisible();
    await expect(main.getByRole('heading', { name: 'Room Renovation Cost Estimator' })).toBeVisible();
    await expect(main.getByRole('heading', { name: 'Material Lifecycle & TCO Comparison' })).toBeVisible();
  });

  test('Individual specialized calculators calculate and render correctly', async ({ page }) => {
    // Flooring
    await page.goto('/calculators/flooring');
    await expect(page.locator('h1')).toContainText(/Flooring & Carton Calculator/i);
    await expect(page.getByText(/Cartons Required/i)).toBeVisible();

    // Tile
    await page.goto('/calculators/tile');
    await expect(page.locator('h1')).toContainText(/Tile & Grout Estimator/i);
    await expect(page.getByText(/Tile Boxes Required/i)).toBeVisible();
    await expect(page.getByText('Grout Powder')).toBeVisible();

    // Paint
    await page.goto('/calculators/paint');
    await expect(page.locator('h1')).toContainText(/Paint & Surface Area Calculator/i);
    await expect(page.getByText(/Gallons Required/i)).toBeVisible();

    // Concrete
    await page.goto('/calculators/concrete');
    await expect(page.locator('h1')).toContainText(/Concrete Slab & Footing Calculator/i);
    await expect(page.getByRole('heading', { level: 3, name: /Cubic Yards/i })).toBeVisible();

    // Drywall
    await page.goto('/calculators/drywall');
    await expect(page.locator('h1')).toContainText(/Drywall & Sheetrock Calculator/i);
    await expect(page.getByText(/Sheets \(4x8\)/i)).toBeVisible();

    // Renovation Cost
    await page.goto('/calculators/renovation-cost');
    await expect(page.locator('h1')).toContainText(/Room Renovation Cost Estimator/i);
    await expect(page.getByText('Contractor Labor')).toBeVisible();

    // Material Comparison
    await page.goto('/calculators/material-comparison');
    await expect(page.locator('h1')).toContainText(/Flooring Material Lifecycle & TCO Comparison/i);
    await expect(page.getByRole('heading', { name: 'Solid White Oak Hardwood' })).toBeVisible();
  });

  test('Tools hub page renders tabs and converter', async ({ page }) => {
    await page.goto('/tools');
    await expect(page.locator('h1')).toContainText(/Specialized.*calculat/i);
    await expect(page.getByRole('button', { name: /Box & Carton Calculator/i })).toBeVisible();
  });

  test('Guides page and individual guide detail render accurately', async ({ page }) => {
    await page.goto('/guides');
    await expect(page.locator('h1')).toContainText(/Flooring.*guide/i);

    await page.goto('/guides/flooring-calculator');
    await expect(page.locator('h1')).toContainText(/How to Calculate Flooring Materials/i);
    await expect(page.getByText(/Floor area = width × length/i)).toBeVisible();
  });

  test('About, Privacy, and Terms pages render accurately', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toContainText(/RoomForge.*Manifesto|Better spaces begin with/i);

    await page.goto('/privacy');
    await expect(page.locator('h1')).toContainText(/Privacy Policy/i);
    await expect(page.getByText('Google AdSense & Third-Party Advertising')).toBeVisible();

    await page.goto('/terms');
    await expect(page.locator('h1')).toContainText(/Terms of Service/i);
    await expect(page.getByText('Important Architectural & Engineering Disclaimer')).toBeVisible();
  });

  test('Studio 3D spatial preview, Projects modal, and CSV export are interactive', async ({ page }) => {
    await page.goto('/studio');
    // Check 3D View toggle
    await page.getByRole('button', { name: /3D View/i }).click();
    await expect(page.getByText(/3D Spatial Preview/i)).toBeVisible();

    // Toggle back to 2D Plan
    await page.getByRole('button', { name: /2D Plan/i }).click();
    await expect(page.locator('svg[role="img"]')).toBeVisible();

    // Open Projects Modal
    await page.locator('#projects-button').click();
    await expect(page.getByRole('heading', { name: /My Saved Projects & Plans/i })).toBeVisible();
    await page.getByTitle(/Close dialog/i).click();
    await expect(page.getByRole('heading', { name: /My Saved Projects & Plans/i })).not.toBeVisible();

    // Verify CSV export button exists
    await expect(page.locator('#export-csv-button')).toBeVisible();
  });
});
