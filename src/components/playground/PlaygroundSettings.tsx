import { useEditor } from '@/hooks/useEditor';
import { Dialog } from '@headlessui/react';
import { EditorSettings } from '../ProjectEditor/ProjectSettings';

export function PlaygroundSettings() {
  const showSettings = useEditor(s => s.showSettings);
  const setShowSettings = useEditor(s => s.setShowSettings);

  return (
    <Dialog
      className={`modal ${showSettings ? 'modal-open' : ''}`}
      open={showSettings}
      onClose={() => setShowSettings(false)}
    >
      <Dialog.Overlay />
      <Dialog.Panel className={'modal-box'}>
        <EditorSettings />
      </Dialog.Panel>
    </Dialog>
  );
}
