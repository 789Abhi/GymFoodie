import { test, expect } from '@playwright/test';

test.describe('GymFoodie Member App Tabs', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to splash then use Instant Demo Access
    await page.goto('/splash');
    await page.getByText('Instant Member Access (Demo)').click();
    await page.waitForURL(/.*home/);
  });

  test('Home Tab: displays nutrition metrics, meal card, and quick pass hub', async ({ page }) => {
    // Greeting
    await expect(page.getByText('Hey Abhishek')).toBeVisible();
    await expect(page.getByText('METABOLIC FUEL • DAY 14')).toBeVisible();

    // Calorie Target
    await expect(page.getByText('DAILY CALORIC TARGET')).toBeVisible();
    await expect(page.getByText('1,650')).toBeVisible();

    // Real food lunch meal card
    await expect(page.getByText('Grilled Herb Chicken & Quinoa')).toBeVisible();
    await expect(page.getByText('620 KCAL')).toBeVisible();
    await expect(page.getByText('48g Protein')).toBeVisible();

    // Hub passes
    await expect(page.getByText('Iron House Gym').first()).toBeVisible();
    await expect(page.getByText('7-Day Meal Calendar')).toBeVisible();
  });

  test('Meal Plan Tab: displays chef meal and allows macro swaps', async ({ page }) => {
    // Navigate to Meal Plan
    await page.goto('/(tabs)/meal-plan');
    await page.waitForLoadState('networkidle');

    // Chef Choice
    await expect(page.getByText('Teriyaki Paneer & Brown Rice Bowl')).toBeVisible();
    await expect(page.getByText('GLUTEN-FREE')).toBeVisible();
    await expect(page.getByText('38g')).toBeVisible(); // Protein

    // Macro-Equivalent Swaps
    await expect(page.getByText('Macro-Equivalent Swaps')).toBeVisible();
    await expect(page.getByText('Egg White Burrito Bowl')).toBeVisible();
    await expect(page.getByText('Herb Chicken & Quinoa')).toBeVisible();

    // Confirm today's meal
    page.once('dialog', async dialog => {
      await dialog.dismiss();
    });
    const confirmBtn = page.getByText(/Confirm Daily Meal|Daily Meal Confirmed/);
    await confirmBtn.click();
  });

  test('Gym Pass Tab: renders active QR code and turnstile scan button', async ({ page }) => {
    // Navigate to Gym Pass
    await page.goto('/(tabs)/gym-pass');
    await page.waitForLoadState('networkidle');

    // Check pass status
    await expect(page.getByText('GYMFOODIE ALL-ACCESS PASS')).toBeVisible();
    await expect(page.getByText('Iron House Gym').first()).toBeVisible();

    // Instant check-in
    page.once('dialog', async dialog => {
      await dialog.dismiss();
    });
    const checkInBtn = page.getByText(/Instant Gym Check-In|Checked In for Today/);
    await expect(checkInBtn).toBeVisible();
    await checkInBtn.click();
  });

  test('Profile Tab: displays subscription status and admin shortcuts', async ({ page }) => {
    // Navigate to Profile
    await page.goto('/(tabs)/profile');
    await page.waitForLoadState('networkidle');

    // User details
    await expect(page.getByText('Abhishek TK')).toBeVisible();
    await expect(page.getByText('VIP • Transformation Plan')).toBeVisible();

    // Admin shortcuts
    await expect(page.getByText('GymFoodie HQ Super Admin Portal')).toBeVisible();
    await expect(page.getByText('Gym Partner Admin Portal')).toBeVisible();
    await expect(page.getByText('Kitchen Partner Admin Portal')).toBeVisible();
  });
});
