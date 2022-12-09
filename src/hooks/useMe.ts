import { me } from '@/lib/api/services/auth';
import { useQuery } from '@tanstack/react-query';
import create from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  email: string;
};

export type ApiUserResponse = {
  jwt: string;
  user: User;
};

export type ApiUserResponseOnDone = (
  data: ApiUserResponse
) => void | Promise<void>;

export const useMe = create<{
  user: User | null;
  jwt: string | null;
  setUser: (user: User | null) => void;
  setJwt: (jwt: string | null) => void;
}>()(
  persist(
    set => ({
      user: null,
      jwt: null,
      setJwt: jwt => set({ jwt }),
      setUser: user => set({ user }),
    }),
    {
      name: 'me',
    }
  )
);

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
    onError: error => {
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
