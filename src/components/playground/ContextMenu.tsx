import { useDirListing } from "@/lib/webcontainers/files/dir";
import { useRemoveNode } from "@/lib/webcontainers/files/writer";
import { isDirectoryNode, isFileNode } from "@/lib/webcontainers/util";
import { Dialog, Portal } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { FolderPlusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { DirectoryNode, FileNode } from "@webcontainer/api";
import { ButtonHTMLAttributes, useEffect, useRef, useState } from "react";
import { usePlaygroundEditor } from ".";
import { NewNode } from "./NewNodeDialogue";

type ContextMenuProps = {
  hide: () => void;
  top: number;
  left: number;
  node: DirectoryNode | FileNode;
  path?: string;
};

export default function ContextMenuWrapper({
  hide,
  ...props
}: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isDirectory = isDirectoryNode(props.node);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        hide();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [hide]);

  return (
    <Portal>
      <div className="fixed inset-0 bg-black opacity-0" />
      <div
        ref={ref}
        className="menu menu-compact absolute  flex min-w-[200px] flex-col overflow-hidden rounded bg-base-300 shadow-lg"
        data-testid="context-menu"
        style={{
          top: props.top,
          left: props.left,
        }}
      >
        <li className="menu-title p-2 font-mono text-sm text-base-content opacity-50">
          {props.path}
        </li>
        {isDirectory && (
          <CreateNew
            hide={hide}
            {...props}
            node={props.node as DirectoryNode}
          />
        )}
        {props.path !== "/" && <DeleteButton {...props} onDone={hide} />}
      </div>
    </Portal>
  );
}

function ContextMenuButton({
  children,
  disabledTip,
  ...props
}: {
  disabledTip?: string;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  if (props.disabled && disabledTip) {
    return (
      <div className="tooltip" data-tip={disabledTip}>
        <li className="opacity-50">
          <button {...props} data-testid="context-menu-button">
            {children}
          </button>
        </li>
      </div>
    );
  }

  return (
    <li className={props.disabled ? "opacity-50" : ""}>
      <button {...props}>{children}</button>
    </li>
  );
}

function CreateNew(
  props: Pick<ContextMenuProps, "hide" | "path"> & { node: DirectoryNode }
) {
  const [show, setShow] = useState(false);
  const { refetch: refetchDirListing } = useDirListing();

  const selectFile = usePlaygroundEditor((s) => s.setSelectedFile);

  return (
    <>
      {show && (
        <ContextMenuDialog
          title={
            <span className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              New File/Folder {props.path !== "/" && `in ${props.path}`}
            </span>
          }
          hide={props.hide}
        >
          <NewNode
            parent={props.path}
            tree={props.node.directory}
            onComplete={(path, type) => {
              props.hide();
              refetchDirListing();

              if (type === "file") {
                selectFile(path);
              }
            }}
          />
        </ContextMenuDialog>
      )}
      <ContextMenuButton onClick={() => setShow(true)}>
        <FolderPlusIcon className="h-5 w-5 text-info" />
        New File/Folder
      </ContextMenuButton>
    </>
  );
}

const NEVER_DELETE = ["package.json", "index.html", "asconfig.json"];
function DeleteButton({
  path,
  onDone,
  node,
}: {
  path?: string;
  onDone: () => void;
  node: DirectoryNode | FileNode;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isFile = isFileNode(node);

  const canDelete = path && !NEVER_DELETE.includes(path);
  return (
    <div className="flex flex-col gap-2">
      <ContextMenuButton
        onClick={() => setConfirmDelete(true)}
        disabledTip={canDelete ? undefined : "Cannot delete this file"}
        disabled={!canDelete}
      >
        <TrashIcon className="h-5 w-5 text-error" />
        Delete {isFile ? "File" : "Folder"}
      </ContextMenuButton>
      {confirmDelete && path && (
        <ConfirmDeleteDialgoue
          path={path}
          node={node}
          hide={() => {
            setConfirmDelete(false);
            onDone();
          }}
        />
      )}
    </div>
  );
}

function ConfirmDeleteDialgoue({
  path,
  node,
  hide,
}: {
  path: string;
  node: FileNode | DirectoryNode;
  hide: () => void;
}) {
  const { mutate } = useRemoveNode();

  return (
    <ContextMenuDialog
      hide={hide}
      title={`Delete ${path}?`}
      description={`Are you sure you want to delete this ${
        isFileNode(node) ? "file" : "folder"
      }?`}
    >
      <div className="my-2 flex w-full gap-2">
        <button
          onClick={() => {
            path && mutate(path);
            hide();
          }}
          className="btn btn-error flex-1 normal-case text-white"
        >
          Yes
        </button>
        <button onClick={hide} className="btn btn-accent flex-1 normal-case">
          No
        </button>
      </div>
    </ContextMenuDialog>
  );
}

function ContextMenuDialog({
  title,
  description,
  children,
  hide,
}: {
  title: React.ReactNode;
  description?: string;
  hide: () => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog className={`modal modal-open`} open={true} onClose={hide}>
      <Dialog.Panel className={`modal-box`}>
        <Dialog.Title as="h2" className="mb-2 text-2xl font-bold">
          {title}
        </Dialog.Title>
        {description && <Dialog.Description>{description}</Dialog.Description>}
        {children}
      </Dialog.Panel>
    </Dialog>
  );
}
