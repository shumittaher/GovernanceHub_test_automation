import { type Page, type Locator } from '@playwright/test';
import type { User } from '../test-data/users';

export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  // Exposed for assertions in tests — assumes the app uses role="alert" for auth errors.
  // If the test fails here, inspect the error element and update this locator.
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    // If these selectors fail, verify the exact label text in the app.
    // The recording used input[type="email"] / input[type="password"] — upgraded here
    // to label-based selectors which are more stable and accessibility-friendly.
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
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
