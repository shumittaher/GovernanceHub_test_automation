import { type Page, type Locator, expect } from '@playwright/test';

export class SuperAdminTenantsPage {
  private readonly tenantNameInput: Locator;
  private readonly createTenantButton: Locator;

  constructor(private readonly page: Page) {
    this.tenantNameInput = page.getByLabel('Name');
    this.createTenantButton = page.getByRole('button', { name: 'Create Tenant' });
  }

  async goto() {
    await this.page.goto('/superadmin/tenants');
  }

  async createTenant(name: string) {
    await this.tenantNameInput.fill(name);
    await this.createTenantButton.click();
    await this.expectTenantVisible(name);
  }

  async getTenantId(name: string): Promise<number> {
    // Requires data-tenant-id="<id>" on the <tr> element in the GovernanceHub frontend.
    // Example: <tr data-tenant-id={tenant.id}>
    const row = this.page.getByRole('row', { name: new RegExp(name) });
    const id = await row.getAttribute('data-tenant-id');
    if (!id) throw new Error(`data-tenant-id attribute not found on row for tenant "${name}"`);
    return Number(id);
  }

  async deleteTenant(name: string) {
    this.page.once('dialog', dialog => dialog.accept());
    await this.page
      .getByRole('row', { name: new RegExp(name) })
      .getByRole('button', { name: 'Delete' })
      .click();
  }

  async expectTenantVisible(name: string) {
    await expect(this.page.getByRole('row', { name: new RegExp(name) })).toBeVisible();
  }

  async expectTenantNotVisible(name: string) {
    await expect(this.page.getByRole('row', { name: new RegExp(name) })).not.toBeVisible();
  }
}
