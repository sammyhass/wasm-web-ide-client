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

  // Uneditable Files
  wasm: 'txt',
  mod: 'txt',
};

export default function EditorWindow() {
  const { onCurrentFileChange: onFileChange, selectedFile } = useEditor();

  const files = useEditor(
    state => state.files,
    (a, b) => JSON.stringify(a) === JSON.stringify(b)
  );
  const currentFile = files.find(f => f.name === selectedFile);

  return (
    <div className="w-full">
      {currentFile && (
        <b className="font-mono flex gap-2 p-2 text-sm">
          <LanguageIcon language={currentFile?.language} className="w-5 h-5" />
          {selectedFile}
        </b>
      )}

      <FileEditor
        content={currentFile?.content}
        onChange={onFileChange}
        language={currentFile?.language}
      />
    </div>
  );
}

function FileEditor({
  content,
  onChange,
  language,
}: {
  language?: FileT['language'];
  content?: string;
  onChange: (value: string) => void;
}) {
  return (
    <MonacoEditor
      value={content}
      options={{
        minimap: { enabled: true },
      }}
      height={'80vh'}
      width={'100%'}
      language={monacoLanguages?.[language ?? 'html']}
      theme="vs-dark"
      onChange={v => {
        onChange(v || '');
      }}
    />
  );
}
