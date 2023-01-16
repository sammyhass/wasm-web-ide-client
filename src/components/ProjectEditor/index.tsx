import { useEditor } from '@/hooks/useEditor';
import ConsoleWindow from './ConsoleWindow';
import EditorWindow from './EditorWindow';
import FileTreeWrapper from './FileTree';
import PreviewWindow from './PreviewWindow';
import ProjectSettings from './ProjectSettings';
import Toolbar from './Toolbar';

export default function ProjectEditor({ id }: { id: string }) {
  const { project, files } = useEditor();
  const filenames = files.map(f => f.name);
  const selectedFile = useEditor(s => s.selectedFile);
  const selectFile = useEditor(s => s.setSelectedFile);

  return project?.id === id ? (
    <div className="bg-base-200 w-full max-w-screen ">
      <Toolbar />
      <div className="flex flex-col-reverse md:flex-row">
        <div className="relative flex flex-1">
          <FileTreeWrapper
            fileNames={filenames}
            selectFile={selectFile}
            selectedFile={selectedFile}
          />
          <div className="w-full relative">
            <EditorWindow />
            <ConsoleWindow />
          </div>
        </div>
        <PreviewWindow />
      </div>
      <ProjectSettings />
    </div>
  ) : null;
}
