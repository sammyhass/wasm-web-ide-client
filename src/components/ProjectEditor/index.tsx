import { useEditor } from '@/hooks/useEditor';
import { ProjectT } from '@/lib/api/services/projects';
import { useRef } from 'react';
import ConsoleWindow from './ConsoleWindow';
import EditorWindow from './EditorWindow';
import FileTree from './FileTree';
import PreviewWindow from './PreviewWindow';
import ProjectSettings from './ProjectSettings';
import Toolbar from './Toolbar';

export default function ProjectEditorWrapper(project: ProjectT) {
  const hasInitialisedProject = useRef(false);
  const initProject = useEditor(s => s.initProject);

  if (!hasInitialisedProject.current) {
    initProject(project);
    hasInitialisedProject.current = true;
  }

  if (hasInitialisedProject) {
    return <ProjectEditor />;
  }

  return null;
}

function ProjectEditor() {
  const { files, selectedFile, setSelectedFile } = useEditor();
  const filenames = files.map(f => f.name);

  return (
    <div className="bg-base-200 w-full max-w-screen ">
      <Toolbar />
      <div className="flex flex-col-reverse md:flex-row">
        <div className="relative flex flex-1">
          <FileTree
            files={filenames}
            selectFile={setSelectedFile}
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
  );
}
