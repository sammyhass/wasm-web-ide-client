import { editor } from "monaco-editor";
import create from "zustand";
import { persist } from "zustand/middleware";

type EditorOptions = Pick<editor.IEditorOptions, "fontSize" | "wordWrap"> & {
  theme: string;
  minimapEnabled: boolean;
};

type EditorSettingsStore = EditorOptions & {
  setTheme: (theme: string) => void;
  setFontSize: (fontSize: EditorOptions["fontSize"]) => void;
  setWordWrap: (wordWrap: EditorOptions["wordWrap"]) => void;
  setMinimap: (enabled: boolean) => void;
  reset: () => void;
};
const defaults: EditorOptions = {
  fontSize: 12,
  theme: "vs-dark",
  wordWrap: "on",
  minimapEnabled: false,
};

export const useEditorSettings = create<EditorSettingsStore>()(
  persist(
    (set) => ({
      setFontSize: (fontSize) => set({ fontSize }),
      setTheme: (theme) => set({ theme }),
      setWordWrap: (wordWrap) => set({ wordWrap }),
      setMinimap: (minimapEnabled) => set({ minimapEnabled }),
      reset: () => set(defaults),
      ...defaults,
    }),
    {
      name: "editor-settings",
    }
  )
);
