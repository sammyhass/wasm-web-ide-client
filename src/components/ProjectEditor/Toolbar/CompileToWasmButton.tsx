import { useToast } from '@/components/Toast';
import { useProject } from '@/hooks/api/useProject';
import { useEditor } from '@/hooks/useEditor';
import { ApiErrorResponse } from '@/lib/api/axios';
import { compileProject, ProjectT } from '@/lib/api/services/projects';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ToolbarButton } from '.';
import { useEditorConsole } from '../ConsoleWindow';

export default function CompileToWasmButton() {
  const { show } = useToast();
  const pushToConsole = useEditorConsole(s => s.push);

  const dirty = useEditor(s => s.dirty);
  const projectId = useEditor(s => s.projectId);

  const { data } = useProject(projectId);
  const language = data?.language;

  const qc = useQueryClient();

  const { mutate: _mutate, isLoading } = useMutation(
    ['compileProject', projectId],
    compileProject,
    {
      onSuccess: path => {
        qc.removeQueries(['wat', projectId]);
        qc.removeQueries(['watUrl', projectId]);
        qc.setQueryData<ProjectT>(
          ['project', projectId],
          prev =>
            prev && {
              ...prev,
              wasm_path: path,
            }
        );

        show({
          type: 'success',
          message:
            'Your project has been compiled successfully, it will be run in the preview window.',
          id: 'compile-success',
        });

        pushToConsole(
          'info',
          `[${language}]: Your project has been compiled successfully.`
        );
      },
      onError: e => {
        show({
          type: 'error',
          message: 'Failed to compile your project. Check the error logs.',
          id: 'compile-error',
        });

        const errs = (e as ApiErrorResponse).info?.join(' ').split('\n');
        for (const err of errs ?? []) {
          pushToConsole('error', `[${language}] ${(err as string).trim()}`);
        }

        console.error(errs);
      },
    }
  );

  const mutate = useCallback(() => {
    if (!projectId) return;

    if (dirty) {
      show({
        type: 'error',
        message: 'Please save your project before compiling.',
        id: 'compile-error',
      });
      pushToConsole('error', `[GO] Please save your project before compiling.`);
      return;
    }

    _mutate(projectId);
  }, [projectId, dirty, _mutate, show, pushToConsole]);

  return (
    <ToolbarButton
      onClick={mutate}
      loading={isLoading}
      title="Compile to WebAssembly"
      icon={<PlayCircleIcon className="w-5 h-5 text-success" />}
    />
  );
}
