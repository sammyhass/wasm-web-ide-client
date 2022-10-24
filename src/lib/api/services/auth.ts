import { z } from 'zod';
import { axiosClient } from '../axios';

export const registerSchema = z
  .object({
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(20),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })
  .transform(({ confirmPassword, ...data }) => data);

type RegisterT = z.infer<typeof registerSchema>;

export const register = async ({ username, password }: RegisterT) => {
  const { data, status } = await axiosClient.post('/auth/register', {
    username,
    password,
  });

  if (status !== 200) {
    return Promise.reject(data);
  }

  return data;
};

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string(),
});

type LoginT = z.infer<typeof loginSchema>;

export const login = async ({ username, password }: LoginT) => {
  const { data, status } = await axiosClient.post('/auth/login', {
    username,
    password,
  });

  if (status !== 200) {
    return Promise.reject(data);
  }

  return data;
};

export const me = async () => {
  const { data, status } = await axiosClient.get('/auth/me', {
    withCredentials: true,
  });

  if (status !== 200) {
    return Promise.reject(data);
  }

  return data;
};
