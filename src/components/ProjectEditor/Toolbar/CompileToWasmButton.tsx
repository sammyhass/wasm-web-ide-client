import { useToast } from '@/components/Toast';
import { useEditor } from '@/hooks/useEditor';
import { ApiErrorResponse, API_URL } from '@/lib/api/axios';
import { compileProject } from '@/lib/api/services/projects';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useMutation } from '@tanstack/react-query';
import { useEditorConsole } from '../ConsoleWindow';

export default function CompileToWasmButton() {
  const { show } = useToast();
  const setWasmPath = useEditor(s => s.setWasmPath);
  const pushToConsole = useEditorConsole(s => s.push);

  const projectId = useEditor(s => s.projectId);
  const { mutate, isLoading } = useMutation(
    ['compileProject'],
    compileProject,
    {
      onSuccess: path => {
        setWasmPath(API_URL + path);
        show({
          type: 'success',
          message:
            'Your project has been compiled successfully, it will be run in the preview window.',
          id: 'compile-success',
        });

        pushToConsole(
          'info',
          `[GO] Your project has been compiled successfully.`
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
          pushToConsole('error', `[GO] ${(err as string).trim()}`);
        }

        console.error(errs);
      },
    }
  );

  return (
    <button
      className={`flex btn btn-circle  btn-success text-white ${
        isLoading ? 'loading' : ''
      }`}
      onClick={() => {
        projectId && mutate(projectId);
      }}
    >
      {!isLoading ? <PlayIcon className="w-5 h-5" /> : ''}
    </button>
  );
}
