import { me, UserT } from '@/lib/api/services/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useMe = create<{
  jwt: string | null;
  setJwt: (jwt: string | null) => void;
  user: UserT | null;
  setUser: (user: UserT | null) => void;
}>()(
  persist(
    set => ({
      jwt: null,
      setJwt: jwt => set({ jwt }),
      user: null,
      setUser: user => set({ user }),
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
  const { data, error, isLoading, refetch } = useQuery(['me'], me, {
    cacheTime: 60,
    enabled,
    retryOnMount: false,
    retry: false,
    onSuccess: user => {
      if (user) {
        useMe.setState({ user });
      } else {
        useMe.setState({ user: null, jwt: null });
      }
    },
    onError: () => {
      useMe.setState({ user: null, jwt: null });
    },
  });

  return {
    refetch,
    data,
    error,
    isLoading,
  };
};
