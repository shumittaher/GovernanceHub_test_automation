import { test } from '@playwright/test';
import { SuperAdminTenantsPage } from '../../pages/SuperAdminTenantsPage';
import { SuperAdminAdminsPage } from '../../pages/SuperAdminAdminsPage';

test.describe('Super Admin — Administrator Management', () => {

  let tenantsPage: SuperAdminTenantsPage;
  let adminsPage: SuperAdminAdminsPage;
  let tenantName: string;
  let tenantId: number;

  test.beforeEach(async ({ page }) => {
    tenantsPage = new SuperAdminTenantsPage(page);
    adminsPage = new SuperAdminAdminsPage(page);

    tenantName = `Test Tenant ${Date.now()}`;
    await tenantsPage.goto();
    await tenantsPage.createTenant(tenantName);
    tenantId = await tenantsPage.getTenantId(tenantName);
  });

  test.afterEach(async () => {
    await tenantsPage.goto();
    await tenantsPage.deleteTenant(tenantName);
  });

  test('super admin can create a tenant administrator', async () => {
    const suffix = Date.now();
    const adminEmail = `admin-${suffix}@test.com`;

    await adminsPage.goto();
    await adminsPage.createAdmin({
      name: `Admin ${suffix}`,
      email: adminEmail,
      password: 'AdminPass123!',
      tenantId,
    });

    await adminsPage.expectAdminVisible(adminEmail);
  });

  test('super admin can delete a tenant administrator', async () => {
    const suffix = Date.now();
    const adminEmail = `admin-${suffix}@test.com`;

    await adminsPage.goto();
    await adminsPage.createAdmin({
      name: `Admin ${suffix}`,
      email: adminEmail,
      password: 'AdminPass123!',
      tenantId,
    });

    await adminsPage.deleteAdmin(adminEmail);

    await adminsPage.expectAdminNotVisible(adminEmail);
  });

});
