import { useProject } from "@/hooks/api/useProject";
import { useProjects } from "@/hooks/api/useProjects";
import { useProjectSharing } from "@/hooks/api/useToggleShareProject";
import { useEditor } from "@/hooks/useEditor";
import { useEditorSettings } from "@/hooks/useEditorSettings";
import { ProjectT } from "@/lib/api/services/projects";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Fragment,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import shallow from "zustand/shallow";
import { useDeleteProjectMutation } from "../../hooks/api/useDeleteProject";
import { useRenameProjectMutation } from "../../hooks/api/useRenameProject";
import { Alert } from "../Toast";
import LoadingSpinner from "../icons/Spinner";

function ProjectSettings() {
  const { showSettings, setShowSettings, projectId } = useEditor(
    (state) => ({
      showSettings: state.showSettings,
      setShowSettings: state.setShowSettings,
      projectId: state.projectId,
    }),
    shallow
  );

  return (
    <Transition show={showSettings}>
      <Dialog
        as="div"
        data-testid="project-settings"
        className={`modal modal-open `}
        onClose={() => setShowSettings(false)}
      >
        <Dialog.Panel className={"modal-box"}>
          <div className={"flex items-center justify-between"}>
            <Dialog.Title as="h1" className={"text-2xl font-bold"}>
              Project Settings
            </Dialog.Title>

            <button
              className={"btn btn-ghost btn-circle"}
              data-testid="close-settings"
              onClick={() => setShowSettings(false)}
            >
              <XCircleIcon className={"h-6 w-6"} />
            </button>
          </div>
          <hr className={"my-4"} />
          <SettingsBody id={projectId} />
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
}

export const SETTINGS_TABS = [
  "General",
  "Sharing",
  "Editor",
  "Danger Zone",
] as const;
function SettingsBody({ id }: Pick<ProjectT, "id">) {
  const { push } = useRouter();

  return (
    <div className={"flex flex-col gap-6"}>
      <Tab.Group>
        <Tab.List
          data-testid="settings-tabs"
          className={"tabs tabs-boxed justify-between px-0"}
        >
          {SETTINGS_TABS.map((tab) => (
            <Tab as={Fragment} key={tab}>
              {({ selected }) => (
                <button
                  className={`tab-rounded tab tab-lg  ${
                    selected ? "tab-active" : ""
                  }`}
                  data-testid={`settings-tab ${selected ? "selected" : ""}`}
                >
                  {tab}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <SettingsSection title="General">
              <RenameProjectForm id={id} />
            </SettingsSection>
          </Tab.Panel>
          <Tab.Panel>
            <ShareProjectToggleSection id={id} />
          </Tab.Panel>
          <Tab.Panel>
            <EditorSettings />
          </Tab.Panel>

          <Tab.Panel>
            <SettingsSection title="Danger Zone">
              <DeleteProjectButton
                id={id}
                onSuccess={() => push("/projects")}
              />
            </SettingsSection>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export function SettingsSection(
  props: PropsWithChildren<{
    title: string;
    description?: string;
  }>
) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xl font-bold">{props.title}</h3>
      {props.description && (
        <p className={"text-sm text-gray-500"}>{props.description}</p>
      )}
      <hr className={"my-4"} />
      {props.children}
    </div>
  );
}

function DeleteProjectButton({
  id,
  onSuccess,
}: {
  id: string;
  onSuccess?: () => void;
}) {
  const { refetch } = useProjects();
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate } = useDeleteProjectMutation(id, {
    onSuccess: () => {
      refetch();
      onSuccess?.();
    },
  });

  return (
    <>
      <button
        data-testid="delete-project-button"
        className={"btn btn-error btn-md w-full"}
        onClick={() => {
          setShowConfirm(true);
        }}
      >
        Delete Project
      </button>
      {showConfirm && (
        <div className="alert items-end rounded-md shadow-md">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold">
              Are you sure you want to delete this project?
            </h3>
            <p>
              This action cannot be undone. All data will be permanently
              deleted.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => mutate()}
              className={"btn btn-error btn-md"}
              data-testid="confirm-delete-project-button"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className={"btn btn-info btn-md"}
            >
              No
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function RenameProjectForm({ id }: { id: string }) {
  const { data: project } = useProject(id, {
    enabled: false,
  });

  const [name, setName] = useState<string | undefined>(undefined);

  const { mutate, isLoading } = useRenameProjectMutation(id);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (name) {
        mutate({ name });
      }

      setName(undefined);
    },
    [mutate, name]
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Project Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          placeholder="Project Name"
          defaultValue={project?.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid="rename-project-input"
        />
      </div>

      <button
        className={`btn btn-primary btn-md ${isLoading ? "loading" : ""}`}
        type="submit"
        data-testid="rename-project-button"
      >
        Save
      </button>
    </form>
  );
}

function ShareProjectToggleSection({ id }: { id: string }) {
  const { isLoading, mutate, error, reset } = useProjectSharing(id);

  const { data: project } = useProject(id);

  const shareCode = project?.share_code;

  const forkUri = useMemo(() => `/projects/fork/${shareCode}`, [shareCode]);

  const forkUrl = useMemo(() => {
    return `${window.location.origin}${forkUri}`;
  }, [forkUri]);

  return (
    <SettingsSection
      title={"Project Sharing"}
      description="Sharing your project allows anyone to fork it and build on it."
    >
      <div className="relative flex flex-col gap-2">
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
          <button
            className={`transitions-colors alert relative
            items-stretch text-left hover:bg-base-300 active:bg-base-300
           ${isLoading ? "disabled opacity-50" : ""}`}
            disabled={isLoading}
            onClick={() => mutate(!shareCode)}
            data-testid="share-project-button"
          >
            <span className="label-text flex flex-col">
              Sharing : {shareCode ? "Enabled" : "Disabled"}
            </span>
            <input
              type="checkbox"
              className="toggle toggle-secondary"
              disabled={isLoading}
              checked={!!shareCode}
              readOnly
            />
          </button>
          {error && (
            <Alert
              type="error"
              onHide={reset}
              message={"Something went wrong. Please try again later."}
              id="share-project-error"
            />
          )}
          {shareCode && (
            <p className="p-1 text-center text-sm text-gray-500">
              Anyone with the link can create a fork of your project.
              <br />
              <Link href={forkUri} className="link">
                {forkUrl}
              </Link>
            </p>
          )}
        </>
      </div>
    </SettingsSection>
  );
}

export function EditorSettings() {
  const {
    theme,
    fontSize,
    minimapEnabled,
    wordWrap,
    setTheme,
    setFontSize,
    setMinimapEnabled,
    reset,
    setWordWrap,
  } = useEditorSettings(
    (s) => ({
      theme: s.theme,
      fontSize: s.fontSize,
      minimapEnabled: s.minimapEnabled,
      wordWrap: s.wordWrap,
      setTheme: s.setTheme,
      setFontSize: s.setFontSize,
      setMinimapEnabled: s.setMinimap,
      setWordWrap: s.setWordWrap,
      reset: s.reset,
    }),
    shallow
  );

  return (
    <SettingsSection
      title="Editor Settings"
      description="Customize the look and feel of the editor."
    >
      <div className="flex flex-col gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Theme</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            data-testid="editor-theme-select"
          >
            <option value="vs-light">Light</option>
            <option value="vs-dark">Dark</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Font Size</span>
          </label>
          <div className="flex items-center justify-between gap-2">
            <input
              type="range"
              min="10"
              max="30"
              value={fontSize}
              className="range range-primary"
              onChange={(e) => setFontSize(e.target.valueAsNumber)}
            />
            <b>{fontSize}px</b>
          </div>
        </div>
        <button
          className="form-control flex-row items-center justify-between"
          onClick={() => {
            setMinimapEnabled(!minimapEnabled);
          }}
        >
          <label className="label">
            <span className="label-text">
              Minimap: {minimapEnabled ? "Enabled" : "Disabled"}
            </span>
          </label>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={minimapEnabled}
            readOnly
          />
        </button>
        <button
          className="form-control cursor-pointer flex-row items-center justify-between"
          onClick={() => {
            setWordWrap(wordWrap === "on" ? "off" : "on");
          }}
        >
          <label className="label">
            <span className="label-text">
              Word Wrap: {wordWrap == "on" ? "Enabled" : "Disabled"}
            </span>
          </label>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={wordWrap === "on"}
            onChange={(e) => setWordWrap(e.target.checked ? "on" : "off")}
          />
        </button>
        <div className="form-control">
          <button
            className="btn btn-primary btn-md"
            onClick={reset}
            data-testid="reset-editor-settings-button"
          >
            Reset Editor Settings
          </button>
        </div>
      </div>
    </SettingsSection>
  );
}
export default dynamic(() => Promise.resolve(ProjectSettings), {
  ssr: false,
});
