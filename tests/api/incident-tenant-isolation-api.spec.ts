import { test, expect, type APIRequestContext } from '@playwright/test';
import { config } from '../../utils/config';
import { type User, adminUser_1, adminUser_2, userUser_2 } from '../../test-data/users';

// Helpers

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

async function getToken(request: APIRequestContext, user: User): Promise<string> {
  const response = await request.post(`${config.apiBaseUrl}/api/auth/login`, {
    data: { email: user.email, password: user.password },
  });
  expect(response.status()).toBe(200);
  const { token } = await response.json();
  return token;
}

async function createIncident(request: APIRequestContext, token: string, title: string): Promise<number> {
  const response = await request.post(`${config.apiBaseUrl}/api/incidents`, {
    data: { title, severity: 'Low', status: 'Open' },
    headers: authHeader(token),
  });
  expect(response.status()).toBe(201);
  const { incident } = await response.json();
  return incident.id;
}

async function deleteIncident(request: APIRequestContext, token: string, id: number): Promise<void> {
  const response = await request.delete(`${config.apiBaseUrl}/api/incidents/${id}`, {
    headers: authHeader(token),
  });

  expect(response.status()).toBe(204);

}

// Tests

test.describe('Incident Tenant Isolation API', () => {

  let adminToken1: string;
  let adminToken2: string;
  let userToken2: string;
  let tenant1IncidentId: number;
  let tenant2IncidentId: number;

  // One incident per tenant created once for the whole suite.
  // afterAll always runs, satisfying the cleanup-on-failure requirement.
  test.beforeAll(async ({ request }) => {
    adminToken1 = await getToken(request, adminUser_1);
    adminToken2 = await getToken(request, adminUser_2);
    userToken2 = await getToken(request, userUser_2);

    tenant1IncidentId = await createIncident(request, adminToken1, `Tenant 1 Isolation ${Date.now()}`);
    tenant2IncidentId = await createIncident(request, adminToken2, `Tenant 2 Isolation ${Date.now()}`);
  });

  test.afterAll(async ({ request }) => {
    if (tenant1IncidentId) await deleteIncident(request, adminToken1, tenant1IncidentId);
    if (tenant2IncidentId) await deleteIncident(request, adminToken2, tenant2IncidentId);
  });

  // ── Cross-tenant GET ──────────────────────────────────────────────────────

  test('tenant 2 admin cannot get tenant 1 incident by id', async ({ request }) => {
    const response = await request.get(`${config.apiBaseUrl}/api/incidents/${tenant1IncidentId}`, {
      headers: authHeader(adminToken2),
    });

    expect(response.status()).toBe(404);
  });

  test('tenant 2 standard user cannot get tenant 1 incident by id', async ({ request }) => {
    const response = await request.get(`${config.apiBaseUrl}/api/incidents/${tenant1IncidentId}`, {
      headers: authHeader(userToken2),
    });

    expect(response.status()).toBe(404);
  });

  // ── Cross-tenant UPDATE ───────────────────────────────────────────────────

  test('tenant 2 admin cannot update tenant 1 incident', async ({ request }) => {
    const response = await request.put(`${config.apiBaseUrl}/api/incidents/${tenant1IncidentId}`, {
      data: { status: 'Resolved' },
      headers: authHeader(adminToken2),
    });

    expect(response.status()).toBe(404);
  });

  test('tenant 2 standard user cannot update tenant 1 incident', async ({ request }) => {
    const response = await request.put(`${config.apiBaseUrl}/api/incidents/${tenant1IncidentId}`, {
      data: { status: 'Resolved' },
      headers: authHeader(userToken2),
    });

    expect(response.status()).toBe(404);
  });

  // ── Cross-tenant DELETE ───────────────────────────────────────────────────

  // IMPLEMENTATION NOTE: requireRole("admin") runs before the tenant scoping check.
  // adminUser_2 passes the role check (they are an admin), then the tenant scoping
  // check should return 404 because the incident belongs to tenant 1.
  // If this test returns 403 instead, the backend is rejecting on role before tenant scope,
  // which means requireRole is checking tenant-specific admin membership, not just role name.
  test('tenant 2 admin cannot delete tenant 1 incident', async ({ request }) => {
    const response = await request.delete(`${config.apiBaseUrl}/api/incidents/${tenant1IncidentId}`, {
      headers: authHeader(adminToken2),
    });

    expect(response.status()).toBe(404);
  });

  // ── Cross-tenant LIST ─────────────────────────────────────────────────────

  test('tenant 2 admin does not see tenant 1 incident in incident list', async ({ request }) => {
    const response = await request.get(`${config.apiBaseUrl}/api/incidents`, {
      headers: authHeader(adminToken2),
    });

    expect(response.status()).toBe(200);
    const { incidents } = await response.json();
    const ids = incidents.map((i: { id: number }) => i.id);
    expect(ids).not.toContain(tenant1IncidentId);
  });

  test('tenant 2 standard user does not see tenant 1 incident in incident list', async ({ request }) => {
    const response = await request.get(`${config.apiBaseUrl}/api/incidents`, {
      headers: authHeader(userToken2),
    });

    expect(response.status()).toBe(200);
    const { incidents } = await response.json();
    const ids = incidents.map((i: { id: number }) => i.id);
    expect(ids).not.toContain(tenant1IncidentId);
  });

  // ── Same-tenant valid access ──────────────────────────────────────────────

  test('tenant 1 admin can see tenant 1 incident in incident list', async ({ request }) => {
    const response = await request.get(`${config.apiBaseUrl}/api/incidents`, {
      headers: authHeader(adminToken1),
    });

    expect(response.status()).toBe(200);
    const { incidents } = await response.json();
    const ids = incidents.map((i: { id: number }) => i.id);
    expect(ids).toContain(tenant1IncidentId);
  });

  test('tenant 2 standard user can see tenant 2 incident in incident list', async ({ request }) => {
    const response = await request.get(`${config.apiBaseUrl}/api/incidents`, {
      headers: authHeader(userToken2),
    });

    expect(response.status()).toBe(200);
    const { incidents } = await response.json();
    const ids = incidents.map((i: { id: number }) => i.id);
    expect(ids).toContain(tenant2IncidentId);
  });

  test('tenant 1 admin can update tenant 1 incident', async ({ request }) => {
    const response = await request.put(`${config.apiBaseUrl}/api/incidents/${tenant1IncidentId}`, {
      data: { status: 'In Progress' },
      headers: authHeader(adminToken1),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.incident.status).toBe('In Progress');
  });

  test('tenant 2 standard user can update tenant 2 incident', async ({ request }) => {
    const response = await request.put(`${config.apiBaseUrl}/api/incidents/${tenant2IncidentId}`, {
      data: { status: 'In Progress' },
      headers: authHeader(userToken2),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.incident.status).toBe('In Progress');
  });

});
