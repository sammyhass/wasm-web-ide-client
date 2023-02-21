import { isDirectoryNode, isFileNode } from '@/lib/webcontainers/util';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { DirectoryNode, FileNode, FileSystemTree } from '@webcontainer/api';
import { useState } from 'react';

export default function FileSystemTreeWrapper({
  tree,
  onSelect,
}: {
  onSelect: (path: string) => void;
  tree: FileSystemTree;
}) {
  const [show, setShow] = useState(true);
  return show ? (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 pl-4 pr-2 h-12">
        <b className="flex-1">Files</b>
        <button onClick={() => setShow(false)} title="Close">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
      </div>
      <FileSystemTreeViewer tree={tree} onSelect={onSelect} />
    </div>
  ) : (
    <button
      className="top-0 left-0 p-2 flex items-center gap-2 md:inline"
      onClick={() => setShow(true)}
      title="Open File Tree"
    >
      <b className="md:hidden">Show File Tree</b>
      <ArrowRightIcon className="w-5 h-5" />
    </button>
  );
}

function FileSystemTreeViewer({
  tree,
  onSelect,
}: {
  onSelect: (path: string) => void;
  tree: FileSystemTree;
}) {
  const renderNode = (node: FileNode | DirectoryNode, path: string) => {
    if (isFileNode(node)) {
      return <FileNodeViewer path={path} onSelect={onSelect} key={path} />;
    } else if (isDirectoryNode(node)) {
      return (
        <DirectoryNodeViewer
          path={path}
          node={node}
          onSelect={onSelect}
          key={path}
        />
      );
    }
  };

  return (
    <ul className="font-mono list-none px-2 text-sm gap-2 flex flex-col h-full min-w-[250px]">
      {Object.entries(tree).map(([name, node]) => {
        return renderNode(node, name);
      })}
    </ul>
  );
}

function FileNodeViewer({
  path,
  onSelect,
}: {
  path: string;
  onSelect: (path: string) => void;
}) {
  return (
    <button
      className="flex items-center p-1  gap-2 hover:bg-base-200 w-full"
      onClick={() => onSelect(path)}
    >
      <span>{path}</span>
    </button>
  );
}

function DirectoryNodeViewer({
  path,
  node,
  onSelect,
}: {
  path: string;
  node: DirectoryNode;
  onSelect: (path: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <li className="flex flex-col gap-2">
      <>
        <button
          className="flex items-center gap-2"
          onClick={() => setShow(!show)}
        >
          <ArrowRightIcon
            className={`w-5 h-5 ${
              show ? 'rotate-90' : ''
            } transition-transform`}
          />
          <b>{path}</b>
        </button>
        {show && (
          <FileSystemTreeViewer
            onSelect={p => onSelect(`${path}/${p}`)}
            tree={node.directory}
          />
        )}
      </>
    </li>
  );
}
