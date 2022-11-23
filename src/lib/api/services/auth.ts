import { User } from '@/hooks/useMe';
import { z } from 'zod';
import { axiosClient } from '../axios';

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })
  .transform(({ confirmPassword, ...data }) => data);

type RegisterT = z.input<typeof registerSchema>;
export const register = async ({ email, password }: RegisterT) => {
  const { data, status } = await axiosClient.post('/auth/register', {
    email,
    password,
  });

  if (status !== 200) {
    return Promise.reject(data);
  }

  return data;
};

export const loginSchema = z.object({
  email: z.string().min(5),
  password: z.string().min(8),
});

type LoginT = z.input<typeof loginSchema>;

export const login = async ({ email, password }: LoginT) => {
  const { data, status } = await axiosClient.post('/auth/login', {
    email,
    password,
  });

  if (status !== 200) {
    return Promise.reject(data);
  }

  return data;
};

export const me = async (): Promise<User> => {
  const { data, status } = await axiosClient.get('/auth/me', {
    withCredentials: true,
  });

  if (status !== 200) {
    return Promise.reject(data);
  }

  return data as User;
};
