import { useDirListing } from "@/lib/webcontainers/files/dir";
import {
  useCreateFile,
  useCreateFolder,
} from "@/lib/webcontainers/files/writer";
import {
  isFileNode,
  nodeExists,
  visitFileTree,
} from "@/lib/webcontainers/util";
import { Dialog } from "@headlessui/react";
import {
  DocumentIcon,
  FolderIcon,
  FolderPlusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { FileSystemTree } from "@webcontainer/api";
import { useCallback, useMemo, useState } from "react";
import { ToolbarButton } from "../ProjectEditor/Toolbar";
import { Alert } from "../Toast";

const NodeTypes = ["file", "folder"] as const;
export default function NewFileDialogueWrapper({
  onComplete,
}: {
  onComplete?: (path: string, type: typeof NodeTypes[number]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  const { data: dirListing, refetch } = useDirListing();

  const onDone = (path: string, type: typeof NodeTypes[number]) => {
    refetch();
    onComplete?.(path, type);
    onClose();
  };

  return (
    <>
      <ToolbarButton
        icon={<FolderPlusIcon className="h-5 w-5 text-info" />}
        title="New"
        onClick={() => setIsOpen(true)}
      />
      <Dialog
        className={`modal ${isOpen ? "modal-open" : ""}`}
        open={isOpen}
        onClose={onClose}
      >
        <Dialog.Panel className={"modal-box"}>
          <Dialog.Title className="mb-2 flex items-center gap-2 text-2xl font-bold">
            <PlusIcon className="h-5 w-5" />
            New File/Folder
          </Dialog.Title>
          <NewNode onComplete={onDone} parent="/" tree={dirListing} />
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

function FolderView({
  onClick,
  path,
  selectedPath,
}: {
  onClick: (path: string) => void;
  path: string;
  selectedPath: string;
}) {
  return (
    <button
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1 ${
        selectedPath === path ? "bg-base-300" : "hover:bg-base-300"
      }`}
      type="button"
      onClick={() => onClick(path)}
    >
      <FolderIcon className="h-5 w-5" />
      {path}
    </button>
  );
}

function FoldersView({
  tree,
  selectDir,
  selectedDir,
}: {
  tree: FileSystemTree;
  selectDir: (path: string) => void;
  selectedDir: string;
}) {
  const folders = useMemo(() => {
    const folders: string[] = [];
    visitFileTree(tree, (path, node) => {
      if (!isFileNode(node)) {
        folders.push(path);
      }
    });
    return folders;
  }, [tree]);

  return (
    <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
      {["/", ...folders].map((path, i) => (
        <FolderView
          key={i}
          path={path}
          onClick={selectDir}
          selectedPath={selectedDir}
        />
      ))}
    </div>
  );
}

export function NewNode({
  onComplete,
  tree,
  parent,
}: {
  onComplete?: (path: string, type: typeof NodeTypes[number]) => void;
  tree?: FileSystemTree;
  parent?: string;
}) {
  const [selectedDirectory, setSelectedDirectory] = useState<string>("/");
  const [pathName, setPathname] = useState<string | null>(null);
  const [type, setType] = useState<typeof NodeTypes[number]>(NodeTypes[0]);

  const { mutate: createFile } = useCreateFile();
  const { mutate: createFolder } = useCreateFolder();

  const [err, setErr] = useState<string | null>(null);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!pathName || !tree) return;

      const path = `${parent && parent !== "/" ? `${parent}/` : ""}${
        selectedDirectory === "/" ? "" : `${selectedDirectory}/`
      }${pathName}`;

      if (nodeExists(tree, path)) {
        setErr(`${path} already exists`);
        return;
      }

      if (type === "folder") {
        createFolder(path, {
          onSuccess: () => {
            setPathname(null);
            onComplete?.(path, "folder");
          },
          onError: (e) => setErr((e as Error).message),
        });
      } else {
        createFile(path, {
          onSuccess: () => {
            setPathname(null);
            onComplete?.(path, "file");
          },

          onError: (e) => setErr((e as Error).message),
        });
      }
    },
    [
      pathName,
      tree,
      parent,
      selectedDirectory,
      type,
      createFolder,
      onComplete,
      createFile,
    ]
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          {NodeTypes.map((label, i) => (
            <div className="form-control" key={i}>
              <label className="label flex cursor-pointer items-center justify-start gap-2">
                <input
                  type="radio"
                  name="node-type"
                  className="radio radio-lg checked:border-info checked:bg-info"
                  checked={type === label.toLowerCase()}
                  onChange={() => setType(label)}
                />
                {label === "file" ? (
                  <DocumentIcon className="h-5 w-5" />
                ) : (
                  <FolderIcon className="h-5 w-5" />
                )}
                <span className="label-text">{`${label[0]?.toUpperCase()}${label.slice(
                  1
                )}`}</span>
              </label>
            </div>
          ))}
        </div>
        <input
          className="input input-bordered font-mono"
          type="text"
          placeholder={`e.g. ${type === "file" ? "index.html" : "styles"}`}
          value={pathName ?? ""}
          onChange={(e) => setPathname(e.target.value)}
        />

        <hr className="my-2" />

        {tree && (
          <>
            <b className="text-sm">
              Select a Destination {parent && parent !== "/" && `in ${parent}`}
            </b>
            <FoldersView
              tree={tree}
              selectDir={setSelectedDirectory}
              selectedDir={selectedDirectory}
            />
          </>
        )}

        <button
          className="btn btn-primary mt-2 w-full normal-case"
          type="submit"
        >
          Create
        </button>
        {err && (
          <Alert
            id="create-node-error"
            message={err}
            type="error"
            onHide={() => setErr(null)}
          />
        )}
      </div>
    </form>
  );
}
