import { BookOpenIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { ToolbarButton } from '../ProjectEditor/Toolbar';
import SettingsButton from '../ProjectEditor/Toolbar/SettingsButton';
import NewNodeWrapper from './NewNodeDialogue';
import CompileButton from './PlaygroundCompileButton';
import { usePlaygroundEditor } from './PlaygroundEditor';

export function PlaygroundToolbar() {
  const setSelectedFile = usePlaygroundEditor(s => s.setSelectedFile);

  return (
    <ul className="menu max-w-fit menu-horizontal group" data-testid="toolbar">
      <NewNodeWrapper
        onComplete={(path, type) => type === 'file' && setSelectedFile(path)}
      />
      <CompileButton />
      <SettingsButton />
      <Link
        href="/playground/examples"
        target={'_blank'}
        rel="noopener noreferrer"
      >
        <ToolbarButton
          onClick={() => void 0}
          title="Examples"
          icon={<BookOpenIcon className="w-5 h-5 text-amber-400" />}
        />
      </Link>
    </ul>
  );
}
