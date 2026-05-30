import { type Page, type Locator, expect } from '@playwright/test';

export interface AdminDetails {
  name: string;
  email: string;
  password: string;
  tenantId: number;
}

export class SuperAdminAdminsPage {
  private readonly adminNameInput: Locator;
  private readonly adminEmailInput: Locator;
  private readonly adminPasswordInput: Locator;
  private readonly tenantIdInput: Locator;
  private readonly createAdminButton: Locator;

  constructor(private readonly page: Page) {
    this.adminNameInput = page.getByLabel('Name');
    this.adminEmailInput = page.getByLabel('Email');
    this.adminPasswordInput = page.getByLabel('Password');
    this.tenantIdInput = page.getByLabel('Tenant ID');
    this.createAdminButton = page.getByRole('button', { name: 'Create Admin' });
  }

  async goto() {
    await this.page.goto('/superadmin/admins');
  }

  async createAdmin(details: AdminDetails) {
    await this.adminNameInput.fill(details.name);
    await this.adminEmailInput.fill(details.email);
    await this.adminPasswordInput.fill(details.password);
    await this.tenantIdInput.fill(String(details.tenantId));
    await this.createAdminButton.click();
    await this.expectAdminVisible(details.email);
  }

  async expectAdminVisible(email: string) {
    await expect(this.page.getByRole('row', { name: new RegExp(email) })).toBeVisible();
  }

  async expectAdminNotVisible(email: string) {
    await expect(this.page.getByRole('row', { name: new RegExp(email) })).not.toBeVisible();
  }
}
