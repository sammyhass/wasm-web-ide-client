import { ApiErrorResponse } from '@/lib/api/axios';
import { login, loginSchema } from '@/lib/api/services/auth';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
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
    (username: string, password: string) => {
      const ok = loginSchema.safeParse({
        username,
        password,
      });

      if (ok.success) {
        _mutate({
          username,
          password,
        });
      } else {
        onError?.({
          error: ok.error.message,
          info: ok.error.errors.map(e => e.message),
        });
      }
    },
    [_mutate, onError]
  );

  return {
    mutate,
    isLoading,
  };
};
