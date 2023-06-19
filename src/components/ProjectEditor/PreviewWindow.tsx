import { useProject } from "@/hooks/api/useProject";
import { useEditor } from "@/hooks/useEditor";
import { iframeContent } from "@/lib/previews";
import create from "zustand";

export const usePreviewWindow = create<{
  nonce: string;
  newNonce: () => void;
}>((s) => ({
  nonce: "",
  newNonce: () => s({ nonce: Math.random().toString(36) }),
}));

export default function PreviewWindow() {
  const id = useEditor((s) => s.projectId);

  const { data: project } = useProject(id);

  const previewNonce = usePreviewWindow((s) => s.nonce);

  const saveState = project?.files ?? [];

  const html = saveState
    .filter((f) => f.name === "index.html")
    .map((f) => f.content)
    .join("");

  const js = saveState
    .filter((f) => f.name.endsWith(".js"))
    .map((f) => f.content)
    .join("");

  const css = saveState
    .filter((f) => f.name.endsWith(".css"))
    .map((f) => f.content)
    .join("");

  const srcDoc = iframeContent({
    html,
    js,
    css,
    wasmPath: project?.wasm_path,
    nonce: previewNonce,
    useGo: project?.language === "Go",
  });

  return (
    <>
      <div className="block w-full min-w-[40px] bg-white" id="previewWindow">
        <iframe
          srcDoc={srcDoc}
          className="h-full w-full"
          title="Preview"
          data-testid="preview-window"
        />
      </div>
    </>
  );
}
