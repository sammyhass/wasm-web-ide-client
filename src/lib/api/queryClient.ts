import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});
