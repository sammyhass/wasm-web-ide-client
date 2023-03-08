import { useEditor } from '@/hooks/useEditor';
import { Dialog, Tab } from '@headlessui/react';
import { LinkIcon } from '@heroicons/react/24/solid';
import { Fragment } from 'react';
import {
  EditorSettings,
  SettingsSection,
} from '../ProjectEditor/ProjectSettings';
import DependencyManager from './DependencyManager';
import DownloadButton from './DownloadButton';
import LinkGenerator from './LinkGenerator';

const PLAYGROUND_SETTINGS_TABS = ['Editor', 'Sharing', 'Dependencies'];
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
        <Tab.Group>
          <div className="flex flex-col gap-6">
            <Tab.List className={'tabs tabs-boxed px-0'}>
              {PLAYGROUND_SETTINGS_TABS.map(tab => (
                <Tab as={Fragment} key={tab}>
                  {({ selected }) => (
                    <button
                      className={`tab tab-lg tab-rounded flex-1  ${
                        selected ? 'tab-active' : ''
                      }`}
                      data-testid={`settings-tab ${selected ? 'selected' : ''}`}
                    >
                      {tab}
                    </button>
                  )}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <EditorSettings />
              </Tab.Panel>
              <Tab.Panel>
                <PlaygroundSharingSettings />
              </Tab.Panel>
              <Tab.Panel>
                <SettingsSection
                  title="Dependency Manager"
                  description="Install/remove npm dependencies for use in this playground"
                >
                  <DependencyManager />
                </SettingsSection>
              </Tab.Panel>
            </Tab.Panels>
          </div>
        </Tab.Group>
      </Dialog.Panel>
    </Dialog>
  );
}

function PlaygroundSharingSettings() {
  return (
    <SettingsSection
      title="Sharing"
      description="Download your project to work on it locally, or copy a link to continue working in the playground."
    >
      <div>
        <h2 className="text-lg flex gap-2 items-center">
          Playground Link
          <LinkIcon className="w-5 h-5" />
        </h2>
        <LinkGenerator />
      </div>
      <DownloadButton />
    </SettingsSection>
  );
}
