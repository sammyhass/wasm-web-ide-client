import { useRemoveNode } from '@/lib/webcontainers/files/writer';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';

export default function ContextMenuWrapper({
  path,
  hide,
}: {
  path?: string;
  hide: () => void;
}) {
  return (
    <Dialog
      open={!!path}
      onClose={hide}
      className={`modal ${path ? 'modal-open' : ''}`}
    >
      <Dialog.Panel className="modal-box">
        <Dialog.Title className="text-2xl font-bold mb-2 font-mono">
          {path}
        </Dialog.Title>
        <ContextMenu path={path} hide={hide} />
      </Dialog.Panel>
    </Dialog>
  );
}

const NEVER_DELETE = ['package.json', 'index.html', 'asconfig.json'];
function ContextMenu({ path, hide }: { path?: string; hide: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { mutate } = useRemoveNode();

  const canDelete = path && !NEVER_DELETE.includes(path);

  return (
    <div className="flex flex-col gap-2">
      {canDelete ? (
        <button
          onClick={() => {
            setConfirmDelete(true);
          }}
          disabled={confirmDelete}
          className="btn btn-error w-full"
        >
          Delete
        </button>
      ) : (
        <div className="tooltip" data-tip="This file cannot be deleted">
          <button className="btn btn-error w-full" disabled>
            Delete
          </button>
        </div>
      )}
      {confirmDelete && (
        <div className="flex flex-col">
          <p>Are you sure you want to delete this {}?</p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                path && mutate(path);
                hide();
              }}
              className="btn btn-error flex-1"
            >
              Yes
            </button>
            <button
              onClick={() => {
                setConfirmDelete(false);
              }}
              className="btn btn-primary flex-1"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
