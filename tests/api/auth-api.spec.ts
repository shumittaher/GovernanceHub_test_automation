import { test, expect, type APIRequestContext } from '@playwright/test';
import { config } from '../../utils/config';
import { superAdminUser } from '../../test-data/users';

function loginRequest(request: APIRequestContext, data: object) {
  return request.post(`${config.apiBaseUrl}/api/auth/login`, { data });
}

test.describe('Authentication API', () => {

  test('valid super admin credentials return a token and user', async ({ request }) => {
    const response = await loginRequest(request, {
      email: superAdminUser.email,
      password: superAdminUser.password,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
    expect(body.user).toBeDefined();
  });

  test('invalid password returns 401', async ({ request }) => {
    const response = await loginRequest(request, {
      email: superAdminUser.email,
      password: 'WrongPassword!',
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Invalid email or password');
  });

  test('unknown email returns 401', async ({ request }) => {
    const response = await loginRequest(request, {
      email: 'unknown@example.com',
      password: 'AnyPassword123!',
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Invalid email or password');
  });

  test('invalid email format returns 400', async ({ request }) => {
    const response = await loginRequest(request, {
      email: 'not-an-email',
      password: 'AnyPassword123!',
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.status).toBe('error');
    expect(body.message).toBe('Invalid login payload');
  });

  test('missing password returns 400', async ({ request }) => {
    const response = await loginRequest(request, {
      email: superAdminUser.email,
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.status).toBe('error');
    expect(body.message).toBe('Invalid login payload');
  });

});
