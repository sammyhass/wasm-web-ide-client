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

type RegisterInputT = z.input<typeof registerSchema>;

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

export const loginSchema = z.object({
  email: z.string().min(5).email(),
  password: z.string().min(8),
});

const loginResponseSchema = z.object({
  jwt: z.string(),
  user: userSchema,
});

export type UserT = z.output<typeof userSchema>;
export type LoginResponseT = z.output<typeof loginResponseSchema>;

export const register = async ({ email, password }: RegisterInputT) => {
  const { data, status } = await axiosClient.post('/auth/register', {
    email,
    password,
  });

  if (status !== 200) {
    return Promise.reject(data);
  }

  return loginResponseSchema.parse(data);
};

type LoginInputT = z.input<typeof loginSchema>;

export const login = async ({ email, password }: LoginInputT) => {
  const { data, status } = await axiosClient.post('/auth/login', {
    email,
    password,
  });

  if (status !== 200) {
    return Promise.reject(data);
  }

  return loginResponseSchema.parse(data);
};

export const me = async (): Promise<UserT> => {
  const { data, status } = await axiosClient.get('/auth/me', {
    withCredentials: true,
  });

  if (status !== 200) {
    return Promise.reject(data);
  }

  return userSchema.parse(data);
};
