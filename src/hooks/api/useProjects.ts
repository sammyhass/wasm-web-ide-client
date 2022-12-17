import { getProjects } from '@/lib/api/services/projects';
import { useQuery } from '@tanstack/react-query';

export const useProjects = (enabled = true) => {
  const { data, error, isLoading, refetch } = useQuery(
    ['projects'],
    getProjects,
    {
      retry: false,
      retryOnMount: false,
      enabled,
    }
  );

  return {
    data,
    error,
    refetch,
    isLoading,
  };
};
