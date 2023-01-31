import { loginSchema } from '@/lib/api/services/auth';

export const getTestURL = () => {
  return process.env.TEST_URL;
};

export const getURL = (path: string) => {
  return `${getTestURL()}${path}`;
};

export const getTestUser = () => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  return loginSchema.parse({
    email,
    password,
  });
};
