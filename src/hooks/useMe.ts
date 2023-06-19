import { me } from "@/lib/api/services/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import create from "zustand";
import { persist } from "zustand/middleware";

export const useMe = create<{
  jwt: string | null;
  setJwt: (jwt: string | null) => void;
}>()(
  persist(
    (set) => ({
      jwt: null,
      setJwt: (jwt) => set({ jwt }),
    }),
    {
      name: "me",
    }
  )
);

export const useLogoutMutation = () => {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation(["logout"], () => {
    useMe.setState({ jwt: null });
    qc.resetQueries(["me"]);
    qc.clear();
    return Promise.resolve();
  });
};

export const useMeQuery = (enabled = true) => {
  const jwt = useMe((s) => s.jwt);
  const { mutate: _logout } = useLogoutMutation();
  const { data, error, isLoading, refetch } = useQuery(["me"], me, {
    cacheTime: 60,
    enabled: enabled && !!jwt,
    retryOnMount: false,
    retry: false,
    onError: _logout,
  });

  return {
    refetch,
    data,
    error,
    isLoading,
  };
};
