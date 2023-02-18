import { FileT } from '@/lib/api/services/projects';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import LanguageIcon from '../icons/Icon';

export default function FileTreeWrapper({
  files,
  selectFile,
  selectedFile,
}: {
  files?: string[];
  selectFile: (file: string) => void;
  selectedFile?: string;
}) {
  const [show, setShow] = useState(true);

  return show ? (
    <FileTree
      onClose={() => setShow(false)}
      fileNames={files}
      selectFile={selectFile}
      selectedFile={selectedFile}
    />
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

function FileTree({
  onClose,
  fileNames,
  selectFile,
  selectedFile,
}: {
  onClose: () => void;
  fileNames?: string[];
  selectFile: (file: string) => void;
  selectedFile?: string;
}) {
  return (
    <div
      className="flex flex-col text-sm relative min-w-fit"
      data-testid="file-tree"
    >
      <div className="flex items-center gap-2 pl-4 pr-2 h-12">
        <b className="flex-1">Project Files</b>
        <button onClick={onClose} title="Close">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {fileNames?.map(f => (
          <FileTreeItem
            onClick={() => selectFile(f)}
            selected={f === selectedFile}
            name={f}
            key={f}
            language={f.split('.').pop() as FileT['language']}
          />
        ))}
      </div>
    </div>
  );
}

const FileTreeItem = ({
  onClick,
  selected,
  ...file
}: Pick<FileT, 'name' | 'language'> & {
  onClick?: () => void;
  selected?: boolean;
}) => (
  <button
    data-testid={`file-tree-item-${file.language}`}
    className={`flex font-mono items-center gap-2 text-xs pl-4 pr-12 py-2 ${
      selected ? 'bg-neutral-focus' : ''
    }`}
    onClick={onClick}
  >
    <LanguageIcon language={file.language} />
    <span>{file.name}</span>
  </button>
);
