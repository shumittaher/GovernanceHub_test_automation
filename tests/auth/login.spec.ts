import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { superAdminUser } from '../../test-data/users';

// Super Admin authentication — verifies role-based login for the highest privilege level
test.describe('Authentication', () => {

  test('super admin can log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginAs(superAdminUser);

    // Confirms the app redirected away from /login after successful authentication.
    // Update this assertion once the expected post-login route is known (e.g. /dashboard).
    await expect(page).not.toHaveURL(/login/);
    await expect(page).toHaveURL(/SuperAdmin/i);
  });

  test('user cannot log in with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(superAdminUser.email, 'WrongPassword!');

    await expect(page).toHaveURL(/login/);
    await expect(page.getByTestId("login-error")).toBeVisible();
  });

});
