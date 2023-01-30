import { useToast } from '@/components/Toast';
import { useEditor } from '@/hooks/useEditor';
import { ApiErrorResponse } from '@/lib/api/axios';
import { ProjectT, saveProjectFiles } from '@/lib/api/services/projects';
import { FolderIcon } from '@heroicons/react/24/solid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ToolbarButton } from '.';

export function SaveButton() {
  const projectId = useEditor(s => s.projectId);
  const files = useEditor(s => s.files);
  const setDirty = useEditor(s => s.setDirty);

  const { show } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation<
    ProjectT['files'],
    ApiErrorResponse,
    { id: string; files: NonNullable<ProjectT['files']> }
  >(['saveProjectFiles'], saveProjectFiles, {
    onSuccess: d => {
      setDirty(false);
      queryClient.setQueryData<ProjectT>(
        ['project', projectId],
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
    onError: () => {
      show({
        id: 'project-save-error',
        message: 'There was a problem saving your project',
        type: 'error',
      });
    },
  });

  const onClick = useCallback(() => {
    if (projectId) {
      mutate({
        id: projectId,
        files,
      });
    }
  }, [files, mutate, projectId]);

  return (
    <ToolbarButton
      title={isLoading ? 'Saving...' : 'Save'}
      onClick={onClick}
      disabled={isLoading}
      icon={<FolderIcon className="w-5 h-5" />}
    />
  );
}
