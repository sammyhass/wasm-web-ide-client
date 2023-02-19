import { forkProject, ProjectT } from '@/lib/api/services/projects';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useForkProject = (id: string) => {
  const qc = useQueryClient();
  return useMutation<ProjectT>({
    mutationKey: ['project', id, 'fork'],
    mutationFn: () => forkProject(id),
    onSuccess: data => {
      qc.setQueryData<ProjectT>(['project', data.id], data);
      qc.invalidateQueries(['projects']);
    },
  });
};
