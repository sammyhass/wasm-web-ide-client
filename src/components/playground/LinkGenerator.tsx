import { getDirListing } from '@/lib/webcontainers/files/dir';
import { useQuery } from '@tanstack/react-query';
import { FileSystemTree } from '@webcontainer/api';
import { useCallback, useMemo } from 'react';
import LoadingSpinner from '../icons/Spinner';
import { useToast } from '../Toast';

export default function LinkGenerator() {
  const show = useToast(s => s.show);

  const { data, isLoading } = useQuery(
    ['playground-link'],
    async () => {
      if (!window.webcontainer) return;

      const tree = await getDirListing(window.webcontainer, '/', {}, true);

      const res = await fetch('/api/link', {
        method: 'POST',
        body: JSON.stringify({
          ...tree,
          out: {
            directory: {
              'module.js': {
                file: {
                  contents: '',
                },
              },
            },
          },
        } as FileSystemTree),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await res.json();

      return json as { code: string };
    },
    {
      cacheTime: 0,
      staleTime: 0,
      onSuccess: () => {
        show({
          id: 'playground-link-success',
          message: 'Playground link generated!',
          type: 'success',
        });
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
            className="relative break-words bg-base-300 p-3 rounded-md hover:underline text-xs"
            onClick={copyToClipboard}
          >
            <code>{link}</code>
          </button>
        </div>
      )}
    </div>
  );
}
