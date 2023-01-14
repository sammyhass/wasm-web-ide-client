import { ApiErrorResponse } from '@/lib/api/axios';
import {
  LoginResponseT,
  register,
  registerSchema,
} from '@/lib/api/services/auth';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { z, ZodError } from 'zod';

export type UseLoginRegisterParams = {
  onSuccess?: (data: LoginResponseT) => void | Promise<void>;
  onError?: (error: ApiErrorResponse | ZodError) => void | Promise<void>;
};

export const useRegister = ({
  onSuccess,
  onError,
}: UseLoginRegisterParams = {}) => {
  const { mutate: _mutate, isLoading } = useMutation(
    ['auth/register'],
    register,
    {
      onSuccess: d => {
        onSuccess?.(d);
      },
      onError: e => {
        onError?.(e as ApiErrorResponse);
      },
    }
  );

  const mutate = useCallback(
    (data: z.input<typeof registerSchema>) => {
      try {
        registerSchema.parse(data);
      } catch (e) {
        e instanceof ZodError ? onError?.(e) : null;
        return;
      }
      _mutate(data);
    },
    [_mutate, onError]
  );

  return {
    mutate,
    isLoading,
  };
};
