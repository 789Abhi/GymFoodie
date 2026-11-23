import { test, expect } from '@playwright/test';

test.describe('GymFoodie Authentication & Role Portals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('should display login portal with role selector tabs', async ({ page }) => {
    await expect(page.getByText('SELECT LOGIN PORTAL PERSPECTIVE')).toBeVisible();
    await expect(page.locator('text="Member"').first()).toBeVisible();
    await expect(page.locator('text="Gym Admin"').first()).toBeVisible();
    await expect(page.locator('text="Kitchen Admin"').first()).toBeVisible();
    await expect(page.locator('text="HQ Admin"').first()).toBeVisible();
  });

  test('should switch perspectives when clicking role tabs', async ({ page }) => {
    // Switch to Gym Admin
    await page.locator('text="Gym Admin"').first().click();
    await expect(page.getByText('Manage turnstile QR scans, floor capacity, and check-in logs')).toBeVisible();

    // Switch to Kitchen Admin
    await page.locator('text="Kitchen Admin"').first().click();
    await expect(page.getByText('Live meal prep queue, courier dispatch, and diet specifications')).toBeVisible();

    // Switch to HQ Admin
    await page.locator('text="HQ Admin"').first().click();
    await expect(page.getByText('Central operations, weekly treasury payouts, complaints, and network audits')).toBeVisible();
  });

  test('should login as Member via 1-Tap Instant Login', async ({ page }) => {
    await page.locator('text="Member"').first().click();
    const loginBtn = page.getByText(/1-Tap Instant Member Login/);
    await expect(loginBtn).toBeVisible();
    await loginBtn.click();
    await expect(page).toHaveURL(/.*home/);
    await expect(page.getByText('Hey Abhishek')).toBeVisible();
  });

  test('should login as Kitchen Admin and navigate to /restaurant-admin', async ({ page }) => {
    await page.locator('text="Kitchen Admin"').first().click();
    const loginBtn = page.getByText(/1-Tap Instant Kitchen Admin Login/);
    await expect(loginBtn).toBeVisible();
    await loginBtn.click();
    await expect(page).toHaveURL(/.*restaurant-admin/);
    await expect(page.getByText('Diet & Protein')).toBeVisible();
  });

  test('should navigate back to Splash screen via Back button', async ({ page }) => {
    const backBtn = page.getByText('‹ Back to Welcome');
    await expect(backBtn).toBeVisible();
    await backBtn.click();
    await expect(page).toHaveURL(/.*splash/);
  });
});
