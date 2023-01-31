const consoleReassign = `
const postMessageToParent = (type, data) => {
  window.parent.postMessage({ type, data }, '*');
};

${['log', 'error', 'warn', 'info', 'debug']
  .map(
    method => `
      console.${method} = (...args) => {
        postMessageToParent('console', ['${method}', '[JS]', args]);
      };
    `
  )
  .join('')}
`;

const runJS = (js: string) => `
try {
  ${js}
} catch (e) {
  console.error(e);
}
`;

const FAILED_FETCH = `Failed to fetch WebAssembly file. Running JS only instead. To fix this, try recompiling your project.`;

// Sets up WebAssembly to be run in the browser along with any JS code to be
// run after the WebAssembly is loaded
const runWasmCode = (js?: string, src?: string) =>
  !!src
    ? `
  var go = new Go();

  let wasm = null;

  WebAssembly.instantiateStreaming(fetch('${src}').then(response => {
    if (!response.ok) {
      console.warn('${FAILED_FETCH}');
      ${runJS(js || '')}
    }
    return response.arrayBuffer();
  }), go.importObject).then(___result => {
    wasm = ___result.instance;
    go.run(wasm);
    ${runJS(js || '')}
  }).catch(e => {
    console.error(e);
  });
`
    : `
    console.warn('${FAILED_FETCH}');
    ${runJS(js || '')}
    `;

export const iframeContent = ({
  html,
  css,
  js,
  wasmPath,
}: {
  html: string;
  css?: string;
  js?: string;
  wasmPath?: string;
}) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">

      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style data-testid="preview-css">
        ${css}
      </style>
      <script src="/wasm_exec_tiny.js"></script>
      <script type="module" defer data-testid="preview-script">
        ${consoleReassign}
        ${runWasmCode(js, wasmPath)}
      </script>
    </head>
    <body data-testid="preview-body">
      ${html}
    </body>
  </html>
`;
