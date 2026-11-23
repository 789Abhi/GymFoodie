import { test, expect } from '@playwright/test';

test.describe('GymFoodie Splash & Welcome Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/splash');
    await page.waitForLoadState('networkidle');
  });

  test('should display official GymFoodie branding and tagline', async ({ page }) => {
    // Check brand name (using first() because toolbar also displays GymFoodie)
    await expect(page.getByText('GymFoodie').first()).toBeVisible({ timeout: 10000 });
    // Check tagline
    await expect(page.getByText('EAT SMART. TRAIN HARD.')).toBeVisible();
  });

  test('should display the gourmet food hero card', async ({ page }) => {
    await expect(page.getByText('CHEF PREPARED • MACRO CRAFTED')).toBeVisible();
    await expect(page.getByText('Gourmet Macro Meals & Gym Access')).toBeVisible();
  });

  test('should display desktop mobile preview toolbar on wide screens', async ({ page, isMobile }) => {
    if (!isMobile) {
      await expect(page.getByText('Desktop Mobile Preview Mode')).toBeVisible();
      await expect(page.getByText('📱 Mobile (430px)')).toBeVisible();
      await expect(page.getByText('🖥️ Full Width')).toBeVisible();
      // Status bar time
      await expect(page.getByText('9:41')).toBeVisible();
    }
  });

  test('should navigate to login screen on clicking "Select Login Role & Sign In"', async ({ page }) => {
    const signInBtn = page.getByText('Select Login Role & Sign In');
    await expect(signInBtn).toBeVisible();
    await signInBtn.click();
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByText('SELECT LOGIN PORTAL PERSPECTIVE')).toBeVisible();
  });

  test('should navigate directly to member home on "Instant Member Access (Demo)"', async ({ page }) => {
    const demoBtn = page.getByText('Instant Member Access (Demo)');
    await expect(demoBtn).toBeVisible();
    await demoBtn.click();
    await expect(page).toHaveURL(/.*home/);
    await expect(page.getByText('Hey Abhishek')).toBeVisible();
  });
});
