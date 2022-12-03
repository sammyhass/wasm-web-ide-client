import { FileT } from '@/lib/api/services/projects';
import shallow from 'zustand/shallow';
import { useEditor } from '.';
import LanguageIcon from '../icons/Icon';

export default function FileTree() {
  const { files, selectedFile, setSelectedFile } = useEditor(
    s => ({
      selectedFile: s.selectedFile,
      files: s.files,
      setSelectedFile: s.setSelectedFile,
    }),
    shallow
  );
  return (
    <div className="flex flex-col gap-2 text-sm">
      <b className="pl-4 font-mono p-2">Project Files</b>
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
    <LanguageIcon language={file.language} className="w-4 h-4" />
    <span>{file.name}</span>
  </button>
);
