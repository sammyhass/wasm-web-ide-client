import { FileT, ProjectT } from '@/lib/api/services/projects';
import WasmTinyScript from '@/lib/wasm/WasmTinyScript';
import { useEffect } from 'react';
import create from 'zustand';
import shallow from 'zustand/shallow';
import Toolbar from '../Workbench/Toolbar';
import EditorWindow from './EditorWindow';
import Tabs from './Tabs';

const langSort: Record<FileT['language'], number> = {
  html: 0,
  js: 1,
  go: 2,
  css: 3,
  wasm: 4,
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
};

export const useEditor = create<ProjectEditorState>(set => ({
  setProject: project => set({ ...project }),
  files: [],
  project: null,
  setFiles: files => set({ files }),
  selectedFile: undefined,
  setSelectedFile: name => set({ selectedFile: name }),
  initProject: (project: ProjectT) => {
    const { files, ...rest } = project;
    set({
      project: rest,
      files: files?.sort((a, b) => langSort[a.language] - langSort[b.language]),
      selectedFile: files?.[0]?.name ?? undefined,
    });
  },
  clear: () => set({ files: [], selectedFile: undefined }),
  onCurrentFileChange: value => {
    set(state => {
      const files = state.files.map(f => {
        if (f.name === state.selectedFile) {
          return { ...f, value };
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
      <EditorWindow />
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
