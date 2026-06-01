import { test, expect } from '@playwright/test';
import { config } from '../../utils/config';
import { adminUser_2, userUser_2 } from '../../test-data/users';
import { authHeader, getToken, createIncident, deleteIncident } from '../../utils/api-helpers';

// Tests

test.describe('Incidents API', () => {

  for (const user of [adminUser_2, userUser_2]) {
    test(`${user.role} can create an incident via API`, async ({ request }) => {
      const token = await getToken(request, user);
      const adminToken = await getToken(request, adminUser_2);
      const suffix = Date.now();

      const response = await request.post(`${config.apiBaseUrl}/api/incidents`, {
        data: { title: `Incident ${suffix}`, severity: 'High', status: 'Open' },
        headers: authHeader(token),
      });

      expect(response.status()).toBe(201);
      const { incident } = await response.json();

      try {
        expect(incident.title).toBe(`Incident ${suffix}`);
        expect(incident.severity).toBe('High');
        expect(incident.status).toBe('Open');
      } finally {
        await deleteIncident(request, adminToken, incident.id);
      }
    });
  }

  test('authenticated user can list incidents via API', async ({ request }) => {
    const token = await getToken(request, adminUser_2);
    const incident = await createIncident(request, token, `List Test ${Date.now()}`);

    try {
      const response = await request.get(`${config.apiBaseUrl}/api/incidents`, {
        headers: authHeader(token),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body.incidents)).toBe(true);
      expect(body.incidents.some((item: { id: number }) => item.id === incident.id)).toBe(true);
    } finally {
      await deleteIncident(request, token, incident.id);
    }
  });

  test('authenticated user can get an incident by id via API', async ({ request }) => {
    const token = await getToken(request, adminUser_2);
    const incident = await createIncident(request, token, `Get Test ${Date.now()}`);

    try {
      const response = await request.get(`${config.apiBaseUrl}/api/incidents/${incident.id}`, {
        headers: authHeader(token),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.incident.id).toBe(incident.id);
    } finally {
      await deleteIncident(request, token, incident.id);
    }
  });

  test('authenticated user can update an incident via API', async ({ request }) => {
    const token = await getToken(request, adminUser_2);
    const incident = await createIncident(request, token, `Update Test ${Date.now()}`);

    try {
      const response = await request.put(`${config.apiBaseUrl}/api/incidents/${incident.id}`, {
        data: { status: 'Resolved' },
        headers: authHeader(token),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.incident.status).toBe('Resolved');
    } finally {
      await deleteIncident(request, token, incident.id);
    }
  });

  test('admin user can delete an incident via API', async ({ request }) => {
    const token = await getToken(request, adminUser_2);
    const incident = await createIncident(request, token, `Delete Test ${Date.now()}`);

    const response = await request.delete(`${config.apiBaseUrl}/api/incidents/${incident.id}`, {
      headers: authHeader(token),
    });

    expect(response.status()).toBe(204);
  });

  test('incident creation rejects missing title', async ({ request }) => {
    const token = await getToken(request, adminUser_2);

    const response = await request.post(`${config.apiBaseUrl}/api/incidents`, {
      data: { severity: 'Low', status: 'Open' },
      headers: authHeader(token),
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.status).toBe('error');
    expect(body.message).toBe('Invalid request body');
    expect(Array.isArray(body.errors)).toBe(true);
  });

  test('incident creation rejects invalid severity', async ({ request }) => {
    const token = await getToken(request, adminUser_2);

    const response = await request.post(`${config.apiBaseUrl}/api/incidents`, {
      data: { title: `Severity Test ${Date.now()}`, severity: 'Extreme', status: 'Open' },
      headers: authHeader(token),
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.status).toBe('error');
    expect(body.message).toBe('Invalid request body');
  });

  test('updating incident with empty body returns 400', async ({ request }) => {
    const token = await getToken(request, adminUser_2);
    const incident = await createIncident(request, token, `Empty Update Test ${Date.now()}`);

    try {
      const response = await request.put(`${config.apiBaseUrl}/api/incidents/${incident.id}`, {
        data: {},
        headers: authHeader(token),
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.message).toBe('Invalid request body');
    } finally {
      await deleteIncident(request, token, incident.id);
    }
  });

  test('unauthenticated request to incidents route is rejected', async ({ request }) => {
    const response = await request.get(`${config.apiBaseUrl}/api/incidents`);

    expect(response.status()).toBe(401);
  });

});
