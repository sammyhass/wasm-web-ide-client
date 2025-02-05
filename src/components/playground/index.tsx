import { useWindowDimensions } from "@/hooks/util/useDimensions";
import { FileT } from "@/lib/api/services/projects";
import { useMonacoAssemblyScriptSetup } from "@/lib/monaco/assemblyscript";
import { useContainer, useSetup } from "@/lib/webcontainers";
import { useDirListing } from "@/lib/webcontainers/files/dir";
import { useFileReader } from "@/lib/webcontainers/files/reader";
import { useDebouncedWriter } from "@/lib/webcontainers/files/writer";
import { findNode, isFileNode } from "@/lib/webcontainers/util";
import { useMonaco } from "@monaco-editor/react";
import { DirectoryNode, FileNode, FileSystemTree } from "@webcontainer/api";
import dynamic from "next/dynamic";
import { Fragment, useMemo } from "react";
import create from "zustand";
import { ResizableWindow } from "../ProjectEditor";
import ConsoleWindow, {
  useEditorConsole,
} from "../ProjectEditor/ConsoleWindow";
import ContextMenu from "./ContextMenu";
import FileSystemTreeViewer from "./FileSystemTreeViewer";
import PlaygroundPreview from "./PlaygroundPreview";
import PlaygroundSettings from "./PlaygroundSettings";
import PlaygroundToolbar from "./PlaygroundToolbar";

const LanguageIcon = dynamic(() => import("../icons/Icon"), {
  ssr: false,
});

const LoadingSpinner = dynamic(() => import("../icons/Spinner"), {
  ssr: false,
});

const FileEditor = dynamic(
  () => import("../ProjectEditor/EditorWindow").then((m) => m.FileEditor),
  {
    ssr: false,
  }
);

export const usePlaygroundEditor = create<{
  url: string;
  setUrl: (url: string) => void;

  selectedFile: string;
  setSelectedFile: (file: string) => void;

  contextMenu?: {
    path: string;
    node: DirectoryNode | FileNode;
    location: { top: number; left: number };
  };
  showContextMenu: (
    path: string,
    node: DirectoryNode | FileNode,
    location: { top: number; left: number }
  ) => void;
  hideContextMenu: () => void;
}>((set) => ({
  url: "/loading_preview.html",
  setUrl: (url) => set({ url }),

  selectedFile: "",
  setSelectedFile: (file) => set({ selectedFile: file }),

  contextMenu: undefined,
  showContextMenu: (path, node, location) =>
    set({ contextMenu: { path, node, location } }),
  hideContextMenu: () => set({ contextMenu: undefined }),
}));

export default function PlaygroundEditor({ mount }: { mount: FileSystemTree }) {
  const url = usePlaygroundEditor((s) => s.url);
  const setUrl = usePlaygroundEditor((s) => s.setUrl);
  const selectedFile = usePlaygroundEditor((s) => s.selectedFile);
  const setSelectedFile = usePlaygroundEditor((s) => s.setSelectedFile);

  const showContextMenu = usePlaygroundEditor((s) => s.showContextMenu);
  const contextMenuPath = usePlaygroundEditor((s) => s.contextMenu);
  const hideContextMenu = usePlaygroundEditor((s) => s.hideContextMenu);

  const { write, isLoading: writeLoading } = useDebouncedWriter(
    selectedFile,
    500
  );
  const { data: currentFileContent } = useFileReader(selectedFile);

  const pushMessage = useEditorConsole((s) => s.push);

  const { mutate } = useSetup((c) => pushMessage("log", c));

  const { isLoading: containerLoading } = useContainer({
    onSuccess: (c) => {
      const firstFile = findNode(mount, (path, node) => {
        if (isFileNode(node)) {
          return true;
        }
        return false;
      });

      if (firstFile) {
        setSelectedFile(firstFile.path);
      }

      mutate(mount);

      c?.on("server-ready", (_port, url) => {
        setUrl(url);
      });
    },
  });

  const currentFileLanguage = useMemo<FileT["language"]>(() => {
    const ext = selectedFile.split(".").pop();
    return ext as FileT["language"];
  }, [selectedFile]);

  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const ParentComponent = useMemo(() => {
    if (isMobile) return Fragment;
    return ResizableWindow;
  }, [isMobile]);

  const monaco = useMonaco();

  useMonacoAssemblyScriptSetup(monaco ?? undefined);

  const { data: tree } = useDirListing();

  return (
    <>
      <PlaygroundToolbar />
      <div className="flex h-full flex-col md:flex-row">
        <FileSystemTreeViewer
          tree={tree ?? {}}
          onContextMenu={(path, node, e) =>
            showContextMenu(path, node, {
              top: e.clientY,
              left: e.clientX,
            })
          }
          selectedPath={selectedFile}
          onSelect={(path) => {
            writeLoading ? undefined : setSelectedFile(path);
          }}
        />
        <div className="mr-1 flex w-full flex-col-reverse md:flex-row">
          <ParentComponent>
            <div className="relative h-full w-full" data-testid="editor-window">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 p-2">
                  <LanguageIcon language={currentFileLanguage} />
                  <b data-testid="selected-file">{selectedFile}</b>
                </div>
                {(writeLoading || containerLoading) && (
                  <div
                    className="flex items-center gap-2 p-2"
                    data-testid="loading-indicator"
                  >
                    Loading...
                    <LoadingSpinner />
                  </div>
                )}
              </div>

              <FileEditor
                content={currentFileContent || ""}
                language={currentFileLanguage}
                onChange={write}
                name={selectedFile}
                projectId={"playground"}
              />
              <ConsoleWindow />
            </div>
          </ParentComponent>
          <PlaygroundPreview url={url} />
        </div>
      </div>
      <PlaygroundSettings />
      {contextMenuPath && (
        <ContextMenu
          {...contextMenuPath.location}
          path={contextMenuPath.path}
          node={contextMenuPath.node}
          hide={hideContextMenu}
        />
      )}
    </>
  );
}
