import { FileT, ProjectT } from '@/lib/api/services/projects';
import create from 'zustand';

const langSort: Record<FileT['language'], number> = {
  html: 0,
  js: 1,
  css: 2,
  go: 3,
  wasm: 5,
};

type ProjectEditorState = {
  dirty: boolean;
  setDirty: (dirty: boolean) => void;

  files: FileT[];
  selectedFile: string | undefined;

  setSelectedFile: (id: string) => void;
  onCurrentFileChange: (value: string) => void;

  setFiles: (files: FileT[]) => void;

  initProject: (project: ProjectT) => void;
  clear: () => void;

  projectId: string | undefined;

  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
};

export const useEditor = create<ProjectEditorState>((set, get) => ({
  dirty: false,
  setDirty: dirty => set({ dirty }),
  files: [],
  projectId: undefined,
  setFiles: files => set({ files }),
  selectedFile: undefined,
  setShowSettings: showSettings => set({ showSettings }),
  showSettings: false,

  setSelectedFile: name => set({ selectedFile: name }),
  initProject: project => {
    const { files, id } = project;
    const sortedFiles = files
      ?.sort((a, b) => langSort[a.language] - langSort[b.language])
      .map(f => ({ ...f, content: f.content ?? '' }));

    set({
      projectId: id,
      files: sortedFiles,
      showSettings: false,
      selectedFile: !get().selectedFile
        ? files?.[0]?.name ?? undefined
        : get().selectedFile,
    });
  },
  clear: () =>
    set({
      files: [],
      showSettings: false,
      selectedFile: undefined,
      projectId: undefined,
    }),
  onCurrentFileChange: value => {
    set(state => {
      let didChangeFile = false;
      const files = state.files.map(f => {
        if (f.name === state.selectedFile) {
          didChangeFile = f.content !== value;
          return { ...f, content: value };
        }
        return f;
      });

      return { files, dirty: didChangeFile ? true : state.dirty };
    });
  },
}));
