import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      cacheTime: 0,
    },
    queries: {
      refetchOnReconnect: false,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});
