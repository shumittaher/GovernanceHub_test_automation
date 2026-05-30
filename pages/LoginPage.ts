import { type Page, type Locator, expect } from '@playwright/test';
import type { User } from '../test-data/users';

export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    // If these selectors fail, verify the exact label text in the app.
    // The recording used input[type="email"] / input[type="password"] — upgraded here
    // to label-based selectors which are more stable and accessibility-friendly.
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByTestId('login-error');
  }

  async expectLoginError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async loginAs(user: User) {
    await this.login(user.email, user.password);
  }
}
