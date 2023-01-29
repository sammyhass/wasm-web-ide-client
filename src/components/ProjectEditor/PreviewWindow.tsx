import { useProject } from '@/hooks/api/useProject';
import { useEditor } from '@/hooks/useEditor';
import { iframeContent } from '@/lib/previews';

export default function PreviewWindow() {
  const id = useEditor(s => s.projectId);

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
    wasmPath: project?.wasm_path,
  });

  return (
    <>
      <div
        className="bg-white flex-1 max-w-4xl min-w-[250px]"
        id="previewWindow"
      >
        <iframe srcDoc={srcDoc} className="w-full h-full" title="Preview" />
      </div>
    </>
  );
}
