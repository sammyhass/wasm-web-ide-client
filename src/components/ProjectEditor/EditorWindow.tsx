import MonacoEditor from '@monaco-editor/react';
import { useEditor } from '.';
import { FileT } from '../Workbench';

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
      defaultLanguage={
        monacoLanguages?.[currentFile?.language ?? ''] ?? 'plaintext'
      }
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
