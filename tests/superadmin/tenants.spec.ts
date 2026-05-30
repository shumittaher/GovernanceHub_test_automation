import { test } from '@playwright/test';
import { SuperAdminTenantsPage } from '../../pages/SuperAdminTenantsPage';

test.describe('Super Admin — Tenant Management', () => {

  let tenantsPage: SuperAdminTenantsPage;

  test.beforeEach(async ({ page }) => {
    tenantsPage = new SuperAdminTenantsPage(page);
    await tenantsPage.goto();
  });

  test('super admin can create a tenant', async () => {
    const tenantName = `Test Tenant ${Date.now()}`;

    await tenantsPage.createTenant(tenantName);

    await tenantsPage.expectTenantVisible(tenantName);
  });

  test('super admin can delete a tenant', async () => {
    const tenantName = `Test Tenant ${Date.now()}`;

    await tenantsPage.createTenant(tenantName);
    await tenantsPage.deleteTenant(tenantName);

    await tenantsPage.expectTenantNotVisible(tenantName);
  });

});
