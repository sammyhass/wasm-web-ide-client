import { ApiErrorResponse } from '@/lib/api/axios';
import { login, loginSchema } from '@/lib/api/services/auth';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { z, ZodError } from 'zod';
import { UseLoginRegisterParams } from './useRegister';

export const useLogin = ({ onSuccess, onError }: UseLoginRegisterParams) => {
  const { mutate: _mutate, isLoading } = useMutation(['auth/login'], login, {
    onError: e => {
      onError?.(e as ApiErrorResponse);
    },
    onSuccess: d => {
      onSuccess?.(d);
    },
  });

  const mutate = useCallback(
    (data: z.input<typeof loginSchema>) => {
      let parsed: z.output<typeof loginSchema>;
      try {
        parsed = loginSchema.parse(data);
      } catch (e) {
        e instanceof ZodError ? onError?.(e) : null;
        return;
      }
      _mutate(parsed);
    },
    [_mutate, onError]
  );

  return {
    mutate,
    isLoading,
  };
};
