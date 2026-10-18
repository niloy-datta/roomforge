import { test, expect } from "@playwright/test";

test.describe("RoomForge Next.js App Router Routes & Interactions", () => {
  test("home page loads with essential elements and quick start form", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/ROOMFORGE/);
    await expect(page.locator("h1")).toContainText(/A room you love/i);
    await expect(page.locator("#quick-start")).toBeVisible();
    await expect(page.locator("#home-width")).toHaveValue("12");
    await expect(page.locator("#home-length")).toHaveValue("18");
  });

  test("quick start form validates and navigates to studio with query params", async ({ page }) => {
    await page.goto("/");
    await page.fill("#home-width", "14");
    await page.fill("#home-length", "20");
    await page.click("button[type='submit']");

    await page.waitForURL(/\/studio\?.*w=14.*l=20/);
    await expect(page.locator("#width")).toHaveValue("14");
    await expect(page.locator("#length")).toHaveValue("20");
  });

  test("studio page renders 2D SVG canvas and recalculates estimates", async ({ page }) => {
    await page.goto("/studio");
    await expect(page.locator("svg#room-svg")).toBeVisible();
    await expect(page.locator("#area-number")).toContainText("216");
    await expect(page.locator("#box-count")).toContainText("10 boxes");
    await expect(page.locator("#total-cost")).toContainText("$450.00");

    // Modify width and verify live update
    await page.fill("#width", "16");
    await expect(page.locator("#area-number")).toContainText("288");
  });

  test("tools page renders specialized tools suite", async ({ page }) => {
    await page.goto("/tools");
    await expect(page.locator("h1")).toContainText(/Specialized.*calculat/i);
    await expect(page.locator("#box-calculator")).toBeVisible();
    await page.click("button:has-text('Laying Pattern Waste Advisor')");
    await expect(page.locator("#waste-comparator")).toBeVisible();
    await page.click("button:has-text('Area & Length Converter')");
    await expect(page.locator("#unit-converter")).toBeVisible();
  });

  test("guides index and flooring calculator guide pages render correctly", async ({ page }) => {
    await page.goto("/guides");
    await expect(page.locator("h1")).toContainText(/Flooring.*guide/i);

    await page.goto("/guides/flooring-calculator");
    await expect(page.locator("h1")).toContainText(/How to Calculate Flooring Materials/i);
    await expect(page.locator("#area")).toBeVisible();
    await expect(page.locator("#waste")).toBeVisible();
    await expect(page.locator("#boxes")).toBeVisible();
    await expect(page.locator("#budget")).toBeVisible();
  });

  test("about page renders architectural manifesto and stack information", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("h1")).toContainText(/RoomForge.*Manifesto|Better spaces begin with/i);
    await expect(page.locator("text=Next.js 15 App Router")).toBeVisible();
  });
});
