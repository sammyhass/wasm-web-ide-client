import { useEditor } from "@/hooks/useEditor";
import { useEditorSettings } from "@/hooks/useEditorSettings";
import { FileT } from "@/lib/api/services/projects";
import { MonacoSetupProvider } from "@/lib/monaco/assemblyscript";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import LanguageIcon from "../icons/Icon";

const monacoLanguages: Record<FileT["language"], string> = {
  // Code Languages
  html: "html",
  go: "go",
  js: "javascript",
  css: "css",
  ts: "typescript",
  wasm: "txt",
  json: "json",
  wat: "txt",
  jsx: "javascript",
  tsx: "typescript",
};

export default function EditorWindow() {
  const projectId = useEditor((s) => s.projectId);
  const projectLanguage = useEditor((s) => s.projectLanguage);
  const onCurrentFileChange = useEditor((s) => s.onCurrentFileChange);
  const selectedFile = useEditor((s) => s.selectedFile);

  const monaco = useMonaco();

  const files = useEditor(
    (state) => state.files,
    (a, b) => JSON.stringify(a) === JSON.stringify(b)
  );

  const currentFile = files?.find((f) => f.name === selectedFile);

  return (
    <div className="w-full border-r" data-testid="editor-window">
      {currentFile && (
        <>
          <b className="flex items-center gap-2 p-2 font-mono text-sm">
            <LanguageIcon
              language={currentFile?.language}
              className="h-8 w-8"
            />
            <span data-testid="selected-file">{selectedFile}</span>
          </b>
          <FileEditor
            projectId={projectId}
            content={currentFile?.content}
            name={currentFile?.name}
            onChange={onCurrentFileChange}
            language={currentFile?.language}
          />
        </>
      )}
      <MonacoSetupProvider
        monaco={monaco ?? undefined}
        language={projectLanguage}
      />
    </div>
  );
}

export function FileEditor({
  content,
  projectId,
  onChange,
  name,
  language,
}: FileT & {
  onChange: (value: string) => void;
  projectId: string;
}) {
  const fontSize = useEditorSettings((s) => s.fontSize);
  const theme = useEditorSettings((s) => s.theme);
  const wordWrap = useEditorSettings((s) => s.wordWrap);
  const minimapEnabled = useEditorSettings((s) => s.minimapEnabled);

  return (
    <MonacoEditor
      wrapperProps={{ "data-testid": "file-editor" }}
      value={content}
      options={{
        minimap: { enabled: minimapEnabled },
        wordWrap: wordWrap ?? "on",
        fontSize: fontSize ?? 16,
      }}
      height={"80vh"}
      path={`/${projectId}/${name}`}
      width={"100%"}
      language={monacoLanguages?.[language ?? "html"]}
      theme={theme}
      onChange={(v) => {
        onChange(v || "");
      }}
    />
  );
}
