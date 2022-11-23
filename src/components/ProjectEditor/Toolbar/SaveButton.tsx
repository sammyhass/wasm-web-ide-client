import { useToast } from '@/components/Toast';
import { ApiErrorResponse } from '@/lib/api/axios';
import { ProjectT, saveProjectFiles } from '@/lib/api/services/projects';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import shallow from 'zustand/shallow';
import { ToolbarButton } from '.';
import { useEditor } from '..';

export function SaveButton() {
  const project = useEditor(s => s.project);
  const files = useEditor(s => s.files);
  const { lastSaved, setLastSaved } = useEditor(
    s => ({
      lastSaved: s.lastSaved,
      setLastSaved: s.setLastSaved,
    }),
    shallow
  );

  const { show } = useToast();

  const { mutate, isLoading } = useMutation<
    ProjectT['files'],
    ApiErrorResponse,
    { id: string; files: NonNullable<ProjectT['files']> }
  >(['saveProjectFiles'], saveProjectFiles, {
    onSuccess: d => {
      show({
        id: 'project-save-success',
        message: 'Project saved successfully',
        type: 'success',
      });
      setLastSaved(d ?? []);
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
      onClick={onClick}
      title="Save and Preview Project"
      loading={isLoading}
      icon={<PlayIcon className="h-5 w-5" />}
    />
  );
}
