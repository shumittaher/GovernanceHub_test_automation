import { test as setup } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { superAdminUser } from '../../test-data/users';

const authFile = 'playwright/.auth/superadmin.json';

setup('authenticate as super admin', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.loginAs(superAdminUser);

  await page.waitForURL(/SuperAdmin/i);
  await page.context().storageState({ path: authFile });
});
