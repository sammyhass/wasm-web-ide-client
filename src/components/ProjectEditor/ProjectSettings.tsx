import { useProjects } from '@/hooks/api/useProjects';
import { useEditor } from '@/hooks/useEditor';
import { deleteProject, ProjectT } from '@/lib/api/services/projects';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { PropsWithChildren, useState } from 'react';
import shallow from 'zustand/shallow';

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
          <div className={'flex justify-between'}>
            <Dialog.Title as="h1" className={'text-2xl font-bold'}>
              Project Settings
            </Dialog.Title>

            <button
              className={'btn btn-ghost btn-xs btn-circle'}
              data-testid="close-settings"
              onClick={() => setShowSettings(false)}
            >
              <XCircleIcon className={'w-6 h-6'} />
            </button>
          </div>
          <hr className={'my-4'} />
          <SettingsSection>
            {projectId && <SettingsBody id={projectId} />}
          </SettingsSection>
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
}

function SettingsBody({ id }: Pick<ProjectT, 'id'>) {
  const { push } = useRouter();

  return (
    <div className={'flex flex-col gap-4'}>
      <h3 className={'text-xl font-bold'}>Danger Zone</h3>
      <DeleteProjectButton id={id} onSuccess={() => push('/projects')} />
    </div>
  );
}

function SettingsSection(props: PropsWithChildren) {
  return <div className="flex flex-col gap-4">{props.children}</div>;
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
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => deleteProject(id),
    onSuccess: () => {
      refetch();
      queryClient.removeQueries({
        queryKey: ['project', id],
      });

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

export default dynamic(() => Promise.resolve(ProjectSettings), {
  ssr: false,
});
