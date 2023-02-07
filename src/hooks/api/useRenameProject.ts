import { useToast } from '@/components/Toast';
import { ProjectT, renameProject } from '@/lib/api/services/projects';
import { Project } from '@playwright/test';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useRenameProjectMutation = (id: string) => {
  const show = useToast(s => s.show);
  const qc = useQueryClient();
  const m = useMutation<Project, unknown, { name: string }>({
    mutationFn: ({ name }) =>
      renameProject({
        id,
        name,
      }),
    onSuccess: project => {
      qc.setQueryData(['project', id], p =>
        p
          ? {
              ...p,
              name: project.name,
            }
          : p
      );

      qc.setQueryData<ProjectT[]>(['projects'], projects =>
        projects
          ? projects.map(p => {
              if (p.id === id) {
                return {
                  ...p,
                  name: project.name ?? p.name,
                };
              }

              return p;
            })
          : projects ?? []
      );

      show({
        id: `project-renamed-${id}`,
        message: `Project renamed to "${project.name}"`,
        type: 'success',
      });
    },
  });

  return m;
};
