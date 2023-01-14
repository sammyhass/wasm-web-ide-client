import { ApiErrorResponse } from '@/lib/api/axios';
import { login, loginSchema } from '@/lib/api/services/auth';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { z } from 'zod';
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
      return _mutate(data);
    },
    [_mutate]
  );

  return {
    mutate,
    isLoading,
  };
};
