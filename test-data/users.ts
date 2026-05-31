import 'dotenv/config';

export interface User {
  email: string;
  password: string;
  role: string;
  tenant_id?: number;
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

export const adminUser_1: User = {
  email: getEnv('ADMIN_EMAIL_1'),
  password: getEnv('ADMIN_PASSWORD_1'),
  role: 'Admin',
  tenant_id: 1,
};


export const adminUser_2: User = {
  email: getEnv('ADMIN_EMAIL_2'),
  password: getEnv('ADMIN_PASSWORD_2'),
  role: 'Admin',
  tenant_id: 2,
};

export const userUser_2: User = {
  email: getEnv('USER_EMAIL_2'),
  password: getEnv('USER_PASSWORD_2'),
  role: 'User',
  tenant_id: 2,
};