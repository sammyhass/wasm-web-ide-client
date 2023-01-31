import { useProject } from '@/hooks/api/useProject';
import { useEditor } from '@/hooks/useEditor';
import { iframeContent } from '@/lib/previews';
import { faker } from '@faker-js/faker';
import create from 'zustand';

export const usePreviewWindow = create<{
  nonce: string;
  newNonce: () => void;
  useWasm: boolean;
  enableWasm: (enable: boolean) => void;
}>(s => ({
  nonce: '',
  newNonce: () => s({ nonce: faker.random.alphaNumeric(16) }),
  useWasm: false,
  enableWasm: (enable: boolean) => s({ useWasm: enable }),
}));

export default function PreviewWindow() {
  const id = useEditor(s => s.projectId);

  const { data: project } = useProject(id);

  const previewNonce = usePreviewWindow(s => s.nonce);
  const useWasm = usePreviewWindow(s => s.useWasm);

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
    wasmPath: useWasm ? project?.wasm_path : undefined,
    nonce: previewNonce,
  });

  return (
    <>
      <div
        className="bg-white flex-1 max-w-4xl min-w-[250px]"
        id="previewWindow"
      >
        <iframe
          srcDoc={srcDoc}
          className="w-full h-full"
          title="Preview"
          data-testid="preview-window"
        />
      </div>
    </>
  );
}
