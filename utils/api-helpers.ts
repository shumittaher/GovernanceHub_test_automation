import { expect, type APIRequestContext } from '@playwright/test';
import { config } from './config';
import type { User } from '../test-data/users';

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function getToken(request: APIRequestContext, user: User): Promise<string> {
  const response = await request.post(`${config.apiBaseUrl}/api/auth/login`, {
    data: { email: user.email, password: user.password },
  });
  expect(response.status()).toBe(200);
  const { token } = await response.json();
  return token;
}

export async function createIncident(
  request: APIRequestContext,
  token: string,
  title: string
): Promise<{ id: number; title: string; severity: string; status: string }> {
  const response = await request.post(`${config.apiBaseUrl}/api/incidents`, {
    data: { title, severity: 'Low', status: 'Open' },
    headers: authHeader(token),
  });
  expect(response.status()).toBe(201);
  const { incident } = await response.json();
  return incident;
}

export async function deleteIncident(
  request: APIRequestContext,
  token: string,
  id: number
): Promise<void> {
  const response = await request.delete(`${config.apiBaseUrl}/api/incidents/${id}`, {
    headers: authHeader(token),
  });
  expect(response.status()).toBe(204);
}
