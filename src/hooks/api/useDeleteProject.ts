import { deleteProject, ProjectT } from '@/lib/api/services/projects';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

export const useDeleteProjectMutation = (
  id: string,
  opts: UseMutationOptions
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteProject(id),
    ...opts,
    onSuccess: (...args) => {
      queryClient.removeQueries({
        queryKey: ['project', id],
      });

      queryClient.setQueryData<ProjectT[]>(['projects'], projects =>
        projects ? projects.filter(p => p.id !== id) : projects ?? []
      );

      opts.onSuccess?.(...args);
    },
  });
};
