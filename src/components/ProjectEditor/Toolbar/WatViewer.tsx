import { Dialog } from "@headlessui/react";
import { EyeIcon } from "@heroicons/react/20/solid";
import Editor from "@monaco-editor/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ToolbarButton } from ".";
import { useProject } from "../../../hooks/api/useProject";
import { useEditor } from "../../../hooks/useEditor";
import { getProjectWatUrl } from "../../../lib/api/services/projects";
import WasmIcon from "../../icons/WasmIcon";

export default function WatViewerWrapper() {
  const projectId = useEditor((s) => s.projectId);
  const { data: project } = useProject(projectId);
  const [show, setShow] = useState(false);

  return projectId ? (
    <>
      <ToolbarButton
        disabled={!project?.wasm_path}
        tooltip={
          !project?.wasm_path
            ? "You must compile your project to WebAssembly before viewing the Text format"
            : undefined
        }
        onClick={() => setShow(true)}
        icon={<EyeIcon className="h-5 w-5" />}
        title="View WAT"
        data-testid="wat-viewer-button"
      />

      <Dialog
        as="div"
        className={`modal ${show ? "modal-open" : ""} `}
        onClose={() => setShow(false)}
        open={show}
      >
        <Dialog.Panel
          className={"modal-box relative max-w-4xl overflow-y-hidden"}
        >
          <Dialog.Title as="div" className={"mb-2 flex items-center gap-4"}>
            <WasmIcon className="h-8 w-8" />
            <h1 className="text-2xl font-bold">WAT Viewer</h1>
          </Dialog.Title>
          <Dialog.Description>
            This is the WebAssembly Text (WAT) of the WebAssembly for your
            project.
            <br />
            You can learn more about the WAT format with this article:{" "}
            <a
              href="https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format"
              target="_blank"
              rel="noreferrer noopener"
              className="link"
            >
              Understanding the text format on MDN
            </a>
            .
          </Dialog.Description>

          <hr className="my-4" />
          <WatViewer projectId={projectId} />
        </Dialog.Panel>
      </Dialog>
    </>
  ) : null;
}

function WatViewer({ projectId }: { projectId: string }) {
  const { data: url } = useQuery(["watUrl", projectId], () =>
    getProjectWatUrl(projectId)
  );

  const { data: wat, status } = useQuery<string>(
    ["wat", projectId],
    () => fetch(url as string).then((r) => r.text()),
    { enabled: !!url }
  );

  return (
    <div data-testid="wat-viewer">
      {status === "loading" && <div>Loading...</div>}
      {status === "success" && !!wat && (
        <Editor
          wrapperProps={{ "data-testid": "wat-viewer-editor" }}
          height={"calc(100vh - 300px)"}
          language="wat"
          value={wat}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
          }}
        />
      )}
    </div>
  );
}
