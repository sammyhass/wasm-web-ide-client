import { isDirectoryNode, isFileNode } from "@/lib/webcontainers/util";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { DirectoryNode, FileNode, FileSystemTree } from "@webcontainer/api";
import { MouseEvent, useState } from "react";

type FileSystemTreeViewerProps = {
  onSelect: (path: string) => void;
  selectedPath: string;
  tree: FileSystemTree;
  parentPath?: string;
  onContextMenu?: (
    path: string,
    node: DirectoryNode | FileNode,
    event: MouseEvent<HTMLElement>
  ) => void;
};

export default function FileSystemTreeWrapper({
  tree,
  selectedPath,
  onSelect,
  onContextMenu,
}: FileSystemTreeViewerProps) {
  const [show, setShow] = useState(true);
  return show ? (
    <div className="relative flex flex-col" data-testid="file-tree">
      <div className="flex h-12 items-center gap-2 pl-4 pr-2 ">
        <b className="flex-1">Files</b>
        <button onClick={() => setShow(false)} title="Close">
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
      </div>
      <FileSystemTreeViewer
        tree={tree}
        onContextMenu={onContextMenu}
        onSelect={onSelect}
        selectedPath={selectedPath}
      />
    </div>
  ) : (
    <button
      className="top-0 left-0 flex items-center gap-2 p-2 md:inline"
      onClick={() => setShow(true)}
      title="Open File Tree"
    >
      <b className="md:hidden">Show File Tree</b>
      <ArrowRightIcon className="h-5 w-5" />
    </button>
  );
}

function FileSystemTreeViewer({
  tree,
  selectedPath,
  onSelect,
  parentPath = "/",
  onContextMenu,
}: FileSystemTreeViewerProps) {
  const renderNode = (node: FileNode | DirectoryNode, path: string) => {
    if (isFileNode(node)) {
      return (
        <FileNodeViewer
          path={path}
          onSelect={onSelect}
          key={path}
          onContextMenu={(_, e) => onContextMenu?.(path, node, e)}
          isSelected={
            selectedPath ===
            `${parentPath === "/" ? "" : `${parentPath}/`}${path}`
          }
        />
      );
    } else if (isDirectoryNode(node)) {
      return (
        <DirectoryNodeViewer
          selectedPath={selectedPath}
          path={path}
          onContextMenu={onContextMenu}
          node={node}
          onSelect={onSelect}
          key={path}
        />
      );
    }
  };

  return (
    <ul
      className="flex h-full w-full list-none flex-col gap-2 px-2 font-mono text-sm md:w-[270px]"
      data-testid="file-tree-list"
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.("/", { directory: tree }, e);
      }}
    >
      {Object.entries(tree).map(([name, node]) => {
        return renderNode(node, name);
      })}
    </ul>
  );
}

function FileNodeViewer({
  path,
  onSelect,
  isSelected,
  onContextMenu,
}: {
  path: string;
  onSelect: (path: string) => void;
  onContextMenu?: (path: string, event: MouseEvent<HTMLButtonElement>) => void;
  isSelected: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center  gap-2 py-2 hover:bg-base-200 ${
        isSelected ? "bg-base-200" : ""
      }`}
      onClick={() => onSelect(path)}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu?.(path, e);
      }}
    >
      <DocumentIcon className="h-5 w-5" />
      <span>{path}</span>
    </button>
  );
}

export function DirectoryNodeViewer({
  path,
  node,
  onSelect,
  onContextMenu,
  selectedPath,
}: {
  path: string;
  node: DirectoryNode;
  onSelect: (path: string) => void;
  onContextMenu?: FileSystemTreeViewerProps["onContextMenu"];
  selectedPath: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <li className="flex flex-col gap-2" key={path}>
      <>
        <button
          className="flex w-full items-center gap-2 py-2 hover:bg-base-200"
          onClick={() => setShow(!show)}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onContextMenu?.(path, node, e);
          }}
        >
          <ArrowRightIcon
            className={`h-5 w-5 ${
              show ? "rotate-90" : ""
            } transition-transform`}
          />
          <b>{path}</b>
        </button>
        {show && (
          <FileSystemTreeViewer
            parentPath={path}
            onSelect={(p) => onSelect(`${path}/${p}`)}
            tree={node.directory}
            onContextMenu={(p, n, e) => onContextMenu?.(`${path}/${p}`, n, e)}
            selectedPath={selectedPath}
          />
        )}
      </>
    </li>
  );
}
