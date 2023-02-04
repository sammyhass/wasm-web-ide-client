import { useEditor } from '@/hooks/useEditor';
import { FileT } from '@/lib/api/services/projects';
import MonacoEditor from '@monaco-editor/react';
import LanguageIcon from '../icons/Icon';

const monacoLanguages: Record<FileT['language'], string> = {
  // Code Languages
  html: 'html',
  go: 'go',
  js: 'javascript',
  css: 'css',

  wasm: 'txt',
};

export default function EditorWindow() {
  const projectId = useEditor(s => s.projectId);
  const onCurrentFileChange = useEditor(s => s.onCurrentFileChange);
  const selectedFile = useEditor(s => s.selectedFile);

  const files = useEditor(
    state => state.files,
    (a, b) => JSON.stringify(a) === JSON.stringify(b)
  );
  const currentFile = files.find(f => f.name === selectedFile);

  return (
    <div className="w-full" data-testid="editor-window">
      {currentFile && (
        <>
          <b className="font-mono flex gap-2 p-2 text-sm">
            <LanguageIcon
              language={currentFile?.language}
              className="w-5 h-5"
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
    </div>
  );
}

function FileEditor({
  content,
  projectId,
  onChange,
  name,
  language,
}: FileT & {
  onChange: (value: string) => void;
  projectId: string;
}) {
  return (
    <MonacoEditor
      value={content}
      options={{
        minimap: { enabled: true },
      }}
      height={'80vh'}
      path={`/${projectId}/${name}`}
      width={'100%'}
      language={monacoLanguages?.[language ?? 'html']}
      theme="vs-dark"
      onChange={v => {
        onChange(v || '');
      }}
    />
  );
}
