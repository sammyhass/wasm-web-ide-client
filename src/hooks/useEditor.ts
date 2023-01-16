import { FileT, ProjectT } from '@/lib/api/services/projects';
import create from 'zustand';

const langSort: Record<FileT['language'], number> = {
  html: 0,
  js: 1,
  css: 2,
  go: 3,
};
type ProjectWithoutFiles = Omit<ProjectT, 'files'>;
type ProjectEditorState = {
  wasmPath?: string;
  setWasmPath: (path: string) => void;

  files: FileT[];
  selectedFile: string | undefined;

  setSelectedFile: (id: string) => void;
  onCurrentFileChange: (value: string) => void;
  setFiles: (files: FileT[]) => void;

  initProject: (project: ProjectT) => void;
  clear: () => void;

  setProject: (project: ProjectWithoutFiles | null) => void;
  project: ProjectWithoutFiles | null;

  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
};

export const useEditor = create<ProjectEditorState>((set, get) => ({
  wasmPath: undefined,
  setWasmPath: (path: string) => set({ wasmPath: path }),
  setProject: project => {
    set({
      project,
    });
  },
  files: [],
  project: null,
  setFiles: files => set({ files }),
  selectedFile: undefined,
  setShowSettings: showSettings => set({ showSettings }),
  showSettings: false,

  setSelectedFile: name => set({ selectedFile: name }),
  initProject: project => {
    const { files, ...rest } = project;
    const sortedFiles = files
      ?.sort((a, b) => langSort[a.language] - langSort[b.language])
      .map(f => ({ ...f, content: f.content ?? '' }));
    console.log(
      `initialising project ${project.name} with ${sortedFiles?.length} files`
    );

    set(s => ({
      wasmPath: undefined,
      project: rest,
      files: sortedFiles,
      lastSaved: sortedFiles,
      showSettings: false,
      selectedFile: !get().selectedFile
        ? files?.[0]?.name ?? undefined
        : get().selectedFile,
    }));

    console.log(get().files);
  },
  clear: () =>
    set(s => ({
      files: [],
      showSettings: false,
      selectedFile: undefined,
      project: null,
      lastSaved: [],
      wasmPath: undefined,
    })),
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
