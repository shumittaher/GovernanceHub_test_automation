import 'dotenv/config';

export interface User {
  email: string;
  password: string;
  role: string;
}

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const superAdminUser: User = {
  email: getEnv('SUPERADMIN_EMAIL'),
  password: getEnv('SUPERADMIN_PASSWORD'),
  role: 'Super Admin',
};