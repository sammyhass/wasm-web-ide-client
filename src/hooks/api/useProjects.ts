import { getProjects } from '@/lib/api/services/projects';
import { useQuery } from '@tanstack/react-query';

export const useProjects = () => {
  const { data, error, isLoading } = useQuery(['projects'], getProjects, {
    retry: false,
    retryOnMount: false,
  });

  return {
    data,
    error,
    isLoading,
  };
};
