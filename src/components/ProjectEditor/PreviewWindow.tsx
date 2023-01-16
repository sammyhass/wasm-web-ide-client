import { iframeContent } from '@/lib/previews';

import { useProject } from '@/hooks/api/useProject';
import { useEditor } from '@/hooks/useEditor';

export default function PreviewWindow() {
  const id = useEditor(s => s.project?.id);

  const wasmPath = useEditor(s => s.wasmPath);

  const { data: project } = useProject(id);

  const saveState = project?.files ?? [];

  const html = saveState
    .filter(f => f.name === 'index.html')
    .map(f => f.content)
    .join('');

  const js = saveState
    .filter(f => f.name.endsWith('.js'))
    .map(f => f.content)
    .join('');

  const css = saveState
    .filter(f => f.name.endsWith('.css'))
    .map(f => f.content)
    .join('');

  const srcDoc = iframeContent({
    html,
    js,
    css,
    wasmPath,
  });

  return (
    <>
      <div className="bg-white flex-1 max-w-4xl min-w-[250px]">
        <iframe srcDoc={srcDoc} className="w-full h-full" title="Preview" />
      </div>
    </>
  );
}
