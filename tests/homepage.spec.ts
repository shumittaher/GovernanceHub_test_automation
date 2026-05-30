import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {

  // Verifies the app loads without silently redirecting to an error page
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('');

    await expect(page).toHaveURL(/.+/);
    await expect(page).not.toHaveURL(/error|404|not-found/i);
  });

});
