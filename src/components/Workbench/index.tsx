import { DEFAULT_FILES } from '@/components/Workbench/defaults';
import Tabs from '@/components/Workbench/Tabs';
import Toolbar from '@/components/Workbench/Toolbar';
import Editor from '@monaco-editor/react';
import { Suspense } from 'react';
import create from 'zustand';
import PreviewWindow from './PreviewWindow';

export type FileT = {
  name: string;
  language: string;
  value: string;
  type: 'file';
};

export type WorkbenchState = {
  files: FileT[];
  currentFileName: string;
  setCurrentFile: (name: string) => void;

  onCurrentFileChange: (value: string) => void;

  save: () => void;
  lastSaved: FileT[];
};

export const useWorkbench = create<WorkbenchState>(set => ({
  files: Object.values(DEFAULT_FILES) as FileT[],
  currentFileIdx: 0,
  setCurrentFile: name => set({ currentFileName: name }),
  currentFileName: DEFAULT_FILES.go.name,
  onCurrentFileChange: value => {
    set(state => {
      const files = state.files.map(f => {
        if (f.name === state.currentFileName) {
          return { ...f, value };
        }
        return f;
      });
      return { files };
    });
  },
  save: () => {
    set(state => ({
      lastSaved: state.files,
    }));
  },
  lastSaved: Object.values(DEFAULT_FILES) as FileT[],
}));

function Workbench() {
  const {
    files,
    currentFileName,
    onCurrentFileChange: onFileChange,
  } = useWorkbench();

  const file = files.find(f => f.name === currentFileName) || files[0];

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-80vh">
          <div className="text-2xl">Loading...</div>
        </div>
      }
    >
      <div className="bg-base-200 flex flex-col gap-1">
        <Toolbar />
        <Tabs />
      </div>
      <div className="flex h-full">
        <div className="flex-1 max-w-2xl">
          <Editor
            language={file?.language}
            options={{
              minimap: { enabled: false },
            }}
            defaultValue={file?.value}
            onChange={value => onFileChange(value || '')}
            path={file?.name}
            theme="vs-dark"
            height={'80vh'}
          />
        </div>
        <PreviewWindow />
      </div>
    </Suspense>
  );
}
export default Workbench;
