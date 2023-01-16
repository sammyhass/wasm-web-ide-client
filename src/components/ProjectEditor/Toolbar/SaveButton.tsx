import { useToast } from '@/components/Toast';
import { useEditor } from '@/hooks/useEditor';
import { ApiErrorResponse } from '@/lib/api/axios';
import { ProjectT, saveProjectFiles } from '@/lib/api/services/projects';
import { FolderIcon } from '@heroicons/react/24/solid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ToolbarButton } from '.';

export function SaveButton() {
  const project = useEditor(s => s.project);
  const files = useEditor(s => s.files);

  const { show } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation<
    ProjectT['files'],
    ApiErrorResponse,
    { id: string; files: NonNullable<ProjectT['files']> }
  >(['saveProjectFiles'], saveProjectFiles, {
    onSuccess: d => {
      queryClient.setQueryData<ProjectT>(
        ['project', project?.id],
        projectData => {
          return projectData ? { ...projectData, files: d } : undefined;
        }
      );
      show({
        id: 'project-save-success',
        message: 'Project saved successfully',
        type: 'success',
      });
    },
    onError: d => {
      show({
        id: 'project-save-error',
        message: 'There was a problem saving your project',
        type: 'error',
      });
    },
  });

  const onClick = useCallback(() => {
    if (project) {
      mutate({
        id: project.id,
        files,
      });
    }
  }, [files, mutate, project]);

  return (
    <ToolbarButton
      title={isLoading ? 'Saving...' : 'Save'}
      onClick={onClick}
      disabled={isLoading}
      icon={<FolderIcon className="w-5 h-5" />}
    />
  );
}
