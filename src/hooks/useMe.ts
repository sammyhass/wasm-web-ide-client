import { me } from '@/lib/api/services/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useMe = create<{
  jwt: string | null;
  setJwt: (jwt: string | null) => void;
}>()(
  persist(
    set => ({
      jwt: null,
      setJwt: jwt => set({ jwt }),
    }),
    {
      name: 'me',
    }
  )
);

export const useLogoutMutation = () => {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation(
    ['logout'],
    () => {
      useMe.setState({ jwt: null });
      qc.setQueryData(['me'], null);
      return Promise.resolve();
    },
    {
      onSuccess: () => {
        router.push('/login');
      },
    }
  );
};

export const useMeQuery = (enabled = true) => {
  const qc = useQueryClient();
  const { data, error, isLoading, refetch } = useQuery(['me'], me, {
    refetchOnWindowFocus: true,
    enabled,
    retryOnMount: false,
    retry: false,
    onSuccess: user => {
      if (!user) {
        useMe.setState({ jwt: null });
        qc.setQueryData(['me'], null);
      }
    },
    onError: () => {
      useMe.setState({ jwt: null });
      qc.setQueryData(['me'], null);
    },
  });

  return {
    refetch,
    data,
    error,
    isLoading,
  };
};
