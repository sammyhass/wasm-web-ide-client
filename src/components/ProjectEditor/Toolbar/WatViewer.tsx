import { Dialog } from '@headlessui/react';
import { EyeIcon } from '@heroicons/react/20/solid';
import Editor from '@monaco-editor/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ToolbarButton } from '.';
import { useEditor } from '../../../hooks/useEditor';
import { getProjectWatUrl } from '../../../lib/api/services/projects';

export default function WatViewerWrapper() {
  const projectId = useEditor(s => s.projectId);
  const [show, setShow] = useState(false);

  return projectId ? (
    <>
      <ToolbarButton
        onClick={() => setShow(true)}
        icon={<EyeIcon className="w-5 h-5" />}
        title="View WAT"
      />

      <Dialog
        as="div"
        data-testid="wat-viewer"
        className={`modal ${show ? 'modal-open' : ''} `}
        onClose={() => setShow(false)}
        open={show}
      >
        <Dialog.Panel className={'modal-box max-w-4xl overflow-y-hidden'}>
          <Dialog.Title as="h1" className={'text-2xl font-bold'}>
            WAT Viewer
          </Dialog.Title>

          <hr className={'my-4'} />
          <WatViewer projectId={projectId} />
        </Dialog.Panel>
      </Dialog>
    </>
  ) : null;
}

function WatViewer({ projectId }: { projectId: string }) {
  const { data: url } = useQuery(['watUrl', projectId], () =>
    getProjectWatUrl(projectId)
  );

  const {
    data: wat,
    status,
    error,
  } = useQuery<string>(
    ['wat', projectId],
    () => fetch(url!).then(r => r.text()),
    { enabled: !!url, cacheTime: 0 }
  );

  return (
    <div className="min-h-[50vh]">
      {status === 'loading' && <div>Loading...</div>}
      {status === 'error' && <div>Error: {(error as Error).message}</div>}
      {status === 'success' && !!wat && (
        <Editor
          height="80vh"
          language="wat"
          value={wat}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
          }}
        />
      )}
    </div>
  );
}
