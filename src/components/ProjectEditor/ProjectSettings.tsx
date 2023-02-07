import { useProject } from '@/hooks/api/useProject';
import { useProjects } from '@/hooks/api/useProjects';
import { useEditor } from '@/hooks/useEditor';
import { ProjectT } from '@/lib/api/services/projects';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { PropsWithChildren, useCallback, useState } from 'react';
import shallow from 'zustand/shallow';
import { useDeleteProjectMutation } from '../../hooks/api/useDeleteProject';
import { useRenameProjectMutation } from '../../hooks/api/useRenameProject';

function ProjectSettings() {
  const { showSettings, setShowSettings, projectId } = useEditor(
    state => ({
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
        <Dialog.Panel className={'modal-box'}>
          <div className={'flex justify-between items-center'}>
            <Dialog.Title as="h1" className={'text-2xl font-bold'}>
              Project Settings
            </Dialog.Title>

            <button
              className={'btn btn-ghost btn-circle'}
              data-testid="close-settings"
              onClick={() => setShowSettings(false)}
            >
              <XCircleIcon className={'w-6 h-6'} />
            </button>
          </div>
          <hr className={'my-4'} />
          <SettingsBody id={projectId} />
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
}

function SettingsBody({ id }: Pick<ProjectT, 'id'>) {
  const { push } = useRouter();

  return (
    <div className={'flex flex-col gap-6'}>
      <SettingsSection title="Rename Project">
        <RenameProjectForm id={id} />
      </SettingsSection>
      <hr className={'my-4'} />
      <SettingsSection title="Danger Zone">
        <DeleteProjectButton id={id} onSuccess={() => push('/projects')} />
      </SettingsSection>
    </div>
  );
}

function SettingsSection(
  props: PropsWithChildren<{
    title: string;
  }>
) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xl font-bold">{props.title}</h3>
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
        className={'btn btn-error btn-md w-full'}
        onClick={() => {
          setShowConfirm(true);
        }}
      >
        Delete Project
      </button>
      {showConfirm && (
        <div className="alert rounded-md shadow-md items-end">
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
              className={'btn btn-error btn-md'}
              data-testid="confirm-delete-project-button"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className={'btn btn-info btn-md'}
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
  const { data: project } = useProject(id);

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
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          placeholder="Project Name"
          defaultValue={project?.name}
          value={name}
          onChange={e => setName(e.target.value)}
          data-testid="rename-project-input"
        />
      </div>

      <button
        className={`btn btn-primary btn-md ${isLoading ? 'loading' : ''}`}
        type="submit"
        data-testid="rename-project-button"
      >
        Save
      </button>
    </form>
  );
}

export default dynamic(() => Promise.resolve(ProjectSettings), {
  ssr: false,
});
