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

  test('Tools hub page renders tabs and converter', async ({ page }) => {
    await page.goto('/tools');
    await expect(page.locator('h1')).toContainText(/Specialized.*calculat/i);
    await expect(page.locator('text=Box & Carton Calculator')).toBeVisible();
  });

  test('Guides page and individual guide detail render accurately', async ({ page }) => {
    await page.goto('/guides');
    await expect(page.locator('h1')).toContainText(/Flooring.*guide/i);

    await page.goto('/guides/flooring-calculator');
    await expect(page.locator('h1')).toContainText(/How to Calculate Flooring Materials/i);
    await expect(page.locator('text=Floor area = width × length')).toBeVisible();
  });

  test('About page renders methodology and formulas', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toContainText(/RoomForge.*Manifesto|Better spaces begin with/i);
    await expect(page.locator('#transparency')).toBeVisible();
  });
});
