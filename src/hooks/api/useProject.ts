import { useMe } from '@/hooks/useMe';
import { getProject, ProjectT } from '@/lib/api/services/projects';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useProject = (
  id?: string,
  opts: UseQueryOptions<ProjectT> = {}
) => {
  const me = useMe(s => s.jwt);

  return useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id as string),
    enabled: !!id && !!me,
    ...opts,
  });
};
