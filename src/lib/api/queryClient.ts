import { QueryClient, QueryFunction } from '@tanstack/react-query';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const defaultApiQueryFn: QueryFunction = async ({ queryKey }) => {
  const res = await fetch(`${API_URL}${queryKey[0]}`);
  return res;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultApiQueryFn,
    },
  },
});
