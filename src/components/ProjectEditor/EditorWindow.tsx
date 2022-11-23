import { FileT } from '@/lib/api/services/projects';
import MonacoEditor from '@monaco-editor/react';
import { useEditor } from '.';

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
  );
}
