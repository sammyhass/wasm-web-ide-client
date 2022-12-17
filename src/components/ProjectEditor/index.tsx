import ConsoleWindow from './ConsoleWindow';
import EditorWindow from './EditorWindow';
import FileTreeWrapper from './FileTree';
import PreviewWindow from './PreviewWindow';
import ProjectSettings from './ProjectSettings';
import Toolbar from './Toolbar';

export default function ProjectEditor() {
  return (
    <div className="bg-base-200 w-full max-w-screen ">
      <Toolbar />
      <div className="flex flex-col-reverse md:flex-row">
        <div className="relative flex flex-1">
          <FileTreeWrapper />
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
