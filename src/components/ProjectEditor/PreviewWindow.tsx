import { runWasmCode } from '@/lib/wasm';
import { useEditor } from '../ProjectEditor';

const consoleReassign = `
  const postMessageToParent = (type, data) => {
    window.parent.postMessage({ type, data }, '*');
  };

  ${['log', 'error', 'warn', 'info', 'debug']
    .map(
      method => `
        console.${method} = (args) => {
          postMessageToParent('console', ['${method}', args]);
        };
      `
    )
    .join('')}
`;

const iframeContent = ({
  html,
  css,
  js,
  wasmPath,
  nonce,
}: {
  html: string;
  css?: string;
  js?: string;
  wasmPath?: string;
  nonce?: string; // useful for rerendering when no changes are made
}) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        ${css}
      </style>
      <script src="/wasm_exec_tiny.js"></script>
      <script defer type="module">
        ${consoleReassign}
        ${runWasmCode(wasmPath)}
        ${js}
      </script>
    </head>
    <body>
      ${html}

      <script nonce="${nonce}">
    </body>
  </html>
`;

export default function PreviewWindow() {
  const saveState = useEditor(s => s.lastSaved);
  const wasmPath = useEditor(s => s.wasmPath);

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

  const nonce = Math.random().toString(26);

  const srcDoc = iframeContent({
    html,
    js,
    css,
    wasmPath,
    nonce,
  });

  return (
    <>
      <div className="bg-white flex-1 max-w-4xl min-w-[350px]">
        <iframe srcDoc={srcDoc} className="w-full h-full" title="Preview" />
      </div>
    </>
  );
}
