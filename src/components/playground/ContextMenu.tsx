import { useRemoveNode } from '@/lib/webcontainers/files/writer';
import { isDirectoryNode, isFileNode } from '@/lib/webcontainers/util';
import { Dialog } from '@headlessui/react';
import { DirectoryNode, FileNode } from '@webcontainer/api';
import { useState } from 'react';
import { NewNode } from './NewNodeDialogue';
import { usePlaygroundEditor } from './PlaygroundEditor';

type ContextMenuProps = {
  hide: () => void;

  node: DirectoryNode | FileNode;
  path?: string;
};

export default function ContextMenuWrapper(props: ContextMenuProps) {
  return (
    <Dialog
      open={!!props.path}
      onClose={props.hide}
      className={`modal ${props.path ? 'modal-open' : ''}`}
    >
      <Dialog.Panel className="modal-box">
        <Dialog.Title className="text-2xl font-bold mb-2 font-mono">
          {props.path}
        </Dialog.Title>

        <div className="flex flex-col gap-2">
          {isDirectoryNode(props.node) && (
            <>
              <CreateNew {...props} node={props.node} />
              <hr className="my-2" />
            </>
          )}
          <DeleteButton {...props} />
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

function CreateNew(
  props: Pick<ContextMenuProps, 'hide' | 'path'> & { node: DirectoryNode }
) {
  const [show, setShow] = useState(false);

  const selectFile = usePlaygroundEditor(s => s.setSelectedFile);

  return (
    <>
      {show && (
        <>
          <h2 className="text-lg font-bold">
            Create New File/Folder in {props.path}
          </h2>
          <NewNode
            parent={props.path}
            tree={props.node.directory}
            onComplete={(path, type) => {
              setShow(false);
              props.hide();

              if (type === 'file') {
                selectFile(path);
              }
            }}
          />
        </>
      )}
      <button
        onClick={() => setShow(s => !s)}
        className="btn btn-accent w-full normal-case"
      >
        {show ? 'Cancel' : `Create New File/Folder in ${props.path}`}
      </button>
    </>
  );
}

const NEVER_DELETE = ['package.json', 'index.html', 'asconfig.json'];
function DeleteButton({
  path,
  node,
  hide,
}: {
  path?: string;
  node: DirectoryNode | FileNode;
  hide: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { mutate } = useRemoveNode();

  const isFile = isFileNode(node);

  const canDelete = path && !NEVER_DELETE.includes(path);
  return (
    <div className="flex flex-col gap-2">
      {canDelete ? (
        <button
          onClick={() => {
            setConfirmDelete(true);
          }}
          disabled={confirmDelete}
          className="btn btn-error w-full normal-case"
        >
          Delete
        </button>
      ) : (
        <div className="tooltip" data-tip="This file cannot be deleted">
          <button className="btn btn-error w-full normal-case" disabled>
            Delete
          </button>
        </div>
      )}
      {confirmDelete && (
        <div className="flex flex-col my-2 gap-2">
          <p>
            Are you sure you want to delete this {isFile ? 'file' : 'folder'}?
          </p>
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
