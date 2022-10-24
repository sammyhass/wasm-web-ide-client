import { ApiErrorResponse } from '@/lib/api/axios';
import { register, registerSchema } from '@/lib/api/services/auth';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ZodError } from 'zod';
import { ApiUserResponse } from '../useMe';

export type UseLoginRegisterParams = {
  onSuccess?: (data: ApiUserResponse) => void | Promise<void>;
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
    (username: string, password: string, confirmPassword: string) => {
      const ok = registerSchema.safeParse({
        username,
        password,
        confirmPassword,
      });

      if (ok.success) {
        _mutate({
          username,
          password,
        });
      } else {
        onError?.(ok.error);
      }
    },
    [_mutate, onError]
  );

  return {
    mutate,
    isLoading,
  };
};
