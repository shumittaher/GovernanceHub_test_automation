import { test } from '@playwright/test';
import { SuperAdminTenantsPage } from '../../pages/SuperAdminTenantsPage';
import { SuperAdminAdminsPage } from '../../pages/SuperAdminAdminsPage';

test.describe('Super Admin — Tenant Lifecycle', () => {

  test('deleting a tenant removes its associated admin', async ({ page }) => {
    const suffix = Date.now();
    const tenantName = `Test Tenant ${suffix}`;
    const adminEmail = `admin-${suffix}@test.com`;

    const tenantsPage = new SuperAdminTenantsPage(page);
    const adminsPage = new SuperAdminAdminsPage(page);

    await tenantsPage.goto();
    await tenantsPage.createTenant(tenantName);
    await tenantsPage.expectTenantVisible(tenantName);
    const tenantId = await tenantsPage.getTenantId(tenantName);

    await adminsPage.goto();
    await adminsPage.createAdmin({
      name: `Admin ${suffix}`,
      email: adminEmail,
      password: 'AdminPass123!',
      tenantId,
    });
    await adminsPage.expectAdminVisible(adminEmail);

    await tenantsPage.goto();
    await tenantsPage.deleteTenant(tenantName);
    await tenantsPage.expectTenantNotVisible(tenantName);

    await adminsPage.goto();
    await adminsPage.expectAdminNotVisible(adminEmail);
  });

});
