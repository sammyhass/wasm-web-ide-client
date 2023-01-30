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
      className="top-0 left-0 p-2"
      onClick={() => setShow(true)}
      title="Open File Tree"
    >
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
    <div className="flex flex-col gap-2 text-sm relative min-w-fit">
      <b className="pl-4 p-2">Project Files</b>
      <button
        className="absolute top-0 right-0 p-2"
        onClick={onClose}
        title="Close"
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </button>
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
    className={`flex font-mono items-center gap-2 text-xs pl-4 pr-12 py-2 ${
      selected ? 'bg-neutral-focus' : ''
    }`}
    onClick={onClick}
  >
    <LanguageIcon language={file.language} />
    <span>{file.name}</span>
  </button>
);
