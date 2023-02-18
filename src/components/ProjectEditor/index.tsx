import { useEditor } from '@/hooks/useEditor';
import { useWindowDimensions } from '@/hooks/util/useDimensions';
import { ProjectT } from '@/lib/api/services/projects';
import { Resizable } from 're-resizable';
import { Fragment, PropsWithChildren, useMemo, useRef } from 'react';
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

function ResizableWindow({ children }: PropsWithChildren) {
  return (
    <Resizable
      bounds={'parent'}
      defaultSize={{
        width: '500px',
        height: '100%',
      }}
      minWidth={'300px'}
      maxWidth={'100%'}
      enable={{
        left: false,
        right: true,
      }}
    >
      {children}
    </Resizable>
  );
}

function ProjectEditor() {
  const { files, selectedFile, setSelectedFile } = useEditor();
  const filenames = files.map(f => f.name);

  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const ParentComponent = useMemo(() => {
    if (isMobile) return Fragment;
    return ResizableWindow;
  }, [isMobile]);

  return (
    <div className="w-full max-w-screen">
      <Toolbar />
      <div className="flex flex-col md:flex-row ">
        <FileTree
          files={filenames}
          selectFile={setSelectedFile}
          selectedFile={selectedFile}
        />
        <div className="flex flex-col-reverse md:flex-row w-full overflow-hidden mr-1">
          <ParentComponent>
            <hr className="md:hidden" />
            <div className="w-full relative">
              <EditorWindow />
              <ConsoleWindow />
            </div>
          </ParentComponent>

          <PreviewWindow />
        </div>
      </div>
      <ProjectSettings />
    </div>
  );
}
