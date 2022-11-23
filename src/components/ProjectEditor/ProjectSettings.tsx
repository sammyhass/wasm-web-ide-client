import { Dialog, Transition } from '@headlessui/react';
import dynamic from 'next/dynamic';
import shallow from 'zustand/shallow';
import { useEditor } from '.';

function ProjectSettings() {
  const { showSettings, setShowSettings, project } = useEditor(
    state => ({
      showSettings: state.showSettings,
      setShowSettings: state.setShowSettings,
      project: state.project,
    }),
    shallow
  );

  return (
    <Transition show={showSettings}>
      <Dialog
        as="div"
        className={`modal modal-open`}
        onClose={() => setShowSettings(false)}
      >
        <Dialog.Panel className={'modal-box'}>
          <Dialog.Title as="h1" className={'text-2xl font-bold'}>
            {' '}
            Project Settings - {project?.name}
          </Dialog.Title>
          <Dialog.Description>Project ID: {project?.id}</Dialog.Description>
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
}

export default dynamic(() => Promise.resolve(ProjectSettings), {
  ssr: false,
});
