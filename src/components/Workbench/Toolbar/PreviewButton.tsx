import { PlayIcon } from '@heroicons/react/24/solid';
import { ToolbarButton } from '.';
import { useWorkbench } from '..';

export function PreviewButton() {
  const save = useWorkbench(s => s.save);
  return (
    <ToolbarButton
      title="Save and Preview"
      icon={<PlayIcon className="h-5 w-5" />}
      onClick={save}
      className="btn-success"
    />
  );
}
