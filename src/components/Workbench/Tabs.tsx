import LanguageIcon from '@/components/icons/Icon';
import { FileT, useWorkbench } from '.';
export default function Tabs() {
  const { currentFileName, files, setCurrentFile } = useWorkbench();
  return (
    <>
      <div className="tabs tabs-boxed p-2 items-center">
        {files.map((f, i) => (
          <Tab
            key={i}
            {...f}
            active={f.name === currentFileName}
            onClick={() => setCurrentFile(f.name)}
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
      className={`tab ${active ? 'tab-active' : ''} gap-2`}
      onClick={onClick}
    >
      <LanguageIcon language={file.language} />
      {file.name}
    </button>
  );
}
