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
  console.error(e.message)
}
`;

// Sets up WebAssembly to be run in the browser along with any JS code to be
// run after the WebAssembly is loaded
const runWasmCode = (js?: string, src?: string) =>
  !!src
    ? `
  var go = new Go();


  let wasm = null;

  WebAssembly.instantiateStreaming(fetch('${src}'), go.importObject).then(___result => {
    wasm = ___result.instance;
    go.run(wasm);
    ${runJS(js || '')}
  }).catch(e => {
    console.error(e)
  });
`
    : `
    console.warn('Running JS only. Click the "Run" button to compile and run your code.')
    ${runJS(js || '')}
    `;

export const iframeContent = ({
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
  nonce?: string;
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
        (() => {
          const __nonce = '${nonce}';
        })()
        ${consoleReassign}
        ${runWasmCode(js, wasmPath)}
      </script>
    </head>
    <body data-testid="preview-body">
      ${html}
    </body>
  </html>
`;
