import { filesystem } from '@/lib/webcontainers/files/defaults';
import { useFileReader } from '@/lib/webcontainers/files/reader';
import { useQuery } from '@tanstack/react-query';
import { FileSystemTree } from '@webcontainer/api';
import { useCallback, useMemo } from 'react';
import LoadingSpinner from '../icons/Spinner';
import { useToast } from '../Toast';

export default function LinkGenerator() {
  const { data: html } = useFileReader('index.html');
  const { data: css } = useFileReader('styles.css');
  const { data: js } = useFileReader('main.js');
  const { data: ts } = useFileReader('assemblyscript/index.ts');
  const { data: asConfig } = useFileReader('asconfig.json');
  const { data: packageJson } = useFileReader('package.json');

  const show = useToast(s => s.show);

  const fileTree = useMemo(
    (): FileSystemTree => ({
      'asconfig.json': {
        file: {
          contents: asConfig || '',
        },
      },
      'index.html': {
        file: {
          contents: html || '',
        },
      },
      'main.js': {
        file: {
          contents: js || '',
        },
      },
      'styles.css': {
        file: {
          contents: css || '',
        },
      },
      'package.json': {
        file: {
          contents: packageJson || '',
        },
      },
      assemblyscript: {
        directory: {
          'index.ts': {
            file: {
              contents: ts || '',
            },
          },
        },
      },
    }),
    [asConfig, html, js, css, packageJson, ts]
  );

  const { data, isLoading } = useQuery(
    ['playground-link', fileTree],
    async () => {
      const res = await fetch('/api/link', {
        method: 'POST',
        body: JSON.stringify(fileTree),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await res.json();

      return json as { code: string };
    },
    {
      onSuccess: () => {
        console.log(Object.assign(filesystem, fileTree));
      },
    }
  );

  const link = useMemo(
    () => `${window.location.origin}/playground?code=${data?.code}`,
    [data]
  );

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(link);
    show({
      id: 'link-copied',
      message: 'Playground link copied to clipboard!',
      type: 'success',
    });
  }, [link, show]);

  return (
    <div className="relative min-h-16">
      {isLoading && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full">
          <div className="flex gap-2">
            <LoadingSpinner /> Generating Link...
          </div>
        </div>
      )}

      {data && (
        <div className="flex flex-col gap-2 overflow-hidden max-w-full">
          <p className="text-sm text-gray-500">
            Click the link below to copy it to your clipboard.
          </p>
          <button
            className="relative break-words text-left hover:underline text-xs"
            onClick={copyToClipboard}
          >
            <code>{link}</code>
          </button>
        </div>
      )}
    </div>
  );
}
