import { FileT } from '@/lib/api/services/projects';
import { useEditor } from '.';
import LanguageIcon from '../icons/Icon';

export default function Tabs() {
  const { selectedFile, files, setSelectedFile } = useEditor();
  return (
    <>
      <div className="flex px-2 items-center gap-1">
        {files.map((f, i) => (
          <Tab
            key={i}
            {...f}
            active={f.name === selectedFile}
            onClick={() => setSelectedFile(f.name)}
          />
        ))}
      </div>
    </>
  );
}

type TabProps = FileT & {
  active: boolean;
  onClick: () => void;
};

function Tab({ active, onClick, ...file }: TabProps) {
  return (
    <button
      key={file.name}
      className={`btn  max-w-fit hover:btn-primary border-b-2 border-base-content font-normal normal-case rounded-lg flex items-center  ${
        active ? 'btn-primary border-b-primary-focus' : ''
      } gap-2 border-0 !rounded-b-none font-mono no-animation`}
      onClick={onClick}
    >
      <LanguageIcon language={file.language} className="w-6 h-6" />
      {file.name}
    </button>
  );
}
