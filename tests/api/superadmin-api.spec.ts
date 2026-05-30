import { test, expect, type APIRequestContext } from '@playwright/test';
import { config } from '../../utils/config';
import { superAdminUser } from '../../test-data/users';

// Helpers

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

async function getToken(request: APIRequestContext): Promise<string> {
  const response = await request.post(`${config.apiBaseUrl}/api/auth/login`, {
    data: { email: superAdminUser.email, password: superAdminUser.password },
  });
  expect(response.status()).toBe(200);
  const { token } = await response.json();
  return token;
}

async function createTenant(request: APIRequestContext, token: string, name: string) {
  const response = await request.post(`${config.apiBaseUrl}/api/superadmin/tenants`, {
    data: { name },
    headers: authHeader(token),
  });
  expect(response.status()).toBe(201);
  const { tenant } = await response.json();
  return tenant as { id: number; name: string };
}

async function deleteTenant(request: APIRequestContext, token: string, id: number) {
  await request.delete(`${config.apiBaseUrl}/api/superadmin/tenants/${id}`, {
    headers: authHeader(token),
  });
}

async function createAdmin(
  request: APIRequestContext,
  token: string,
  details: { name: string; email: string; password: string; tenant_id: number }
) {
  const response = await request.post(`${config.apiBaseUrl}/api/superadmin/admins`, {
    data: details,
    headers: authHeader(token),
  });
  expect(response.status()).toBe(201);
  const { admin } = await response.json();
  return admin as { id: number; name: string; email: string };
}

async function deleteAdmin(request: APIRequestContext, token: string, id: number) {
  await request.delete(`${config.apiBaseUrl}/api/superadmin/admins/${id}`, {
    headers: authHeader(token),
  });
}

// Tests

test.describe('Super Admin API', () => {

  test('super admin can create and delete a tenant via API', async ({ request }) => {
    const token = await getToken(request);
    const suffix = Date.now();

    const createRes = await request.post(`${config.apiBaseUrl}/api/superadmin/tenants`, {
      data: { name: `API Tenant ${suffix}` },
      headers: authHeader(token),
    });
    expect(createRes.status()).toBe(201);
    const { tenant } = await createRes.json();
    expect(tenant.name).toBe(`API Tenant ${suffix}`);

    const deleteRes = await request.delete(`${config.apiBaseUrl}/api/superadmin/tenants/${tenant.id}`, {
      headers: authHeader(token),
    });
    expect(deleteRes.status()).toBe(204);
  });

  test('super admin can create and delete a tenant admin via API', async ({ request }) => {
    const token = await getToken(request);
    const suffix = Date.now();
    const adminEmail = `api-admin-${suffix}@test.com`;

    const tenant = await createTenant(request, token, `API Tenant ${suffix}`);

    try {
      const admin = await createAdmin(request, token, {
        name: `API Admin ${suffix}`,
        email: adminEmail,
        password: 'AdminPass123!',
        tenant_id: tenant.id,
      });
      expect(admin.email).toBe(adminEmail);

      await deleteAdmin(request, token, admin.id);
    } finally {
      // Runs whether the test passes or fails — prevents orphaned tenants
      await deleteTenant(request, token, tenant.id);
    }
  });

  test('tenant creation rejects missing name', async ({ request }) => {
    const token = await getToken(request);

    const response = await request.post(`${config.apiBaseUrl}/api/superadmin/tenants`, {
      data: {},
      headers: authHeader(token),
    });

    expect(response.status()).toBe(400);
  });

  test('admin creation rejects invalid email', async ({ request }) => {
    const token = await getToken(request);
    const suffix = Date.now();

    // A real tenant is created to supply a valid tenant_id — the test targets email validation only
    const tenant = await createTenant(request, token, `API Tenant ${suffix}`);

    try {
      const response = await request.post(`${config.apiBaseUrl}/api/superadmin/admins`, {
        data: {
          name: `API Admin ${suffix}`,
          email: 'not-an-email',
          password: 'AdminPass123!',
          tenant_id: tenant.id,
        },
        headers: authHeader(token),
      });

      expect(response.status()).toBe(400);
    } finally {
      await deleteTenant(request, token, tenant.id);
    }
  });

  test('admin creation rejects invalid tenant id', async ({ request }) => {
    const token = await getToken(request);
    const suffix = Date.now();

    const response = await request.post(`${config.apiBaseUrl}/api/superadmin/admins`, {
      data: {
        name: `API Admin ${suffix}`,
        email: `api-admin-${suffix}@test.com`,
        password: 'AdminPass123!',
        tenant_id: -1,
      },
      headers: authHeader(token),
    });

    expect(response.status()).toBe(400);
  });

  test('admin creation rejects non-existent tenant id', async ({ request }) => {
    const token = await getToken(request);
    const suffix = Date.now();

    const response = await request.post(`${config.apiBaseUrl}/api/superadmin/admins`, {
      data: {
        name: `API Admin ${suffix}`,
        email: `api-admin-${suffix}@test.com`,
        password: 'AdminPass123!',
        tenant_id: 999999,
      },
      headers: authHeader(token),
    });

    expect(response.status()).toBe(404);
  });

  test('unauthenticated request to superadmin route is rejected', async ({ request }) => {
    const response = await request.get(`${config.apiBaseUrl}/api/superadmin/tenants`);

    expect(response.status()).toBe(401);
  });

});
