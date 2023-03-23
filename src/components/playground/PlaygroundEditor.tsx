import { useWindowDimensions } from '@/hooks/util/useDimensions';
import { FileT } from '@/lib/api/services/projects';
import { useMonacoAssemblyScriptSetup } from '@/lib/monaco/assemblyscript';
import { useContainer, useSetup } from '@/lib/webcontainers';
import { useDirListing } from '@/lib/webcontainers/files/dir';
import { useFileReader } from '@/lib/webcontainers/files/reader';
import { useDebouncedWriter } from '@/lib/webcontainers/files/writer';
import { findNode, isFileNode } from '@/lib/webcontainers/util';
import { useMonaco } from '@monaco-editor/react';
import { FileSystemTree } from '@webcontainer/api';
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
import ContextMenu from './ContextMenu';
import FileSystemTreeViewer from './FileSystemTreeViewer';
import NewFileDialogueWrapper from './NewNodeDialogue';
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

  contextMenu?: string;
  showContextMenu: (path: string) => void;
  hideContextMenu: () => void;
}>(set => ({
  url: '',
  setUrl: url => set({ url }),

  selectedFile: '',
  setSelectedFile: (file: string) => set({ selectedFile: file }),

  contextMenu: undefined,
  showContextMenu: (path: string) => set({ contextMenu: path }),
  hideContextMenu: () => set({ contextMenu: undefined }),
}));

export default function PlaygroundEditor({ mount }: { mount: FileSystemTree }) {
  const previewRef = useRef<HTMLIFrameElement>(null);

  const url = usePlaygroundEditor(s => s.url);
  const setUrl = usePlaygroundEditor(s => s.setUrl);
  const selectedFile = usePlaygroundEditor(s => s.selectedFile);
  const setSelectedFile = usePlaygroundEditor(s => s.setSelectedFile);

  const showContextMenu = usePlaygroundEditor(s => s.showContextMenu);
  const contextMenuPath = usePlaygroundEditor(s => s.contextMenu);
  const hideContextMenu = usePlaygroundEditor(s => s.hideContextMenu);

  const { write, isLoading: writeLoading } = useDebouncedWriter(
    selectedFile,
    500
  );
  const { data: currentFileContent } = useFileReader(selectedFile);

  const pushMessage = useEditorConsole(s => s.push);

  const { mutate } = useSetup(c => pushMessage('log', c));

  const { isLoading: containerLoading } = useContainer({
    onSuccess: c => {
      const firstFile = findNode(mount, (path, node) => {
        if (isFileNode(node)) {
          return true;
        }
        return false;
      });

      if (firstFile) {
        setSelectedFile(firstFile.path);
      }

      mutate(mount);

      c?.on('server-ready', (port, url) => {
        setUrl(url);
      });
    },
  });

  const currentFileLanguage = useMemo<FileT['language']>(() => {
    const ext = selectedFile.split('.').pop();
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
      <ul className="menu max-w-fit menu-horizontal group">
        <NewFileDialogueWrapper
          onComplete={(path, type) => type === 'file' && setSelectedFile(path)}
        />
        <CompileButton />
        <SettingsButton />
      </ul>
      <div className="flex flex-col md:flex-row h-full">
        {' '}
        <FileSystemTreeViewer
          tree={tree ?? {}}
          onContextMenu={p => showContextMenu(p)}
          selectedPath={selectedFile}
          onSelect={path => {
            writeLoading ? undefined : setSelectedFile(path);
          }}
        />
        <div className="flex flex-col-reverse md:flex-row w-full mr-1">
          <ParentComponent>
            <div className="w-full relative h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 p-2">
                  <LanguageIcon language={currentFileLanguage} />
                  <b>{selectedFile}</b>
                </div>
                {writeLoading ||
                  (containerLoading && (
                    <div className="flex items-center gap-2 p-2">
                      Loading...
                      <LoadingSpinner />
                    </div>
                  ))}
              </div>

              <FileEditor
                content={currentFileContent || ''}
                language={currentFileLanguage}
                onChange={write}
                name={selectedFile}
                projectId={'playground'}
              />
              <ConsoleWindow />
            </div>
          </ParentComponent>
          <iframe
            title="Preview Window"
            ref={previewRef}
            className="w-full block h-full bg-white"
            src={url}
          />
        </div>
      </div>
      <PlaygroundSettings />
      {contextMenuPath && (
        <ContextMenu path={contextMenuPath} hide={hideContextMenu} />
      )}
    </>
  );
}
