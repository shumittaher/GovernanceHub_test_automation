import { test, expect } from '@playwright/test';

// storageState is injected by playwright.config.ts — no login step needed in these tests
test.describe('Super Admin Dashboard', () => {

  test('super admin lands on the dashboard after authentication', async ({ page }) => {
    await page.goto('');

    await expect(page).not.toHaveURL(/login/);
    await expect(page).toHaveURL(/SuperAdmin/i);
  });

});
