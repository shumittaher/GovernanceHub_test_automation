import 'dotenv/config';

export const config = {
  frontendUrl:
    process.env.FRONTEND_URL || 'http://localhost:5173',

  apiBaseUrl:
    process.env.API_BASE_URL || 'http://localhost:5000',
};