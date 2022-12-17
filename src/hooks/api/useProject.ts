import { ApiErrorResponse } from '@/lib/api/axios';
import { getProject, ProjectT } from '@/lib/api/services/projects';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useProject = (
  id?: string,
  opts: UseQueryOptions<ProjectT> = {}
) => {
  const { data, error, status, refetch } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id as string),
    enabled: !!id,
    ...opts,
  });

  return {
    refetch,
    data,
    error: error as ApiErrorResponse | undefined,
    status,
  };
};
