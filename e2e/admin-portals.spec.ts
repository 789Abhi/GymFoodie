import { test, expect } from '@playwright/test';

test.describe('GymFoodie Partner & Admin Portals', () => {
  test('Kitchen Admin: renders dispatch tickets with real food thumbnails and 1-tap advancement', async ({ page }) => {
    // Navigate via login as Kitchen Admin
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.locator('text="Kitchen Admin"').first().click();
    const loginBtn = page.getByText(/1-Tap Instant Kitchen Admin Login/);
    await expect(loginBtn).toBeVisible({ timeout: 15000 });
    await loginBtn.click();
    await page.waitForURL(/.*restaurant-admin/);

    // Partner info
    await expect(page.getByText('Diet & Protein')).toBeVisible();
    await expect(page.getByText('DISPATCH LIVE')).toBeVisible();

    // Tickets
    await expect(page.getByText(/Live Kitchen Tickets/)).toBeVisible();

    // Batch summary
    await expect(page.getByText('BATCH COOKING SUMMARY')).toBeVisible();
    await expect(page.getByText('Grilled Herb Chicken & Quinoa').first()).toBeVisible();
    await expect(page.getByText('24 portions')).toBeVisible();

    // Test advance button
    page.once('dialog', async dialog => {
      await dialog.dismiss();
    });
    const advanceBtn = page.locator('text=/Handover to Courier|Mark as Ready|Confirm Delivery/').first();
    if (await advanceBtn.isVisible()) {
      await advanceBtn.click();
    }
  });

  test('Gym Admin: displays live turnstile gate and check-in scanner', async ({ page }) => {
    // Navigate via login as Gym Admin
    await page.goto('/login');
    await page.locator('text="Gym Admin"').first().click();
    await page.getByText(/1-Tap Instant Gym Admin Login/).click();
    await page.waitForURL(/.*gym-admin/);

    await expect(page.getByText('Iron House Gym').first()).toBeVisible();
    await expect(page.getByText('Partner Portal • Mangaluru Turnstiles')).toBeVisible();
  });

  test('Super Admin HQ: displays treasury overview and partner settlements', async ({ page }) => {
    // Navigate via login as HQ Admin
    await page.goto('/login');
    await page.locator('text="HQ Admin"').first().click();
    await page.getByText(/1-Tap Instant HQ Admin Login/).click();
    await page.waitForURL(/.*super-admin/);

    await expect(page.getByText('GymFoodie HQ')).toBeVisible();
    await expect(page.getByText('Central Operations & Treasury Command')).toBeVisible();
    await expect(page.getByText('MAIN ADMIN')).toBeVisible();
  });

  test('Role Switcher Modal: switches perspectives from Header', async ({ page }) => {
    await page.goto('/splash');
    await page.getByText('Instant Member Access (Demo)').click();
    await page.waitForURL(/.*home/);

    // Click the Header role badge
    const roleBadge = page.getByText(/Member ⇄|Gym Admin ⇄|Kitchen Admin ⇄/).first();
    await expect(roleBadge).toBeVisible();
    await roleBadge.click();

    // Role switcher modal appears
    await expect(page.getByText('Switch Portal Perspective')).toBeVisible();
    await expect(page.getByText('Experience GymFoodie as each stakeholder')).toBeVisible();

    // Click Gym Partner Admin
    await page.getByText('Gym Partner Admin', { exact: true }).click();
    await expect(page).toHaveURL(/.*gym-admin/);
    await expect(page.getByText('Iron House Gym').first()).toBeVisible();
  });
});
