import { useEditor } from "@/hooks/useEditor";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { ToolbarButton } from ".";

export default function SettingsButton() {
  const setShowSettings = useEditor((s) => s.setShowSettings);

  return (
    <ToolbarButton
      data-testid="project-settings-button"
      icon={<Cog6ToothIcon className="h-5 w-5 text-base-content" />}
      title="Settings"
      onClick={() => setShowSettings(true)}
    />
  );
}
