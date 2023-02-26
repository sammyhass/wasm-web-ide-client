import { filesystem } from '@/lib/webcontainers/files/defaults';
import { useFileReader } from '@/lib/webcontainers/files/reader';
import { Dialog } from '@headlessui/react';
import { LinkIcon } from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import { FileSystemTree } from '@webcontainer/api';
import { useCallback, useMemo, useState } from 'react';
import LoadingSpinner from '../icons/Spinner';
import { ToolbarButton } from '../ProjectEditor/Toolbar';
import { useToast } from '../Toast';
export default function LinkGeneratorWrapper() {
  const [show, setShow] = useState(false);

  return (
    <>
      <ToolbarButton
        onClick={() => setShow(true)}
        title="Link Generator"
        icon={<LinkIcon className="w-5 h-5" />}
      />
      {show && (
        <Dialog
          open={show}
          onClose={() => setShow(false)}
          className={`modal ${show ? 'modal-open' : ''}`}
        >
          <Dialog.Overlay />
          <Dialog.Panel className="modal-box break-words">
            <LinkGenerator />
          </Dialog.Panel>
        </Dialog>
      )}
    </>
  );
}

function LinkGenerator() {
  const { data: html } = useFileReader('index.html');
  const { data: css } = useFileReader('styles.css');
  const { data: js } = useFileReader('main.js');
  const { data: ts } = useFileReader('assemblyscript/index.ts');
  const { data: packageJson } = useFileReader('package.json');

  const show = useToast(s => s.show);

  const fileTree = useMemo(
    (): FileSystemTree => ({
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
    [html, js, css, packageJson, ts]
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
    <div className="relative">
      {isLoading && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-white bg-opacity-50">
          <div className="flex gap-2">
            <LoadingSpinner /> Generating Link...
          </div>
        </div>
      )}

      {data && (
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Generated Link</h1>
          <p className="text-sm text-gray-500">
            Click the link below to copy it to your clipboard.
          </p>
          <div className="relative">
            <textarea
              rows={4}
              className="w-full input-sm input input-bordered cursor-pointer hover:ring-2 hover:ring-blue-500 resize-none"
              aria-label="Generated Link"
              value={link}
              readOnly
              onClick={copyToClipboard}
            />
          </div>
        </div>
      )}
    </div>
  );
}
