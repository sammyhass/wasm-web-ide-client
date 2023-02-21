import { useWindowDimensions } from '@/hooks/util/useDimensions';
import { FileT } from '@/lib/api/services/projects';
import { useMonacoAssemblyScriptSetup } from '@/lib/monaco/assemblyscript';
import { useContainer, useSetupContainer } from '@/lib/webcontainers';
import { filesystem } from '@/lib/webcontainers/files/defaults';
import { useDirListing } from '@/lib/webcontainers/files/dir';
import { useFileReader } from '@/lib/webcontainers/files/reader';
import { useDebouncedWriter } from '@/lib/webcontainers/files/writer';
import { useMonaco } from '@monaco-editor/react';
import dynamic from 'next/dynamic';
import { Fragment, useMemo, useRef } from 'react';
import create from 'zustand';
import LanguageIcon from '../icons/Icon';
import LoadingSpinner from '../icons/Spinner';
import { ResizableWindow } from '../ProjectEditor';
import ConsoleWindow, {
  useEditorConsole,
} from '../ProjectEditor/ConsoleWindow';
import SettingsButton from '../ProjectEditor/Toolbar/SettingsButton';
import DownloadButton from './DownloadButton';
import FileSystemTreeViewer from './FileSystemTreeViewer';
import CompileButton from './PlaygroundCompileButton';
import { PlaygroundSettings } from './PlaygroundSettings';

const FileEditor = dynamic(
  () => import('../ProjectEditor/EditorWindow').then(m => m.FileEditor),
  {
    ssr: false,
  }
);

const usePlaygroundEditor = create<{
  url: string;
  setUrl: (url: string) => void;

  selectedFile: string;
  setSelectedFile: (file: string) => void;
}>(set => ({
  url: '',
  setUrl: url => set({ url }),

  selectedFile: 'index.html',
  setSelectedFile: (file: string) => set({ selectedFile: file }),
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { lib: _, ...files } = filesystem;

export default function PlaygroundEditor() {
  const previewRef = useRef<HTMLIFrameElement>(null);

  const url = usePlaygroundEditor(s => s.url);
  const setUrl = usePlaygroundEditor(s => s.setUrl);
  const selectedFile = usePlaygroundEditor(s => s.selectedFile);
  const setSelectedFile = usePlaygroundEditor(s => s.setSelectedFile);

  const { write, isLoading } = useDebouncedWriter(selectedFile, 500);
  const { data: currentFileContent } = useFileReader(selectedFile);

  const pushMessage = useEditorConsole(s => s.push);
  const clearConsole = useEditorConsole(s => s.clear);

  const { mutate: setupContainer } = useSetupContainer(undefined, chunk => {
    pushMessage('log', chunk);
  });

  useContainer({
    onSuccess: c => {
      clearConsole();
      setupContainer();
      c?.on('server-ready', (port, url) => {
        setUrl(url);
      });
    },
  });

  const currentFileLanguage = useMemo<FileT['language']>(() => {
    const ext = selectedFile.split('.').pop();
    console.log(ext as FileT['language']);
    return ext as FileT['language'];
  }, [selectedFile]);

  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const ParentComponent = useMemo(() => {
    if (isMobile) return Fragment;
    return ResizableWindow;
  }, [isMobile]);

  const monaco = useMonaco();

  useMonacoAssemblyScriptSetup(monaco ?? undefined);

  const { data: tree } = useDirListing();
  return (
    <>
      <ul className="menu max-w-fit menu-horizontal">
        <CompileButton />
        <DownloadButton />
        <SettingsButton />
      </ul>
      <div className="flex flex-col md:flex-row h-full">
        {' '}
        <FileSystemTreeViewer
          tree={tree ?? {}}
          selectedPath={selectedFile}
          onSelect={path => {
            isLoading ? undefined : setSelectedFile(path);
          }}
        />
        <div className="flex flex-col-reverse md:flex-row w-full overflow-hidden mr-1">
          <ParentComponent>
            <div className="w-full relative h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 p-2">
                  <LanguageIcon language={currentFileLanguage} />
                  <b>{selectedFile}</b>
                </div>
                {isLoading && (
                  <div className="flex items-center gap-2 p-2">
                    Loading...
                    <LoadingSpinner />
                  </div>
                )}
              </div>

              <FileEditor
                content={currentFileContent || ''}
                language={currentFileLanguage}
                onChange={v =>
                  v.trim() === currentFileContent?.trim() ? undefined : write(v)
                }
                name={selectedFile}
                projectId={'playground'}
              />
              <ConsoleWindow />
            </div>
          </ParentComponent>
          <iframe
            ref={previewRef}
            className="w-full block h-full bg-white"
            src={url}
          />
        </div>
      </div>
      <PlaygroundSettings />
    </>
  );
}
