import { FileT } from '@/lib/api/services/projects';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import shallow from 'zustand/shallow';
import { useEditor } from '.';
import LanguageIcon from '../icons/Icon';

export default function FileTreeWrapper() {
  const [show, setShow] = useState(true);

  return show ? (
    <FileTree onClose={() => setShow(false)} />
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

function FileTree({ onClose }: { onClose: () => void }) {
  const { files, selectedFile, setSelectedFile } = useEditor(
    s => ({
      selectedFile: s.selectedFile,
      files: s.files,
      setSelectedFile: s.setSelectedFile,
    }),
    shallow
  );
  return (
    <div className="flex flex-col gap-2 text-sm relative min-w-fit">
      <b className="pl-4 font-mono p-2">Project Files</b>
      <button
        className="absolute top-0 right-0 p-2"
        onClick={onClose}
        title="Close"
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </button>
      {files.map(f => (
        <FileTreeItem
          {...f}
          key={`${f.name}${f.content}`}
          onClick={() => setSelectedFile(f.name)}
          selected={selectedFile === f.name}
        />
      ))}
    </div>
  );
}

const FileTreeItem = ({
  onClick,
  selected,
  ...file
}: FileT & {
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
