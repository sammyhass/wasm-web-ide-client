import { getSharedProject, ProjectT } from '@/lib/api/services/projects';
import { useQuery } from '@tanstack/react-query';

export const useSharedProject = (code: string) => {
  return useQuery<ProjectT>(['sharedProject', code], () =>
    getSharedProject(code)
  );
};
