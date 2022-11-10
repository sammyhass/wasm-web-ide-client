import { ApiErrorResponse } from '@/lib/api/axios';
import { getProject } from '@/lib/api/services/projects';
import { useQuery } from '@tanstack/react-query';

export const useProject = (id?: string) => {
  const { data, error, status, refetch } = useQuery(
    ['project', id],
    () => {
      if (id) {
        return getProject(id);
      }
    },
    {
      enabled: !!id,
    }
  );

  return {
    refetch,
    data,
    error: error as ApiErrorResponse | undefined,
    status,
  };
};
