import { FileT } from '@/lib/api/services/projects';
import MonacoEditor from '@monaco-editor/react';
import { useEditor } from '.';
import LanguageIcon from '../icons/Icon';

const monacoLanguages: Record<FileT['language'], string> = {
  html: 'html',
  go: 'go',
  js: 'javascript',
  css: 'css',
};

export default function EditorWindow() {
  const {
    onCurrentFileChange: onFileChange,
    selectedFile,
    files,
  } = useEditor();

  const currentFile = files.find(f => f.name === selectedFile);

  return (
    <div className="w-full flex flex-col gap-2">
      {currentFile && (
        <b className="font-mono flex gap-2 p-2 text-sm">
          <LanguageIcon language={currentFile?.language} className="w-5 h-5" />
          {selectedFile}
        </b>
      )}
      <MonacoEditor
        height={'80vh'}
        defaultLanguage={monacoLanguages?.[currentFile?.language ?? 'html']}
        defaultValue={currentFile?.content}
        options={{
          minimap: { enabled: false },
        }}
        onChange={value => onFileChange(value || '')}
        path={currentFile?.name}
        theme="vs-dark"
      />
    </div>
  );
}
