import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { ToolbarButton } from '.';
import { useEditor } from '..';

export default function SettingsButton() {
  const setShowSettings = useEditor(s => s.setShowSettings);
  return (
    <ToolbarButton
      icon={<Cog6ToothIcon className="w-5 h-5" />}
      onClick={() => setShowSettings(true)}
      title="Settings"
    ></ToolbarButton>
  );
}
