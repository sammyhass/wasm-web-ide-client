import { useToast } from '@/components/Toast';
import { ApiErrorResponse, API_URL } from '@/lib/api/axios';
import { compileProject } from '@/lib/api/services/projects';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useMutation } from '@tanstack/react-query';
import { useEditor } from '..';
import { useEditorConsole } from '../ConsoleWindow';

export default function CompileToWasmButton() {
  const { show } = useToast();
  const setWasmPath = useEditor(s => s.setWasmPath);
  const pushToConsole = useEditorConsole(s => s.push);

  const project = useEditor(s => s.project);
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
      },
      onError: e => {
        show({
          type: 'error',
          message: 'Failed to compile your project. Check the error logs.',
          id: 'compile-error',
        });

        const errs = (e as ApiErrorResponse).info?.join(' ').split('\n');

        for (const err of errs ?? []) {
          console.error(err);
          pushToConsole('error', (err as string).trim());
        }

        pushToConsole('error', (e as ApiErrorResponse).info?.join(', ') ?? '');
      },
    }
  );

  return (
    <button
      className={`flex btn btn-circle  btn-success text-white ${
        isLoading ? 'loading' : ''
      }`}
      onClick={() => {
        project?.id && mutate(project?.id);
      }}
    >
      {!isLoading ? <PlayIcon className="w-5 h-5" /> : ''}
    </button>
  );
}
