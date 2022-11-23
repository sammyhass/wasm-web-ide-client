import { FileT, ProjectT } from '@/lib/api/services/projects';
import WasmTinyScript from '@/lib/wasm/WasmTinyScript';
import { useEffect } from 'react';
import create from 'zustand';
import shallow from 'zustand/shallow';
import EditorWindow from './EditorWindow';
import PreviewWindow from './PreviewWindow';
import ProjectSettings from './ProjectSettings';
import Tabs from './Tabs';
import Toolbar from './Toolbar';

const langSort: Record<FileT['language'], number> = {
  html: 0,
  js: 1,
  go: 2,
  css: 3,
};
type ProjectEditorState = {
  files: FileT[];
  selectedFile: string | undefined;

  setSelectedFile: (id: string) => void;
  onCurrentFileChange: (value: string) => void;
  setFiles: (files: FileT[]) => void;

  initProject: (project: ProjectT) => void;
  clear: () => void;

  setProject: (project: ProjectT | null) => void;
  project: Omit<ProjectT, 'files'> | null;

  showSettings: boolean;
  setShowSettings: (show: boolean) => void;

  lastSaved: FileT[];
  setLastSaved: (files: FileT[]) => void;
};

export const useEditor = create<ProjectEditorState>((set, get) => ({
  setProject: project => set({ ...project }),
  files: [],
  project: null,
  setFiles: files => set({ files }),
  lastSaved: [],
  setLastSaved: files => set({ lastSaved: files }),
  selectedFile: undefined,
  setShowSettings: showSettings => set({ showSettings }),
  showSettings: false,
  setSelectedFile: name => set({ selectedFile: name }),
  initProject: (project: ProjectT) => {
    const { files, ...rest } = project;
    const sortedFiles = files?.sort(
      (a, b) => langSort[a.language] - langSort[b.language]
    );
    set({
      project: rest,
      files: sortedFiles,
      lastSaved: sortedFiles,
      selectedFile: !get().selectedFile
        ? files?.[0]?.name ?? undefined
        : get().selectedFile,
    });
  },
  clear: () => set({ files: [], selectedFile: undefined }),
  onCurrentFileChange: value => {
    set(state => {
      const files = state.files.map(f => {
        if (f.name === state.selectedFile) {
          return { ...f, content: value };
        }
        return f;
      });
      return { files };
    });
  },
}));

function ProjectEditor() {
  return (
    <div className="bg-base-200">
      <Toolbar />
      <hr className="my-2" />
      <Tabs />
      <div className="flex">
        <div className="flex-1">
          <EditorWindow />
        </div>
        <PreviewWindow />
      </div>
      <ProjectSettings />
    </div>
  );
}

export default function ProjectsEditorWrapper(props: ProjectT) {
  const { initProject } = useEditor(
    s => ({
      initProject: s.initProject,
      clear: s.clear,
    }),
    shallow
  );

  useEffect(() => {
    if (!props.files || !props) return;
    initProject(props);
  }, [initProject, props]);

  return (
    <>
      <ProjectEditor />
      <WasmTinyScript />
    </>
  );
}
